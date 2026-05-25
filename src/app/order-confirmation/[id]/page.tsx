'use client';

import { Suspense, use } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { useOrder } from '@/hooks/useOrders';
import { useAuthStore } from '@/stores/auth-store';
import { useOrderPaymentVerification } from '@/hooks/useOrderPaymentVerification';
import { Button } from '@/components/Button';
import { OrderConfirmationHeader } from '@/components/order-confirmation/OrderConfirmationHeader';
import { PaymentRequiredCard } from '@/components/order-confirmation/PaymentRequiredCard';
import { OrderDetailsCard } from '@/components/order-confirmation/OrderDetailsCard';
import { OrderConfirmationActions } from '@/components/order-confirmation/OrderConfirmationActions';
import { OrderHelpCard } from '@/components/order-confirmation/OrderHelpCard';

interface Props {
  params: Promise<{ id: string }>;
}

function OrderConfirmationContent({ id }: { id: string }) {
  const searchParams = useSearchParams();
  const returnedFromPayment = searchParams.get('payment') === 'return';
  const { user } = useAuthStore();
  const { data: order, isLoading, refetch } = useOrder(id);
  const { isVerifyingPayment, paymentPending, setPaymentPending } =
    useOrderPaymentVerification({
      orderId: id,
      order,
      isLoading,
      returnedFromPayment,
      refetch,
    });

  if (isLoading || isVerifyingPayment) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-12">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
        <p className="text-gray-600">
          {isVerifyingPayment ? 'Confirming your StarPay payment…' : 'Loading order…'}
        </p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="py-12 text-center">
        <p className="mb-4 text-lg text-gray-600">Order not found</p>
        <Link href="/">
          <Button>Back to Home</Button>
        </Link>
      </div>
    );
  }

  const isPaid = order.status === 'paid';
  const showPayActions = !isPaid && (paymentPending || returnedFromPayment);

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <OrderConfirmationHeader isPaid={isPaid} />

      {showPayActions ? (
        <PaymentRequiredCard
          orderId={order.id}
          customerEmail={user?.email}
          onPaid={() => {
            setPaymentPending(false);
            void refetch();
          }}
        />
      ) : null}

      <OrderDetailsCard order={order} isPaid={isPaid} />
      <OrderConfirmationActions />
      <OrderHelpCard />
    </div>
  );
}

export default function OrderConfirmationPage({ params }: Props) {
  const { id } = use(params);

  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
        </div>
      }
    >
      <OrderConfirmationContent id={id} />
    </Suspense>
  );
}
