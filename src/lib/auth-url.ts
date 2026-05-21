export function getAuthRedirectUrl(): string {
  const base =
    process.env.NEXT_PUBLIC_APP_URL?.trim().replace(/\/$/, '') ||
    'http://localhost:3000';
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
