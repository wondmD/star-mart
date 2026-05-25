import Link from 'next/link';
import { Button } from '@/components/Button';

export function HomeCtaSection() {
  return (
    <section
      className="rounded-4xl border p-10 text-center shadow-lg"
      style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}
    >
      <h2 className="mb-4 text-3xl font-black" style={{ color: 'var(--text-primary)' }}>
        Ready to Start Shopping?
      </h2>
      <p className="mx-auto mb-6 max-w-2xl" style={{ color: 'var(--text-secondary)' }}>
        Sign up for an account to track your orders, save your favorite items, and enjoy
        exclusive deals.
      </p>
      <Link href="/signup">
        <Button size="lg">Create an Account</Button>
      </Link>
    </section>
  );
}
