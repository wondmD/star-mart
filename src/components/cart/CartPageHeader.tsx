import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export function CartPageHeader() {
  return (
    <div>
      <Link href="/products" className="mb-4 inline-flex items-center gap-2 text-blue-600 hover:text-blue-700">
        <ArrowLeft className="h-4 w-4" />
        Continue Shopping
      </Link>
      <h1 className="text-4xl font-bold">Shopping Cart</h1>
    </div>
  );
}
