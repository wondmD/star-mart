function getSafeInternalPath(path?: string): string | undefined {
  if (!path) {
    return undefined;
  }

  const trimmed = path.trim();
  if (!trimmed.startsWith('/') || trimmed.startsWith('//')) {
    return undefined;
  }

  return trimmed;
}

export function getAuthRedirectUrl(baseUrl: string, returnTo?: string): string {
  const base = baseUrl.trim().replace(/\/$/, '');

  if (!base) {
    throw new Error('Missing auth callback base URL');
  }

  const safeReturnTo = getSafeInternalPath(returnTo);
  if (!safeReturnTo) {
    return `${base}/auth/callback`;
  }

  const params = new URLSearchParams({ returnTo: safeReturnTo });
  return `${base}/auth/callback?${params.toString()}`;
}

export function getVerifyEmailUrl(email: string, reason?: 'exists' | 'created'): string {
  const params = new URLSearchParams({ email });
  if (reason) {
    params.set('reason', reason);
  }
  return `/auth/verify-email?${params.toString()}`;
}

export function getSignupUrl(returnTo?: string): string {
  const safeReturnTo = getSafeInternalPath(returnTo);
  return safeReturnTo
    ? `/auth/signup?returnTo=${encodeURIComponent(safeReturnTo)}`
    : '/auth/signup';
}

export function getLoginUrl(options?: { verified?: boolean; email?: string; returnTo?: string }): string {
  const params = new URLSearchParams();
  if (options?.verified) {
    params.set('verified', 'true');
  }
  if (options?.email) {
    params.set('email', options.email);
  }
  const safeReturnTo = getSafeInternalPath(options?.returnTo);
  if (safeReturnTo) {
    params.set('returnTo', safeReturnTo);
  }
  const query = params.toString();
  return query ? `/auth/login?${query}` : '/auth/login';
}

export function getSafeReturnToPath(path?: string): string {
  return getSafeInternalPath(path) ?? '/';
}
