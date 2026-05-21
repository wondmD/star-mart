'use client';

import React, { useDeferredValue, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { ShoppingCart, Menu, X, LogOut, User, Moon, Sun, Search, ShieldCheck } from 'lucide-react';
import { useCartStore } from '@/stores/cart-store';
import { useAuthStore } from '@/stores/auth-store';
import toast from 'react-hot-toast';
import { useTheme } from 'next-themes';
import { productService } from '@/services/products';

export const Header: React.FC = () => {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  const { items } = useCartStore();
  const { user, logout } = useAuthStore();
  const cartItemCount = items.reduce((total, item) => total + item.quantity, 0);
  const deferredSearchQuery = useDeferredValue(searchQuery.trim());
  const shouldFetchSuggestions = deferredSearchQuery.length > 0;

  const { data: searchResults = [], isFetching } = useQuery({
    queryKey: ['header-search-suggestions', deferredSearchQuery],
    queryFn: () => productService.getProducts({ search: deferredSearchQuery, minPrice: 0, maxPrice: 100000 }),
    enabled: shouldFetchSuggestions,
    staleTime: 1000 * 60 * 2,
  });

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = async () => {
    if (isLoggingOut) {
      return;
    }

    setIsLoggingOut(true);
    let loggedOutSuccessfully = false;

    try {
      const { authService } = await import('@/services/auth');
      await authService.logout();
      loggedOutSuccessfully = true;
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Logout failed');
    } finally {
      logout();
      setMobileMenuOpen(false);
      router.replace('/');
      router.refresh();
      if (loggedOutSuccessfully) {
        toast.success('Logged out successfully');
      }
      setIsLoggingOut(false);
    }
  };

  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedQuery = searchQuery.trim();

    if (!trimmedQuery) {
      return;
    }

    setIsSearchFocused(false);
    setMobileMenuOpen(false);
    router.push(`/products?search=${encodeURIComponent(trimmedQuery)}`);
  };

  return (
    <header className="sticky top-0 z-50 border-b backdrop-blur-xl" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}>
      <nav className="w-full px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-xl shrink-0">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--accent-primary)' }}>
            <span className="text-white font-bold">S</span>
          </div>
          <span className="hidden sm:inline" style={{ color: 'var(--text-primary)' }}>StarMart</span>
        </Link>

        {/* Search Bar */}
        <form className="relative flex-1 max-w-2xl mx-2 md:mx-4" onSubmit={handleSearchSubmit}>
          <div className="flex w-full items-center rounded-full border px-4 py-2" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}>
            <Search className="w-4 h-4" style={{ color: 'var(--text-tertiary)' }} />
            <input
              name="search"
              type="search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setTimeout(() => setIsSearchFocused(false), 120)}
              placeholder="Search products, brands, and deals"
              className="ml-3 w-full bg-transparent outline-none text-sm"
              style={{ color: 'var(--text-primary)' }}
              autoComplete="off"
            />
          </div>

          {isSearchFocused && searchQuery.trim().length > 0 && (
            <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-3xl border shadow-2xl" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}>
              <div className="px-4 py-3 text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: 'var(--text-tertiary)' }}>
                {isFetching ? 'Searching' : 'Matching items'}
              </div>
              <div className="max-h-96 overflow-y-auto">
                {searchResults.slice(0, 5).length > 0 ? (
                  searchResults.slice(0, 5).map((product) => (
                    <Link
                      key={product.id}
                      href={`/products/${product.id}`}
                      onMouseDown={() => setIsSearchFocused(false)}
                      className="block border-t px-4 py-3 transition hover:bg-black/5"
                      style={{ borderColor: 'var(--border-color)' }}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>{product.name}</p>
                          <p className="mt-1 text-sm line-clamp-1" style={{ color: 'var(--text-secondary)' }}>{product.category}</p>
                        </div>
                        <p className="text-sm font-semibold" style={{ color: 'var(--accent-secondary)' }}>
                          ETB {product.discount_price ?? product.price}
                        </p>
                      </div>
                    </Link>
                  ))
                ) : isFetching ? (
                  <div className="border-t px-4 py-4 text-sm" style={{ color: 'var(--text-secondary)', borderColor: 'var(--border-color)' }}>
                    Looking for matches...
                  </div>
                ) : (
                  <div className="border-t px-4 py-4 text-sm" style={{ color: 'var(--text-secondary)', borderColor: 'var(--border-color)' }}>
                    No matching items found.
                  </div>
                )}
              </div>
              <div className="border-t px-4 py-3" style={{ borderColor: 'var(--border-color)' }}>
                <Link
                  href={`/products?search=${encodeURIComponent(searchQuery.trim())}`}
                  onMouseDown={() => setIsSearchFocused(false)}
                  className="text-sm font-semibold"
                  style={{ color: 'var(--accent-secondary)' }}
                >
                  View all results
                </Link>
              </div>
            </div>
          )}
        </form>

        {/* Desktop Menu */}
        <div className="hidden xl:flex items-center gap-8 shrink-0">
          <Link href="/" className="transition" style={{ color: 'var(--text-secondary)' }}>
            Home
          </Link>
          <Link href="/products" className="transition" style={{ color: 'var(--text-secondary)' }}>
            Shop
          </Link>
          {user && (
            <Link href="/orders" className="transition" style={{ color: 'var(--text-secondary)' }}>
              Orders
            </Link>
          )}
          {user?.is_admin && (
            <Link href="/admin" className="inline-flex items-center gap-2 transition" style={{ color: 'var(--text-secondary)' }}>
              <ShieldCheck className="w-4 h-4" />
              Admin
            </Link>
          )}
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4 shrink-0">
          {/* Theme Toggle */}
          {mounted && (
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-lg transition border"
              style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5" style={{ color: 'var(--accent-primary)' }} />
              ) : (
                <Moon className="w-5 h-5" style={{ color: 'var(--accent-primary)' }} />
              )}
            </button>
          )}

          {/* Cart */}
          <Link href="/cart" className="relative p-2 transition">
            <ShoppingCart className="w-6 h-6" style={{ color: 'var(--text-primary)' }} />
            {cartItemCount > 0 && (
              <span className="absolute top-0 right-0 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center" style={{ backgroundColor: 'var(--accent-primary)' }}>
                {cartItemCount}
              </span>
            )}
          </Link>

          {/* Auth Links */}
          {user ? (
            <div className="hidden sm:flex items-center gap-4">
              <Link
                href="/profile"
                className="flex items-center gap-2 transition"
                style={{ color: 'var(--text-secondary)' }}
              >
                <User className="w-5 h-5" />
                <span>{user.full_name}</span>
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="flex items-center gap-2 transition disabled:opacity-60"
                style={{ color: 'var(--error)' }}
              >
                <LogOut className="w-5 h-5" />
                <span>{isLoggingOut ? 'Logging out…' : 'Logout'}</span>
              </button>
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-2">
              <Link href="/login" className="px-4 py-2 rounded transition border" style={{ color: 'var(--text-primary)', borderColor: 'var(--border-color)' }}>
                Login
              </Link>
              <Link href="/signup" className="text-white px-4 py-2 rounded transition" style={{ backgroundColor: 'var(--accent-primary)' }}>
                Sign Up
              </Link>
            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" style={{ color: 'var(--text-primary)' }} />
            ) : (
              <Menu className="w-6 h-6" style={{ color: 'var(--text-primary)' }} />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}>
          <div className="px-4 py-4 space-y-4">
            <Link href="/" className="block transition" style={{ color: 'var(--text-secondary)' }}>
              Home
            </Link>
            <Link href="/products" className="block transition" style={{ color: 'var(--text-secondary)' }}>
              Shop
            </Link>
            {user && (
              <>
                <Link href="/orders" className="block transition" style={{ color: 'var(--text-secondary)' }}>
                  Orders
                </Link>
                {user.is_admin && (
                  <Link href="/admin" className="inline-flex items-center gap-2 transition" style={{ color: 'var(--text-secondary)' }}>
                    <ShieldCheck className="w-4 h-4" />
                    Admin
                  </Link>
                )}
                <Link href="/profile" className="block transition" style={{ color: 'var(--text-secondary)' }}>
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
            )}
            {!user && (
              <>
                <Link href="/login" className="block transition" style={{ color: 'var(--text-secondary)' }}>
                  Login
                </Link>
                <Link href="/signup" className="block text-white px-4 py-2 rounded transition" style={{ backgroundColor: 'var(--accent-primary)' }}>
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
