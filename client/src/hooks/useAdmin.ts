import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Product } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";

export function useAdmin() {
  const queryClient = useQueryClient();

  const products = useQuery<Product[]>({
    queryKey: ["/api/admin/products"],
    queryFn: async () => {
      const res = await fetch("/api/admin/products", { credentials: "include" });
      if (res.status === 401) throw new Error("Unauthorized");
      return res.json();
    },
    retry: false,
  });

  const orders = useQuery({
    queryKey: ["/api/admin/orders"],
    queryFn: async () => {
      const res = await fetch("/api/admin/orders", { credentials: "include" });
      return res.json();
    },
  });

  const createProduct = useMutation({
    mutationFn: (data: Partial<Product>) => apiRequest("POST", "/api/admin/products", data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/admin/products"] }),
  });

  const updateProduct = useMutation({
    mutationFn: ({ id, ...data }: Partial<Product> & { id: number }) =>
      apiRequest("PUT", `/api/admin/products/${id}`, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/admin/products"] }),
  });

  const deleteProduct = useMutation({
    mutationFn: (id: number) => apiRequest("DELETE", `/api/admin/products/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/admin/products"] }),
  });

  async function uploadImage(file: File): Promise<string> {
    const form = new FormData();
    form.append("file", file);
    const res = await fetch("/api/admin/upload", { method: "POST", body: form, credentials: "include" });
    const { url } = await res.json();
    return url;
  }

  return { products, orders, createProduct, updateProduct, deleteProduct, uploadImage };
}
