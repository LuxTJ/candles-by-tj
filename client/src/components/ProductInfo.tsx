import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/hooks/useCart";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import { 
  Star, 
  Minus, 
  Plus, 
  ShoppingCart, 
  Leaf, 
  Clock, 
  Truck,
  MessageCircle,
  ThumbsUp,
  CalendarDays
} from "lucide-react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { Product, Review, SelectedVariants, ReviewFormData } from "@/lib/types";

interface ProductInfoProps {
  product: Product;
}

export function ProductInfo({ product }: ProductInfoProps) {
  const [selectedVariants, setSelectedVariants] = useState<SelectedVariants>({});
  const [quantity, setQuantity] = useState(1);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [reviewForm, setReviewForm] = useState<ReviewFormData>({
    rating: 5,
    title: '',
    comment: '',
  });

  const { toast } = useToast();
  const { addToCart, isAddingToCart } = useCart();
  const queryClient = useQueryClient();

  // Fetch product reviews
  const { data: reviews = [] } = useQuery<Review[]>({
    queryKey: [`/api/products/${product.id}/reviews`],
  });

  // Add review mutation
  const addReviewMutation = useMutation({
    mutationFn: async (reviewData: ReviewFormData) => {
      await apiRequest('POST', `/api/products/${product.id}/reviews`, reviewData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/products/${product.id}/reviews`] });
      queryClient.invalidateQueries({ queryKey: ['/api/products', product.id.toString()] });
      setReviewDialogOpen(false);
      setReviewForm({ rating: 5, title: '', comment: '' });
      toast({
        title: "Review added",
        description: "Thank you for your review!",
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to add review. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleVariantChange = (type: keyof SelectedVariants, value: string) => {
    setSelectedVariants(prev => ({
      ...prev,
      [type]: value,
    }));
  };

  const handleQuantityChange = (delta: number) => {
    setQuantity(prev => Math.max(1, prev + delta));
  };

  const handleAddToCart = () => {
    addToCart({
      productId: product.id,
      quantity,
      selectedVariants,
    });
  };

  const calculatePrice = () => {
    if (selectedVariants.size && product.variants?.size) {
      const sizeVariant = product.variants.size.find(v => v.name === selectedVariants.size);
      return sizeVariant ? sizeVariant.price : parseFloat(product.basePrice);
    }
    return parseFloat(product.basePrice);
  };

  const renderStars = (rating: number, size = "w-4 h-4") => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star key={i} className={`${size} fill-current text-yellow-400`} />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <Star key="half" className={`${size} fill-current text-yellow-400 opacity-50`} />
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Star key={`empty-${i}`} className={`${size} text-gray-300 dark:text-gray-600`} />
      );
    }

    return stars;
  };

  const currentPrice = calculatePrice();
  const originalPrice = parseFloat(product.basePrice);
  const discountPercentage = product.featured ? 20 : 0;
  const displayPrice = discountPercentage > 0 ? currentPrice * (1 - discountPercentage / 100) : currentPrice;

  return (
    <div className="space-y-8">
      {/* Product Header */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="capitalize">
            {product.category}
          </Badge>
          {product.featured && (
            <Badge className="bg-green-500 hover:bg-green-600">
              Bestseller
            </Badge>
          )}
          {!product.inStock && (
            <Badge variant="destructive">
              Out of Stock
            </Badge>
          )}
        </div>

        <h1 className="text-3xl lg:text-4xl font-bold text-foreground">
          {product.name}
        </h1>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            {renderStars(parseFloat(product.rating || '0'))}
            <span className="text-sm text-muted-foreground ml-2">
              {product.rating ? parseFloat(product.rating).toFixed(1) : '0.0'} ({product.reviewCount} reviews)
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <span className="text-3xl font-bold text-primary">
            ${displayPrice.toFixed(2)}
          </span>
          {discountPercentage > 0 && (
            <>
              <span className="text-lg text-muted-foreground line-through">
                ${currentPrice.toFixed(2)}
              </span>
              <Badge className="bg-red-500 hover:bg-red-600">
                {discountPercentage}% OFF
              </Badge>
            </>
          )}
        </div>
      </div>

      <Separator />

      {/* Product Options */}
      <div className="space-y-6">
        {/* Size Selection */}
        {product.variants?.size && product.variants.size.length > 0 && (
          <div className="space-y-3">
            <Label className="text-lg font-semibold">Size</Label>
            <div className="flex flex-wrap gap-3">
              {product.variants.size.map((variant) => (
                <Button
                  key={variant.name}
                  variant={selectedVariants.size === variant.name ? "default" : "outline"}
                  className="flex flex-col h-auto p-4"
                  onClick={() => handleVariantChange('size', variant.name)}
                >
                  <span className="font-medium">{variant.name}</span>
                  <span className="text-xs opacity-70">{variant.burnTime}</span>
                  <span className="text-sm">${variant.price.toFixed(2)}</span>
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Color Selection */}
        {product.variants?.color && product.variants.color.length > 0 && (
          <div className="space-y-3">
            <Label className="text-lg font-semibold">Color</Label>
            <div className="flex flex-wrap gap-3">
              {product.variants.color.map((variant) => (
                <Button
                  key={variant.name}
                  variant={selectedVariants.color === variant.name ? "default" : "outline"}
                  className="flex items-center space-x-2"
                  onClick={() => handleVariantChange('color', variant.name)}
                >
                  <div
                    className="w-4 h-4 rounded-full border border-gray-300"
                    style={{ backgroundColor: variant.hex }}
                  />
                  <span>{variant.name}</span>
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Quantity Selection */}
        <div className="space-y-3">
          <Label className="text-lg font-semibold">Quantity</Label>
          <div className="flex items-center space-x-4">
            <div className="flex items-center border border-input rounded-lg">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleQuantityChange(-1)}
                disabled={quantity <= 1}
                className="h-10 w-10"
              >
                <Minus className="w-4 h-4" />
              </Button>
              <span className="px-4 py-2 text-lg font-medium min-w-[3rem] text-center">
                {quantity}
              </span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleQuantityChange(1)}
                className="h-10 w-10"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Separator />

      {/* Add to Cart */}
      <div className="space-y-4">
        <Button
          className="w-full h-12 text-lg"
          onClick={handleAddToCart}
          disabled={isAddingToCart || !product.inStock}
        >
          {isAddingToCart ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              Adding to Cart...
            </>
          ) : (
            <>
              <ShoppingCart className="w-5 h-5 mr-2" />
              Add to Cart - ${(displayPrice * quantity).toFixed(2)}
            </>
          )}
        </Button>

        {!product.inStock && (
          <p className="text-center text-destructive font-medium">
            This item is currently out of stock
          </p>
        )}
      </div>

      <Separator />

      {/* Product Features */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground">Features</h3>
        <div className="grid grid-cols-1 gap-4">
          <div className="flex items-center space-x-3">
            <Leaf className="w-5 h-5 text-green-500" />
            <span className="text-muted-foreground">100% Natural Wax</span>
          </div>
          <div className="flex items-center space-x-3">
            <Clock className="w-5 h-5 text-primary" />
            <span className="text-muted-foreground">
              {product.burnTime || 'Long-lasting burn time'}
            </span>
          </div>
          <div className="flex items-center space-x-3">
            <Truck className="w-5 h-5 text-blue-500" />
            <span className="text-muted-foreground">Free Shipping on Orders $50+</span>
          </div>
        </div>
      </div>

      <Separator />

      {/* Product Details Tabs */}
      <Tabs defaultValue="description" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="description">Description</TabsTrigger>
          <TabsTrigger value="reviews">
            Reviews ({reviews.length})
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="description" className="space-y-4">
          <Card>
            <CardContent className="p-6">
              <p className="text-muted-foreground leading-relaxed">
                {product.description}
              </p>
              
              {product.tags && product.tags.length > 0 && (
                <div className="mt-6">
                  <h4 className="font-semibold mb-3">Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {product.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="reviews" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Customer Reviews</h3>
            <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Write Review
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Write a Review</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label>Rating</Label>
                    <div className="flex space-x-1 mt-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => setReviewForm(prev => ({ ...prev, rating: star }))}
                          className="p-1"
                        >
                          <Star
                            className={`w-6 h-6 ${
                              star <= reviewForm.rating
                                ? 'fill-current text-yellow-400'
                                : 'text-gray-300'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="review-title">Title (Optional)</Label>
                    <input
                      id="review-title"
                      type="text"
                      placeholder="Great candle!"
                      value={reviewForm.title}
                      onChange={(e) => setReviewForm(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full px-3 py-2 border border-input rounded-md mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="review-comment">Review</Label>
                    <Textarea
                      id="review-comment"
                      placeholder="Share your thoughts about this candle..."
                      value={reviewForm.comment}
                      onChange={(e) => setReviewForm(prev => ({ ...prev, comment: e.target.value }))}
                      className="mt-1"
                      rows={4}
                    />
                  </div>
                  
                  <Button
                    onClick={() => addReviewMutation.mutate(reviewForm)}
                    disabled={addReviewMutation.isPending}
                    className="w-full"
                  >
                    {addReviewMutation.isPending ? 'Submitting...' : 'Submit Review'}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="space-y-4">
            {reviews.length === 0 ? (
              <Card>
                <CardContent className="p-6 text-center">
                  <p className="text-muted-foreground">No reviews yet. Be the first to review this product!</p>
                </CardContent>
              </Card>
            ) : (
              reviews.map((review) => (
                <Card key={review.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-1">
                        {renderStars(review.rating)}
                        <span className="text-sm font-medium ml-2">
                          {review.rating}/5
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <CalendarDays className="w-4 h-4" />
                        {new Date(review.createdAt!).toLocaleDateString()}
                      </div>
                    </div>
                    
                    {review.title && (
                      <h4 className="font-semibold text-foreground mb-2">
                        {review.title}
                      </h4>
                    )}
                    
                    {review.comment && (
                      <p className="text-muted-foreground leading-relaxed mb-3">
                        {review.comment}
                      </p>
                    )}
                    
                    <div className="flex items-center justify-between">
                      {review.verified && (
                        <Badge variant="outline" className="text-green-600 border-green-600">
                          <ThumbsUp className="w-3 h-3 mr-1" />
                          Verified Purchase
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
