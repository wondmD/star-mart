"use client";

import React from 'react';

type Props = {
  categories: { value: string; label: string }[];
  active?: string;
  onSelect?: (value: string) => void;
  className?: string;
};

export const CategoryList: React.FC<Props> = React.memo(function CategoryList({ categories, active = '', onSelect, className }) {
  return (
    <div className={className}>
      <div className="mt-5 space-y-2">
        {categories.map((item) => {
          const isActive = active === item.value;

          return (
            <button
              key={item.label}
              type="button"
              onClick={() => onSelect?.(item.value)}
              className="flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-sm font-semibold transition"
              style={{
                backgroundColor: isActive ? 'var(--accent-light)' : 'transparent',
                borderColor: isActive ? 'var(--accent-primary)' : 'var(--border-color)',
                color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
              }}
            >
              <span>{item.label}</span>
              {item.value && <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>{item.value}</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
});

export default CategoryList;
