"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import type { HeldTransaction } from "@/lib/types";

export default function HeldTransactionsPage() {
  const router = useRouter();

  const subscribe = useCallback((cb: () => void) => {
    window.addEventListener("storage", cb);
    window.addEventListener("held-transactions-updated", cb);
    return () => {
      window.removeEventListener("storage", cb);
      window.removeEventListener("held-transactions-updated", cb);
    };
  }, []);

  const getSnapshot = () =>
    typeof window === "undefined" ? "[]" : (localStorage.getItem("held-transactions") ?? "[]");

  const heldSnapshot = useSyncExternalStore(subscribe, getSnapshot, () => "[]");
  const items = useMemo<HeldTransaction[]>(() => {
    try { return JSON.parse(heldSnapshot); } catch { return []; }
  }, [heldSnapshot]);

  const resumeTransaction = useCallback((item: HeldTransaction) => {
    localStorage.setItem("resume-cart", JSON.stringify(item));
    // Remove from held list
    const remaining = items.filter(i => i.id !== item.id);
    localStorage.setItem("held-transactions", JSON.stringify(remaining));
    window.dispatchEvent(new Event("held-transactions-updated"));
    router.push("/kasir/retail");
  }, [items, router]);

  const deleteTransaction = useCallback((id: string) => {
    const remaining = items.filter(i => i.id !== id);
    localStorage.setItem("held-transactions", JSON.stringify(remaining));
    window.dispatchEvent(new Event("held-transactions-updated"));
  }, [items]);

  return (
    <section className="grid" style={{ gap: "1rem" }}>
      <div className="card">
        <h2 className="title">⏸ Held Transactions</h2>
        <p className="muted">
          Transaksi yang di-hold dapat dilanjutkan kapan saja. Klik <strong>Resume</strong> untuk melanjutkan ke kasir.
        </p>
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
                <th>Customer</th>
                <th>Item</th>
                <th>Total</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td style={{ fontSize: "0.8rem", color: "#6b7280" }}>{item.id}</td>
                  <td style={{ fontSize: "0.85rem" }}>{new Date(item.date).toLocaleString("id-ID")}</td>
                  <td style={{ fontSize: "0.85rem" }}>{item.customerName ?? "—"}</td>
                  <td>{item.items.length} item</td>
                  <td>Rp {item.total.toLocaleString("id-ID")}</td>
                  <td>
                    <div style={{ display: "flex", gap: "0.4rem" }}>
                      <button style={{ padding: "0.25rem 0.6rem", fontSize: "0.8rem" }}
                        onClick={() => resumeTransaction(item)}>
                        ▶ Resume
                      </button>
                      <button className="secondary" style={{ padding: "0.25rem 0.6rem", fontSize: "0.8rem", background: "#dc2626" }}
                        onClick={() => deleteTransaction(item.id)}>
                        🗑 Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}
