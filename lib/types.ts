export type CartItem = { id: string; name: string; qty: number; price: number };

export type HeldTransaction = {
  id: string;
  date: string;
  total: number;
  items: CartItem[];
  customerName?: string;
};

export type Customer = {
  code: string;
  name: string;
  phone: string;
  member: "Regular" | "Silver" | "Gold" | "Platinum";
  debt: number;
};

export type CompletedTransaction = {
  id: string;
  date: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  total: number;
  paid: number;
  change: number;
  paymentMethod: "cash" | "qris" | "debt";
  customerId?: string;
  customerName?: string;
};

export type DebtRecord = {
  id: string;
  date: string;
  customerId: string;
  customerName: string;
  total: number;
  paidAmount: number;
  items: CartItem[];
  status: "outstanding" | "partial" | "paid";
};
