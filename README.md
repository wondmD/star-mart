# StarMart - E-Commerce Platform

A production-ready mini e-commerce platform built with Next.js, TypeScript, Tailwind CSS, and Supabase. This project demonstrates modern frontend architecture, state management, and secure payment integration.

## Features

### Core Features
- **User Authentication**: Secure sign-up and login using Supabase Auth
- **Product Browsing**: Filter and search products by category, price range, and search terms
- **Product Details**: Detailed product pages with images, descriptions, and availability
- **Shopping Cart**: Persistent cart with add, remove, and quantity update operations
- **Checkout Flow**: Complete checkout with delivery address collection
- **Payment Integration**: Secure StarPay payment processing via server-side API
- **Order Management**: View and track all user orders
- **Admin Dashboard**: Product CRUD at `/admin` for admin accounts
- **Responsive Design**: Mobile-first responsive UI with Tailwind CSS

## 🛠️ Quick Start

```bash
# Install dependencies
npm install

# Set up environment variables (see .env.local section)
cp .env.example .env.local

# Run development server
npm run dev

# Open http://localhost:3000
```

## Environment Configuration

Create a `.env.local` file:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# StarPay (Server-side only)
STARPAY_SECRET_KEY=your_secret_key
NEXT_PUBLIC_STARPAY_API_KEY=your_public_key

# App URL (used for security headers / CSP on production)
NEXT_PUBLIC_APP_URL=https://star-mart.vercel.app
```

## Architecture

- **Frontend**: Next.js 16 with TypeScript
- **State Management**: Zustand (local) + TanStack Query (server)
- **Styling**: Tailwind CSS
- **Forms**: Formik + Yup
- **Backend**: Supabase (Auth + PostgreSQL)
- **Payment**: StarPay (Server-side integration)

## Full Documentation

See [ARCHITECTURE.md](./ARCHITECTURE.md) for detailed:
- Project structure
- Design decisions
- Security considerations
- Deployment guide
- Troubleshooting

## Security

- Server-side payment processing
- Environment variables for secrets
- Token-based authentication
- Input validation and sanitization
- Secure data transmission
- HTTP security headers (CSP, `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`) via `next.config.ts` and `src/lib/security-headers.ts`

Set `NEXT_PUBLIC_APP_URL` to your production origin (e.g. `https://star-mart.vercel.app`) so Content-Security-Policy and CORS align with your deployment.

## Pages

- `/` - Home page
- `/products` - Product listing with filters
- `/products/[id]` - Product details
- `/cart` - Shopping cart
- `/checkout` - Checkout page
- `/auth/login` - Login page
- `/auth/signup` - Sign up page
- `/orders` - Orders listing
- `/order-confirmation/[id]` - Order confirmation
- `/admin` - Admin product CRUD (admin users only)

## Admin product management

1. Sign in with an account that has `is_admin = true` in the Supabase `users` table.
2. Open `/admin` (or use the **Admin** link in the header when signed in as admin).
3. Create, edit, or delete products from the dashboard.

In local development without Supabase service role, products are stored in `.data/products.json`. With `USE_LOCAL_AUTH=true`, the demo user (`demo@example.com` / `Demo@123`) is an admin.

```sql
-- Grant admin access in Supabase (must match your sign-in email exactly)
UPDATE public.users SET is_admin = true WHERE email = 'your@email.com';
```

Optional env override (server-side): `ADMIN_EMAILS=wondmenehdereje@gmail.com` in `.env.local`.

## Deployment

Deploy to Vercel:

```bash
git push origin main
# Connect to Vercel dashboard
# Add environment variables
# Deploy
```

## License

This project is developed for the technical challenge.

---

**Built using Next.js, Tailwind, and Supabase**
