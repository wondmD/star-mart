import React from 'react';
import { Skeleton } from '@/components/Skeleton';

export const AuthFormSkeleton: React.FC<{ message?: string }> = ({ message }) => {
  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 rounded-lg flex items-center justify-center">
              <Skeleton className="w-12 h-12 rounded-lg" />
            </div>
          </div>
          <div className="mx-auto" style={{ maxWidth: 320 }}>
            <Skeleton className="h-8 w-48 mx-auto mb-3 rounded" />
            <Skeleton className="h-4 w-64 mx-auto rounded" />
          </div>
        </div>

        <div className="p-8 rounded-lg shadow-md border" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}>
          <div className="space-y-4">
            <Skeleton className="h-12 w-full rounded" />
            <Skeleton className="h-12 w-full rounded" />
            <Skeleton className="h-12 w-full rounded" />
            <Skeleton className="h-12 w-full rounded" />
            <Skeleton className="h-12 w-full rounded" />
          </div>

          <div className="mt-6 space-y-3">
            <Skeleton className="h-12 w-full rounded-lg" />
            <Skeleton className="h-12 w-full rounded-lg" />
          </div>

          {message && (
            <p className="mt-4 text-center text-sm" style={{ color: 'var(--text-secondary)' }}>
              {message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthFormSkeleton;
