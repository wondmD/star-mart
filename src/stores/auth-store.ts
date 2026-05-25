import { create } from 'zustand';
import { User } from '@/types';

interface AuthStore {
  user: User | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
}

function isSameUser(current: User | null, next: User | null): boolean {
  if (current === next) {
    return true;
  }

  if (!current || !next) {
    return false;
  }

  return (
    current.id === next.id &&
    current.email === next.email &&
    current.full_name === next.full_name &&
    Boolean(current.is_admin) === Boolean(next.is_admin) &&
    current.phone === next.phone &&
    current.avatar_url === next.avatar_url
  );
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  loading: true,
  
  setUser: (user: User | null) => {
    set((state) => {
      if (isSameUser(state.user, user)) {
        return state.loading ? { loading: false } : state;
      }

      return { user, loading: false };
    });
  },
  
  setLoading: (loading: boolean) => {
    set({ loading });
  },
  
  logout: () => {
    set({ user: null });
  },
}));
