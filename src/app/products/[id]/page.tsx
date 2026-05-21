'use client';

import { useState, use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useProduct } from '@/hooks/useProducts';
import { Button } from '@/components/Button';
import { Card } from '@/components/FormElements';
import { useCartStore } from '@/stores/cart-store';
import { ArrowLeft, ShoppingCart } from 'lucide-react';
import toast from 'react-hot-toast';

interface Props {
  params: Promise<{
    id: string;
  }>;
}

function ProductDetailSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-6 w-40 rounded bg-gray-200" />
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div className="h-96 rounded-lg bg-gray-200 md:h-[500px]" />
        <div className="space-y-4">
          <div className="h-5 w-24 rounded bg-gray-200" />
          <div className="h-10 w-3/4 rounded bg-gray-200" />
          <div className="h-8 w-1/2 rounded bg-gray-200" />
          <div className="h-20 w-full rounded bg-gray-200" />
          <div className="h-36 w-full rounded bg-gray-200" />
        </div>
      </div>
    </div>
  );
}

export default function ProductDetailsPage({ params }: Props) {
  const { id } = use(params);
  const [quantity, setQuantity] = useState(1);
  const { data: product, isLoading, error } = useProduct(id);
  const { addItem } = useCartStore();

  const handleAddToCart = () => {
    if (product) {
      addItem(product, quantity);
      toast.success(`Added ${quantity} item(s) to cart!`);
    }
  };

  if (isLoading) {
    return <ProductDetailSkeleton />;
  }

  if (error || !product) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 text-lg">Product not found</p>
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
    <div className="space-y-6">
      <Link href="/products" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700">
        <ArrowLeft className="w-4 h-4" />
        Back to Products
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Image */}
        <div className="relative">
          <div className="relative h-96 md:h-[500px] bg-gray-100 rounded-lg overflow-hidden">
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
            {discountPercentage > 0 && (
              <div className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg text-lg font-bold">
                -{discountPercentage}%
              </div>
            )}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold mb-2">
              {product.category}
            </span>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">{product.name}</h1>
          </div>

          <div className="space-y-2">
            <div className="flex items-baseline gap-3">
              {product.discount_price ? (
                <>
                  <span className="text-3xl font-bold text-blue-600">
                    ETB {product.discount_price.toFixed(2)}
                  </span>
                  <span className="text-xl text-gray-400 line-through">
                    ETB {product.price.toFixed(2)}
                  </span>
                </>
              ) : (
                <span className="text-3xl font-bold text-blue-600">
                  ETB {product.price.toFixed(2)}
                </span>
              )}
            </div>
            <p className="text-sm text-gray-600">
              {product.stock > 0 ? (
                <span className="text-green-600 font-semibold">{product.stock} items in stock</span>
              ) : (
                <span className="text-red-600 font-semibold">Out of stock</span>
              )}
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold text-gray-900">Description</h3>
            <p className="text-gray-700 leading-relaxed">{product.description}</p>
          </div>

          {/* Add to Cart */}
          <Card className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-100"
                >
                  −
                </button>
                <span className="text-lg font-semibold w-8 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-100"
                  disabled={quantity >= product.stock}
                >
                  +
                </button>
              </div>
            </div>

            <Button
              size="lg"
              className="w-full flex items-center justify-center gap-2"
              disabled={product.stock === 0}
              onClick={handleAddToCart}
            >
              <ShoppingCart className="w-5 h-5" />
              Add to Cart
            </Button>
          </Card>

          {/* Additional Info */}
          <div className="grid grid-cols-3 gap-4 pt-6 border-t">
            <div className="text-center">
              <p className="text-sm font-semibold text-gray-900">Free Shipping</p>
              <p className="text-xs text-gray-600">On orders over ETB 500</p>
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-gray-900">Easy Returns</p>
              <p className="text-xs text-gray-600">30-day return policy</p>
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-gray-900">Secure Payment</p>
              <p className="text-xs text-gray-600">100% encrypted</p>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      <div className="pt-8 border-t">
        <h2 className="text-2xl font-bold mb-6">Related Products</h2>
        <div className="bg-gray-50 p-12 rounded-lg text-center">
          <p className="text-gray-600">Related products section coming soon</p>
        </div>
      </div>
    </div>
  );
}
