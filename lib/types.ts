export type CartItem = { id: string; name: string; qty: number; price: number };

export type HeldTransaction = {
  id: string;
  date: string;
  total: number;
  items: CartItem[];
};
