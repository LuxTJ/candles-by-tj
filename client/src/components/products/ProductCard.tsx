import { useState } from "react";
import { useCart } from "@/lib/cartContext";
import type { Product } from "@/lib/products";

export function ProductCard({ product }: { product: Product }) {
  const [scent, setScent] = useState(product.scents[0]);
  const [color, setColor] = useState(product.colors[0]);
  const [added, setAdded] = useState(false);
  const { addItem } = useCart();

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      scent,
      color,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <img
        src={product.image}
        alt={product.name}
        style={{
          width: "100%",
          aspectRatio: "1 / 1",
          objectFit: "cover",
          borderRadius: "8px",
          marginBottom: "12px",
          display: "block",
        }}
      />

      <p style={{ margin: "0 0 4px", fontSize: "15px", fontWeight: 500, color: "#111" }}>
        {product.name}
      </p>
      <p style={{ margin: "0 0 4px", fontSize: "14px", color: "#444" }}>
        ${product.price.toFixed(2)}
      </p>
      <p style={{ margin: "0 0 4px", fontSize: "11px", color: "#888" }}>
        {product.dimensions}
      </p>
      <p style={{ margin: "0 0 12px", fontSize: "11px", color: "#888" }}>
        {product.weight}
      </p>

      <label style={{ fontSize: "12px", color: "#666", marginBottom: "4px" }}>Scent</label>
      <select
        value={scent}
        onChange={(e) => setScent(e.target.value)}
        style={{
          marginBottom: "10px",
          padding: "8px 10px",
          border: "1px solid #ddd",
          borderRadius: "6px",
          fontSize: "13px",
          background: "white",
          cursor: "pointer",
          width: "100%",
        }}
      >
        {product.scents.map((s) => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>

      <label style={{ fontSize: "12px", color: "#666", marginBottom: "4px" }}>Color</label>
      <select
        value={color}
        onChange={(e) => setColor(e.target.value)}
        style={{
          marginBottom: "14px",
          padding: "8px 10px",
          border: "1px solid #ddd",
          borderRadius: "6px",
          fontSize: "13px",
          background: "white",
          cursor: "pointer",
          width: "100%",
        }}
      >
        {product.colors.map((c) => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>

      <button
        onClick={handleAddToCart}
        style={{
          background: added ? "#d4899a" : "#e8a0b0",
          color: "#111",
          border: "none",
          borderRadius: "9999px",
          padding: "12px",
          fontSize: "14px",
          fontWeight: 500,
          cursor: "pointer",
          width: "100%",
          transition: "background 0.2s",
        }}
      >
        {added ? "Added!" : "Add to Cart"}
      </button>
    </div>
  );
}
