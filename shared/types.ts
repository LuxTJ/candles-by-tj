export type CartItem = {
  productId: number;
  productName: string;
  price: number;
  quantity: number;
  scent: string;
  color: string;
  imageUrl: string;
};

export type Cart = {
  items: CartItem[];
  total: number;
};

export type CheckoutPayload = {
  cart: Cart;
  customerName: string;
  customerEmail: string;
  shippingAddress: {
    name: string;
    line1: string;
    line2?: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
};
