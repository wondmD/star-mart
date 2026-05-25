import { CreditCard, RotateCcw, ShieldCheck, ShoppingBag, Truck } from 'lucide-react';
import { Product } from '@/types';

export const FALLBACK_SALE_PRODUCT: Product = {
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

export const HOME_CHECKOUT_STEPS = [
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
    description:
      'Payment is initiated through the server and orders remain trackable in Supabase.',
    icon: ShieldCheck,
  },
] as const;

export const HOME_STAT_ITEMS = [
  { title: 'Flash deals', value: 'Daily drops', icon: ShoppingBag },
  { title: 'Fast delivery', value: '48h', icon: Truck },
  { title: 'Secure checkout', value: '100%', icon: ShieldCheck },
  { title: 'Easy returns', value: '30 days', icon: RotateCcw },
] as const;

export const HOME_TRUST_ITEMS = [
  {
    title: 'Auth and data',
    description: 'Supabase powers sign-in, user profiles, products, and orders.',
  },
  {
    title: 'Server-side payments',
    description: 'StarPay is initiated from API routes so private keys never reach the client.',
  },
  {
    title: 'Feedback loops',
    description:
      'Loading skeletons, toasts, and checkout totals make the flow feel production-oriented.',
  },
] as const;
