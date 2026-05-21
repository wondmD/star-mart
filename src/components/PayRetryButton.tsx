'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CreditCard, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

import { Button } from '@/components/Button';
import { paymentService } from '@/services/payment';

interface PayRetryButtonProps {
  orderId: string;
  customerEmail?: string;
  variant?: 'primary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  onPaid?: () => void;
  className?: string;
}

export function PayRetryButton({
  orderId,
  customerEmail,
  variant = 'primary',
  size = 'md',
  label = 'Pay now',
  onPaid,
  className,
}: PayRetryButtonProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handlePay = async () => {
    setIsLoading(true);
    try {
      const result = await paymentService.retryPayment(orderId, customerEmail);

      if (result.success) {
        toast.success(result.message || 'Payment already completed');
        onPaid?.();
        router.refresh();
        return;
      }

      if (result.payment_url) {
        toast.success('Redirecting to StarPay…', { duration: 3000 });
        window.location.href = result.payment_url;
        return;
      }

      toast.error(result.message || 'Could not start payment');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Payment failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      loading={isLoading}
      onClick={(event) => {
        event.stopPropagation();
        void handlePay();
      }}
      className={`flex items-center gap-2 ${className ?? ''}`}
    >
      {label === 'Try again' ? (
        <RefreshCw className="w-4 h-4" />
      ) : (
        <CreditCard className="w-4 h-4" />
      )}
      {label}
    </Button>
  );
}
