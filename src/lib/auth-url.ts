export function getAuthRedirectUrl(baseUrl: string): string {
  const base = baseUrl.trim().replace(/\/$/, '');

  if (!base) {
    throw new Error('Missing auth callback base URL');
  }

  return `${base}/auth/callback`;
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
