import { createClient, SupabaseClient } from '@supabase/supabase-js';

import { getSupabaseAnonKey, getSupabaseUrl, hasSupabaseConfig } from '@/lib/supabase-config';
import { User } from '@/types';

function isMissingColumnError(message: string, columnName: string): boolean {
  return message.includes(`Could not find the '${columnName}' column`);
}

function normalizeSupabaseProfileRow(row: Record<string, unknown>): User {
  return {
    id: String(row.id ?? ''),
    email: String(row.email ?? ''),
    full_name: String(row.full_name ?? 'User'),
    phone: typeof row.phone === 'string' ? row.phone : undefined,
    avatar_url: typeof row.avatar_url === 'string' ? row.avatar_url : undefined,
    is_admin: Boolean(row.is_admin ?? false),
    created_at: String(row.created_at ?? new Date().toISOString()),
  };
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
  const resolvedName =
    fullName?.trim() ||
    authUser.user_metadata?.full_name?.trim() ||
    'User';
  const { data: existingProfile } = await supabase
    .from('users')
    .select()
    .eq('id', authUser.id)
    .maybeSingle();

  if (existingProfile) {
    return normalizeSupabaseProfileRow(existingProfile as Record<string, unknown>);
  }

  const profilePayload: Record<string, unknown> = {
    id: authUser.id,
    email: authUser.email ?? '',
    full_name: resolvedName,
    is_admin: false,
  };

  const insertProfile = async (payload: Record<string, unknown>) =>
    supabase.from('users').insert([payload]).select().single();

  let { data: createdProfile, error: insertError } = await insertProfile(profilePayload);

  if (insertError && isMissingColumnError(insertError.message, 'is_admin')) {
    const fallbackPayload = { ...profilePayload };
    delete fallbackPayload.is_admin;
    ({ data: createdProfile, error: insertError } = await insertProfile(fallbackPayload));
  }

  if (!insertError && createdProfile) {
    return normalizeSupabaseProfileRow(createdProfile as Record<string, unknown>);
  }

  return {
    id: authUser.id,
    email: authUser.email ?? '',
    full_name: resolvedName,
    is_admin: false,
    created_at: authUser.created_at ?? new Date().toISOString(),
  };
}
