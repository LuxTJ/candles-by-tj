import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Heart, Minus, Plus, ShoppingCart, Truck, RefreshCw, Shield } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function ProductPage() {
  const params = useParams();
  const slug = params.slug;
  const { toast } = useToast();
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("medium");

  const { data: product, isLoading, error } = useQuery({
    queryKey: [`/api/products/${slug}`],
    enabled: !!slug,
  });

  const { data: reviews } = useQuery({
    queryKey: [`/api/products/${product?.id}/reviews`],
    enabled: !!product?.id,
  });

  const { data: rating } = useQuery({
    queryKey: [`/api/products/${product?.id}/rating`],
    enabled: !!product?.id,
  });

  const handleAddToCart = async () => {
    try {
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          productId: product.id,
          quantity,
        }),
      });

      if (response.ok) {
        toast({
          title: "Added to cart!",
          description: `${quantity} ${product.name}${quantity > 1 ? 's' : ''} added to your cart.`,
        });
      } else {
        throw new Error("Failed to add to cart");
      }
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
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">Product Not Found</h1>
            <p className="text-muted-foreground">The product you're looking for doesn't exist.</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const salePrice = product.salePrice ? parseFloat(product.salePrice) : null;
  const regularPrice = parseFloat(product.price);
  const discount = salePrice ? Math.round(((regularPrice - salePrice) / regularPrice) * 100) : 0;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square rounded-2xl overflow-hidden bg-muted">
              <img
                src={product.imageUrl || "https://images.unsplash.com/photo-1602874801006-47f0a17605f7?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600"}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Thumbnail Gallery */}
            {product.imageGallery && product.imageGallery.length > 0 && (
              <div className="flex space-x-2">
                {product.imageGallery.slice(0, 4).map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`${product.name} view ${index + 1}`}
                    className="w-20 h-20 rounded-lg object-cover cursor-pointer border-2 hover:border-primary transition-colors"
                  />
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-4">
                {product.isFeatured && (
                  <Badge variant="secondary">Bestseller</Badge>
                )}
                {salePrice && (
                  <Badge variant="destructive">{discount}% OFF</Badge>
                )}
              </div>
              
              <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
                {product.name}
              </h1>
              
              {rating && (
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < Math.floor(rating.rating)
                            ? "text-yellow-400 fill-current"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    ({rating.count} reviews)
                  </span>
                </div>
              )}

              <div className="flex items-center gap-3 mb-6">
                <span className="text-3xl font-bold text-primary">
                  ${salePrice || regularPrice}
                </span>
                {salePrice && (
                  <span className="text-xl text-muted-foreground line-through">
                    ${regularPrice}
                  </span>
                )}
              </div>
            </div>

            <div>
              <p className="text-muted-foreground leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Product Details */}
            <div className="grid grid-cols-2 gap-4 py-6 border-y">
              {product.scent && (
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Scent</h3>
                  <p className="text-muted-foreground">{product.scent}</p>
                </div>
              )}
              {product.burnTime && (
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Burn Time</h3>
                  <p className="text-muted-foreground">{product.burnTime}</p>
                </div>
              )}
              {product.waxType && (
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Wax Type</h3>
                  <p className="text-muted-foreground">{product.waxType}</p>
                </div>
              )}
              {product.size && (
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Size</h3>
                  <p className="text-muted-foreground">{product.size}</p>
                </div>
              )}
            </div>

            {/* Size Options (if applicable) */}
            <div>
              <h3 className="font-semibold text-foreground mb-3">Size</h3>
              <div className="flex gap-3">
                {["small", "medium", "large"].map((size) => (
                  <Button
                    key={size}
                    variant={selectedSize === size ? "default" : "outline"}
                    onClick={() => setSelectedSize(size)}
                    className="capitalize"
                  >
                    {size}
                  </Button>
                ))}
              </div>
            </div>

            {/* Quantity Selector */}
            <div>
              <h3 className="font-semibold text-foreground mb-3">Quantity</h3>
              <div className="flex items-center gap-4">
                <div className="flex items-center border rounded-lg">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="px-4 py-2 min-w-[3rem] text-center font-semibold">
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
            <div className="flex gap-4">
              <Button 
                className="flex-1" 
                size="lg"
                onClick={handleAddToCart}
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                Add to Cart
              </Button>
              <Button variant="outline" size="lg">
                <Heart className="w-5 h-5" />
              </Button>
            </div>

            {/* Product Features */}
            <div className="space-y-3 pt-6 border-t">
              <div className="flex items-center gap-3">
                <Truck className="w-5 h-5 text-green-600" />
                <span className="text-sm text-muted-foreground">Free shipping on orders over $50</span>
              </div>
              <div className="flex items-center gap-3">
                <RefreshCw className="w-5 h-5 text-blue-600" />
                <span className="text-sm text-muted-foreground">30-day return policy</span>
              </div>
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-purple-600" />
                <span className="text-sm text-muted-foreground">100% natural ingredients</span>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        {reviews && reviews.length > 0 && (
          <div className="mt-16 border-t pt-16">
            <h2 className="text-2xl font-bold text-foreground mb-8">Customer Reviews</h2>
            <div className="space-y-6">
              {reviews.slice(0, 3).map((review) => (
                <div key={review.id} className="bg-card p-6 rounded-lg border">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < review.rating
                              ? "text-yellow-400 fill-current"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="font-semibold text-foreground">{review.title}</span>
                  </div>
                  <p className="text-muted-foreground mb-3">{review.comment}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
