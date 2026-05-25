'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LogOut, User } from 'lucide-react';
import toast from 'react-hot-toast';
import { User as AppUser } from '@/types';

interface HeaderAuthActionsProps {
  user: AppUser | null;
  logout: () => void;
  isLoggingOut: boolean;
  onLogoutStart: () => void;
  onLogoutEnd: () => void;
  onNavigate?: () => void;
  variant?: 'desktop' | 'mobile';
}

export function HeaderAuthActions({
  user,
  logout,
  isLoggingOut,
  onLogoutStart,
  onLogoutEnd,
  onNavigate,
  variant = 'desktop',
}: HeaderAuthActionsProps) {
  const router = useRouter();

  const handleLogout = async () => {
    if (isLoggingOut) {
      return;
    }

    onLogoutStart();
    let loggedOutSuccessfully = false;

    try {
      const { authService } = await import('@/services/auth');
      await authService.logout();
      loggedOutSuccessfully = true;
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Logout failed');
    } finally {
      logout();
      onNavigate?.();
      router.replace('/');
      router.refresh();
      if (loggedOutSuccessfully) {
        toast.success('Logged out successfully');
      }
      onLogoutEnd();
    }
  };

  if (user) {
    if (variant === 'mobile') {
      return (
        <>
          <Link
            href="/profile"
            className="block transition"
            style={{ color: 'var(--text-secondary)' }}
            onClick={onNavigate}
          >
            Profile
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="w-full text-left transition disabled:opacity-60"
            style={{ color: 'var(--error)' }}
          >
            {isLoggingOut ? 'Logging out…' : 'Logout'}
          </button>
        </>
      );
    }

    return (
      <div className="hidden items-center gap-4 sm:flex">
        <Link
          href="/profile"
          className="flex items-center gap-2 transition"
          style={{ color: 'var(--text-secondary)' }}
        >
          <User className="h-5 w-5" />
          <span>{user.full_name}</span>
        </Link>
        <button
          type="button"
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="flex items-center gap-2 transition disabled:opacity-60"
          style={{ color: 'var(--error)' }}
        >
          <LogOut className="h-5 w-5" />
          <span>{isLoggingOut ? 'Logging out…' : 'Logout'}</span>
        </button>
      </div>
    );
  }

  if (variant === 'mobile') {
    return (
      <>
        <Link href="/login" className="block transition" style={{ color: 'var(--text-secondary)' }} onClick={onNavigate}>
          Login
        </Link>
        <Link
          href="/signup"
          className="block rounded px-4 py-2 text-white transition"
          style={{ backgroundColor: 'var(--accent-primary)' }}
          onClick={onNavigate}
        >
          Sign Up
        </Link>
      </>
    );
  }

  return (
    <div className="hidden items-center gap-2 sm:flex">
      <Link
        href="/login"
        className="rounded border px-4 py-2 transition"
        style={{ color: 'var(--text-primary)', borderColor: 'var(--border-color)' }}
      >
        Login
      </Link>
      <Link
        href="/signup"
        className="rounded px-4 py-2 text-white transition"
        style={{ backgroundColor: 'var(--accent-primary)' }}
      >
        Sign Up
      </Link>
    </div>
  );
}
