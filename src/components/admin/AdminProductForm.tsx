'use client';

import { Save, X } from 'lucide-react';
import { Button } from '@/components/Button';
import { Card } from '@/components/FormElements';

export type AdminProductFormState = {
  name: string;
  description: string;
  price: string;
  discount_price: string;
  image_url: string;
  category: string;
  stock: string;
};

interface AdminProductFormProps {
  form: AdminProductFormState;
  editingId: string | null;
  isSaving: boolean;
  onChange: (updates: Partial<AdminProductFormState>) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onReset: () => void;
}

export function AdminProductForm({
  form,
  editingId,
  isSaving,
  onChange,
  onSubmit,
  onReset,
}: AdminProductFormProps) {
  return (
    <Card className="space-y-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em]" style={{ color: 'var(--text-tertiary)' }}>
            {editingId ? 'Edit product' : 'New product'}
          </p>
          <h2 className="mt-1 text-2xl font-black" style={{ color: 'var(--text-primary)' }}>
            {editingId ? 'Update item details' : 'Create a product'}
          </h2>
        </div>
        {editingId ? (
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-2 rounded-full border px-3 py-2 text-sm font-semibold transition"
            style={{ borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}
          >
            <X className="h-4 w-4" />
            Cancel
          </button>
        ) : null}
      </div>

      <form className="space-y-4" onSubmit={onSubmit}>
        <div className="grid gap-4 sm:grid-cols-2">
          <AdminField label="Name" value={form.name} onChange={(value) => onChange({ name: value })} placeholder="Product name" />
          <AdminField label="Category" value={form.category} onChange={(value) => onChange({ category: value })} placeholder="Electronics" />
        </div>

        <label className="space-y-2 text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
          Description
          <textarea
            value={form.description}
            onChange={(event) => onChange({ description: event.target.value })}
            className="min-h-32 w-full rounded-2xl border px-4 py-3 outline-none"
            style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-color)' }}
            placeholder="Short description"
          />
        </label>

        <div className="grid gap-4 sm:grid-cols-3">
          <AdminField label="Price" value={form.price} onChange={(value) => onChange({ price: value })} placeholder="1000" type="number" />
          <AdminField label="Discount Price" value={form.discount_price} onChange={(value) => onChange({ discount_price: value })} placeholder="Optional" type="number" />
          <AdminField label="Stock" value={form.stock} onChange={(value) => onChange({ stock: value })} placeholder="0" type="number" />
        </div>

        <AdminField label="Image URL" value={form.image_url} onChange={(value) => onChange({ image_url: value })} placeholder="/camera.jpg" />

        <div className="flex flex-wrap gap-3 pt-2">
          <Button type="submit" loading={isSaving}>
            <Save className="mr-2 h-4 w-4" />
            {editingId ? 'Save Changes' : 'Create Product'}
          </Button>
          <Button type="button" variant="outline" onClick={onReset}>
            Reset
          </Button>
        </div>
      </form>
    </Card>
  );
}

function AdminField({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  type?: string;
}) {
  return (
    <label className="space-y-2 text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
      {label}
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-2xl border px-4 py-3 outline-none"
        style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-color)' }}
        placeholder={placeholder}
      />
    </label>
  );
}
