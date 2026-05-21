import { randomUUID } from 'crypto';

import {
  createLocalOrder,
  readLocalOrderById,
  readLocalOrdersByUser,
  updateLocalOrder,
  updateLocalOrderById,
} from '@/lib/local-order-store';
import { Order } from '@/types';

/** Order persistence — uses local storage keyed by Supabase (or local) user id. */
export async function createOrder(order: Omit<Order, 'id' | 'created_at' | 'updated_at'>): Promise<Order> {
  const now = new Date().toISOString();
  const fullOrder: Order = {
    id: randomUUID(),
    ...order,
    created_at: now,
    updated_at: now,
  };
  return createLocalOrder(fullOrder);
}

export async function getOrdersByUserId(userId: string): Promise<Order[]> {
  return readLocalOrdersByUser(userId);
}

export async function getOrderById(
  orderId: string,
  userId?: string,
): Promise<Order | null> {
  return readLocalOrderById(orderId, userId);
}

export async function updateOrderById(
  orderId: string,
  updates: Partial<Order>,
  userId?: string,
): Promise<Order | null> {
  if (userId) {
    return updateLocalOrder(orderId, userId, updates);
  }
  return updateLocalOrderById(orderId, updates);
}
