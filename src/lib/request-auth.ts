import { NextRequest } from 'next/server';

import { useSupabaseAuth } from '@/lib/auth-mode';
import { getLocalUserByToken } from '@/lib/local-auth-store';
import { getSupabaseUserFromToken } from '@/lib/supabase-server';

export async function getUserIdFromRequest(
  request: NextRequest,
): Promise<string | null> {
  const authHeader = request.headers.get('Authorization');

  if (!authHeader?.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.slice(7);

  if (useSupabaseAuth()) {
    const authUser = await getSupabaseUserFromToken(token);
    if (authUser) {
      return authUser.id;
    }
  }

  const localUser = await getLocalUserByToken(token);
  return localUser?.id ?? null;
}

