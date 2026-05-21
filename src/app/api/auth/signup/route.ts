import { NextRequest, NextResponse } from 'next/server';

import { AUTH_ERROR_CODES } from '@/lib/auth-codes';
import { getAuthRedirectUrl } from '@/lib/auth-url';
import { requireSupabaseAuth } from '@/lib/auth-mode';
import {
  getHttpStatusForAuthError,
  mapSupabaseAuthError,
} from '@/lib/supabase-auth-errors';
import {
  buildEmailExistsPayload,
  isExistingUnconfirmedSignup,
  isSupabaseEmailExistsError,
  isSupabaseEmailExistsHint,
} from '@/lib/supabase-signup';
import {
  createRouteHandlerSupabaseClient,
  getOrCreateSupabaseProfile,
} from '@/lib/supabase-server';
import { ApiResponse, SignupFormData, User } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as SignupFormData;
    const { email, password, full_name } = body;
    const normalizedEmail = email.trim().toLowerCase();
    const appUrl = new URL(request.url).origin;

    if (!normalizedEmail || !password || !full_name) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Email, password, and full name are required',
      };
      return NextResponse.json(response, { status: 400 });
    }

    requireSupabaseAuth();

    const supabase = createRouteHandlerSupabaseClient();
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: normalizedEmail,
      password,
      options: {
        data: { full_name },
        emailRedirectTo: getAuthRedirectUrl(appUrl),
      },
    });

    if (authError) {
      if (
        isSupabaseEmailExistsError(authError) ||
        isSupabaseEmailExistsHint(authError)
      ) {
        return NextResponse.json(buildEmailExistsPayload(normalizedEmail), {
          status: 409,
        });
      }

      const response: ApiResponse<null> = {
        success: false,
        error: mapSupabaseAuthError(authError, 'signup'),
        code: authError.status === 429 ? 'RATE_LIMITED' : undefined,
      };
      return NextResponse.json(response, {
        status: getHttpStatusForAuthError(authError),
      });
    }

    if (!authData.user) {
      throw new Error('Failed to create user');
    }

    if (isExistingUnconfirmedSignup(authData)) {
      return NextResponse.json(buildEmailExistsPayload(normalizedEmail), {
        status: 409,
      });
    }

    const user = await getOrCreateSupabaseProfile(supabase, authData.user, full_name);
    const token = authData.session?.access_token;

    if (token) {
      const response: ApiResponse<{ user: User; token: string }> = {
        success: true,
        data: { user, token },
        message: 'Account created successfully. You are signed in.',
      };
      return NextResponse.json(response, { status: 201 });
    }

    const response: ApiResponse<{
      user: User;
      email: string;
      requiresEmailConfirmation: true;
    }> = {
      success: true,
      code: AUTH_ERROR_CODES.REQUIRES_EMAIL_VERIFICATION,
      data: {
        user,
        email: normalizedEmail,
        requiresEmailConfirmation: true,
      },
      message:
        'Account created! Check your email and click the verification link, then sign in.',
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message.includes('USE_LOCAL_AUTH=true')
    ) {
      const response: ApiResponse<null> = {
        success: false,
        error: error.message,
      };
      return NextResponse.json(response, { status: 503 });
    }

    const response: ApiResponse<null> = {
      success: false,
      error: error instanceof Error ? error.message : 'Signup failed',
    };
    return NextResponse.json(response, { status: 500 });
  }
}
