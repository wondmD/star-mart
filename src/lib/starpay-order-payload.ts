import { env } from '@/lib/env';
import { CreateStarPayOrderInput, StarPayOrderItem } from '@/lib/starpay';
import { Order } from '@/types';

export function buildStarPayOrderInput(
  order: Order,
  userId: string,
  options?: { customerEmail?: string },
): CreateStarPayOrderInput {
  const appUrl = env.NEXT_PUBLIC_APP_URL.replace(/\/$/, '');
  const items: StarPayOrderItem[] = order.items.map((item) => ({
    productId: item.product_id,
    quantity: item.quantity,
    item_name: item.product_name,
    unit_price: item.price,
  }));

  const subtotal = items.reduce(
    (sum, item) => sum + item.unit_price * item.quantity,
    0,
  );
  const vatAmount = Math.round((order.total_amount - subtotal) * 100) / 100;

  if (vatAmount > 0) {
    items.push({
      productId: crypto.randomUUID(),
      quantity: 1,
      item_name: 'VAT 15%',
      unit_price: vatAmount,
    });
  }

  return {
    amount: order.total_amount,
    currency: 'ETB',
    description: `StarMart order ${order.id}`,
    customerName: order.delivery_address.full_name,
    customerPhoneNumber: order.phone_number,
    items,
    callbackURL: `${appUrl}/api/payment/callback`,
    redirectUrl: `${appUrl}/order-confirmation/${order.id}?payment=return`,
    customerEmail: options?.customerEmail,
    metadata: {
      order_reference: order.id,
      merchant_id: 'starmart',
      customer_id: userId,
    },
  };
}
