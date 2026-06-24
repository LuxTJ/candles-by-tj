import { useLocation } from "wouter";
import { useAdmin } from "@/lib/adminContext";
import { useSettings } from "@/lib/siteSettings";

export default function AdminDashboard() {
  const { logout } = useAdmin();
  const { resetSettings } = useSettings();
  const [, setLocation] = useLocation();

  const handleLogout = () => {
    logout();
    setLocation("/admin");
  };

  const cards = [
    { label: "Products", desc: "Edit names, prices, dimensions & weights", icon: "🕯️", path: "/admin/products" },
    { label: "Appearance", desc: "Change colors, hero image & banner", icon: "🎨", path: "/admin/appearance" },
    { label: "Content", desc: "Edit page text, footer & images", icon: "📝", path: "/admin/content" },
    { label: "Messages", desc: "View contact form submissions", icon: "💬", path: "/admin/messages" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#f9f9f9" }}>
      <div style={{ background: "#e8a0b0", padding: "1rem 2rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <img src="/images/logo.jpg" alt="Logo" style={{ width: "40px", height: "40px", objectFit: "contain" }} />
          <span style={{ fontWeight: 700, fontSize: "18px" }}>Admin Dashboard</span>
        </div>
        <div style={{ display: "flex", gap: "12px" }}>
          <button onClick={() => setLocation("/")} style={{ background: "white", color: "#111", border: "none", borderRadius: "9999px", padding: "8px 16px", fontSize: "13px", cursor: "pointer" }}>View Site</button>
          <button onClick={handleLogout} style={{ background: "#111", color: "white", border: "none", borderRadius: "9999px", padding: "8px 16px", fontSize: "13px", cursor: "pointer" }}>Log Out</button>
        </div>
      </div>

      <div style={{ maxWidth: "900px", margin: "3rem auto", padding: "0 2rem" }}>
        <h2 style={{ fontSize: "24px", fontWeight: 700, marginBottom: "0.5rem" }}>Welcome back!</h2>
        <p style={{ color: "#666", marginBottom: "2rem" }}>What would you like to manage today?</p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1.5rem" }}>
          {cards.map(({ label, desc, icon, path }) => (
            <button key={label} onClick={() => setLocation(path)} style={{ background: "white", border: "2px solid #e8a0b0", borderRadius: "12px", padding: "2rem", textAlign: "left", cursor: "pointer", transition: "box-shadow 0.2s" }}
              onMouseOver={(e) => (e.currentTarget.style.boxShadow = "0 4px 16px rgba(232,160,176,0.4)")}
              onMouseOut={(e) => (e.currentTarget.style.boxShadow = "none")}>
              <div style={{ fontSize: "36px", marginBottom: "12px" }}>{icon}</div>
              <div style={{ fontSize: "18px", fontWeight: 700, marginBottom: "6px" }}>{label}</div>
              <div style={{ fontSize: "13px", color: "#666" }}>{desc}</div>
            </button>
          ))}
        </div>

        <div style={{ marginTop: "2rem", textAlign: "right" }}>
          <button onClick={() => { if (confirm("Reset all settings to defaults?")) resetSettings(); }} style={{ background: "none", border: "1px solid #ddd", borderRadius: "8px", padding: "8px 16px", fontSize: "12px", color: "#999", cursor: "pointer" }}>
            Reset All Settings to Default
          </button>
        </div>
      </div>
    </div>
  );
}
