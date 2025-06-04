import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, ZoomIn, Share2, Heart } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";

interface ProductGalleryProps {
  images: string[];
  name: string;
  featured?: boolean;
  inStock?: boolean;
}

export function ProductGallery({ images, name, featured = false, inStock = true }: ProductGalleryProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);

  // Fallback images if none provided
  const galleryImages = images.length > 0 ? images : [
    'https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800',
    'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800',
    'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800',
    'https://images.unsplash.com/photo-1602874801006-47f0a17605f7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800'
  ];

  const selectedImage = galleryImages[selectedImageIndex];

  const nextImage = () => {
    setSelectedImageIndex((prev) => (prev + 1) % galleryImages.length);
  };

  const prevImage = () => {
    setSelectedImageIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
  };

  const handleWishlistToggle = () => {
    setIsWishlisted(!isWishlisted);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: name,
          text: `Check out this beautiful candle: ${name}`,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <div className="space-y-4">
      {/* Main Image Display */}
      <Card className="relative overflow-hidden bg-muted/30">
        <div className="aspect-square relative group">
          <img
            src={selectedImage}
            alt={`${name} - Image ${selectedImageIndex + 1}`}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          
          {/* Overlay Badges */}
          <div className="absolute top-4 left-4 space-y-2">
            {featured && (
              <Badge className="bg-green-500 hover:bg-green-600 text-white">
                Bestseller
              </Badge>
            )}
            {!inStock && (
              <Badge variant="destructive">
                Out of Stock
              </Badge>
            )}
          </div>

          {/* Action Buttons */}
          <div className="absolute top-4 right-4 space-y-2">
            <Button
              variant="secondary"
              size="icon"
              onClick={handleWishlistToggle}
              className={`bg-white/90 dark:bg-gray-800/90 hover:bg-white dark:hover:bg-gray-700 ${
                isWishlisted ? 'text-red-500' : 'text-gray-600 dark:text-gray-300'
              }`}
            >
              <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
            </Button>
            
            <Button
              variant="secondary"
              size="icon"
              onClick={handleShare}
              className="bg-white/90 dark:bg-gray-800/90 hover:bg-white dark:hover:bg-gray-700"
            >
              <Share2 className="w-4 h-4" />
            </Button>

            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="secondary"
                  size="icon"
                  className="bg-white/90 dark:bg-gray-800/90 hover:bg-white dark:hover:bg-gray-700"
                >
                  <ZoomIn className="w-4 h-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] p-0">
                <div className="relative">
                  <img
                    src={selectedImage}
                    alt={`${name} - Full size`}
                    className="w-full h-auto max-h-[85vh] object-contain"
                  />
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Navigation Arrows */}
          {galleryImages.length > 1 && (
            <>
              <Button
                variant="secondary"
                size="icon"
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 dark:bg-gray-800/90 hover:bg-white dark:hover:bg-gray-700 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={prevImage}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              
              <Button
                variant="secondary"
                size="icon"
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 dark:bg-gray-800/90 hover:bg-white dark:hover:bg-gray-700 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={nextImage}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </>
          )}

          {/* Image Counter */}
          {galleryImages.length > 1 && (
            <div className="absolute bottom-4 right-4 bg-black/60 text-white px-2 py-1 rounded-md text-sm">
              {selectedImageIndex + 1} / {galleryImages.length}
            </div>
          )}
        </div>
      </Card>

      {/* Thumbnail Gallery */}
      {galleryImages.length > 1 && (
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {galleryImages.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImageIndex(index)}
              className={`flex-shrink-0 relative rounded-lg overflow-hidden transition-all duration-200 ${
                selectedImageIndex === index
                  ? 'ring-2 ring-primary ring-offset-2 ring-offset-background'
                  : 'hover:opacity-80'
              }`}
            >
              <img
                src={image}
                alt={`${name} - Thumbnail ${index + 1}`}
                className="w-20 h-20 object-cover"
              />
              {selectedImageIndex === index && (
                <div className="absolute inset-0 bg-primary/20"></div>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Image Navigation Dots */}
      {galleryImages.length > 1 && (
        <div className="flex justify-center space-x-2">
          {galleryImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setSelectedImageIndex(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                selectedImageIndex === index ? 'bg-primary' : 'bg-muted-foreground/30'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
