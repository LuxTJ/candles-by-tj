import { PagesFunction } from "@cloudflare/workers-types";

interface Env {
  STRIPE_SECRET_KEY: string;
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const { items, customerEmail, successUrl, cancelUrl } = await request.json() as {
    items: Array<{ productName: string; price: number; quantity: number; scent: string; color: string }>;
    customerEmail: string;
    successUrl: string;
    cancelUrl: string;
  };

  const lineItems = items.map(item => ({
    price_data: {
      currency: "usd",
      product_data: {
        name: item.productName,
        description: `Scent: ${item.scent} | Color: ${item.color}`,
      },
      unit_amount: Math.round(item.price * 100),
    },
    quantity: item.quantity,
  }));

  const response = await fetch("https://api.stripe.com/v1/checkout/sessions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${env.STRIPE_SECRET_KEY}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      "payment_method_types[]": "card",
      "payment_method_types[]": "cashapp",
      "mode": "payment",
      "customer_email": customerEmail,
      "success_url": successUrl,
      "cancel_url": cancelUrl,
      ...Object.fromEntries(lineItems.flatMap((item, i) => [
        [`line_items[${i}][price_data][currency]`, item.price_data.currency],
        [`line_items[${i}][price_data][product_data][name]`, item.price_data.product_data.name],
        [`line_items[${i}][price_data][product_data][description]`, item.price_data.product_data.description],
        [`line_items[${i}][price_data][unit_amount]`, String(item.price_data.unit_amount)],
        [`line_items[${i}][quantity]`, String(item.quantity)],
      ])),
    }),
  });

  const session = await response.json() as { url: string; id: string };
  return Response.json({ url: session.url, sessionId: session.id });
};
