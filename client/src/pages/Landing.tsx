import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Flame, ArrowRight, Users, ShoppingBag, Star } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";

export default function Landing() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-orange-500 rounded-lg flex items-center justify-center animate-glow">
                <Flame className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-bold text-foreground">Little Luxury Candles</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="text-muted-foreground hover:text-foreground"
              >
                {theme === 'light' ? '🌙' : '☀️'}
              </Button>
              
              <Button asChild>
                <a href="/api/login">Sign In</a>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-amber-50 to-orange-50 dark:from-slate-800 dark:to-slate-900">
        <div className="absolute inset-0 bg-black/5 dark:bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 text-primary animate-flicker">
                <Flame className="w-6 h-6" />
                <span className="text-sm font-medium">Handcrafted with Love</span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                Discover the Art of
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-500 block">
                  Handcrafted Candles
                </span>
              </h1>
              
              <p className="text-xl text-muted-foreground leading-relaxed">
                Transform your space with our premium collection of artisanal candles. 
                Each candle is carefully hand-poured with natural wax and essential oils 
                to create the perfect ambiance for every moment.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="animate-glow" asChild>
                  <a href="/api/login">
                    Start Shopping
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </a>
                </Button>
                <Button variant="outline" size="lg">
                  Learn More
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

      {/* Features Section */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Why Candle Lovers Choose Little Luxury Candles
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Experience the difference of premium, handcrafted candles made with care and attention to detail
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: "🌿",
                title: "100% Natural",
                description: "Made with pure natural wax and essential oils, free from harmful chemicals and toxins."
              },
              {
                icon: "🤲",
                title: "Handcrafted Quality", 
                description: "Each candle is carefully hand-poured by skilled artisans with attention to every detail."
              },
              {
                icon: "🚚",
                title: "Fast & Free Shipping",
                description: "Enjoy free shipping on orders over $50 with careful packaging to ensure perfect delivery."
              }
            ].map((feature, index) => (
              <Card key={index} className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-8">
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-16 lg:py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-8">
              Trusted by Candle Enthusiasts Worldwide
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Users className="w-8 h-8 text-primary mr-2" />
                  <span className="text-3xl font-bold text-foreground">50K+</span>
                </div>
                <p className="text-muted-foreground">Happy Customers</p>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <ShoppingBag className="w-8 h-8 text-primary mr-2" />
                  <span className="text-3xl font-bold text-foreground">100K+</span>
                </div>
                <p className="text-muted-foreground">Candles Sold</p>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Star className="w-8 h-8 text-primary mr-2" />
                  <span className="text-3xl font-bold text-foreground">4.9</span>
                </div>
                <p className="text-muted-foreground">Average Rating</p>
              </div>
            </div>

            <Button size="lg" className="animate-glow" asChild>
              <a href="/api/login">
                Join Our Community
                <ArrowRight className="w-4 h-4 ml-2" />
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-orange-500 rounded-lg flex items-center justify-center">
                  <Flame className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">Lumient</span>
              </div>
              <p className="text-gray-400 mb-6">
                Creating beautiful moments with handcrafted candles that illuminate your space and uplift your spirit.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Collections</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Gift Cards</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Customer Care</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Shipping Info</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Returns</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Size Guide</a></li>
                <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Lumient. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
