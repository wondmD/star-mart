'use client';

import { useDeferredValue, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { Search } from 'lucide-react';
import { productService } from '@/services/products';
import { HeaderSearchDropdown } from '@/components/header/HeaderSearchDropdown';

export function HeaderSearch() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const deferredSearchQuery = useDeferredValue(searchQuery.trim());
  const shouldFetchSuggestions = deferredSearchQuery.length > 0;

  const { data: searchResults = [], isFetching } = useQuery({
    queryKey: ['header-search-suggestions', deferredSearchQuery],
    queryFn: () =>
      productService.getProducts({ search: deferredSearchQuery, minPrice: 0, maxPrice: 100000 }),
    enabled: shouldFetchSuggestions,
    staleTime: 1000 * 60 * 2,
  });

  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedQuery = searchQuery.trim();
    if (!trimmedQuery) {
      return;
    }
    setIsSearchFocused(false);
    router.push(`/products?search=${encodeURIComponent(trimmedQuery)}`);
  };

  const closeSearch = () => setIsSearchFocused(false);

  return (
    <form className="relative mx-2 flex-1 max-w-2xl md:mx-4" onSubmit={handleSearchSubmit}>
      <div
        className="flex w-full items-center rounded-full border px-4 py-2"
        style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}
      >
        <Search className="h-4 w-4" style={{ color: 'var(--text-tertiary)' }} />
        <input
          name="search"
          type="search"
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          onFocus={() => setIsSearchFocused(true)}
          onBlur={() => setTimeout(() => setIsSearchFocused(false), 120)}
          placeholder="Search products, brands, and deals"
          className="ml-3 w-full bg-transparent text-sm outline-none"
          style={{ color: 'var(--text-primary)' }}
          autoComplete="off"
        />
      </div>

      {isSearchFocused && searchQuery.trim().length > 0 ? (
        <HeaderSearchDropdown
          query={searchQuery.trim()}
          results={searchResults}
          isFetching={isFetching}
          onClose={closeSearch}
        />
      ) : null}
    </form>
  );
}
