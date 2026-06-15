import { PagesFunction } from "@cloudflare/workers-types";
import { CartItem } from "../../shared/types";

interface Env {
  CART_SECRET: string;
}

function parseCartCookie(cookieHeader: string | null): CartItem[] {
  if (!cookieHeader) return [];
  const match = cookieHeader.match(/cart=([^;]+)/);
  if (!match) return [];
  try {
    return JSON.parse(decodeURIComponent(match[1]));
  } catch {
    return [];
  }
}

function setCartCookie(items: CartItem[]): string {
  const value = encodeURIComponent(JSON.stringify(items));
  return `cart=${value}; Path=/; HttpOnly; SameSite=Strict; Max-Age=604800`;
}

export const onRequestGet: PagesFunction<Env> = async ({ request }) => {
  const items = parseCartCookie(request.headers.get("Cookie"));
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  return Response.json({ items, total });
};

export const onRequestPost: PagesFunction<Env> = async ({ request }) => {
  const items = parseCartCookie(request.headers.get("Cookie"));
  const newItem: CartItem = await request.json();

  const existing = items.find(
    (i) => i.productId === newItem.productId && i.scent === newItem.scent && i.color === newItem.color
  );

  if (existing) {
    existing.quantity += newItem.quantity;
  } else {
    items.push(newItem);
  }

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const res = Response.json({ items, total });
  res.headers.set("Set-Cookie", setCartCookie(items));
  return res;
};

export const onRequestDelete: PagesFunction<Env> = async ({ request }) => {
  const items = parseCartCookie(request.headers.get("Cookie"));
  const { productId, scent, color }: { productId: number; scent: string; color: string } = await request.json();

  const updated = items.filter(
    (i) => !(i.productId === productId && i.scent === scent && i.color === color)
  );

  const total = updated.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const res = Response.json({ items: updated, total });
  res.headers.set("Set-Cookie", setCartCookie(updated));
  return res;
};
