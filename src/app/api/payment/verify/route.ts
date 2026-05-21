import { NextRequest, NextResponse } from 'next/server';

import { getOrderById } from '@/lib/order-payment-update';
import { syncOrderPaymentFromStarPay } from '@/lib/payment-sync';
import { getUserIdFromRequest } from '@/lib/request-auth';
import { extractStarPayError } from '@/lib/starpay';
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
    const { order_id } = body as { order_id?: string };

    if (!order_id) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Missing order_id',
      };
      return NextResponse.json(response, { status: 400 });
    }

    const order = await getOrderById(order_id, userId);
    if (!order) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Order not found',
      };
      return NextResponse.json(response, { status: 404 });
    }

    if (!order.payment_id) {
      const response: ApiResponse<PaymentResponse> = {
        success: true,
        data: {
          success: false,
          reference: order.id,
          message: 'No StarPay payment found for this order',
        },
      };
      return NextResponse.json(response);
    }

    const sync = await syncOrderPaymentFromStarPay(order);

    const response: ApiResponse<PaymentResponse> = {
      success: true,
      data: {
        success: sync.paid,
        transaction_id: sync.starpayOrderId ?? order.payment_id,
        starpay_order_id: sync.starpayOrderId ?? order.payment_id,
        reference: order.id,
        status: sync.starpayStatus,
        payment_url: sync.payment_url,
        message: sync.paid
          ? 'Payment verified successfully'
          : sync.failed
            ? 'Payment failed. You can try paying again from My Orders.'
            : 'Payment not yet confirmed. Complete payment on StarPay or try again.',
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error verifying StarPay payment:', error);
    const response: ApiResponse<null> = {
      success: false,
      error: extractStarPayError(error),
    };
    return NextResponse.json(response, { status: 500 });
  }
}
