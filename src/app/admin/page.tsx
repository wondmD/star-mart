'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import {
  RefreshCcw,
  PencilLine,
  Trash2,
  ShieldCheck,
  Save,
  X,
} from 'lucide-react';

import { Button } from '@/components/Button';
import { Card } from '@/components/FormElements';
import { useAuthStore } from '@/stores/auth-store';
import { authService, getStoredAuthToken } from '@/services/auth';
import { Product } from '@/types';

const emptyForm = {
  name: '',
  description: '',
  price: '',
  discount_price: '',
  image_url: '',
  category: '',
  stock: '',
};

function formatCurrency(value: number): string {
  return `ETB ${value.toFixed(2)}`;
}

export default function AdminPage() {
  const router = useRouter();
  const { user, loading: authLoading, setUser } = useAuthStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [isCheckingAdmin, setIsCheckingAdmin] = useState(true);

  const isAdmin = Boolean(user?.is_admin);

  useEffect(() => {
    if (authLoading) {
      return;
    }

    if (!user) {
      router.replace('/login?returnTo=/admin');
      return;
    }

    if (user.is_admin) {
      setIsCheckingAdmin(false);
      return;
    }

    let isMounted = true;

    async function refreshAdminProfile() {
      try {
        const currentUser = await authService.getCurrentUser();

        if (!isMounted) {
          return;
        }

        if (currentUser) {
          setUser(currentUser);

          if (currentUser.is_admin) {
            setIsCheckingAdmin(false);
            return;
          }
        }

        setIsCheckingAdmin(false);
      } catch {
        if (isMounted) {
          setIsCheckingAdmin(false);
        }
      }
    }

    void refreshAdminProfile();

    return () => {
      isMounted = false;
    };
  }, [authLoading, router, setUser, user]);

  useEffect(() => {
    if (user?.is_admin && !isCheckingAdmin) {
      void loadProducts();
    }
  }, [isCheckingAdmin, user?.is_admin]);

  async function adminRequest<T>(
    url: string,
    options: RequestInit = {},
  ): Promise<T> {
    const token = getStoredAuthToken();
    if (!token) {
      throw new Error('Missing authentication token');
    }

    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        ...(options.headers ?? {}),
      },
    });

    const payload = await response.json();

    if (!response.ok || !payload.success) {
      throw new Error(payload.error || 'Request failed');
    }

    return payload.data as T;
  }

  async function loadProducts() {
    try {
      setIsLoadingProducts(true);
      const response = await fetch('/api/products');
      const payload = await response.json();

      if (!response.ok || !payload.success) {
        throw new Error(payload.error || 'Failed to load products');
      }

      setProducts(payload.data ?? []);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to load products');
    } finally {
      setIsLoadingProducts(false);
    }
  }

  function resetForm() {
    setForm(emptyForm);
    setEditingId(null);
  }

  function startEdit(product: Product) {
    setEditingId(product.id);
    setForm({
      name: product.name,
      description: product.description,
      price: String(product.price),
      discount_price: product.discount_price ? String(product.discount_price) : '',
      image_url: product.image_url,
      category: product.category,
      stock: String(product.stock),
    });
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setIsSaving(true);

      const payload = {
        name: form.name.trim(),
        description: form.description.trim(),
        price: Number(form.price),
        discount_price: form.discount_price.trim() ? Number(form.discount_price) : undefined,
        image_url: form.image_url.trim(),
        category: form.category.trim(),
        stock: Number(form.stock),
      };

      if (!payload.name || !payload.description || !payload.image_url || !payload.category || !Number.isFinite(payload.price) || !Number.isFinite(payload.stock)) {
        throw new Error('Please complete all required fields');
      }

      if (editingId) {
        await adminRequest<Product>(`/api/products/${editingId}`, {
          method: 'PATCH',
          body: JSON.stringify(payload),
        });
        toast.success('Product updated');
      } else {
        await adminRequest<Product>('/api/products', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
        toast.success('Product created');
      }

      resetForm();
      await loadProducts();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Could not save product');
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete(product: Product) {
    const confirmed = window.confirm(`Delete ${product.name}?`);
    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(product.id);
      await adminRequest<null>(`/api/products/${product.id}`, {
        method: 'DELETE',
      });
      toast.success('Product deleted');
      if (editingId === product.id) {
        resetForm();
      }
      await loadProducts();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Could not delete product');
    } finally {
      setDeletingId(null);
    }
  }

  if (authLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-t-transparent" style={{ borderColor: 'var(--border-color)', borderTopColor: 'var(--accent-primary)' }} />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="px-4 py-12 text-center sm:px-6 lg:px-8">
        <p className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
          Admin access requires a signed-in account.
        </p>
        <Button className="mt-4" onClick={() => router.replace('/login?returnTo=/admin')}>
          Sign in
        </Button>
      </div>
    );
  }

  if (isCheckingAdmin) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-t-transparent" style={{ borderColor: 'var(--border-color)', borderTopColor: 'var(--accent-primary)' }} />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="px-4 py-12 sm:px-6 lg:px-8">
        <Card className="mx-auto max-w-2xl space-y-4 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full" style={{ backgroundColor: 'var(--accent-light)' }}>
            <ShieldCheck className="h-7 w-7" style={{ color: 'var(--accent-secondary)' }} />
          </div>
          <h1 className="text-3xl font-black" style={{ color: 'var(--text-primary)' }}>
            Admin access required
          </h1>
          <p className="text-sm leading-6" style={{ color: 'var(--text-secondary)' }}>
            Your account is signed in, but it has not been marked as an admin in Supabase yet.
            Set <span className="font-semibold">users.is_admin = true</span> for this account, then reload this page.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button onClick={() => router.push('/')} variant="outline">
              Back to Home
            </Button>
            <Button onClick={() => router.refresh()}>
              Refresh
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8 px-4 pb-8 pt-0 sm:px-6 lg:px-8">
      <section className="rounded-4xl border p-6 shadow-lg" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}>
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold" style={{ backgroundColor: 'var(--accent-light)', color: 'var(--accent-secondary)' }}>
              <ShieldCheck className="h-4 w-4" />
              Admin product controls
            </div>
            <div>
              <h1 className="text-4xl font-black" style={{ color: 'var(--text-primary)' }}>
                Product CRUD
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6" style={{ color: 'var(--text-secondary)' }}>
                Create, edit, and remove products directly from the dashboard. Changes are saved in Supabase and show up immediately across the store.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button variant="outline" onClick={() => void loadProducts()}>
              <RefreshCcw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
            <Link href="/products">
              <Button variant="outline">View Store</Button>
            </Link>
          </div>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.15fr)]">
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
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="inline-flex items-center gap-2 rounded-full border px-3 py-2 text-sm font-semibold transition"
                style={{ borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}
              >
                <X className="h-4 w-4" />
                Cancel
              </button>
            )}
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-2 text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                Name
                <input
                  value={form.name}
                  onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                  className="w-full rounded-2xl border px-4 py-3 outline-none"
                  style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-color)' }}
                  placeholder="Product name"
                />
              </label>

              <label className="space-y-2 text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                Category
                <input
                  value={form.category}
                  onChange={(event) => setForm((current) => ({ ...current, category: event.target.value }))}
                  className="w-full rounded-2xl border px-4 py-3 outline-none"
                  style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-color)' }}
                  placeholder="Electronics"
                />
              </label>
            </div>

            <label className="space-y-2 text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
              Description
              <textarea
                value={form.description}
                onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
                className="min-h-32 w-full rounded-2xl border px-4 py-3 outline-none"
                style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-color)' }}
                placeholder="Short description"
              />
            </label>

            <div className="grid gap-4 sm:grid-cols-3">
              <label className="space-y-2 text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                Price
                <input
                  type="number"
                  value={form.price}
                  onChange={(event) => setForm((current) => ({ ...current, price: event.target.value }))}
                  className="w-full rounded-2xl border px-4 py-3 outline-none"
                  style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-color)' }}
                  placeholder="1000"
                />
              </label>

              <label className="space-y-2 text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                Discount Price
                <input
                  type="number"
                  value={form.discount_price}
                  onChange={(event) => setForm((current) => ({ ...current, discount_price: event.target.value }))}
                  className="w-full rounded-2xl border px-4 py-3 outline-none"
                  style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-color)' }}
                  placeholder="Optional"
                />
              </label>

              <label className="space-y-2 text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                Stock
                <input
                  type="number"
                  value={form.stock}
                  onChange={(event) => setForm((current) => ({ ...current, stock: event.target.value }))}
                  className="w-full rounded-2xl border px-4 py-3 outline-none"
                  style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-color)' }}
                  placeholder="0"
                />
              </label>
            </div>

            <label className="space-y-2 text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
              Image URL
              <input
                value={form.image_url}
                onChange={(event) => setForm((current) => ({ ...current, image_url: event.target.value }))}
                className="w-full rounded-2xl border px-4 py-3 outline-none"
                style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-color)' }}
                placeholder="/camera.jpg"
              />
            </label>

            <div className="flex flex-wrap gap-3 pt-2">
              <Button type="submit" loading={isSaving}>
                <Save className="mr-2 h-4 w-4" />
                {editingId ? 'Save Changes' : 'Create Product'}
              </Button>
              <Button type="button" variant="outline" onClick={resetForm}>
                Reset
              </Button>
            </div>
          </form>
        </Card>

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
            <span className="rounded-full px-3 py-1 text-sm font-semibold" style={{ backgroundColor: 'var(--accent-light)', color: 'var(--accent-secondary)' }}>
              {products.length} items
            </span>
          </div>

          <div className="space-y-4">
            {isLoadingProducts ? (
              [...Array(3)].map((_, index) => (
                <div
                  key={index}
                  className="animate-pulse rounded-3xl border p-4"
                  style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-color)' }}
                >
                  <div className="h-5 w-2/3 rounded bg-black/10" />
                  <div className="mt-3 h-4 w-1/3 rounded bg-black/10" />
                  <div className="mt-3 h-4 w-full rounded bg-black/10" />
                  <div className="mt-2 h-4 w-5/6 rounded bg-black/10" />
                </div>
              ))
            ) : products.length > 0 ? (
              products.map((product) => (
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
                          <span className="rounded-full px-2 py-1 text-[11px] font-semibold text-white" style={{ backgroundColor: 'var(--error)' }}>
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
                        <span>{formatCurrency(product.discount_price ?? product.price)}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 lg:justify-end">
                      <Button variant="outline" size="sm" onClick={() => startEdit(product)}>
                        <PencilLine className="mr-2 h-4 w-4" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => void handleDelete(product)}
                        disabled={deletingId === product.id}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-3xl border border-dashed p-6 text-center" style={{ borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}>
                No products yet. Create the first item using the form.
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
