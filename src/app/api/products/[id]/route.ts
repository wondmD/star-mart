import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

import { requireAdminAccess } from '@/lib/admin-access';
import {
  mutateProductWithFallback,
} from '@/lib/admin-product-utils';
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

function buildPartialProductPayload(body: Partial<Product>): Record<string, unknown> {
  const payload: Record<string, unknown> = {};

  if (body.name !== undefined) payload.name = body.name.trim();
  if (body.description !== undefined) payload.description = body.description.trim();
  if (body.price !== undefined) payload.price = body.price;
  if (body.discount_price !== undefined) payload.discount_price = body.discount_price;
  if (body.image_url !== undefined) payload.image_url = body.image_url.trim();
  if (body.category !== undefined) payload.category = body.category.trim();
  if (body.stock !== undefined) payload.stock = body.stock;

  return payload;
}

function normalizeProductRow(row: Record<string, unknown>): Product {
  return {
    id: String(row.id ?? ''),
    name: String(row.name ?? 'Unnamed Product'),
    description: String(row.description ?? ''),
    price: asNumber(row.price) ?? 0,
    discount_price: asNumber(row.discount_price),
    image_url: String(row.image_url ?? '/placeholder.png'),
    category: String(row.category ?? 'General'),
    stock: asNumber(row.stock) ?? 0,
    created_at: String(row.created_at ?? new Date().toISOString()),
  };
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

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
      .eq('id', id)
      .single();

    if (!error && data) {
      const response: ApiResponse<Product> = {
        success: true,
        data: normalizeProductRow(data as Record<string, unknown>),
      };

      return NextResponse.json(response);
    }

    if (error || !data) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Product not found',
      };
      return NextResponse.json(response, { status: 404 });
    }
  } catch (error) {
    console.error('Error fetching product:', error);
    const response: ApiResponse<null> = {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch product',
    };
    return NextResponse.json(response, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const access = await requireAdminAccess(request);
    if (!access.ok) {
      return access.response;
    }

    const { id } = await params;
    const body = (await request.json()) as Partial<Product>;
    const payload = buildPartialProductPayload(body);

    if (Object.keys(payload).length === 0) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'No product fields provided to update',
      };
      return NextResponse.json(response, { status: 400 });
    }

    const updated = await mutateProductWithFallback(
      async (currentPayload) =>
        access.adminClient
          .from('products')
          .update(currentPayload)
          .eq('id', id)
          .select()
          .single(),
      payload,
    );

    if (!updated) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Product not found',
      };
      return NextResponse.json(response, { status: 404 });
    }

    const response: ApiResponse<Product> = {
      success: true,
      data: normalizeProductRow(updated as Record<string, unknown>),
      message: 'Product updated successfully',
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error updating product:', error);
    const response: ApiResponse<null> = {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update product',
    };
    return NextResponse.json(response, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const access = await requireAdminAccess(request);
    if (!access.ok) {
      return access.response;
    }

    const { id } = await params;
    const { error } = await access.adminClient.from('products').delete().eq('id', id);

    if (error) {
      throw error;
    }

    const response: ApiResponse<null> = {
      success: true,
      message: 'Product deleted successfully',
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error deleting product:', error);
    const response: ApiResponse<null> = {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete product',
    };
    return NextResponse.json(response, { status: 500 });
  }
}
