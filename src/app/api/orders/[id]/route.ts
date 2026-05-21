import { NextRequest, NextResponse } from 'next/server';

import { getOrderById, updateOrderById } from '@/lib/orders-repository';
import { getUserIdFromRequest } from '@/lib/request-auth';
import { ApiResponse, Order } from '@/types';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const userId = await getUserIdFromRequest(request);
    if (!userId) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Unauthorized',
      };
      return NextResponse.json(response, { status: 401 });
    }

    const { id } = await params;
    const order = await getOrderById(id, userId);

    if (!order) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Order not found',
      };
      return NextResponse.json(response, { status: 404 });
    }

    const response: ApiResponse<Order> = {
      success: true,
      data: order,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching order:', error);
    const response: ApiResponse<null> = {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch order',
    };
    return NextResponse.json(response, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const userId = await getUserIdFromRequest(request);
    if (!userId) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Unauthorized',
      };
      return NextResponse.json(response, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { status } = body;

    if (!status) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Status is required',
      };
      return NextResponse.json(response, { status: 400 });
    }

    const updatedOrder = await updateOrderById(id, { status }, userId);

    if (!updatedOrder) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Order not found',
      };
      return NextResponse.json(response, { status: 404 });
    }

    const response: ApiResponse<Order> = {
      success: true,
      data: updatedOrder,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error updating order:', error);
    const response: ApiResponse<null> = {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update order',
    };
    return NextResponse.json(response, { status: 500 });
  }
}
