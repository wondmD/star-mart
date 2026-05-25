import Link from 'next/link';

export function HeaderLogo() {
  return (
    <Link href="/" className="flex shrink-0 items-center gap-2 text-xl font-bold">
      <div
        className="flex h-8 w-8 items-center justify-center rounded-lg"
        style={{ backgroundColor: 'var(--accent-primary)' }}
      >
        <span className="font-bold" style={{ color: 'var(--text-on-amber)' }}>
          S
        </span>
      </div>
      <span className="hidden sm:inline" style={{ color: 'var(--text-primary)' }}>
        StarMart
      </span>
    </Link>
  );
}
