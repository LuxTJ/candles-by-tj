import { PagesFunction } from "@cloudflare/workers-types";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { orders } from "../../../shared/schema";

interface Env {
  STRIPE_WEBHOOK_SECRET: string;
  DATABASE_URL: string;
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const payload = await request.text();
  const sig = request.headers.get("stripe-signature")!;

  // Verify webhook signature using Web Crypto API
  const encoder = new TextEncoder();
  const [, ts] = sig.match(/t=(\d+)/) ?? [];
  const [, v1] = sig.match(/v1=([^,]+)/) ?? [];

  const key = await crypto.subtle.importKey(
    "raw", encoder.encode(env.STRIPE_WEBHOOK_SECRET),
    { name: "HMAC", hash: "SHA-256" }, false, ["sign"]
  );
  const expected = await crypto.subtle.sign("HMAC", key, encoder.encode(`${ts}.${payload}`));
  const expectedHex = Array.from(new Uint8Array(expected)).map(b => b.toString(16).padStart(2, "0")).join("");

  if (expectedHex !== v1) {
    return new Response("Invalid signature", { status: 400 });
  }

  const event = JSON.parse(payload);

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const sql = neon(env.DATABASE_URL);
    const db = drizzle(sql);

    await db.insert(orders).values({
      customerName: session.customer_details?.name ?? "Customer",
      customerEmail: session.customer_email,
      items: session.metadata?.items ? JSON.parse(session.metadata.items) : [],
      subtotal: String(session.amount_subtotal / 100),
      total: String(session.amount_total / 100),
      paymentMethod: "stripe",
      paymentId: session.payment_intent,
      status: "paid",
    });
  }

  return new Response("OK");
};
