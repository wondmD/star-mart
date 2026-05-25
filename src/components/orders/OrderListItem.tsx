'use client';

import { useRouter } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
import { PayRetryButton } from '@/components/PayRetryButton';
import { Card } from '@/components/FormElements';
import { Order } from '@/types';

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  pending: { bg: 'bg-yellow-100', text: 'text-yellow-800' },
  paid: { bg: 'bg-green-100', text: 'text-green-800' },
  shipped: { bg: 'bg-blue-100', text: 'text-blue-800' },
  delivered: { bg: 'bg-green-100', text: 'text-green-800' },
  cancelled: { bg: 'bg-red-100', text: 'text-red-800' },
};

interface OrderListItemProps {
  order: Order;
  customerEmail?: string;
  onPaymentUpdated: () => void;
}

export function OrderListItem({ order, customerEmail, onPaymentUpdated }: OrderListItemProps) {
  const router = useRouter();
  const statusStyle = STATUS_COLORS[order.status] ?? STATUS_COLORS.pending;

  return (
    <Card className="flex flex-col justify-between gap-4 p-6 transition-shadow hover:shadow-lg md:flex-row md:items-center">
      <button
        type="button"
        className="flex-1 text-left"
        onClick={() => router.push(`/order-confirmation/${order.id}`)}
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <div>
            <p className="text-sm text-gray-600">Order ID</p>
            <p className="font-mono font-semibold">{order.id.slice(0, 8)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Date</p>
            <p className="font-semibold">{new Date(order.created_at).toLocaleDateString()}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Total</p>
            <p className="text-lg font-semibold text-blue-600">ETB {order.total_amount.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Status</p>
            <span className={`inline-block rounded-full px-3 py-1 text-sm font-semibold ${statusStyle.bg} ${statusStyle.text}`}>
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </span>
          </div>
        </div>
      </button>

      <div className="flex shrink-0 items-center gap-3">
        {order.status === 'pending' ? (
          <PayRetryButton
            orderId={order.id}
            customerEmail={customerEmail}
            size="sm"
            label={order.payment_id ? 'Pay now' : 'Complete payment'}
            onPaid={onPaymentUpdated}
          />
        ) : null}
        <button
          type="button"
          onClick={() => router.push(`/order-confirmation/${order.id}`)}
          aria-label="View order"
        >
          <ArrowRight className="h-5 w-5 text-gray-400" />
        </button>
      </div>
    </Card>
  );
}
