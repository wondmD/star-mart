import { AuthApiError, isAuthApiError } from '@/lib/auth-api-error';
import { AUTH_ERROR_CODES } from '@/lib/auth-codes';
import { getAuthRedirectUrl, getLoginUrl, getVerifyEmailUrl } from '@/lib/auth-url';
import { hasSupabaseConfig } from '@/lib/has-supabase';
import { getBrowserSupabaseClient } from '@/lib/supabase';
import { AuthSignupResult, LoginFormData, SignupFormData, User } from '@/types';

const AUTH_TOKEN_KEY = 'auth_token';

function saveAuthToken(token: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
  }
}

function clearAuthToken(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(AUTH_TOKEN_KEY);
  }
}

function getAuthToken(): string | null {
  if (typeof window === 'undefined') {
    return null;
  }
  return localStorage.getItem(AUTH_TOKEN_KEY);
}

async function authRequest<T>(
  path: string,
  options: RequestInit = {},
): Promise<{ data: T; message?: string; code?: string }> {
  const token = getAuthToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(options.headers ?? {}),
  };

  if (token) {
    (headers as Record<string, string>).Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`/api/auth/${path}`, {
    ...options,
    headers,
  });

  const payload = await response.json();

  if (!response.ok || !payload.success) {
    throw new AuthApiError(payload.error || 'Authentication request failed', {
      code: payload.code,
      email: payload.data?.email,
      status: response.status,
    });
  }

  return {
    data: payload.data as T,
    message: payload.message,
    code: payload.code,
  };
}

export function getVerifyEmailPath(
  email: string,
  reason?: 'exists' | 'created',
): string {
  return getVerifyEmailUrl(email, reason);
}

export function getLoginPath(options?: { verified?: boolean; email?: string }): string {
  return getLoginUrl(options);
}

export const authService = {
  async signInWithGoogle(): Promise<void> {
    if (!hasSupabaseConfig()) {
      throw new Error('Google sign-in requires Supabase authentication to be configured');
    }

    const supabase = getBrowserSupabaseClient();
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: getAuthRedirectUrl(),
      },
    });

    if (error) {
      throw new Error(error.message);
    }

    if (data.url) {
      window.location.assign(data.url);
    }
  },

  async signup(data: SignupFormData): Promise<AuthSignupResult & { message?: string }> {
    const response = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const payload = await response.json();

    if (!response.ok || !payload.success) {
      throw new AuthApiError(payload.error || 'Signup failed', {
        code: payload.code ?? (response.status === 429 ? 'RATE_LIMITED' : undefined),
        email:
          payload.data?.email ??
          (typeof payload.data === 'object' && payload.data && 'email' in payload.data
            ? String((payload.data as { email?: string }).email)
            : data.email.trim().toLowerCase()),
        status: response.status,
      });
    }

    const result = payload.data as {
      user: User;
      token?: string;
      email?: string;
      requiresEmailConfirmation?: boolean;
    };

    if (result.token) {
      saveAuthToken(result.token);
    }

    return {
      user: result.user,
      token: result.token,
      requiresEmailConfirmation: Boolean(result.requiresEmailConfirmation),
      email: result.email ?? data.email.trim().toLowerCase(),
      message: payload.message,
    };
  },

  async login(data: LoginFormData): Promise<User> {
    try {
      const { data: result } = await authRequest<{ user: User; token: string }>('login', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      saveAuthToken(result.token);
      return result.user;
    } catch (error) {
      if (
        isAuthApiError(error) &&
        error.code === AUTH_ERROR_CODES.EMAIL_NOT_CONFIRMED
      ) {
        throw new AuthApiError(error.message, {
          code: AUTH_ERROR_CODES.EMAIL_NOT_CONFIRMED,
          email: error.email ?? data.email.trim().toLowerCase(),
          status: error.status,
        });
      }
      throw error;
    }
  },

  async resendVerificationEmail(email: string): Promise<string> {
    const { message } = await authRequest<{ email: string }>('resend-verification', {
      method: 'POST',
      body: JSON.stringify({ email: email.trim().toLowerCase() }),
    });
    return message || 'Verification email sent';
  },

  async confirmEmail(
    params: {
      code?: string | null;
      token_hash?: string | null;
      type?: string | null;
    },
    options?: { persistSession?: boolean },
  ): Promise<User> {
    const { data: result } = await authRequest<{ user: User; token: string }>(
      'confirm-email',
      {
        method: 'POST',
        body: JSON.stringify(params),
      },
    );

    if (options?.persistSession !== false) {
      saveAuthToken(result.token);
    } else {
      clearAuthToken();
    }

    return result.user;
  },

  async logout(): Promise<void> {
    try {
      await authRequest<null>('logout', { method: 'POST' });
    } finally {
      clearAuthToken();

      if (hasSupabaseConfig()) {
        try {
          const supabase = getBrowserSupabaseClient();
          await supabase.auth.signOut();
        } catch {
          // Token already cleared locally
        }
      }
    }
  },

  async getCurrentUser(): Promise<User | null> {
    const token = getAuthToken();
    if (!token) {
      return null;
    }

    try {
      const { data: user } = await authRequest<User>('me');
      return user;
    } catch {
      clearAuthToken();
      return null;
    }
  },

  async updateProfile(updates: Partial<User>): Promise<User> {
    if (!hasSupabaseConfig()) {
      throw new Error('Profile updates are not available in local auth mode yet');
    }

    const supabase = getBrowserSupabaseClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      throw new Error('Not authenticated');
    }

    const { data: profile, error: profileError } = await supabase
      .from('users')
      .update(updates)
      .eq('id', user.id)
      .select()
      .single();

    if (profileError) {
      throw new Error('Failed to update profile');
    }

    return profile as User;
  },
};
