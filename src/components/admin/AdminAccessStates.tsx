'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import { Button } from '@/components/Button';
import { Card } from '@/components/FormElements';
import { authService, getLoginPath } from '@/services/auth';
import { useAuthStore } from '@/stores/auth-store';

export function AdminLoadingState() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div
        className="h-12 w-12 animate-spin rounded-full border-4 border-t-transparent"
        style={{ borderColor: 'var(--border-color)', borderTopColor: 'var(--accent-primary)' }}
      />
    </div>
  );
}

export function AdminSignInRequired() {
  const router = useRouter();

  return (
    <div className="px-4 py-12 text-center sm:px-6 lg:px-8">
      <p className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
        Admin access requires a signed-in account.
      </p>
      <Button className="mt-4" onClick={() => router.replace(getLoginPath({ returnTo: '/admin' }))}>
        Sign in
      </Button>
    </div>
  );
}

export function AdminAccessDenied() {
  const router = useRouter();
  const { setUser } = useAuthStore();
  const [isReloading, setIsReloading] = useState(false);

  async function reloadProfile() {
    setIsReloading(true);
    try {
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);

      if (currentUser?.is_admin) {
        toast.success('Admin access confirmed.');
        router.refresh();
        return;
      }

      toast.error(
        'Still not admin. Confirm public.users.is_admin = true for your sign-in email and restart the dev server after setting SUPABASE_SERVICE_ROLE_KEY.',
      );
    } catch {
      toast.error('Could not reload your profile. Try signing out and back in.');
    } finally {
      setIsReloading(false);
    }
  }

  return (
    <div className="px-4 py-12 sm:px-6 lg:px-8">
      <Card className="mx-auto max-w-2xl space-y-4 text-center">
        <div
          className="mx-auto flex h-14 w-14 items-center justify-center rounded-full"
          style={{ backgroundColor: 'var(--accent-light)' }}
        >
          <ShieldCheck className="h-7 w-7" style={{ color: 'var(--accent-secondary)' }} />
        </div>
        <h1 className="text-3xl font-black" style={{ color: 'var(--text-primary)' }}>
          Admin access required
        </h1>
        <p className="text-sm leading-6" style={{ color: 'var(--text-secondary)' }}>
          Your account is signed in, but the app does not see admin access yet. In Supabase SQL
          editor, run{' '}
          <span className="font-semibold">
            UPDATE public.users SET is_admin = true WHERE email = &apos;your@email.com&apos;;
          </span>{' '}
          using the same email you sign in with, ensure{' '}
          <span className="font-semibold">SUPABASE_SERVICE_ROLE_KEY</span> is set in{' '}
          <span className="font-semibold">.env.local</span>, then reload your profile below.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button onClick={() => router.push('/')} variant="outline">
            Back to Home
          </Button>
          <Button onClick={() => void reloadProfile()} loading={isReloading}>
            Reload profile
          </Button>
          <Button onClick={() => router.refresh()} variant="outline">
            Reload page
          </Button>
        </div>
      </Card>
    </div>
  );
}
