'use client';

import { Suspense, useEffect, use, useState, useCallback } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useOrder } from '@/hooks/useOrders';
import { paymentService } from '@/services/payment';
import { Button } from '@/components/Button';
import { PayRetryButton } from '@/components/PayRetryButton';
import { Card } from '@/components/FormElements';
import { useAuthStore } from '@/stores/auth-store';
import {
  CheckCircle,
  Package,
  Truck,
  Home,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import toast from 'react-hot-toast';

interface Props {
  params: Promise<{
    id: string;
  }>;
}

const POLL_ATTEMPTS = 6;
const POLL_INTERVAL_MS = 2000;

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function OrderConfirmationContent({ id }: { id: string }) {
  const searchParams = useSearchParams();
  const returnedFromPayment = searchParams.get('payment') === 'return';
  const { user } = useAuthStore();
  const { data: order, isLoading, refetch } = useOrder(id);
  const [isVerifyingPayment, setIsVerifyingPayment] = useState(returnedFromPayment);
  const [paymentPending, setPaymentPending] = useState(false);

  const verifyAndRefresh = useCallback(async () => {
    const result = await paymentService.getPaymentStatus(id);
    await refetch();
    return result;
  }, [id, refetch]);

  useEffect(() => {
    if (!returnedFromPayment || isLoading || !order) {
      return;
    }

    if (order.status === 'paid') {
      setIsVerifyingPayment(false);
      setPaymentPending(false);
      return;
    }

    let cancelled = false;

    async function pollPaymentStatus() {
      try {
        for (let attempt = 0; attempt < POLL_ATTEMPTS; attempt++) {
          if (cancelled) {
            return;
          }

          const result = await verifyAndRefresh();

          if (result.success) {
            toast.success('Payment confirmed!');
            setPaymentPending(false);
            return;
          }

          if (attempt < POLL_ATTEMPTS - 1) {
            await delay(POLL_INTERVAL_MS);
          }
        }

        if (!cancelled) {
          setPaymentPending(true);
          toast.error(
            'Payment not confirmed yet. Use Pay now to complete or retry payment.',
            { duration: 6000 },
          );
        }
      } catch (error) {
        if (!cancelled) {
          setPaymentPending(true);
          toast.error(
            error instanceof Error ? error.message : 'Could not verify payment',
          );
        }
      } finally {
        if (!cancelled) {
          setIsVerifyingPayment(false);
        }
      }
    }

    pollPaymentStatus();

    return () => {
      cancelled = true;
    };
  }, [returnedFromPayment, isLoading, order, verifyAndRefresh]);

  if (isLoading || isVerifyingPayment) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-3">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
        <p className="text-gray-600">
          {isVerifyingPayment ? 'Confirming your StarPay payment…' : 'Loading order…'}
        </p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-gray-600 mb-4">Order not found</p>
        <Link href="/">
          <Button>Back to Home</Button>
        </Link>
      </div>
    );
  }

  const isPaid = order.status === 'paid';
  const showPayActions = !isPaid && (paymentPending || returnedFromPayment);

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="text-center">
        <div className="flex justify-center mb-4">
          {isPaid ? (
            <CheckCircle className="w-16 h-16 text-green-500" />
          ) : (
            <AlertCircle className="w-16 h-16 text-amber-500" />
          )}
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          {isPaid ? 'Order Confirmed!' : 'Order placed'}
        </h1>
        <p className="text-gray-600">
          {isPaid
            ? 'Thank you! Your StarPay payment was received.'
            : 'Your order is saved. Complete payment to confirm it.'}
        </p>
      </div>

      {showPayActions && (
        <Card className="bg-amber-50 border border-amber-200 space-y-4">
          <p className="font-semibold text-amber-900">Payment required</p>
          <p className="text-sm text-amber-800">
            This order is still pending payment. You can continue on StarPay or start a new
            payment session.
          </p>
          <PayRetryButton
            orderId={order.id}
            customerEmail={user?.email}
            label="Pay now"
            onPaid={() => {
              setPaymentPending(false);
              refetch();
            }}
          />
        </Card>
      )}

      <Card className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold mb-4">Order Details</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Order ID</p>
              <p className="font-mono font-semibold text-lg">{order.id}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Status</p>
              <p className="font-semibold text-lg">
                <span
                  className={`px-3 py-1 rounded-full text-sm ${
                    isPaid
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Order Date</p>
              <p className="font-semibold">
                {new Date(order.created_at).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Amount</p>
              <p className="font-semibold text-lg text-blue-600">
                ETB {order.total_amount.toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        <div className="border-t pt-6">
          <h3 className="font-semibold text-lg mb-4">Order Items</h3>
          <div className="space-y-3">
            {order.items.map((item, index) => (
              <div
                key={index}
                className="flex justify-between items-center p-3 bg-gray-50 rounded"
              >
                <div>
                  <p className="font-semibold">{item.product_name}</p>
                  <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">ETB {item.subtotal.toFixed(2)}</p>
                  <p className="text-sm text-gray-600">
                    ETB {item.price.toFixed(2)} each
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t pt-6">
          <h3 className="font-semibold text-lg mb-4">Delivery Address</h3>
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="font-semibold">{order.delivery_address.full_name}</p>
            <p className="text-gray-700">{order.delivery_address.address}</p>
            <p className="text-gray-700">
              {order.delivery_address.city}, {order.delivery_address.postal_code}
            </p>
            <p className="text-gray-700">{order.delivery_address.country}</p>
          </div>
        </div>

        <div className="border-t pt-6">
          <h3 className="font-semibold text-lg mb-4">Delivery Status</h3>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex flex-col items-center">
                <CheckCircle className="w-6 h-6 text-green-500 mb-2" />
                <div className="w-1 h-8 bg-gray-300" />
              </div>
              <div>
                <p className="font-semibold">Order Confirmed</p>
                <p className="text-sm text-gray-600">
                  {new Date(order.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex flex-col items-center">
                <div
                  className={`w-6 h-6 rounded-full border-2 ${
                    isPaid ? 'bg-green-500 border-green-500' : 'border-gray-300'
                  } mb-2`}
                />
                <div className="w-1 h-8 bg-gray-300" />
              </div>
              <div>
                <p className="font-semibold">Payment Received</p>
                <p className="text-sm text-gray-600">
                  {isPaid ? 'Completed' : 'Pending'}
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="w-6 h-6 rounded-full border-2 border-gray-300 mb-2" />
                <div className="w-1 h-8 bg-gray-300" />
              </div>
              <div>
                <p className="font-semibold">Item Shipped</p>
                <p className="text-sm text-gray-600">Coming soon</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex flex-col items-center">
                <Truck className="w-6 h-6 text-gray-400" />
              </div>
              <div>
                <p className="font-semibold">Delivered</p>
                <p className="text-sm text-gray-600">Estimated in 3-5 business days</p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <div className="flex gap-4 justify-center flex-wrap">
        <Link href="/">
          <Button variant="outline" className="flex items-center gap-2">
            <Home className="w-5 h-5" />
            Back to Home
          </Button>
        </Link>
        <Link href="/orders">
          <Button className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            View All Orders
          </Button>
        </Link>
      </div>

      <Card className="bg-blue-50 border border-blue-200">
        <p className="font-semibold mb-2">Need Help?</p>
        <p className="text-sm text-gray-700 mb-4">
          If you have any questions about your order, please contact our customer support
          team.
        </p>
        <Button variant="outline" className="text-sm">
          Contact Support
        </Button>
      </Card>
    </div>
  );
}

export default function OrderConfirmationPage({ params }: Props) {
  const { id } = use(params);

  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
        </div>
      }
    >
      <OrderConfirmationContent id={id} />
    </Suspense>
  );
}
