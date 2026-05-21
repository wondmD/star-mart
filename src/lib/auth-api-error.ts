import { AuthErrorCode } from '@/lib/auth-codes';

export class AuthApiError extends Error {
  code?: AuthErrorCode | string;
  email?: string;
  status?: number;

  constructor(
    message: string,
    options?: { code?: AuthErrorCode | string; email?: string; status?: number },
  ) {
    super(message);
    this.name = 'AuthApiError';
    this.code = options?.code;
    this.email = options?.email;
    this.status = options?.status;
  }
}

export function isAuthApiError(error: unknown): error is AuthApiError {
  return error instanceof AuthApiError;
}
