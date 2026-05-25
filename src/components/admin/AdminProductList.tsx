'use client';

import { PencilLine, Trash2 } from 'lucide-react';
import { Button } from '@/components/Button';
import { Card } from '@/components/FormElements';
import { formatAdminCurrency } from '@/lib/admin-api';
import { Product } from '@/types';

interface AdminProductListProps {
  products: Product[];
  isLoading: boolean;
  deletingId: string | null;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}

export function AdminProductList({
  products,
  isLoading,
  deletingId,
  onEdit,
  onDelete,
}: AdminProductListProps) {
  return (
    <Card className="space-y-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em]" style={{ color: 'var(--text-tertiary)' }}>
            Inventory
          </p>
          <h2 className="mt-1 text-2xl font-black" style={{ color: 'var(--text-primary)' }}>
            Existing products
          </h2>
        </div>
        <span
          className="rounded-full px-3 py-1 text-sm font-semibold"
          style={{ backgroundColor: 'var(--accent-light)', color: 'var(--accent-secondary)' }}
        >
          {products.length} items
        </span>
      </div>

      <div className="space-y-4">
        {isLoading
          ? [...Array(3)].map((_, index) => (
              <div
                key={index}
                className="animate-pulse rounded-3xl border p-4"
                style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-color)' }}
              >
                <div className="h-5 w-2/3 rounded bg-black/10" />
                <div className="mt-3 h-4 w-1/3 rounded bg-black/10" />
                <div className="mt-3 h-4 w-full rounded bg-black/10" />
              </div>
            ))
          : products.length > 0
            ? products.map((product) => (
                <div
                  key={product.id}
                  className="rounded-3xl border p-4"
                  style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-color)' }}
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-lg font-black" style={{ color: 'var(--text-primary)' }}>
                          {product.name}
                        </h3>
                        {product.discount_price ? (
                          <span className="rounded-full bg-[var(--error)] px-2 py-1 text-[11px] font-semibold text-white">
                            On sale
                          </span>
                        ) : null}
                      </div>
                      <p className="text-sm leading-6" style={{ color: 'var(--text-secondary)' }}>
                        {product.description}
                      </p>
                      <div className="flex flex-wrap gap-2 text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>
                        <span>{product.category}</span>
                        <span>•</span>
                        <span>{product.stock} in stock</span>
                        <span>•</span>
                        <span>{formatAdminCurrency(product.discount_price ?? product.price)}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 lg:justify-end">
                      <Button variant="outline" size="sm" onClick={() => onEdit(product)}>
                        <PencilLine className="mr-2 h-4 w-4" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onDelete(product)}
                        disabled={deletingId === product.id}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            : (
              <div
                className="rounded-3xl border border-dashed p-6 text-center"
                style={{ borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}
              >
                No products yet. Create the first item using the form.
              </div>
            )}
      </div>
    </Card>
  );
}
