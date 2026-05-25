import Link from 'next/link';
import { RefreshCcw, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/Button';

interface AdminPageHeaderProps {
  onRefresh: () => void;
}

export function AdminPageHeader({ onRefresh }: AdminPageHeaderProps) {
  return (
    <section
      className="rounded-4xl border p-6 shadow-lg"
      style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}
    >
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl space-y-4">
          <div
            className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold"
            style={{ backgroundColor: 'var(--accent-light)', color: 'var(--accent-secondary)' }}
          >
            <ShieldCheck className="h-4 w-4" />
            Admin product controls
          </div>
          <div>
            <h1 className="text-4xl font-black" style={{ color: 'var(--text-primary)' }}>
              Product CRUD
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6" style={{ color: 'var(--text-secondary)' }}>
              Create, edit, and remove products directly from the dashboard. Changes are saved
              in Supabase and show up immediately across the store.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button variant="outline" onClick={onRefresh}>
            <RefreshCcw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Link href="/products">
            <Button variant="outline">View Store</Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
