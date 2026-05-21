import { NextResponse } from 'next/server';

import { createSupabaseAdminClient } from '@/lib/supabase-admin';
import { hasSupabaseConfig } from '@/lib/has-supabase';
import { Product } from '@/types';

const seedProducts: Product[] = [
  {
    id: '2d2c1b8f-9f1e-4a76-8f5c-2d7d0d4b0c01',
    name: 'Aurelia X1 Camera',
    description:
      'A compact mirrorless camera with crisp autofocus, 4K recording, and a light body built for everyday creators and weekend trips.',
    price: 24999,
    discount_price: 21999,
    image_url: '/camera.jpg',
    category: 'Photography',
    stock: 12,
    created_at: new Date().toISOString(),
  },
  {
    id: '2d2c1b8f-9f1e-4a76-8f5c-2d7d0d4b0c02',
    name: 'Pulse Buds Pro',
    description:
      'Noise-reducing wireless earbuds with punchy bass, a comfortable in-ear fit, and a charging case that keeps them ready all day.',
    price: 6999,
    discount_price: 5999,
    image_url: '/earbuds.jpg',
    category: 'Audio',
    stock: 26,
    created_at: new Date().toISOString(),
  },
  {
    id: '2d2c1b8f-9f1e-4a76-8f5c-2d7d0d4b0c03',
    name: 'Nova One Phone',
    description:
      'A sleek everyday smartphone with a bright display, reliable battery life, and a clean camera setup for social-ready photos.',
    price: 18999,
    discount_price: 16999,
    image_url: '/iphone.jpg',
    category: 'Mobile',
    stock: 18,
    created_at: new Date().toISOString(),
  },
  {
    id: '2d2c1b8f-9f1e-4a76-8f5c-2d7d0d4b0c04',
    name: 'MeshFlow Wi-Fi 6 Router',
    description:
      'A fast dual-band router built for stable streaming, low-latency gaming, and stronger coverage across medium-sized homes.',
    price: 8999,
    discount_price: 7999,
    image_url: '/modem.jpg',
    category: 'Networking',
    stock: 14,
    created_at: new Date().toISOString(),
  },
] as const;

function getMissingColumn(errorMessage: string): string | null {
  const match = errorMessage.match(/Could not find the '([^']+)' column/);
  return match?.[1] ?? null;
}

async function upsertWithSchemaCompatibility(
  supabase: NonNullable<ReturnType<typeof createSupabaseAdminClient>>,
  products: Product[],
) {
  const removableColumns = new Set(['discount_price', 'category']);
  const activeColumns = new Set<keyof Product>([
    'id',
    'name',
    'description',
    'price',
    'discount_price',
    'image_url',
    'category',
    'stock',
    'created_at',
  ]);

  while (true) {
    const payload = products.map((product) => {
      const row: Record<string, unknown> = {};
      for (const key of activeColumns) {
        row[key] = product[key];
      }
      return row as Partial<Product>;
    });

    const { data, error } = await supabase
      .from('products')
      .upsert(payload, { onConflict: 'id' })
      .select('*');

    if (!error) {
      return data;
    }

    const missingColumn = getMissingColumn(error.message);
    if (!missingColumn || !removableColumns.has(missingColumn)) {
      throw error;
    }

    activeColumns.delete(missingColumn as keyof Product);
  }
}

export async function POST() {
  try {
    if (process.env.NODE_ENV === 'production') {
      return NextResponse.json(
        {
          success: false,
          error: 'Seeding is disabled in production.',
        },
        { status: 403 }
      );
    }

    if (!hasSupabaseConfig()) {
      return NextResponse.json(
        {
          success: false,
          error: 'Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.',
        },
        { status: 503 }
      );
    }

    const supabase = createSupabaseAdminClient();

    if (!supabase) {
      return NextResponse.json(
        {
          success: false,
          error:
            'Missing SUPABASE_SERVICE_ROLE_KEY. Product seeding requires the service role key to bypass RLS.',
        },
        { status: 503 }
      );
    }

    const data = await upsertWithSchemaCompatibility(supabase, seedProducts as Product[]);

    return NextResponse.json(
      {
        success: true,
        message: `Seeded ${data?.length ?? 0} products in Supabase`,
        data,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error seeding products:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to seed products',
      },
      { status: 500 }
    );
  }
}
