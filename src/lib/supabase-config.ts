/**
 * Public Supabase env vars must use static process.env access so Next.js
 * inlines them into the client bundle. Dynamic lookups (process.env[key])
 * are empty in the browser and break createClient().
 */
export function getSupabaseUrl(): string {
  return process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ?? '';
}

export function getSupabaseAnonKey(): string {
  return process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() ?? '';
}

export function hasSupabaseConfig(): boolean {
  return Boolean(getSupabaseUrl() && getSupabaseAnonKey());
}
