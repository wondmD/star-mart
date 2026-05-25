'use client';

import { useEffect } from 'react';

import { authService } from '@/services/auth';
import { useAuthStore } from '@/stores/auth-store';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    let isMounted = true;

    async function restoreSession() {
      useAuthStore.getState().setLoading(true);

      try {
        const user = await authService.getCurrentUser();
        if (isMounted) {
          useAuthStore.getState().setUser(user);
        }
      } catch {
        if (isMounted) {
          useAuthStore.getState().setUser(null);
        }
      } finally {
        if (isMounted) {
          useAuthStore.getState().setLoading(false);
        }
      }
    }

    void restoreSession();

    return () => {
      isMounted = false;
    };
  }, []);

  return <>{children}</>;
}
