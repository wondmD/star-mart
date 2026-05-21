import { NextRequest, NextResponse } from 'next/server';

import { getAuthRedirectUrl } from '@/lib/auth-url';
import { requireSupabaseAuth } from '@/lib/auth-mode';
import {
  getHttpStatusForAuthError,
  mapSupabaseAuthError,
} from '@/lib/supabase-auth-errors';
import { createRouteHandlerSupabaseClient } from '@/lib/supabase-server';
import { ApiResponse } from '@/types';

export async function POST(request: NextRequest) {
  try {
    requireSupabaseAuth();
    const body = await request.json();
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';

    if (!email) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Email is required',
      };
      return NextResponse.json(response, { status: 400 });
    }

    const supabase = createRouteHandlerSupabaseClient();
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email,
      options: {
        emailRedirectTo: getAuthRedirectUrl(),
      },
    });

    if (error) {
      const response: ApiResponse<null> = {
        success: false,
        error: mapSupabaseAuthError(error, 'signup'),
      };
      return NextResponse.json(response, {
        status: getHttpStatusForAuthError(error),
      });
    }

    const response: ApiResponse<{ email: string }> = {
      success: true,
      data: { email },
      message: 'Verification email sent. Check your inbox and spam folder.',
    };

    return NextResponse.json(response);
  } catch (error) {
    const response: ApiResponse<null> = {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to resend verification email',
    };
    return NextResponse.json(response, { status: 500 });
  }
}
