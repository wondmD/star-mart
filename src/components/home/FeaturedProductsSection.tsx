'use client';

import Link from 'next/link';
import { Button } from '@/components/Button';
import { ProductCard } from '@/components/ProductCard';
import { ProductCardSkeleton } from '@/components/Skeleton';
import { Product } from '@/types';

interface FeaturedProductsSectionProps {
  products: Product[];
  isLoading: boolean;
  onAddToCart: (product: Product) => void;
}

export function FeaturedProductsSection({
  products,
  isLoading,
  onAddToCart,
}: FeaturedProductsSectionProps) {
  return (
    <section>
      <div className="mb-8 flex items-center justify-between gap-4">
        <div>
          <p
            className="text-sm font-semibold uppercase tracking-[0.2em]"
            style={{ color: 'var(--text-tertiary)' }}
          >
            Curated picks
          </p>
          <h2 className="mt-2 text-3xl font-black" style={{ color: 'var(--text-primary)' }}>
            Featured Products
          </h2>
        </div>
        <Link href="/products">
          <Button variant="outline">View All</Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(8)].map((_, index) => (
            <ProductCardSkeleton key={index} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} />
          ))}
        </div>
      )}
    </section>
  );
}
