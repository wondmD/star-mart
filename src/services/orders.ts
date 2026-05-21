import api from './products';
import { ApiResponse, Order, CheckoutFormData, CartItem } from '@/types';

export interface CreateOrderRequest {
  items: CartItem[];
  delivery_address: CheckoutFormData;
  payment_method: string;
  notes?: string;
}

export const orderService = {
  async createOrder(data: CreateOrderRequest): Promise<Order> {
    const response = await api.post<ApiResponse<Order>>('/orders', data);
    if (!response.data.data) {
      throw new Error('Failed to create order');
    }
    return response.data.data;
  },

  async getOrders(): Promise<Order[]> {
    const response = await api.get<ApiResponse<Order[]>>('/orders');
    return response.data.data || [];
  },

  async getOrderById(id: string): Promise<Order> {
    const response = await api.get<ApiResponse<Order>>(`/orders/${id}`);
    if (!response.data.data) {
      throw new Error('Order not found');
    }
    return response.data.data;
  },

  async updateOrderStatus(id: string, status: Order['status']): Promise<Order> {
    const response = await api.patch<ApiResponse<Order>>(`/orders/${id}`, {
      status,
    });
    if (!response.data.data) {
      throw new Error('Failed to update order');
    }
    return response.data.data;
  },
};
