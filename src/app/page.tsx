'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/Button';
import { useProducts } from '@/hooks/useProducts';
import { ProductCard } from '@/components/ProductCard';
import { useCartStore } from '@/stores/cart-store';
import { ShoppingBag, Truck, Shield, RotateCcw, Sparkles, ArrowRight, BadgePercent, Tag } from 'lucide-react';
import toast from 'react-hot-toast';
import { ProductCardSkeleton, FeatureCardSkeleton } from '@/components/Skeleton';

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
  const { data: products, isLoading } = useProducts({ minPrice: 0, maxPrice: 100000 });
  const { addItem } = useCartStore();
  const fallbackSaleProduct = {
    id: 'featured-camera',
    name: 'Aurelia X1 Camera',
    description:
      'A compact mirrorless camera with crisp autofocus, 4K recording, and a light body built for everyday creators and weekend trips.',
    price: 24999,
    discount_price: 21999,
    image_url: '/camera.jpg',
    category: 'Photography',
    stock: 12,
    created_at: '',
  };

  const handleAddToCart = (product: any) => {
    addItem(product, 1);
    toast.success('Added to cart!');
  };

  const featuredProducts = products?.slice(0, 8) || [];
  const saleProduct = featuredProducts.find((product) => product.discount_price) ?? featuredProducts[0] ?? fallbackSaleProduct;

  return (
    <div className="w-full space-y-16 pb-8 pt-0">
      <section className="relative w-full overflow-hidden border-y shadow-xl" style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-secondary)' }}>
        <div className="absolute inset-0">
          <Image src="/camera.jpg" alt="StarMart hero background" fill priority sizes="100vw" className="object-cover" />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(90deg, rgba(0, 48, 73, 0.96) 0%, rgba(0, 48, 73, 0.88) 40%, rgba(0, 48, 73, 0.55) 100%)' }} />
        </div>

        <div className="relative mx-auto flex min-h-65 max-w-none items-center justify-between gap-8 px-4 py-8 sm:px-6 lg:px-10 xl:px-14">
          <div className="max-w-2xl text-white">
            <div className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold" style={{ borderColor: 'rgba(252,251,247,0.2)', backgroundColor: 'rgba(252,251,247,0.1)' }}>
              
              Mega Sale is Live
            </div>
            <h1 className="mt-5 text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">Better deals. Faster shopping.</h1>
            <p className="mt-4 max-w-xl text-sm sm:text-base lg:text-lg" style={{ color: 'rgba(252,251,247,0.82)' }}>
              Discover discounted electronics, daily offers, and a cleaner shopping flow built around the new warm color system.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/products">
                <Button size="lg" className="w-full sm:w-auto" style={{ backgroundColor: 'var(--accent-primary)', color: 'var(--bg-secondary)' }}>
                  Shop Now
                </Button>
              </Link>
              <Link href="#featured-sale">
                <Button variant="outline" size="lg" className="w-full sm:w-auto" style={{ borderColor: 'rgba(252,251,247,0.3)', color: 'white' }}>
                  See Featured Deal
                </Button>
              </Link>
            </div>
          </div>

          <div id="featured-sale" className="hidden lg:block w-105 shrink-0">
            <div className="relative overflow-hidden rounded-3xl border shadow-2xl" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}>
              <div className="relative h-62.5">
                <Image src={saleProduct.image_url} alt={saleProduct.name} fill sizes="420px" className="object-cover" priority />
                <div className="absolute inset-0 bg-linear-to-t from-[#003049] via-[#003049]/10 to-transparent" />
                <div className="absolute left-4 top-4 flex flex-col gap-2">
                  <span className="inline-flex w-fit items-center gap-2 rounded-full bg-[#d62828] px-3 py-1 text-sm font-bold text-white">
                    <BadgePercent className="w-4 h-4" />
                    Hot Deal
                  </span>
                  {saleProduct.category && (
                    <span className="inline-flex w-fit items-center gap-2 rounded-full bg-white/90 px-3 py-1 text-sm font-semibold text-[#003049]">
                      <Tag className="w-4 h-4" />
                      {saleProduct.category}
                    </span>
                  )}
                </div>
                <div className="absolute inset-x-0 bottom-0 p-4 text-white">
                  <p className="text-xs uppercase tracking-[0.3em] text-[#fcbf49]">Featured deal</p>
                  <h2 className="mt-2 text-2xl font-black leading-tight">{saleProduct.name}</h2>
                </div>
              </div>

              <div className="space-y-4 p-5">
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.25em]" style={{ color: 'var(--text-secondary)' }}>Now only</p>
                    <div className="mt-1 flex items-end gap-3">
                      <span className="text-3xl font-black" style={{ color: 'var(--text-primary)' }}>
                        ETB {saleProduct.discount_price ? saleProduct.discount_price.toFixed(2) : saleProduct.price.toFixed(2)}
                      </span>
                      {saleProduct.discount_price && (
                        <span className="pb-1 text-base line-through" style={{ color: 'var(--text-tertiary)' }}>
                          ETB {saleProduct.price.toFixed(2)}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="rounded-2xl px-4 py-3 text-right" style={{ backgroundColor: 'var(--accent-light)' }}>
                    <p className="text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>Stock</p>
                    <p className="text-2xl font-black" style={{ color: 'var(--accent-secondary)' }}>{saleProduct.stock}</p>
                  </div>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <Button size="lg" className="flex-1" onClick={() => handleAddToCart(saleProduct)}>
                    Add to Cart
                  </Button>
                  <Link href={`/products/${saleProduct.id}`} className="flex-1">
                    <Button variant="outline" size="lg" className="w-full">
                      View Details
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="w-full px-4 sm:px-6 lg:px-8 space-y-16">
        <section>
          <div className="mb-8 flex items-center justify-between gap-4">
            <h2 className="text-3xl font-black" style={{ color: 'var(--text-primary)' }}>Featured Products</h2>
            <Link href="/products">
              <Button variant="outline">View All</Button>
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              {[...Array(8)].map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} />
              ))}
            </div>
          )}
        </section>

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {isLoading ? (
            [...Array(4)].map((_, i) => <FeatureCardSkeleton key={i} />)
          ) : (
            [
              { title: 'Flash deals', value: 'Daily drops', icon: ShoppingBag },
              { title: 'Fast delivery', value: '48h', icon: Truck },
              { title: 'Secure checkout', value: '100%', icon: Shield },
              { title: 'Easy returns', value: '30 days', icon: RotateCcw },
            ].map((item) => {
              const Icon = item.icon;

              return (
                <div key={item.title} className="rounded-3xl border p-6 shadow-sm" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}>
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-[0.18em]" style={{ color: 'var(--text-tertiary)' }}>{item.title}</p>
                      <p className="mt-2 text-xl font-black" style={{ color: 'var(--text-primary)' }}>{item.value}</p>
                    </div>
                    <div className="rounded-2xl p-3" style={{ backgroundColor: 'var(--accent-light)' }}>
                      <Icon className="h-6 w-6" style={{ color: 'var(--accent-secondary)' }} />
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </section>

        <section id="features" className="grid grid-cols-1 gap-6 md:grid-cols-4">
          {isLoading ? (
            [...Array(4)].map((_, i) => <FeatureCardSkeleton key={i} />)
          ) : (
            <>
              <div className="rounded-2xl border p-6 text-center shadow-md" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}>
                <ShoppingBag className="mx-auto mb-4 h-12 w-12" style={{ color: 'var(--accent-primary)' }} />
                <h3 className="mb-2 font-semibold">Wide Selection</h3>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Thousands of products across multiple categories</p>
              </div>
              <div className="rounded-2xl border p-6 text-center shadow-md" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}>
                <Truck className="mx-auto mb-4 h-12 w-12" style={{ color: 'var(--accent-primary)' }} />
                <h3 className="mb-2 font-semibold">Fast Delivery</h3>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Quick and reliable shipping across the country</p>
              </div>
              <div className="rounded-2xl border p-6 text-center shadow-md" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}>
                <Shield className="mx-auto mb-4 h-12 w-12" style={{ color: 'var(--accent-primary)' }} />
                <h3 className="mb-2 font-semibold">Secure Payment</h3>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Safe and encrypted payment processing</p>
              </div>
              <div className="rounded-2xl border p-6 text-center shadow-md" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}>
                <RotateCcw className="mx-auto mb-4 h-12 w-12" style={{ color: 'var(--accent-primary)' }} />
                <h3 className="mb-2 font-semibold">Easy Returns</h3>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Hassle-free returns within 30 days</p>
              </div>
            </>
          )}
        </section>

        <ProductCarousel title="Today's Deals" compact={false} />
        <ProductCarousel title="Recommended For You" category="Electronics" />

        <section className="rounded-4xl border p-10 text-center shadow-lg" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}>
          <h2 className="mb-4 text-3xl font-black" style={{ color: 'var(--text-primary)' }}>Ready to Start Shopping?</h2>
          <p className="mx-auto mb-6 max-w-2xl" style={{ color: 'var(--text-secondary)' }}>
            Sign up for an account to track your orders, save your favorite items, and enjoy exclusive deals.
          </p>
          <Link href="/signup">
            <Button size="lg">Create an Account</Button>
          </Link>
        </section>
      </div>
    </div>
  );
}
