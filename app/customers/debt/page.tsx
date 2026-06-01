"use client";

import { useCallback, useMemo, useState, useSyncExternalStore } from "react";
import type { DebtRecord } from "@/lib/types";

function fmt(n: number) {
  return `Rp ${n.toLocaleString("id-ID")}`;
}

function readLS<T>(key: string, fallback: T): T {
  try {
    return JSON.parse(localStorage.getItem(key) ?? "null") ?? fallback;
  } catch {
    return fallback;
  }
}

export default function DebtPage() {
  const [paymentInput, setPaymentInput] = useState<Record<string, string>>({});
  const [feedback, setFeedback] = useState("");

  const subscribe = useCallback((cb: () => void) => {
    window.addEventListener("storage", cb);
    window.addEventListener("debts-updated", cb);
    return () => {
      window.removeEventListener("storage", cb);
      window.removeEventListener("debts-updated", cb);
    };
  }, []);

  const getSnapshot = () =>
    typeof window === "undefined" ? "[]" : (localStorage.getItem("debts") ?? "[]");

  const snapshot = useSyncExternalStore(subscribe, getSnapshot, () => "[]");
  const debts = useMemo<DebtRecord[]>(() => {
    try { return JSON.parse(snapshot); } catch { return []; }
  }, [snapshot]);

  const outstanding = useMemo(() => debts.filter(d => d.status !== "paid"), [debts]);
  const paid = useMemo(() => debts.filter(d => d.status === "paid"), [debts]);
  const totalOutstanding = useMemo(() => outstanding.reduce((s, d) => s + (d.total - d.paidAmount), 0), [outstanding]);

  const showFeedback = useCallback((msg: string) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(""), 3000);
  }, []);

  const saveDebts = useCallback((updated: DebtRecord[]) => {
    localStorage.setItem("debts", JSON.stringify(updated));
    window.dispatchEvent(new Event("debts-updated"));
  }, []);

  const processPayment = useCallback((debtId: string, full: boolean) => {
    const amount = full ? undefined : parseInt(paymentInput[debtId]?.replace(/\D/g, "") || "0", 10);
    const updated = readLS<DebtRecord[]>("debts", []).map(d => {
      if (d.id !== debtId) return d;
      const remaining = d.total - d.paidAmount;
      const pay = full ? remaining : Math.min(amount ?? 0, remaining);
      if (pay <= 0) return d;
      const newPaid = d.paidAmount + pay;
      const newStatus: DebtRecord["status"] = newPaid >= d.total ? "paid" : "partial";
      return { ...d, paidAmount: newPaid, status: newStatus };
    });
    saveDebts(updated);
    setPaymentInput(prev => ({ ...prev, [debtId]: "" }));
    showFeedback(full ? "Piutang lunas!" : "Pembayaran sebagian berhasil.");
  }, [paymentInput, saveDebts, showFeedback]);

  return (
    <section className="grid" style={{ gap: "1rem" }}>
      <div className="card">
        <h2 className="title">📋 Manajemen Piutang</h2>
        <p className="muted">Daftar piutang pelanggan, pembayaran sebagian, dan pelunasan.</p>
        {feedback && (
          <p role="status" aria-live="polite"
            style={{ marginTop: "0.5rem", background: "#ecfdf5", border: "1px solid #6ee7b7", borderRadius: "8px", padding: "0.5rem 0.75rem", fontSize: "0.9rem" }}>
            {feedback}
          </p>
        )}
      </div>

      {/* Summary */}
      <div className="card" style={{ background: outstanding.length > 0 ? "#fef2f2" : "#f0fdf4", borderColor: outstanding.length > 0 ? "#fecaca" : "#bbf7d0" }}>
        <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap" }}>
          <div>
            <p className="muted" style={{ margin: 0, fontSize: "0.875rem" }}>Total Piutang Aktif</p>
            <h3 style={{ margin: "0.25rem 0 0", color: "#dc2626" }}>{fmt(totalOutstanding)}</h3>
          </div>
          <div>
            <p className="muted" style={{ margin: 0, fontSize: "0.875rem" }}>Jumlah Transaksi Piutang</p>
            <h3 style={{ margin: "0.25rem 0 0" }}>{outstanding.length}</h3>
          </div>
          <div>
            <p className="muted" style={{ margin: 0, fontSize: "0.875rem" }}>Sudah Lunas</p>
            <h3 style={{ margin: "0.25rem 0 0", color: "#16a34a" }}>{paid.length}</h3>
          </div>
        </div>
      </div>

      {/* Outstanding */}
      <div className="card">
        <h3 style={{ marginTop: 0 }}>Piutang Belum Lunas ({outstanding.length})</h3>
        {outstanding.length === 0 ? (
          <p className="muted">Tidak ada piutang aktif. 🎉</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Tanggal</th>
                <th>Customer</th>
                <th>Total</th>
                <th>Sudah Bayar</th>
                <th>Sisa</th>
                <th>Status</th>
                <th>Bayar</th>
              </tr>
            </thead>
            <tbody>
              {outstanding.map(d => {
                const sisa = d.total - d.paidAmount;
                return (
                  <tr key={d.id}>
                    <td style={{ fontSize: "0.78rem", color: "#6b7280" }}>{d.id}</td>
                    <td style={{ fontSize: "0.82rem" }}>{new Date(d.date).toLocaleDateString("id-ID")}</td>
                    <td>{d.customerName}</td>
                    <td>{fmt(d.total)}</td>
                    <td style={{ color: "#16a34a" }}>{fmt(d.paidAmount)}</td>
                    <td style={{ color: "#dc2626", fontWeight: "bold" }}>{fmt(sisa)}</td>
                    <td>
                      <span style={{
                        fontSize: "0.75rem",
                        background: d.status === "partial" ? "#fef9c3" : "#fee2e2",
                        border: `1px solid ${d.status === "partial" ? "#fde68a" : "#fecaca"}`,
                        borderRadius: "999px",
                        padding: "0.1rem 0.5rem",
                      }}>
                        {d.status === "partial" ? "Sebagian" : "Belum Bayar"}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: "flex", gap: "0.3rem", alignItems: "center" }}>
                        <input
                          type="text"
                          inputMode="numeric"
                          placeholder="Nominal"
                          value={paymentInput[d.id] ?? ""}
                          onChange={e => setPaymentInput(prev => ({ ...prev, [d.id]: e.target.value.replace(/\D/g, "") }))}
                          style={{ width: "90px", padding: "0.25rem 0.4rem", border: "1px solid #e5e7eb", borderRadius: "5px", fontSize: "0.8rem" }}
                        />
                        <button style={{ padding: "0.25rem 0.5rem", fontSize: "0.78rem" }}
                          onClick={() => processPayment(d.id, false)}>
                          Bayar
                        </button>
                        <button style={{ padding: "0.25rem 0.5rem", fontSize: "0.78rem", background: "#16a34a" }}
                          onClick={() => processPayment(d.id, true)}>
                          Lunas
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Paid history */}
      {paid.length > 0 && (
        <div className="card">
          <h3 style={{ marginTop: 0 }}>Riwayat Piutang Lunas ({paid.length})</h3>
          <table className="table">
            <thead>
              <tr><th>ID</th><th>Tanggal</th><th>Customer</th><th>Total</th></tr>
            </thead>
            <tbody>
              {paid.map(d => (
                <tr key={d.id} style={{ opacity: 0.7 }}>
                  <td style={{ fontSize: "0.78rem", color: "#6b7280" }}>{d.id}</td>
                  <td style={{ fontSize: "0.82rem" }}>{new Date(d.date).toLocaleDateString("id-ID")}</td>
                  <td>{d.customerName}</td>
                  <td style={{ color: "#16a34a" }}>{fmt(d.total)} ✅</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
