import { AuthError } from '@supabase/supabase-js';

export function getRateLimitRetrySeconds(message: string): number | null {
  const match = message.match(/after (\d+) seconds?/i);
  return match ? Number.parseInt(match[1], 10) : null;
}

export function mapSupabaseAuthError(
  error: AuthError,
  context: 'signup' | 'login',
): string {
  const message = error.message ?? '';
  const lower = message.toLowerCase();
  const status = error.status;

  if (
    status === 429 ||
    lower.includes('rate limit') ||
    lower.includes('only request this after')
  ) {
    const waitMatch = message.match(/after (\d+) seconds?/i);
    const waitHint = waitMatch
      ? ` Wait ${waitMatch[1]} seconds before trying again.`
      : ' Wait a minute before trying again.';

    if (context === 'signup') {
      return (
        `Supabase email rate limit reached for this project (applies to all addresses, not just one email).${waitHint} ` +
        'Fixes: set USE_LOCAL_AUTH=true in .env.local and restart the dev server, ' +
        'or disable "Confirm email" under Authentication → Providers → Email, ' +
        'or wait for the cooldown to expire.'
      );
    }

    return `Too many login attempts.${waitHint}`;
  }

  if (lower.includes('already registered') || lower.includes('already been registered')) {
    return 'An account with this email already exists. Sign in, or confirm the user in Supabase → Authentication → Users.';
  }

  if (lower.includes('is invalid') && lower.includes('email')) {
    if (context === 'signup') {
      return (
        `Supabase rejected this email (${message}). ` +
        'If you already signed up, use Sign in instead of registering again. ' +
        'Otherwise try another email or check Authentication → Users in the Supabase dashboard.'
      );
    }
  }

  if (
    context === 'login' &&
    (lower.includes('invalid login credentials') || lower.includes('invalid credentials'))
  ) {
    return 'Invalid email or password. Please try again or create a new account.';
  }

  if (lower.includes('email not confirmed')) {
    return 'Please confirm your email before signing in. Check your inbox or confirm the user in Supabase → Authentication → Users.';
  }

  return message || (context === 'signup' ? 'Signup failed' : 'Login failed');
}

export function getHttpStatusForAuthError(error: AuthError): number {
  if (error.status === 429) {
    return 429;
  }
  if (error.status === 422 || error.status === 400) {
    return 400;
  }
  return 400;
}
