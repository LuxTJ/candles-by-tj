import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default function MeetTheMaker() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-center mb-12">Meet The Maker</h1>

        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="flex-shrink-0">
            <div className="w-64 h-64 rounded-full overflow-hidden border-4 border-primary p-1 bg-primary">
              <img
                src="/meet-the-maker.jpg"
                alt="Tjuana - Founder of Candles by TJ"
                className="w-full h-full rounded-full object-cover"
              />
            </div>
          </div>

          <div className="text-center md:text-left space-y-4">
            <h2 className="text-2xl font-semibold text-primary">Hi, I'm Tjuana</h2>
            <p className="text-muted-foreground leading-relaxed">
              Inspired by the elegance and sophistication of designer brands, I set out to create
              luxury-inspired candles at affordable prices. My vision was to empower individuals
              to express their unique aesthetic and elevate their everyday lives.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Little Luxuries is more than just a brand — it's a lifestyle. We believe everyone
              deserves to feel confident and beautiful, regardless of their budget. Our commitment
              to transforming your living space sets us apart.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Join us on a journey to discover affordable luxury and add a touch of elegance to your world!
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
