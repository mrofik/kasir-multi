"use client";

import { useMemo, useState } from "react";
import { products } from "@/lib/mock-data";

type CartItem = { id: string; name: string; qty: number; price: number };

export default function RetailPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [feedbackMessage, setFeedbackMessage] = useState<string>("");

  const total = useMemo(
    () => cart.reduce((acc, item) => acc + item.qty * item.price, 0),
    [cart],
  );

  const addItem = (id: string, name: string, price: number) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === id);
      if (existing) {
        return prev.map((item) =>
          item.id === id ? { ...item, qty: item.qty + 1 } : item,
        );
      }
      return [...prev, { id, name, qty: 1, price }];
    });
  };

  const holdTransaction = () => {
    if (cart.length === 0) {
      setFeedbackMessage("Keranjang masih kosong, tidak bisa hold transaksi.");
      return;
    }

    const held = JSON.parse(localStorage.getItem("held-transactions") ?? "[]") as Array<{
      id: string;
      date: string;
      items: CartItem[];
      total: number;
    }>;

    held.unshift({
      id: `HOLD-${Date.now()}`,
      date: new Date().toISOString(),
      items: cart,
      total,
    });

    localStorage.setItem("held-transactions", JSON.stringify(held));
    window.dispatchEvent(new Event("held-transactions-updated"));
    setCart([]);
    setFeedbackMessage("Transaksi berhasil di-hold.");
  };

  return (
    <section className="grid" style={{ gap: "1rem" }}>
      <div className="card">
        <h2 className="title">Kasir Grosir</h2>
        <p className="muted">Shortcut aktif: F4 (Hold), F8 (Bayar), Ctrl+H (Hold), Ctrl+R (Resume).</p>
        {feedbackMessage ? <p className="mt-2">{feedbackMessage}</p> : null}
      </div>

      <div className="kasir-layout">
        <div className="card">
          <h3>Daftar Produk</h3>
          <table className="table">
            <thead>
              <tr>
                <th>Kode</th>
                <th>Produk</th>
                <th>Harga</th>
                <th>Stok</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td>{product.id}</td>
                  <td>{product.name}</td>
                  <td>Rp {product.price.toLocaleString("id-ID")}</td>
                  <td>{product.stock}</td>
                  <td>
                    <button onClick={() => addItem(product.id, product.name, product.price)}>Tambah</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <aside className="card">
          <h3>Keranjang</h3>
          {cart.length === 0 ? (
            <p className="muted">Belum ada item.</p>
          ) : (
            <ul className="list">
              {cart.map((item) => (
                <li key={item.id}>
                  {item.name} x{item.qty} — Rp {(item.qty * item.price).toLocaleString("id-ID")}
                </li>
              ))}
            </ul>
          )}

          <p>
            <strong>Total: Rp {total.toLocaleString("id-ID")}</strong>
          </p>

          <div className="actions">
            <button onClick={holdTransaction}>Hold Transaksi</button>
            <button className="secondary">Bayar Tunai</button>
            <button className="secondary">Bayar QRIS</button>
            <button className="secondary">Tunda Bayar</button>
          </div>
        </aside>
      </div>
    </section>
  );
}
