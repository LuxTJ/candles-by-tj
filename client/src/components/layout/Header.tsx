import { Link, useLocation } from "wouter";
import { useCart } from "@/lib/cartContext";

export function Header() {
  const [location] = useLocation();
  const { totalItems } = useCart();

  const nav = [
    { label: "Shop", href: "/" },
    { label: "Good To Know", href: "/good-to-know" },
    { label: "Meet The Maker", href: "/meet-the-maker" },
    { label: "Contact", href: "/contact" },
  ];

  return (
    <header style={{
      position: "sticky",
      top: 0,
      zIndex: 50,
      background: "white",
      borderBottom: "1px solid #111",
      padding: "0 2rem",
    }}>
      <div style={{
        maxWidth: "1200px",
        margin: "0 auto",
        height: "80px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}>
        <Link href="/">
          <img
            src="/images/logo.jpg"
            alt="Candles by TJ"
            style={{ width: "72px", height: "72px", cursor: "pointer", objectFit: "contain" }}
          />
        </Link>

        <nav style={{ display: "flex", gap: "2rem" }}>
          {nav.map(({ label, href }) => (
            <Link key={href} href={href}>
              <span style={{
                fontSize: "14px",
                color: location === href ? "#e8a0b0" : "#333",
                textDecoration: location === href ? "underline" : "none",
                cursor: "pointer",
                fontWeight: location === href ? 500 : 400,
              }}>
                {label}
              </span>
            </Link>
          ))}
        </nav>

        <Link href="/cart">
          <div style={{ position: "relative", cursor: "pointer" }}>
            <img
              src="/images/cart-icon.png"
              alt="Cart"
              style={{ width: "48px", height: "48px" }}
            />
            {totalItems > 0 && (
              <span style={{
                position: "absolute",
                top: "-6px",
                right: "-6px",
                background: "#e8a0b0",
                color: "white",
                borderRadius: "50%",
                width: "18px",
                height: "18px",
                fontSize: "11px",
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}>
                {totalItems}
              </span>
            )}
          </div>
        </Link>
      </div>
    </header>
  );
}
