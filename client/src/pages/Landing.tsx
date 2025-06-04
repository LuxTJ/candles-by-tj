import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Header } from "@/components/Header";
import { ProductCard } from "@/components/ProductCard";
import { ProductModal } from "@/components/ProductModal";
import { CartSidebar } from "@/components/CartSidebar";
import { useToast } from "@/hooks/use-toast";
import { Star, Leaf, Heart, Clock, Truck, Mail, Flame } from "lucide-react";
import type { Product } from "@shared/schema";

export default function Landing() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const { toast } = useToast();

  // Fetch featured products
  const { data: products = [], isLoading } = useQuery({
    queryKey: ["/api/products?featured=true"],
  });

  // Initialize products on first load
  useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/init-products", { method: "POST" });
      if (!response.ok) throw new Error("Failed to initialize products");
      return response.json();
    },
    onSuccess: () => {
      // Refresh products after initialization
      window.location.reload();
    },
  });

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail) {
      toast({
        title: "Success!",
        description: "Thank you for subscribing to our newsletter!",
      });
      setNewsletterEmail("");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-warm-50 dark:bg-gray-900">
        <Header cartCount={0} onCartClick={() => setIsCartOpen(true)} />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-warm-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <Header cartCount={0} onCartClick={() => setIsCartOpen(true)} />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-warm-100 via-primary-50 to-warm-200 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 overflow-hidden">
        <div className="absolute inset-0 bg-black/10 dark:bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in">
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight mb-6">
                Illuminate Your
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-warm-500"> Sacred Spaces</span>
              </h1>
              <p className="text-lg sm:text-xl text-gray-700 dark:text-gray-300 mb-8 leading-relaxed">
                Discover our collection of hand-poured, artisanal candles crafted with premium soy wax and natural fragrances. Each candle tells a story of warmth, comfort, and mindful living.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={() => window.location.href = "/api/login"}
                  className="bg-gradient-to-r from-primary-500 to-primary-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-primary-600 hover:to-primary-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
                >
                  Shop Now
                </button>
                <button className="border-2 border-primary-500 text-primary-600 dark:text-primary-400 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-primary-500 hover:text-white transition-all duration-200">
                  View Collections
                </button>
              </div>
            </div>
            <div className="relative">
              <img 
                src="https://pixabay.com/get/g21fe48abd4c1e5eb8a98dbf58d04b9f52a9e94f62a15ceaafd7dd0ad6269902f8a28241defe8f26d956edd9b7e9e0107b435ddbb1ce1b0dac4d2bb036a137211_1280.jpg" 
                alt="Beautiful handcrafted candles arranged in a cozy setting" 
                className="w-full h-96 lg:h-[500px] object-cover rounded-2xl shadow-2xl" 
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

      {/* Featured Categories */}
      <section className="py-16 lg:py-24 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-serif text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Explore Our Collections
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              From soy wax to beeswax, discover candles crafted for every mood and moment
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Aromatherapy Category */}
            <div className="group cursor-pointer">
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 p-8 h-80 flex flex-col justify-between transform group-hover:scale-105 transition-all duration-300">
                <img 
                  src="https://images.unsplash.com/photo-1544787219-7f47ccb76574?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300" 
                  alt="Aromatherapy candles with lavender and essential oils" 
                  className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:opacity-30 transition-opacity" 
                />
                <div className="relative z-10">
                  <Leaf className="w-8 h-8 text-purple-600 dark:text-purple-400 mb-4" />
                </div>
                <div className="relative z-10">
                  <h3 className="font-serif text-2xl font-bold text-gray-900 dark:text-white mb-2">Aromatherapy</h3>
                  <p className="text-gray-700 dark:text-gray-300 mb-4">Essential oil blends for relaxation and wellness</p>
                  <span className="text-purple-600 dark:text-purple-400 font-semibold flex items-center">
                    Shop Collection <span className="ml-2 transform group-hover:translate-x-1 transition-transform">→</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Seasonal Category */}
            <div className="group cursor-pointer">
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-100 to-red-100 dark:from-orange-900/30 dark:to-red-900/30 p-8 h-80 flex flex-col justify-between transform group-hover:scale-105 transition-all duration-300">
                <img 
                  src="https://images.unsplash.com/photo-1571781926291-c477ebfd024b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300" 
                  alt="Seasonal autumn candles with warm spices and colors" 
                  className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:opacity-30 transition-opacity" 
                />
                <div className="relative z-10">
                  <Flame className="w-8 h-8 text-orange-600 dark:text-orange-400 mb-4" />
                </div>
                <div className="relative z-10">
                  <h3 className="font-serif text-2xl font-bold text-gray-900 dark:text-white mb-2">Seasonal</h3>
                  <p className="text-gray-700 dark:text-gray-300 mb-4">Limited edition scents for every season</p>
                  <span className="text-orange-600 dark:text-orange-400 font-semibold flex items-center">
                    Shop Collection <span className="ml-2 transform group-hover:translate-x-1 transition-transform">→</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Luxury Category */}
            <div className="group cursor-pointer">
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-100 to-yellow-100 dark:from-amber-900/30 dark:to-yellow-900/30 p-8 h-80 flex flex-col justify-between transform group-hover:scale-105 transition-all duration-300">
                <img 
                  src="https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300" 
                  alt="Luxury candles with gold accents and elegant holders" 
                  className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:opacity-30 transition-opacity" 
                />
                <div className="relative z-10">
                  <Heart className="w-8 h-8 text-amber-600 dark:text-amber-400 mb-4" />
                </div>
                <div className="relative z-10">
                  <h3 className="font-serif text-2xl font-bold text-gray-900 dark:text-white mb-2">Luxury</h3>
                  <p className="text-gray-700 dark:text-gray-300 mb-4">Premium wax blends with exotic fragrances</p>
                  <span className="text-amber-600 dark:text-amber-400 font-semibold flex items-center">
                    Shop Collection <span className="ml-2 transform group-hover:translate-x-1 transition-transform">→</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 lg:py-24 bg-warm-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-serif text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Bestselling Candles
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Discover customer favorites that bring warmth and ambiance to any space
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((product: Product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={() => {
                  toast({
                    title: "Please log in",
                    description: "You need to log in to add items to your cart.",
                    action: (
                      <button 
                        onClick={() => window.location.href = "/api/login"}
                        className="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors"
                      >
                        Log In
                      </button>
                    ),
                  });
                }}
                onQuickView={() => setSelectedProduct(product)}
              />
            ))}
          </div>

          <div className="text-center mt-12">
            <button 
              onClick={() => window.location.href = "/api/login"}
              className="bg-white dark:bg-gray-900 border-2 border-primary-500 text-primary-600 dark:text-primary-400 px-8 py-3 rounded-xl font-semibold hover:bg-primary-500 hover:text-white transition-all duration-200"
            >
              View All Products
            </button>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 lg:py-24 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-serif text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Why Choose Lumient
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Every candle is crafted with passion, sustainability, and attention to detail that transforms your space into a sanctuary.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="w-16 h-16 mx-auto mb-6 p-4 bg-primary-100 dark:bg-primary-900/20 rounded-full group-hover:bg-primary-200 dark:group-hover:bg-primary-800/30 transition-colors duration-300">
                <Leaf className="w-8 h-8 text-primary-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Eco-Friendly</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Made with 100% natural soy wax and cotton wicks, our candles are biodegradable and burn cleanly without harmful toxins.
              </p>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16 mx-auto mb-6 p-4 bg-primary-100 dark:bg-primary-900/20 rounded-full group-hover:bg-primary-200 dark:group-hover:bg-primary-800/30 transition-colors duration-300">
                <Heart className="w-8 h-8 text-primary-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Handcrafted</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Each candle is lovingly hand-poured in small batches, ensuring consistent quality and unique character in every piece.
              </p>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16 mx-auto mb-6 p-4 bg-primary-100 dark:bg-primary-900/20 rounded-full group-hover:bg-primary-200 dark:group-hover:bg-primary-800/30 transition-colors duration-300">
                <Clock className="w-8 h-8 text-primary-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Long-Lasting</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Our premium wax blend provides up to 60 hours of burn time, giving you exceptional value and extended enjoyment.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 lg:py-24 bg-gradient-to-br from-primary-500 to-warm-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-8">
            <Mail className="w-12 h-12 mx-auto text-white/80 mb-6" />
            <h2 className="font-serif text-3xl lg:text-4xl font-bold text-white mb-4">
              Stay in the Glow
            </h2>
            <p className="text-lg text-white/90 max-w-2xl mx-auto">
              Subscribe to our newsletter for exclusive offers, new product launches, and candle care tips. Get 15% off your first order!
            </p>
          </div>
          
          <form onSubmit={handleNewsletterSubmit} className="max-w-md mx-auto">
            <div className="flex flex-col sm:flex-row gap-4">
              <input 
                type="email"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="Enter your email address" 
                className="flex-1 px-6 py-4 rounded-xl border-0 text-gray-900 placeholder-gray-500 focus:ring-4 focus:ring-white/20 outline-none"
                required
              />
              <button 
                type="submit"
                className="bg-white text-primary-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-colors whitespace-nowrap"
              >
                Subscribe
              </button>
            </div>
            <p className="text-sm text-white/80 mt-4">
              By subscribing, you agree to our privacy policy and terms of service.
            </p>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-2 mb-6">
                <div className="w-8 h-8 bg-gradient-to-br from-primary-400 to-primary-600 rounded-lg flex items-center justify-center">
                  <Flame className="w-5 h-5 text-white" />
                </div>
                <span className="font-serif font-bold text-xl">Lumient</span>
              </div>
              <p className="text-gray-400 mb-6 max-w-md leading-relaxed">
                Illuminating homes with handcrafted candles that transform ordinary moments into extraordinary experiences. Each flame tells a story of warmth, comfort, and artisanal excellence.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-semibold text-lg mb-6">Quick Links</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Home</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Products</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Collections</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>

            {/* Customer Care */}
            <div>
              <h3 className="font-semibold text-lg mb-6">Customer Care</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Shipping Info</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Returns</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">FAQ</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Size Guide</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Care Instructions</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between">
            <p className="text-gray-500 text-sm">
              © 2024 Lumient. All rights reserved. Crafted with ❤️ for candle lovers.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-500 hover:text-primary-400 text-sm transition-colors">Privacy Policy</a>
              <a href="#" className="text-gray-500 hover:text-primary-400 text-sm transition-colors">Terms of Service</a>
              <a href="#" className="text-gray-500 hover:text-primary-400 text-sm transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Product Modal */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={() => {
            toast({
              title: "Please log in",
              description: "You need to log in to add items to your cart.",
              action: (
                <button 
                  onClick={() => window.location.href = "/api/login"}
                  className="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors"
                >
                  Log In
                </button>
              ),
            });
          }}
        />
      )}

      {/* Cart Sidebar */}
      <CartSidebar
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={[]}
        onUpdateQuantity={() => {}}
        onRemoveItem={() => {}}
      />
    </div>
  );
}
