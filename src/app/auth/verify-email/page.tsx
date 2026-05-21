'use client';

import { Suspense, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Mail, RefreshCw, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

import { Button } from '@/components/Button';
import { authService } from '@/services/auth';

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email') ?? '';
  const reason = searchParams.get('reason');
  const verified = searchParams.get('verified') === 'true';
  const [isResending, setIsResending] = useState(false);

  const isExistingAccount = reason === 'exists';

  const handleResend = async () => {
    if (!email) {
      toast.error('No email address provided');
      return;
    }

    setIsResending(true);
    try {
      const message = await authService.resendVerificationEmail(email);
      toast.success(message, { duration: 6000 });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to resend email');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8"
      style={{ backgroundColor: 'var(--bg-primary)' }}
    >
      <div
        className="w-full max-w-md space-y-6 p-8 rounded-lg shadow-md border text-center"
        style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}
      >
        <div className="flex justify-center">
          {verified ? (
            <CheckCircle2 className="w-14 h-14" style={{ color: '#10b981' }} />
          ) : (
            <Mail className="w-14 h-14" style={{ color: 'var(--accent-primary)' }} />
          )}
        </div>

        <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
          {verified ? 'Email verified' : 'Verify your email'}
        </h1>

        {verified ? (
          <p style={{ color: 'var(--text-secondary)' }}>
            Your email is confirmed. You can sign in and start shopping.
          </p>
        ) : (
          <>
            <p style={{ color: 'var(--text-secondary)' }}>
              {isExistingAccount
                ? 'An account with this email already exists. Verify your email to activate the account.'
                : 'We sent a verification link to your inbox. Open it to activate your StarMart account.'}
            </p>
            {email && (
              <p
                className="text-sm font-semibold break-all px-4 py-2 rounded-lg border"
                style={{
                  color: 'var(--text-primary)',
                  borderColor: 'var(--border-color)',
                  backgroundColor: 'var(--bg-primary)',
                }}
              >
                {email}
              </p>
            )}
          </>
        )}

        {!verified && email && (
          <Button
            type="button"
            size="lg"
            className="w-full flex items-center justify-center gap-2"
            loading={isResending}
            onClick={handleResend}
          >
            <RefreshCw className="w-5 h-5" />
            Resend verification email
          </Button>
        )}

        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={() =>
            router.push(
              email ? `/auth/login?email=${encodeURIComponent(email)}` : '/auth/login',
            )
          }
        >
          {verified ? 'Sign in now' : 'Go to sign in'}
        </Button>

        {!verified && (
          <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
            Check spam. In Supabase, add{' '}
            <code className="text-xs">http://localhost:3000/auth/callback</code> under
            Authentication → URL Configuration → Redirect URLs.
          </p>
        )}
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center" style={{ color: 'var(--text-secondary)' }}>
          Loading…
        </div>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}
