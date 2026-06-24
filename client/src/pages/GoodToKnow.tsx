import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default function GoodToKnow() {
  return (
    <div style={{ minHeight: "100vh", background: "white" }}>
      <Header />

      <main style={{ maxWidth: "900px", margin: "0 auto", padding: "3rem 2rem" }}>
        <img
          src="/images/good-to-know.jpg"
          alt="Good To Know"
          style={{ width: "100%", display: "block", borderRadius: "12px" }}
        />
      </main>

      <Footer />
    </div>
  );
}
