import {
  createRouteHandlerSupabaseClient,
  getOrCreateSupabaseProfile,
} from '@/lib/supabase-server';
import {
  createSupabaseAdminClient,
  isDevEmailBypassEnabled,
} from '@/lib/supabase-admin';
import { User } from '@/types';

/**
 * Creates a confirmed user via service role (no confirmation email).
 * Only when NODE_ENV=development, ALLOW_DEV_EMAIL_BYPASS=true, and service role key set.
 */
export async function tryDevAdminSignup(
  email: string,
  password: string,
  full_name: string,
): Promise<{ user: User; token: string } | null> {
  if (!isDevEmailBypassEnabled()) {
    return null;
  }

  const admin = createSupabaseAdminClient();
  if (!admin) {
    return null;
  }

  const { data: existingList, error: listError } = await admin.auth.admin.listUsers({
    page: 1,
    perPage: 1000,
  });

  if (listError) {
    throw new Error(listError.message);
  }

  const existingUser = existingList.users.find(
    (user) => user.email?.toLowerCase() === email.toLowerCase(),
  );

  if (!existingUser) {
    const { error: createError } = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name },
    });

    if (createError) {
      throw new Error(createError.message);
    }
  } else {
    const { error: updateError } = await admin.auth.admin.updateUserById(
      existingUser.id,
      {
        email_confirm: true,
        password,
        user_metadata: { full_name },
      },
    );

    if (updateError) {
      throw new Error(updateError.message);
    }
  }

  const supabase = createRouteHandlerSupabaseClient();
  const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (loginError || !loginData.user || !loginData.session?.access_token) {
    throw new Error(loginError?.message ?? 'Dev signup succeeded but login failed');
  }

  const user = await getOrCreateSupabaseProfile(supabase, loginData.user, full_name);

  return {
    user,
    token: loginData.session.access_token,
  };
}
