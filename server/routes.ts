import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { insertProductSchema, insertCartItemSchema, insertReviewSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Product routes
  app.get("/api/products", async (req, res) => {
    try {
      const { category, featured } = req.query;
      
      let products;
      if (featured === "true") {
        products = await storage.getFeaturedProducts();
      } else if (category) {
        products = await storage.getProductsByCategory(category as string);
      } else {
        products = await storage.getAllProducts();
      }
      
      res.json(products);
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  app.get("/api/products/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const product = await storage.getProduct(id);
      
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      res.json(product);
    } catch (error) {
      console.error("Error fetching product:", error);
      res.status(500).json({ message: "Failed to fetch product" });
    }
  });

  app.post("/api/products", isAuthenticated, async (req, res) => {
    try {
      const productData = insertProductSchema.parse(req.body);
      const product = await storage.createProduct(productData);
      res.status(201).json(product);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid product data", errors: error.errors });
      }
      console.error("Error creating product:", error);
      res.status(500).json({ message: "Failed to create product" });
    }
  });

  // Cart routes
  app.get("/api/cart", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const cartItems = await storage.getCartItems(userId);
      res.json(cartItems);
    } catch (error) {
      console.error("Error fetching cart:", error);
      res.status(500).json({ message: "Failed to fetch cart" });
    }
  });

  app.post("/api/cart", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const cartItemData = insertCartItemSchema.parse({
        ...req.body,
        userId
      });
      
      const cartItem = await storage.addToCart(cartItemData);
      res.status(201).json(cartItem);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid cart item data", errors: error.errors });
      }
      console.error("Error adding to cart:", error);
      res.status(500).json({ message: "Failed to add to cart" });
    }
  });

  app.put("/api/cart/:id", isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { quantity } = req.body;
      
      if (!quantity || quantity < 1) {
        return res.status(400).json({ message: "Invalid quantity" });
      }
      
      const cartItem = await storage.updateCartItem(id, quantity);
      
      if (!cartItem) {
        return res.status(404).json({ message: "Cart item not found" });
      }
      
      res.json(cartItem);
    } catch (error) {
      console.error("Error updating cart item:", error);
      res.status(500).json({ message: "Failed to update cart item" });
    }
  });

  app.delete("/api/cart/:id", isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.removeFromCart(id);
      res.status(204).send();
    } catch (error) {
      console.error("Error removing cart item:", error);
      res.status(500).json({ message: "Failed to remove cart item" });
    }
  });

  app.delete("/api/cart", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      await storage.clearCart(userId);
      res.status(204).send();
    } catch (error) {
      console.error("Error clearing cart:", error);
      res.status(500).json({ message: "Failed to clear cart" });
    }
  });

  // Review routes
  app.get("/api/products/:id/reviews", async (req, res) => {
    try {
      const productId = parseInt(req.params.id);
      const reviews = await storage.getProductReviews(productId);
      res.json(reviews);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      res.status(500).json({ message: "Failed to fetch reviews" });
    }
  });

  app.post("/api/products/:id/reviews", isAuthenticated, async (req: any, res) => {
    try {
      const productId = parseInt(req.params.id);
      const userId = req.user.claims.sub;
      
      const reviewData = insertReviewSchema.parse({
        ...req.body,
        productId,
        userId
      });
      
      const review = await storage.addReview(reviewData);
      res.status(201).json(review);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid review data", errors: error.errors });
      }
      console.error("Error adding review:", error);
      res.status(500).json({ message: "Failed to add review" });
    }
  });

  // Initialize some sample products if database is empty
  app.post("/api/init-products", async (req, res) => {
    try {
      const existingProducts = await storage.getAllProducts();
      if (existingProducts.length === 0) {
        const sampleProducts = [
          {
            name: "Vanilla Bean Bliss",
            description: "Indulge in the warm, comforting embrace of our Vanilla Dreams candle. Crafted with premium soy wax and infused with pure vanilla extract and hints of caramel.",
            price: "24.99",
            originalPrice: "29.99",
            category: "Sweet",
            scent: "Vanilla",
            size: "Medium",
            burnTime: "40 hours",
            images: ["https://pixabay.com/get/g6afcace557ec4d2694fcedcb5772f35c5cfb7b6fca6a72819e29579041d7d7c867075102a98a1ddf12a3d02c6736a2eae4c340df7c1220a5aff9258443a146da_1280.jpg"],
            featured: true,
            rating: "4.8",
            reviewCount: 127,
          },
          {
            name: "Lavender Dreams",
            description: "Calming lavender with hints of vanilla and bergamot. Perfect for relaxation and peaceful nights.",
            price: "28.99",
            category: "Aromatherapy",
            scent: "Lavender",
            size: "Medium",
            burnTime: "45 hours",
            images: ["https://images.unsplash.com/photo-1586985289906-406988974504?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400"],
            featured: true,
            rating: "4.9",
            reviewCount: 89,
          },
          {
            name: "Forest Whisper",
            description: "Cedar wood, pine needles, and subtle moss notes. Brings the outdoors inside.",
            price: "26.99",
            category: "Woody",
            scent: "Cedar & Pine",
            size: "Large",
            burnTime: "60 hours",
            images: ["https://pixabay.com/get/g09e430c74fc524134d42cb2425317675b71322e47f63ad40cd0bf2978333896b408f09b4593a618c693273c54a35ea353013992b1d0780435b3ca1a050378752_1280.jpg"],
            featured: true,
            rating: "4.7",
            reviewCount: 64,
          },
          {
            name: "Citrus Burst",
            description: "Energizing blend of orange, lemon, and grapefruit. Perfect for morning rituals.",
            price: "22.99",
            category: "Fresh",
            scent: "Citrus",
            size: "Small",
            burnTime: "25 hours",
            images: ["https://pixabay.com/get/g04c52c3cf252bae55925fe510adad24e9f1c4ebec5444efe17b339a5ab736ba0625cb6444c26d393d43140c7080d2b33dad4e1d96816df0ca12d6bba273b5275_1280.jpg"],
            featured: true,
            rating: "4.6",
            reviewCount: 156,
          },
        ];

        for (const product of sampleProducts) {
          await storage.createProduct(product as any);
        }
      }
      res.json({ message: "Products initialized" });
    } catch (error) {
      console.error("Error initializing products:", error);
      res.status(500).json({ message: "Failed to initialize products" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
