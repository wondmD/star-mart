import { NextRequest, NextResponse } from 'next/server';

import { AUTH_ERROR_CODES } from '@/lib/auth-codes';
import { requireSupabaseAuth } from '@/lib/auth-mode';
import {
  getHttpStatusForAuthError,
  mapSupabaseAuthError,
} from '@/lib/supabase-auth-errors';
import {
  createRouteHandlerSupabaseClient,
  getOrCreateSupabaseProfile,
} from '@/lib/supabase-server';
import { ApiResponse, LoginFormData, User } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as LoginFormData;
    const { email, password } = body;
    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail || !password) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Email and password are required',
      };
      return NextResponse.json(response, { status: 400 });
    }

    requireSupabaseAuth();

    const supabase = createRouteHandlerSupabaseClient();
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: normalizedEmail,
      password,
    });

    if (authError) {
      const lower = authError.message.toLowerCase();
      const emailNotConfirmed = lower.includes('email not confirmed');

      const response: ApiResponse<{ email: string } | null> = {
        success: false,
        error: mapSupabaseAuthError(authError, 'login'),
        code: emailNotConfirmed ? AUTH_ERROR_CODES.EMAIL_NOT_CONFIRMED : undefined,
        data: emailNotConfirmed ? { email: normalizedEmail } : undefined,
      };
      return NextResponse.json(response, {
        status: getHttpStatusForAuthError(authError),
      });
    }

    if (!authData.user || !authData.session?.access_token) {
      throw new Error('Failed to login');
    }

    const user = await getOrCreateSupabaseProfile(supabase, authData.user);

    const response: ApiResponse<{ user: User; token: string }> = {
      success: true,
      data: { user, token: authData.session.access_token },
      message: 'Logged in successfully',
    };

    return NextResponse.json(response);
  } catch (error) {
    const response: ApiResponse<null> = {
      success: false,
      error: error instanceof Error ? error.message : 'Login failed',
    };
    return NextResponse.json(response, { status: 401 });
  }
}
