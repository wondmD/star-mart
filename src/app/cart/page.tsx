'use client';

import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { useCartStore } from '@/stores/cart-store';
import { useAuthStore } from '@/stores/auth-store';
import { CartItemSkeleton, OrderSummarySkeleton } from '@/components/Skeleton';
import { CartPageHeader } from '@/components/cart/CartPageHeader';
import { CartItemRow } from '@/components/cart/CartItemRow';
import { CartSummary } from '@/components/cart/CartSummary';
import { getLoginPath } from '@/services/auth';

export default function CartPage() {
  const router = useRouter();
  const { items, removeItem, updateQuantity, getTotal, clearCart } = useCartStore();
  const { user, loading: authLoading } = useAuthStore();

  const handleCheckout = () => {
    if (!user) {
      toast.error('Please log in to checkout');
      router.push(getLoginPath({ returnTo: '/checkout' }));
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
      <div className="flex flex-col items-center justify-center px-4 py-16 sm:px-6 lg:px-8">
        <div
          className="mb-4 h-10 w-10 animate-spin rounded-full border-4 border-t-transparent"
          style={{ borderColor: 'var(--border-color)', borderTopColor: 'var(--accent-primary)' }}
        />
        <p className="text-gray-600">Loading cart…</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 px-4 sm:px-6 lg:px-8">
      <CartPageHeader />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          {items.map((item) => (
            <CartItemRow
              key={item.product_id}
              item={item}
              onRemove={removeItem}
              onUpdateQuantity={updateQuantity}
            />
          ))}
        </div>

        <div>
          {authLoading ? (
            <OrderSummarySkeleton />
          ) : (
            <CartSummary
              subtotal={getTotal()}
              onCheckout={handleCheckout}
              onClearCart={clearCart}
            />
          )}
        </div>
      </div>
    </div>
  );
}
