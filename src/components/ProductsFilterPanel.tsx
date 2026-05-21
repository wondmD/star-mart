"use client";

import { useCallback, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Filter, ChevronDown, ChevronUp } from 'lucide-react';
import { Input } from '@/components/FormElements';
import CategoryList from '@/components/CategoryList';

type Category = { value: string; label: string };

type Props = {
  categories: Category[];
  minPrice: string;
  maxPrice: string;
  onMinPriceChange: (value: string) => void;
  onMaxPriceChange: (value: string) => void;
};

export default function ProductsFilterPanel({
  categories,
  minPrice,
  maxPrice,
  onMinPriceChange,
  onMaxPriceChange,
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [filtersOpen, setFiltersOpen] = useState(false);

  const category = searchParams.get('category') ?? '';
  const search = searchParams.get('search') ?? '';

  const updateCategory = useCallback((value: string) => {
    const query = new URLSearchParams();

    if (search) query.set('search', search);
    if (value) query.set('category', value);

    router.replace(`/products${query.toString() ? `?${query.toString()}` : ''}`);
  }, [router, search]);

  const filtersCard = (
    <>
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em]" style={{ color: 'var(--text-tertiary)' }}>Filter by</p>
          <h2 className="mt-1 text-2xl font-black" style={{ color: 'var(--text-primary)' }}>Category</h2>
        </div>
        <Filter className="h-5 w-5" style={{ color: 'var(--accent-secondary)' }} />
      </div>

      <CategoryList
        categories={categories}
        active={category}
        onSelect={updateCategory}
      />

      <div className="mt-6 rounded-2xl border p-4" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-color)' }}>
        <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Quick filters</p>
        <div className="mt-4 space-y-3">
          <Input
            type="number"
            label="Min Price (ETB)"
            placeholder="0"
            value={minPrice}
            onChange={(e) => onMinPriceChange(e.target.value)}
          />
          <Input
            type="number"
            label="Max Price (ETB)"
            placeholder="100000"
            value={maxPrice}
            onChange={(e) => onMaxPriceChange(e.target.value)}
          />
        </div>
      </div>
    </>
  );

  return (
    <>
      <div className="lg:hidden">
        <button
          type="button"
          onClick={() => setFiltersOpen((value) => !value)}
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
          <aside className="mx-auto mt-4 w-[min(24rem,calc(100vw-2rem))] rounded-3xl border p-5 shadow-sm" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}>
            {filtersCard}
          </aside>
        )}
      </div>

      <aside className="hidden h-fit rounded-3xl border p-5 shadow-sm lg:block lg:sticky lg:top-0" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}>
        {filtersCard}
      </aside>
    </>
  );
}
