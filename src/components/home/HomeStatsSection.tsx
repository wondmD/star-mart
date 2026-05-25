'use client';

import { FeatureCardSkeleton } from '@/components/Skeleton';
import { HOME_STAT_ITEMS } from '@/constants/home';

interface HomeStatsSectionProps {
  isLoading: boolean;
}

export function HomeStatsSection({ isLoading }: HomeStatsSectionProps) {
  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {isLoading
        ? [...Array(4)].map((_, index) => <FeatureCardSkeleton key={index} />)
        : HOME_STAT_ITEMS.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="rounded-3xl border p-6 shadow-sm"
                style={{
                  backgroundColor: 'var(--bg-secondary)',
                  borderColor: 'var(--border-color)',
                }}
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p
                      className="text-sm font-semibold uppercase tracking-[0.18em]"
                      style={{ color: 'var(--text-tertiary)' }}
                    >
                      {item.title}
                    </p>
                    <p className="mt-2 text-xl font-black" style={{ color: 'var(--text-primary)' }}>
                      {item.value}
                    </p>
                  </div>
                  <div className="rounded-2xl p-3" style={{ backgroundColor: 'var(--accent-light)' }}>
                    <Icon className="h-6 w-6" style={{ color: 'var(--accent-secondary)' }} />
                  </div>
                </div>
              </div>
            );
          })}
    </section>
  );
}
