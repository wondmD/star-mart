import { Card } from '@/components/FormElements';
import { Order } from '@/types';
import { OrderItemsList } from '@/components/order-confirmation/OrderItemsList';
import { DeliveryAddressBlock } from '@/components/order-confirmation/DeliveryAddressBlock';
import { DeliveryTimeline } from '@/components/order-confirmation/DeliveryTimeline';

interface OrderDetailsCardProps {
  order: Order;
  isPaid: boolean;
}

export function OrderDetailsCard({ order, isPaid }: OrderDetailsCardProps) {
  return (
    <Card className="space-y-6">
      <div>
        <h2 className="mb-4 text-2xl font-bold">Order Details</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">Order ID</p>
            <p className="font-mono text-lg font-semibold">{order.id}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Status</p>
            <span
              className={`inline-block rounded-full px-3 py-1 text-sm font-semibold ${
                isPaid ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
              }`}
            >
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </span>
          </div>
          <div>
            <p className="text-sm text-gray-600">Order Date</p>
            <p className="font-semibold">{new Date(order.created_at).toLocaleDateString()}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Total Amount</p>
            <p className="text-lg font-semibold text-blue-600">
              ETB {order.total_amount.toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      <OrderItemsList items={order.items} />
      <DeliveryAddressBlock address={order.delivery_address} />
      <DeliveryTimeline isPaid={isPaid} orderDate={order.created_at} />
    </Card>
  );
}
