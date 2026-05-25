import { NextRequest, NextResponse } from 'next/server';

import { requireAdminAccess } from '@/lib/admin-access';
import { deleteProduct, getProductById, updateProduct } from '@/lib/products-repository';
import { ApiResponse, Product } from '@/types';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const product = await getProductById(id);

    if (!product) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Product not found',
      };
      return NextResponse.json(response, { status: 404 });
    }

    const response: ApiResponse<Product> = {
      success: true,
      data: product,
    };

    return NextResponse.json(response);
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
    const updates = {
      ...(body.name !== undefined ? { name: body.name.trim() } : {}),
      ...(body.description !== undefined ? { description: body.description.trim() } : {}),
      ...(body.price !== undefined ? { price: body.price } : {}),
      ...(body.discount_price !== undefined ? { discount_price: body.discount_price } : {}),
      ...(body.image_url !== undefined ? { image_url: body.image_url.trim() } : {}),
      ...(body.category !== undefined ? { category: body.category.trim() } : {}),
      ...(body.stock !== undefined ? { stock: body.stock } : {}),
    };

    if (Object.keys(updates).length === 0) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'No product fields provided to update',
      };
      return NextResponse.json(response, { status: 400 });
    }

    const updated = await updateProduct(id, updates);

    if (!updated) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Product not found',
      };
      return NextResponse.json(response, { status: 404 });
    }

    const response: ApiResponse<Product> = {
      success: true,
      data: updated,
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
    const deleted = await deleteProduct(id);

    if (!deleted) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Product not found',
      };
      return NextResponse.json(response, { status: 404 });
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
