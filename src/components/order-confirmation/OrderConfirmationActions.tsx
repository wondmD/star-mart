import Link from 'next/link';
import { Home, Package } from 'lucide-react';
import { Button } from '@/components/Button';

export function OrderConfirmationActions() {
  return (
    <div className="flex flex-wrap justify-center gap-4">
      <Link href="/">
        <Button variant="outline" className="flex items-center gap-2">
          <Home className="h-5 w-5" />
          Back to Home
        </Button>
      </Link>
      <Link href="/orders">
        <Button className="flex items-center gap-2">
          <Package className="h-5 w-5" />
          View All Orders
        </Button>
      </Link>
    </div>
  );
}
