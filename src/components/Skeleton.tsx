import React from 'react';

interface SkeletonProps {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = '' }) => {
  return (
    <div
      className={`animate-pulse rounded-md ${className}`}
      style={{ backgroundColor: 'var(--bg-secondary)' }}
    />
  );
};

// Product Card Skeleton - matches the ProductCard component structure
export const ProductCardSkeleton: React.FC = () => {
  return (
    <div
      className="flex flex-col h-full transition-all border rounded-2xl"
      style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-color)' }}
    >
      {/* Image placeholder */}
      <div className="relative w-full h-48 mb-4 overflow-hidden rounded-t-2xl">
        <Skeleton className="w-full h-full" />
        {/* Discount badge placeholder */}
        <Skeleton className="absolute top-2 right-2 w-12 h-6 rounded-lg" />
      </div>

      <div className="flex-1 flex flex-col px-2 pb-3">
        {/* Title */}
        <Skeleton className="h-6 w-3/4 mb-2 rounded" />

        {/* Description lines */}
        <Skeleton className="h-4 w-full mb-2 rounded" />
        <Skeleton className="h-4 w-2/3 mb-3 rounded" />

        {/* Category */}
        <Skeleton className="h-4 w-1/3 mb-4 rounded" />

        {/* Price */}
        <div className="flex items-baseline gap-2 mb-4">
          <Skeleton className="h-8 w-24 rounded" />
          <Skeleton className="h-6 w-20 rounded" />
        </div>

        {/* Buttons */}
        <div className="flex gap-2 mt-auto pt-4 border-t" style={{ borderColor: 'var(--border-color)' }}>
          <Skeleton className="flex-1 h-10 rounded-lg" />
          <Skeleton className="flex-1 h-10 rounded-lg" />
        </div>
      </div>
    </div>
  );
};

// Order Card Skeleton - matches the order card structure
export const OrderCardSkeleton: React.FC = () => {
  return (
    <div
      className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl border"
      style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}
    >
      <div className="flex-1">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Order ID */}
          <div>
            <Skeleton className="h-4 w-16 mb-2 rounded" />
            <Skeleton className="h-6 w-20 rounded" />
          </div>
          {/* Date */}
          <div>
            <Skeleton className="h-4 w-12 mb-2 rounded" />
            <Skeleton className="h-6 w-24 rounded" />
          </div>
          {/* Total */}
          <div>
            <Skeleton className="h-4 w-12 mb-2 rounded" />
            <Skeleton className="h-7 w-28 rounded" />
          </div>
          {/* Status */}
          <div>
            <Skeleton className="h-4 w-12 mb-2 rounded" />
            <Skeleton className="h-8 w-24 rounded-full" />
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-3 shrink-0">
        <Skeleton className="h-10 w-24 rounded-lg" />
        <Skeleton className="h-8 w-8 rounded-lg" />
      </div>
    </div>
  );
};

// Cart Item Skeleton - matches the cart item structure
export const CartItemSkeleton: React.FC = () => {
  return (
    <div
      className="flex gap-6 p-4 rounded-2xl border"
      style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}
    >
      {/* Image */}
      <Skeleton className="w-24 h-24 flex-shrink-0 rounded-lg" />

      <div className="flex-1 flex flex-col">
        {/* Title */}
        <Skeleton className="h-6 w-3/4 mb-2 rounded" />
        {/* Category */}
        <Skeleton className="h-4 w-1/3 mb-2 rounded" />
        {/* Price */}
        <Skeleton className="h-6 w-24 rounded" />
      </div>

      <div className="flex flex-col items-end justify-between">
        {/* Delete button */}
        <Skeleton className="h-10 w-10 rounded-lg" />
        {/* Quantity controls */}
        <Skeleton className="h-10 w-32 rounded-lg" />
        {/* Total */}
        <Skeleton className="h-6 w-24 rounded" />
      </div>
    </div>
  );
};

