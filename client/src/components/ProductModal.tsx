import { useQuery } from "@tanstack/react-query";
import { Product, ProductVariant } from "@shared/schema";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Star, Heart, Minus, Plus, Leaf, Clock, Truck } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/hooks/useCart";
import { useToast } from "@/hooks/use-toast";

interface ProductModalProps {
  productId: number;
  isOpen: boolean;
  onClose: () => void;
}

export default function ProductModal({ productId, isOpen, onClose }: ProductModalProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const { addToCart } = useCart();
  const { toast } = useToast();

  const { data: product, isLoading } = useQuery<Product & { variants: ProductVariant[] }>({
    queryKey: [`/api/products/${productId}`],
    enabled: isOpen && !!productId,
  });

  const handleAddToCart = async () => {
    if (!product) return;

    try {
      await addToCart({
        productId: product.id,
        quantity,
        selectedVariants,
      });

      toast({
        title: "Added to cart!",
        description: `${product.name} has been added to your cart.`,
      });

      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add item to cart. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              <Skeleton className="aspect-square w-full rounded-xl" />
              <div className="flex space-x-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="w-16 h-16 rounded-lg" />
                ))}
              </div>
            </div>
            <div className="space-y-6">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-12 w-32" />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (!product) return null;

  const images = [product.imageUrl, ...(product.images || [])];
  const discount = product.compareAtPrice ? 
    Math.round(((parseFloat(product.compareAtPrice) - parseFloat(product.price)) / parseFloat(product.compareAtPrice)) * 100) : 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{product.name}</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square rounded-xl overflow-hidden bg-white dark:bg-slate-800">
              <img 
                src={images[selectedImageIndex]} 
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            {images.length > 1 && (
              <div className="flex space-x-2">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                      selectedImageIndex === index 
                        ? "border-primary" 
                        : "border-transparent hover:border-gray-300"
                    }`}
                  >
                    <img 
                      src={image} 
                      alt={`${product.name} view ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center mb-2">
                <div className="flex text-yellow-400 mr-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-5 h-5 ${
                        i < Math.floor(parseFloat(product.rating || "0")) 
                          ? "fill-current" 
                          : ""
                      }`} 
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  ({product.reviewCount} reviews)
                </span>
              </div>
              
              <div className="flex items-center space-x-3 mb-4">
                <span className="text-3xl font-bold text-primary">
                  ${parseFloat(product.price).toFixed(2)}
                </span>
                {product.compareAtPrice && (
                  <>
                    <span className="text-lg text-gray-500 dark:text-gray-400 line-through">
                      ${parseFloat(product.compareAtPrice).toFixed(2)}
                    </span>
                    <Badge variant="destructive">
                      {discount}% OFF
                    </Badge>
                  </>
                )}
              </div>

              <Badge variant="secondary" className="bg-primary/10 text-primary">
                {product.category}
              </Badge>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Description</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Variants */}
            {product.variants && product.variants.length > 0 && (
              <div className="space-y-4">
                {Object.entries(
                  product.variants.reduce((acc, variant) => {
                    if (!acc[variant.type]) acc[variant.type] = [];
                    acc[variant.type].push(variant);
                    return acc;
                  }, {} as Record<string, ProductVariant[]>)
                ).map(([type, variants]) => (
                  <div key={type}>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 capitalize">
                      {type}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {variants.map((variant) => (
                        <Button
                          key={variant.id}
                          variant={selectedVariants[type] === variant.value ? "default" : "outline"}
                          onClick={() => setSelectedVariants(prev => ({ ...prev, [type]: variant.value }))}
                          className={selectedVariants[type] === variant.value ? "bg-primary text-white" : ""}
                        >
                          {variant.name}
                        </Button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Quantity */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Quantity</h3>
              <div className="flex items-center space-x-4">
                <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="px-4 py-2 text-gray-900 dark:text-white font-medium">
                    {quantity}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex space-x-4">
              <Button 
                onClick={handleAddToCart}
                className="flex-1 bg-primary hover:bg-primary/90 text-white"
                disabled={!product.inStock}
              >
                {product.inStock ? "Add to Cart" : "Out of Stock"}
              </Button>
              <Button variant="outline" size="icon">
                <Heart className="w-5 h-5" />
              </Button>
            </div>

            {/* Product Features */}
            <Separator />
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Leaf className="w-5 h-5 text-green-500" />
                <span className="text-gray-600 dark:text-gray-400">100% Natural Wax</span>
              </div>
              <div className="flex items-center space-x-3">
                <Clock className="w-5 h-5 text-primary" />
                <span className="text-gray-600 dark:text-gray-400">
                  {product.burnTime || "20-60"} Hours Burn Time
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Truck className="w-5 h-5 text-blue-500" />
                <span className="text-gray-600 dark:text-gray-400">Free Shipping on Orders $50+</span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
