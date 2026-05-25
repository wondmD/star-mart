import Link from 'next/link';
import { ShieldCheck } from 'lucide-react';
import { User } from '@/types';

interface HeaderNavLinksProps {
  user: User | null;
  className?: string;
  onNavigate?: () => void;
}

export function HeaderNavLinks({ user, className = '', onNavigate }: HeaderNavLinksProps) {
  const linkClass = `transition ${className}`.trim();

  return (
    <>
      <Link href="/" className={linkClass} style={{ color: 'var(--text-secondary)' }} onClick={onNavigate}>
        Home
      </Link>
      <Link href="/products" className={linkClass} style={{ color: 'var(--text-secondary)' }} onClick={onNavigate}>
        Shop
      </Link>
      {user ? (
        <Link href="/orders" className={linkClass} style={{ color: 'var(--text-secondary)' }} onClick={onNavigate}>
          Orders
        </Link>
      ) : null}
      {user?.is_admin ? (
        <Link
          href="/admin"
          className={`inline-flex items-center gap-2 ${linkClass}`}
          style={{ color: 'var(--text-secondary)' }}
          onClick={onNavigate}
        >
          <ShieldCheck className="h-4 w-4" />
          Admin
        </Link>
      ) : null}
    </>
  );
}
