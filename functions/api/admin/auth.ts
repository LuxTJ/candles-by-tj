import { PagesFunction } from "@cloudflare/workers-types";

interface Env {
  ADMIN_PASSWORD: string;
  ADMIN_JWT_SECRET: string;
}

async function createToken(secret: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const payload = btoa(JSON.stringify({ exp: Date.now() + 86400000 }));
  const sig = await crypto.subtle.sign("HMAC", key, encoder.encode(payload));
  return `${payload}.${btoa(String.fromCharCode(...new Uint8Array(sig)))}`;
}

async function verifyToken(token: string, secret: string): Promise<boolean> {
  try {
    const [payload, sig] = token.split(".");
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      "raw",
      encoder.encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"]
    );
    const sigBytes = Uint8Array.from(atob(sig), (c) => c.charCodeAt(0));
    const valid = await crypto.subtle.verify("HMAC", key, sigBytes, encoder.encode(payload));
    if (!valid) return false;
    const { exp } = JSON.parse(atob(payload));
    return Date.now() < exp;
  } catch {
    return false;
  }
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const { password } = (await request.json()) as { password: string };

  if (password !== env.ADMIN_PASSWORD) {
    return new Response("Unauthorized", { status: 401 });
  }

  const token = await createToken(env.ADMIN_JWT_SECRET);
  const res = new Response(JSON.stringify({ success: true }), {
    headers: { "Content-Type": "application/json" },
  });
  res.headers.set("Set-Cookie", `admin_token=${token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=86400`);
  return res;
};

export async function requireAdmin(request: Request, env: Env): Promise<boolean> {
  const cookie = request.headers.get("Cookie") || "";
  const match = cookie.match(/admin_token=([^;]+)/);
  if (!match) return false;
  return verifyToken(match[1], env.ADMIN_JWT_SECRET);
}
