import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/types';
import { Card } from './FormElements';
import { Button } from './Button';
import { ShoppingCart, Eye } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  const discountPercentage = product.discount_price
    ? Math.round(((product.price - product.discount_price) / product.price) * 100)
    : 0;

  return (
    <Card
      className="flex flex-col h-full transition-all border"
      style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-color)' }}
    >
      <div className="relative w-full h-48 mb-4 overflow-hidden p-3" style={{ backgroundColor: 'var(--bg-secondary)' }}>
        <Image
          src={product.image_url}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, 25vw"
          className="object-contain"
        />

        {discountPercentage > 0 && (
          <div
            className="absolute top-2 right-2 px-3 py-1 rounded-lg text-sm font-bold"
            style={{
              backgroundColor: 'var(--badge-sale-bg)',
              color: 'var(--badge-sale-text)',
            }}
          >
            -{discountPercentage}%
          </div>
        )}

        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <p className="text-white text-lg font-bold">Out of Stock</p>
          </div>
        )}
      </div>

      <div className="flex-1 flex flex-col px-2 pb-3">
        <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
          {product.name}
        </h3>

        <p className="text-sm mb-3 line-clamp-2" style={{ color: 'var(--text-secondary)' }}>
          {product.description}
        </p>

        <div className="mb-4">
          <span className="text-xs uppercase tracking-wide font-semibold" style={{ color: 'var(--accent-primary)' }}>
            {product.category}
          </span>
        </div>

        <div className="flex items-baseline gap-2 mb-4">
          {product.discount_price ? (
            <>
              <span className="text-2xl font-bold" style={{ color: 'var(--accent-primary)' }}>
                ETB {product.discount_price.toFixed(2)}
              </span>
              <span className="text-lg line-through" style={{ color: 'var(--text-tertiary)' }}>
                ETB {product.price.toFixed(2)}
              </span>
            </>
          ) : (
            <span className="text-2xl font-bold" style={{ color: 'var(--accent-primary)' }}>
              ETB {product.price.toFixed(2)}
            </span>
          )}
        </div>

        <div className="flex gap-2 mt-auto pt-4 border-t" style={{ borderColor: 'var(--border-color)' }}>
          <Link href={`/products/${product.id}`} className="flex-1">
            <Button variant="outline" size="sm" className="w-full inline-flex items-center justify-center gap-2 leading-none">
              <Eye className="w-4 h-4 shrink-0" />
              View
            </Button>
          </Link>
          <Button size="sm" className="flex-1 inline-flex items-center justify-center gap-2 leading-none" disabled={product.stock === 0} onClick={() => onAddToCart?.(product)}>
            <ShoppingCart className="w-4 h-4 shrink-0" />
            Add
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ProductCard;
