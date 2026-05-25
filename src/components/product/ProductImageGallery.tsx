import Image from 'next/image';
import { Product } from '@/types';

interface ProductImageGalleryProps {
  product: Product;
  discountPercentage: number;
}

export function ProductImageGallery({ product, discountPercentage }: ProductImageGalleryProps) {
  return (
    <div className="relative">
      <div className="relative h-96 overflow-hidden rounded-lg bg-gray-100 md:h-125">
        <Image src={product.image_url} alt={product.name} fill className="object-cover" priority />
        {discountPercentage > 0 ? (
          <div className="absolute right-4 top-4 rounded-full bg-red-600 px-4 py-2 font-bold text-white">
            -{discountPercentage}%
          </div>
        ) : null}
      </div>
    </div>
  );
}
