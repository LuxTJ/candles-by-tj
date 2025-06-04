import { useState, useEffect, createContext, useContext } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CartItem, Product, InsertCartItem } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";

interface CartContextType {
  cartItems: (CartItem & { product: Product })[];
  isCartOpen: boolean;
  toggleCart: () => void;
  addToCart: (item: Omit<InsertCartItem, "sessionId">) => Promise<void>;
  updateQuantity: (id: number, quantity: number) => Promise<void>;
  removeFromCart: (id: number) => Promise<void>;
  clearCart: () => Promise<void>;
  getTotalPrice: () => number;
  getTotalItems: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function useCart(): CartContextType {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [sessionId] = useState(() => {
    // Get or create session ID for guest users
    let id = localStorage.getItem("cartSessionId");
    if (!id) {
      id = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem("cartSessionId", id);
    }
    return id;
  });

  const queryClient = useQueryClient();

  // Get cart items
  const { data: cartItems = [] } = useQuery<(CartItem & { product: Product })[]>({
    queryKey: [`/api/cart/${sessionId}`],
    staleTime: 0, // Always fetch fresh cart data
  });

  // Add to cart mutation
  const addToCartMutation = useMutation({
    mutationFn: async (item: Omit<InsertCartItem, "sessionId">) => {
      await apiRequest("POST", "/api/cart", { ...item, sessionId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/cart/${sessionId}`] });
    },
  });

  // Update quantity mutation
  const updateQuantityMutation = useMutation({
    mutationFn: async ({ id, quantity }: { id: number; quantity: number }) => {
      await apiRequest("PUT", `/api/cart/${id}`, { quantity });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/cart/${sessionId}`] });
    },
  });

  // Remove from cart mutation
  const removeFromCartMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/cart/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/cart/${sessionId}`] });
    },
  });

  // Clear cart mutation
  const clearCartMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("DELETE", `/api/cart/session/${sessionId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/cart/${sessionId}`] });
    },
  });

  const toggleCart = () => setIsCartOpen(!isCartOpen);

  const addToCart = async (item: Omit<InsertCartItem, "sessionId">) => {
    await addToCartMutation.mutateAsync(item);
  };

  const updateQuantity = async (id: number, quantity: number) => {
    await updateQuantityMutation.mutateAsync({ id, quantity });
  };

  const removeFromCart = async (id: number) => {
    await removeFromCartMutation.mutateAsync(id);
  };

  const clearCart = async () => {
    await clearCartMutation.mutateAsync();
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => {
      return total + parseFloat(item.product.price) * item.quantity;
    }, 0);
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  return {
    cartItems,
    isCartOpen,
    toggleCart,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    getTotalPrice,
    getTotalItems,
  };
}
