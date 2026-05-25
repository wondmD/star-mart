import { DeliveryAddress } from '@/types';

interface DeliveryAddressBlockProps {
  address: DeliveryAddress;
}

export function DeliveryAddressBlock({ address }: DeliveryAddressBlockProps) {
  return (
    <div className="border-t pt-6">
      <h3 className="mb-4 text-lg font-semibold">Delivery Address</h3>
      <div className="rounded-lg bg-blue-50 p-4">
        <p className="font-semibold">{address.full_name}</p>
        <p className="text-gray-700">{address.address}</p>
        <p className="text-gray-700">
          {address.city}, {address.postal_code}
        </p>
        <p className="text-gray-700">{address.country}</p>
      </div>
    </div>
  );
}
