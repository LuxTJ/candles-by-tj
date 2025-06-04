import { useState } from "react";
import { Star, Heart, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Product } from "@shared/schema";

interface ProductCardProps {
  product: Product;
  onAddToCart: () => void;
  onQuickView: () => void;
}

export function ProductCard({ product, onAddToCart, onQuickView }: ProductCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star key={i} className="w-4 h-4 fill-current text-yellow-400" />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <Star key="half" className="w-4 h-4 fill-current text-yellow-400 opacity-50" />
      );
    }

    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(
        <Star key={`empty-${i}`} className="w-4 h-4 text-gray-300 dark:text-gray-600" />
      );
    }

    return stars;
  };

  const hasDiscount = product.originalPrice && parseFloat(product.originalPrice) > parseFloat(product.price);
  const discountPercentage = hasDiscount 
    ? Math.round(((parseFloat(product.originalPrice!) - parseFloat(product.price)) / parseFloat(product.originalPrice!)) * 100)
    : 0;

  return (
    <div className="group bg-white dark:bg-gray-900 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
      <div className="relative overflow-hidden">
        {imageLoading && (
          <div className="w-full h-64 bg-gray-200 dark:bg-gray-800 animate-pulse" />
        )}
        <img
          src={product.images[0] || "https://via.placeholder.com/400x400?text=No+Image"}
          alt={product.name}
          className={`w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500 ${
            imageLoading ? "opacity-0" : "opacity-100"
          }`}
          onLoad={() => setImageLoading(false)}
        />
        
        {/* Overlay Actions */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
          <Button
            onClick={onQuickView}
            variant="secondary"
            size="sm"
            className="bg-white/90 text-gray-900 hover:bg-white transition-colors"
          >
            <Eye className="w-4 h-4 mr-2" />
            Quick View
          </Button>
        </div>

        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {product.featured && (
            <Badge className="bg-green-500 text-white">Bestseller</Badge>
          )}
          {hasDiscount && (
            <Badge className="bg-red-500 text-white">{discountPercentage}% OFF</Badge>
          )}
          {!product.inStock && (
            <Badge variant="secondary">Out of Stock</Badge>
          )}
        </div>

        {/* Wishlist Button */}
        <div className="absolute top-4 right-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsLiked(!isLiked)}
            className="bg-white/90 dark:bg-gray-800/90 p-2 rounded-full text-gray-600 dark:text-gray-400 hover:text-red-500 transition-colors"
          >
            <Heart className={`w-4 h-4 ${isLiked ? "fill-current text-red-500" : ""}`} />
          </Button>
        </div>
      </div>

      <div className="p-6">
        {/* Rating and Category */}
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-500 dark:text-gray-400 capitalize">
            {product.category}
          </span>
          <div className="flex items-center">
            <div className="flex">
              {renderStars(parseFloat(product.rating || "0"))}
            </div>
            <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
              ({product.reviewCount})
            </span>
          </div>
        </div>

        {/* Product Name */}
        <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-2 line-clamp-1">
          {product.name}
        </h3>

        {/* Description */}
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
          {product.description}
        </p>

        {/* Size and Burn Time */}
        <div className="flex items-center gap-4 mb-4 text-xs text-gray-500 dark:text-gray-400">
          <span>{product.size}</span>
          {product.burnTime && <span>• {product.burnTime}</span>}
          {product.scent && <span>• {product.scent}</span>}
        </div>

        {/* Price and Add to Cart */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-primary-600 dark:text-primary-400">
              ${product.price}
            </span>
            {hasDiscount && (
              <span className="text-sm text-gray-500 dark:text-gray-400 line-through">
                ${product.originalPrice}
              </span>
            )}
          </div>
          <Button
            onClick={onAddToCart}
            disabled={!product.inStock}
            className="bg-primary-500 hover:bg-primary-600 text-white transition-colors"
          >
            {product.inStock ? "Add to Cart" : "Out of Stock"}
          </Button>
        </div>
      </div>
    </div>
  );
}
