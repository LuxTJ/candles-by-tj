import { useState } from "react";
import { Product } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Star } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { useToast } from "@/hooks/use-toast";

interface ProductCardProps {
  product: Product;
  onViewDetails: () => void;
}

export default function ProductCard({ product, onViewDetails }: ProductCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const { addToCart } = useCart();
  const { toast } = useToast();

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    try {
      await addToCart({
        productId: product.id,
        quantity: 1,
        selectedVariants: {},
      });

      toast({
        title: "Added to cart!",
        description: `${product.name} has been added to your cart.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add item to cart. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLiked(!isLiked);
  };

  const discount = product.compareAtPrice ? 
    Math.round(((parseFloat(product.compareAtPrice) - parseFloat(product.price)) / parseFloat(product.compareAtPrice)) * 100) : 0;

  return (
    <Card 
      className="group cursor-pointer overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 bg-white dark:bg-slate-800"
      onClick={onViewDetails}
    >
      <div className="relative overflow-hidden">
        <img 
          src={product.imageUrl} 
          alt={product.name}
          className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
        />
        
        {/* Action Buttons */}
        <div className="absolute top-4 right-4">
          <Button
            variant="secondary"
            size="icon"
            onClick={handleLike}
            className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm hover:bg-white dark:hover:bg-slate-700 shadow-md"
          >
            <Heart 
              className={`w-4 h-4 transition-colors ${
                isLiked 
                  ? "text-red-500 fill-current" 
                  : "text-gray-600 dark:text-gray-300"
              }`} 
            />
          </Button>
        </div>

        {/* Badges */}
        <div className="absolute top-4 left-4">
          {product.featured && (
            <Badge variant="secondary" className="bg-primary text-white mb-2">
              Bestseller
            </Badge>
          )}
          {discount > 0 && (
            <Badge variant="destructive" className="block">
              {discount}% OFF
            </Badge>
          )}
          {!product.inStock && (
            <Badge variant="secondary" className="bg-gray-500 text-white">
              Out of Stock
            </Badge>
          )}
        </div>
      </div>

      <CardContent className="p-6">
        {/* Rating */}
        <div className="flex items-center mb-2">
          <div className="flex text-yellow-400 mr-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star 
                key={i} 
                className={`w-4 h-4 ${
                  i < Math.floor(parseFloat(product.rating || "0")) 
                    ? "fill-current" 
                    : ""
                }`} 
              />
            ))}
          </div>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            ({product.reviewCount})
          </span>
        </div>

        {/* Product Info */}
        <div className="mb-2">
          <Badge variant="outline" className="text-xs text-gray-500 dark:text-gray-400 mb-2">
            {product.category}
          </Badge>
        </div>
        
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-1">
          {product.name}
        </h3>
        
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
          {product.scent ? `${product.scent} • ` : ""}{product.description}
        </p>

        {/* Price and Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-xl font-bold text-primary">
              ${parseFloat(product.price).toFixed(2)}
            </span>
            {product.compareAtPrice && (
              <span className="text-sm text-gray-500 dark:text-gray-400 line-through">
                ${parseFloat(product.compareAtPrice).toFixed(2)}
              </span>
            )}
          </div>
          
          <Button 
            onClick={handleAddToCart}
            size="sm"
            className="bg-primary hover:bg-primary/90 text-white"
            disabled={!product.inStock}
          >
            {product.inStock ? "Add to Cart" : "Out of Stock"}
          </Button>
        </div>

        {/* Additional Info */}
        {product.burnTime && (
          <div className="mt-3 text-xs text-gray-500 dark:text-gray-400">
            Burn time: {product.burnTime} hours
          </div>
        )}
      </CardContent>
    </Card>
  );
}
