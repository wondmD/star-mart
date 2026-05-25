'use client';

import { SiGoogle } from 'react-icons/si';
import { ButtonSpinner } from '@/components/Spinner';

interface GoogleSignInButtonProps {
  isLoading: boolean;
  onClick: () => void;
}

export function GoogleSignInButton({ isLoading, onClick }: GoogleSignInButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isLoading}
      className="flex w-full items-center justify-center gap-3 rounded-lg border px-4 py-3 text-sm font-semibold transition disabled:opacity-60"
      style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
    >
      {isLoading ? <ButtonSpinner /> : <SiGoogle className="h-5 w-5" />}
      Continue with Google
    </button>
  );
}
