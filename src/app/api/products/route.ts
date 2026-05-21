import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

import { requireAdminAccess } from '@/lib/admin-access';
import { buildProductPayload, mutateProductWithFallback } from '@/lib/admin-product-utils';
import { hasSupabaseConfig } from '@/lib/has-supabase';
import { getSupabaseAnonKey, getSupabaseUrl } from '@/lib/supabase-config';
import { ApiResponse, Product } from '@/types';

function asNumber(value: unknown): number | undefined {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === 'string') {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : undefined;
  }

  return undefined;
}

function normalizeProductRow(row: Record<string, unknown>): Product {
  const price = asNumber(row.price) ?? 0;
  const stock = asNumber(row.stock) ?? 0;
  const discountPrice = asNumber(row.discount_price);

  return {
    id: String(row.id ?? ''),
    name: String(row.name ?? 'Unnamed Product'),
    description: String(row.description ?? ''),
    price,
    discount_price: discountPrice,
    image_url: String(row.image_url ?? '/placeholder.png'),
    category: String(row.category ?? 'General'),
    stock,
    created_at: String(row.created_at ?? new Date().toISOString()),
  };
}

function filterProducts(
  products: Product[],
  category: string | null,
  minPrice: string | null,
  maxPrice: string | null,
  search: string | null,
): Product[] {
  const normalizedCategory = category?.trim().toLowerCase() ?? null;
  const min = minPrice ? Number(minPrice) : undefined;
  const max = maxPrice ? Number(maxPrice) : undefined;
  const searchTerm = search?.trim().toLowerCase() ?? null;

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

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const search = searchParams.get('search');

    if (!hasSupabaseConfig()) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.',
      };
      return NextResponse.json(response, { status: 503 });
    }

    const supabase = createClient(getSupabaseUrl(), getSupabaseAnonKey());

    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    const normalizedProducts = ((data ?? []) as Record<string, unknown>[]).map(
      normalizeProductRow,
    );

    const response: ApiResponse<Product[]> = {
      success: true,
      data: filterProducts(normalizedProducts, category, minPrice, maxPrice, search),
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching products:', error);
    const response: ApiResponse<null> = {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch products',
    };
    return NextResponse.json(response, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const access = await requireAdminAccess(request);
    if (!access.ok) {
      return access.response;
    }

    const body = (await request.json()) as Partial<Product>;
    const name = body.name?.trim();
    const description = body.description?.trim();
    const imageUrl = body.image_url?.trim();
    const category = body.category?.trim();
    const price = asNumber(body.price);
    const stock = asNumber(body.stock);

    if (!name || !description || !imageUrl || !category || price === undefined || stock === undefined) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Name, description, image URL, category, price, and stock are required',
      };
      return NextResponse.json(response, { status: 400 });
    }

    const payload = buildProductPayload({
      name,
      description,
      price,
      discount_price: asNumber(body.discount_price),
      image_url: imageUrl,
      category,
      stock,
    });

    const inserted = await mutateProductWithFallback(
      async (currentPayload) => access.adminClient.from('products').insert([currentPayload]).select().single(),
      payload,
    );

    if (!inserted) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Product could not be created',
      };
      return NextResponse.json(response, { status: 500 });
    }

    const response: ApiResponse<Product> = {
      success: true,
      data: normalizeProductRow(inserted as Record<string, unknown>),
      message: 'Product created successfully',
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    const response: ApiResponse<null> = {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create product',
    };
    return NextResponse.json(response, { status: 500 });
  }
}
