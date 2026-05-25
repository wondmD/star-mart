'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/Button';
import { getLoginPath } from '@/services/auth';

export function CheckoutAuthGate() {
  const router = useRouter();

  return (
    <div className="px-4 py-12 text-center sm:px-6 lg:px-8">
      <p className="mb-4 text-lg text-gray-600">Please log in to checkout</p>
      <Button onClick={() => router.push(getLoginPath({ returnTo: '/checkout' }))}>
        Sign in
      </Button>
    </div>
  );
}
