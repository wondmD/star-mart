'use client';

import Link from 'next/link';
import { Package } from 'lucide-react';
import { useOrders } from '@/hooks/useOrders';
import { useAuthStore } from '@/stores/auth-store';
import { Button } from '@/components/Button';
import { OrderListItem } from '@/components/orders/OrderListItem';

export default function OrdersPage() {
  const { user } = useAuthStore();
  const { data: orders, isLoading, error, refetch } = useOrders();

  if (!user) {
    return (
      <div className="px-4 py-12 text-center sm:px-6 lg:px-8">
        <p className="mb-4 text-lg text-gray-600">Please log in to view your orders</p>
        <Link href="/auth/login">
          <Button>Login</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 px-4 sm:px-6 lg:px-8">
      <div>
        <h1 className="text-4xl font-bold">My Orders</h1>
        <p className="mt-2 text-gray-600">Track and manage all your orders</p>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="h-24 animate-pulse rounded-lg bg-gray-200" />
          ))}
        </div>
      ) : error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
          <p className="text-red-700">Failed to load orders. Please try again.</p>
        </div>
      ) : orders && orders.length > 0 ? (
        <div className="space-y-4">
          {orders.map((order) => (
            <OrderListItem
              key={order.id}
              order={order}
              customerEmail={user.email}
              onPaymentUpdated={() => void refetch()}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-lg bg-gray-50 py-12 text-center">
          <Package className="mx-auto mb-4 h-16 w-16 text-gray-300" />
          <p className="mb-4 text-lg text-gray-600">You haven&apos;t placed any orders yet</p>
          <Link href="/products">
            <Button>Start Shopping</Button>
          </Link>
        </div>
      )}
    </div>
  );
}
