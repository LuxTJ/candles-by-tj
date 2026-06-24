import { useState } from "react";
import { useLocation } from "wouter";
import { useAdmin } from "@/lib/adminContext";

export default function AdminLogin() {
  const { login } = useAdmin();
  const [, setLocation] = useLocation();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const success = await login(password);
    if (success) {
      setLocation("/admin/dashboard");
    } else {
      setError("Incorrect password.");
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f9f9f9", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ background: "white", borderRadius: "12px", padding: "2.5rem", width: "100%", maxWidth: "380px", boxShadow: "0 4px 24px rgba(0,0,0,0.08)", border: "2px solid #e8a0b0" }}>
        <img src="/images/logo.jpg" alt="Logo" style={{ width: "64px", height: "64px", display: "block", margin: "0 auto 1rem", objectFit: "contain" }} />
        <h1 style={{ textAlign: "center", fontSize: "22px", fontWeight: 700, marginBottom: "0.25rem" }}>Admin Panel</h1>
        <p style={{ textAlign: "center", fontSize: "13px", color: "#888", marginBottom: "1.5rem" }}>Candles by TJ</p>
        <form onSubmit={handleSubmit}>
          <label style={{ fontSize: "13px", fontWeight: 500, display: "block", marginBottom: "4px" }}>Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ width: "100%", padding: "10px 12px", border: "1px solid #ddd", borderRadius: "8px", fontSize: "14px", marginBottom: "6px", boxSizing: "border-box" }} />
          {error && <p style={{ color: "red", fontSize: "12px", marginBottom: "12px" }}>{error}</p>}
          <button type="submit" disabled={loading} style={{ width: "100%", background: "#e8a0b0", color: "#111", border: "none", borderRadius: "9999px", padding: "11px", fontSize: "14px", fontWeight: 600, cursor: loading ? "not-allowed" : "pointer", marginTop: "8px", opacity: loading ? 0.7 : 1 }}>
            {loading ? "Logging in..." : "Log In"}
          </button>
        </form>
      </div>
    </div>
  );
}
