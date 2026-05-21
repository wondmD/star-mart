'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/Button';
import { useProducts } from '@/hooks/useProducts';
import { ProductCard } from '@/components/ProductCard';
import { useCartStore } from '@/stores/cart-store';
import { showCartToast } from '@/lib/cart-toast';
import {
  ArrowRight,
  BadgePercent,
  CreditCard,
  ShieldCheck,
  ShoppingBag,
  Tag,
  Truck,
  RotateCcw,
} from 'lucide-react';
import { ProductCardSkeleton, FeatureCardSkeleton } from '@/components/Skeleton';
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
  const categoryShortcuts = [
    { label: 'Photography', value: 'Photography' },
    { label: 'Audio', value: 'Audio' },
    { label: 'Mobile', value: 'Mobile' },
    { label: 'Networking', value: 'Networking' },
  ];

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

  const handleAddToCart = (product: Product) => {
    addItem(product, 1);
    showCartToast({ productName: product.name });
  };

  const handleCategoryShortcut = (category: string) => {
    router.push(`/products?category=${encodeURIComponent(category)}`);
  };

  const featuredProducts = products?.slice(0, 8) || [];
  const saleProduct = featuredProducts.find((product) => product.discount_price) ?? featuredProducts[0] ?? fallbackSaleProduct;

  const checkoutSteps = [
    {
      step: '01',
      title: 'Browse and shortlist',
      description: 'Search products, open details, and add items to a persistent cart.',
      icon: ShoppingBag,
    },
    {
      step: '02',
      title: 'Review and confirm',
      description: 'Checkout collects the delivery details and calculates totals in one place.',
      icon: CreditCard,
    },
    {
      step: '03',
      title: 'Pay and track',
      description: 'Payment is initiated through the server and orders remain trackable in Supabase.',
      icon: ShieldCheck,
    },
  ];

  return (
    <div className="w-full space-y-16 pb-8 pt-0">
      <section className="relative w-full overflow-hidden border-y shadow-xl" style={{ borderColor: 'var(--border-color)' }}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(252,191,73,0.24),transparent_34%),radial-gradient(circle_at_top_right,rgba(214,40,40,0.16),transparent_30%),linear-gradient(135deg,#081f2d_0%,#0f3550_46%,#174d60_100%)]" />
        <div className="absolute -left-24 top-10 h-64 w-64 rounded-full bg-[#fcbf49]/12 blur-3xl" />
        <div className="absolute -bottom-20 right-0 h-72 w-72 rounded-full bg-[#d62828]/12 blur-3xl" />

        <div className="relative mx-auto grid min-h-[38vh] max-w-none gap-8 px-4 py-6 sm:px-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(17rem,0.58fr)] lg:items-center lg:px-10 xl:px-14">
          <div className="max-w-3xl text-white">
            
            <h1 className="mt-5 text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
              Discover products that feel premium from the first glance.
            </h1>
            <p className="mt-4 max-w-2xl text-sm sm:text-base lg:text-lg" style={{ color: 'rgba(252,251,247,0.82)' }}>
              Explore curated picks, quick category shortcuts, and a clean checkout flow built for a smooth shopping experience.
            </p>

            <div className="mt-6 max-w-2xl rounded-3xl border p-3 shadow-2xl" style={{ borderColor: 'rgba(252,251,247,0.14)', backgroundColor: 'rgba(252,251,247,0.1)' }}>
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-white/70">
                Browse products
              </p>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <p className="flex-1 text-sm leading-6 text-white/75">
                  Jump straight into the catalog to search, filter, and compare products.
                </p>
                <Link href="/products" className="sm:min-w-40">
                  <Button size="lg" className="w-full" style={{ backgroundColor: 'var(--accent-primary)', color: 'var(--bg-secondary)' }}>
                    Browse products
                  </Button>
                </Link>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              {categoryShortcuts.map((category) => (
                <button
                  key={category.value}
                  type="button"
                  onClick={() => handleCategoryShortcut(category.value)}
                  className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition hover:scale-[1.01]"
                  style={{ borderColor: 'rgba(252,251,247,0.2)', backgroundColor: 'rgba(252,251,247,0.08)' }}
                >
                  <Tag className="h-4 w-4" />
                  {category.label}
                </button>
              ))}
            </div>
          </div>

          <div id="featured-sale" className="relative justify-self-stretch lg:block">
            <div className="pointer-events-none absolute -inset-1 rounded-3xl border-2 border-red-500/90 opacity-90 shadow-[0_0_36px_rgba(239,68,68,0.9)] motion-safe:animate-pulse" />
            <div className="relative overflow-hidden rounded-3xl border shadow-2xl" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}>
              <div className="relative h-44 sm:h-60">
                <Image
                  src={saleProduct.image_url}
                  alt={saleProduct.name}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 380px"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-linear-to-t from-[#003049]/90 via-[#003049]/25 to-transparent" />
                <div className="absolute left-4 top-4 flex flex-col gap-2">
                  <span className="inline-flex w-fit items-center gap-2 rounded-full bg-[#d62828] px-3 py-1 text-sm font-bold text-white shadow-lg">
                    <BadgePercent className="h-4 w-4" />
                    Featured deal
                  </span>
                  {saleProduct.category && (
                    <span className="inline-flex w-fit items-center gap-2 rounded-full bg-white/90 px-3 py-1 text-sm font-semibold text-[#003049] shadow-lg">
                      <Tag className="h-4 w-4" />
                      {saleProduct.category}
                    </span>
                  )}
                </div>
                <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                  <p className="text-xs uppercase tracking-[0.3em] text-[#fcbf49]">Curated pick</p>
                  <h2 className="mt-2 text-2xl font-black leading-tight sm:text-3xl">{saleProduct.name}</h2>
                  <p className="mt-3 max-w-sm text-sm leading-6 text-white/80">
                    {saleProduct.description}
                  </p>
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
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="w-full px-4 sm:px-6 lg:px-8 space-y-16">
        <section className="rounded-4xl border p-8 shadow-lg" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}>
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em]" style={{ color: 'var(--text-tertiary)' }}>
                Browse smarter
              </p>
              <h2 className="mt-2 text-3xl font-black" style={{ color: 'var(--text-primary)' }}>
                Explore by category
              </h2>
            </div>
            <Link href="/products">
              <Button variant="outline">View all products</Button>
            </Link>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {categoryShortcuts.map((category, index) => (
              <button
                key={category.value}
                type="button"
                onClick={() => handleCategoryShortcut(category.value)}
                className="group rounded-3xl border p-5 text-left transition hover:-translate-y-1 hover:shadow-xl"
                style={{
                  backgroundColor: 'var(--bg-primary)',
                  borderColor: 'var(--border-color)',
                }}
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.24em]" style={{ color: 'var(--text-tertiary)' }}>
                      Category {index + 1}
                    </p>
                    <h3 className="mt-2 text-xl font-black" style={{ color: 'var(--text-primary)' }}>
                      {category.label}
                    </h3>
                  </div>
                  <div className="rounded-2xl p-3 transition group-hover:scale-105" style={{ backgroundColor: 'var(--accent-light)' }}>
                    <Tag className="h-5 w-5" style={{ color: 'var(--accent-secondary)' }} />
                  </div>
                </div>
                <p className="mt-4 text-sm leading-6" style={{ color: 'var(--text-secondary)' }}>
                  Jump straight into curated products for {category.label.toLowerCase()} and continue from there.
                </p>
              </button>
            ))}
          </div>
        </section>

        <section>
          <div className="mb-8 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em]" style={{ color: 'var(--text-tertiary)' }}>
                Curated picks
              </p>
              <h2 className="mt-2 text-3xl font-black" style={{ color: 'var(--text-primary)' }}>Featured Products</h2>
            </div>
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
              { title: 'Secure checkout', value: '100%', icon: ShieldCheck },
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
                <ShieldCheck className="mx-auto mb-4 h-12 w-12" style={{ color: 'var(--accent-primary)' }} />
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
        <section className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
          <div className="rounded-4xl border p-8 shadow-lg" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}>
            <div className="flex items-center gap-3">
              <CreditCard className="h-6 w-6" style={{ color: 'var(--accent-secondary)' }} />
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em]" style={{ color: 'var(--text-tertiary)' }}>
                  Checkout flow
                </p>
                <h2 className="mt-1 text-3xl font-black" style={{ color: 'var(--text-primary)' }}>
                  Built to show engineering thinking
                </h2>
              </div>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {checkoutSteps.map((item) => {
                const Icon = item.icon;

                return (
                  <div key={item.step} className="rounded-3xl border p-5" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-color)' }}>
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-xs font-semibold uppercase tracking-[0.3em]" style={{ color: 'var(--accent-secondary)' }}>
                        {item.step}
                      </span>
                      <Icon className="h-5 w-5" style={{ color: 'var(--accent-secondary)' }} />
                    </div>
                    <h3 className="mt-4 text-lg font-black" style={{ color: 'var(--text-primary)' }}>
                      {item.title}
                    </h3>
                    <p className="mt-2 text-sm leading-6" style={{ color: 'var(--text-secondary)' }}>
                      {item.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-4xl border p-8 shadow-lg" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}>
            <div className="flex items-center gap-3">
              <ShieldCheck className="h-6 w-6" style={{ color: 'var(--accent-secondary)' }} />
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em]" style={{ color: 'var(--text-tertiary)' }}>
                  Why it stands out
                </p>
                <h2 className="mt-1 text-2xl font-black" style={{ color: 'var(--text-primary)' }}>
                  Clear trust and state feedback
                </h2>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <div className="rounded-3xl border p-4" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-color)' }}>
                <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>Auth and data</p>
                <p className="mt-1 text-sm leading-6" style={{ color: 'var(--text-secondary)' }}>
                  Supabase powers sign-in, user profiles, products, and orders.
                </p>
              </div>
              <div className="rounded-3xl border p-4" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-color)' }}>
                <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>Server-side payments</p>
                <p className="mt-1 text-sm leading-6" style={{ color: 'var(--text-secondary)' }}>
                  StarPay is initiated from API routes so private keys never reach the client.
                </p>
              </div>
              <div className="rounded-3xl border p-4" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-color)' }}>
                <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>Feedback loops</p>
                <p className="mt-1 text-sm leading-6" style={{ color: 'var(--text-secondary)' }}>
                  Loading skeletons, toasts, and checkout totals make the flow feel production-oriented.
                </p>
              </div>
            </div>
          </div>
        </section>

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
