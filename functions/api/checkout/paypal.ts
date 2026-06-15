import { PagesFunction } from "@cloudflare/workers-types";

interface Env {
  PAYPAL_CLIENT_ID: string;
  PAYPAL_CLIENT_SECRET: string;
}

async function getAccessToken(env: Env): Promise<string> {
  const auth = btoa(`${env.PAYPAL_CLIENT_ID}:${env.PAYPAL_CLIENT_SECRET}`);
  const res = await fetch("https://api-m.paypal.com/v1/oauth2/token", {
    method: "POST",
    headers: { "Authorization": `Basic ${auth}`, "Content-Type": "application/x-www-form-urlencoded" },
    body: "grant_type=client_credentials",
  });
  const data = await res.json() as { access_token: string };
  return data.access_token;
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const { items } = await request.json() as {
    items: Array<{ productName: string; price: number; quantity: number }>;
  };

  const token = await getAccessToken(env);
  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0).toFixed(2);

  const res = await fetch("https://api-m.paypal.com/v2/checkout/orders", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      intent: "CAPTURE",
      purchase_units: [{
        amount: { currency_code: "USD", value: total },
        description: "Candles by TJ Order",
      }],
      payment_source: {
        paypal: {
          experience_context: {
            payment_method_preference: "IMMEDIATE_PAYMENT_REQUIRED",
            brand_name: "Candles by TJ",
            locale: "en-US",
            landing_page: "LOGIN",
            user_action: "PAY_NOW",
          }
        }
      }
    }),
  });

  const order = await res.json() as { id: string };
  return Response.json({ orderId: order.id });
};

// Capture payment after PayPal approval
export const onRequestPut: PagesFunction<Env> = async ({ request, env }) => {
  const { orderId } = await request.json() as { orderId: string };
  const token = await getAccessToken(env);

  const res = await fetch(`https://api-m.paypal.com/v2/checkout/orders/${orderId}/capture`, {
    method: "POST",
    headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
  });

  const capture = await res.json();
  return Response.json(capture);
};
