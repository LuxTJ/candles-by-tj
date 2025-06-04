import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Sheet, 
  SheetContent, 
  SheetTrigger 
} from "@/components/ui/sheet";
import { 
  Search, 
  ShoppingBag, 
  Menu, 
  Sun, 
  Moon, 
  Flame, 
  User 
} from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
import { useCart } from "@/hooks/useCart";

export default function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { theme, toggleTheme } = useTheme();
  const { cartItems, toggleCart } = useCart();

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to search results
      console.log("Searching for:", searchQuery);
      setIsSearchOpen(false);
      setSearchQuery("");
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm border-b border-warm-200 dark:border-slate-700">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-warm-500 rounded-lg flex items-center justify-center animate-glow group-hover:animate-pulse">
              <Flame className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              Lumient
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              href="/" 
              className="text-gray-700 dark:text-gray-300 hover:text-primary transition-colors duration-200 font-medium"
            >
              Home
            </Link>
            <Link 
              href="/products" 
              className="text-gray-700 dark:text-gray-300 hover:text-primary transition-colors duration-200 font-medium"
            >
              Products
            </Link>
            <Link 
              href="/collections" 
              className="text-gray-700 dark:text-gray-300 hover:text-primary transition-colors duration-200 font-medium"
            >
              Collections
            </Link>
            <Link 
              href="/about" 
              className="text-gray-700 dark:text-gray-300 hover:text-primary transition-colors duration-200 font-medium"
            >
              About
            </Link>
            <Link 
              href="/contact" 
              className="text-gray-700 dark:text-gray-300 hover:text-primary transition-colors duration-200 font-medium"
            >
              Contact
            </Link>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <Sheet open={isSearchOpen} onOpenChange={setIsSearchOpen}>
              <SheetTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="text-gray-600 dark:text-gray-300 hover:text-primary transition-colors duration-200"
                >
                  <Search className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="top" className="h-auto">
                <div className="max-w-2xl mx-auto py-8">
                  <form onSubmit={handleSearch} className="flex space-x-4">
                    <Input
                      placeholder="Search candles, scents, collections..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="flex-1 text-lg h-12"
                      autoFocus
                    />
                    <Button type="submit" size="lg">
                      Search
                    </Button>
                  </form>
                </div>
              </SheetContent>
            </Sheet>

            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="text-gray-600 dark:text-gray-300 hover:text-primary transition-colors duration-200"
            >
              {theme === "light" ? (
                <Moon className="w-5 h-5" />
              ) : (
                <Sun className="w-5 h-5" />
              )}
            </Button>

            {/* User Account */}
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-600 dark:text-gray-300 hover:text-primary transition-colors duration-200"
            >
              <User className="w-5 h-5" />
            </Button>

            {/* Cart */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleCart}
              className="relative text-gray-600 dark:text-gray-300 hover:text-primary transition-colors duration-200"
            >
              <ShoppingBag className="w-5 h-5" />
              {totalItems > 0 && (
                <Badge className="absolute -top-2 -right-2 bg-primary text-white h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                  {totalItems}
                </Badge>
              )}
            </Button>

            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden text-gray-600 dark:text-gray-300"
                >
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <div className="flex flex-col space-y-6 mt-6">
                  <Link 
                    href="/" 
                    className="text-lg font-medium text-gray-900 dark:text-white hover:text-primary transition-colors"
                  >
                    Home
                  </Link>
                  <Link 
                    href="/products" 
                    className="text-lg font-medium text-gray-900 dark:text-white hover:text-primary transition-colors"
                  >
                    Products
                  </Link>
                  <Link 
                    href="/collections" 
                    className="text-lg font-medium text-gray-900 dark:text-white hover:text-primary transition-colors"
                  >
                    Collections
                  </Link>
                  <Link 
                    href="/about" 
                    className="text-lg font-medium text-gray-900 dark:text-white hover:text-primary transition-colors"
                  >
                    About
                  </Link>
                  <Link 
                    href="/contact" 
                    className="text-lg font-medium text-gray-900 dark:text-white hover:text-primary transition-colors"
                  >
                    Contact
                  </Link>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>
    </header>
  );
}
