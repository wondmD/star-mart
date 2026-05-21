import { createClient, SupabaseClient } from '@supabase/supabase-js';

import { getSupabaseUrl } from '@/lib/supabase-config';

export function createSupabaseAdminClient(): SupabaseClient | null {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

  if (!serviceRoleKey || !getSupabaseUrl()) {
    return null;
  }

  return createClient(getSupabaseUrl(), serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export function isDevEmailBypassEnabled(): boolean {
  return (
    process.env.NODE_ENV === 'development' &&
    process.env.ALLOW_DEV_EMAIL_BYPASS === 'true' &&
    Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY?.trim())
  );
}
