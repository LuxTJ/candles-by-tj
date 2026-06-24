interface Env { DB: D1Database; }

function cors(body: string, status = 200) {
  return new Response(body, {
    status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, PUT, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}

export const onRequestOptions = async () => cors("", 204);

export const onRequestGet: import("@cloudflare/workers-types").PagesFunction<Env> = async ({ env }) => {
  const { results } = await env.DB.prepare("SELECT key, value FROM settings").all();
  const settings: Record<string, string> = {};
  for (const row of results as any[]) settings[row.key] = row.value;
  return cors(JSON.stringify(settings));
};

export const onRequestPut: import("@cloudflare/workers-types").PagesFunction<Env> = async ({ env, request }) => {
  const updates = await request.json() as Record<string, string>;
  for (const [key, value] of Object.entries(updates)) {
    await env.DB.prepare(
      "INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value=excluded.value"
    ).bind(key, value).run();
  }
  return cors(JSON.stringify({ success: true }));
};
