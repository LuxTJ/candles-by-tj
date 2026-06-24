import { useState } from "react";
import { useLocation } from "wouter";
import { useSettings } from "@/lib/siteSettings";

export default function AdminAppearance() {
  const { settings, updateSettings } = useSettings();
  const [, setLocation] = useLocation();
  const [saved, setSaved] = useState(false);
  const [color, setColor] = useState(settings.accentColor);
  const [heroImage, setHeroImage] = useState(settings.heroImage);

  const handleSave = () => {
    updateSettings({ accentColor: color, heroImage });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const presetColors = ["#e8a0b0", "#f4c2c2", "#c8a2c8", "#b0c4de", "#98d8c8", "#f0d0a0", "#d4a0b0"];

  const heroOptions = [
    { label: "Banner Image", value: "/images/banner.png" },
    { label: "Good To Know Image", value: "/images/good-to-know.jpg" },
    { label: "Meet The Maker Image", value: "/images/meet-the-maker.jpg" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#f9f9f9" }}>
      <div style={{ background: "#e8a0b0", padding: "1rem 2rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontWeight: 700, fontSize: "18px" }}>Appearance Settings</span>
        <button onClick={() => setLocation("/admin/dashboard")} style={{ background: "white", color: "#111", border: "none", borderRadius: "9999px", padding: "8px 16px", fontSize: "13px", cursor: "pointer" }}>← Back</button>
      </div>

      <div style={{ maxWidth: "600px", margin: "2rem auto", padding: "0 2rem" }}>

        {/* Accent Color */}
        <div style={{ background: "white", borderRadius: "12px", padding: "1.5rem", marginBottom: "1.5rem", border: "1px solid #eee" }}>
          <h3 style={{ fontSize: "16px", fontWeight: 700, marginBottom: "1rem" }}>Accent Color</h3>
          <p style={{ fontSize: "13px", color: "#666", marginBottom: "1rem" }}>This controls buttons, borders, the footer, and header highlights.</p>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "1rem" }}>
            {presetColors.map((c) => (
              <button key={c} onClick={() => setColor(c)} style={{ width: "36px", height: "36px", borderRadius: "50%", background: c, border: color === c ? "3px solid #111" : "2px solid #ddd", cursor: "pointer" }} />
            ))}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <input type="color" value={color} onChange={(e) => setColor(e.target.value)} style={{ width: "48px", height: "36px", border: "1px solid #ddd", borderRadius: "6px", cursor: "pointer", padding: "2px" }} />
            <span style={{ fontSize: "13px", color: "#666" }}>Custom color: <strong>{color}</strong></span>
          </div>
          <div style={{ marginTop: "1rem", padding: "12px 20px", borderRadius: "9999px", background: color, display: "inline-block", fontSize: "14px", fontWeight: 500 }}>Preview Button</div>
        </div>

        {/* Hero Image */}
        <div style={{ background: "white", borderRadius: "12px", padding: "1.5rem", marginBottom: "1.5rem", border: "1px solid #eee" }}>
          <h3 style={{ fontSize: "16px", fontWeight: 700, marginBottom: "1rem" }}>Hero Banner Image</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "1rem" }}>
            {heroOptions.map(({ label, value }) => (
              <label key={value} style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}>
                <input type="radio" name="hero" checked={heroImage === value} onChange={() => setHeroImage(value)} />
                <span style={{ fontSize: "14px" }}>{label}</span>
              </label>
            ))}
          </div>
          <div style={{ marginBottom: "8px" }}>
            <label style={{ fontSize: "12px", color: "#666", display: "block", marginBottom: "4px" }}>Or enter custom image path (from /images/ folder):</label>
            <input value={heroImage} onChange={(e) => setHeroImage(e.target.value)} placeholder="/images/banner.png" style={{ width: "100%", padding: "8px 12px", border: "1px solid #ddd", borderRadius: "8px", fontSize: "13px", boxSizing: "border-box" }} />
          </div>
          {heroImage && <img src={heroImage} alt="Hero preview" style={{ width: "100%", borderRadius: "8px", marginTop: "8px", maxHeight: "150px", objectFit: "cover" }} />}
        </div>

        <button onClick={handleSave} style={{ width: "100%", background: "#e8a0b0", color: "#111", border: "none", borderRadius: "9999px", padding: "12px", fontSize: "15px", fontWeight: 600, cursor: "pointer" }}>
          {saved ? "Saved!" : "Save Changes"}
        </button>
      </div>
    </div>
  );
}
