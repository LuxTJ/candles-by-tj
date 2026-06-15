import { useState } from "react";
import { useLocation } from "wouter";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/hooks/useCart";
import { apiRequest } from "@/lib/queryClient";
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";

const PAYPAL_CLIENT_ID = import.meta.env.VITE_PAYPAL_CLIENT_ID;

export default function CheckoutPage() {
  const { cart } = useCart();
  const [, navigate] = useLocation();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "", email: "", line1: "", city: "", state: "", zip: "", country: "US",
  });

  async function handleStripeCheckout() {
    setLoading(true);
    const res = await apiRequest("POST", "/api/checkout/stripe", {
      items: cart.items,
      customerEmail: form.email,
      successUrl: `${window.location.origin}/checkout?success=true`,
      cancelUrl: `${window.location.origin}/checkout`,
    });
    const { url } = await res.json();
    window.location.href = url;
  }

  const success = new URLSearchParams(window.location.search).get("success");

  if (success) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="max-w-lg mx-auto px-4 py-24 text-center">
          <div className="text-6xl mb-6">🕯️</div>
          <h1 className="text-3xl font-bold mb-4">Thank You!</h1>
          <p className="text-muted-foreground mb-8">Your order has been placed. You'll receive a confirmation email shortly.</p>
          <Button onClick={() => navigate("/")}>Continue Shopping</Button>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="max-w-2xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>

        <div className="space-y-6">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Contact Information</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Address</Label>
              <Input placeholder="Street address" value={form.line1} onChange={e => setForm({...form, line1: e.target.value})} />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <Input placeholder="City" value={form.city} onChange={e => setForm({...form, city: e.target.value})} />
              <Input placeholder="State" value={form.state} onChange={e => setForm({...form, state: e.target.value})} />
              <Input placeholder="ZIP" value={form.zip} onChange={e => setForm({...form, zip: e.target.value})} />
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <h2 className="text-xl font-semibold">Order Total: ${cart.total.toFixed(2)}</h2>
          </div>

          <div className="space-y-3">
            <Button className="w-full" onClick={handleStripeCheckout} disabled={loading || !form.email || !form.name}>
              {loading ? "Redirecting..." : "Pay with Card or Cash App Pay"}
            </Button>

            <PayPalScriptProvider options={{ clientId: PAYPAL_CLIENT_ID, enableFunding: "venmo", currency: "USD" }}>
              <PayPalButtons
                style={{ layout: "vertical", label: "paypal" }}
                createOrder={async () => {
                  const res = await apiRequest("POST", "/api/checkout/paypal", { items: cart.items });
                  const { orderId } = await res.json();
                  return orderId;
                }}
                onApprove={async (data) => {
                  await apiRequest("PUT", "/api/checkout/paypal", { orderId: data.orderID });
                  navigate("/checkout?success=true");
                }}
              />
            </PayPalScriptProvider>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
