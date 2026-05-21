import { NextResponse } from 'next/server';

import { getAuthMode, isLocalAuthForced } from '@/lib/auth-mode';
import { isDevEmailBypassEnabled } from '@/lib/supabase-admin';
import { ApiResponse } from '@/types';

export async function GET() {
  const response: ApiResponse<{
    mode: 'local' | 'supabase';
    localAuthForced: boolean;
    devEmailBypassAvailable: boolean;
  }> = {
    success: true,
    data: {
      mode: getAuthMode(),
      localAuthForced: isLocalAuthForced(),
      devEmailBypassAvailable: isDevEmailBypassEnabled(),
    },
  };

  return NextResponse.json(response);
}
