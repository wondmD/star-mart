'use client';

import { useState, use } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { useProduct } from '@/hooks/useProducts';
import { Button } from '@/components/Button';
import { useCartStore } from '@/stores/cart-store';
import { showCartToast } from '@/lib/cart-toast';
import { ProductDetailSkeleton } from '@/components/product/ProductDetailSkeleton';
import { ProductImageGallery } from '@/components/product/ProductImageGallery';
import { ProductPurchasePanel } from '@/components/product/ProductPurchasePanel';

interface Props {
  params: Promise<{ id: string }>;
}

export default function ProductDetailsPage({ params }: Props) {
  const { id } = use(params);
  const [quantity, setQuantity] = useState(1);
  const { data: product, isLoading, error } = useProduct(id);
  const { addItem } = useCartStore();

  const handleAddToCart = () => {
    if (product) {
      addItem(product, quantity);
      showCartToast({ productName: product.name, quantity });
    }
  };

  if (isLoading) {
    return <ProductDetailSkeleton />;
  }

  if (error || !product) {
    return (
      <div className="py-12 text-center">
        <p className="text-lg text-red-600">Product not found</p>
        <Link href="/products">
          <Button className="mt-4">Back to Products</Button>
        </Link>
      </div>
    );
  }

  const discountPercentage = product.discount_price
    ? Math.round(((product.price - product.discount_price) / product.price) * 100)
    : 0;

  return (
    <div className="space-y-6 px-4 sm:px-6 lg:px-8">
      <Link href="/products" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700">
        <ArrowLeft className="h-4 w-4" />
        Back to Products
      </Link>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <ProductImageGallery product={product} discountPercentage={discountPercentage} />
        <ProductPurchasePanel
          product={product}
          quantity={quantity}
          onQuantityChange={setQuantity}
          onAddToCart={handleAddToCart}
        />
      </div>
    </div>
  );
}
