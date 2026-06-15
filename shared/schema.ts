import { pgTable, text, integer, decimal, boolean, timestamp, json, customType } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Custom type to convert PostgreSQL decimal to JavaScript number
const decimalToNumber = customType<{ data: number; driverData: string }>({
  dataType() {
    return "numeric";
  },
  fromDriver(value: string): number {
    return parseFloat(value);
  },
  toDriver(value: number): string {
    return value.toString();
  },
});

// Type definitions for OrderItem and ShippingAddress
export type OrderItem = {
  productId: number;
  productName: string;
  price: number;
  quantity: number;
  scent: string;
  color: string;
};

export type ShippingAddress = {
  name: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  zip: string;
  country: string;
};

// Stub types for client compatibility
export type User = {
  id?: string;
  email?: string;
  firstName?: string;
  profileImageUrl?: string;
}; // TODO: implement auth

export type ProductVariant = {
  size?: { name: string; price: number; burnTime: string };
  color?: { name: string; hex: string };
};

export const products = pgTable("products", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  price: decimalToNumber("price").notNull(),
  description: text("description"),
  dimensions: text("dimensions"),
  weight: text("weight"),
  imageUrl: text("image_url").notNull(),
  scents: json("scents").$type<string[]>().notNull().default([]),
  colors: json("colors").$type<string[]>().notNull().default([]),
  inStock: boolean("in_stock").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const orders = pgTable("orders", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  customerName: text("customer_name").notNull(),
  customerEmail: text("customer_email").notNull(),
  items: json("items").$type<OrderItem[]>().notNull(),
  subtotal: decimalToNumber("subtotal").notNull(),
  total: decimalToNumber("total").notNull(),
  paymentMethod: text("payment_method").notNull(),
  paymentId: text("payment_id"),
  status: text("status").notNull().default("pending"), // Values: pending, processing, shipped, delivered
  shippingAddress: json("shipping_address").$type<ShippingAddress>(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertProductSchema = createInsertSchema(products);
export const insertOrderSchema = createInsertSchema(orders);

export type Product = typeof products.$inferSelect & {
  basePrice?: string | number; // Alias for price
  featured?: boolean;
  images?: string[];
  shortDescription?: string;
  category?: string;
  rating?: number;
  reviewCount?: number;
  compareAtPrice?: string | number;
  burnTime?: string;
  tags?: string[];
  variants?: {
    size?: Array<{ name: string; price: number; burnTime: string }>;
    color?: Array<{ name: string; hex: string }>;
  };
};

export type CartItem = {
  id?: number;
  productId: number;
  quantity: number;
  selectedVariants?: Record<string, string>;
};
export type CartItemWithProduct = CartItem & { product: Product };
export type Review = {
  id: number;
  productId: number;
  rating: number;
  comment: string;
  title?: string;
  createdAt?: Date;
  verified?: boolean;
};
export type ProductWithReviews = Product & { reviews: Review[] };
export type InsertCartItem = CartItem;
export type InsertReview = Omit<Review, "id">;
export type ProductWithDetails = Product & {
  category?: string;
  rating?: number;
  reviewCount?: number;
  compareAtPrice?: string | number;
  burnTime?: string;
  tags?: string[];
};
export type ProductWithCategory = Product & {
  category?: string;
};

export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Order = typeof orders.$inferSelect;
export type InsertOrder = z.infer<typeof insertOrderSchema>;
