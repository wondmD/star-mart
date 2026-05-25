'use client';

import { useRouter } from 'next/navigation';
import { ShieldCheck } from 'lucide-react';
import { Button } from '@/components/Button';
import { Card } from '@/components/FormElements';

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
      <Button className="mt-4" onClick={() => router.replace('/login?returnTo=/admin')}>
        Sign in
      </Button>
    </div>
  );
}

export function AdminAccessDenied() {
  const router = useRouter();

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
          Your account is signed in, but it has not been marked as an admin in Supabase yet.
          Set <span className="font-semibold">users.is_admin = true</span> for this account,
          then reload this page.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button onClick={() => router.push('/')} variant="outline">
            Back to Home
          </Button>
          <Button onClick={() => router.refresh()}>Refresh</Button>
        </div>
      </Card>
    </div>
  );
}
