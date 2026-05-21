import { markOrderPaid } from '@/lib/order-payment-update';
import {
  isStarPayFailedStatus,
  isStarPayPaidStatus,
  verifyStarPayOrder,
} from '@/lib/starpay';
import { Order } from '@/types';

export interface PaymentSyncResult {
  paid: boolean;
  failed: boolean;
  starpayStatus: string;
  starpayOrderId?: string;
  payment_url?: string;
}

export async function syncOrderPaymentFromStarPay(
  order: Order,
): Promise<PaymentSyncResult> {
  if (order.status === 'paid') {
    return {
      paid: true,
      failed: false,
      starpayStatus: 'PAID',
      starpayOrderId: order.payment_id,
      payment_url: order.payment_url,
    };
  }

  if (!order.payment_id) {
    return {
      paid: false,
      failed: false,
      starpayStatus: 'NOT_INITIATED',
      payment_url: order.payment_url,
    };
  }

  const verified = await verifyStarPayOrder(order.payment_id);
  const paid = isStarPayPaidStatus(verified.status);
  const failed = isStarPayFailedStatus(verified.status);

  if (paid) {
    await markOrderPaid(order.id, verified.order_id, verified.status);
  }

  return {
    paid,
    failed,
    starpayStatus: verified.status,
    starpayOrderId: verified.order_id,
    payment_url: order.payment_url,
  };
}
