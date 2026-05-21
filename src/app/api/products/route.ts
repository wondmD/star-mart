import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { hasSupabaseConfig } from '@/lib/has-supabase';
import { readLocalProducts } from '@/lib/local-product-store';
import { ApiResponse, Product } from '@/types';

function filterLocalProducts(
  products: Product[],
  category: string | null,
  minPrice: string | null,
  maxPrice: string | null,
  search: string | null,
): Product[] {
  return products
    .filter((product) => {
      if (category && product.category !== category) {
        return false;
      }

      if (minPrice && product.price < parseFloat(minPrice)) {
        return false;
      }

      if (maxPrice && product.price > parseFloat(maxPrice)) {
        return false;
      }

      if (search) {
        const searchTerm = search.toLowerCase();
        return (
          product.name.toLowerCase().includes(searchTerm) ||
          product.description.toLowerCase().includes(searchTerm)
        );
      }

      return true;
    })
    .sort(
      (left, right) =>
        new Date(right.created_at).getTime() - new Date(left.created_at).getTime(),
    );
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const search = searchParams.get('search');

    if (!hasSupabaseConfig()) {
      const localProducts = await readLocalProducts();
      const response: ApiResponse<Product[]> = {
        success: true,
        data: filterLocalProducts(localProducts, category, minPrice, maxPrice, search),
      };
      return NextResponse.json(response);
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    );

    let query = supabase.from('products').select('*');

    if (category) {
      query = query.eq('category', category);
    }

    if (minPrice) {
      query = query.gte('price', parseFloat(minPrice));
    }

    if (maxPrice) {
      query = query.lte('price', parseFloat(maxPrice));
    }

    if (search) {
      query = query.or(
        `name.ilike.%${search}%,description.ilike.%${search}%`
      );
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (!error && data && data.length > 0) {
      const response: ApiResponse<Product[]> = {
        success: true,
        data: data as Product[],
      };

      return NextResponse.json(response);
    }

    const localProducts = await readLocalProducts();

    if (localProducts.length > 0) {
      const response: ApiResponse<Product[]> = {
        success: true,
        data: filterLocalProducts(localProducts, category, minPrice, maxPrice, search),
      };

      return NextResponse.json(response);
    }

    if (error) {
      throw error;
    }

    const response: ApiResponse<Product[]> = {
      success: true,
      data: data as Product[],
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
