import { Product } from '@/types';

function asNumber(value: unknown): number | undefined {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === 'string') {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : undefined;
  }

  return undefined;
}

export function normalizeProductRow(row: Record<string, unknown>): Product {
  return {
    id: String(row.id ?? ''),
    name: String(row.name ?? 'Unnamed Product'),
    description: String(row.description ?? ''),
    price: asNumber(row.price) ?? 0,
    discount_price: asNumber(row.discount_price),
    image_url: String(row.image_url ?? '/placeholder.png'),
    category: String(row.category ?? 'General'),
    stock: asNumber(row.stock) ?? 0,
    created_at: String(row.created_at ?? new Date().toISOString()),
  };
}

export function buildProductPayload(input: {
  name: string;
  description: string;
  price: number;
  discount_price?: number | null;
  image_url: string;
  category: string;
  stock: number;
}): Record<string, unknown> {
  return {
    name: input.name,
    description: input.description,
    price: input.price,
    discount_price: input.discount_price ?? null,
    image_url: input.image_url,
    category: input.category,
    stock: input.stock,
  };
}

export function getMissingColumn(errorMessage: string): string | null {
  const match = errorMessage.match(/Could not find the '([^']+)' column/);
  return match?.[1] ?? null;
}

export async function mutateProductWithFallback<T>(
  mutation: (payload: Record<string, unknown>) => Promise<{ data: T | null; error: { message: string } | null }>,
  payload: Record<string, unknown>,
  removableColumns: string[] = ['discount_price', 'category'],
): Promise<T> {
  const removable = new Set(removableColumns);
  const attempted = new Set<string>();

  while (true) {
    const currentPayload = Object.fromEntries(
      Object.entries(payload).filter(([key]) => !attempted.has(key)),
    );

    const { data, error } = await mutation(currentPayload);

    if (!error && data) {
      return data;
    }

    if (!error) {
      throw new Error('Product mutation returned no data');
    }

    const missingColumn = getMissingColumn(error.message);
    if (!missingColumn || !removable.has(missingColumn) || attempted.has(missingColumn)) {
      throw new Error(error.message);
    }

    attempted.add(missingColumn);
  }
}
