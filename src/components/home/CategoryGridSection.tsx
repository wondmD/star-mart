'use client';

import { Tag } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/Button';
import { HOME_CATEGORY_SHORTCUTS } from '@/constants/categories';

interface CategoryGridSectionProps {
  onCategorySelect: (category: string) => void;
}

export function CategoryGridSection({ onCategorySelect }: CategoryGridSectionProps) {
  return (
    <section
      className="rounded-4xl border p-8 shadow-lg"
      style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}
    >
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p
            className="text-sm font-semibold uppercase tracking-[0.2em]"
            style={{ color: 'var(--text-tertiary)' }}
          >
            Browse smarter
          </p>
          <h2 className="mt-2 text-3xl font-black" style={{ color: 'var(--text-primary)' }}>
            Explore by category
          </h2>
        </div>
        <Link href="/products">
          <Button variant="outline">View all products</Button>
        </Link>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {HOME_CATEGORY_SHORTCUTS.map((category, index) => (
          <button
            key={category.value}
            type="button"
            onClick={() => onCategorySelect(category.value)}
            className="group rounded-3xl border p-5 text-left transition hover:-translate-y-1 hover:shadow-xl"
            style={{
              backgroundColor: 'var(--bg-primary)',
              borderColor: 'var(--border-color)',
            }}
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <p
                  className="text-xs font-semibold uppercase tracking-[0.24em]"
                  style={{ color: 'var(--text-tertiary)' }}
                >
                  Category {index + 1}
                </p>
                <h3 className="mt-2 text-xl font-black" style={{ color: 'var(--text-primary)' }}>
                  {category.label}
                </h3>
              </div>
              <div
                className="rounded-2xl p-3 transition group-hover:scale-105"
                style={{ backgroundColor: 'var(--accent-light)' }}
              >
                <Tag className="h-5 w-5" style={{ color: 'var(--accent-secondary)' }} />
              </div>
            </div>
            <p className="mt-4 text-sm leading-6" style={{ color: 'var(--text-secondary)' }}>
              Jump straight into curated products for {category.label.toLowerCase()} and
              continue from there.
            </p>
          </button>
        ))}
      </div>
    </section>
  );
}
