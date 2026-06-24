import { Link } from "wouter";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useCart } from "@/lib/cartContext";

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalPrice, clearCart } = useCart();

  return (
    <div style={{ minHeight: "100vh", background: "white" }}>
      <Header />

      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "3rem 2rem" }}>
        <h1 style={{ fontSize: "28px", fontWeight: 600, marginBottom: "2rem" }}>Your Cart</h1>

        {items.length === 0 ? (
          <div style={{ textAlign: "center", padding: "4rem 0" }}>
            <p style={{ color: "#666", marginBottom: "1.5rem" }}>Your cart is empty.</p>
            <Link href="/">
              <button style={{
                background: "#e8a0b0",
                color: "#111",
                border: "none",
                borderRadius: "9999px",
                padding: "12px 28px",
                fontSize: "14px",
                fontWeight: 500,
                cursor: "pointer",
              }}>
                Continue Shopping
              </button>
            </Link>
          </div>
        ) : (
          <>
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", marginBottom: "2rem" }}>
              {items.map((item) => (
                <div key={item.id} style={{
                  display: "flex",
                  gap: "1.5rem",
                  alignItems: "center",
                  borderBottom: "1px solid #f0f0f0",
                  paddingBottom: "1.5rem",
                }}>
                  <img
                    src={item.image}
                    alt={item.name}
                    style={{ width: "90px", height: "90px", objectFit: "cover", borderRadius: "8px", flexShrink: 0 }}
                  />
                  <div style={{ flex: 1 }}>
                    <p style={{ fontWeight: 500, margin: "0 0 4px" }}>{item.name}</p>
                    <p style={{ fontSize: "13px", color: "#666", margin: "0 0 2px" }}>Scent: {item.scent}</p>
                    <p style={{ fontSize: "13px", color: "#666", margin: "0 0 12px" }}>Color: {item.color}</p>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        style={{ width: "28px", height: "28px", borderRadius: "50%", border: "1px solid #ddd", background: "white", cursor: "pointer", fontSize: "16px" }}
                      >−</button>
                      <span style={{ fontSize: "14px", fontWeight: 500 }}>{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        style={{ width: "28px", height: "28px", borderRadius: "50%", border: "1px solid #ddd", background: "white", cursor: "pointer", fontSize: "16px" }}
                      >+</button>
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <p style={{ fontWeight: 600, marginBottom: "8px" }}>${(item.price * item.quantity).toFixed(2)}</p>
                    <button
                      onClick={() => removeItem(item.id)}
                      style={{ fontSize: "12px", color: "#999", background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ borderTop: "2px solid #f0f0f0", paddingTop: "1.5rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1.5rem" }}>
                <span style={{ fontSize: "18px", fontWeight: 600 }}>Total</span>
                <span style={{ fontSize: "18px", fontWeight: 600 }}>${totalPrice.toFixed(2)}</span>
              </div>
              <button style={{
                width: "100%",
                background: "#e8a0b0",
                color: "#111",
                border: "none",
                borderRadius: "9999px",
                padding: "14px",
                fontSize: "15px",
                fontWeight: 500,
                cursor: "pointer",
                marginBottom: "12px",
              }}>
                Proceed to Checkout
              </button>
              <Link href="/">
                <button style={{
                  width: "100%",
                  background: "white",
                  color: "#666",
                  border: "1px solid #ddd",
                  borderRadius: "9999px",
                  padding: "14px",
                  fontSize: "15px",
                  cursor: "pointer",
                }}>
                  Continue Shopping
                </button>
              </Link>
            </div>
          </>
        )}
      </div>

      <Footer />
    </div>
  );
}
