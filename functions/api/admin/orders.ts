import { PagesFunction } from "@cloudflare/workers-types";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { orders } from "../../../shared/schema";
import { desc } from "drizzle-orm";
import { requireAdmin } from "./auth";

interface Env {
  DATABASE_URL: string;
  ADMIN_PASSWORD: string;
  ADMIN_JWT_SECRET: string;
}

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  if (!(await requireAdmin(request, env))) {
    return new Response("Unauthorized", { status: 401 });
  }

  const db = drizzle(neon(env.DATABASE_URL));
  const allOrders = await db.select().from(orders).orderBy(desc(orders.createdAt));
  return Response.json(allOrders);
};
