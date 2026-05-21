import { createClient, SupabaseClient } from '@supabase/supabase-js';

import { getSupabaseAnonKey, getSupabaseUrl, hasSupabaseConfig } from '@/lib/supabase-config';
import { User } from '@/types';

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
    return existingProfile as User;
  }

  const profilePayload = {
    id: authUser.id,
    email: authUser.email ?? '',
    full_name: resolvedName,
  };

  const { data: createdProfile, error: insertError } = await supabase
    .from('users')
    .insert([profilePayload])
    .select()
    .single();

  if (!insertError && createdProfile) {
    return createdProfile as User;
  }

  return {
    id: authUser.id,
    email: authUser.email ?? '',
    full_name: profilePayload.full_name,
    created_at: authUser.created_at ?? new Date().toISOString(),
  };
}
