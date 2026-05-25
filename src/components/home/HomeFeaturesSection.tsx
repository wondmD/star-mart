'use client';

import { RotateCcw, ShieldCheck, ShoppingBag, Truck } from 'lucide-react';
import { FeatureCardSkeleton } from '@/components/Skeleton';

interface HomeFeaturesSectionProps {
  isLoading: boolean;
}

const FEATURE_CARDS = [
  {
    icon: ShoppingBag,
    title: 'Wide Selection',
    description: 'Thousands of products across multiple categories',
  },
  {
    icon: Truck,
    title: 'Fast Delivery',
    description: 'Quick and reliable shipping across the country',
  },
  {
    icon: ShieldCheck,
    title: 'Secure Payment',
    description: 'Safe and encrypted payment processing',
  },
  {
    icon: RotateCcw,
    title: 'Easy Returns',
    description: 'Hassle-free returns within 30 days',
  },
] as const;

export function HomeFeaturesSection({ isLoading }: HomeFeaturesSectionProps) {
  return (
    <section id="features" className="grid grid-cols-1 gap-6 md:grid-cols-4">
      {isLoading
        ? [...Array(4)].map((_, index) => <FeatureCardSkeleton key={index} />)
        : FEATURE_CARDS.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="rounded-2xl border p-6 text-center shadow-md"
                style={{
                  backgroundColor: 'var(--bg-secondary)',
                  borderColor: 'var(--border-color)',
                }}
              >
                <Icon className="mx-auto mb-4 h-12 w-12" style={{ color: 'var(--accent-primary)' }} />
                <h3 className="mb-2 font-semibold">{item.title}</h3>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  {item.description}
                </p>
              </div>
            );
          })}
    </section>
  );
}
