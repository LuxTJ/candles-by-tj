import { PagesFunction } from "@cloudflare/workers-types";

interface Env { PAYPAL_CLIENT_ID: string; }

export const onRequestGet: PagesFunction<Env> = async ({ env }) => {
  return Response.json({ paypalClientId: env.PAYPAL_CLIENT_ID ?? "" });
};
