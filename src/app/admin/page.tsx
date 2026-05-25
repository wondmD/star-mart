'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { useAuthStore } from '@/stores/auth-store';
import { authService } from '@/services/auth';
import { adminRequest } from '@/lib/admin-api';
import { AdminLoadingState, AdminSignInRequired, AdminAccessDenied } from '@/components/admin/AdminAccessStates';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { AdminProductForm, AdminProductFormState } from '@/components/admin/AdminProductForm';
import { AdminProductList } from '@/components/admin/AdminProductList';
import { Product } from '@/types';

const emptyForm: AdminProductFormState = {
  name: '',
  description: '',
  price: '',
  discount_price: '',
  image_url: '',
  category: '',
  stock: '',
};

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

      if (
        !payload.name ||
        !payload.description ||
        !payload.image_url ||
        !payload.category ||
        !Number.isFinite(payload.price) ||
        !Number.isFinite(payload.stock)
      ) {
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
      await adminRequest<null>(`/api/products/${product.id}`, { method: 'DELETE' });
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

  if (authLoading || isCheckingAdmin) {
    return <AdminLoadingState />;
  }

  if (!user) {
    return <AdminSignInRequired />;
  }

  if (!user.is_admin) {
    return <AdminAccessDenied />;
  }

  return (
    <div className="space-y-8 px-4 pb-8 pt-0 sm:px-6 lg:px-8">
      <AdminPageHeader onRefresh={() => void loadProducts()} />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.15fr)]">
        <AdminProductForm
          form={form}
          editingId={editingId}
          isSaving={isSaving}
          onChange={(updates) => setForm((current) => ({ ...current, ...updates }))}
          onSubmit={handleSubmit}
          onReset={resetForm}
        />
        <AdminProductList
          products={products}
          isLoading={isLoadingProducts}
          deletingId={deletingId}
          onEdit={startEdit}
          onDelete={(product) => void handleDelete(product)}
        />
      </div>
    </div>
  );
}
