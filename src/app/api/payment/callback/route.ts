import { NextRequest, NextResponse } from 'next/server';

import {
  getOrderById,
  getOrderByPaymentId,
  markOrderPaid,
} from '@/lib/order-payment-update';
import { extractStarPayError, isStarPayPaidStatus } from '@/lib/starpay';
import { ApiResponse } from '@/types';

function extractCallbackFields(body: Record<string, unknown>) {
  const data =
    body.data && typeof body.data === 'object'
      ? (body.data as Record<string, unknown>)
      : undefined;
  const metadata =
    body.metadata && typeof body.metadata === 'object'
      ? (body.metadata as Record<string, unknown>)
      : data?.metadata && typeof data.metadata === 'object'
        ? (data.metadata as Record<string, unknown>)
        : undefined;

  const status = String(
    body.status ?? data?.status ?? body.payment_status ?? '',
  );

  const starpayOrderId = String(
    body.billRefNo ??
      body.order_id ??
      body.orderId ??
      data?.order_id ??
      data?.orderId ??
      body.transaction_id ??
      '',
  );

  const orderReference = String(
    metadata?.order_reference ??
      body.externalReferenceId ??
      body.reference ??
      data?.externalReferenceId ??
      '',
  );

  return { status, starpayOrderId, orderReference };
}

/**
 * StarPay webhook — called when payment status changes.
 * Configure callbackURL to point at this route (public HTTPS in production).
 */
export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const { status, starpayOrderId, orderReference } = extractCallbackFields(body);

    if (!orderReference && !starpayOrderId) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Missing order reference in callback payload',
      };
      return NextResponse.json(response, { status: 400 });
    }

    let orderId = orderReference || undefined;

    if (!orderId && starpayOrderId) {
      const matchedOrder = await getOrderByPaymentId(starpayOrderId);
      orderId = matchedOrder?.id;
    }

    if (!orderId) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Order not found for callback',
      };
      return NextResponse.json(response, { status: 404 });
    }

    const order = await getOrderById(orderId);
    if (!order) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Order not found',
      };
      return NextResponse.json(response, { status: 404 });
    }

    if (isStarPayPaidStatus(status)) {
      await markOrderPaid(
        orderId,
        starpayOrderId || order.payment_id || '',
        status,
      );
    }

    const response: ApiResponse<{ order_id: string; status: string }> = {
      success: true,
      data: { order_id: orderId, status },
      message: 'Callback processed',
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('StarPay callback error:', error);
    const response: ApiResponse<null> = {
      success: false,
      error: extractStarPayError(error),
    };
    return NextResponse.json(response, { status: 500 });
  }
}
