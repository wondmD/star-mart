'use client';

import { useRouter } from 'next/navigation';
import { useOrders } from '@/hooks/useOrders';
import { useAuthStore } from '@/stores/auth-store';
import { Button } from '@/components/Button';
import { PayRetryButton } from '@/components/PayRetryButton';
import { Card } from '@/components/FormElements';
import { Package, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  pending: { bg: 'bg-yellow-100', text: 'text-yellow-800' },
  paid: { bg: 'bg-green-100', text: 'text-green-800' },
  shipped: { bg: 'bg-blue-100', text: 'text-blue-800' },
  delivered: { bg: 'bg-green-100', text: 'text-green-800' },
  cancelled: { bg: 'bg-red-100', text: 'text-red-800' },
};

function OrderCardSkeleton() {
  return (
    <div className="h-24 rounded-lg bg-gray-200 animate-pulse" />
  );
}

export default function OrdersPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { data: orders, isLoading, error, refetch } = useOrders();

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-gray-600 mb-4">Please log in to view your orders</p>
        <Link href="/auth/login">
          <Button>Login</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 px-2 sm:px-4 lg:px-6">
      <div>
        <h1 className="text-4xl font-bold">My Orders</h1>
        <p className="text-gray-600 mt-2">Track and manage all your orders</p>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <OrderCardSkeleton key={i} />
          ))}
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-700">Failed to load orders. Please try again.</p>
        </div>
      ) : orders && orders.length > 0 ? (
        <div className="space-y-4">
          {orders.map((order) => {
            const statusStyle =
              STATUS_COLORS[order.status] ?? STATUS_COLORS.pending;

            return (
              <Card
                key={order.id}
                className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 hover:shadow-lg transition-shadow"
              >
                <button
                  type="button"
                  className="flex-1 text-left"
                  onClick={() => router.push(`/order-confirmation/${order.id}`)}
                >
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Order ID</p>
                      <p className="font-mono font-semibold">{order.id.slice(0, 8)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Date</p>
                      <p className="font-semibold">
                        {new Date(order.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Total</p>
                      <p className="font-semibold text-lg text-blue-600">
                        ETB {order.total_amount.toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Status</p>
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${statusStyle.bg} ${statusStyle.text}`}
                      >
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </div>
                  </div>
                </button>

                <div className="flex items-center gap-3 shrink-0">
                  {order.status === 'pending' && (
                    <PayRetryButton
                      orderId={order.id}
                      customerEmail={user.email}
                      size="sm"
                      label={order.payment_id ? 'Pay now' : 'Complete payment'}
                      onPaid={() => refetch()}
                    />
                  )}
                  <button
                    type="button"
                    onClick={() => router.push(`/order-confirmation/${order.id}`)}
                    aria-label="View order"
                  >
                    <ArrowRight className="w-5 h-5 text-gray-400" />
                  </button>
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-lg text-gray-600 mb-4">You haven&apos;t placed any orders yet</p>
          <Link href="/products">
            <Button>Start Shopping</Button>
          </Link>
        </div>
      )}
    </div>
  );
}
