import { useState } from "react";
import { useLocation } from "wouter";
import { useSettings } from "@/lib/siteSettings";

export default function AdminProducts() {
  const { settings, updateProduct } = useSettings();
  const [, setLocation] = useLocation();
  const [editing, setEditing] = useState<number | null>(null);
  const [form, setForm] = useState({ name: "", price: "", dimensions: "", weight: "" });
  const [saved, setSaved] = useState<number | null>(null);

  const startEdit = (id: number) => {
    const p = settings.products.find((p) => p.id === id)!;
    setForm({ name: p.name, price: String(p.price), dimensions: p.dimensions, weight: p.weight });
    setEditing(id);
  };

  const saveEdit = () => {
    if (editing === null) return;
    updateProduct(editing, { name: form.name, price: parseFloat(form.price), dimensions: form.dimensions, weight: form.weight });
    setSaved(editing);
    setEditing(null);
    setTimeout(() => setSaved(null), 2000);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f9f9f9" }}>
      <div style={{ background: "#e8a0b0", padding: "1rem 2rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontWeight: 700, fontSize: "18px" }}>Manage Products</span>
        <button onClick={() => setLocation("/admin/dashboard")} style={{ background: "white", color: "#111", border: "none", borderRadius: "9999px", padding: "8px 16px", fontSize: "13px", cursor: "pointer" }}>← Back</button>
      </div>

      <div style={{ maxWidth: "900px", margin: "2rem auto", padding: "0 2rem" }}>
        {settings.products.map((product) => (
          <div key={product.id} style={{ background: "white", border: "1px solid #eee", borderRadius: "10px", padding: "1rem 1.25rem", marginBottom: "12px", display: "flex", gap: "1rem", alignItems: "center" }}>
            <img src={product.image} alt={product.name} style={{ width: "60px", height: "60px", objectFit: "cover", borderRadius: "6px", flexShrink: 0 }} />

            {editing === product.id ? (
              <div style={{ flex: 1, display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                <div>
                  <label style={{ fontSize: "11px", color: "#666" }}>Name</label>
                  <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} style={{ width: "100%", padding: "6px 8px", border: "1px solid #ddd", borderRadius: "6px", fontSize: "13px", boxSizing: "border-box" }} />
                </div>
                <div>
                  <label style={{ fontSize: "11px", color: "#666" }}>Price ($)</label>
                  <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} style={{ width: "100%", padding: "6px 8px", border: "1px solid #ddd", borderRadius: "6px", fontSize: "13px", boxSizing: "border-box" }} />
                </div>
                <div>
                  <label style={{ fontSize: "11px", color: "#666" }}>Dimensions</label>
                  <input value={form.dimensions} onChange={(e) => setForm({ ...form, dimensions: e.target.value })} style={{ width: "100%", padding: "6px 8px", border: "1px solid #ddd", borderRadius: "6px", fontSize: "13px", boxSizing: "border-box" }} />
                </div>
                <div>
                  <label style={{ fontSize: "11px", color: "#666" }}>Weight</label>
                  <input value={form.weight} onChange={(e) => setForm({ ...form, weight: e.target.value })} style={{ width: "100%", padding: "6px 8px", border: "1px solid #ddd", borderRadius: "6px", fontSize: "13px", boxSizing: "border-box" }} />
                </div>
                <div style={{ gridColumn: "span 2", display: "flex", gap: "8px", marginTop: "4px" }}>
                  <button onClick={saveEdit} style={{ background: "#e8a0b0", color: "#111", border: "none", borderRadius: "9999px", padding: "7px 20px", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}>Save</button>
                  <button onClick={() => setEditing(null)} style={{ background: "#f0f0f0", color: "#555", border: "none", borderRadius: "9999px", padding: "7px 20px", fontSize: "13px", cursor: "pointer" }}>Cancel</button>
                </div>
              </div>
            ) : (
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: "15px" }}>{product.name}</div>
                <div style={{ fontSize: "13px", color: "#555" }}>${product.price.toFixed(2)} &nbsp;|&nbsp; {product.dimensions} &nbsp;|&nbsp; {product.weight}</div>
                {saved === product.id && <div style={{ fontSize: "12px", color: "green", marginTop: "2px" }}>Saved!</div>}
              </div>
            )}

            {editing !== product.id && (
              <button onClick={() => startEdit(product.id)} style={{ background: "#f0f0f0", border: "none", borderRadius: "8px", padding: "7px 14px", fontSize: "13px", cursor: "pointer", flexShrink: 0 }}>Edit</button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
