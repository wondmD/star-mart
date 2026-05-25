import { Card } from '@/components/FormElements';
import { PayRetryButton } from '@/components/PayRetryButton';

interface PaymentRequiredCardProps {
  orderId: string;
  customerEmail?: string;
  onPaid: () => void;
}

export function PaymentRequiredCard({
  orderId,
  customerEmail,
  onPaid,
}: PaymentRequiredCardProps) {
  return (
    <Card className="space-y-4 border border-amber-200 bg-amber-50">
      <p className="font-semibold text-amber-900">Payment required</p>
      <p className="text-sm text-amber-800">
        This order is still pending payment. You can continue on StarPay or start a new
        payment session.
      </p>
      <PayRetryButton orderId={orderId} customerEmail={customerEmail} label="Pay now" onPaid={onPaid} />
    </Card>
  );
}
