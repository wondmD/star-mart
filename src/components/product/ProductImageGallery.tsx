import Image from 'next/image';
import { Product } from '@/types';

interface ProductImageGalleryProps {
  product: Product;
  discountPercentage: number;
}

export function ProductImageGallery({ product, discountPercentage }: ProductImageGalleryProps) {
  return (
    <div className="relative">
      <div
        className="relative h-96 overflow-hidden rounded-lg md:h-125"
        style={{ backgroundColor: 'var(--bg-tertiary)' }}
      >
        <Image src={product.image_url} alt={product.name} fill className="object-cover" priority />
        {discountPercentage > 0 ? (
          <div
            className="absolute right-4 top-4 rounded-full px-4 py-2 font-bold"
            style={{
              backgroundColor: 'var(--badge-sale-bg)',
              color: 'var(--badge-sale-text)',
              boxShadow: 'var(--shadow-amber)',
            }}
          >
            -{discountPercentage}%
          </div>
        ) : null}
      </div>
    </div>
  );
}
