import { getOrderById, updateOrderById } from '@/lib/orders-repository';
import { isStarPayPaidStatus } from '@/lib/starpay';
import { Order } from '@/types';

export { getOrderById };

export async function markOrderPaid(
  orderId: string,
  starpayOrderId: string,
  starpayStatus: string,
): Promise<Order | null> {
  return updateOrderById(orderId, {
    payment_id: starpayOrderId,
    status: isStarPayPaidStatus(starpayStatus) ? 'paid' : 'pending',
  });
}

export async function attachStarPayOrderId(
  orderId: string,
  starpayOrderId: string,
): Promise<Order | null> {
  return updateOrderById(orderId, {
    payment_id: starpayOrderId,
  });
}

export async function attachStarPayPaymentSession(
  orderId: string,
  starpayOrderId: string,
  paymentUrl: string,
): Promise<Order | null> {
  return updateOrderById(orderId, {
    payment_id: starpayOrderId,
    payment_url: paymentUrl,
  });
}
