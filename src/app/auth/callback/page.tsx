'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';
import { Loader2 } from 'lucide-react';

import { getBrowserSupabaseClient } from '@/lib/supabase';
import { authService, getLoginPath } from '@/services/auth';
import { useAuthStore } from '@/stores/auth-store';

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const { setUser } = useAuthStore();

  useEffect(() => {
    let isMounted = true;

    async function completeCallback() {
      const code = searchParams.get('code');
      const token_hash = searchParams.get('token_hash');
      const type = searchParams.get('type');
      const email = searchParams.get('email') ?? '';

      if (code) {
        try {
          const isEmailVerification = Boolean(token_hash || type);

          const user = await authService.confirmEmail(
            { code, token_hash, type },
            { persistSession: !isEmailVerification },
          );

          if (!isMounted) {
            return;
          }

          if (isEmailVerification) {
            toast.success('Email verified! You can sign in now.', { duration: 6000 });
            router.replace(getLoginPath({ verified: true, email: email || undefined }));
            return;
          }

          setUser(user);
          toast.success('Signed in with Google!', { duration: 6000 });
          router.replace('/');
          return;
        } catch (callbackError) {
          if (!isMounted) {
            return;
          }

          const message =
            callbackError instanceof Error ? callbackError.message : 'Authentication failed';
          setError(message);
          toast.error(message);
          return;
        }
      }

      try {
        const supabase = getBrowserSupabaseClient();
        const { data, error: sessionError } = await supabase.auth.getSession();

        if (sessionError) {
          throw sessionError;
        }

        const sessionToken = data.session?.access_token;
        if (!sessionToken) {
          throw new Error('No authentication session was found');
        }

        localStorage.setItem('auth_token', sessionToken);
        const user = await authService.getCurrentUser();

        if (!user) {
          throw new Error('Signed in, but could not load your account');
        }

        if (!isMounted) {
          return;
        }

        setUser(user);
        toast.success('Signed in with Google!', { duration: 6000 });
        router.replace('/');
      } catch (verificationError) {
        if (!isMounted) {
          return;
        }

        const message =
          verificationError instanceof Error
            ? verificationError.message
            : 'Verification failed';
        setError(message);
        toast.error(message);
      }
    }

    completeCallback();

    return () => {
      isMounted = false;
    };
  }, [searchParams, router, setUser]);

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-4 text-center">
        <p className="text-lg font-semibold" style={{ color: 'var(--error)' }}>
          {error}
        </p>
        <button
          type="button"
          className="underline text-sm"
          style={{ color: 'var(--accent-secondary)' }}
          onClick={() => router.push('/auth/verify-email')}
        >
          Back to email verification
        </button>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center gap-3"
      style={{ color: 'var(--text-secondary)' }}
    >
      <Loader2 className="w-8 h-8 animate-spin" style={{ color: 'var(--accent-primary)' }} />
      <p>Verifying your email…</p>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center" style={{ color: 'var(--text-secondary)' }}>
          Loading…
        </div>
      }
    >
      <AuthCallbackContent />
    </Suspense>
  );
}
