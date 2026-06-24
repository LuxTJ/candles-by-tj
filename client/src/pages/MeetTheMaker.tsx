import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default function MeetTheMaker() {
  return (
    <div style={{ minHeight: "100vh", background: "white" }}>
      <Header />

      <main style={{ maxWidth: "900px", margin: "0 auto", padding: "3rem 2rem" }}>
        <img
          src="/images/meet-the-maker.jpg"
          alt="Meet The Maker"
          style={{ width: "100%", display: "block", borderRadius: "12px", filter: "contrast(1.1) saturate(1.05) brightness(1.02)" }}
        />
      </main>

      <Footer />
    </div>
  );
}
