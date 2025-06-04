import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Flame, Leaf, Heart, Clock, ArrowRight, Star, ShoppingBag } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ProductCard } from "@/components/products/ProductCard";
import { useProducts } from "@/hooks/useProducts";

export default function Landing() {
  const { data: featuredProducts = [] } = useProducts({ featured: true, limit: 4 });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800">
        <div className="absolute inset-0 bg-black/5 dark:bg-black/20" />
        <div className="relative container mx-auto px-4 py-20 lg:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="animate-slide-up">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-serif text-foreground leading-tight mb-6">
                Handcrafted
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-500 block">
                  Luminous
                </span>
                Moments
              </h1>
              
              <p className="text-lg sm:text-xl text-muted-foreground mb-8 leading-relaxed">
                Transform your space with our premium collection of artisanal candles, 
                each carefully crafted to create the perfect ambiance for every moment.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="candle-glow" asChild>
                  <Link href="/products">
                    Shop Collection
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={() => window.location.href = "/api/login"}
                >
                  Sign In to Shop
                </Button>
              </div>
            </div>
            
            <div className="relative animate-fade-in">
              <img
                src="https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=600&h=600&fit=crop"
                alt="Beautiful handcrafted candles creating warm ambiance"
                className="w-full h-96 lg:h-[500px] object-cover rounded-2xl shadow-2xl"
              />
              <div className="absolute -bottom-6 -left-6 bg-card p-6 rounded-xl shadow-xl border">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-sm font-medium">Hand-poured with love</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Collections */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold font-serif text-foreground mb-4">
              Our Collections
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Curated collections for every mood and occasion
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Zen & Relaxation",
                description: "Calming scents for mindful moments",
                image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=300&fit=crop",
                color: "from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30"
              },
              {
                title: "Seasonal Favorites",
                description: "Limited editions for special times",
                image: "https://images.unsplash.com/photo-1576020799627-aeac74d58064?w=400&h=300&fit=crop",
                color: "from-orange-100 to-red-100 dark:from-orange-900/30 dark:to-red-900/30"
              },
              {
                title: "Luxury Line",
                description: "Premium candles for discerning tastes",
                image: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=400&h=300&fit=crop",
                color: "from-amber-100 to-yellow-100 dark:from-amber-900/30 dark:to-yellow-900/30"
              }
            ].map((collection) => (
              <Card key={collection.title} className="group cursor-pointer overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                <div className={`relative p-8 h-80 flex flex-col justify-between bg-gradient-to-br ${collection.color}`}>
                  <img
                    src={collection.image}
                    alt={collection.title}
                    className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:opacity-30 transition-opacity"
                  />
                  <div className="relative z-10">
                    <h3 className="text-2xl font-bold font-serif text-foreground mb-2">
                      {collection.title}
                    </h3>
                    <p className="text-muted-foreground mb-4">{collection.description}</p>
                    <Button variant="ghost" className="p-0 text-primary hover:text-primary/80">
                      Explore Collection
                      <ArrowRight className="ml-2 w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 lg:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold font-serif text-foreground mb-4">
              Featured Products
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Handpicked favorites from our artisan collection
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="text-center mt-12 space-y-4">
            <Button size="lg" asChild>
              <Link href="/products">View All Products</Link>
            </Button>
            <p className="text-sm text-muted-foreground">
              <Button
                variant="link"
                className="p-0 h-auto text-primary"
                onClick={() => window.location.href = "/api/login"}
              >
                Sign in
              </Button>
              {" "}to add items to cart and checkout
            </p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold font-serif text-foreground mb-4">
              Why Choose Lumient
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Committed to quality, sustainability, and creating moments of joy
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Leaf,
                title: "100% Natural",
                description: "Made with pure soy wax and natural essential oils, free from harmful chemicals and toxins."
              },
              {
                icon: Heart,
                title: "Handcrafted Quality",
                description: "Each candle is carefully hand-poured by skilled artisans with attention to every detail."
              },
              {
                icon: Clock,
                title: "Long Burn Time",
                description: "Enjoy free shipping on orders over $50 with careful packaging to ensure perfect delivery."
              }
            ].map((feature) => (
              <div key={feature.title} className="text-center group">
                <div className="w-16 h-16 mx-auto mb-6 p-4 bg-primary/10 rounded-full group-hover:bg-primary/20 transition-colors duration-300">
                  <feature.icon className="w-8 h-8 text-primary mx-auto" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
