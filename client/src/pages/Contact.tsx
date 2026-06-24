import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

export default function Contact() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const form = e.currentTarget;
    const data = new FormData(form);

    const res = await fetch("/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: data.get("name"),
        email: data.get("email"),
        subject: data.get("subject"),
        message: data.get("message"),
      }),
    });

    if (res.ok) {
      toast({ title: "Message sent!", description: "We'll get back to you soon." });
      form.reset();
    } else {
      toast({ title: "Error", description: "Please try again.", variant: "destructive" });
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-lg mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-center mb-4">Contact Us</h1>
        <p className="text-muted-foreground text-center mb-12">
          Have a question or custom order request? We'd love to hear from you!
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" name="name" required placeholder="Your name" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" required placeholder="your@email.com" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Input id="subject" name="subject" placeholder="Order question, custom request, etc." />
          </div>
          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea id="message" name="message" required rows={5} placeholder="Tell us how we can help..." />
          </div>
          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              background: "#e8a0b0",
              color: "#111",
              border: "none",
              borderRadius: "9999px",
              padding: "9px",
              fontSize: "15px",
              fontWeight: 500,
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? "Sending..." : "Send Message"}
          </button>
        </form>
      </main>

      <Footer />
    </div>
  );
}
