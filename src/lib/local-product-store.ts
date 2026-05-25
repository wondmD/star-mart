import { randomUUID } from 'crypto';
import { mkdir, readFile, writeFile } from 'fs/promises';
import path from 'path';

import { Product } from '@/types';

const dataDirectory = path.join(process.cwd(), '.data');
const productsFilePath = path.join(dataDirectory, 'products.json');

async function readProductsFile(): Promise<Product[]> {
  try {
    const raw = await readFile(productsFilePath, 'utf8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as Product[]) : [];
  } catch {
    return [];
  }
}

async function writeProductsFile(products: Product[]): Promise<void> {
  await mkdir(dataDirectory, { recursive: true });
  await writeFile(productsFilePath, JSON.stringify(products, null, 2), 'utf8');
}

export async function readLocalProducts(): Promise<Product[]> {
  const products = await readProductsFile();
  return products.sort(
    (left, right) =>
      new Date(right.created_at).getTime() - new Date(left.created_at).getTime(),
  );
}

export async function readLocalProductById(productId: string): Promise<Product | null> {
  const products = await readProductsFile();
  return products.find((product) => product.id === productId) ?? null;
}

export async function createLocalProduct(
  input: Omit<Product, 'id' | 'created_at'>,
): Promise<Product> {
  const products = await readProductsFile();
  const product: Product = {
    id: randomUUID(),
    created_at: new Date().toISOString(),
    ...input,
  };

  await writeProductsFile([product, ...products]);
  return product;
}

export async function updateLocalProductById(
  productId: string,
  updates: Partial<Omit<Product, 'id' | 'created_at'>>,
): Promise<Product | null> {
  const products = await readProductsFile();
  const index = products.findIndex((product) => product.id === productId);

  if (index === -1) {
    return null;
  }

  const updatedProduct: Product = {
    ...products[index],
    ...updates,
  };

  products[index] = updatedProduct;
  await writeProductsFile(products);
  return updatedProduct;
}

export async function deleteLocalProductById(productId: string): Promise<boolean> {
  const products = await readProductsFile();
  const nextProducts = products.filter((product) => product.id !== productId);

  if (nextProducts.length === products.length) {
    return false;
  }

  await writeProductsFile(nextProducts);
  return true;
}
