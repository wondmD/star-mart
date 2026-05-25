import { AlertCircle, CheckCircle } from 'lucide-react';

interface OrderConfirmationHeaderProps {
  isPaid: boolean;
}

export function OrderConfirmationHeader({ isPaid }: OrderConfirmationHeaderProps) {
  return (
    <div className="text-center">
      <div className="mb-4 flex justify-center">
        {isPaid ? (
          <CheckCircle className="h-16 w-16 text-green-500" />
        ) : (
          <AlertCircle className="h-16 w-16 text-amber-500" />
        )}
      </div>
      <h1 className="mb-2 text-4xl font-bold text-gray-900">
        {isPaid ? 'Order Confirmed!' : 'Order placed'}
      </h1>
      <p className="text-gray-600">
        {isPaid
          ? 'Thank you! Your StarPay payment was received.'
          : 'Your order is saved. Complete payment to confirm it.'}
      </p>
    </div>
  );
}
