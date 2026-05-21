import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { getSupabaseAnonKey, getSupabaseUrl, hasSupabaseConfig } from './supabase-config';
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

  if (!hasSupabaseConfig()) {
    throw new Error('Supabase is not configured');
  }

  const url = getSupabaseUrl();
  const anonKey = getSupabaseAnonKey();

  if (!url || !anonKey) {
    throw new Error('Supabase URL and anon key are required');
  }

  if (!globalThis.__supabase_client) {
    globalThis.__supabase_client = createClient(url, anonKey, {
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
  const url = getSupabaseUrl();
  if (!url) {
    throw new Error('Supabase URL is required');
  }

  return createClient(url, key, {
    auth: { persistSession: false },
  });
}

export type { SupabaseClient };
