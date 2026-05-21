'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useCartStore } from '@/stores/cart-store';
import { useAuthStore } from '@/stores/auth-store';
import { Button } from '@/components/Button';
import { Card } from '@/components/FormElements';
import { Trash2, ShoppingCart, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { CartItemSkeleton, OrderSummarySkeleton } from '@/components/Skeleton';

export default function CartPage() {
  const router = useRouter();
  const { items, removeItem, updateQuantity, getTotal, clearCart } = useCartStore();
  const { user, loading: authLoading } = useAuthStore();

  const handleCheckout = () => {
    if (!user) {
      toast.error('Please log in to checkout');
      router.push('/login');
      return;
    }

    if (items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    router.push('/checkout');
  };

  if (authLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-t-transparent mb-4" style={{ borderColor: 'var(--border-color)', borderTopColor: 'var(--accent-primary)' }} />
        <p className="text-gray-600">Loading cart…</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <Link href="/products" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4">
          <ArrowLeft className="w-4 h-4" />
          Continue Shopping
        </Link>
        <h1 className="text-4xl font-bold">Shopping Cart</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {authLoading ? (
            [...Array(3)].map((_, i) => <CartItemSkeleton key={i} />)
          ) : (
            items.map((item) => (
              <Card key={item.product_id} className="flex gap-6">
                <div className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                  <Image
                    src={item.product.image_url}
                    alt={item.product.name}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="flex-1 flex flex-col">
                  <Link href={`/products/${item.product_id}`}>
                    <h3 className="font-semibold text-gray-900 hover:text-blue-600">
                      {item.product.name}
                    </h3>
                  </Link>
                  <p className="text-sm text-gray-600">{item.product.category}</p>
                  <p className="font-bold text-blue-600 mt-2">
                    ETB {item.product.price.toFixed(2)}
                  </p>
                </div>

                <div className="flex flex-col items-end justify-between">
                  <button
                    onClick={() => removeItem(item.product_id)}
                    className="text-red-600 hover:text-red-700 p-2"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>

                  <div className="flex items-center gap-2 border rounded-lg">
                    <button
                      onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                      className="px-3 py-1 hover:bg-gray-100"
                    >
                      −
                    </button>
                    <span className="px-3 py-1 font-semibold">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                      className="px-3 py-1 hover:bg-gray-100"
                    >
                      +
                    </button>
                  </div>

                  <p className="font-bold text-gray-900">
                    ETB {(item.product.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              </Card>
            ))
          )}
        </div>

        {/* Order Summary */}
        <div>
          {authLoading ? (
            <OrderSummarySkeleton />
          ) : (
            <Card className="space-y-4 sticky top-20">
              <h2 className="text-2xl font-bold">Order Summary</h2>

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
                  <span className="text-gray-600">Tax</span>
                  <span className="font-semibold">ETB {(getTotal() * 0.15).toFixed(2)}</span>
                </div>
              </div>

              <div className="flex justify-between text-xl font-bold">
                <span>Total</span>
                <span className="text-blue-600">ETB {(getTotal() * 1.15).toFixed(2)}</span>
              </div>

              <Button size="lg" className="w-full" onClick={handleCheckout}>
                Proceed to Checkout
              </Button>

              <Button
                variant="outline"
                className="w-full"
                onClick={() => router.push('/products')}
              >
                Continue Shopping
              </Button>

              <button
                onClick={() => clearCart()}
                className="w-full text-red-600 hover:text-red-700 py-2 font-semibold"
              >
                Clear Cart
              </button>

              {/* Trust Badges */}
              <div className="pt-4 border-t space-y-2 text-xs text-gray-600 text-center">
                <p>✓ Secure Checkout</p>
                <p>✓ Money-back Guarantee</p>
                <p>✓ 30-day Returns</p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
