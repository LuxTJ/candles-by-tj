import { Link } from "wouter";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default function OrderSuccessPage() {
  return (
    <div style={{ minHeight: "100vh", background: "white" }}>
      <Header />
      <div style={{ maxWidth: "560px", margin: "0 auto", padding: "6rem 2rem", textAlign: "center" }}>
        <div style={{ fontSize: "56px", marginBottom: "1rem" }}>🎀</div>
        <h1 style={{ fontSize: "28px", fontWeight: 600, marginBottom: "1rem" }}>Order Confirmed!</h1>
        <p style={{ color: "#555", lineHeight: 1.7, marginBottom: "2rem" }}>
          Thank you for your order! You'll receive a confirmation email shortly. Your luxury candle will be crafted with care and shipped to you soon.
        </p>
        <Link href="/">
          <button style={{
            background: "#e8a0b0",
            color: "#111",
            border: "none",
            borderRadius: "9999px",
            padding: "13px 32px",
            fontSize: "15px",
            fontWeight: 500,
            cursor: "pointer",
          }}>
            Continue Shopping
          </button>
        </Link>
      </div>
      <Footer />
    </div>
  );
}
