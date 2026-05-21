import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
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
