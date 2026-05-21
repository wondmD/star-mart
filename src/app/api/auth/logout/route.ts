import { NextRequest, NextResponse } from 'next/server';

import { deleteLocalSession } from '@/lib/local-auth-store';
import { useSupabaseAuth } from '@/lib/auth-mode';
import { ApiResponse } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization');

    if (!useSupabaseAuth() && authHeader?.startsWith('Bearer ')) {
      const token = authHeader.slice(7);
      await deleteLocalSession(token);
    }

    const response: ApiResponse<null> = {
      success: true,
      message: 'Logged out successfully',
    };

    return NextResponse.json(response);
  } catch (error) {
    const response: ApiResponse<null> = {
      success: false,
      error: error instanceof Error ? error.message : 'Logout failed',
    };
    return NextResponse.json(response, { status: 500 });
  }
}
