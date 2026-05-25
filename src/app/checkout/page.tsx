'use client';

import { useState } from 'react';
import { useFormStore } from '@/stores/form-store';
import { useCartStore } from '@/stores/cart-store';
import { useAuthStore } from '@/stores/auth-store';
import { useCreateOrder } from '@/hooks/useOrders';
import { paymentService } from '@/services/payment';
import { totalWithTax } from '@/lib/checkout-totals';
import { FullPageSpinner } from '@/components/Spinner';
import { CheckoutEmptyState } from '@/components/checkout/CheckoutEmptyState';
import { CheckoutAuthGate } from '@/components/checkout/CheckoutAuthGate';
import { DeliveryForm } from '@/components/checkout/DeliveryForm';
import { CheckoutOrderSummary } from '@/components/checkout/CheckoutOrderSummary';
import toast from 'react-hot-toast';

export default function CheckoutPage() {
  const { items, getTotal, clearCart } = useCartStore();
  const { user, loading: authLoading } = useAuthStore();
  const { mutateAsync: createOrder, isPending: isCreatingOrder } = useCreateOrder();
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const { resetForm, getFieldError } = useFormStore();
  const submitError = getFieldError('submit');

  if (items.length === 0) {
    return <CheckoutEmptyState />;
  }

  if (authLoading) {
    return <FullPageSpinner message="Loading your account…" />;
  }

  if (!user) {
    return <CheckoutAuthGate />;
  }

  const subtotal = getTotal();
  const orderTotal = totalWithTax(subtotal);
  const taxAmount = orderTotal - subtotal;

  const handleSubmit = async (values: {
    full_name: string;
    phone_number: string;
    address: string;
    city: string;
    postal_code: string;
    country: string;
    notes?: string;
  }) => {
    try {
      setIsProcessingPayment(true);

      const order = await createOrder({
        items,
        delivery_address: values,
        payment_method: 'starpay',
      });

      const paymentResponse = await paymentService.initiatePayment({
        order_id: order.id,
        customer_email: user.email,
      });

      if (!paymentResponse.payment_url) {
        throw new Error(paymentResponse.message || 'StarPay did not return a payment URL');
      }

      clearCart();
      resetForm();
      toast.success('Redirecting to StarPay…', { duration: 3000 });
      window.location.href = paymentResponse.payment_url;
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Checkout failed');
      setIsProcessingPayment(false);
    }
  };

  return (
    <div className="space-y-8 px-4 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold">Checkout</h1>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="space-y-8 lg:col-span-2">
          <DeliveryForm
            user={user}
            submitError={submitError}
            isSubmitting={isCreatingOrder || isProcessingPayment}
            onSubmit={handleSubmit}
          />
        </div>

        <CheckoutOrderSummary
          items={items}
          subtotal={subtotal}
          taxAmount={taxAmount}
          orderTotal={orderTotal}
          isLoading={isCreatingOrder || isProcessingPayment}
        />
      </div>
    </div>
  );
}
