'use client';

import { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useProducts } from '@/hooks/useProducts';
import { ProductCard } from '@/components/ProductCard';
import { Input, Select } from '@/components/FormElements';
import { useCartStore } from '@/stores/cart-store';
import { showCartToast } from '@/lib/cart-toast';
import { Filter, ChevronDown, ChevronUp } from 'lucide-react';
import { ProductCardSkeleton, FilterSidebarSkeleton } from '@/components/Skeleton';

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
  const [filtersOpen, setFiltersOpen] = useState(false);

  const filters = {
    search: search || undefined,
    category: category || undefined,
    minPrice: minPrice ? parseInt(minPrice) : undefined,
    maxPrice: maxPrice ? parseInt(maxPrice) : undefined,
  };

  const { data: products, isLoading, error } = useProducts(filters);
  const { addItem } = useCartStore();

  const handleAddToCart = (product: any) => {
    addItem(product, 1);
    showCartToast({ productName: product.name });
  };

  return (
    <div className="grid gap-6 pt-0 pr-2 sm:pr-4 lg:pr-6 lg:grid-cols-[18rem_minmax(0,1fr)]">
      <div className="lg:hidden">
        <button
          type="button"
          onClick={() => setFiltersOpen(!filtersOpen)}
          className="flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-sm font-semibold"
          style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
        >
          <span className="flex items-center gap-2">
            <Filter className="h-4 w-4" style={{ color: 'var(--accent-secondary)' }} />
            Filters
          </span>
          {filtersOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>

        {filtersOpen && (
          <aside className="mt-4 w-[min(24rem,calc(100vw-2rem))] rounded-3xl border p-5 shadow-sm mx-auto" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}>
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em]" style={{ color: 'var(--text-tertiary)' }}>Filter by</p>
                <h2 className="mt-1 text-2xl font-black" style={{ color: 'var(--text-primary)' }}>Category</h2>
              </div>
              <Filter className="h-5 w-5" style={{ color: 'var(--accent-secondary)' }} />
            </div>

            <div className="mt-5 space-y-2">
              {CATEGORIES.map((item) => {
                const isActive = category === item.value;
                const query = new URLSearchParams();

                if (search) query.set('search', search);
                if (item.value) query.set('category', item.value);

                return (
                  <a
                    key={item.label}
                    href={`/products${query.toString() ? `?${query.toString()}` : ''}`}
                    className="flex items-center justify-between rounded-2xl border px-4 py-3 text-sm font-semibold transition"
                    style={{
                      backgroundColor: isActive ? 'var(--accent-light)' : 'transparent',
                      borderColor: isActive ? 'var(--accent-primary)' : 'var(--border-color)',
                      color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                    }}
                  >
                    <span>{item.label}</span>
                    {item.value && <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>{item.value}</span>}
                  </a>
                );
              })}
            </div>

            <div className="mt-6 rounded-2xl border p-4" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-color)' }}>
              <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Quick filters</p>
              <div className="mt-4 space-y-3">
                <Input
                  type="number"
                  label="Min Price (ETB)"
                  placeholder="0"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                />
                <Input
                  type="number"
                  label="Max Price (ETB)"
                  placeholder="100000"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                />
              </div>
            </div>
          </aside>
        )}
      </div>

      <aside className="hidden h-fit rounded-3xl border p-5 shadow-sm lg:block lg:sticky lg:top-0" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}>
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em]" style={{ color: 'var(--text-tertiary)' }}>Filter by</p>
            <h2 className="mt-1 text-2xl font-black" style={{ color: 'var(--text-primary)' }}>Category</h2>
          </div>
          <Filter className="h-5 w-5" style={{ color: 'var(--accent-secondary)' }} />
        </div>

        <div className="mt-5 space-y-2">
          {CATEGORIES.map((item) => {
            const isActive = category === item.value;
            const query = new URLSearchParams();

            if (search) query.set('search', search);
            if (item.value) query.set('category', item.value);

            return (
              <a
                key={item.label}
                href={`/products${query.toString() ? `?${query.toString()}` : ''}`}
                className="flex items-center justify-between rounded-2xl border px-4 py-3 text-sm font-semibold transition"
                style={{
                  backgroundColor: isActive ? 'var(--accent-light)' : 'transparent',
                  borderColor: isActive ? 'var(--accent-primary)' : 'var(--border-color)',
                  color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                }}
              >
                <span>{item.label}</span>
                {item.value && <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>{item.value}</span>}
              </a>
            );
          })}
        </div>

        <div className="mt-6 rounded-2xl border p-4" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-color)' }}>
          <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Quick filters</p>
          <div className="mt-4 space-y-3">
            <Input
              type="number"
              label="Min Price (ETB)"
              placeholder="0"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
            />
            <Input
              type="number"
              label="Max Price (ETB)"
              placeholder="100000"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
            />
          </div>
        </div>
      </aside>

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

        {/* Products Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {[...Array(12)].map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : error ? (
          <div className="rounded-2xl border p-6 text-center" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}>
            <p style={{ color: 'var(--error)' }}>Failed to load products. Please try again.</p>
          </div>
        ) : products && products.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 rounded-2xl" style={{ backgroundColor: 'var(--bg-secondary)' }}>
            <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>No products found. Try adjusting your filters.</p>
          </div>
        )}
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
