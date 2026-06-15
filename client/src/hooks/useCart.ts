import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Cart, CartItem } from "../../shared/types";
import { apiRequest } from "@/lib/queryClient";

export function useCart() {
  const queryClient = useQueryClient();

  const { data: cart = { items: [], total: 0 } } = useQuery<Cart>({
    queryKey: ["/api/cart"],
    queryFn: async () => {
      const res = await fetch("/api/cart", { credentials: "include" });
      return res.json();
    },
  });

  const addItem = useMutation({
    mutationFn: (item: CartItem) => apiRequest("POST", "/api/cart", item),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/cart"] }),
  });

  const removeItem = useMutation({
    mutationFn: (item: { productId: number; scent: string; color: string }) =>
      apiRequest("DELETE", "/api/cart", item),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/cart"] }),
  });

  const totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);

  return { cart, totalItems, addItem, removeItem };
}
