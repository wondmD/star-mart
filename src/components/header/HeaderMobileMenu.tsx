'use client';

import { HeaderNavLinks } from '@/components/header/HeaderNavLinks';
import { HeaderAuthActions } from '@/components/header/HeaderAuthActions';
import { User } from '@/types';

interface HeaderMobileMenuProps {
  user: User | null;
  logout: () => void;
  isLoggingOut: boolean;
  onLogoutStart: () => void;
  onLogoutEnd: () => void;
  onClose: () => void;
}

export function HeaderMobileMenu({
  user,
  logout,
  isLoggingOut,
  onLogoutStart,
  onLogoutEnd,
  onClose,
}: HeaderMobileMenuProps) {
  return (
    <div
      className="border-t md:hidden"
      style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}
    >
      <div className="space-y-4 px-4 py-4">
        <HeaderNavLinks user={user} className="block" onNavigate={onClose} />
        <HeaderAuthActions
          user={user}
          logout={logout}
          isLoggingOut={isLoggingOut}
          onLogoutStart={onLogoutStart}
          onLogoutEnd={onLogoutEnd}
          onNavigate={onClose}
          variant="mobile"
        />
      </div>
    </div>
  );
}
