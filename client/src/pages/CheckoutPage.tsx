import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useCart } from "@/lib/cartContext";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

const ACCENT = "#e8a0b0";
const BTN = {
  width: "100%",
  background: ACCENT,
  color: "#111",
  border: "none",
  borderRadius: "9999px",
  padding: "13px",
  fontSize: "15px",
  fontWeight: 500 as const,
  cursor: "pointer",
  marginBottom: "10px",
};

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const [, setLocation] = useLocation();
  const [paypalClientId, setPaypalClientId] = useState<string | null>(null);
  const [shippingMethod, setShippingMethod] = useState<"standard" | "express">("standard");
  const [formValid, setFormValid] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: "", email: "", address: "", city: "", state: "", zip: "",
  });

  const subtotal = totalPrice;
  const freeStandard = subtotal >= 75;
  const shippingCost = shippingMethod === "express" ? 12.99 : freeStandard ? 0 : 5.99;
  const total = subtotal + shippingCost;

  useEffect(() => {
    fetch("/api/config").then(r => r.json()).then((d: { paypalClientId: string }) => setPaypalClientId(d.paypalClientId));
  }, []);

  useEffect(() => {
    const { name, email, address, city, state, zip } = form;
    setFormValid(Boolean(name && email && address && city && state && zip));
  }, [form]);

  if (items.length === 0) {
    return (
      <div style={{ minHeight: "100vh", background: "white" }}>
        <Header />
        <div style={{ textAlign: "center", padding: "6rem 2rem" }}>
          <p style={{ color: "#666", marginBottom: "1.5rem" }}>Your cart is empty.</p>
          <button onClick={() => setLocation("/")} style={{ ...BTN, width: "auto", padding: "12px 28px" }}>
            Shop Now
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  const handleField = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const paypalCreateOrder = async () => {
    const res = await fetch("/api/checkout/paypal", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: items.map(i => ({ productName: i.name, price: i.price, quantity: i.quantity, scent: i.scent, color: i.color })),
        shipping: form,
        shippingMethod,
        shippingCost,
      }),
    });
    const data = await res.json() as { orderId: string };
    return data.orderId;
  };

  const paypalOnApprove = async (data: { orderID: string }) => {
    setSubmitting(true);
    const capture = await fetch("/api/checkout/paypal", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId: data.orderID }),
    }).then(r => r.json()) as Record<string, unknown>;

    await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customerName: form.name,
        customerEmail: form.email,
        address: form.address,
        city: form.city,
        state: form.state,
        zip: form.zip,
        shippingMethod,
        shippingCost,
        items: items.map(i => ({ productName: i.name, price: i.price, quantity: i.quantity, scent: i.scent, color: i.color })),
        subtotal,
        total,
        paymentMethod: "paypal",
        paymentId: data.orderID,
      }),
    });

    clearCart();
    setLocation("/order-success");
  };

  const handleStripe = async () => {
    if (!formValid) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/checkout/stripe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map(i => ({ productName: i.name, price: i.price, quantity: i.quantity, scent: i.scent, color: i.color })),
          customerEmail: form.email,
          successUrl: `${window.location.origin}/order-success`,
          cancelUrl: `${window.location.origin}/checkout`,
          shippingMethod,
        }),
      });
      const session = await res.json() as { url: string };
      if (session.url) window.location.href = session.url;
    } finally {
      setSubmitting(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "10px 14px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    fontSize: "14px",
    fontFamily: "inherit",
    boxSizing: "border-box",
    marginTop: "6px",
  };
  const labelStyle: React.CSSProperties = { fontSize: "13px", fontWeight: 500, display: "block" };

  return (
    <div style={{ minHeight: "100vh", background: "white" }}>
      <Header />
      <div style={{ maxWidth: "680px", margin: "0 auto", padding: "3rem 2rem" }}>
        <h1 style={{ fontSize: "28px", fontWeight: 600, marginBottom: "2rem" }}>Checkout</h1>

        {/* Order Summary */}
        <section style={{ marginBottom: "2rem" }}>
          <h2 style={{ fontSize: "16px", fontWeight: 600, marginBottom: "1rem", borderBottom: "1px solid #f0f0f0", paddingBottom: "8px" }}>Order Summary</h2>
          {items.map(item => (
            <div key={item.id} style={{ display: "flex", justifyContent: "space-between", fontSize: "14px", marginBottom: "8px" }}>
              <span>{item.name} × {item.quantity} <span style={{ color: "#888" }}>({item.scent} / {item.color})</span></span>
              <span>${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
        </section>

        {/* Shipping Method */}
        <section style={{ marginBottom: "2rem" }}>
          <h2 style={{ fontSize: "16px", fontWeight: 600, marginBottom: "1rem", borderBottom: "1px solid #f0f0f0", paddingBottom: "8px" }}>Shipping Method</h2>
          {(["standard", "express"] as const).map(method => {
            const cost = method === "express" ? 12.99 : freeStandard ? 0 : 5.99;
            const label = method === "express"
              ? "Express Shipping (2–3 business days) — $12.99"
              : freeStandard
                ? "Free Standard Shipping (5–7 business days)"
                : "Standard Shipping (5–7 business days) — $5.99";
            return (
              <label key={method} style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px", cursor: "pointer", fontSize: "14px" }}>
                <input type="radio" name="shippingMethod" value={method} checked={shippingMethod === method} onChange={() => setShippingMethod(method)} />
                {label}
              </label>
            );
          })}
        </section>

        {/* Price Breakdown */}
        <section style={{ background: "#fafafa", borderRadius: "10px", padding: "1rem 1.25rem", marginBottom: "2rem", fontSize: "14px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
            <span>Subtotal</span><span>${subtotal.toFixed(2)}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
            <span>Shipping</span><span>{shippingCost === 0 ? "Free" : `$${shippingCost.toFixed(2)}`}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 600, borderTop: "1px solid #eee", paddingTop: "8px", marginTop: "4px", fontSize: "15px" }}>
            <span>Total</span><span>${total.toFixed(2)}</span>
          </div>
        </section>

        {/* Shipping Address */}
        <section style={{ marginBottom: "2rem" }}>
          <h2 style={{ fontSize: "16px", fontWeight: 600, marginBottom: "1rem", borderBottom: "1px solid #f0f0f0", paddingBottom: "8px" }}>Shipping Address</h2>
          <div style={{ display: "grid", gap: "14px" }}>
            <div>
              <label style={labelStyle}>Full Name *</label>
              <input name="name" value={form.name} onChange={handleField} required style={inputStyle} placeholder="Jane Smith" />
            </div>
            <div>
              <label style={labelStyle}>Email *</label>
              <input name="email" type="email" value={form.email} onChange={handleField} required style={inputStyle} placeholder="jane@example.com" />
            </div>
            <div>
              <label style={labelStyle}>Street Address *</label>
              <input name="address" value={form.address} onChange={handleField} required style={inputStyle} placeholder="123 Main St" />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 80px 100px", gap: "10px" }}>
              <div>
                <label style={labelStyle}>City *</label>
                <input name="city" value={form.city} onChange={handleField} required style={inputStyle} placeholder="City" />
              </div>
              <div>
                <label style={labelStyle}>State *</label>
                <input name="state" value={form.state} onChange={handleField} required style={inputStyle} placeholder="TX" maxLength={2} />
              </div>
              <div>
                <label style={labelStyle}>ZIP *</label>
                <input name="zip" value={form.zip} onChange={handleField} required style={inputStyle} placeholder="75001" />
              </div>
            </div>
          </div>
        </section>

        {/* Payment */}
        <section>
          <h2 style={{ fontSize: "16px", fontWeight: 600, marginBottom: "1rem", borderBottom: "1px solid #f0f0f0", paddingBottom: "8px" }}>Payment</h2>

          {!formValid && (
            <p style={{ fontSize: "13px", color: "#888", marginBottom: "1rem" }}>
              Please fill in your shipping address to enable payment options.
            </p>
          )}

          {/* Stripe */}
          <button
            onClick={handleStripe}
            disabled={!formValid || submitting}
            style={{ ...BTN, opacity: (!formValid || submitting) ? 0.5 : 1, cursor: (!formValid || submitting) ? "not-allowed" : "pointer" }}
          >
            {submitting ? "Processing..." : "Pay with Card (Stripe)"}
          </button>

          {/* PayPal */}
          {formValid && paypalClientId && (
            <PayPalScriptProvider options={{ clientId: paypalClientId, currency: "USD" }}>
              <PayPalButtons
                disabled={submitting}
                style={{ layout: "horizontal", color: "gold", shape: "pill", height: 44 }}
                createOrder={paypalCreateOrder}
                onApprove={paypalOnApprove}
                onError={(err) => { console.error("PayPal error", err); setSubmitting(false); }}
              />
            </PayPalScriptProvider>
          )}

          {formValid && !paypalClientId && (
            <div style={{ textAlign: "center", padding: "12px", color: "#888", fontSize: "13px" }}>Loading PayPal...</div>
          )}
        </section>
      </div>
      <Footer />
    </div>
  );
}
