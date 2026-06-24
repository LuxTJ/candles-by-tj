interface Env { DB: D1Database; }

function cors(body: string, status = 200) {
  return new Response(body, {
    status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}

export const onRequestOptions = async () => cors("", 204);

export const onRequestGet: import("@cloudflare/workers-types").PagesFunction<Env> = async ({ env }) => {
  const { results } = await env.DB.prepare(
    "SELECT * FROM messages ORDER BY created_at DESC"
  ).all();
  return cors(JSON.stringify(results));
};

export const onRequestPost: import("@cloudflare/workers-types").PagesFunction<Env> = async ({ env, request }) => {
  const { name, email, subject, message } = await request.json() as any;
  await env.DB.prepare(
    "INSERT INTO messages (name, email, subject, message, created_at) VALUES (?, ?, ?, ?, ?)"
  ).bind(name, email, subject || "", message, new Date().toISOString()).run();
  return cors(JSON.stringify({ success: true }));
};
