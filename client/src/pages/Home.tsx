import { useEffect } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Flame, Leaf, Heart, Clock, ArrowRight, Star } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ProductCard } from "@/components/products/ProductCard";
import { useProducts } from "@/hooks/useProducts";
import { useAuth } from "@/hooks/useAuth";

export default function Home() {
  const { user } = useAuth();
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
              <div className="mb-6">
                <Badge className="mb-4 bg-primary/10 text-primary hover:bg-primary/20">
                  Welcome back, {user?.firstName || "Candle Lover"}!
                </Badge>
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-serif text-foreground leading-tight mb-6">
                Illuminate Your
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-500 block">
                  Sacred Spaces
                </span>
              </h1>
              
              <p className="text-lg sm:text-xl text-muted-foreground mb-8 leading-relaxed">
                Discover our collection of hand-poured, artisanal candles crafted with 
                premium soy wax and natural fragrances. Each candle tells a story of 
                warmth, comfort, and mindful living.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="candle-glow" asChild>
                  <Link href="/products">
                    Shop Collection
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link href="/collections">View Collections</Link>
                </Button>
              </div>
            </div>
            
            <div className="relative animate-fade-in">
              <img
                src="https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=600&h=600&fit=crop"
                alt="Beautiful handcrafted candles in a cozy setting"
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

      {/* Featured Categories */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold font-serif text-foreground mb-4">
              Explore Our Collections
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              From soy wax to beeswax, discover candles crafted for every mood and moment
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Aromatherapy",
                description: "Essential oil blends for relaxation",
                image: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400&h=300&fit=crop",
                color: "from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30",
                icon: Leaf,
                iconColor: "text-purple-600 dark:text-purple-400"
              },
              {
                title: "Seasonal",
                description: "Limited edition scents for every season",
                image: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=400&h=300&fit=crop",
                color: "from-orange-100 to-red-100 dark:from-orange-900/30 dark:to-red-900/30",
                icon: Flame,
                iconColor: "text-orange-600 dark:text-orange-400"
              },
              {
                title: "Luxury",
                description: "Premium wax blends with exotic fragrances",
                image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop",
                color: "from-amber-100 to-yellow-100 dark:from-amber-900/30 dark:to-yellow-900/30",
                icon: Star,
                iconColor: "text-amber-600 dark:text-amber-400"
              }
            ].map((category) => (
              <Card key={category.title} className="group cursor-pointer overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                <div className={`relative p-8 h-80 flex flex-col justify-between bg-gradient-to-br ${category.color}`}>
                  <img
                    src={category.image}
                    alt={category.title}
                    className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:opacity-30 transition-opacity"
                  />
                  <div className="relative z-10">
                    <category.icon className={`w-8 h-8 ${category.iconColor} mb-4`} />
                  </div>
                  <div className="relative z-10">
                    <h3 className="text-2xl font-bold font-serif text-foreground mb-2">
                      {category.title}
                    </h3>
                    <p className="text-muted-foreground mb-4">{category.description}</p>
                    <Button variant="ghost" className="p-0 text-primary hover:text-primary/80">
                      Shop Collection
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
              Bestselling Candles
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover customer favorites that bring warmth and ambiance to any space
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="text-center mt-12">
            <Button size="lg" variant="outline" asChild>
              <Link href="/products">View All Products</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold font-serif text-foreground mb-4">
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
