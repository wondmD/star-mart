import {
  createLocalOrder,
  readLocalOrderById,
  readLocalOrders,
  readLocalOrdersByUser,
  updateLocalOrder,
  updateLocalOrderById,
} from '@/lib/local-order-store';
import { createSupabaseAdminClient } from '@/lib/supabase-admin';
import { DeliveryAddress, Order, OrderItem } from '@/types';

type OrderRow = {
  id: string;
  user_id: string;
  items: OrderItem[] | string;
  total_amount: number | string;
  status: Order['status'] | string | null;
  delivery_address: DeliveryAddress | string;
  payment_method: string | null;
  phone_number: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  payment_id: string | null;
  payment_url: string | null;
};

function isProduction(): boolean {
  return process.env.NODE_ENV === 'production';
}

function parseJsonValue<T>(value: T | string): T {
  if (typeof value !== 'string') {
    return value;
  }

  return JSON.parse(value) as T;
}

function toOrderRow(order: Order): OrderRow {
  return {
    id: order.id,
    user_id: order.user_id,
    items: order.items,
    total_amount: order.total_amount,
    status: order.status,
    delivery_address: order.delivery_address,
    payment_method: order.payment_method,
    phone_number: order.phone_number,
    notes: order.notes ?? null,
    created_at: order.created_at,
    updated_at: order.updated_at,
    payment_id: order.payment_id ?? null,
    payment_url: order.payment_url ?? null,
  };
}

function normalizeOrderRow(row: OrderRow): Order {
  return {
    id: row.id,
    user_id: row.user_id,
    items: parseJsonValue<OrderItem[]>(row.items),
    total_amount:
      typeof row.total_amount === 'number'
        ? row.total_amount
        : Number(row.total_amount),
    status:
      row.status === 'paid' ||
      row.status === 'shipped' ||
      row.status === 'delivered' ||
      row.status === 'cancelled'
        ? row.status
        : 'pending',
    delivery_address: parseJsonValue<DeliveryAddress>(row.delivery_address),
    payment_method: row.payment_method ?? '',
    phone_number: row.phone_number ?? '',
    notes: row.notes ?? undefined,
    created_at: row.created_at,
    updated_at: row.updated_at,
    payment_id: row.payment_id ?? undefined,
    payment_url: row.payment_url ?? undefined,
  };
}

function getOrdersClient() {
  return createSupabaseAdminClient();
}

function shouldUseLocalFallback(): boolean {
  return !isProduction();
}

async function createLocalFallbackOrder(
  order: Omit<Order, 'id' | 'created_at' | 'updated_at'>,
): Promise<Order> {
  const now = new Date().toISOString();
  const fullOrder: Order = {
    id: crypto.randomUUID(),
    ...order,
    created_at: now,
    updated_at: now,
  };

  return createLocalOrder(fullOrder);
}

export async function createOrder(
  order: Omit<Order, 'id' | 'created_at' | 'updated_at'>,
): Promise<Order> {
  const now = new Date().toISOString();
  const client = getOrdersClient();

  if (!client) {
    if (shouldUseLocalFallback()) {
      return createLocalFallbackOrder(order);
    }

    throw new Error(
      'Supabase is not configured for order persistence. Set SUPABASE_SERVICE_ROLE_KEY to store orders in production.',
    );
  }

  const payload: OrderRow = {
    ...toOrderRow({
      ...order,
      id: crypto.randomUUID(),
      created_at: now,
      updated_at: now,
    }),
  };

  const { data, error } = await client
    .from('orders')
    .insert([payload])
    .select('*')
    .single();

  if (error || !data) {
    throw new Error(error?.message || 'Failed to create order');
  }

  return normalizeOrderRow(data as OrderRow);
}

export async function getOrdersByUserId(userId: string): Promise<Order[]> {
  const client = getOrdersClient();

  if (!client) {
    return readLocalOrdersByUser(userId);
  }

  const { data, error } = await client
    .from('orders')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map((row) => normalizeOrderRow(row as OrderRow));
}

export async function getOrderById(
  orderId: string,
  userId?: string,
): Promise<Order | null> {
  const client = getOrdersClient();

  if (!client) {
    return readLocalOrderById(orderId, userId);
  }

  let query = client.from('orders').select('*').eq('id', orderId);

  if (userId) {
    query = query.eq('user_id', userId);
  }

  const { data, error } = await query.maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data ? normalizeOrderRow(data as OrderRow) : null;
}

export async function getOrderByPaymentId(
  paymentId: string,
): Promise<Order | null> {
  const client = getOrdersClient();

  if (!client) {
    const orders = await readLocalOrders();
    return orders.find((order) => order.payment_id === paymentId) ?? null;
  }

  const { data, error } = await client
    .from('orders')
    .select('*')
    .eq('payment_id', paymentId)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data ? normalizeOrderRow(data as OrderRow) : null;
}

export async function updateOrderById(
  orderId: string,
  updates: Partial<Order>,
  userId?: string,
): Promise<Order | null> {
  const client = getOrdersClient();

  if (!client) {
    if (userId) {
      return updateLocalOrder(orderId, userId, updates);
    }

    return updateLocalOrderById(orderId, updates);
  }

  const payload: Partial<OrderRow> = {
    ...(updates.id ? { id: updates.id } : {}),
    ...(updates.user_id ? { user_id: updates.user_id } : {}),
    ...(updates.items ? { items: updates.items } : {}),
    ...(typeof updates.total_amount === 'number'
      ? { total_amount: updates.total_amount }
      : {}),
    ...(updates.status ? { status: updates.status } : {}),
    ...(updates.delivery_address ? { delivery_address: updates.delivery_address } : {}),
    ...(updates.payment_method ? { payment_method: updates.payment_method } : {}),
    ...(updates.phone_number ? { phone_number: updates.phone_number } : {}),
    ...(updates.notes !== undefined ? { notes: updates.notes ?? null } : {}),
    ...(updates.payment_id !== undefined ? { payment_id: updates.payment_id ?? null } : {}),
    ...(updates.payment_url !== undefined ? { payment_url: updates.payment_url ?? null } : {}),
    updated_at: new Date().toISOString(),
  };

  let query = client.from('orders').update(payload).eq('id', orderId);

  if (userId) {
    query = query.eq('user_id', userId);
  }

  const { data, error } = await query.select('*').maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data ? normalizeOrderRow(data as OrderRow) : null;
}
