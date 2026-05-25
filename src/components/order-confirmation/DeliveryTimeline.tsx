import { CheckCircle, Truck } from 'lucide-react';

interface DeliveryTimelineProps {
  isPaid: boolean;
  orderDate: string;
}

export function DeliveryTimeline({ isPaid, orderDate }: DeliveryTimelineProps) {
  return (
    <div className="border-t pt-6">
      <h3 className="mb-4 text-lg font-semibold">Delivery Status</h3>
      <div className="space-y-4">
        <TimelineStep
          icon={<CheckCircle className="mb-2 h-6 w-6 text-green-500" />}
          title="Order Confirmed"
          subtitle={new Date(orderDate).toLocaleDateString()}
          showConnector
        />
        <TimelineStep
          icon={
            <div
              className={`mb-2 h-6 w-6 rounded-full border-2 ${
                isPaid ? 'border-green-500 bg-green-500' : 'border-gray-300'
              }`}
            />
          }
          title="Payment Received"
          subtitle={isPaid ? 'Completed' : 'Pending'}
          showConnector
        />
        <TimelineStep
          icon={<div className="mb-2 h-6 w-6 rounded-full border-2 border-gray-300" />}
          title="Item Shipped"
          subtitle="Coming soon"
          showConnector
        />
        <TimelineStep icon={<Truck className="h-6 w-6 text-gray-400" />} title="Delivered" subtitle="Estimated in 3-5 business days" />
      </div>
    </div>
  );
}

function TimelineStep({
  icon,
  title,
  subtitle,
  showConnector = false,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  showConnector?: boolean;
}) {
  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center">
        {icon}
        {showConnector ? <div className="h-8 w-px bg-gray-300" /> : null}
      </div>
      <div>
        <p className="font-semibold">{title}</p>
        <p className="text-sm text-gray-600">{subtitle}</p>
      </div>
    </div>
  );
}
