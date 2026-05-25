'use client';

import Link from 'next/link';
import { Tag } from 'lucide-react';
import { Button } from '@/components/Button';
import { HOME_CATEGORY_SHORTCUTS } from '@/constants/categories';
import { FeaturedSaleCard } from '@/components/home/FeaturedSaleCard';
import { Product } from '@/types';

interface HomeHeroSectionProps {
  saleProduct: Product;
  onCategorySelect: (category: string) => void;
  onAddToCart: (product: Product) => void;
}

export function HomeHeroSection({
  saleProduct,
  onCategorySelect,
  onAddToCart,
}: HomeHeroSectionProps) {
  return (
    <section
      className="relative w-full overflow-hidden border-y shadow-xl"
      style={{ borderColor: 'var(--border-color)' }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(252,191,73,0.24),transparent_34%),radial-gradient(circle_at_top_right,rgba(214,40,40,0.16),transparent_30%),linear-gradient(135deg,#081f2d_0%,#0f3550_46%,#174d60_100%)]" />
      <div className="absolute -left-24 top-10 h-64 w-64 rounded-full bg-[#fcbf49]/12 blur-3xl" />
      <div className="absolute -bottom-20 right-0 h-72 w-72 rounded-full bg-[#d62828]/12 blur-3xl" />

      <div className="relative mx-auto grid min-h-[38vh] max-w-none gap-8 px-4 py-6 sm:px-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(17rem,0.58fr)] lg:items-center lg:px-10 xl:px-14">
        <div className="max-w-3xl text-white">
          <h1 className="mt-5 text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
            Discover products that feel premium from the first glance.
          </h1>
          <p
            className="mt-4 max-w-2xl text-sm sm:text-base lg:text-lg"
            style={{ color: 'rgba(252,251,247,0.82)' }}
          >
            Explore curated picks, quick category shortcuts, and a clean checkout flow
            built for a smooth shopping experience.
          </p>

          <div
            className="mt-6 max-w-2xl rounded-3xl border p-3 shadow-2xl"
            style={{
              borderColor: 'rgba(252,251,247,0.14)',
              backgroundColor: 'rgba(252,251,247,0.1)',
            }}
          >
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-white/70">
              Browse products
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <p className="flex-1 text-sm leading-6 text-white/75">
                Jump straight into the catalog to search, filter, and compare products.
              </p>
              <Link href="/products" className="sm:min-w-40">
                <Button
                  size="lg"
                  className="w-full"
                  style={{
                    backgroundColor: 'var(--accent-primary)',
                    color: 'var(--bg-secondary)',
                  }}
                >
                  Browse products
                </Button>
              </Link>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            {HOME_CATEGORY_SHORTCUTS.map((category) => (
              <button
                key={category.value}
                type="button"
                onClick={() => onCategorySelect(category.value)}
                className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition hover:scale-[1.01]"
                style={{
                  borderColor: 'rgba(252,251,247,0.2)',
                  backgroundColor: 'rgba(252,251,247,0.08)',
                }}
              >
                <Tag className="h-4 w-4" />
                {category.label}
              </button>
            ))}
          </div>
        </div>

        <FeaturedSaleCard product={saleProduct} onAddToCart={onAddToCart} />
      </div>
    </section>
  );
}
