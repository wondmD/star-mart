'use client';

import { useEffect, useRef, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { useCartStore } from '@/stores/cart-store';
import { useAuthStore } from '@/stores/auth-store';
import { HeaderLogo } from '@/components/header/HeaderLogo';
import { HeaderSearch } from '@/components/header/HeaderSearch';
import { HeaderNavLinks } from '@/components/header/HeaderNavLinks';
import { HeaderThemeToggle } from '@/components/header/HeaderThemeToggle';
import { HeaderCartLink } from '@/components/header/HeaderCartLink';
import { HeaderAuthActions } from '@/components/header/HeaderAuthActions';
import { HeaderMobileMenu } from '@/components/header/HeaderMobileMenu';

export const Header: React.FC = () => {
  const headerRef = useRef<HTMLElement | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { items } = useCartStore();
  const { user, logout } = useAuthStore();
  const cartItemCount = items.reduce((total, item) => total + item.quantity, 0);

  useEffect(() => {
    if (!mobileMenuOpen) {
      return;
    }

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Node | null;
      if (!target || headerRef.current?.contains(target)) {
        return;
      }
      setMobileMenuOpen(false);
    };

    document.addEventListener('pointerdown', handlePointerDown);
    return () => document.removeEventListener('pointerdown', handlePointerDown);
  }, [mobileMenuOpen]);

  return (
    <header
      ref={headerRef}
      className="sticky top-0 z-50 border-b backdrop-blur-xl"
      style={{ backgroundColor: 'var(--header-bg)', borderColor: 'var(--border-color)' }}
    >
      <nav className="flex h-16 w-full items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <HeaderLogo />
        <HeaderSearch />

        <div className="hidden shrink-0 items-center gap-8 xl:flex">
          <HeaderNavLinks user={user} />
        </div>

        <div className="flex shrink-0 items-center gap-4">
          <HeaderThemeToggle />
          <HeaderCartLink itemCount={cartItemCount} />
          <HeaderAuthActions
            user={user}
            logout={logout}
            isLoggingOut={isLoggingOut}
            onLogoutStart={() => setIsLoggingOut(true)}
            onLogoutEnd={() => setIsLoggingOut(false)}
          />

          <button
            type="button"
            onClick={() => setMobileMenuOpen((open) => !open)}
            className="p-2 md:hidden"
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" style={{ color: 'var(--text-primary)' }} />
            ) : (
              <Menu className="h-6 w-6" style={{ color: 'var(--text-primary)' }} />
            )}
          </button>
        </div>
      </nav>

      {mobileMenuOpen ? (
        <HeaderMobileMenu
          user={user}
          logout={logout}
          isLoggingOut={isLoggingOut}
          onLogoutStart={() => setIsLoggingOut(true)}
          onLogoutEnd={() => setIsLoggingOut(false)}
          onClose={() => setMobileMenuOpen(false)}
        />
      ) : null}
    </header>
  );
};
