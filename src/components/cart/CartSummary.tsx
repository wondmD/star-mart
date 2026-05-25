'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/Button';
import { Card } from '@/components/FormElements';
import { totalWithTax } from '@/lib/checkout-totals';

interface CartSummaryProps {
  subtotal: number;
  onCheckout: () => void;
  onClearCart: () => void;
}

export function CartSummary({ subtotal, onCheckout, onClearCart }: CartSummaryProps) {
  const router = useRouter();
  const orderTotal = totalWithTax(subtotal);
  const taxAmount = orderTotal - subtotal;

  return (
    <Card className="sticky top-20 space-y-4">
      <h2 className="text-2xl font-bold">Order Summary</h2>

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
          <span className="text-gray-600">Tax</span>
          <span className="font-semibold">ETB {taxAmount.toFixed(2)}</span>
        </div>
      </div>

      <div className="flex justify-between text-xl font-bold">
        <span>Total</span>
        <span className="text-blue-600">ETB {orderTotal.toFixed(2)}</span>
      </div>

      <Button size="lg" className="w-full" onClick={onCheckout}>
        Proceed to Checkout
      </Button>

      <Button variant="outline" className="w-full" onClick={() => router.push('/products')}>
        Continue Shopping
      </Button>

      <button
        type="button"
        onClick={onClearCart}
        className="w-full py-2 font-semibold text-red-600 hover:text-red-700"
      >
        Clear Cart
      </button>

      <div className="space-y-2 border-t pt-4 text-center text-xs text-gray-600">
        <p>✓ Secure Checkout</p>
        <p>✓ Money-back Guarantee</p>
        <p>✓ 30-day Returns</p>
      </div>
    </Card>
  );
}
