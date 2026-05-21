# StarMart Architecture & Implementation Guide

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [Directory Structure](#directory-structure)
4. [Key Architectural Decisions](#key-architectural-decisions)
5. [State Management](#state-management)
6. [API Architecture](#api-architecture)
7. [Security Implementation](#security-implementation)
8. [Database Schema](#database-schema)
9. [Deployment Guide](#deployment-guide)
10. [Troubleshooting](#troubleshooting)

## Project Overview

**StarMart** is a full-featured e-commerce platform demonstrating:
- Modern Next.js patterns
- Type-safe TypeScript implementation
- Scalable state management
- Secure payment processing
- Production-ready code quality

### Core Objectives

✅ User authentication and authorization
✅ Product catalog with filtering
✅ Shopping cart with persistence
✅ Complete checkout flow
✅ Server-side payment processing
✅ Order tracking
✅ Responsive mobile-first UI

## Tech Stack

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| **Runtime** | Node.js | 18+ | JavaScript runtime |
| **Framework** | Next.js | 16.2.6 | React framework with SSR |
| **Language** | TypeScript | 5 | Type safety |
| **Styling** | Tailwind CSS | 4 | Utility-first CSS |
| **State (Local)** | Zustand | 5.0.13 | Lightweight state management |
| **State (Server)** | TanStack Query | 5.100.11 | Server state & caching |
| **HTTP** | Axios | 1.16.1 | Promise-based HTTP client |
| **Forms** | Formik | 2.4.9 | Form state management |
| **Validation** | Yup | 1.7.1 | Schema validation |
| **Backend** | Supabase | 2.106.0 | Database & Auth |
| **Notifications** | react-hot-toast | 2.6.0 | Toast notifications |
| **Icons** | lucide-react | 1.16.0 | Icon library |

## Directory Structure

```
star-mart/
├── public/                    # Static assets
├── src/
│   ├── app/                  # Next.js app directory (13+ routing)
│   │   ├── api/
│   │   │   ├── orders/
│   │   │   │   ├── route.ts         # GET/POST orders
│   │   │   │   └── [id]/
│   │   │   │       └── route.ts     # GET/PATCH specific order
│   │   │   ├── payment/
│   │   │   │   ├── initiate/
│   │   │   │   │   └── route.ts     # POST initiate payment
│   │   │   │   └── verify/
│   │   │   │       └── route.ts     # POST verify payment
│   │   │   └── products/
│   │   │       ├── route.ts         # GET products list
│   │   │       └── [id]/
│   │   │           └── route.ts     # GET product details
│   │   ├── auth/
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   └── signup/
│   │   │       └── page.tsx
│   │   ├── cart/
│   │   │   └── page.tsx             # Shopping cart page
│   │   ├── checkout/
│   │   │   └── page.tsx             # Checkout page
│   │   ├── orders/
│   │   │   └── page.tsx             # Orders listing
│   │   ├── order-confirmation/
│   │   │   └── [id]/
│   │   │       └── page.tsx         # Order confirmation
│   │   ├── products/
│   │   │   ├── page.tsx             # Products listing
│   │   │   └── [id]/
│   │   │       └── page.tsx         # Product details
│   │   ├── login/
│   │   │   └── page.tsx             # Redirect to /auth/login
│   │   ├── signup/
│   │   │   └── page.tsx             # Redirect to /auth/signup
│   │   ├── globals.css              # Global styles
│   │   ├── layout.tsx               # Root layout
│   │   └── page.tsx                 # Home page
│   ├── components/
│   │   ├── Header.tsx               # Navigation header
│   │   ├── Footer.tsx               # Footer
│   │   ├── Button.tsx               # Button component
│   │   ├── FormElements.tsx         # Input, Card, etc.
│   │   └── ProductCard.tsx          # Product card
│   ├── hooks/
│   │   ├── useProducts.ts           # Product queries
│   │   └── useOrders.ts             # Order queries
│   ├── services/
│   │   ├── auth.ts                  # Auth service
│   │   ├── products.ts              # Product service
│   │   ├── orders.ts                # Order service
│   │   └── payment.ts               # Payment service
│   ├── stores/
│   │   ├── auth-store.ts            # Auth state (Zustand)
│   │   └── cart-store.ts            # Cart state (Zustand)
│   ├── types/
│   │   └── index.ts                 # All type definitions
│   ├── schemas/
│   │   └── index.ts                 # Yup validation schemas
│   ├── lib/
│   │   ├── env.ts                   # Environment config
│   │   └── supabase.ts              # Supabase client
│   └── providers/
│       └── query-provider.tsx       # TanStack Query setup
├── .env.local                       # Environment variables
├── .eslintrc.json                   # ESLint config
├── tsconfig.json                    # TypeScript config
├── tailwind.config.ts               # Tailwind config
├── next.config.ts                   # Next.js config
├── package.json
└── README.md
```

## Key Architectural Decisions

### 1. State Management Strategy

We use a **hybrid approach**:

#### **Zustand for Local State** (UI-focused)
- Cart state with localStorage persistence
- Auth user state
- Simple, predictable state updates
- No provider complexity

```typescript
// Example: Cart store
export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product, quantity) => { /* ... */ },
      removeItem: (productId) => { /* ... */ },
    }),
    { name: 'cart-store' }
  )
);
```

**Why Zustand?**
- Minimal boilerplate compared to Redux
- Built-in localStorage support
- Direct state access without selectors
- Perfect for UI state

#### **TanStack Query for Server State**
- Products data fetching
- Orders data fetching
- Automatic caching and invalidation
- Background refetching
- Loading and error states

```typescript
// Example: useProducts hook
export const useProducts = (filters?: ProductFilters) => {
  return useQuery({
    queryKey: [...PRODUCTS_QUERY_KEY, filters],
    queryFn: () => productService.getProducts(filters),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
```

**Why TanStack Query?**
- Enterprise-grade caching
- Automatic request deduplication
- Built-in optimistic updates
- Perfect for server state

### 2. API Abstraction Layer

We implement a **service layer pattern**:

```
UI Components → Custom Hooks → Service Layer → API Routes → Supabase
```

**Benefits:**
- Single source of truth for API logic
- Easy to mock for testing
- Centralized error handling
- Consistent request/response format

### 3. Form Handling with Formik + Yup

```typescript
// Validation schema
const loginValidationSchema = yup.object().shape({
  email: yup.string().email().required(),
  password: yup.string().min(6).required(),
});

// Form component
<Formik
  initialValues={{ email: '', password: '' }}
  validationSchema={loginValidationSchema}
  onSubmit={handleLogin}
>
  {({ errors, touched }) => (
    <Form>
      <Input
        name="email"
        error={touched.email ? errors.email : ''}
      />
    </Form>
  )}
</Formik>
```

### 4. Payment Security Strategy

#### ✅ What We Do Right

1. **Server-Side Payment Initiation**
   - Client → API Route → StarPay
   - Not direct client → StarPay

2. **Secret Key Management**
   - `STARPAY_SECRET_KEY` in `.env` (server-only)
   - Never exposed to browser
   - Used only in server API routes

3. **Public Key in Browser**
   - `NEXT_PUBLIC_STARPAY_API_KEY` only for identification
   - No sensitive operations performed with it

4. **Payment Verification**
   - Server-side verification of payments
   - Order status updated on server
   - Prevents client-side tampering

```typescript
// /api/payment/initiate - Server route
export async function POST(request: NextRequest) {
  // 1. Verify user is authenticated
  const userId = await getUserId(request);
  
  // 2. Call StarPay with SERVER secret key
  const paymentInitiation = await axios.post(
    `${STARPAY_API_BASE}/payment/initiate`,
    { /* payment data */ },
    {
      headers: {
        Authorization: `Bearer ${env.STARPAY_SECRET_KEY}`, // Only on server!
      },
    }
  );
  
  // 3. Return only necessary info to client
  return NextResponse.json({
    success: true,
    transaction_id: paymentInitiation.data.transaction_id,
  });
}
```

### 5. Type Safety Throughout

All data has TypeScript types:

```typescript
// types/index.ts - Single source of truth
export interface Product {
  id: string;
  name: string;
  price: number;
  // ... more fields
}

export interface Order {
  id: string;
  user_id: string;
  items: OrderItem[];
  // ... more fields
}

// Used everywhere
const useProduct = (id: string): Product | undefined => { /* ... */ };
const createOrder = (data: CreateOrderRequest): Promise<Order> => { /* ... */ };
```

### 6. Scalable Component Architecture

```typescript
// Reusable components with variants
<Button variant="primary" size="lg" loading={isLoading}>
  Click me
</Button>

<Card>
  <div>Content</div>
</Card>

<Input
  label="Email"
  error={errors.email}
  placeholder="user@example.com"
/>
```

## State Management Details

### Local State (Zustand)

**Cart Store:**
```typescript
useCartStore()
  .items                    // CartItem[]
  .addItem(product, qty)   // void
  .removeItem(productId)   // void
  .updateQuantity(id, qty) // void
  .getTotal()              // number
  .clearCart()             // void
```

**Auth Store:**
```typescript
useAuthStore()
  .user                    // User | null
  .setUser(user)          // void
  .logout()               // void
  .loading                // boolean
  .setLoading(bool)       // void
```

### Server State (TanStack Query)

**Products Queries:**
```typescript
// Fetch products with filters
const { data: products, isLoading, error } = useProducts({ 
  category: 'electronics',
  minPrice: 100,
  maxPrice: 5000
});

// Fetch single product
const { data: product } = useProduct(id);

// Search products
const { data: searchResults } = useSearchProducts(query);
```

**Orders Queries:**
```typescript
// Fetch user's orders
const { data: orders } = useOrders();

// Create order with mutation
const { mutateAsync: createOrder } = useCreateOrder();

// Update order status
const { mutateAsync: updateStatus } = useUpdateOrderStatus(orderId);
```

## API Architecture

### API Routes Structure

All API routes follow this pattern:

```typescript
// GET: Fetch data
export async function GET(request: NextRequest) {
  try {
    // 1. Validate input
    // 2. Check authentication if needed
    // 3. Fetch from database
    // 4. Return response
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

// POST: Create resource
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    // 1. Validate input with Yup
    // 2. Check authentication
    // 3. Create in database
    // 4. Return created resource
    return NextResponse.json({ success: true, data: created }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}
```

### Authentication in API Routes

```typescript
async function getUserId(request: NextRequest): Promise<string | null> {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return null;
  }
  
  const token = authHeader.slice(7);
  const { data, error } = await supabase.auth.getUser(token);
  
  return data?.user?.id || null;
}

// Usage in route
export async function GET(request: NextRequest) {
  const userId = await getUserId(request);
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  // ... proceed with authenticated operation
}
```

## Security Implementation

### 🔐 Authentication Flow

1. **Sign Up**
   - User enters email, password, name
   - Yup validates inputs
   - Supabase Auth creates user
   - User profile created in DB
   - Zustand store updated

2. **Login**
   - User enters credentials
   - Supabase authenticates
   - User profile fetched from DB
   - Zustand store updated
   - Token stored by Supabase

3. **API Calls**
   - Axios interceptor adds auth token
   - Server validates token
   - Operation performed
   - Response returned

### 🔐 Payment Security

1. **Order Creation** (Server)
   - User sends delivery address
   - Server creates order in DB
   - Order marked as "pending"

2. **Payment Initiation** (Server)
   - Client sends order ID + phone
   - Server validates phone number
   - Server calls StarPay with SECRET key
   - Transaction ID returned to client

3. **Payment Confirmation** (Phone)
   - User receives prompt on phone
   - User enters PIN/confirmation

4. **Payment Verification** (Server)
   - Server polls/receives webhook
   - Payment status verified
   - Order status updated to "paid"
   - Confirmation sent to user

### 🔐 Data Validation

**Input Validation (Client-side)**
```typescript
// Using Yup schemas
const schema = yup.object().shape({
  phone_number: yup
    .string()
    .matches(/^\d{10}$/, 'Must be 10 digits')
    .required(),
});

const { error } = await schema.validate(data);
```

**Server-side Validation**
```typescript
// Every API route validates inputs
const { data, error } = schema.validate(body);
if (error) {
  return NextResponse.json({ error: error.message }, { status: 400 });
}
```

## Database Schema

### Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT,
  avatar_url TEXT,
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Grant admin access by setting is_admin = true for trusted accounts.
```

### Products Table
```sql
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  discount_price DECIMAL(10, 2),
  image_url TEXT,
  category TEXT,
  stock INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_price ON products(price);
```

### Orders Table
```sql
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  items JSONB NOT NULL,                    -- Stores order items as JSON
  total_amount DECIMAL(10, 2) NOT NULL,
  status TEXT DEFAULT 'pending',           -- pending|paid|shipped|delivered
  delivery_address JSONB NOT NULL,         -- Full address as JSON
  payment_method TEXT,                     -- 'starpay'
  phone_number TEXT,                       -- For payment initiation
  payment_id TEXT,                         -- StarPay transaction ID
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
```

## Deployment Guide

### 1. Prepare for Deployment

```bash
# Test build locally
npm run build

# Check for TypeScript errors
npm run lint

# Run tests (if added)
npm test
```

### 2. Deploy to Vercel

```bash
# Push to GitHub
git add .
git commit -m "Ready for deployment"
git push origin main
```

Then on Vercel Dashboard:
1. Connect GitHub repository
2. Set environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `STARPAY_SECRET_KEY`
   - `NEXT_PUBLIC_STARPAY_API_KEY`
   - `NEXT_PUBLIC_APP_URL=https://your-domain.com`
3. Deploy

### 3. Post-Deployment

- [ ] Test auth flow
- [ ] Test product browsing
- [ ] Test cart functionality
- [ ] Test checkout
- [ ] Test payment (use test phone)
- [ ] Monitor errors (Sentry, etc.)
- [ ] Enable analytics
- [ ] Set up monitoring

## Troubleshooting

### "Products not loading"
```typescript
// Check:
// 1. NEXT_PUBLIC_SUPABASE_URL is correct
// 2. Products table exists
// 3. Some products inserted
// 4. Network tab for 404/500 errors
```

### "Payment fails"
```typescript
// Check:
// 1. Phone number format: XXXXXXXXXX (10 digits)
// 2. STARPAY_SECRET_KEY is set in .env.local
// 3. Order was created before payment attempt
// 4. StarPay API status
```

### "Authentication not working"
```typescript
// Check:
// 1. Users table exists in Supabase
// 2. Auth table properly set up
// 3. Token being sent in headers
// 4. Zustand store being updated
```

### "Cart not persisting"
```typescript
// Check:
// 1. localStorage is enabled
// 2. Zustand persist middleware configured
// 3. Browser storage quota not exceeded
// 4. Not in private/incognito mode
```

## Performance Tips

1. **Image Optimization**
   - Use Next.js `Image` component
   - Add width/height for layout shift prevention

2. **Code Splitting**
   - Next.js does this automatically
   - Use dynamic imports for large components

3. **Caching**
   - TanStack Query caches products
   - Supabase CDN for images
   - Browser cache for static assets

4. **Database**
   - Indexes on frequently queried columns
   - Selective column fetching
   - Connection pooling with Supabase

## Next Steps

1. **Add admin dashboard** for product management
2. **Implement search** with Supabase full-text search
3. **Add reviews/ratings** system
4. **Setup monitoring** (Sentry, LogRocket, etc.)
5. **Add email notifications**
6. **Implement wishlist** feature
7. **Add loyalty program**
8. **Setup analytics** (Google Analytics, Mixpanel)

---

**This implementation prioritizes:**
- ✅ Code quality and maintainability
- ✅ Type safety with TypeScript
- ✅ Security best practices
- ✅ Scalable architecture
- ✅ User experience
- ✅ Developer experience
