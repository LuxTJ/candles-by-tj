import {
  users,
  products,
  productVariants,
  productImages,
  productReviews,
  cartItems,
  orders,
  orderItems,
  newsletterSubscribers,
  type User,
  type UpsertUser,
  type Product,
  type InsertProduct,
  type ProductVariant,
  type InsertProductVariant,
  type ProductImage,
  type InsertProductImage,
  type ProductReview,
  type InsertProductReview,
  type CartItem,
  type InsertCartItem,
  type Order,
  type InsertOrder,
  type OrderItem,
  type InsertOrderItem,
  type NewsletterSubscriber,
  type InsertNewsletterSubscriber,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, asc, and, or, like, sql, count } from "drizzle-orm";

export interface IStorage {
  // User operations (mandatory for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;

  // Product operations
  getProducts(options?: {
    category?: string;
    featured?: boolean;
    search?: string;
    limit?: number;
    offset?: number;
  }): Promise<{ products: (Product & { 
    variants: ProductVariant[]; 
    images: ProductImage[]; 
    averageRating: number;
    reviewCount: number;
  })[]; total: number }>;
  getProduct(id: number): Promise<(Product & { 
    variants: ProductVariant[]; 
    images: ProductImage[]; 
    reviews: (ProductReview & { user: User })[]; 
    averageRating: number;
    reviewCount: number;
  }) | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product | undefined>;
  deleteProduct(id: number): Promise<boolean>;

  // Product variant operations
  getProductVariants(productId: number): Promise<ProductVariant[]>;
  createProductVariant(variant: InsertProductVariant): Promise<ProductVariant>;
  updateProductVariant(id: number, variant: Partial<InsertProductVariant>): Promise<ProductVariant | undefined>;
  deleteProductVariant(id: number): Promise<boolean>;

  // Product image operations
  getProductImages(productId: number): Promise<ProductImage[]>;
  createProductImage(image: InsertProductImage): Promise<ProductImage>;
  updateProductImage(id: number, image: Partial<InsertProductImage>): Promise<ProductImage | undefined>;
  deleteProductImage(id: number): Promise<boolean>;

  // Product review operations
  getProductReviews(productId: number): Promise<(ProductReview & { user: User })[]>;
  createProductReview(review: InsertProductReview): Promise<ProductReview>;
  updateProductReview(id: number, review: Partial<InsertProductReview>): Promise<ProductReview | undefined>;
  deleteProductReview(id: number): Promise<boolean>;

  // Cart operations
  getCartItems(userId: string): Promise<(CartItem & { 
    product: Product; 
    variant: ProductVariant; 
    images: ProductImage[] 
  })[]>;
  addToCart(item: InsertCartItem): Promise<CartItem>;
  updateCartItem(id: number, quantity: number): Promise<CartItem | undefined>;
  removeFromCart(id: number): Promise<boolean>;
  clearCart(userId: string): Promise<void>;

  // Order operations
  getOrders(userId: string): Promise<(Order & { items: (OrderItem & { product: Product; variant: ProductVariant })[] })[]>;
  getOrder(id: number): Promise<(Order & { items: (OrderItem & { product: Product; variant: ProductVariant })[] }) | undefined>;
  createOrder(order: InsertOrder, items: InsertOrderItem[]): Promise<Order>;
  updateOrderStatus(id: number, status: string): Promise<Order | undefined>;

  // Newsletter operations
  subscribeToNewsletter(subscriber: InsertNewsletterSubscriber): Promise<NewsletterSubscriber>;
  unsubscribeFromNewsletter(email: string): Promise<boolean>;

