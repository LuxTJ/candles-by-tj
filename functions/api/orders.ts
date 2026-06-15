import { PagesFunction } from "@cloudflare/workers-types";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { orders } from "../../shared/schema";

interface Env {
  DATABASE_URL: string;
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const sql = neon(env.DATABASE_URL);
  const db = drizzle(sql);

  const body = (await request.json()) as {
    customerName: string;
    customerEmail: string;
    items: any[];
    subtotal: string;
    total: string;
    paymentMethod: string;
    paymentId: string;
    shippingAddress: any;
  };

  const [order] = await db
    .insert(orders)
    .values({
      customerName: body.customerName,
      customerEmail: body.customerEmail,
      items: body.items,
      subtotal: parseFloat(body.subtotal),
      total: parseFloat(body.total),
      paymentMethod: body.paymentMethod,
      paymentId: body.paymentId,
      shippingAddress: body.shippingAddress,
      status: "paid",
    })
    .returning();

  return Response.json(order, { status: 201 });
};
