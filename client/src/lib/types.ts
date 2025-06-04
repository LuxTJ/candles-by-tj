export interface ProductWithReviews {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  shortDescription: string | null;
  price: string;
  compareAtPrice: string | null;
  categoryId: number | null;
  images: string[];
  variants: {
    sizes?: { name: string; price: number; burnTime: string }[];
    scents?: string[];
    colors?: string[];
  } | null;
  tags: string[];
  featured: boolean | null;
  status: string;
  inventory: number | null;
  weight: string | null;
  burnTime: string | null;
  waxType: string | null;
  wickType: string | null;
  createdAt: Date | null;
  updatedAt: Date | null;
  reviews: ReviewWithUser[];
  reviewStats: {
    averageRating: number;
    totalReviews: number;
  };
}

export interface ReviewWithUser {
  id: number;
  productId: number;
  userId: string;
  rating: number;
  title: string | null;
  comment: string | null;
  verified: boolean | null;
  helpful: number | null;
  createdAt: Date | null;
  user: {
    id: string;
    email: string | null;
    firstName: string | null;
    lastName: string | null;
    profileImageUrl: string | null;
  };
}

export interface CartItemWithProduct {
  id: number;
  userId: string;
  productId: number;
  quantity: number;
  variant: {
    size?: string;
    scent?: string;
    color?: string;
  } | null;
  createdAt: Date | null;
  updatedAt: Date | null;
  product: {
    id: number;
    name: string;
    slug: string;
    price: string;
    images: string[];
    variants: {
      sizes?: { name: string; price: number; burnTime: string }[];
      scents?: string[];
      colors?: string[];
    } | null;
  };
}

export interface WishlistItemWithProduct {
  id: number;
  userId: string;
  productId: number;
  createdAt: Date | null;
  product: {
    id: number;
    name: string;
    slug: string;
    price: string;
    compareAtPrice: string | null;
    images: string[];
  };
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
  createdAt: Date | null;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  shortDescription: string | null;
  price: string;
  compareAtPrice: string | null;
  categoryId: number | null;
  images: string[];
  variants: {
    sizes?: { name: string; price: number; burnTime: string }[];
    scents?: string[];
    colors?: string[];
  } | null;
  tags: string[];
  featured: boolean | null;
  status: string;
  inventory: number | null;
  weight: string | null;
  burnTime: string | null;
  waxType: string | null;
  wickType: string | null;
  createdAt: Date | null;
  updatedAt: Date | null;
}

export interface ProductFilters {
  category?: string;
  search?: string;
  featured?: boolean;
  limit?: number;
  offset?: number;
}

export interface ProductVariant {
  size?: string;
  scent?: string;
  color?: string;
}
