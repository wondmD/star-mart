import { NextRequest, NextResponse } from 'next/server';

import {
  attachStarPayPaymentSession,
  getOrderById,
} from '@/lib/order-payment-update';
import { syncOrderPaymentFromStarPay } from '@/lib/payment-sync';
import { buildStarPayOrderInput } from '@/lib/starpay-order-payload';
import { createStarPayOrder, extractStarPayError } from '@/lib/starpay';
import { getUserIdFromRequest } from '@/lib/request-auth';
import { ApiResponse, PaymentResponse } from '@/types';

/**
 * Resume or restart StarPay payment for a pending order.
 * Reuses saved payment_url when available; otherwise creates a new StarPay session.
 */
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
      order_id?: string;
      customer_email?: string;
    };

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

    if (order.status === 'paid') {
      const response: ApiResponse<PaymentResponse> = {
        success: true,
        data: {
          success: true,
          reference: order.id,
          status: 'PAID',
          message: 'This order is already paid',
        },
      };
      return NextResponse.json(response);
    }

    if (order.payment_id) {
      const sync = await syncOrderPaymentFromStarPay(order);
      if (sync.paid) {
        const response: ApiResponse<PaymentResponse> = {
          success: true,
          data: {
            success: true,
            reference: order.id,
            starpay_order_id: sync.starpayOrderId,
            status: 'PAID',
            message: 'Payment already completed',
          },
        };
        return NextResponse.json(response);
      }

      if (order.payment_url) {
        const response: ApiResponse<PaymentResponse> = {
          success: true,
          data: {
            success: false,
            reference: order.id,
            starpay_order_id: order.payment_id,
            payment_url: order.payment_url,
            status: sync.starpayStatus,
            message: 'Continue your pending StarPay payment',
          },
        };
        return NextResponse.json(response);
      }
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
        success: false,
        reference: order.id,
        transaction_id: starpayOrder.order_id,
        starpay_order_id: starpayOrder.order_id,
        payment_url: starpayOrder.payment_url,
        status: starpayOrder.status,
        message: 'New StarPay payment session created',
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error retrying StarPay payment:', error);
    const response: ApiResponse<null> = {
      success: false,
      error: extractStarPayError(error),
    };
    return NextResponse.json(response, { status: 500 });
  }
}
