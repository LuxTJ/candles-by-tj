interface Env { ADMIN_PASSWORD: string; }

export const onRequestPost: import("@cloudflare/workers-types").PagesFunction<Env> = async ({ env, request }) => {
  const { password } = await request.json() as { password: string };
  const valid = password === env.ADMIN_PASSWORD;
  return new Response(JSON.stringify({ success: valid }), {
    status: valid ? 200 : 401,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
};

export const onRequestOptions = async () =>
  new Response(null, { status: 204, headers: { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Methods": "POST, OPTIONS", "Access-Control-Allow-Headers": "Content-Type" } });
