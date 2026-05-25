import { Package } from 'lucide-react';
import { Card } from '@/components/FormElements';
import { OrderSummarySkeleton } from '@/components/Skeleton';
import { CartItem } from '@/types';

interface CheckoutOrderSummaryProps {
  items: CartItem[];
  subtotal: number;
  taxAmount: number;
  orderTotal: number;
  isLoading?: boolean;
}

export function CheckoutOrderSummary({
  items,
  subtotal,
  taxAmount,
  orderTotal,
  isLoading = false,
}: CheckoutOrderSummaryProps) {
  if (isLoading) {
    return <OrderSummarySkeleton />;
  }

  return (
    <Card className="sticky top-20 space-y-4">
      <div className="flex items-center gap-2 border-b pb-4">
        <Package className="h-6 w-6 text-blue-600" />
        <h3 className="text-xl font-bold">Order Summary</h3>
      </div>

      <div className="max-h-96 space-y-3 overflow-y-auto">
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
          <span className="font-semibold">ETB {subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Shipping</span>
          <span className="font-semibold">Free</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Tax (15%)</span>
          <span className="font-semibold">ETB {taxAmount.toFixed(2)}</span>
        </div>
      </div>

      <div className="flex justify-between text-xl font-bold text-blue-600">
        <span>Total</span>
        <span>ETB {orderTotal.toFixed(2)}</span>
      </div>

      <div className="rounded border border-green-200 bg-green-50 p-3 text-xs text-green-800">
        <p className="mb-1 font-semibold">✓ Secure Checkout</p>
        <p>Your payment information is encrypted and secure</p>
      </div>

      <div className="rounded border border-blue-200 bg-blue-50 p-3 text-xs text-blue-900">
        <p className="mb-1 font-semibold">StarPay Payment</p>
        <p>You will be redirected to StarPay to pay securely. Test phone: 0900000000</p>
      </div>
    </Card>
  );
}
