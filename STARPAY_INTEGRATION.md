# StarPay Checkout Integration

StarMart checkout uses the **StarPay TRDP Create Order** API and redirects customers to `payment_url`.

## Environment (`.env.local`)

```env
STARPAY_API_BASE_URL=https://starpayqa.starpayethiopia.com/v1/starpay-api/trdp
STARPAY_SECRET_KEY=your_app_secret_from_cbe
NEXT_PUBLIC_STARPAY_API_KEY=your_api_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

- **`x-api-secret`** header = `STARPAY_SECRET_KEY` (App Secret from CBE)
- **`Authorization: Bearer`** = `NEXT_PUBLIC_STARPAY_API_KEY` (when set)

## Checkout flow

1. Customer submits checkout form
2. StarMart creates a local order (`pending`)
3. Server calls `POST {STARPAY_API_BASE_URL}/order`
4. Customer is redirected to StarPay `payment_url`
5. After payment, StarPay redirects to  
   `{APP_URL}/order-confirmation/{orderId}?payment=return`
6. Webhook `POST {APP_URL}/api/payment/callback` updates order to `paid`

## Supabase dashboard URLs

Add under **Authentication → URL Configuration** (if using auth) and configure StarPay merchant URLs:

| URL | Purpose |
|-----|---------|
| `http://localhost:3000/auth/callback` | Supabase email confirm |
| `http://localhost:3000/api/payment/callback` | StarPay webhook |
| `http://localhost:3000/order-confirmation/*` | StarPay redirect allowlist |

## Test data

- Test phone: **0900000000**
- Sandbox base: `https://starpayqa.starpayethiopia.com/v1/starpay-api/trdp`

## API routes (StarMart)

| Route | Method | Description |
|-------|--------|-------------|
| `/api/payment/initiate` | POST | Create StarPay order |
| `/api/payment/callback` | POST | StarPay webhook |
| `/api/payment/status/[orderId]` | GET | Verify via StarPay `POST /verify` and mark paid |
| `/api/payment/verify` | POST | Same verification for a given order |
| `/api/payment/retry` | POST | Resume saved `payment_url` or create a new StarPay session |

## Request body (create order)

Matches StarPay spec: `amount`, `description`, `currency`, `customerName`, `customerPhoneNumber`, `items[]`, `callbackURL`, `redirectUrl`, `customerEmail`, `expiredAt`, `metadata`.

Items use: `productId`, `quantity`, `item_name`, `unit_price`.
