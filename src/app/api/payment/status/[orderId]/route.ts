import { NextRequest, NextResponse } from 'next/server';

import { getOrderById } from '@/lib/order-payment-update';
import { syncOrderPaymentFromStarPay } from '@/lib/payment-sync';
import { getUserIdFromRequest } from '@/lib/request-auth';
import { extractStarPayError } from '@/lib/starpay';
import { ApiResponse, PaymentResponse } from '@/types';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ orderId: string }> },
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

    const { orderId } = await params;
    const order = await getOrderById(orderId, userId);

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
          reference: orderId,
          status: order.status,
          message: 'Payment has not been initiated yet',
        },
      };
      return NextResponse.json(response);
    }

    const sync = await syncOrderPaymentFromStarPay(order);

    const response: ApiResponse<PaymentResponse> = {
      success: true,
      data: {
        success: sync.paid,
        reference: orderId,
        starpay_order_id: sync.starpayOrderId ?? order.payment_id,
        status: sync.starpayStatus,
        payment_url: sync.payment_url,
        message: sync.paid
          ? 'Payment verified'
          : sync.failed
            ? 'Payment failed or was cancelled. You can try paying again.'
            : 'Payment still pending',
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching payment status:', error);
    const response: ApiResponse<null> = {
      success: false,
      error: extractStarPayError(error),
    };
    return NextResponse.json(response, { status: 500 });
  }
}
