import { ReactNode } from 'react';

interface AuthPageLayoutProps {
  title: string;
  subtitle: string;
  children: ReactNode;
}

export function AuthPageLayout({ title, subtitle, children }: AuthPageLayoutProps) {
  return (
    <div
      className="flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 lg:px-8"
      style={{ backgroundColor: 'var(--bg-primary)' }}
    >
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="mb-4 flex justify-center">
            <div
              className="flex h-12 w-12 items-center justify-center rounded-lg"
              style={{ backgroundColor: 'var(--accent-primary)' }}
            >
              <span className="text-xl font-bold" style={{ color: 'var(--text-on-amber)' }}>
                S
              </span>
            </div>
          </div>
          <h2 className="text-4xl font-bold" style={{ color: 'var(--text-primary)' }}>
            {title}
          </h2>
          <p className="mt-2" style={{ color: 'var(--text-secondary)' }}>
            {subtitle}
          </p>
        </div>
        {children}
      </div>
    </div>
  );
}
