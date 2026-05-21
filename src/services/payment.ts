import api from './products';
import { ApiResponse, PaymentResponse } from '@/types';

export interface InitiatePaymentRequest {
  order_id: string;
  customer_email?: string;
}

export const paymentService = {
  async initiatePayment(data: InitiatePaymentRequest): Promise<PaymentResponse> {
    const response = await api.post<ApiResponse<PaymentResponse>>(
      '/payment/initiate',
      data,
    );
    if (!response.data.data) {
      throw new Error('Failed to initiate payment');
    }
    return response.data.data;
  },

  async verifyPayment(orderId: string): Promise<PaymentResponse> {
    const response = await api.post<ApiResponse<PaymentResponse>>(
      '/payment/verify',
      { order_id: orderId },
    );
    if (!response.data.data) {
      throw new Error('Failed to verify payment');
    }
    return response.data.data;
  },

  async getPaymentStatus(orderId: string): Promise<PaymentResponse> {
    const response = await api.get<ApiResponse<PaymentResponse>>(
      `/payment/status/${orderId}`,
    );
    if (!response.data.data) {
      throw new Error('Failed to get payment status');
    }
    return response.data.data;
  },

  async retryPayment(
    orderId: string,
    customerEmail?: string,
  ): Promise<PaymentResponse> {
    const response = await api.post<ApiResponse<PaymentResponse>>(
      '/payment/retry',
      { order_id: orderId, customer_email: customerEmail },
    );
    if (!response.data.data) {
      throw new Error('Failed to retry payment');
    }
    return response.data.data;
  },
};
