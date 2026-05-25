import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { Product } from '@/types';

interface HeaderSearchDropdownProps {
  query: string;
  results: Product[];
  isFetching: boolean;
  onClose: () => void;
}

export function HeaderSearchDropdown({
  query,
  results,
  isFetching,
  onClose,
}: HeaderSearchDropdownProps) {
  const visibleResults = results.slice(0, 5);

  return (
    <div
      className="fixed left-4 right-4 top-16 z-50 overflow-hidden rounded-3xl border shadow-2xl sm:left-6 sm:right-6 lg:left-8 lg:right-8"
      style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}
    >
      <div
        className="px-4 py-3 text-xs font-semibold uppercase tracking-[0.2em]"
        style={{ color: 'var(--text-tertiary)' }}
      >
        {isFetching ? 'Searching' : 'Matching items'}
      </div>

      <div className="max-h-96 overflow-y-auto">
        {visibleResults.length > 0 ? (
          visibleResults.map((product) => (
            <Link
              key={product.id}
              href={`/products/${product.id}`}
              onMouseDown={onClose}
              onClick={onClose}
              className="block cursor-pointer border-t px-4 py-3 transition hover:bg-black/5"
              style={{ borderColor: 'var(--border-color)' }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="relative h-14 w-14 shrink-0 overflow-hidden rounded-2xl border"
                  style={{ borderColor: 'var(--border-color)' }}
                >
                  <Image src={product.image_url} alt={product.name} fill sizes="56px" className="object-cover" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate font-semibold" style={{ color: 'var(--text-primary)' }}>
                        {product.name}
                      </p>
                      <p className="mt-1 line-clamp-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
                        {product.description}
                      </p>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="text-sm font-semibold" style={{ color: 'var(--accent-secondary)' }}>
                        ETB {product.discount_price ?? product.price}
                      </p>
                      {product.discount_price ? (
                        <p className="text-xs line-through" style={{ color: 'var(--text-tertiary)' }}>
                          ETB {product.price}
                        </p>
                      ) : null}
                    </div>
                  </div>
                  <div className="mt-2 flex items-center justify-between gap-3">
                    <span
                      className="rounded-full px-2 py-1 text-xs font-semibold"
                      style={{ backgroundColor: 'var(--accent-light)', color: 'var(--accent-secondary)' }}
                    >
                      {product.category}
                    </span>
                    <span
                      className="inline-flex items-center gap-1 text-xs font-semibold"
                      style={{ color: 'var(--text-tertiary)' }}
                    >
                      View details
                      <ArrowRight className="h-3 w-3" />
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))
        ) : isFetching ? (
          <div className="border-t px-4 py-4 text-sm" style={{ color: 'var(--text-secondary)', borderColor: 'var(--border-color)' }}>
            Looking for matches...
          </div>
        ) : (
          <div className="border-t px-4 py-4 text-sm" style={{ color: 'var(--text-secondary)', borderColor: 'var(--border-color)' }}>
            No matching items found.
          </div>
        )}
      </div>

      <div className="border-t px-4 py-3" style={{ borderColor: 'var(--border-color)' }}>
        <Link
          href={`/products?search=${encodeURIComponent(query)}`}
          onMouseDown={onClose}
          onClick={onClose}
          className="block rounded-2xl border px-4 py-3 text-sm font-semibold transition hover:bg-black/5"
          style={{ borderColor: 'var(--border-color)' }}
        >
          <span className="block" style={{ color: 'var(--text-primary)' }}>
            See all results in detail
          </span>
          <span className="mt-1 block text-xs" style={{ color: 'var(--text-secondary)' }}>
            Open the full product list with filters, descriptions, and prices for “{query}”.
          </span>
        </Link>
      </div>
    </div>
  );
}