  // Categories
  getCategories(): Promise<string[]>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Product operations
  async getProducts(options: {
    category?: string;
    featured?: boolean;
    search?: string;
    limit?: number;
    offset?: number;
  } = {}): Promise<{ products: (Product & { 
    variants: ProductVariant[]; 
    images: ProductImage[]; 
    averageRating: number;
    reviewCount: number;
  })[]; total: number }> {
    const { category, featured, search, limit = 20, offset = 0 } = options;

    let query = db.select().from(products).where(eq(products.isActive, true));
    let countQuery = db.select({ count: count() }).from(products).where(eq(products.isActive, true));

    const conditions = [eq(products.isActive, true)];

    if (category) {
      conditions.push(eq(products.category, category));
    }

    if (featured) {
      conditions.push(eq(products.isFeatured, true));
    }

    if (search) {
      conditions.push(
        or(
          like(products.name, `%${search}%`),
          like(products.description, `%${search}%`),
          like(products.scent, `%${search}%`)
        )!
      );
    }

    if (conditions.length > 1) {
      query = query.where(and(...conditions));
      countQuery = countQuery.where(and(...conditions));
    }

    const [productsResult, totalResult] = await Promise.all([
      query.limit(limit).offset(offset).orderBy(desc(products.createdAt)),
      countQuery,
    ]);

    const productsWithDetails = await Promise.all(
      productsResult.map(async (product) => {
        const [variants, images, reviewStats] = await Promise.all([
          db.select().from(productVariants).where(eq(productVariants.productId, product.id)),
          db.select().from(productImages).where(eq(productImages.productId, product.id)).orderBy(desc(productImages.isPrimary), asc(productImages.sortOrder)),
          db.select({
            averageRating: sql<number>`COALESCE(AVG(${productReviews.rating}), 0)`,
            reviewCount: sql<number>`COUNT(${productReviews.id})`,
          }).from(productReviews).where(eq(productReviews.productId, product.id)),
        ]);

        const stats = reviewStats[0] || { averageRating: 0, reviewCount: 0 };

        return {
          ...product,
          variants,
          images,
          averageRating: Number(stats.averageRating),
          reviewCount: Number(stats.reviewCount),
        };
      })
    );

    return {
      products: productsWithDetails,
      total: totalResult[0]?.count || 0,
    };
  }

  async getProduct(id: number): Promise<(Product & { 
    variants: ProductVariant[]; 
    images: ProductImage[]; 
    reviews: (ProductReview & { user: User })[]; 
    averageRating: number;
    reviewCount: number;
  }) | undefined> {
    const [product] = await db.select().from(products).where(and(eq(products.id, id), eq(products.isActive, true)));
    
    if (!product) return undefined;

    const [variants, images, reviewsWithUsers, reviewStats] = await Promise.all([
      db.select().from(productVariants).where(eq(productVariants.productId, id)),
      db.select().from(productImages).where(eq(productImages.productId, id)).orderBy(desc(productImages.isPrimary), asc(productImages.sortOrder)),
      db.select().from(productReviews)
        .innerJoin(users, eq(productReviews.userId, users.id))
        .where(eq(productReviews.productId, id))
        .orderBy(desc(productReviews.createdAt)),
      db.select({
        averageRating: sql<number>`COALESCE(AVG(${productReviews.rating}), 0)`,
        reviewCount: sql<number>`COUNT(${productReviews.id})`,
      }).from(productReviews).where(eq(productReviews.productId, id)),
    ]);

    const reviews = reviewsWithUsers.map(({ product_reviews, users }) => ({
      ...product_reviews,
      user: users,
    }));

    const stats = reviewStats[0] || { averageRating: 0, reviewCount: 0 };

    return {
      ...product,
      variants,
      images,
      reviews,
      averageRating: Number(stats.averageRating),
      reviewCount: Number(stats.reviewCount),
    };
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const [newProduct] = await db.insert(products).values(product).returning();
    return newProduct;
  }

  async updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product | undefined> {
    const [updatedProduct] = await db
      .update(products)
      .set({ ...product, updatedAt: new Date() })
      .where(eq(products.id, id))
      .returning();
    return updatedProduct;
  }

  async deleteProduct(id: number): Promise<boolean> {
    const result = await db.update(products).set({ isActive: false }).where(eq(products.id, id));
    return result.rowCount > 0;
  }

  // Product variant operations
  async getProductVariants(productId: number): Promise<ProductVariant[]> {
    return await db.select().from(productVariants).where(eq(productVariants.productId, productId));
  }

