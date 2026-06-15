import { PagesFunction } from "@cloudflare/workers-types";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { products } from "../../../shared/schema";
import { eq } from "drizzle-orm";
import { requireAdmin } from "./auth";

interface Env {
  DATABASE_URL: string;
  ADMIN_PASSWORD: string;
  ADMIN_JWT_SECRET: string;
}

export const onRequest: PagesFunction<Env> = async ({ request, env, params }) => {
  if (!(await requireAdmin(request, env))) {
    return new Response("Unauthorized", { status: 401 });
  }

  const db = drizzle(neon(env.DATABASE_URL));
  const id = (params as any).id;

  if (request.method === "GET") {
    const all = await db.select().from(products);
    return Response.json(all);
  }

  if (request.method === "POST") {
    const body = await request.json();
    const [product] = await db.insert(products).values(body as any).returning();
    return Response.json(product, { status: 201 });
  }

  if (request.method === "PUT" && id) {
    const body = await request.json();
    const [product] = await db
      .update(products)
      .set(body as any)
      .where(eq(products.id, Number(id)))
      .returning();
    return Response.json(product);
  }

  if (request.method === "DELETE" && id) {
    await db.delete(products).where(eq(products.id, Number(id)));
    return new Response(null, { status: 204 });
  }

  return new Response("Method not allowed", { status: 405 });
};
