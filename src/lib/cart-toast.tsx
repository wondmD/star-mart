'use client';

import Link from 'next/link';
import toast from 'react-hot-toast';
import { ShoppingCart } from 'lucide-react';

type CartToastOptions = {
  productName?: string;
  quantity?: number;
};

export function showCartToast({ productName, quantity = 1 }: CartToastOptions = {}): void {
  const productLabel = productName ? ` ${productName}` : '';
  const quantityLabel = quantity > 1 ? `${quantity} items` : 'item';
  const title = productName
    ? `Added ${quantityLabel}${productLabel} to cart`
    : 'Added to cart';

  toast.custom(
    (t) => (
      <div
        className={`pointer-events-auto flex w-[min(92vw,24rem)] items-center justify-between gap-4 rounded-2xl border px-4 py-3 shadow-2xl transition-all duration-300 ${
          t.visible ? 'translate-y-0 opacity-100' : '-translate-y-3 opacity-0'
        }`}
        style={{
          backgroundColor: 'var(--bg-secondary)',
          borderColor: 'var(--border-color)',
        }}
      >
        <div className="flex items-start gap-3">
          <div
            className="mt-0.5 rounded-full p-2"
            style={{ backgroundColor: 'var(--accent-light)' }}
          >
            <ShoppingCart
              className="h-4 w-4"
              style={{ color: 'var(--accent-secondary)' }}
            />
          </div>
          <div>
            <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
              {title}
            </p>
            <p className="mt-1 text-xs" style={{ color: 'var(--text-secondary)' }}>
              View your cart to review items or continue shopping.
            </p>
          </div>
        </div>

        <Link
          href="/cart"
          onClick={() => toast.dismiss(t.id)}
          className="shrink-0 rounded-full px-3 py-2 text-sm font-semibold transition hover:opacity-90"
          style={{
            backgroundColor: 'var(--accent-primary)',
            color: 'var(--text-on-amber)',
          }}
        >
          View cart
        </Link>
      </div>
    ),
    {
      duration: 4500,
      position: 'top-center',
    },
  );
}
