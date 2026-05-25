import Link from 'next/link';
import Image from 'next/image';
import { Trash2 } from 'lucide-react';
import { Card } from '@/components/FormElements';
import { CartItem } from '@/types';

interface CartItemRowProps {
  item: CartItem;
  onRemove: (productId: string) => void;
  onUpdateQuantity: (productId: string, quantity: number) => void;
}

export function CartItemRow({ item, onRemove, onUpdateQuantity }: CartItemRowProps) {
  return (
    <Card className="flex gap-6">
      <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-gray-100">
        <Image src={item.product.image_url} alt={item.product.name} fill className="object-cover" />
      </div>

      <div className="flex flex-1 flex-col">
        <Link href={`/products/${item.product_id}`}>
          <h3 className="font-semibold text-gray-900 hover:text-blue-600">{item.product.name}</h3>
        </Link>
        <p className="text-sm text-gray-600">{item.product.category}</p>
        <p className="mt-2 font-bold text-blue-600">ETB {item.product.price.toFixed(2)}</p>
      </div>

      <div className="flex flex-col items-end justify-between">
        <button
          type="button"
          onClick={() => onRemove(item.product_id)}
          className="p-2 text-red-600 hover:text-red-700"
          aria-label={`Remove ${item.product.name}`}
        >
          <Trash2 className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-2 rounded-lg border">
          <button
            type="button"
            onClick={() => onUpdateQuantity(item.product_id, item.quantity - 1)}
            className="px-3 py-1 hover:bg-gray-100"
          >
            −
          </button>
          <span className="px-3 py-1 font-semibold">{item.quantity}</span>
          <button
            type="button"
            onClick={() => onUpdateQuantity(item.product_id, item.quantity + 1)}
            className="px-3 py-1 hover:bg-gray-100"
          >
            +
          </button>
        </div>

        <p className="font-bold text-gray-900">
          ETB {(item.product.price * item.quantity).toFixed(2)}
        </p>
      </div>
    </Card>
  );
}
