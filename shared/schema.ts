import { pgTable, text, integer, decimal, boolean, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const products = pgTable("products", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
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
  subtotal: decimal("subtotal", { precision: 10, scale: 2 }).notNull(),
  total: decimal("total", { precision: 10, scale: 2 }).notNull(),
  paymentMethod: text("payment_method").notNull(),
  paymentId: text("payment_id"),
  status: text("status").notNull().default("pending"),
  shippingAddress: json("shipping_address").$type<ShippingAddress>(),
  createdAt: timestamp("created_at").defaultNow(),
});

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

export const insertProductSchema = createInsertSchema(products);
export const insertOrderSchema = createInsertSchema(orders);

export type Product = typeof products.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Order = typeof orders.$inferSelect;
export type InsertOrder = z.infer<typeof insertOrderSchema>;
