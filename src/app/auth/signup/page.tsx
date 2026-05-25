'use client';

import { Suspense } from 'react';
import { SignupForm } from '@/components/auth/SignupForm';
import AuthFormSkeleton from '@/components/AuthFormSkeleton';

export default function SignupPage() {
  return (
    <Suspense fallback={<AuthFormSkeleton message="Loading signup…" />}>
      <SignupForm />
    </Suspense>
  );
}