  async createProductVariant(variant: InsertProductVariant): Promise<ProductVariant> {
    const [newVariant] = await db.insert(productVariants).values(variant).returning();
    return newVariant;
  }

  async updateProductVariant(id: number, variant: Partial<InsertProductVariant>): Promise<ProductVariant | undefined> {
    const [updatedVariant] = await db
      .update(productVariants)
      .set(variant)
      .where(eq(productVariants.id, id))
      .returning();
    return updatedVariant;
  }

  async deleteProductVariant(id: number): Promise<boolean> {
    const result = await db.delete(productVariants).where(eq(productVariants.id, id));
    return result.rowCount > 0;
  }

  // Product image operations
  async getProductImages(productId: number): Promise<ProductImage[]> {
    return await db.select().from(productImages)
      .where(eq(productImages.productId, productId))
      .orderBy(desc(productImages.isPrimary), asc(productImages.sortOrder));
  }

  async createProductImage(image: InsertProductImage): Promise<ProductImage> {
    const [newImage] = await db.insert(productImages).values(image).returning();
    return newImage;
  }

  async updateProductImage(id: number, image: Partial<InsertProductImage>): Promise<ProductImage | undefined> {
    const [updatedImage] = await db
      .update(productImages)
      .set(image)
      .where(eq(productImages.id, id))
      .returning();
    return updatedImage;
  }

  async deleteProductImage(id: number): Promise<boolean> {
    const result = await db.delete(productImages).where(eq(productImages.id, id));
    return result.rowCount > 0;
  }

  // Product review operations
  async getProductReviews(productId: number): Promise<(ProductReview & { user: User })[]> {
    const reviewsWithUsers = await db.select().from(productReviews)
      .innerJoin(users, eq(productReviews.userId, users.id))
      .where(eq(productReviews.productId, productId))
      .orderBy(desc(productReviews.createdAt));

    return reviewsWithUsers.map(({ product_reviews, users }) => ({
      ...product_reviews,
      user: users,
    }));
  }

  async createProductReview(review: InsertProductReview): Promise<ProductReview> {
    const [newReview] = await db.insert(productReviews).values(review).returning();
    return newReview;
  }

  async updateProductReview(id: number, review: Partial<InsertProductReview>): Promise<ProductReview | undefined> {
    const [updatedReview] = await db
      .update(productReviews)
      .set(review)
      .where(eq(productReviews.id, id))
      .returning();
    return updatedReview;
  }

  async deleteProductReview(id: number): Promise<boolean> {
    const result = await db.delete(productReviews).where(eq(productReviews.id, id));
    return result.rowCount > 0;
  }

  // Cart operations
  async getCartItems(userId: string): Promise<(CartItem & { 
    product: Product; 
    variant: ProductVariant; 
    images: ProductImage[] 
  })[]> {
    const cartItemsWithDetails = await db.select().from(cartItems)
      .innerJoin(products, eq(cartItems.productId, products.id))
      .innerJoin(productVariants, eq(cartItems.variantId, productVariants.id))
      .where(eq(cartItems.userId, userId))
      .orderBy(desc(cartItems.createdAt));

    const itemsWithImages = await Promise.all(
      cartItemsWithDetails.map(async ({ cart_items, products: product, product_variants }) => {
        const images = await db.select().from(productImages)
          .where(eq(productImages.productId, product.id))
          .orderBy(desc(productImages.isPrimary), asc(productImages.sortOrder))
          .limit(1);

        return {
          ...cart_items,
          product,
          variant: product_variants,
          images,
        };
      })
    );

    return itemsWithImages;
  }

  async addToCart(item: InsertCartItem): Promise<CartItem> {
    // Check if item already exists in cart
    const [existingItem] = await db.select().from(cartItems)
      .where(and(
        eq(cartItems.userId, item.userId),
        eq(cartItems.productId, item.productId),
        eq(cartItems.variantId, item.variantId)
      ));

    if (existingItem) {
      // Update quantity if item exists
      const [updatedItem] = await db
        .update(cartItems)
        .set({ 
          quantity: existingItem.quantity + item.quantity,
          updatedAt: new Date()
        })
        .where(eq(cartItems.id, existingItem.id))
        .returning();
      return updatedItem;
    } else {
      // Create new cart item
      const [newItem] = await db.insert(cartItems).values(item).returning();
      return newItem;
    }
  }

