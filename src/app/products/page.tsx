'use client';

import { Suspense, useCallback, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useProducts } from '@/hooks/useProducts';
import { useCartStore } from '@/stores/cart-store';
import { showCartToast } from '@/lib/cart-toast';
import ProductsFilterPanel from '@/components/ProductsFilterPanel';
import ProductList from '@/components/ProductList';

const CATEGORIES = [
  { value: '', label: 'All Categories' },
  { value: 'Photography', label: 'Photography' },
  { value: 'Audio', label: 'Audio' },
  { value: 'Mobile', label: 'Mobile' },
  { value: 'Networking', label: 'Networking' },
  { value: 'Home Appliances', label: 'Home Appliances' },
  { value: 'Fashion', label: 'Fashion' },
];

function ProductsPageContent() {
  const searchParams = useSearchParams();
  const search = searchParams.get('search') ?? '';
  const category = searchParams.get('category') ?? '';
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const filters = useMemo(() => ({
    search: search || undefined,
    category: category || undefined,
    minPrice: minPrice ? parseInt(minPrice) : undefined,
    maxPrice: maxPrice ? parseInt(maxPrice) : undefined,
  }), [search, category, minPrice, maxPrice]);

  const { data: products, isLoading, error } = useProducts(filters);
  const { addItem } = useCartStore();

  const handleAddToCart = useCallback((product: any) => {
    addItem(product, 1);
    showCartToast({ productName: product.name });
  }, [addItem]);

  return (
    <div className="grid gap-6 pt-0 pr-2 sm:pr-4 lg:pr-6 lg:grid-cols-[18rem_minmax(0,1fr)]">
      <ProductsFilterPanel
        categories={CATEGORIES}
        minPrice={minPrice}
        maxPrice={maxPrice}
        onMinPriceChange={setMinPrice}
        onMaxPriceChange={setMaxPrice}
      />

      <section className="space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-black sm:text-4xl" style={{ color: 'var(--text-primary)' }}>Products</h1>
          <p className="max-w-2xl text-sm sm:text-base" style={{ color: 'var(--text-secondary)' }}>
            Browse our collection of quality products.
          </p>
        </div>

        {/* Results Count */}
        <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          {products && `Showing ${products.length} product${products.length !== 1 ? 's' : ''}`}
        </div>

        <ProductList
          products={products}
          isLoading={isLoading}
          error={error}
          onAddToCart={handleAddToCart}
        />
      </section>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="py-12 text-center text-sm" style={{ color: 'var(--text-secondary)' }}>
          Loading products…
        </div>
      }
    >
      <ProductsPageContent />
    </Suspense>
  );
}
