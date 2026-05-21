import { useQuery, useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { productService } from '@/services/products';
import { Product, ProductFilters } from '@/types';

const PRODUCTS_QUERY_KEY = ['products'];

export const useProducts = (filters?: ProductFilters) => {
  return useQuery({
    queryKey: [...PRODUCTS_QUERY_KEY, filters],
    queryFn: () => productService.getProducts(filters),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useProduct = (id: string) => {
  return useQuery({
    queryKey: [...PRODUCTS_QUERY_KEY, id],
    queryFn: () => productService.getProductById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useSearchProducts = (query: string) => {
  return useQuery({
    queryKey: [...PRODUCTS_QUERY_KEY, 'search', query],
    queryFn: () => productService.searchProducts(query),
    enabled: query.length > 0,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
};

export const useInvalidateProducts = () => {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEY });
};
