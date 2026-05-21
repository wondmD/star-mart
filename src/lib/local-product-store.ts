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

export async function readLocalProducts(): Promise<Product[]> {
  return readProductsFile();
}

export async function upsertLocalProducts(products: Product[]): Promise<Product[]> {
  const existingProducts = await readProductsFile();
  const productMap = new Map(existingProducts.map((product) => [product.id, product]));

  for (const product of products) {
    productMap.set(product.id, product);
  }

  const mergedProducts = Array.from(productMap.values()).sort((left, right) => {
    return new Date(right.created_at).getTime() - new Date(left.created_at).getTime();
  });

  await mkdir(dataDirectory, { recursive: true });
  await writeFile(productsFilePath, JSON.stringify(mergedProducts, null, 2), 'utf8');

  return mergedProducts;
}
