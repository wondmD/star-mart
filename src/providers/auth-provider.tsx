'use client';

import { useEffect } from 'react';

import { authService } from '@/services/auth';
import { useAuthStore } from '@/stores/auth-store';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setUser, setLoading } = useAuthStore();

  useEffect(() => {
    let isMounted = true;

    async function restoreSession() {
      setLoading(true);

      try {
        const user = await authService.getCurrentUser();
        if (isMounted) {
          setUser(user);
        }
      } catch {
        if (isMounted) {
          setUser(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    restoreSession();

    return () => {
      isMounted = false;
    };
  }, [setUser, setLoading]);

  return <>{children}</>;
}
