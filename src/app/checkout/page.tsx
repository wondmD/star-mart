'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Formik, Form } from 'formik';
import { Button } from '@/components/Button';
import { FormikInput, FormikTextArea, FormikSelect, Card } from '@/components/FormElements';
import { FormikZustandBridge } from '@/components/FormikZustandBridge';
import { useFormStore } from '@/stores/form-store';
import { checkoutValidationSchema } from '@/schemas';
import { useCartStore } from '@/stores/cart-store';
import { useAuthStore } from '@/stores/auth-store';
import { useCreateOrder } from '@/hooks/useOrders';
import { paymentService } from '@/services/payment';
import toast from 'react-hot-toast';
import { CreditCard, Package, MapPin } from 'lucide-react';
import { OrderSummarySkeleton } from '@/components/Skeleton';
import { FullPageSpinner } from '@/components/Spinner';

const COUNTRIES = [
  { value: 'Ethiopia', label: 'Ethiopia' },
  { value: 'Kenya', label: 'Kenya' },
  { value: 'Uganda', label: 'Uganda' },
];

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotal, clearCart } = useCartStore();
  const { user, loading: authLoading } = useAuthStore();
  const { mutateAsync: createOrder, isPending: isCreatingOrder } = useCreateOrder();
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const { resetForm, getFieldError } = useFormStore();
  const submitError = getFieldError('submit');

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-gray-600 mb-4">Your cart is empty</p>
        <Button onClick={() => router.push('/products')}>Continue Shopping</Button>
      </div>
    );
  }

  if (authLoading) {
    return <FullPageSpinner message="Loading your account…" />;
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-gray-600 mb-4">Please log in to checkout</p>
        <Button onClick={() => router.push('/auth/login')}>Sign in</Button>
      </div>
    );
  }

  const orderTotal = getTotal() * 1.15;

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
    <div className="space-y-8">
      <h1 className="text-4xl font-bold">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Delivery Information */}
        <div className="lg:col-span-2 space-y-8">
          <Card>
            <div className="flex items-center gap-3 mb-6">
              <MapPin className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl font-bold">Delivery Information</h2>
            </div>

            <Formik
              initialValues={{
                full_name: user.full_name || '',
                phone_number: '',
                address: '',
                city: '',
                postal_code: '',
                country: 'Ethiopia',
                notes: '',
              }}
              validationSchema={checkoutValidationSchema}
              validateOnChange
              validateOnBlur
              onSubmit={handleSubmit}
            >
              {({ isSubmitting }) => (
                <Form className="space-y-6">
                  <FormikZustandBridge />
                  {submitError && (
                    <p className="text-sm text-red-600 rounded-lg px-4 py-3 border border-red-200 bg-red-50">
                      {submitError}
                    </p>
                  )}
                  <div className="grid grid-cols-2 gap-4">
                    <FormikInput
                      name="full_name"
                      label="Full Name"
                      placeholder="John Doe"
                    />
                    <FormikInput
                      name="phone_number"
                      label="Phone Number"
                      placeholder="0900000000"
                    />
                  </div>

                  <FormikInput
                    name="address"
                    label="Street Address"
                    placeholder="123 Main Street"
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormikInput
                      name="city"
                      label="City"
                      placeholder="Addis Ababa"
                    />
                    <FormikInput
                      name="postal_code"
                      label="Postal Code"
                      placeholder="1000"
                    />
                  </div>

                  <FormikSelect
                    name="country"
                    label="Country"
                    options={COUNTRIES}
                  />

                  <FormikTextArea
                    name="notes"
                    label="Order Notes (Optional)"
                    placeholder="Special instructions for delivery..."
                    rows={4}
                  />

                  <div className="flex gap-4 pt-6 border-t">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => router.back()}
                      type="button"
                    >
                      Back to Cart
                    </Button>
                    <Button
                      type="submit"
                      size="lg"
                      className="flex-1 flex items-center justify-center gap-2"
                      loading={isSubmitting || isCreatingOrder || isProcessingPayment}
                    >
                      <CreditCard className="w-5 h-5" />
                      Complete Order
                    </Button>
                  </div>
                </Form>
              )}
            </Formik>
          </Card>
        </div>

        {/* Order Summary */}
        <div>
          {isCreatingOrder || isProcessingPayment ? (
            <OrderSummarySkeleton />
          ) : (
            <Card className="sticky top-20 space-y-4">
              <div className="flex items-center gap-2 pb-4 border-b">
                <Package className="w-6 h-6 text-blue-600" />
                <h3 className="text-xl font-bold">Order Summary</h3>
              </div>

              <div className="space-y-3 max-h-96 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.product_id} className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      {item.product.name} x{item.quantity}
                    </span>
                    <span className="font-semibold">
                      ETB {(item.product.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="space-y-2 border-y py-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold">ETB {getTotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-semibold">Free</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax (15%)</span>
                  <span className="font-semibold">
                    ETB {(getTotal() * 0.15).toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="flex justify-between text-xl font-bold text-blue-600">
                <span>Total</span>
                <span>ETB {orderTotal.toFixed(2)}</span>
              </div>

              {/* Security Info */}
              <div className="bg-green-50 border border-green-200 rounded p-3 text-xs text-green-800">
                <p className="font-semibold mb-1">✓ Secure Checkout</p>
                <p className="text-xs">Your payment information is encrypted and secure</p>
              </div>

              {/* Payment Info */}
              <div className="bg-blue-50 border border-blue-200 rounded p-3 text-xs text-blue-900">
                <p className="font-semibold mb-1">StarPay Payment</p>
                <p className="text-xs">
                  You will be redirected to StarPay to pay securely. Test phone: 0900000000
                </p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
