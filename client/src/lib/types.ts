// Re-export types from shared schema for frontend use
export type {
  User,
  Product,
  CartItem,
  CartItemWithProduct,
  Review,
  Order,
  InsertProduct,
  InsertCartItem,
  InsertReview,
  InsertOrder,
  ProductWithReviews,
} from "@shared/schema";

// Frontend-specific types
export interface ProductFilters {
  category?: string;
  scent?: string;
  search?: string;
  featured?: boolean;
  sortBy?: 'price' | 'rating' | 'name' | 'newest';
  sortOrder?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
}

export interface CartSummary {
  totalItems: number;
  subtotal: number;
  shipping: number;
  total: number;
}

export interface ProductVariant {
  size?: {
    name: string;
    price: number;
    burnTime: string;
  };
  color?: {
    name: string;
    hex: string;
  };
}

export interface SelectedVariants {
  size?: string;
  color?: string;
}

export interface AddToCartData {
  productId: number;
  quantity: number;
  selectedVariants: SelectedVariants;
}

export interface ReviewFormData {
  rating: number;
  title?: string;
  comment?: string;
}

export interface CheckoutData {
  shippingAddress: {
    name: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  orderItems: {
    productId: number;
    name: string;
    price: number;
    quantity: number;
    variants: Record<string, string>;
  }[];
  totalAmount: number;
}
