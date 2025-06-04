import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";
import { isUnauthorizedError } from "@/lib/authUtils";
import { Heart, Star, ShoppingBag, Minus, Plus, Leaf, Clock, Truck } from "lucide-react";
import type { ProductWithReviews, ProductVariant } from "@/lib/types";

interface ProductModalProps {
  product: ProductWithReviews | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ProductModal({ product, isOpen, onClose }: ProductModalProps) {
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>({});

  const addToCartMutation = useMutation({
    mutationFn: async (data: { productId: number; quantity: number; variant?: ProductVariant }) => {
      const response = await apiRequest("POST", "/api/cart", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Added to cart",
        description: `${product?.name} has been added to your cart.`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
      onClose();
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Sign in required",
          description: "Please sign in to add items to your cart.",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 2000);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to add item to cart. Please try again.",
        variant: "destructive",
      });
    },
  });

  const toggleWishlistMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/wishlist", { productId: product?.id });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Added to wishlist",
        description: `${product?.name} has been added to your wishlist.`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/wishlist"] });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Sign in required",
          description: "Please sign in to manage your wishlist.",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 2000);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to add to wishlist. Please try again.",
        variant: "destructive",
      });
    },
  });

  if (!product) return null;

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      toast({
        title: "Sign in required",
        description: "Please sign in to add items to your cart.",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 2000);
      return;
    }

    addToCartMutation.mutate({
      productId: product.id,
      quantity,
      variant: Object.keys(selectedVariant).length > 0 ? selectedVariant : undefined,
    });
  };

  const handleAddToWishlist = () => {
    if (!isAuthenticated) {
      toast({
        title: "Sign in required",
        description: "Please sign in to manage your wishlist.",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 2000);
      return;
    }

    toggleWishlistMutation.mutate();
  };

  const primaryImage = product.images?.[selectedImageIndex] || product.images?.[0] || "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=600&h=600&fit=crop";
  const hasDiscount = product.compareAtPrice && parseFloat(product.compareAtPrice) > parseFloat(product.price);
  const discountPercent = hasDiscount
    ? Math.round(((parseFloat(product.compareAtPrice!) - parseFloat(product.price)) / parseFloat(product.compareAtPrice!)) * 100)
    : 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{product.name}</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square overflow-hidden rounded-lg">
              <img
                src={primaryImage}
                alt={product.name}
                className="h-full w-full object-cover"
              />
            </div>
            
            {product.images && product.images.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 ${
                      selectedImageIndex === index
                        ? "border-primary"
                        : "border-transparent hover:border-primary/50"
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} view ${index + 1}`}
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < Math.floor(product.reviewStats?.averageRating || 0)
                        ? "fill-current text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                ({product.reviewStats?.totalReviews || 0} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-3">
              <span className="text-3xl font-bold text-foreground">
                ${parseFloat(product.price).toFixed(2)}
              </span>
              {hasDiscount && (
                <>
                  <span className="text-lg text-muted-foreground line-through">
                    ${parseFloat(product.compareAtPrice!).toFixed(2)}
                  </span>
                  <Badge variant="destructive">
                    {discountPercent}% OFF
                  </Badge>
                </>
              )}
            </div>

            {/* Description */}
            {product.description && (
              <div>
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {product.description}
                </p>
              </div>
            )}

            {/* Size Options */}
            {product.variants?.sizes && product.variants.sizes.length > 0 && (
              <div>
                <h3 className="font-semibold mb-3">Size</h3>
                <RadioGroup
                  value={selectedVariant.size || ""}
                  onValueChange={(value) =>
                    setSelectedVariant({ ...selectedVariant, size: value })
                  }
                >
                  <div className="flex gap-2">
                    {product.variants.sizes.map((size) => (
                      <div key={size.name} className="flex items-center space-x-2">
                        <RadioGroupItem value={size.name} id={size.name} />
                        <Label htmlFor={size.name} className="cursor-pointer">
                          {size.name} ({size.burnTime})
                        </Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              </div>
            )}

            {/* Scent Options */}
            {product.variants?.scents && product.variants.scents.length > 0 && (
              <div>
                <h3 className="font-semibold mb-3">Scent</h3>
                <RadioGroup
                  value={selectedVariant.scent || ""}
                  onValueChange={(value) =>
                    setSelectedVariant({ ...selectedVariant, scent: value })
                  }
                >
                  <div className="grid grid-cols-2 gap-2">
                    {product.variants.scents.map((scent) => (
                      <div key={scent} className="flex items-center space-x-2">
                        <RadioGroupItem value={scent} id={scent} />
                        <Label htmlFor={scent} className="cursor-pointer">
                          {scent}
                        </Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              </div>
            )}

            {/* Quantity */}
            <div>
              <h3 className="font-semibold mb-3">Quantity</h3>
              <div className="flex items-center space-x-4">
                <div className="flex items-center border rounded-lg">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="px-4 py-2 font-medium">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4">
              <Button
                className="flex-1 btn-primary"
                onClick={handleAddToCart}
                disabled={addToCartMutation.isPending}
              >
                <ShoppingBag className="mr-2 h-4 w-4" />
                {addToCartMutation.isPending ? "Adding..." : "Add to Cart"}
              </Button>
              
              <Button
                variant="outline"
                size="icon"
                onClick={handleAddToWishlist}
                disabled={toggleWishlistMutation.isPending}
              >
                <Heart className="h-4 w-4" />
              </Button>
            </div>

            <Separator />

            {/* Product Features */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Leaf className="h-5 w-5 text-green-500" />
                <span className="text-sm">100% Natural Soy Wax</span>
              </div>
              
              {product.burnTime && (
                <div className="flex items-center space-x-3">
                  <Clock className="h-5 w-5 text-primary" />
                  <span className="text-sm">{product.burnTime} Burn Time</span>
                </div>
              )}
              
              <div className="flex items-center space-x-3">
                <Truck className="h-5 w-5 text-blue-500" />
                <span className="text-sm">Free Shipping on Orders $50+</span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
