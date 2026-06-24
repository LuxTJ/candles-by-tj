import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ProductCard } from "@/components/products/ProductCard";
import { products } from "@/lib/products";

export default function Home() {
  return (
    <div style={{ minHeight: "100vh", background: "white" }}>
<Header />

      {/* Hero */}
      <div style={{ background: "#e8a0b0", padding: "2rem" }}>
        <div style={{
          maxWidth: "700px",
          margin: "0 auto",
          borderRadius: "12px",
          background: "white",
          border: "4px solid #e8a0b0",
          overflow: "hidden",
        }}>
          <img
            src="/images/banner.png"
            alt="Luxury Designer Candles"
            style={{ width: "100%", display: "block" }}
          />
        </div>
      </div>

      {/* Products Grid */}
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "3rem 2rem" }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "2.5rem",
        }}>
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}
