"use client";

import { useState } from "react";

type HeldTx = {
  id: string;
  date: string;
  total: number;
  items: Array<{ id: string; name: string; qty: number }>;
};

export default function HeldTransactionsPage() {
  const [items] = useState<HeldTx[]>(() => {
    if (typeof window === "undefined") return [];
    return JSON.parse(localStorage.getItem("held-transactions") ?? "[]") as HeldTx[];
  });

  return (
    <section className="grid" style={{ gap: "1rem" }}>
      <div className="card">
        <h2 className="title">Held Transactions</h2>
        <p className="muted">Transaksi yang di-hold dapat dilanjutkan kapan saja.</p>
      </div>

      <div className="card">
        {items.length === 0 ? (
          <p className="muted">Belum ada transaksi hold.</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Tanggal</th>
                <th>Jumlah Item</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{new Date(item.date).toLocaleString("id-ID")}</td>
                  <td>{item.items.length}</td>
                  <td>Rp {item.total.toLocaleString("id-ID")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}
