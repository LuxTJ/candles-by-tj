import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faqs = [
  {
    question: "What's That Frost on My Pillar Candle?",
    answer: "At Little Luxuries, we believe beauty includes a few quirks. If you notice a white, frosty layer on your candle — don't worry. It's not a flaw. It's a characteristic of our natural wax blend. Frosting is a crystal-like bloom that can appear on the surface of natural wax candles. It happens when the wax tries to return to its original form. It's actually a good sign — a clue you're getting the real deal: a clean-burning, hand-poured, high-quality candle made with natural waxes.",
  },
  {
    question: "Will Frosting Affect My Candle?",
    answer: "Not one bit. Frosting is 100% cosmetic. Your candle will still burn beautifully and fill your space with the same luxurious fragrance and glow you expect from us.",
  },
  {
    question: "Can I Fix the Frosting?",
    answer: "Absolutely! If you prefer a smoother look, try one of these quick tricks: Gently warm the surface with a hair dryer or heat gun, holding it 6–8 inches away. The frost will vanish like magic. Buff lightly with a soft cloth to restore a bit of shine. Pro tip: Don't overdo it — just enough heat to warm, not melt.",
  },
  {
    question: "How do I care for my candle?",
    answer: "Trim the wick to ¼ inch before each burn. Allow the wax to melt to the edges on the first burn to prevent tunneling. Never burn for more than 4 hours at a time. Keep away from drafts, children, and pets. Never leave a burning candle unattended.",
  },
  {
    question: "How long will my candle burn?",
    answer: "Burn time varies by size. Each product listing includes the weight so you can estimate burn time — generally 7–9 hours per ounce of wax for natural wax candles.",
  },
  {
    question: "Can I customize my candle?",
    answer: "Yes! Every candle is available in your choice of scent and color. Select your preferences on the product page before adding to cart.",
  },
  {
    question: "What is your shipping policy?",
    answer: "Orders are processed within 3–5 business days. Shipping times vary by location. You will receive a tracking number once your order ships.",
  },
  {
    question: "What is your return policy?",
    answer: "Due to the handmade and customized nature of our candles, all sales are final. If your order arrives damaged, please contact us within 48 hours with photos and we will make it right.",
  },
];

export default function GoodToKnow() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-3xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-center mb-4">Good To Know</h1>
        <p className="text-muted-foreground text-center mb-12">
          Everything you need to know about your Candles by TJ purchase.
        </p>

        <Accordion type="single" collapsible className="space-y-2">
          {faqs.map((faq, i) => (
            <AccordionItem key={i} value={`item-${i}`} className="border rounded-lg px-4">
              <AccordionTrigger className="text-left font-medium hover:text-primary">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </main>

      <Footer />
    </div>
  );
}
