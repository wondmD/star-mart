import { createClient, SupabaseClient } from '@supabase/supabase-js';

import { createSupabaseAdminClient } from '@/lib/supabase-admin';
import { getSupabaseAnonKey, getSupabaseUrl, hasSupabaseConfig } from '@/lib/supabase-config';
import { User } from '@/types';

function isMissingColumnError(message: string, columnName: string): boolean {
  return message.includes(`Could not find the '${columnName}' column`);
}

function isDuplicateKeyError(error: { code?: string; message?: string }): boolean {
  return error.code === '23505' || Boolean(error.message?.toLowerCase().includes('duplicate'));
}

function parseIsAdmin(value: unknown): boolean {
  if (value === true || value === 1) {
    return true;
  }

  if (value === false || value === 0 || value === null || value === undefined) {
    return false;
  }

  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase();
    return normalized === 'true' || normalized === '1' || normalized === 't' || normalized === 'yes';
  }

  return false;
}

function getConfiguredAdminEmails(): Set<string> {
  const raw = process.env.ADMIN_EMAILS?.trim();
  if (!raw) {
    return new Set();
  }

  return new Set(
    raw
      .split(',')
      .map((email) => email.trim().toLowerCase())
      .filter(Boolean),
  );
}

function applyConfiguredAdminOverride(user: User): User {
  const adminEmails = getConfiguredAdminEmails();
  const normalizedEmail = user.email.trim().toLowerCase();

  if (!adminEmails.has(normalizedEmail)) {
    return user;
  }

  return {
    ...user,
    is_admin: true,
  };
}

function normalizeSupabaseProfileRow(row: Record<string, unknown>): User {
  const user: User = {
    id: String(row.id ?? ''),
    email: String(row.email ?? ''),
    full_name: String(row.full_name ?? 'User'),
    phone: typeof row.phone === 'string' ? row.phone : undefined,
    avatar_url: typeof row.avatar_url === 'string' ? row.avatar_url : undefined,
    is_admin: parseIsAdmin(row.is_admin),
    created_at: String(row.created_at ?? new Date().toISOString()),
  };

  return applyConfiguredAdminOverride(user);
}

/** Prefer service role so RLS cannot hide is_admin or block profile reads. */
export function getUsersTableClient(fallback?: SupabaseClient): SupabaseClient {
  return createSupabaseAdminClient() ?? fallback ?? createRouteHandlerSupabaseClient();
}

export function createRouteHandlerSupabaseClient(): SupabaseClient {
  if (!hasSupabaseConfig()) {
    throw new Error('Supabase is not configured');
  }

  return createClient(getSupabaseUrl(), getSupabaseAnonKey(), {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export async function getSupabaseUserFromToken(token: string) {
  const supabase = createRouteHandlerSupabaseClient();
  const { data, error } = await supabase.auth.getUser(token);

  if (error || !data.user) {
    return null;
  }

  return data.user;
}

export async function fetchSupabaseProfileById(
  authUserId: string,
  fallback?: SupabaseClient,
): Promise<User | null> {
  const db = getUsersTableClient(fallback);
  const { data, error } = await db.from('users').select('*').eq('id', authUserId).maybeSingle();

  if (error) {
    console.error('fetchSupabaseProfileById:', error.message);
    return null;
  }

  if (!data) {
    return null;
  }

  return normalizeSupabaseProfileRow(data as Record<string, unknown>);
}

async function fetchSupabaseProfileByEmail(
  email: string,
  fallback?: SupabaseClient,
): Promise<User | null> {
  const adminClient = createSupabaseAdminClient();
  if (!adminClient) {
    return null;
  }

  const normalizedEmail = email.trim().toLowerCase();
  const { data, error } = await adminClient
    .from('users')
    .select('*')
    .eq('email', normalizedEmail)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return normalizeSupabaseProfileRow(data as Record<string, unknown>);
}

export async function getOrCreateSupabaseProfile(
  supabase: SupabaseClient,
  authUser: {
    id: string;
    email?: string;
    created_at?: string;
    user_metadata?: { full_name?: string };
  },
  fullName?: string,
): Promise<User> {
  const db = getUsersTableClient(supabase);
  const resolvedName =
    fullName?.trim() ||
    authUser.user_metadata?.full_name?.trim() ||
    'User';
  const normalizedEmail = authUser.email?.trim().toLowerCase() ?? '';

  const existingProfile = await fetchSupabaseProfileById(authUser.id, db);
  if (existingProfile) {
    if (!existingProfile.is_admin && normalizedEmail) {
      const profileByEmail = await fetchSupabaseProfileByEmail(normalizedEmail, db);
      if (profileByEmail?.is_admin) {
        const { data: syncedProfile, error: syncError } = await db
          .from('users')
          .update({ is_admin: true })
          .eq('id', authUser.id)
          .select()
          .single();

        if (!syncError && syncedProfile) {
          return normalizeSupabaseProfileRow(syncedProfile as Record<string, unknown>);
        }

        return { ...existingProfile, is_admin: true };
      }
    }

    return existingProfile;
  }

  let inheritedAdmin = false;
  if (normalizedEmail) {
    const profileByEmail = await fetchSupabaseProfileByEmail(normalizedEmail, db);
    inheritedAdmin = Boolean(profileByEmail?.is_admin);
  }

  const profilePayload: Record<string, unknown> = {
    id: authUser.id,
    email: normalizedEmail || authUser.email || '',
    full_name: resolvedName,
    is_admin: inheritedAdmin,
  };

  const insertProfile = async (payload: Record<string, unknown>) =>
    db.from('users').insert([payload]).select().single();

  let { data: createdProfile, error: insertError } = await insertProfile(profilePayload);

  if (insertError && isMissingColumnError(insertError.message, 'is_admin')) {
    const fallbackPayload = { ...profilePayload };
    delete fallbackPayload.is_admin;
    ({ data: createdProfile, error: insertError } = await insertProfile(fallbackPayload));
  }

  if (insertError && isDuplicateKeyError(insertError)) {
    const refetched = await fetchSupabaseProfileById(authUser.id, db);
    if (refetched) {
      return refetched;
    }
  }

  if (!insertError && createdProfile) {
    return normalizeSupabaseProfileRow(createdProfile as Record<string, unknown>);
  }

  if (insertError) {
    console.error('getOrCreateSupabaseProfile insert failed:', insertError.message);
  }

  const refetchedAfterFailure = await fetchSupabaseProfileById(authUser.id, db);
  if (refetchedAfterFailure) {
    return refetchedAfterFailure;
  }

  return applyConfiguredAdminOverride({
    id: authUser.id,
    email: authUser.email ?? '',
    full_name: resolvedName,
    is_admin: inheritedAdmin,
    created_at: authUser.created_at ?? new Date().toISOString(),
  });
}
