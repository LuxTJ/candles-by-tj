import { useEffect, useState } from "react";
import { useLocation } from "wouter";

export default function AdminMessages() {
  const [, setLocation] = useLocation();
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/messages")
      .then((r) => r.json())
      .then(setMessages)
      .catch(() => setMessages([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "#f9f9f9" }}>
      <div style={{ background: "#e8a0b0", padding: "1rem 2rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontWeight: 700, fontSize: "18px" }}>Contact Messages</span>
        <button onClick={() => setLocation("/admin/dashboard")} style={{ background: "white", color: "#111", border: "none", borderRadius: "9999px", padding: "8px 16px", fontSize: "13px", cursor: "pointer" }}>Back</button>
      </div>

      <div style={{ maxWidth: "800px", margin: "2rem auto", padding: "0 2rem" }}>
        {loading ? (
          <p style={{ color: "#888", textAlign: "center" }}>Loading...</p>
        ) : messages.length === 0 ? (
          <div style={{ background: "white", borderRadius: "12px", padding: "3rem", textAlign: "center", border: "1px solid #eee" }}>
            <p style={{ color: "#888", fontSize: "15px" }}>No messages yet.</p>
            <p style={{ color: "#aaa", fontSize: "13px", marginTop: "8px" }}>Messages from your Contact page will appear here.</p>
          </div>
        ) : (
          messages.map((msg: any, i: number) => (
            <div key={i} style={{ background: "white", borderRadius: "10px", padding: "1.25rem", marginBottom: "12px", border: "1px solid #eee" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                <span style={{ fontWeight: 600 }}>{msg.name}</span>
                <span style={{ fontSize: "12px", color: "#888" }}>{new Date(msg.created_at).toLocaleString()}</span>
              </div>
              <div style={{ fontSize: "13px", color: "#555", marginBottom: "4px" }}>{msg.email}</div>
              {msg.subject && <div style={{ fontSize: "13px", color: "#555", marginBottom: "8px" }}>Subject: {msg.subject}</div>}
              <div style={{ fontSize: "14px", borderTop: "1px solid #f0f0f0", paddingTop: "8px" }}>{msg.message}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
