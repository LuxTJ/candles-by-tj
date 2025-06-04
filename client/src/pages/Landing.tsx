import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useTheme } from "@/components/ThemeProvider";
import { Flame, Sun, Moon, Search, ShoppingBag, Star, Leaf, Heart, Clock, Truck, Mail, Facebook, Instagram, Twitter } from "lucide-react";

export default function Landing() {
  const { theme, setTheme } = useTheme();
  const [email, setEmail] = useState("");

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const handleNewsletterSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      // Newsletter signup logic would go here
      setEmail("");
      // Show success message
    }
  };

  const handleLogin = () => {
    window.location.href = "/api/login";
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-orange-500 rounded-lg flex items-center justify-center candle-glow">
                <Flame className="w-5 h-5 text-white animate-flicker" />
              </div>
              <span className="text-2xl font-bold warm-text-gradient">Lumient</span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#home" className="text-muted-foreground hover:text-primary transition-colors">Home</a>
              <a href="#products" className="text-muted-foreground hover:text-primary transition-colors">Products</a>
              <a href="#collections" className="text-muted-foreground hover:text-primary transition-colors">Collections</a>
              <a href="#about" className="text-muted-foreground hover:text-primary transition-colors">About</a>
              <a href="#contact" className="text-muted-foreground hover:text-primary transition-colors">Contact</a>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon">
                <Search className="w-5 h-5" />
              </Button>
              
              <Button variant="ghost" size="icon" onClick={toggleTheme}>
                {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </Button>
              
              <Button variant="ghost" size="icon">
                <ShoppingBag className="w-5 h-5" />
                <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center text-xs">3</Badge>
              </Button>

              <Button onClick={handleLogin} className="warm-gradient text-white hover:opacity-90">
                Sign In
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-orange-500/10" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                  Handcrafted
                  <span className="warm-text-gradient block">Luminous</span>
                  Moments
                </h1>
                <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-2xl">
                  Transform your space with our premium collection of artisanal candles, each carefully crafted to create the perfect ambiance for every moment.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  className="warm-gradient text-white hover:opacity-90 candle-glow-hover"
                  onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Shop Collection
                </Button>
                <Button variant="outline" size="lg">
                  Our Story
                </Button>
              </div>
            </div>
            
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1571781926291-c477ebfd024b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
                alt="Elegant candle collection" 
                className="rounded-2xl shadow-2xl w-full candle-glow" 
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
      <section id="collections" className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Collections</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Curated collections for every mood and occasion
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Zen & Relaxation",
                description: "Calming scents for mindful moments",
                image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
                badge: "Popular"
              },
              {
                title: "Seasonal Favorites",
                description: "Limited editions for special times",
                image: "https://images.unsplash.com/photo-1576020799627-aeac74d58064?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
                badge: "New"
              },
              {
                title: "Luxury Line",
                description: "Premium candles for discerning tastes",
                image: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
                badge: "Premium"
              }
            ].map((collection, index) => (
              <Card key={index} className="group overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="relative overflow-hidden">
                  <img 
                    src={collection.image} 
                    alt={collection.title}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <Badge className="absolute top-4 left-4">{collection.badge}</Badge>
                  <div className="absolute bottom-6 left-6 text-white">
                    <h3 className="text-2xl font-bold mb-2">{collection.title}</h3>
                    <p className="text-gray-200 mb-3">{collection.description}</p>
                    <Button variant="secondary" size="sm">
                      Explore Collection
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section id="products" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-2">Featured Products</h2>
              <p className="text-muted-foreground">Handpicked favorites from our artisan collection</p>
            </div>
            <Button variant="outline" className="hidden md:block">
              View All Products →
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                name: "Vanilla Dreams",
                description: "Sweet vanilla with hints of caramel",
                price: "$24.99",
                originalPrice: "$29.99",
                rating: 5,
                reviews: 124,
                image: "https://images.unsplash.com/photo-1602874801006-47f0a17605f7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
                badge: "Best Seller"
              },
              {
                name: "Forest Whisper",
                description: "Cedar, pine, and earthy moss",
                price: "$32.99",
                rating: 4,
                reviews: 89,
                image: "https://images.unsplash.com/photo-1571781926291-c5c655e48af8?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400"
              },
              {
                name: "Lavender Serenity",
                description: "Pure lavender with chamomile",
                price: "$24.99",
                rating: 5,
                reviews: 256,
                image: "https://images.unsplash.com/photo-1586985289906-406988974504?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
                badge: "Popular"
              },
              {
                name: "Midnight Ember",
                description: "Smoky sandalwood and amber",
                price: "$36.99",
                rating: 4,
                reviews: 67,
                image: "https://images.unsplash.com/photo-1602874800355-ef8a8beff9b8?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
                badge: "New"
              }
            ].map((product, index) => (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 overflow-hidden">
                <div className="relative overflow-hidden">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 right-4">
                    <Button variant="ghost" size="icon" className="bg-background/80 backdrop-blur-sm hover:text-red-500">
                      <Heart className="w-4 h-4" />
                    </Button>
                  </div>
                  {product.badge && (
                    <Badge className="absolute top-4 left-4">{product.badge}</Badge>
                  )}
                </div>
                
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Relaxation</span>
                    <div className="flex items-center">
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`w-4 h-4 ${i < product.rating ? 'fill-current' : ''}`} />
                        ))}
                      </div>
                      <span className="text-sm text-muted-foreground ml-1">({product.reviews})</span>
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{product.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-primary">{product.price}</span>
                      {product.originalPrice && (
                        <span className="text-sm text-muted-foreground line-through">{product.originalPrice}</span>
                      )}
                    </div>
                    <Button className="warm-gradient text-white hover:opacity-90">
                      Add to Cart
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button variant="outline" size="lg">
              View All Products
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="about" className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose Lumient</h2>
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
                icon: Truck,
                title: "Fast & Free Shipping",
                description: "Enjoy free shipping on orders over $50 with careful packaging to ensure perfect delivery."
              }
            ].map((feature, index) => (
              <div key={index} className="text-center group">
                <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-orange-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-20 warm-gradient relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-8">
            <Mail className="w-12 h-12 mx-auto text-white/80 mb-6" />
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              Stay in the Glow
            </h2>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Subscribe to our newsletter for exclusive offers, new product launches, and candle care tips. Get 15% off your first order!
            </p>
          </div>
          
          <form onSubmit={handleNewsletterSignup} className="max-w-md mx-auto">
            <div className="flex flex-col sm:flex-row gap-4">
              <Input 
                type="email" 
                placeholder="Enter your email address" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 bg-white/90 border-0 text-foreground placeholder:text-muted-foreground"
                required
              />
              <Button 
                type="submit" 
                className="bg-white text-primary hover:bg-white/90 font-semibold"
              >
                Subscribe
              </Button>
            </div>
            <p className="text-sm text-white/80 mt-4">
              By subscribing, you agree to our privacy policy and terms of service.
            </p>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-2 mb-6">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-orange-500 rounded-lg flex items-center justify-center">
                  <Flame className="w-5 h-5 text-white" />
                </div>
                <span className="text-2xl font-bold warm-text-gradient">Lumient</span>
              </div>
              <p className="text-muted-foreground mb-6 max-w-md leading-relaxed">
                Illuminating homes with handcrafted candles that transform ordinary moments into extraordinary experiences. Each flame tells a story of warmth, comfort, and artisanal excellence.
              </p>
              <div className="flex space-x-4">
                <Button variant="ghost" size="icon">
                  <Facebook className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Instagram className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Twitter className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-semibold text-lg mb-6">Quick Links</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Home</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Products</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Collections</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">About Us</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Contact</a></li>
              </ul>
            </div>

            {/* Customer Care */}
            <div>
              <h3 className="font-semibold text-lg mb-6">Customer Care</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Shipping Info</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Returns</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Size Guide</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Care Instructions</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">FAQ</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-muted-foreground text-sm">
              © 2024 Lumient. All rights reserved. Crafted with ❤️ for candle lovers.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-muted-foreground hover:text-primary text-sm transition-colors">Privacy Policy</a>
              <a href="#" className="text-muted-foreground hover:text-primary text-sm transition-colors">Terms of Service</a>
              <a href="#" className="text-muted-foreground hover:text-primary text-sm transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
