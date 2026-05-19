// Lightweight environment validation and typed exports
// Keep this minimal to avoid extra dependencies while ensuring required vars exist.

function requiredEnv(key: string): string {
  const val = process.env[key];
  if (!val) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return val;
}

export const NEXT_PUBLIC_SUPABASE_URL = requiredEnv('NEXT_PUBLIC_SUPABASE_URL');
export const NEXT_PUBLIC_SUPABASE_ANON_KEY = requiredEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY');

// Optional server-only key (do NOT expose to the browser)
export const SUPABASE_SERVICE_ROLE_KEY = process.env['SUPABASE_SERVICE_ROLE_KEY'] ?? '';

export const env = {
  NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY,
  SUPABASE_SERVICE_ROLE_KEY,
} as const;

export type Env = typeof env;
