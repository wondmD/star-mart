import { createClient } from '@supabase/supabase-js';

import {
  buildProductPayload,
  mutateProductWithFallback,
  normalizeProductRow,
} from '@/lib/admin-product-utils';
import {
  createLocalProduct,
  deleteLocalProductById,
  readLocalProductById,
  readLocalProducts,
  updateLocalProductById,
} from '@/lib/local-product-store';
import { createSupabaseAdminClient } from '@/lib/supabase-admin';
import { hasSupabaseConfig } from '@/lib/has-supabase';
import { getSupabaseAnonKey, getSupabaseUrl } from '@/lib/supabase-config';
import { Product } from '@/types';

export type ProductWriteInput = {
  name: string;
  description: string;
  price: number;
  discount_price?: number | null;
  image_url: string;
  category: string;
  stock: number;
};

function isProduction(): boolean {
  return process.env.NODE_ENV === 'production';
}

function shouldUseLocalFallback(): boolean {
  return !isProduction();
}

function getAdminClient() {
  return createSupabaseAdminClient();
}

function getPublicClient() {
  if (!hasSupabaseConfig()) {
    return null;
  }

  return createClient(getSupabaseUrl(), getSupabaseAnonKey());
}

export function filterProducts(
  products: Product[],
  options?: {
    category?: string | null;
    minPrice?: string | null;
    maxPrice?: string | null;
    search?: string | null;
  },
): Product[] {
  const normalizedCategory = options?.category?.trim().toLowerCase() ?? null;
  const min = options?.minPrice ? Number(options.minPrice) : undefined;
  const max = options?.maxPrice ? Number(options.maxPrice) : undefined;
  const searchTerm = options?.search?.trim().toLowerCase() ?? null;

  return products.filter((product) => {
    if (normalizedCategory && product.category.toLowerCase() !== normalizedCategory) {
      return false;
    }

    if (min !== undefined && product.price < min) {
      return false;
    }

    if (max !== undefined && product.price > max) {
      return false;
    }

    if (searchTerm) {
      return (
        product.name.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm)
      );
    }

    return true;
  });
}

export async function listProducts(options?: {
  category?: string | null;
  minPrice?: string | null;
  maxPrice?: string | null;
  search?: string | null;
}): Promise<Product[]> {
  const client = getPublicClient();

  if (!client) {
    if (shouldUseLocalFallback()) {
      const products = await readLocalProducts();
      return filterProducts(products, options);
    }

    throw new Error(
      'Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.',
    );
  }

  const { data, error } = await client
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    if (shouldUseLocalFallback()) {
      const products = await readLocalProducts();
      return filterProducts(products, options);
    }

    throw new Error(error.message);
  }

  const normalizedProducts = ((data ?? []) as Record<string, unknown>[]).map(normalizeProductRow);
  return filterProducts(normalizedProducts, options);
}

export async function getProductById(productId: string): Promise<Product | null> {
  const client = getPublicClient();

  if (!client) {
    if (shouldUseLocalFallback()) {
      return readLocalProductById(productId);
    }

    throw new Error(
      'Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.',
    );
  }

  const { data, error } = await client.from('products').select('*').eq('id', productId).single();

  if (error || !data) {
    if (shouldUseLocalFallback()) {
      return readLocalProductById(productId);
    }

    return null;
  }

  return normalizeProductRow(data as Record<string, unknown>);
}

export async function createProduct(input: ProductWriteInput): Promise<Product> {
  const adminClient = getAdminClient();

  if (!adminClient) {
    if (shouldUseLocalFallback()) {
      return createLocalProduct({
        name: input.name,
        description: input.description,
        price: input.price,
        discount_price: input.discount_price ?? undefined,
        image_url: input.image_url,
        category: input.category,
        stock: input.stock,
      });
    }

    throw new Error(
      'Missing SUPABASE_SERVICE_ROLE_KEY for admin operations. Use local dev mode or configure Supabase.',
    );
  }

  const payload = buildProductPayload(input);
  const inserted = await mutateProductWithFallback(
    async (currentPayload) =>
      adminClient.from('products').insert([currentPayload]).select().single(),
    payload,
  );

  if (!inserted) {
    throw new Error('Product could not be created');
  }

  return normalizeProductRow(inserted as Record<string, unknown>);
}

export async function updateProduct(
  productId: string,
  updates: Partial<ProductWriteInput>,
): Promise<Product | null> {
  const adminClient = getAdminClient();

  if (!adminClient) {
    if (shouldUseLocalFallback()) {
      const { discount_price, ...rest } = updates;
      const localUpdates: Partial<Omit<Product, 'id' | 'created_at'>> = {
        ...rest,
        ...(typeof discount_price === 'number' ? { discount_price } : {}),
      };
      return updateLocalProductById(productId, localUpdates);
    }

    throw new Error(
      'Missing SUPABASE_SERVICE_ROLE_KEY for admin operations. Use local dev mode or configure Supabase.',
    );
  }

  const payload: Record<string, unknown> = {};
  if (updates.name !== undefined) payload.name = updates.name;
  if (updates.description !== undefined) payload.description = updates.description;
  if (updates.price !== undefined) payload.price = updates.price;
  if (updates.discount_price !== undefined) payload.discount_price = updates.discount_price;
  if (updates.image_url !== undefined) payload.image_url = updates.image_url;
  if (updates.category !== undefined) payload.category = updates.category;
  if (updates.stock !== undefined) payload.stock = updates.stock;

  if (Object.keys(payload).length === 0) {
    return getProductById(productId);
  }

  const updated = await mutateProductWithFallback(
    async (currentPayload) =>
      adminClient.from('products').update(currentPayload).eq('id', productId).select().single(),
    payload,
  );

  if (!updated) {
    return null;
  }

  return normalizeProductRow(updated as Record<string, unknown>);
}

export async function deleteProduct(productId: string): Promise<boolean> {
  const adminClient = getAdminClient();

  if (!adminClient) {
    if (shouldUseLocalFallback()) {
      return deleteLocalProductById(productId);
    }

    throw new Error(
      'Missing SUPABASE_SERVICE_ROLE_KEY for admin operations. Use local dev mode or configure Supabase.',
    );
  }

  const { error } = await adminClient.from('products').delete().eq('id', productId);

  if (error) {
    throw new Error(error.message);
  }

  return true;
}
