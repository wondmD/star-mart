'use client';

import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useProducts } from '@/hooks/useProducts';
import { useCartStore } from '@/stores/cart-store';
import { showCartToast } from '@/lib/cart-toast';
import { FALLBACK_SALE_PRODUCT } from '@/constants/home';
import { HomeHeroSection } from '@/components/home/HomeHeroSection';
import { CategoryGridSection } from '@/components/home/CategoryGridSection';
import { FeaturedProductsSection } from '@/components/home/FeaturedProductsSection';
import { HomeStatsSection } from '@/components/home/HomeStatsSection';
import { HomeFeaturesSection } from '@/components/home/HomeFeaturesSection';
import { CheckoutFlowSection } from '@/components/home/CheckoutFlowSection';
import { HomeCtaSection } from '@/components/home/HomeCtaSection';
import { Product } from '@/types';

const ProductCarousel = dynamic(
  () =>
    import('@/components/ProductCarousel').then((module) => module.ProductCarousel),
  {
    loading: () => (
      <div
        className="h-48 animate-pulse rounded-2xl"
        style={{ backgroundColor: 'var(--bg-secondary)' }}
      />
    ),
  },
);

export default function Home() {
  const router = useRouter();
  const { data: products, isLoading } = useProducts({ minPrice: 0, maxPrice: 100000 });
  const { addItem } = useCartStore();

  const handleAddToCart = (product: Product) => {
    addItem(product, 1);
    showCartToast({ productName: product.name });
  };

  const handleCategoryShortcut = (category: string) => {
    router.push(`/products?category=${encodeURIComponent(category)}`);
  };

  const featuredProducts = products?.slice(0, 8) ?? [];
  const saleProduct =
    featuredProducts.find((product) => product.discount_price) ??
    featuredProducts[0] ??
    FALLBACK_SALE_PRODUCT;

  return (
    <div className="w-full space-y-16 pb-8 pt-0">
      <HomeHeroSection
        saleProduct={saleProduct}
        onCategorySelect={handleCategoryShortcut}
        onAddToCart={handleAddToCart}
      />

      <div className="w-full space-y-16 px-4 sm:px-6 lg:px-8">
        <CategoryGridSection onCategorySelect={handleCategoryShortcut} />
        <FeaturedProductsSection
          products={featuredProducts}
          isLoading={isLoading}
          onAddToCart={handleAddToCart}
        />
        <HomeStatsSection isLoading={isLoading} />
        <HomeFeaturesSection isLoading={isLoading} />
        <ProductCarousel title="Today's Deals" compact={false} />
        <CheckoutFlowSection />
        <ProductCarousel title="Recommended For You" category="Electronics" />
        <HomeCtaSection />
      </div>
    </div>
  );
}