  async updateCartItem(id: number, quantity: number): Promise<CartItem | undefined> {
    if (quantity <= 0) {
      await this.removeFromCart(id);
      return undefined;
    }

    const [updatedItem] = await db
      .update(cartItems)
      .set({ quantity, updatedAt: new Date() })
      .where(eq(cartItems.id, id))
      .returning();
    return updatedItem;
  }

  async removeFromCart(id: number): Promise<boolean> {
    const result = await db.delete(cartItems).where(eq(cartItems.id, id));
    return result.rowCount > 0;
  }

  async clearCart(userId: string): Promise<void> {
    await db.delete(cartItems).where(eq(cartItems.userId, userId));
  }

  // Order operations
  async getOrders(userId: string): Promise<(Order & { items: (OrderItem & { product: Product; variant: ProductVariant })[] })[]> {
    const userOrders = await db.select().from(orders)
      .where(eq(orders.userId, userId))
      .orderBy(desc(orders.createdAt));

    const ordersWithItems = await Promise.all(
      userOrders.map(async (order) => {
        const items = await db.select().from(orderItems)
          .innerJoin(products, eq(orderItems.productId, products.id))
          .innerJoin(productVariants, eq(orderItems.variantId, productVariants.id))
          .where(eq(orderItems.orderId, order.id));

        return {
          ...order,
          items: items.map(({ order_items, products: product, product_variants }) => ({
            ...order_items,
            product,
            variant: product_variants,
          })),
        };
      })
    );

    return ordersWithItems;
  }

  async getOrder(id: number): Promise<(Order & { items: (OrderItem & { product: Product; variant: ProductVariant })[] }) | undefined> {
    const [order] = await db.select().from(orders).where(eq(orders.id, id));
    
    if (!order) return undefined;

    const items = await db.select().from(orderItems)
      .innerJoin(products, eq(orderItems.productId, products.id))
      .innerJoin(productVariants, eq(orderItems.variantId, productVariants.id))
      .where(eq(orderItems.orderId, id));

    return {
      ...order,
      items: items.map(({ order_items, products: product, product_variants }) => ({
        ...order_items,
        product,
        variant: product_variants,
      })),
    };
  }

  async createOrder(order: InsertOrder, items: InsertOrderItem[]): Promise<Order> {
    const [newOrder] = await db.insert(orders).values(order).returning();
    
    const orderItemsWithOrderId = items.map(item => ({
      ...item,
      orderId: newOrder.id,
    }));

    await db.insert(orderItems).values(orderItemsWithOrderId);
    
    return newOrder;
  }

  async updateOrderStatus(id: number, status: string): Promise<Order | undefined> {
    const [updatedOrder] = await db
      .update(orders)
      .set({ status, updatedAt: new Date() })
      .where(eq(orders.id, id))
      .returning();
    return updatedOrder;
  }

  // Newsletter operations
  async subscribeToNewsletter(subscriber: InsertNewsletterSubscriber): Promise<NewsletterSubscriber> {
    const [newSubscriber] = await db
      .insert(newsletterSubscribers)
      .values(subscriber)
      .onConflictDoUpdate({
        target: newsletterSubscribers.email,
        set: { isActive: true },
      })
      .returning();
    return newSubscriber;
  }

  async unsubscribeFromNewsletter(email: string): Promise<boolean> {
    const result = await db
      .update(newsletterSubscribers)
      .set({ isActive: false })
      .where(eq(newsletterSubscribers.email, email));
    return result.rowCount > 0;
  }

  // Categories
  async getCategories(): Promise<string[]> {
    const categories = await db
      .selectDistinct({ category: products.category })
      .from(products)
      .where(eq(products.isActive, true));
    
    return categories.map(c => c.category);
  }
}

export const storage = new DatabaseStorage();
