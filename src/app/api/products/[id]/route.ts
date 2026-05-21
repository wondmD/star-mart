import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { hasSupabaseConfig } from '@/lib/has-supabase';
import { readLocalProducts } from '@/lib/local-product-store';
import { ApiResponse, Product } from '@/types';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!hasSupabaseConfig()) {
      const localProducts = await readLocalProducts();
      const localProduct = localProducts.find((product) => product.id === id);

      if (localProduct) {
        const response: ApiResponse<Product> = {
          success: true,
          data: localProduct,
        };
        return NextResponse.json(response);
      }

      const response: ApiResponse<null> = {
        success: false,
        error: 'Product not found',
      };
      return NextResponse.json(response, { status: 404 });
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    );

    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();

    if (!error && data) {
      const response: ApiResponse<Product> = {
        success: true,
        data: data as Product,
      };

      return NextResponse.json(response);
    }

    const localProducts = await readLocalProducts();
    const localProduct = localProducts.find((product) => product.id === id);

    if (localProduct) {
      const response: ApiResponse<Product> = {
        success: true,
        data: localProduct,
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
