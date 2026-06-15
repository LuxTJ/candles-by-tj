import { PagesFunction } from "@cloudflare/workers-types";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { products } from "../../shared/schema";
import { eq } from "drizzle-orm";

interface Env {
  DATABASE_URL: string;
}

function getDb(env: Env) {
  const sql = neon(env.DATABASE_URL);
  return drizzle(sql);
}

export const onRequestGet: PagesFunction<Env> = async ({ env, params }) => {
  const db = getDb(env);

  const id = (params as any).id;

  if (id) {
    const [product] = await db.select().from(products).where(eq(products.id, Number(id)));
    if (!product) return new Response("Not found", { status: 404 });
    return Response.json(product);
  }

  const allProducts = await db.select().from(products).where(eq(products.inStock, true));
  return Response.json(allProducts);
};
