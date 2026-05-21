import { NextRequest, NextResponse } from 'next/server';
import { EmailOtpType } from '@supabase/supabase-js';

import { requireSupabaseAuth } from '@/lib/auth-mode';
import {
  createRouteHandlerSupabaseClient,
  getOrCreateSupabaseProfile,
} from '@/lib/supabase-server';
import { ApiResponse, User } from '@/types';

const OTP_TYPES: EmailOtpType[] = ['signup', 'email', 'recovery', 'invite', 'magiclink'];

function isValidOtpType(type: string): type is EmailOtpType {
  return OTP_TYPES.includes(type as EmailOtpType);
}

export async function POST(request: NextRequest) {
  try {
    requireSupabaseAuth();
    const body = await request.json();
    const code = typeof body.code === 'string' ? body.code : null;
    const token_hash = typeof body.token_hash === 'string' ? body.token_hash : null;
    const type = typeof body.type === 'string' ? body.type : null;

    const supabase = createRouteHandlerSupabaseClient();
    let session = null;
    let authUser = null;

    if (code) {
      const { data, error } = await supabase.auth.exchangeCodeForSession(code);
      if (error) {
        throw new Error(error.message);
      }
      session = data.session;
      authUser = data.user;
    } else if (token_hash && type && isValidOtpType(type)) {
      const { data, error } = await supabase.auth.verifyOtp({
        token_hash,
        type,
      });
      if (error) {
        throw new Error(error.message);
      }
      session = data.session;
      authUser = data.user;
    } else {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Invalid verification link',
      };
      return NextResponse.json(response, { status: 400 });
    }

    if (!session?.access_token || !authUser) {
      throw new Error('Verification succeeded but no session was created');
    }

    const user = await getOrCreateSupabaseProfile(supabase, authUser);

    const response: ApiResponse<{ user: User; token: string }> = {
      success: true,
      data: { user, token: session.access_token },
      message: 'Email verified successfully',
    };

    return NextResponse.json(response);
  } catch (error) {
    const response: ApiResponse<null> = {
      success: false,
      error: error instanceof Error ? error.message : 'Email verification failed',
    };
    return NextResponse.json(response, { status: 400 });
  }
}
