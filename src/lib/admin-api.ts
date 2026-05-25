import { getStoredAuthToken } from '@/services/auth';

export function formatAdminCurrency(value: number): string {
  return `ETB ${value.toFixed(2)}`;
}

export async function adminRequest<T>(
  url: string,
  options: RequestInit = {},
): Promise<T> {
  const token = getStoredAuthToken();
  if (!token) {
    throw new Error('Missing authentication token');
  }

  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...(options.headers ?? {}),
    },
  });

  const payload = await response.json();

  if (!response.ok || !payload.success) {
    throw new Error(payload.error || 'Request failed');
  }

  return payload.data as T;
}
