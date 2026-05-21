// User and Authentication Types
export interface User {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  avatar_url?: string;
  is_admin?: boolean;
  created_at: string;
}

// Product Types
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  discount_price?: number;
  image_url: string;
  category: string;
  stock: number;
  created_at: string;
}

export interface ProductFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
}

// Cart Types
export interface CartItem {
  product_id: string;
  product: Product;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  total: number;
  itemCount: number;
}

// Order Types
export interface Order {
  id: string;
  user_id: string;
  items: OrderItem[];
  total_amount: number;
  status: "pending" | "paid" | "shipped" | "delivered" | "cancelled";
  delivery_address: DeliveryAddress;
  payment_method: string;
  phone_number: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  payment_id?: string;
  payment_url?: string;
}

export interface OrderItem {
  product_id: string;
  product_name: string;
  price: number;
  quantity: number;
  subtotal: number;
}

export interface DeliveryAddress {
  full_name: string;
  phone_number: string;
  address: string;
  city: string;
  postal_code: string;
  country: string;
}

// Payment Types
export interface PaymentInitiation {
  amount: number;
  currency: string;
  phone_number: string;
  order_id: string;
  reference: string;
}

export interface PaymentResponse {
  success: boolean;
  transaction_id?: string;
  reference?: string;
  message?: string;
  error?: string;
  payment_url?: string;
  starpay_order_id?: string;
  expires_at?: string;
  status?: string;
}

export interface StarPayCheckoutItem {
  product_id: string;
  name: string;
  quantity: number;
  unit_price: number;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  code?: string;
}

// Form Types
export interface LoginFormData {
  email: string;
  password: string;
}

export interface SignupFormData {
  email: string;
  password: string;
  confirm_password: string;
  full_name: string;
}

export interface AuthSignupResult {
  user: User;
  token?: string;
  email?: string;
  requiresEmailConfirmation?: boolean;
}

export interface CheckoutFormData {
  full_name: string;
  phone_number: string;
  address: string;
  city: string;
  postal_code: string;
  country: string;
  notes?: string;
}
