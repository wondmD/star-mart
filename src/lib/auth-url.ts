export function getAuthRedirectUrl(baseUrl?: string): string {
  const base =
    baseUrl?.trim().replace(/\/$/, '') ||
    process.env.NEXT_PUBLIC_APP_URL?.trim().replace(/\/$/, '');

  if (base) {
    return `${base}/auth/callback`;
  }

  if (typeof window !== 'undefined' && window.location.origin) {
    return `${window.location.origin.replace(/\/$/, '')}/auth/callback`;
  }

  throw new Error('Missing NEXT_PUBLIC_APP_URL for auth redirect');
}

export function getVerifyEmailUrl(email: string, reason?: 'exists' | 'created'): string {
  const params = new URLSearchParams({ email });
  if (reason) {
    params.set('reason', reason);
  }
  return `/auth/verify-email?${params.toString()}`;
}

export function getLoginUrl(options?: { verified?: boolean; email?: string }): string {
  const params = new URLSearchParams();
  if (options?.verified) {
    params.set('verified', 'true');
  }
  if (options?.email) {
    params.set('email', options.email);
  }
  const query = params.toString();
  return query ? `/auth/login?${query}` : '/auth/login';
}
