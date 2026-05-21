import axios from 'axios';
import { ApiResponse, Product, ProductFilters } from '@/types';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const productService = {
  async getProducts(filters?: ProductFilters): Promise<Product[]> {
    const response = await api.get<ApiResponse<Product[]>>('/products', {
      params: filters,
    });
    return response.data.data || [];
  },

  async getProductById(id: string): Promise<Product> {
    const response = await api.get<ApiResponse<Product>>(`/products/${id}`);
    if (!response.data.data) {
      throw new Error('Product not found');
    }
    return response.data.data;
  },

  async searchProducts(query: string): Promise<Product[]> {
    const response = await api.get<ApiResponse<Product[]>>('/products/search', {
      params: { q: query },
    });
    return response.data.data || [];
  },
};

export default api;
