"use client";

import { useMemo, useSyncExternalStore } from "react";
import type { HeldTransaction } from "@/lib/types";

export default function HeldTransactionsPage() {
  const parseHeldSnapshot = (snapshot: string) => {
    try {
      return JSON.parse(snapshot) as HeldTransaction[];
    } catch {
      return [];
    }
  };

  const subscribe = (callback: () => void) => {
    window.addEventListener("storage", callback);
    window.addEventListener("held-transactions-updated", callback);
    return () => {
      window.removeEventListener("storage", callback);
      window.removeEventListener("held-transactions-updated", callback);
    };
  };

  const getSnapshot = () => {
    if (typeof window === "undefined") return "[]";
    return localStorage.getItem("held-transactions") ?? "[]";
  };

  const heldSnapshot = useSyncExternalStore(subscribe, getSnapshot, () => "[]");
  const items = useMemo(() => parseHeldSnapshot(heldSnapshot), [heldSnapshot]);

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
