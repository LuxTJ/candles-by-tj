import { PagesFunction } from "@cloudflare/workers-types";

interface Env { DB: D1Database; }

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const body = await request.json() as {
    customerName: string;
    customerEmail: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    shippingMethod: string;
    shippingCost: number;
    items: Array<{ productName: string; price: number; quantity: number; scent: string; color: string }>;
    subtotal: number;
    total: number;
    paymentMethod: string;
    paymentId: string;
  };

  await env.DB.prepare(`
    INSERT INTO orders (customer_name, customer_email, address, city, state, zip, country,
      shipping_method, shipping_cost, items, subtotal, total, payment_method, payment_id, status)
    VALUES (?, ?, ?, ?, ?, ?, 'US', ?, ?, ?, ?, ?, ?, ?, 'paid')
  `).bind(
    body.customerName,
    body.customerEmail,
    body.address,
    body.city,
    body.state,
    body.zip,
    body.shippingMethod,
    body.shippingCost,
    JSON.stringify(body.items),
    body.subtotal,
    body.total,
    body.paymentMethod,
    body.paymentId,
  ).run();

  return Response.json({ success: true });
};

export const onRequestGet: PagesFunction<Env> = async ({ env }) => {
  const result = await env.DB.prepare(
    "SELECT * FROM orders ORDER BY created_at DESC"
  ).all();
  return Response.json(result.results);
};
