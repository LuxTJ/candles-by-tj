import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Product } from "@shared/schema";
import Header from "@/components/Header";
import ProductCard from "@/components/ProductCard";
import ProductModal from "@/components/ProductModal";
import CartSidebar from "@/components/CartSidebar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Flame, Leaf, Heart, Clock, Truck, Mail, Star } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function Home() {
  const [selectedProduct, setSelectedProduct] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [emailSubscription, setEmailSubscription] = useState("");
  const { toast } = useToast();

  // Fetch featured products
  const { data: featuredProducts, isLoading: featuredLoading } = useQuery<Product[]>({
    queryKey: ["/api/products", { featured: true, limit: 4 }],
  });

  // Fetch all products for category filtering
  const { data: allProducts, isLoading: allLoading } = useQuery<Product[]>({
    queryKey: ["/api/products", { limit: 8 }],
  });

  // Fetch categories
  const { data: categories } = useQuery<string[]>({
    queryKey: ["/api/categories"],
  });

  const filteredProducts = allProducts?.filter(product => 
    selectedCategory === "all" || product.category === selectedCategory
  );

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailSubscription) return;

    try {
      await apiRequest("POST", "/api/newsletter/subscribe", {
        email: emailSubscription,
      });
      
      toast({
        title: "Subscribed!",
        description: "Welcome to the Lumient family. Check your email for a special discount!",
      });
      
      setEmailSubscription("");
    } catch (error) {
      toast({
        title: "Subscription failed",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-warm-50 dark:bg-slate-900">
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-warm-100 via-primary/10 to-warm-200 dark:from-slate-800 dark:via-slate-900 dark:to-slate-800">
        <div className="absolute inset-0 bg-black/5 dark:bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="animate-slide-up">
              <div className="flex items-center mb-6">
                <Flame className="w-8 h-8 text-primary animate-flicker mr-3" />
                <Badge variant="secondary" className="bg-primary/10 text-primary">Handcrafted Excellence</Badge>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight mb-6">
                Illuminate Your
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-warm-500 block">
                  Sacred Spaces
                </span>
              </h1>
              <p className="text-lg sm:text-xl text-gray-700 dark:text-gray-300 mb-8 leading-relaxed">
                Discover our collection of hand-poured, artisanal candles crafted with premium soy wax and natural fragrances. 
                Each candle tells a story of warmth, comfort, and mindful living.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-gradient-to-r from-primary to-warm-500 hover:from-primary/90 hover:to-warm-500/90 text-white shadow-lg">
                  Shop Collection
                </Button>
                <Button variant="outline" size="lg" className="border-primary text-primary hover:bg-primary hover:text-white">
                  Our Story
                </Button>
              </div>
            </div>
            <div className="relative animate-fade-in">
              <div className="relative">
                <img 
                  src="https://images.unsplash.com/photo-1602874801006-47f0a17605f7?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600" 
                  alt="Beautiful handcrafted candles" 
                  className="w-full h-96 lg:h-[500px] object-cover rounded-2xl shadow-2xl"
                />
                <div className="absolute -bottom-6 -left-6 bg-white dark:bg-slate-800 p-6 rounded-xl shadow-xl">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Hand-poured with love</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-16 lg:py-24 bg-white dark:bg-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Explore Our Collections
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              From soy wax to beeswax, discover candles crafted for every mood and moment
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="group cursor-pointer overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="relative h-80 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 p-8 flex flex-col justify-between">
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors"></div>
                <div className="relative z-10 flex items-center justify-center">
                  <Leaf className="w-12 h-12 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="relative z-10">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Aromatherapy</h3>
                  <p className="text-gray-700 dark:text-gray-300 mb-4">Essential oil blends for relaxation and wellness</p>
                  <Button variant="ghost" className="text-purple-600 dark:text-purple-400 p-0 h-auto">
                    Shop Collection →
                  </Button>
                </div>
              </div>
            </Card>

            <Card className="group cursor-pointer overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="relative h-80 bg-gradient-to-br from-orange-100 to-red-100 dark:from-orange-900/30 dark:to-red-900/30 p-8 flex flex-col justify-between">
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors"></div>
                <div className="relative z-10 flex items-center justify-center">
                  <Flame className="w-12 h-12 text-orange-600 dark:text-orange-400" />
                </div>
                <div className="relative z-10">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Seasonal</h3>
                  <p className="text-gray-700 dark:text-gray-300 mb-4">Limited edition scents for every season</p>
                  <Button variant="ghost" className="text-orange-600 dark:text-orange-400 p-0 h-auto">
                    Shop Collection →
                  </Button>
                </div>
              </div>
            </Card>

            <Card className="group cursor-pointer overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="relative h-80 bg-gradient-to-br from-amber-100 to-yellow-100 dark:from-amber-900/30 dark:to-yellow-900/30 p-8 flex flex-col justify-between">
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors"></div>
                <div className="relative z-10 flex items-center justify-center">
                  <Star className="w-12 h-12 text-amber-600 dark:text-amber-400" />
                </div>
                <div className="relative z-10">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Luxury</h3>
                  <p className="text-gray-700 dark:text-gray-300 mb-4">Premium wax blends with exotic fragrances</p>
                  <Button variant="ghost" className="text-amber-600 dark:text-amber-400 p-0 h-auto">
                    Shop Collection →
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 lg:py-24 bg-warm-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Bestselling Candles
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Discover customer favorites that bring warmth and ambiance to any space
            </p>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <Button
              variant={selectedCategory === "all" ? "default" : "outline"}
              onClick={() => setSelectedCategory("all")}
              className={selectedCategory === "all" ? "bg-primary text-white" : ""}
            >
              All
            </Button>
            {categories?.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
                className={selectedCategory === category ? "bg-primary text-white" : ""}
              >
                {category}
              </Button>
            ))}
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {(allLoading || featuredLoading) ? (
              Array.from({ length: 4 }).map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <Skeleton className="h-64 w-full" />
                  <CardContent className="p-6">
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-3/4 mb-4" />
                    <Skeleton className="h-8 w-1/2" />
                  </CardContent>
                </Card>
              ))
            ) : (
              filteredProducts?.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onViewDetails={() => setSelectedProduct(product.id)}
                />
              ))
            )}
          </div>

          <div className="text-center mt-12">
            <Button variant="outline" size="lg" className="border-primary text-primary hover:bg-primary hover:text-white">
              View All Products
            </Button>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 lg:py-24 bg-white dark:bg-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Why Choose Lumient
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Every candle is crafted with passion, sustainability, and attention to detail that transforms your space into a sanctuary.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="w-16 h-16 mx-auto mb-6 p-4 bg-primary/10 rounded-full group-hover:bg-primary/20 transition-colors duration-300">
                <Leaf className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Eco-Friendly</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Made with 100% natural soy wax and cotton wicks, our candles are biodegradable and burn cleanly without harmful toxins.
              </p>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16 mx-auto mb-6 p-4 bg-primary/10 rounded-full group-hover:bg-primary/20 transition-colors duration-300">
                <Heart className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Handcrafted</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Each candle is lovingly hand-poured in small batches, ensuring consistent quality and unique character in every piece.
              </p>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16 mx-auto mb-6 p-4 bg-primary/10 rounded-full group-hover:bg-primary/20 transition-colors duration-300">
                <Clock className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Long-Lasting</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Our premium wax blend provides up to 60 hours of burn time, giving you exceptional value and extended enjoyment.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 lg:py-24 bg-gradient-to-br from-primary to-warm-500">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-8">
            <Mail className="w-12 h-12 mx-auto text-white mb-4" />
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              Stay in the Glow
            </h2>
            <p className="text-xl text-primary-100 max-w-2xl mx-auto">
              Subscribe to our newsletter for exclusive offers, new product launches, and candle care tips. Get 15% off your first order!
            </p>
          </div>

          <form onSubmit={handleNewsletterSubmit} className="max-w-md mx-auto">
            <div className="flex flex-col sm:flex-row gap-4">
              <Input
                type="email"
                placeholder="Enter your email address"
                value={emailSubscription}
                onChange={(e) => setEmailSubscription(e.target.value)}
                className="flex-1 bg-white border-0 text-gray-900 placeholder-gray-500"
                required
              />
              <Button type="submit" variant="secondary" className="bg-white text-primary hover:bg-gray-100 font-semibold">
                Subscribe
              </Button>
            </div>
            <p className="text-sm text-primary-200 mt-4">
              By subscribing, you agree to our privacy policy and terms of service.
            </p>
          </form>
        </div>
      </section>

      <Footer />

      {/* Modals */}
      {selectedProduct && (
        <ProductModal
          productId={selectedProduct}
          isOpen={!!selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
      
      <CartSidebar />
    </div>
  );
}
