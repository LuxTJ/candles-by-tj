import { useState } from "react";
import { useLocation } from "wouter";
import { useSettings } from "@/lib/siteSettings";

export default function AdminContent() {
  const { settings, updateSettings } = useSettings();
  const [, setLocation] = useLocation();
  const [footerText, setFooterText] = useState(settings.footerText);
  const [meetImage, setMeetImage] = useState(settings.meetTheMakerImage);
  const [goodImage, setGoodImage] = useState(settings.goodToKnowImage);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    updateSettings({ footerText, meetTheMakerImage: meetImage, goodToKnowImage: goodImage });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f9f9f9" }}>
      <div style={{ background: "#e8a0b0", padding: "1rem 2rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontWeight: 700, fontSize: "18px" }}>Content Settings</span>
        <button onClick={() => setLocation("/admin/dashboard")} style={{ background: "white", color: "#111", border: "none", borderRadius: "9999px", padding: "8px 16px", fontSize: "13px", cursor: "pointer" }}>← Back</button>
      </div>

      <div style={{ maxWidth: "600px", margin: "2rem auto", padding: "0 2rem" }}>

        <div style={{ background: "white", borderRadius: "12px", padding: "1.5rem", marginBottom: "1.5rem", border: "1px solid #eee" }}>
          <h3 style={{ fontSize: "16px", fontWeight: 700, marginBottom: "1rem" }}>Footer Brand Name</h3>
          <input value={footerText} onChange={(e) => setFooterText(e.target.value)} style={{ width: "100%", padding: "10px 12px", border: "1px solid #ddd", borderRadius: "8px", fontSize: "14px", boxSizing: "border-box" }} />
        </div>

        <div style={{ background: "white", borderRadius: "12px", padding: "1.5rem", marginBottom: "1.5rem", border: "1px solid #eee" }}>
          <h3 style={{ fontSize: "16px", fontWeight: 700, marginBottom: "1rem" }}>Meet The Maker Image Path</h3>
          <input value={meetImage} onChange={(e) => setMeetImage(e.target.value)} placeholder="/images/meet-the-maker.jpg" style={{ width: "100%", padding: "10px 12px", border: "1px solid #ddd", borderRadius: "8px", fontSize: "14px", boxSizing: "border-box", marginBottom: "8px" }} />
          {meetImage && <img src={meetImage} alt="Preview" style={{ width: "100%", borderRadius: "8px", maxHeight: "150px", objectFit: "cover" }} />}
        </div>

        <div style={{ background: "white", borderRadius: "12px", padding: "1.5rem", marginBottom: "1.5rem", border: "1px solid #eee" }}>
          <h3 style={{ fontSize: "16px", fontWeight: 700, marginBottom: "1rem" }}>Good To Know Image Path</h3>
          <input value={goodImage} onChange={(e) => setGoodImage(e.target.value)} placeholder="/images/good-to-know.jpg" style={{ width: "100%", padding: "10px 12px", border: "1px solid #ddd", borderRadius: "8px", fontSize: "14px", boxSizing: "border-box", marginBottom: "8px" }} />
          {goodImage && <img src={goodImage} alt="Preview" style={{ width: "100%", borderRadius: "8px", maxHeight: "150px", objectFit: "cover" }} />}
        </div>

        <button onClick={handleSave} style={{ width: "100%", background: "#e8a0b0", color: "#111", border: "none", borderRadius: "9999px", padding: "12px", fontSize: "15px", fontWeight: 600, cursor: "pointer" }}>
          {saved ? "Saved!" : "Save Changes"}
        </button>
      </div>
    </div>
  );
}
