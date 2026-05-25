'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, BadgePercent, Tag } from 'lucide-react';
import { Button } from '@/components/Button';
import { Product } from '@/types';

interface FeaturedSaleCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

export function FeaturedSaleCard({ product, onAddToCart }: FeaturedSaleCardProps) {
  const displayPrice = product.discount_price ?? product.price;

  return (
    <div id="featured-sale" className="relative justify-self-stretch lg:block">
      <div
        className="pointer-events-none absolute -inset-1 rounded-3xl border-2 opacity-90 motion-safe:animate-pulse"
        style={{
          borderColor: 'var(--badge-featured-ring)',
          boxShadow: '0 0 36px var(--glow-amber)',
        }}
      />
      <div
        className="relative overflow-hidden rounded-3xl border shadow-2xl"
        style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}
      >
        <div className="relative h-44 sm:h-60">
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 380px"
            className="object-cover"
          />
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(to top, var(--overlay-cobalt), var(--overlay-cobalt-soft), transparent)`,
            }}
          />
          <div className="absolute left-4 top-4 flex flex-col gap-2">
            <span
              className="inline-flex w-fit items-center gap-2 rounded-full px-3 py-1 text-sm font-bold shadow-lg"
              style={{
                backgroundColor: 'var(--badge-sale-bg)',
                color: 'var(--badge-sale-text)',
              }}
            >
              <BadgePercent className="h-4 w-4" />
              Featured deal
            </span>
            {product.category ? (
              <span
                className="inline-flex w-fit items-center gap-2 rounded-full px-3 py-1 text-sm font-semibold shadow-lg"
                style={{
                  backgroundColor: 'var(--bg-secondary)',
                  color: 'var(--brand-cobalt)',
                }}
              >
                <Tag className="h-4 w-4" />
                {product.category}
              </span>
            ) : null}
          </div>
          <div className="absolute inset-x-0 bottom-0 p-5" style={{ color: 'var(--hero-text)' }}>
            <p
              className="text-xs uppercase tracking-[0.3em]"
              style={{ color: 'var(--brand-amber)' }}
            >
              Curated pick
            </p>
            <h2 className="mt-2 text-2xl font-black leading-tight sm:text-3xl">{product.name}</h2>
            <p className="mt-3 max-w-sm text-sm leading-6" style={{ color: 'var(--hero-text-muted)' }}>
              {product.description}
            </p>
          </div>
        </div>

        <div className="space-y-4 p-5">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p
                className="text-xs font-semibold uppercase tracking-[0.25em]"
                style={{ color: 'var(--text-secondary)' }}
              >
                Now only
              </p>
              <div className="mt-1 flex items-end gap-3">
                <span className="text-3xl font-black" style={{ color: 'var(--text-primary)' }}>
                  ETB {displayPrice.toFixed(2)}
                </span>
                {product.discount_price ? (
                  <span className="pb-1 text-base line-through" style={{ color: 'var(--text-tertiary)' }}>
                    ETB {product.price.toFixed(2)}
                  </span>
                ) : null}
              </div>
            </div>
            <div className="rounded-2xl px-4 py-3 text-right" style={{ backgroundColor: 'var(--accent-light)' }}>
              <p className="text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>
                Stock
              </p>
              <p className="text-2xl font-black" style={{ color: 'var(--accent-secondary)' }}>
                {product.stock}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button size="lg" className="flex-1" onClick={() => onAddToCart(product)}>
              Add to Cart
            </Button>
            <Link href={`/products/${product.id}`} className="flex-1">
              <Button variant="outline" size="lg" className="w-full">
                View Details
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
