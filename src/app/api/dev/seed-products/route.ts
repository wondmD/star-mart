import { NextResponse } from 'next/server';
import { Product } from '@/types';
import { upsertLocalProducts } from '@/lib/local-product-store';

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

    const data = await upsertLocalProducts(seedProducts);

    return NextResponse.json(
      {
        success: true,
        message: `Seeded ${data.length} products`,
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
