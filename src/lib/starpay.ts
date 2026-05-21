import axios, { AxiosError } from 'axios';

import { env } from '@/lib/env';

export interface StarPayOrderItem {
  productId: string;
  quantity: number;
  item_name: string;
  unit_price: number;
}

export interface CreateStarPayOrderInput {
  amount: number;
  description: string;
  currency: string;
  customerName: string;
  customerPhoneNumber: string;
  items: StarPayOrderItem[];
  callbackURL: string;
  redirectUrl: string;
  customerEmail?: string;
  expiredAt?: string;
  metadata?: Record<string, string | number | boolean>;
}

export interface StarPayOrderData {
  order_id: string;
  status: string;
  amount: number;
  currency: string;
  payment_url: string;
  expires_at?: string;
  metadata?: Record<string, unknown>;
}

export interface StarPayVerifyData {
  order_id: string;
  status: string;
  amount?: string | number;
  currency?: string;
  updated_at?: string;
  expired_at?: string;
  payment_url?: string;
}

export interface StarPayApiResponse<T> {
  status: string;
  timestamp?: string;
  message?: string;
  data?: T;
}

function getStarPayBaseUrl(): string {
  return env.STARPAY_API_BASE_URL.replace(/\/$/, '');
}

function getStarPaySecret(): string {
  const secret = env.STARPAY_SECRET_KEY || env.NEXT_PUBLIC_STARPAY_API_KEY;
  if (!secret) {
    throw new Error(
      'StarPay is not configured. Set STARPAY_SECRET_KEY in .env.local',
    );
  }
  return secret;
}

function buildHeaders(): Record<string, string> {
  const secret = getStarPaySecret();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'x-api-secret': secret,
  };

  const apiKey = env.NEXT_PUBLIC_STARPAY_API_KEY;
  if (apiKey) {
    headers.Authorization = `Bearer ${apiKey}`;
  }

  return headers;
}

/** Ethiopian mobile for StarPay QA — normalize to +251 E.164 format. */
export function normalizeStarPayPhone(phone: string): string {
  const digits = phone.replace(/\D/g, '');

  if (phone.trim().startsWith('+251') && digits.length === 12) {
    return `+${digits}`;
  }

  if (digits.startsWith('251') && digits.length === 12) {
    return `+${digits}`;
  }

  if (digits.startsWith('0') && digits.length === 10) {
    return `+251${digits.slice(1)}`;
  }

  if (digits.length === 9 && digits.startsWith('9')) {
    return `+251${digits}`;
  }

  if (digits.length === 10 && digits.startsWith('9')) {
    return `+251${digits}`;
  }

  return phone.trim();
}

export function getDefaultOrderExpiry(): string {
  return new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString();
}

export async function createStarPayOrder(
  input: CreateStarPayOrderInput,
): Promise<StarPayOrderData> {
  const response = await axios.post<StarPayApiResponse<StarPayOrderData>>(
    `${getStarPayBaseUrl()}/order`,
    {
      amount: input.amount,
      description: input.description,
      currency: input.currency,
      customerName: input.customerName,
      customerPhoneNumber: normalizeStarPayPhone(input.customerPhoneNumber),
      items: input.items,
      callbackURL: input.callbackURL,
      redirectUrl: input.redirectUrl,
      customerEmail: input.customerEmail,
      expiredAt: input.expiredAt ?? getDefaultOrderExpiry(),
      metadata: input.metadata,
    },
    { headers: buildHeaders() },
  );

  const payload = response.data;

  if (payload.status !== 'success' || !payload.data?.payment_url) {
    throw new Error(payload.message || 'StarPay order creation failed');
  }

  return payload.data;
}

/** StarPay TRDP payment verification — POST /verify with { orderId }. */
export async function verifyStarPayOrder(
  starpayOrderId: string,
): Promise<StarPayVerifyData> {
  const response = await axios.post<StarPayApiResponse<StarPayVerifyData>>(
    `${getStarPayBaseUrl()}/verify`,
    { orderId: starpayOrderId },
    { headers: buildHeaders() },
  );

  const payload = response.data;

  if (payload.status !== 'success' || !payload.data) {
    throw new Error(payload.message || 'Failed to verify StarPay payment');
  }

  return payload.data;
}

/** @deprecated Use verifyStarPayOrder — GET /order/:id is not supported on TRDP QA. */
export async function getStarPayOrderStatus(
  starpayOrderId: string,
): Promise<StarPayVerifyData> {
  return verifyStarPayOrder(starpayOrderId);
}

export function isStarPayPaidStatus(status: string): boolean {
  const normalized = status.toUpperCase();
  return [
    'PAID',
    'SUCCESS',
    'COMPLETED',
    'SUCCESSFUL',
    'SETTLED',
    'APPROVED',
  ].includes(normalized);
}

export function isStarPayFailedStatus(status: string): boolean {
  const normalized = status.toUpperCase();
  return ['FAILED', 'CANCELLED', 'CANCELED', 'EXPIRED', 'DECLINED'].includes(
    normalized,
  );
}

export function extractStarPayError(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<{
      message?: string;
      error?: string | { message?: string };
    }>;
    const nested = axiosError.response?.data?.error;
    const nestedMessage =
      typeof nested === 'object' && nested?.message ? nested.message : undefined;

    return (
      nestedMessage ||
      axiosError.response?.data?.message ||
      (typeof nested === 'string' ? nested : undefined) ||
      axiosError.message ||
      'StarPay request failed'
    );
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'StarPay request failed';
}
