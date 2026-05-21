import { hasSupabaseConfig } from '@/lib/supabase-config';

/**
 * Local file auth is opt-in only (USE_LOCAL_AUTH=true).
 * By default StarMart uses Supabase when URL and anon key are set.
 */
export function isLocalAuthForced(): boolean {
  return process.env.USE_LOCAL_AUTH === 'true';
}

export function useSupabaseAuth(): boolean {
  return hasSupabaseConfig() && !isLocalAuthForced();
}

export function requireSupabaseAuth(): void {
  if (!hasSupabaseConfig()) {
    throw new Error(
      'Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local',
    );
  }
  if (isLocalAuthForced()) {
    throw new Error(
      'Supabase auth is disabled because USE_LOCAL_AUTH=true. Remove it to use Supabase authentication.',
    );
  }
}

export function getAuthMode(): 'local' | 'supabase' {
  return useSupabaseAuth() ? 'supabase' : 'local';
}
