import { useQuery } from "@tanstack/react-query";
import Navigation from "@/components/Navigation";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, Leaf, Clock, Truck, Star, Mail, Flame } from "lucide-react";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { Product } from "@shared/schema";

export default function Landing() {
  const { toast } = useToast();

  const { data: featuredProducts, isLoading: featuredLoading } = useQuery<Product[]>({
    queryKey: ['/api/products/featured?limit=4'],
  });

  const { data: bestsellerProducts, isLoading: bestsellersLoading } = useQuery<Product[]>({
    queryKey: ['/api/products/bestsellers?limit=4'],
  });

  const handleNewsletterSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;

    if (!email) {
      toast({
        title: "Error",
        description: "Please enter your email address",
        variant: "destructive",
      });
      return;
    }

    try {
      await apiRequest('POST', '/api/newsletter/subscribe', { email });
      toast({
        title: "Success!",
        description: "You've been subscribed to our newsletter",
      });
      (e.target as HTMLFormElement).reset();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to subscribe. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-amber-50 dark:from-gray-900 dark:to-gray-800">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-amber-500/10 dark:from-orange-900/20 dark:to-amber-900/20"></div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-20 items-center">
            <div className="animate-slide-up">
              <div className="mb-6">
                <Flame className="h-12 w-12 text-orange-500 animate-flicker" />
              </div>
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl lg:text-7xl">
                Handcrafted
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-500">
                  Luminous
                </span>
                Moments
              </h1>
              <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300 max-w-2xl">
                Transform your space with our premium collection of artisanal candles, each carefully crafted to create the perfect ambiance for every moment.
              </p>
              <div className="mt-10 flex items-center gap-x-6">
                <Link href="/products">
                  <Button size="lg" className="btn-primary bg-orange-500 hover:bg-orange-600 candle-glow">
                    Shop Collection
                  </Button>
                </Link>
                <Button variant="outline" size="lg">
                  Our Story
                </Button>
              </div>
            </div>
            <div className="relative animate-fade-in">
              <img
                src="https://images.unsplash.com/photo-1544787219-7f47ccb76574?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
                alt="Beautiful handcrafted candles"
                className="w-full rounded-2xl shadow-2xl object-cover h-96 lg:h-[500px]"
              />
              <div className="absolute -bottom-6 -left-6 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-xl">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Hand-poured with love</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Collections */}
      <section className="py-16 lg:py-24 bg-white dark:bg-gray-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Explore Our Collections
            </h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
              From soy wax to beeswax, discover candles crafted for every mood and moment
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* Aromatherapy Collection */}
            <Card className="group cursor-pointer overflow-hidden border-0 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 transition-all duration-300 hover:scale-105">
              <CardContent className="p-8 h-80 flex flex-col justify-between relative">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative z-10">
                  <Leaf className="h-8 w-8 text-purple-600 dark:text-purple-400 mb-4" />
                </div>
                <div className="relative z-10">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Aromatherapy</h3>
                  <p className="text-gray-700 dark:text-gray-300 mb-4">Essential oil blends for relaxation and wellness</p>
                  <div className="flex items-center text-purple-600 dark:text-purple-400 font-semibold">
                    Shop Collection
                    <span className="ml-2 transform group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Seasonal Collection */}
            <Card className="group cursor-pointer overflow-hidden border-0 bg-gradient-to-br from-orange-100 to-red-100 dark:from-orange-900/30 dark:to-red-900/30 transition-all duration-300 hover:scale-105">
              <CardContent className="p-8 h-80 flex flex-col justify-between relative">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative z-10">
                  <Clock className="h-8 w-8 text-orange-600 dark:text-orange-400 mb-4" />
                </div>
                <div className="relative z-10">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Seasonal</h3>
                  <p className="text-gray-700 dark:text-gray-300 mb-4">Limited edition scents for every season</p>
                  <div className="flex items-center text-orange-600 dark:text-orange-400 font-semibold">
                    Shop Collection
                    <span className="ml-2 transform group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Luxury Collection */}
            <Card className="group cursor-pointer overflow-hidden border-0 bg-gradient-to-br from-amber-100 to-yellow-100 dark:from-amber-900/30 dark:to-yellow-900/30 transition-all duration-300 hover:scale-105">
              <CardContent className="p-8 h-80 flex flex-col justify-between relative">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-yellow-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative z-10">
                  <Star className="h-8 w-8 text-amber-600 dark:text-amber-400 mb-4" />
                </div>
                <div className="relative z-10">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Luxury</h3>
                  <p className="text-gray-700 dark:text-gray-300 mb-4">Premium wax blends with exotic fragrances</p>
                  <div className="flex items-center text-amber-600 dark:text-amber-400 font-semibold">
                    Shop Collection
                    <span className="ml-2 transform group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 lg:py-24 bg-orange-50 dark:bg-gray-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-16">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                Featured Products
              </h2>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Handpicked favorites from our artisan collection
              </p>
            </div>
            <Link href="/products">
              <Button variant="outline" className="hidden md:flex">
                View All Products →
              </Button>
            </Link>
          </div>

          {featuredLoading ? (
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-200 dark:bg-gray-700 rounded-2xl h-64 mb-4"></div>
                  <div className="bg-gray-200 dark:bg-gray-700 rounded h-4 mb-2"></div>
                  <div className="bg-gray-200 dark:bg-gray-700 rounded h-4 w-2/3"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {featuredProducts?.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Bestsellers */}
      <section className="py-16 lg:py-24 bg-white dark:bg-gray-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Customer Favorites
            </h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
              Most loved candles that bring warmth to any space
            </p>
          </div>

          {bestsellersLoading ? (
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-200 dark:bg-gray-700 rounded-2xl h-64 mb-4"></div>
                  <div className="bg-gray-200 dark:bg-gray-700 rounded h-4 mb-2"></div>
                  <div className="bg-gray-200 dark:bg-gray-700 rounded h-4 w-2/3"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {bestsellerProducts?.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 lg:py-24 bg-orange-50 dark:bg-gray-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Why Choose Lumient
            </h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
              Committed to quality, sustainability, and creating moments of joy
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="text-center group">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20 group-hover:bg-green-200 dark:group-hover:bg-green-800/30 transition-colors">
                <Leaf className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">100% Natural</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Made with pure soy wax and natural essential oils, free from harmful chemicals and toxins.
              </p>
            </div>

            <div className="text-center group">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900/20 group-hover:bg-orange-200 dark:group-hover:bg-orange-800/30 transition-colors">
                <Heart className="h-8 w-8 text-orange-600 dark:text-orange-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Handcrafted Quality</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Each candle is carefully hand-poured by skilled artisans with attention to every detail.
              </p>
            </div>

            <div className="text-center group">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/20 group-hover:bg-blue-200 dark:group-hover:bg-blue-800/30 transition-colors">
                <Truck className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Fast & Free Shipping</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Enjoy free shipping on orders over $50 with careful packaging to ensure perfect delivery.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 lg:py-24 bg-gradient-to-r from-orange-500 to-amber-500">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-8">
            <Mail className="mx-auto h-12 w-12 text-white/80 mb-6" />
            <h2 className="text-3xl font-bold text-white sm:text-4xl">
              Stay in the Glow
            </h2>
            <p className="mt-4 text-xl text-orange-100 max-w-2xl mx-auto">
              Subscribe to our newsletter for exclusive offers, new product launches, and candle care tips. Get 15% off your first order!
            </p>
          </div>
          
          <form onSubmit={handleNewsletterSubmit} className="max-w-md mx-auto">
            <div className="flex flex-col sm:flex-row gap-4">
              <Input
                type="email"
                name="email"
                placeholder="Enter your email address"
                className="flex-1 bg-white border-0 text-gray-900 placeholder-gray-500"
                required
              />
              <Button 
                type="submit"
                className="bg-white text-orange-600 hover:bg-gray-100 font-semibold whitespace-nowrap"
              >
                Subscribe
              </Button>
            </div>
            <p className="text-sm text-orange-100 mt-4">
              By subscribing, you agree to our privacy policy and terms of service.
            </p>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
            {/* Brand */}
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-2 mb-6">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-orange-400 to-orange-600 candle-glow">
                  <Flame className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold">Lumient</span>
              </div>
              <p className="text-gray-400 mb-6 max-w-md leading-relaxed">
                Illuminating homes with handcrafted candles that transform ordinary moments into extraordinary experiences. Each flame tells a story of warmth, comfort, and artisanal excellence.
              </p>
              <div className="flex space-x-4">
                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                  Facebook
                </Button>
                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                  Instagram
                </Button>
                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                  Twitter
                </Button>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-semibold text-lg mb-6">Quick Links</h3>
              <ul className="space-y-3">
                <li><Link href="/" className="text-gray-400 hover:text-white transition-colors">Home</Link></li>
                <li><Link href="/products" className="text-gray-400 hover:text-white transition-colors">Products</Link></li>
                <li><Button variant="ghost" size="sm" className="text-gray-400 hover:text-white p-0 h-auto">Collections</Button></li>
                <li><Button variant="ghost" size="sm" className="text-gray-400 hover:text-white p-0 h-auto">About Us</Button></li>
                <li><Button variant="ghost" size="sm" className="text-gray-400 hover:text-white p-0 h-auto">Contact</Button></li>
              </ul>
            </div>

            {/* Customer Care */}
            <div>
              <h3 className="font-semibold text-lg mb-6">Customer Care</h3>
              <ul className="space-y-3">
                <li><Button variant="ghost" size="sm" className="text-gray-400 hover:text-white p-0 h-auto">Shipping Info</Button></li>
                <li><Button variant="ghost" size="sm" className="text-gray-400 hover:text-white p-0 h-auto">Returns</Button></li>
                <li><Button variant="ghost" size="sm" className="text-gray-400 hover:text-white p-0 h-auto">FAQ</Button></li>
                <li><Button variant="ghost" size="sm" className="text-gray-400 hover:text-white p-0 h-auto">Size Guide</Button></li>
                <li><Button variant="ghost" size="sm" className="text-gray-400 hover:text-white p-0 h-auto">Care Instructions</Button></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between">
            <p className="text-gray-400 text-sm">
              © 2024 Lumient. All rights reserved. Crafted with ❤️ for candle lovers.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">Privacy Policy</Button>
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">Terms of Service</Button>
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">Cookie Policy</Button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
