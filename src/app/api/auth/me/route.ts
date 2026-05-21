import { NextRequest, NextResponse } from 'next/server';

import { requireSupabaseAuth } from '@/lib/auth-mode';
import {
  createRouteHandlerSupabaseClient,
  getOrCreateSupabaseProfile,
  getSupabaseUserFromToken,
} from '@/lib/supabase-server';
import { ApiResponse, User } from '@/types';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization');

    if (!authHeader?.startsWith('Bearer ')) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Not authenticated',
      };
      return NextResponse.json(response, { status: 401 });
    }

    requireSupabaseAuth();

    const token = authHeader.slice(7);
    const authUser = await getSupabaseUserFromToken(token);

    if (!authUser) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Session expired or invalid',
      };
      return NextResponse.json(response, { status: 401 });
    }

    const supabase = createRouteHandlerSupabaseClient();
    const user = await getOrCreateSupabaseProfile(supabase, authUser);

    const response: ApiResponse<User> = {
      success: true,
      data: user,
    };

    return NextResponse.json(response);
  } catch (error) {
    const response: ApiResponse<null> = {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch user',
    };
    return NextResponse.json(response, { status: 500 });
  }
}
