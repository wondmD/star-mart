import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';

interface HeaderCartLinkProps {
  itemCount: number;
}

export function HeaderCartLink({ itemCount }: HeaderCartLinkProps) {
  return (
    <Link href="/cart" className="relative p-2 transition">
      <ShoppingCart className="h-6 w-6" style={{ color: 'var(--text-primary)' }} />
      {itemCount > 0 ? (
        <span
          className="absolute right-0 top-0 flex h-5 w-5 items-center justify-center rounded-full text-xs text-white"
          style={{ backgroundColor: 'var(--accent-primary)' }}
        >
          {itemCount}
        </span>
      ) : null}
    </Link>
  );
}
