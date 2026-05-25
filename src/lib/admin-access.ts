import { NextRequest, NextResponse } from 'next/server';
import type { SupabaseClient } from '@supabase/supabase-js';

import { useSupabaseAuth } from '@/lib/auth-mode';
import { getLocalUserByToken } from '@/lib/local-auth-store';
import { createSupabaseAdminClient } from '@/lib/supabase-admin';
import {
  createRouteHandlerSupabaseClient,
  getOrCreateSupabaseProfile,
  getSupabaseUserFromToken,
} from '@/lib/supabase-server';
import { ApiResponse, User } from '@/types';

export type AdminAccessResult =
  | {
      ok: true;
      user: User;
      adminClient?: SupabaseClient;
    }
  | {
      ok: false;
      response: NextResponse;
    };

function errorResponse(message: string, status: number): NextResponse {
  const response: ApiResponse<null> = {
    success: false,
    error: message,
  };

  return NextResponse.json(response, { status });
}

async function requireLocalAdminAccess(token: string): Promise<AdminAccessResult> {
  const user = await getLocalUserByToken(token);

  if (!user) {
    return {
      ok: false,
      response: errorResponse('Session expired or invalid', 401),
    };
  }

  if (!user.is_admin) {
    return {
      ok: false,
      response: errorResponse('Admin access required', 403),
    };
  }

  return {
    ok: true,
    user,
  };
}

export async function requireAdminAccess(request: NextRequest): Promise<AdminAccessResult> {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return {
      ok: false,
      response: errorResponse('Not authenticated', 401),
    };
  }

  const token = authHeader.slice(7);

  if (!useSupabaseAuth()) {
    return requireLocalAdminAccess(token);
  }

  const authUser = await getSupabaseUserFromToken(token);
  if (!authUser) {
    return {
      ok: false,
      response: errorResponse('Session expired or invalid', 401),
    };
  }

  const profileClient = createRouteHandlerSupabaseClient();
  const profile = await getOrCreateSupabaseProfile(profileClient, authUser);

  if (!profile.is_admin) {
    return {
      ok: false,
      response: errorResponse('Admin access required', 403),
    };
  }

  const adminClient = createSupabaseAdminClient();

  return {
    ok: true,
    user: profile,
    adminClient: adminClient ?? undefined,
  };
}
