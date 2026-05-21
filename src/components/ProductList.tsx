"use client";

import React from 'react';
import { ProductCard } from '@/components/ProductCard';
import { ProductCardSkeleton } from '@/components/Skeleton';

type Product = any;

type Props = {
  products?: Product[];
  isLoading: boolean;
  error?: unknown;
  onAddToCart: (product: Product) => void;
};

export const ProductList = React.memo(function ProductList({ products, isLoading, error, onAddToCart }: Props) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {[...Array(12)].map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border p-6 text-center" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}>
        <p style={{ color: 'var(--error)' }}>Failed to load products. Please try again.</p>
      </div>
    );
  }

  if (products && products.length > 0) {
    return (
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={onAddToCart}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="rounded-2xl py-12 text-center" style={{ backgroundColor: 'var(--bg-secondary)' }}>
      <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>No products found. Try adjusting your filters.</p>
    </div>
  );
});

export default ProductList;
