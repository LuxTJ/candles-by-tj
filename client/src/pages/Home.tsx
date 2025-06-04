import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ProductCard } from "@/components/ProductCard";
import { ProductFilters } from "@/components/ProductFilters";
import { ShoppingCart } from "@/components/ShoppingCart";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import { Flame, Leaf, Heart, Clock, Star, ArrowRight } from "lucide-react";
import type { Product } from "@/lib/types";

export default function Home() {
  const [cartOpen, setCartOpen] = useState(false);
  const [filters, setFilters] = useState({
    category: '',
    scent: '',
    search: '',
    sortBy: 'newest' as const,
    sortOrder: 'desc' as const,
  });

  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: ['/api/products', filters],
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) searchParams.append(key, value);
      });
      
      const response = await fetch(`/api/products?${searchParams}`);
      if (!response.ok) throw new Error('Failed to fetch products');
      return response.json();
    },
  });

  const { data: featuredProducts } = useQuery<Product[]>({
    queryKey: ['/api/products', { featured: true }],
    queryFn: async () => {
      const response = await fetch('/api/products?featured=true&limit=4');
      if (!response.ok) throw new Error('Failed to fetch featured products');
      return response.json();
    },
  });

  return (
    <div className="min-h-screen bg-background">
      <Header onCartClick={() => setCartOpen(true)} />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-amber-50 to-orange-50 dark:from-slate-800 dark:to-slate-900">
        <div className="absolute inset-0 bg-black/5 dark:bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 text-primary animate-flicker">
                <Flame className="w-6 h-6" />
                <span className="text-sm font-medium">Handcrafted with Love</span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                Illuminate Your
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-500 block">
                  Sacred Spaces
                </span>
              </h1>
              
              <p className="text-lg text-muted-foreground leading-relaxed">
                Discover our collection of premium, hand-poured candles crafted with natural soy wax 
                and essential oils. Each candle tells a story of warmth, comfort, and mindful living.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="animate-glow">
                  Shop Collection
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <Button variant="outline" size="lg">
                  Our Story
                </Button>
              </div>
            </div>
            
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
                alt="Beautiful handcrafted candles"
                className="w-full h-96 lg:h-[500px] object-cover rounded-2xl shadow-2xl"
              />
              <div className="absolute -bottom-6 -left-6 bg-card p-6 rounded-xl shadow-xl border">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium">100% Natural Ingredients</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Collections */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Explore Our Collections
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              From aromatherapy to seasonal scents, discover candles crafted for every mood and moment
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Aromatherapy",
                description: "Essential oil blends for wellness",
                icon: Leaf,
                color: "from-green-100 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20",
                iconColor: "text-green-600 dark:text-green-400"
              },
              {
                title: "Seasonal",
                description: "Limited edition scents for every season",
                icon: Star,
                color: "from-orange-100 to-red-100 dark:from-orange-900/20 dark:to-red-900/20",
                iconColor: "text-orange-600 dark:text-orange-400"
              },
              {
                title: "Luxury",
                description: "Premium wax blends with exotic fragrances",
                icon: Heart,
                color: "from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20",
                iconColor: "text-purple-600 dark:text-purple-400"
              }
            ].map((collection) => (
              <div 
                key={collection.title}
                className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${collection.color} p-8 h-80 flex flex-col justify-between group cursor-pointer transform hover:scale-105 transition-all duration-300`}
              >
                <div>
                  <collection.icon className={`w-12 h-12 ${collection.iconColor} mb-4`} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-foreground mb-2">{collection.title}</h3>
                  <p className="text-muted-foreground mb-4">{collection.description}</p>
                  <div className={`${collection.iconColor} font-semibold flex items-center group-hover:translate-x-1 transition-transform`}>
                    Shop Collection <ArrowRight className="w-4 h-4 ml-2" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 lg:py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Bestselling Candles
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover customer favorites that bring warmth and ambiance to any space
            </p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="space-y-4">
                  <Skeleton className="w-full h-64 rounded-2xl" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredProducts?.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Button variant="outline" size="lg">
              View All Products
            </Button>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Why Choose Lumient
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Every candle is crafted with passion, sustainability, and attention to detail
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Leaf,
                title: "Eco-Friendly",
                description: "Made with 100% natural soy wax and cotton wicks, our candles are biodegradable and burn cleanly without harmful toxins."
              },
              {
                icon: Heart,
                title: "Handcrafted",
                description: "Each candle is lovingly hand-poured in small batches, ensuring consistent quality and unique character in every piece."
              },
              {
                icon: Clock,
                title: "Long-Lasting",
                description: "Our premium wax blend provides up to 60 hours of burn time, giving you exceptional value and extended enjoyment."
              }
            ].map((value) => (
              <div key={value.title} className="text-center group">
                <div className="w-16 h-16 mx-auto mb-6 p-4 bg-primary/10 rounded-full group-hover:bg-primary/20 transition-colors duration-300">
                  <value.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">{value.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* All Products Section */}
      <section className="py-16 lg:py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="w-full lg:w-1/4">
              <ProductFilters filters={filters} onFiltersChange={setFilters} />
            </div>
            
            <div className="w-full lg:w-3/4">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-foreground">All Products</h2>
                <Badge variant="secondary">
                  {products?.length || 0} products
                </Badge>
              </div>
              
              {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="space-y-4">
                      <Skeleton className="w-full h-64 rounded-2xl" />
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {products?.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              )}
              
              {products && products.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No products found matching your criteria.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 lg:py-24 bg-gradient-to-br from-primary to-orange-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-8">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              Stay in the Glow
            </h2>
            <p className="text-xl text-primary-foreground/80 max-w-2xl mx-auto">
              Subscribe for exclusive offers, new launches, and candle care tips. Get 15% off your first order!
            </p>
          </div>
          
          <div className="max-w-md mx-auto">
            <div className="flex flex-col sm:flex-row gap-4">
              <input 
                type="email" 
                placeholder="Enter your email address" 
                className="flex-1 px-6 py-4 rounded-xl border-0 text-foreground bg-white focus:ring-2 focus:ring-white/20 outline-none"
              />
              <Button className="bg-white text-primary hover:bg-white/90 px-8 py-4 rounded-xl font-semibold">
                Subscribe
              </Button>
            </div>
            <p className="text-sm text-primary-foreground/60 mt-4">
              No spam, unsubscribe at any time. We respect your privacy.
            </p>
          </div>
        </div>
      </section>

      <Footer />
      <ShoppingCart isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  );
}
