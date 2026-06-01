"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { products } from "@/lib/mock-data";
import type { CartItem, HeldTransaction } from "@/lib/types";

export default function RetailPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [feedbackMessage, setFeedbackMessage] = useState<string>("");

  const total = useMemo(
    () => cart.reduce((acc, item) => acc + item.qty * item.price, 0),
    [cart],
  );

  const readHeldTransactions = useCallback(() => {
    try {
      return JSON.parse(localStorage.getItem("held-transactions") ?? "[]") as HeldTransaction[];
    } catch {
      setFeedbackMessage(
        "Data hold transaksi tidak valid. Silakan kosongkan storage browser jika perlu.",
      );
      return [];
    }
  }, []);

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

  const holdTransaction = useCallback(() => {
    if (cart.length === 0) {
      setFeedbackMessage("Keranjang masih kosong, tidak bisa hold transaksi.");
      return;
    }

    const held = readHeldTransactions();

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
  }, [cart, readHeldTransactions, total]);

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key.toLowerCase() === "h") {
        event.preventDefault();
        holdTransaction();
      }

      if (event.key === "F4") {
        event.preventDefault();
        holdTransaction();
      }

      if (event.key === "F8") {
        event.preventDefault();
        setFeedbackMessage("Aksi bayar akan diimplementasikan di fase berikutnya.");
      }

      if (event.ctrlKey && event.key.toLowerCase() === "r") {
        event.preventDefault();
        window.location.href = "/transactions/held";
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [holdTransaction]);

  return (
    <section className="grid" style={{ gap: "1rem" }}>
      <div className="card">
        <h2 className="title">Kasir Grosir</h2>
        <p className="muted">Shortcut aktif: F4 (Hold), F8 (Bayar), Ctrl+H (Hold), Ctrl+R (Resume).</p>
        {feedbackMessage ? (
          <p className="mt-2" role="status" aria-live="polite">
            {feedbackMessage}
          </p>
        ) : null}
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
