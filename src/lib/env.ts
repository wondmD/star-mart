// Lightweight environment validation and typed accessors.
// Values are resolved lazily so importing modules does not crash the app.

function requiredEnv(key: string): string {
  const value = process.env[key];
  // During client-side runtime `process.env` may not contain values the same way.
  // Only enforce presence on the server to avoid client-side build/runtime crashes.
  if (typeof window === 'undefined') {
    if (!value) {
      throw new Error(`Missing required environment variable: ${key}`);
    }
    return value;
  }

  return value ?? '';
}

function optionalEnv(key: string, defaultValue = ''): string {
  return process.env[key] ?? defaultValue;
}

export const env = {
  get NEXT_PUBLIC_SUPABASE_URL() {
    return process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ?? '';
  },
  get NEXT_PUBLIC_SUPABASE_ANON_KEY() {
    return process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() ?? '';
  },
  // Optional server-only key (do NOT expose to the browser)
  get SUPABASE_SERVICE_ROLE_KEY() {
    return optionalEnv('SUPABASE_SERVICE_ROLE_KEY');
  },
  // StarPay Configuration
  get NEXT_PUBLIC_STARPAY_API_KEY() {
    return optionalEnv('NEXT_PUBLIC_STARPAY_API_KEY');
  },
  get STARPAY_SECRET_KEY() {
    return optionalEnv('STARPAY_SECRET_KEY');
  },
  get STARPAY_API_BASE_URL() {
    return optionalEnv(
      'STARPAY_API_BASE_URL',
      'https://starpayqa.starpayethiopia.com/v1/starpay-api/trdp',
    );
  },
  // App Configuration
  get NEXT_PUBLIC_APP_NAME() {
    return optionalEnv('NEXT_PUBLIC_APP_NAME', 'StarMart');
  },
  get NEXT_PUBLIC_APP_URL() {
    return optionalEnv('NEXT_PUBLIC_APP_URL', 'http://localhost:3000');
  },
} as const;

export type Env = typeof env;
