import { OrderItem } from '@/types';

interface OrderItemsListProps {
  items: OrderItem[];
}

export function OrderItemsList({ items }: OrderItemsListProps) {
  return (
    <div className="border-t pt-6">
      <h3 className="mb-4 text-lg font-semibold">Order Items</h3>
      <div className="space-y-3">
        {items.map((item, index) => (
          <div
            key={`${item.product_id}-${index}`}
            className="flex items-center justify-between rounded bg-gray-50 p-3"
          >
            <div>
              <p className="font-semibold">{item.product_name}</p>
              <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
            </div>
            <div className="text-right">
              <p className="font-semibold">ETB {item.subtotal.toFixed(2)}</p>
              <p className="text-sm text-gray-600">ETB {item.price.toFixed(2)} each</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
