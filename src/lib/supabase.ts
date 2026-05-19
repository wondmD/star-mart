import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { env } from './env';

declare global {
  // Cached browser client to avoid duplicate instances during HMR/dev.
  // eslint-disable-next-line no-var
  var __supabase_client: SupabaseClient | undefined;
}


export function getBrowserSupabaseClient(): SupabaseClient {
  if (typeof window === 'undefined') {
    throw new Error('getBrowserSupabaseClient must be called from the browser');
  }

  if (!globalThis.__supabase_client) {
    globalThis.__supabase_client = createClient(
      env.NEXT_PUBLIC_SUPABASE_URL,
      env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        // Keep sessions in local storage; App Router client components will pick this up.
        auth: { persistSession: true, detectSessionInUrl: true },
      }
    );
  }

  return globalThis.__supabase_client;
}


export function createServerSupabaseClient(serviceRoleKey?: string): SupabaseClient {
  const key = serviceRoleKey ?? env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) {
    throw new Error('Server Supabase client requires SUPABASE_SERVICE_ROLE_KEY in environment');
  }

  // Create a per-request client on the server to avoid cross-request caching.
  return createClient(env.NEXT_PUBLIC_SUPABASE_URL, key, {
    auth: { persistSession: false },
  });
}

export type { SupabaseClient };
