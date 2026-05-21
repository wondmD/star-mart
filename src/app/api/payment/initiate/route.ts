import { NextRequest, NextResponse } from 'next/server';

import {
  attachStarPayPaymentSession,
  getOrderById,
} from '@/lib/order-payment-update';
import { buildStarPayOrderInput } from '@/lib/starpay-order-payload';
import { createStarPayOrder, extractStarPayError } from '@/lib/starpay';
import { getUserIdFromRequest } from '@/lib/request-auth';
import { ApiResponse, PaymentResponse } from '@/types';

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
    const { order_id, customer_email } = body as {
      order_id: string;
      customer_email?: string;
    };

    if (!order_id) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Missing required field: order_id',
      };
      return NextResponse.json(response, { status: 400 });
    }

    const order = await getOrderById(order_id, userId);
    if (!order || order.user_id !== userId) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Order not found',
      };
      return NextResponse.json(response, { status: 404 });
    }

    const starpayOrder = await createStarPayOrder(
      buildStarPayOrderInput(order, userId, { customerEmail: customer_email }),
    );

    await attachStarPayPaymentSession(
      order_id,
      starpayOrder.order_id,
      starpayOrder.payment_url,
    );

    const response: ApiResponse<PaymentResponse> = {
      success: true,
      data: {
        success: true,
        transaction_id: starpayOrder.order_id,
        starpay_order_id: starpayOrder.order_id,
        reference: order_id,
        payment_url: starpayOrder.payment_url,
        expires_at: starpayOrder.expires_at,
        status: starpayOrder.status,
        message: 'Redirecting to StarPay to complete payment.',
      },
      message: 'StarPay order created successfully',
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error initiating StarPay payment:', error);

    const response: ApiResponse<null> = {
      success: false,
      error: extractStarPayError(error),
    };

    return NextResponse.json(response, { status: 500 });
  }
}
