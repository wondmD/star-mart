import { NextRequest, NextResponse } from 'next/server';

import { requireAdminAccess } from '@/lib/admin-access';
import { createProduct, listProducts } from '@/lib/products-repository';
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

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const products = await listProducts({
      category: searchParams.get('category'),
      minPrice: searchParams.get('minPrice'),
      maxPrice: searchParams.get('maxPrice'),
      search: searchParams.get('search'),
    });

    const response: ApiResponse<Product[]> = {
      success: true,
      data: products,
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

    const product = await createProduct({
      name,
      description,
      price,
      discount_price: asNumber(body.discount_price),
      image_url: imageUrl,
      category,
      stock,
    });

    const response: ApiResponse<Product> = {
      success: true,
      data: product,
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
