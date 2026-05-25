'use client';

import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { paymentService } from '@/services/payment';
import { Order } from '@/types';

const POLL_ATTEMPTS = 6;
const POLL_INTERVAL_MS = 2000;

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

interface UseOrderPaymentVerificationOptions {
  orderId: string;
  order: Order | undefined;
  isLoading: boolean;
  returnedFromPayment: boolean;
  refetch: () => Promise<unknown>;
}

export function useOrderPaymentVerification({
  orderId,
  order,
  isLoading,
  returnedFromPayment,
  refetch,
}: UseOrderPaymentVerificationOptions) {
  const [isVerifyingPayment, setIsVerifyingPayment] = useState(returnedFromPayment);
  const [paymentPending, setPaymentPending] = useState(false);

  const verifyAndRefresh = useCallback(async () => {
    const result = await paymentService.getPaymentStatus(orderId);
    await refetch();
    return result;
  }, [orderId, refetch]);

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

  return {
    isVerifyingPayment,
    paymentPending,
    setPaymentPending,
    verifyAndRefresh,
  };
}
