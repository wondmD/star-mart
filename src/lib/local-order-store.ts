import { mkdir, readFile, writeFile } from 'fs/promises';
import path from 'path';

import { Order } from '@/types';

const dataDirectory = path.join(process.cwd(), '.data');
const ordersFilePath = path.join(dataDirectory, 'orders.json');

async function readOrdersFile(): Promise<Order[]> {
  try {
    const raw = await readFile(ordersFilePath, 'utf8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as Order[]) : [];
  } catch {
    return [];
  }
}

async function writeOrdersFile(orders: Order[]): Promise<void> {
  await mkdir(dataDirectory, { recursive: true });
  await writeFile(ordersFilePath, JSON.stringify(orders, null, 2), 'utf8');
}

export async function readLocalOrders(): Promise<Order[]> {
  return readOrdersFile();
}

export async function readLocalOrdersByUser(userId: string): Promise<Order[]> {
  const orders = await readOrdersFile();
  return orders
    .filter((order) => order.user_id === userId)
    .sort(
      (left, right) =>
        new Date(right.created_at).getTime() - new Date(left.created_at).getTime(),
    );
}

export async function readLocalOrderById(
  orderId: string,
  userId?: string,
): Promise<Order | null> {
  const orders = await readOrdersFile();
  const order = orders.find((entry) => entry.id === orderId);

  if (!order) {
    return null;
  }

  if (userId && order.user_id !== userId) {
    return null;
  }

  return order;
}

export async function createLocalOrder(order: Order): Promise<Order> {
  const orders = await readOrdersFile();
  const nextOrders = [order, ...orders];
  await writeOrdersFile(nextOrders);
  return order;
}

export async function updateLocalOrderById(
  orderId: string,
  updates: Partial<Order>,
): Promise<Order | null> {
  const orders = await readOrdersFile();
  const index = orders.findIndex((order) => order.id === orderId);

  if (index === -1) {
    return null;
  }

  const updatedOrder: Order = {
    ...orders[index],
    ...updates,
    updated_at: new Date().toISOString(),
  };

  orders[index] = updatedOrder;
  await writeOrdersFile(orders);
  return updatedOrder;
}

export async function updateLocalOrder(
  orderId: string,
  userId: string,
  updates: Partial<Order>,
): Promise<Order | null> {
  const orders = await readOrdersFile();
  const index = orders.findIndex(
    (order) => order.id === orderId && order.user_id === userId,
  );

  if (index === -1) {
    return null;
  }

  const updatedOrder: Order = {
    ...orders[index],
    ...updates,
    updated_at: new Date().toISOString(),
  };

  orders[index] = updatedOrder;
  await writeOrdersFile(orders);
  return updatedOrder;
}
