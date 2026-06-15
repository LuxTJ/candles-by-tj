import { PagesFunction } from "@cloudflare/workers-types";
import { requireAdmin } from "./auth";

interface Env {
  PRODUCT_IMAGES: R2Bucket;
  ADMIN_PASSWORD: string;
  ADMIN_JWT_SECRET: string;
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  if (!(await requireAdmin(request, env))) {
    return new Response("Unauthorized", { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file") as File;
  if (!file) return new Response("No file", { status: 400 });

  const key = `${Date.now()}-${file.name}`;
  await env.PRODUCT_IMAGES.put(key, await file.arrayBuffer(), {
    httpMetadata: { contentType: file.type },
  });

  return Response.json({ url: `https://pub-candles-by-tj.r2.dev/${key}` });
};
