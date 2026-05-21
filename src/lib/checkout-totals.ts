/** 15% VAT applied at checkout (matches cart/checkout UI). */
export const CHECKOUT_TAX_RATE = 0.15;

export function subtotalFromLineItems(
  items: { price: number; quantity: number }[],
): number {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

export function totalWithTax(subtotal: number): number {
  return Math.round(subtotal * (1 + CHECKOUT_TAX_RATE) * 100) / 100;
}
