'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/Button';

export function CheckoutEmptyState() {
  const router = useRouter();

  return (
    <div className="px-4 py-12 text-center sm:px-6 lg:px-8">
      <p className="mb-4 text-lg text-gray-600">Your cart is empty</p>
      <Button onClick={() => router.push('/products')}>Continue Shopping</Button>
    </div>
  );
}
