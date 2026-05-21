import { NextRequest, NextResponse } from 'next/server';

import {
  subtotalFromLineItems,
  totalWithTax,
} from '@/lib/checkout-totals';
import { createOrder, getOrdersByUserId } from '@/lib/orders-repository';
import { getUserIdFromRequest } from '@/lib/request-auth';
import { ApiResponse, Order } from '@/types';

export async function GET(request: NextRequest) {
  try {
    const userId = await getUserIdFromRequest(request);
    if (!userId) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Unauthorized',
      };
      return NextResponse.json(response, { status: 401 });
    }

    const orders = await getOrdersByUserId(userId);

    const response: ApiResponse<Order[]> = {
      success: true,
      data: orders,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching orders:', error);
    const response: ApiResponse<null> = {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch orders',
    };
    return NextResponse.json(response, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = await getUserIdFromRequest(request);
    if (!userId) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Unauthorized',
      };
      return NextResponse.json(response, { status: 401 });
    }

    const body = await request.json();
    const { items, delivery_address, payment_method, notes } = body;

    if (!items || items.length === 0) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Order must contain at least one item',
      };
      return NextResponse.json(response, { status: 400 });
    }

    const lineItems = items.map(
      (item: {
        product_id: string;
        product: { name: string; price: number };
        quantity: number;
      }) => ({
        product_id: item.product_id,
        product_name: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
        subtotal: item.product.price * item.quantity,
      }),
    );

    const subtotal = subtotalFromLineItems(lineItems);
    const total_amount = totalWithTax(subtotal);

    const createdOrder = await createOrder({
      user_id: userId,
      items: lineItems,
      total_amount,
      delivery_address,
      payment_method,
      notes,
      status: 'pending',
      phone_number: delivery_address.phone_number,
    });

    const response: ApiResponse<Order> = {
      success: true,
      data: createdOrder,
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error('Error creating order:', error);
    const response: ApiResponse<null> = {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create order',
    };
    return NextResponse.json(response, { status: 500 });
  }
}
