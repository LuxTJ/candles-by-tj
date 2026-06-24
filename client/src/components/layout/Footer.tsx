import { Link } from "wouter";

export function Footer() {
  const currentYear = new Date().getFullYear();

  const socials = [
    {
      label: "Facebook",
      href: "https://www.facebook.com/candlesbytj",
      color: "#1877F2",
      icon: (
        <svg viewBox="0 0 24 24" fill="white" width="20" height="20">
          <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.514c-1.491 0-1.956.93-1.956 1.886v2.268h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/>
        </svg>
      ),
    },
    {
      label: "Instagram",
      href: "https://www.instagram.com/candlesbytj_",
      color: "#E1306C",
      icon: (
        <svg viewBox="0 0 24 24" fill="white" width="20" height="20">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
        </svg>
      ),
    },
    {
      label: "TikTok",
      href: "https://www.tiktok.com/@candlesbytj",
      color: "#010101",
      icon: (
        <svg viewBox="0 0 24 24" fill="white" width="20" height="20">
          <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.34 6.34 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.74a4.85 4.85 0 01-1.01-.05z"/>
        </svg>
      ),
    },
    {
      label: "Lemon8",
      href: "https://www.lemon8-app.com/@candlesbytj",
      color: "transparent",
      icon: null,
    },
  ];

  return (
    <footer style={{ background: "#e8a0b0", borderTop: "1px solid #d4899a" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "2rem", textAlign: "center" }}>
        <p style={{ color: "#111", fontSize: "20px", margin: "0 0 12px", fontWeight: 600 }}>
          Candles by TJ
        </p>

        <div style={{ display: "flex", justifyContent: "center", gap: "2rem", marginBottom: "16px" }}>
          <Link href="/"><span style={{ color: "#111", fontSize: "13px", cursor: "pointer" }}>Shop</span></Link>
          <Link href="/good-to-know"><span style={{ color: "#111", fontSize: "13px", cursor: "pointer" }}>Good To Know</span></Link>
          <Link href="/meet-the-maker"><span style={{ color: "#111", fontSize: "13px", cursor: "pointer" }}>Meet The Maker</span></Link>
          <Link href="/contact"><span style={{ color: "#111", fontSize: "13px", cursor: "pointer" }}>Contact</span></Link>
        </div>

        {/* Social Icons */}
        <div style={{ display: "flex", justifyContent: "center", gap: "14px", marginBottom: "16px", alignItems: "center" }}>
          {socials.map(({ label, href, color, icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              title={label}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                background: color,
                textDecoration: "none",
                flexShrink: 0,
                overflow: "hidden",
              }}
            >
              {label === "Lemon8" ? (
                <img src="/images/lemon8.jpg" alt="Lemon8" style={{ width: "40px", height: "40px", objectFit: "cover", borderRadius: "50%" }} />
              ) : icon}
            </a>
          ))}
        </div>

        <p style={{ color: "#111", fontSize: "12px", margin: 0 }}>
          &copy; {currentYear} Candles by TJ. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
