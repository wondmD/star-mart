import { AuthError, AuthResponse } from '@supabase/supabase-js';

import { AUTH_ERROR_CODES } from '@/lib/auth-codes';

export function isSupabaseEmailExistsError(error: AuthError): boolean {
  const lower = (error.message ?? '').toLowerCase();
  return (
    lower.includes('already registered') ||
    lower.includes('already been registered') ||
    lower.includes('user already registered')
  );
}

/** Supabase may return "email is invalid" when the address is already registered. */
export function isSupabaseEmailExistsHint(error: AuthError): boolean {
  const lower = (error.message ?? '').toLowerCase();
  return lower.includes('is invalid') && lower.includes('email');
}

/**
 * With confirm-email enabled, signUp for an existing address returns a user
 * with no identities (anti-enumeration behavior).
 */
export function isExistingUnconfirmedSignup(authData: AuthResponse['data']): boolean {
  const user = authData?.user;
  if (!user) {
    return false;
  }

  const identities = user.identities ?? [];
  return identities.length === 0;
}

export function buildEmailExistsPayload(email: string) {
  return {
    success: false as const,
    error: 'An account with this email already exists. Please sign in instead.',
    code: AUTH_ERROR_CODES.EMAIL_EXISTS,
    data: { email },
  };
}
