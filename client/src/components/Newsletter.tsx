import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Mail } from "lucide-react";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const { toast } = useToast();

  const subscribeNews = useMutation({
    mutationFn: async (email: string) => {
      const response = await apiRequest("POST", "/api/newsletter/subscribe", { email });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Successfully subscribed!",
        description: "Thank you for subscribing to our newsletter. Get ready for exclusive offers and candle care tips!",
      });
      setEmail("");
    },
    onError: (error: any) => {
      toast({
        title: "Subscription failed",
        description: error.message || "Failed to subscribe to newsletter. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast({
        title: "Email required",
        description: "Please enter your email address.",
        variant: "destructive",
      });
      return;
    }

    subscribeNews.mutate(email.trim());
  };

  return (
    <section className="py-16 lg:py-24 bg-gradient-to-br from-amber-500 to-orange-500 relative overflow-hidden">
      <div className="absolute inset-0 bg-black/10"></div>
      <div className="relative container-responsive text-center">
        <div className="mb-8">
          <Mail className="mx-auto h-12 w-12 text-white/80 mb-6" />
          <h2 className="font-serif text-3xl lg:text-4xl font-bold text-white mb-4">
            Stay in the Glow
          </h2>
          <p className="text-lg text-white/90 max-w-2xl mx-auto">
            Subscribe to our newsletter for exclusive offers, new product launches, and candle care tips. Get 15% off your first order!
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="max-w-md mx-auto">
          <div className="flex flex-col sm:flex-row gap-4">
            <Input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 px-6 py-4 rounded-xl border-0 text-gray-900 placeholder-gray-500 focus:ring-4 focus:ring-white/20"
              disabled={subscribeNews.isPending}
            />
            <Button
              type="submit"
              className="bg-white text-amber-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-colors whitespace-nowrap"
              disabled={subscribeNews.isPending}
            >
              {subscribeNews.isPending ? "Subscribing..." : "Subscribe"}
            </Button>
          </div>
          <p className="text-sm text-white/80 mt-4">
            By subscribing, you agree to our privacy policy and terms of service.
          </p>
        </form>
      </div>
    </section>
  );
}
