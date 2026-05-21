"use client";

import { ProductCard } from '@/components/ProductCard';
import { useProducts } from '@/hooks/useProducts';
import { Button } from './Button';

type Props = {
  title: string;
  category?: string;
  compact?: boolean;
};

export function ProductCarousel({ title, category, compact = true }: Props) {
  const query = category ? { category } : { minPrice: 0, maxPrice: 100000 };
  const { data: products, isLoading } = useProducts(query as any);

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-2xl font-bold">{title}</h3>
        <Button variant="outline">See More</Button>
      </div>

      {isLoading ? (
        <div className="h-48 rounded animate-pulse" style={{ backgroundColor: 'var(--bg-secondary)' }} />
      ) : (
        compact ? (
          <div className="flex gap-4 overflow-x-auto no-scrollbar py-2">
            {products?.slice(0, 12).map((p: any) => (
              <div key={p.id} className="min-w-55 max-w-55">
                <ProductCard product={p} onAddToCart={() => {}} />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {products?.slice(0, 8).map((p: any) => (
              <ProductCard key={p.id} product={p} onAddToCart={() => {}} />
            ))}
          </div>
        )
      )}
    </section>
  );
}