// Hero Section Skeleton - matches the home page hero
export const HeroSkeleton: React.FC = () => {
  return (
    <div
      className="relative w-full overflow-hidden border-y shadow-xl"
      style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-secondary)' }}
    >
      <div className="mx-auto flex min-h-65 max-w-none items-center justify-between gap-8 px-4 py-8 sm:px-6 lg:px-10 xl:px-14">
        {/* Text content */}
        <div className="max-w-2xl space-y-4">
          <Skeleton className="h-8 w-48 rounded-full" />
          <Skeleton className="h-16 w-full rounded" />
          <Skeleton className="h-6 w-3/4 rounded" />
          <div className="flex gap-3 mt-6">
            <Skeleton className="h-12 w-40 rounded-lg" />
            <Skeleton className="h-12 w-40 rounded-lg" />
          </div>
        </div>

        {/* Featured product card */}
        <div className="hidden lg:block w-105 shrink-0">
          <div
            className="overflow-hidden rounded-3xl border shadow-2xl"
            style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}
          >
            <Skeleton className="h-62.5 w-full" />
            <div className="space-y-4 p-5">
              <div className="flex items-end justify-between gap-4">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-20 rounded" />
                  <Skeleton className="h-10 w-32 rounded" />
                </div>
                <Skeleton className="h-16 w-20 rounded-2xl" />
              </div>
              <div className="flex gap-3">
                <Skeleton className="flex-1 h-12 rounded-lg" />
                <Skeleton className="flex-1 h-12 rounded-lg" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Filter Sidebar Skeleton
export const FilterSidebarSkeleton: React.FC = () => {
  return (
    <div
      className="h-fit rounded-3xl border p-5 shadow-sm"
      style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}
    >
      <div className="flex items-center justify-between gap-3 mb-5">
        <div className="space-y-2">
          <Skeleton className="h-4 w-24 rounded" />
          <Skeleton className="h-8 w-40 rounded" />
        </div>
        <Skeleton className="h-5 w-5 rounded" />
      </div>

      <div className="space-y-2 mb-6">
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} className="h-12 w-full rounded-2xl" />
        ))}
      </div>

      <div className="rounded-2xl border p-4" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-color)' }}>
        <Skeleton className="h-4 w-24 mb-4 rounded" />
        <div className="space-y-3">
          <Skeleton className="h-12 w-full rounded" />
          <Skeleton className="h-12 w-full rounded" />
        </div>
      </div>
    </div>
  );
};

// Order Summary Skeleton
export const OrderSummarySkeleton: React.FC = () => {
  return (
    <div
      className="space-y-4 p-6 rounded-2xl border sticky top-20"
      style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}
    >
      <Skeleton className="h-8 w-40 rounded" />

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex justify-between">
            <Skeleton className="h-4 w-32 rounded" />
            <Skeleton className="h-4 w-20 rounded" />
          </div>
        ))}
      </div>

      <div className="space-y-2 border-y py-4" style={{ borderColor: 'var(--border-color)' }}>
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex justify-between">
            <Skeleton className="h-4 w-20 rounded" />
            <Skeleton className="h-4 w-24 rounded" />
          </div>
        ))}
      </div>

      <div className="flex justify-between">
        <Skeleton className="h-8 w-16 rounded" />
        <Skeleton className="h-8 w-28 rounded" />
      </div>

      <Skeleton className="h-12 w-full rounded-lg" />
      <Skeleton className="h-12 w-full rounded-lg" />
    </div>
  );
};

// Feature Card Skeleton
export const FeatureCardSkeleton: React.FC = () => {
  return (
    <div
      className="rounded-2xl border p-6 text-center shadow-md"
      style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}
    >
      <Skeleton className="mx-auto mb-4 h-12 w-12 rounded-full" />
      <Skeleton className="h-6 w-24 mx-auto mb-2 rounded" />
      <Skeleton className="h-4 w-full mx-auto rounded" />
    </div>
  );
};

// Product Detail Skeleton
export const ProductDetailSkeleton: React.FC = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Image */}
      <div className="relative h-96 rounded-2xl overflow-hidden">
        <Skeleton className="w-full h-full" />
      </div>

      {/* Details */}
      <div className="space-y-6">
        <Skeleton className="h-10 w-3/4 rounded" />
        <Skeleton className="h-6 w-full rounded" />
        <Skeleton className="h-6 w-2/3 rounded" />

        <div className="flex items-baseline gap-3">
          <Skeleton className="h-10 w-32 rounded" />
          <Skeleton className="h-8 w-24 rounded" />
        </div>

        <Skeleton className="h-6 w-20 rounded" />

        <div className="flex gap-3">
          <Skeleton className="h-12 w-40 rounded-lg" />
          <Skeleton className="h-12 w-40 rounded-lg" />
        </div>
      </div>
    </div>
  );
};

export default Skeleton;
