import { PagesFunction } from "@cloudflare/workers-types";

interface Env {
  STRIPE_SECRET_KEY: string;
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const { items, customerEmail, successUrl, cancelUrl, shippingMethod } = await request.json() as {
    items: Array<{ productName: string; price: number; quantity: number; scent: string; color: string }>;
    customerEmail: string;
    successUrl: string;
    cancelUrl: string;
    shippingMethod: "standard" | "express";
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

  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const standardFree = subtotal >= 75;

  const shippingOptions = [
    {
      display_name: standardFree ? "Free Standard Shipping (5–7 days)" : "Standard Shipping (5–7 days)",
      amount: standardFree ? "0" : "599",
      id: "standard",
    },
    {
      display_name: "Express Shipping (2–3 days)",
      amount: "1299",
      id: "express",
    },
  ];

  const params = new URLSearchParams({
    "mode": "payment",
    "customer_email": customerEmail,
    "success_url": successUrl,
    "cancel_url": cancelUrl,
    "shipping_address_collection[allowed_countries][]": "US",
    "billing_address_collection": "auto",
  });

  ["card", "cashapp"].forEach((method) => params.append("payment_method_types[]", method));

  lineItems.forEach((item, i) => {
    params.append(`line_items[${i}][price_data][currency]`, item.price_data.currency);
    params.append(`line_items[${i}][price_data][product_data][name]`, item.price_data.product_data.name);
    params.append(`line_items[${i}][price_data][product_data][description]`, item.price_data.product_data.description);
    params.append(`line_items[${i}][price_data][unit_amount]`, String(item.price_data.unit_amount));
    params.append(`line_items[${i}][quantity]`, String(item.quantity));
  });

  shippingOptions.forEach((opt, i) => {
    params.append(`shipping_options[${i}][shipping_rate_data][type]`, "fixed_amount");
    params.append(`shipping_options[${i}][shipping_rate_data][display_name]`, opt.display_name);
    params.append(`shipping_options[${i}][shipping_rate_data][fixed_amount][amount]`, opt.amount);
    params.append(`shipping_options[${i}][shipping_rate_data][fixed_amount][currency]`, "usd");
    params.append(`shipping_options[${i}][shipping_rate_data][delivery_estimate][minimum][unit]`, "business_day");
    params.append(`shipping_options[${i}][shipping_rate_data][delivery_estimate][minimum][value]`, opt.id === "express" ? "2" : "5");
    params.append(`shipping_options[${i}][shipping_rate_data][delivery_estimate][maximum][unit]`, "business_day");
    params.append(`shipping_options[${i}][shipping_rate_data][delivery_estimate][maximum][value]`, opt.id === "express" ? "3" : "7");
  });

  const response = await fetch("https://api.stripe.com/v1/checkout/sessions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${env.STRIPE_SECRET_KEY}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params,
  });

  const session = await response.json() as { url: string; id: string };
  return Response.json({ url: session.url, sessionId: session.id });
};
