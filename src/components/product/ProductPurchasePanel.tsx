'use client';

import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/Button';
import { Card } from '@/components/FormElements';
import { Product } from '@/types';

interface ProductPurchasePanelProps {
  product: Product;
  quantity: number;
  onQuantityChange: (quantity: number) => void;
  onAddToCart: () => void;
}

export function ProductPurchasePanel({
  product,
  quantity,
  onQuantityChange,
  onAddToCart,
}: ProductPurchasePanelProps) {
  const displayPrice = product.discount_price ?? product.price;

  return (
    <div className="space-y-6">
      <div>
        <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-gray-600">
          {product.category}
        </p>
        <h1 className="mb-4 text-4xl font-bold text-gray-900">{product.name}</h1>

        <div className="mb-6 flex items-baseline gap-4">
          <span className="text-4xl font-bold text-blue-600">ETB {displayPrice.toFixed(2)}</span>
          {product.discount_price ? (
            <span className="text-2xl text-gray-500 line-through">
              ETB {product.price.toFixed(2)}
            </span>
          ) : null}
        </div>

        <p className="leading-relaxed text-gray-700">{product.description}</p>
      </div>

      <Card className="space-y-4">
        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-700">Quantity</label>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
              className="rounded-lg border px-4 py-2 hover:bg-gray-100"
            >
              −
            </button>
            <span className="w-12 text-center text-lg font-semibold">{quantity}</span>
            <button
              type="button"
              onClick={() => onQuantityChange(Math.min(product.stock, quantity + 1))}
              className="rounded-lg border px-4 py-2 hover:bg-gray-100"
              disabled={quantity >= product.stock}
            >
              +
            </button>
          </div>
        </div>

        <div className="text-sm text-gray-600">
          <p>
            Stock: <span className="font-semibold">{product.stock} available</span>
          </p>
        </div>

        <Button
          size="lg"
          className="flex w-full items-center justify-center gap-2"
          onClick={onAddToCart}
          disabled={product.stock === 0}
        >
          <ShoppingCart className="h-5 w-5" />
          Add to Cart
        </Button>
      </Card>
    </div>
  );
}
