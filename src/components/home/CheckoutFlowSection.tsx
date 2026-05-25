'use client';

import { CreditCard, ShieldCheck } from 'lucide-react';
import { HOME_CHECKOUT_STEPS, HOME_TRUST_ITEMS } from '@/constants/home';

export function CheckoutFlowSection() {
  return (
    <section className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
      <div
        className="rounded-4xl border p-8 shadow-lg"
        style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}
      >
        <div className="flex items-center gap-3">
          <CreditCard className="h-6 w-6" style={{ color: 'var(--accent-secondary)' }} />
          <div>
            <p
              className="text-sm font-semibold uppercase tracking-[0.2em]"
              style={{ color: 'var(--text-tertiary)' }}
            >
              Checkout flow
            </p>
            <h2 className="mt-1 text-3xl font-black" style={{ color: 'var(--text-primary)' }}>
              Built to show engineering thinking
            </h2>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {HOME_CHECKOUT_STEPS.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.step}
                className="rounded-3xl border p-5"
                style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-color)' }}
              >
                <div className="flex items-center justify-between gap-4">
                  <span
                    className="text-xs font-semibold uppercase tracking-[0.3em]"
                    style={{ color: 'var(--accent-secondary)' }}
                  >
                    {item.step}
                  </span>
                  <Icon className="h-5 w-5" style={{ color: 'var(--accent-secondary)' }} />
                </div>
                <h3 className="mt-4 text-lg font-black" style={{ color: 'var(--text-primary)' }}>
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-6" style={{ color: 'var(--text-secondary)' }}>
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      <div
        className="rounded-4xl border p-8 shadow-lg"
        style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}
      >
        <div className="flex items-center gap-3">
          <ShieldCheck className="h-6 w-6" style={{ color: 'var(--accent-secondary)' }} />
          <div>
            <p
              className="text-sm font-semibold uppercase tracking-[0.2em]"
              style={{ color: 'var(--text-tertiary)' }}
            >
              Why it stands out
            </p>
            <h2 className="mt-1 text-2xl font-black" style={{ color: 'var(--text-primary)' }}>
              Clear trust and state feedback
            </h2>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          {HOME_TRUST_ITEMS.map((item) => (
            <div
              key={item.title}
              className="rounded-3xl border p-4"
              style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-color)' }}
            >
              <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                {item.title}
              </p>
              <p className="mt-1 text-sm leading-6" style={{ color: 'var(--text-secondary)' }}>
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
