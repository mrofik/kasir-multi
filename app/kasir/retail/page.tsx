"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { customers as mockCustomers, products } from "@/lib/mock-data";
import type { CartItem, CompletedTransaction, Customer, DebtRecord, HeldTransaction } from "@/lib/types";

// ─────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────
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
function writeLS(key: string, value: unknown) {
  localStorage.setItem(key, JSON.stringify(value));
}

// ─────────────────────────────────────────
// MODAL WRAPPER
// ─────────────────────────────────────────
function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-label={title}>
      <div className="modal-box">
        <div className="modal-header">
          <strong>{title}</strong>
          <button className="secondary" onClick={onClose} aria-label="Tutup">✕</button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────
export default function RetailPage() {
  // Cart
  const [cart, setCart] = useState<CartItem[]>([]);

  // Modals
  const [showHelp, setShowHelp] = useState(false);
  const [showDiscount, setShowDiscount] = useState(false);
  const [showCustomer, setShowCustomer] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [showReturn, setShowReturn] = useState(false);

  // Payment
  const [paymentTab, setPaymentTab] = useState<"cash" | "qris" | "debt">("cash");
  const [cashInput, setCashInput] = useState("");
  const [qrisPaid, setQrisPaid] = useState(false);

  // Discount
  const [discountType, setDiscountType] = useState<"percent" | "fixed">("percent");
  const [discountValue, setDiscountValue] = useState("");
  const [activeDiscount, setActiveDiscount] = useState(0);

  // Customer
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [customerSearch, setCustomerSearch] = useState("");

  // Product search/filter
  const [productSearch, setProductSearch] = useState("");

  // Feedback
  const [feedback, setFeedback] = useState("");

  // Refs
  const cashInputRef = useRef<HTMLInputElement>(null);
  const discountInputRef = useRef<HTMLInputElement>(null);
  const productSearchRef = useRef<HTMLInputElement>(null);

  // ─── Computed ─────────────────────────
  const subtotal = useMemo(() => cart.reduce((a, i) => a + i.qty * i.price, 0), [cart]);
  const total = useMemo(() => Math.max(0, subtotal - activeDiscount), [subtotal, activeDiscount]);
  const cashPaid = useMemo(() => parseInt(cashInput.replace(/\D/g, "") || "0", 10), [cashInput]);
  const change = useMemo(() => Math.max(0, cashPaid - total), [cashPaid, total]);

  const filteredProducts = useMemo(() => {
    if (!productSearch) return products;
    const q = productSearch.toLowerCase();
    return products.filter(p => p.name.toLowerCase().includes(q) || p.id.toLowerCase().includes(q));
  }, [productSearch]);

  const filteredCustomers = useMemo(() => {
    if (!customerSearch) return mockCustomers;
    const q = customerSearch.toLowerCase();
    return mockCustomers.filter(c =>
      c.name.toLowerCase().includes(q) || c.code.toLowerCase().includes(q)
    );
  }, [customerSearch]);

  // ─── Feedback helper ──────────────────
  const showFeedback = useCallback((msg: string) => {
    setFeedback(msg);
    const t = setTimeout(() => setFeedback(""), 3500);
    return () => clearTimeout(t);
  }, []);

  // ─── Cart actions ─────────────────────
  const addItem = useCallback((id: string, name: string, price: number) => {
    setCart(prev => {
      const ex = prev.find(i => i.id === id);
      if (ex) return prev.map(i => i.id === id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { id, name, qty: 1, price }];
    });
  }, []);

  const removeItem = useCallback((id: string) => {
    setCart(prev => prev.filter(i => i.id !== id));
  }, []);

  const updateQty = useCallback((id: string, delta: number) => {
    setCart(prev =>
      prev.flatMap(i => {
        if (i.id !== id) return [i];
        const q = i.qty + delta;
        return q > 0 ? [{ ...i, qty: q }] : [];
      })
    );
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
    setActiveDiscount(0);
    setSelectedCustomer(null);
    showFeedback("Keranjang dikosongkan.");
  }, [showFeedback]);

  // ─── Hold ─────────────────────────────
  const holdTransaction = useCallback(() => {
    if (cart.length === 0) { showFeedback("Keranjang masih kosong."); return; }
    const held = readLS<HeldTransaction[]>("held-transactions", []);
    held.unshift({
      id: `HOLD-${Date.now()}`,
      date: new Date().toISOString(),
      items: [...cart],
      total,
      customerName: selectedCustomer?.name,
    });
    writeLS("held-transactions", held);
    window.dispatchEvent(new Event("held-transactions-updated"));
    clearCart();
    showFeedback("Transaksi berhasil di-hold.");
  }, [cart, total, selectedCustomer, clearCart, showFeedback]);

  // Resume dari halaman held
  useEffect(() => {
    const resume = readLS<HeldTransaction | null>("resume-cart", null);
    if (resume) {
      setCart(resume.items);
      localStorage.removeItem("resume-cart");
      showFeedback(`Melanjutkan transaksi ${resume.id}`);
    }
  }, [showFeedback]);

  // ─── Payment ──────────────────────────
  const processPayment = useCallback((method: "cash" | "qris" | "debt") => {
    if (cart.length === 0) return;
    if (method === "cash" && cashPaid < total) {
      showFeedback("Uang bayar kurang dari total.");
      return;
    }
    if (method === "debt" && !selectedCustomer) {
      showFeedback("Pilih customer terlebih dahulu (F6).");
      return;
    }

    const tx: CompletedTransaction = {
      id: `TRX-${Date.now()}`,
      date: new Date().toISOString(),
      items: [...cart],
      subtotal,
      discount: activeDiscount,
      total,
      paid: method === "cash" ? cashPaid : total,
      change: method === "cash" ? change : 0,
      paymentMethod: method,
      customerId: selectedCustomer?.code,
      customerName: selectedCustomer?.name,
    };

    const txHistory = readLS<CompletedTransaction[]>("transactions", []);
    txHistory.unshift(tx);
    writeLS("transactions", txHistory);

    if (method === "debt" && selectedCustomer) {
      const debts = readLS<DebtRecord[]>("debts", []);
      debts.unshift({
        id: tx.id,
        date: tx.date,
        customerId: selectedCustomer.code,
        customerName: selectedCustomer.name,
        total,
        paidAmount: 0,
        items: [...cart],
        status: "outstanding",
      });
      writeLS("debts", debts);
    }

    const msg =
      method === "cash" ? `✅ Bayar tunai berhasil. Kembalian: ${fmt(change)}` :
      method === "qris" ? `✅ QRIS terkonfirmasi. Transaksi ${tx.id} selesai.` :
      `✅ Disimpan sebagai piutang untuk ${selectedCustomer!.name}.`;

    clearCart();
    setShowPayment(false);
    setCashInput("");
    setQrisPaid(false);
    showFeedback(msg);
  }, [cart, subtotal, activeDiscount, total, cashPaid, change, selectedCustomer, clearCart, showFeedback]);

  // ─── Print ────────────────────────────
  const printReceipt = useCallback(() => {
    if (cart.length === 0) { showFeedback("Keranjang kosong."); return; }
    const lines = [
      "================================",
      "         KASIR MULTI POS        ",
      "================================",
      `Tanggal: ${new Date().toLocaleString("id-ID")}`,
      selectedCustomer ? `Customer : ${selectedCustomer.name}` : "",
      "--------------------------------",
      ...cart.map(i => `${i.name}\n  ${i.qty} x ${fmt(i.price)} = ${fmt(i.qty * i.price)}`),
      "--------------------------------",
      `Subtotal : ${fmt(subtotal)}`,
      activeDiscount > 0 ? `Diskon   : -${fmt(activeDiscount)}` : "",
      `TOTAL    : ${fmt(total)}`,
      "================================",
      "      Terima kasih!             ",
    ].filter(Boolean).join("\n");

    const win = window.open("", "_blank", "width=350,height=600");
    if (win) {
      win.document.write(`<pre style="font-family:monospace;font-size:12px;padding:1rem;white-space:pre-wrap">${lines}</pre>`);
      win.document.close();
      win.print();
    }
  }, [cart, subtotal, activeDiscount, total, selectedCustomer, showFeedback]);

  // ─── Discount ─────────────────────────
  const applyDiscount = useCallback(() => {
    const val = parseFloat(discountValue);
    if (isNaN(val) || val < 0) { showFeedback("Nilai diskon tidak valid."); return; }
    setActiveDiscount(discountType === "percent" ? Math.round(subtotal * val / 100) : val);
    setShowDiscount(false);
    setDiscountValue("");
    showFeedback("Diskon berhasil diterapkan.");
  }, [discountValue, discountType, subtotal, showFeedback]);

  // ─── Keyboard Shortcuts ───────────────
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const inInput = ["INPUT", "TEXTAREA", "SELECT"].includes((e.target as HTMLElement).tagName);

      if (!inInput && e.key === "+" && cart.length > 0) { updateQty(cart[cart.length - 1].id, 1); return; }
      if (!inInput && e.key === "-" && cart.length > 0) { updateQty(cart[cart.length - 1].id, -1); return; }

      if (e.key === "Escape") {
        setShowHelp(false); setShowDiscount(false); setShowCustomer(false);
        setShowPayment(false); setShowReturn(false);
        return;
      }

      if (e.key === "F1") { e.preventDefault(); setShowHelp(v => !v); }
      if (e.key === "F2") { e.preventDefault(); clearCart(); }
      if (e.key === "F3") { e.preventDefault(); setShowDiscount(true); }
      if (e.key === "F4") { e.preventDefault(); holdTransaction(); }
      if (e.key === "F5") { e.preventDefault(); setProductSearch(""); showFeedback("Daftar produk diperbarui."); }
      if (e.key === "F6") { e.preventDefault(); setShowCustomer(true); }
      if (e.key === "F7") { e.preventDefault(); printReceipt(); }
      if (e.key === "F8") { e.preventDefault(); if (cart.length > 0) setShowPayment(true); else showFeedback("Keranjang masih kosong."); }
      if (e.key === "F9") { e.preventDefault(); setShowReturn(true); }
      if (e.key === "F10") { e.preventDefault(); window.location.href = "/settings"; }

      if (e.ctrlKey) {
        if (e.key.toLowerCase() === "h") { e.preventDefault(); holdTransaction(); }
        if (e.key.toLowerCase() === "r") { e.preventDefault(); window.location.href = "/transactions/held"; }
        if (e.key.toLowerCase() === "s") { e.preventDefault(); if (cart.length > 0) setShowPayment(true); }
        if (e.key.toLowerCase() === "p") { e.preventDefault(); printReceipt(); }
        if (e.key.toLowerCase() === "q") { e.preventDefault(); window.location.href = "/reports"; }
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [cart, holdTransaction, clearCart, printReceipt, updateQty, showFeedback]);

  // Focus management
  useEffect(() => { if (showPayment && paymentTab === "cash") setTimeout(() => cashInputRef.current?.focus(), 80); }, [showPayment, paymentTab]);
  useEffect(() => { if (showDiscount) setTimeout(() => discountInputRef.current?.focus(), 80); }, [showDiscount]);

  // QRIS data string (demo)
  const qrisData = `kasirmulti://pay?amount=${total}&ref=TRX-${Date.now()}`;

  // ─────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────
  return (
    <>
      <section className="grid" style={{ gap: "1rem" }}>
        {/* Header */}
        <div className="card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "0.5rem" }}>
            <div>
              <h2 className="title" style={{ marginBottom: "0.25rem" }}>Kasir Grosir</h2>
              <p className="muted" style={{ fontSize: "0.8rem" }}>
                F1 Bantuan · F2 Kosongkan · F3 Diskon · F4 Hold · F5 Refresh · F6 Customer · F7 Cetak · F8 Bayar · F9 Retur · F10 Pengaturan
              </p>
            </div>
            {selectedCustomer && (
              <div className="card" style={{ padding: "0.4rem 0.75rem", border: "2px solid #1d4ed8", fontSize: "0.85rem" }}>
                👤 <strong>{selectedCustomer.name}</strong> — {selectedCustomer.member}
                <button className="secondary" style={{ marginLeft: "0.5rem", padding: "0.2rem 0.5rem", fontSize: "0.75rem" }}
                  onClick={() => setSelectedCustomer(null)}>✕</button>
              </div>
            )}
          </div>
          {feedback && (
            <p className="mt-2" role="status" aria-live="polite"
              style={{ background: "#ecfdf5", border: "1px solid #6ee7b7", borderRadius: "8px", padding: "0.5rem 0.75rem", fontSize: "0.9rem" }}>
              {feedback}
            </p>
          )}
        </div>

        <div className="kasir-layout">
          {/* Produk */}
          <div className="card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
              <h3 style={{ margin: 0 }}>Daftar Produk</h3>
              <input
                ref={productSearchRef}
                type="text"
                placeholder="Cari produk…"
                value={productSearch}
                onChange={e => setProductSearch(e.target.value)}
                style={{ padding: "0.35rem 0.6rem", border: "1px solid #e5e7eb", borderRadius: "6px", fontSize: "0.875rem", width: "180px" }}
              />
            </div>
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
                {filteredProducts.map(p => (
                  <tr key={p.id}>
                    <td style={{ fontSize: "0.8rem", color: "#6b7280" }}>{p.id}</td>
                    <td>{p.name}</td>
                    <td>{fmt(p.price)}</td>
                    <td>{p.stock}</td>
                    <td>
                      <button style={{ padding: "0.25rem 0.6rem", fontSize: "0.8rem" }}
                        onClick={() => addItem(p.id, p.name, p.price)}>
                        + Tambah
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Keranjang */}
          <aside className="card">
            <h3 style={{ marginTop: 0 }}>Keranjang</h3>
            {cart.length === 0 ? (
              <p className="muted">Belum ada item.</p>
            ) : (
              <table className="table">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Qty</th>
                    <th>Subtotal</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {cart.map(item => (
                    <tr key={item.id}>
                      <td style={{ fontSize: "0.85rem" }}>{item.name}</td>
                      <td>
                        <div style={{ display: "flex", gap: "0.25rem", alignItems: "center" }}>
                          <button className="secondary" style={{ padding: "0.1rem 0.4rem", fontSize: "0.8rem" }}
                            onClick={() => updateQty(item.id, -1)}>−</button>
                          <span>{item.qty}</span>
                          <button className="secondary" style={{ padding: "0.1rem 0.4rem", fontSize: "0.8rem" }}
                            onClick={() => updateQty(item.id, 1)}>+</button>
                        </div>
                      </td>
                      <td style={{ fontSize: "0.85rem" }}>{fmt(item.qty * item.price)}</td>
                      <td>
                        <button className="secondary" style={{ padding: "0.1rem 0.4rem", fontSize: "0.75rem", background: "#dc2626" }}
                          onClick={() => removeItem(item.id)}>✕</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            <div style={{ marginTop: "0.75rem", borderTop: "1px solid #e5e7eb", paddingTop: "0.75rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.9rem" }}>
                <span>Subtotal</span><span>{fmt(subtotal)}</span>
              </div>
              {activeDiscount > 0 && (
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.9rem", color: "#16a34a" }}>
                  <span>Diskon</span><span>− {fmt(activeDiscount)}</span>
                </div>
              )}
              <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "bold", fontSize: "1.05rem", marginTop: "0.25rem" }}>
                <span>Total</span><span>{fmt(total)}</span>
              </div>
            </div>

            <div className="actions" style={{ marginTop: "0.75rem" }}>
              <button onClick={() => cart.length > 0 && setShowPayment(true)} style={{ flex: 1 }}>
                💳 Bayar (F8)
              </button>
              <button className="secondary" onClick={holdTransaction}>⏸ Hold (F4)</button>
              <button className="secondary" onClick={() => setShowDiscount(true)}>% Diskon (F3)</button>
              <button className="secondary" onClick={() => setShowCustomer(true)}>👤 Customer (F6)</button>
              <button className="secondary" onClick={printReceipt}>🖨 Cetak (F7)</button>
              <button className="secondary" style={{ background: "#dc2626" }} onClick={clearCart}>🗑 Kosongkan (F2)</button>
            </div>
          </aside>
        </div>
      </section>

      {/* ── MODAL: HELP ── */}
      {showHelp && (
        <Modal title="⌨️ Keyboard Shortcuts" onClose={() => setShowHelp(false)}>
          <table className="table">
            <thead><tr><th>Shortcut</th><th>Aksi</th></tr></thead>
            <tbody>
              {[
                ["F1", "Tampilkan/sembunyikan bantuan ini"],
                ["F2", "Kosongkan keranjang"],
                ["F3", "Buka dialog diskon"],
                ["F4 / Ctrl+H", "Hold transaksi"],
                ["F5", "Refresh daftar produk"],
                ["F6", "Pilih customer"],
                ["F7 / Ctrl+P", "Cetak struk"],
                ["F8 / Ctrl+S", "Buka pembayaran"],
                ["F9", "Retur/Refund"],
                ["F10", "Buka pengaturan"],
                ["Ctrl+R", "Lihat transaksi hold"],
                ["Ctrl+Q", "Buka laporan"],
                ["+ / −", "Tambah/kurangi qty item terakhir"],
                ["Escape", "Tutup dialog"],
              ].map(([key, action]) => (
                <tr key={key}>
                  <td><kbd style={{ background: "#f3f4f6", border: "1px solid #d1d5db", borderRadius: "4px", padding: "0.15rem 0.4rem", fontFamily: "monospace", fontSize: "0.85rem" }}>{key}</kbd></td>
                  <td style={{ fontSize: "0.9rem" }}>{action}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Modal>
      )}

      {/* ── MODAL: DISKON ── */}
      {showDiscount && (
        <Modal title="% Diskon" onClose={() => setShowDiscount(false)}>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            <div>
              <label style={{ fontSize: "0.875rem" }}>Tipe Diskon</label>
              <div className="actions" style={{ marginTop: "0.35rem" }}>
                <button className={discountType === "percent" ? "" : "secondary"}
                  onClick={() => setDiscountType("percent")}>Persen (%)</button>
                <button className={discountType === "fixed" ? "" : "secondary"}
                  onClick={() => setDiscountType("fixed")}>Nominal (Rp)</button>
              </div>
            </div>
            <div>
              <label style={{ fontSize: "0.875rem" }}>
                Nilai {discountType === "percent" ? "(%)" : "(Rp)"}
              </label>
              <input
                ref={discountInputRef}
                type="number"
                min="0"
                value={discountValue}
                onChange={e => setDiscountValue(e.target.value)}
                onKeyDown={e => e.key === "Enter" && applyDiscount()}
                style={{ display: "block", width: "100%", padding: "0.5rem", marginTop: "0.35rem", border: "1px solid #e5e7eb", borderRadius: "6px", fontSize: "1rem" }}
                placeholder={discountType === "percent" ? "cth: 10" : "cth: 50000"}
              />
            </div>
            {discountValue && !isNaN(parseFloat(discountValue)) && (
              <p style={{ color: "#16a34a", fontSize: "0.875rem" }}>
                Diskon ≈ {fmt(discountType === "percent" ? Math.round(subtotal * parseFloat(discountValue) / 100) : parseFloat(discountValue))}
              </p>
            )}
            <button onClick={applyDiscount}>Terapkan Diskon</button>
            {activeDiscount > 0 && (
              <button className="secondary" onClick={() => { setActiveDiscount(0); setShowDiscount(false); showFeedback("Diskon dihapus."); }}>
                Hapus Diskon Aktif
              </button>
            )}
          </div>
        </Modal>
      )}

      {/* ── MODAL: CUSTOMER ── */}
      {showCustomer && (
        <Modal title="👤 Pilih Customer" onClose={() => setShowCustomer(false)}>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            <input
              type="text"
              placeholder="Cari nama atau kode customer…"
              value={customerSearch}
              onChange={e => setCustomerSearch(e.target.value)}
              style={{ padding: "0.5rem", border: "1px solid #e5e7eb", borderRadius: "6px", fontSize: "0.9rem" }}
              autoFocus
            />
            <table className="table">
              <thead>
                <tr><th>Kode</th><th>Nama</th><th>Member</th><th>Piutang</th><th></th></tr>
              </thead>
              <tbody>
                {filteredCustomers.map(c => (
                  <tr key={c.code} style={{ background: selectedCustomer?.code === c.code ? "#eff6ff" : undefined }}>
                    <td style={{ fontSize: "0.8rem", color: "#6b7280" }}>{c.code}</td>
                    <td>{c.name}</td>
                    <td><span style={{ fontSize: "0.75rem", background: "#dbeafe", borderRadius: "999px", padding: "0.1rem 0.4rem" }}>{c.member}</span></td>
                    <td style={{ color: c.debt > 0 ? "#dc2626" : "#16a34a", fontSize: "0.85rem" }}>{fmt(c.debt)}</td>
                    <td>
                      <button style={{ padding: "0.2rem 0.5rem", fontSize: "0.8rem" }} onClick={() => {
                        setSelectedCustomer(c);
                        setShowCustomer(false);
                        setCustomerSearch("");
                        showFeedback(`Customer dipilih: ${c.name}`);
                      }}>Pilih</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {selectedCustomer && (
              <button className="secondary" onClick={() => { setSelectedCustomer(null); setShowCustomer(false); showFeedback("Customer dihapus."); }}>
                Hapus Pilihan Customer
              </button>
            )}
          </div>
        </Modal>
      )}

      {/* ── MODAL: PEMBAYARAN ── */}
      {showPayment && (
        <Modal title="💳 Pembayaran" onClose={() => { setShowPayment(false); setCashInput(""); setQrisPaid(false); }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "8px", padding: "0.75rem" }}>
              {selectedCustomer && <p style={{ margin: "0 0 0.25rem", fontSize: "0.875rem" }}>Customer: <strong>{selectedCustomer.name}</strong></p>}
              {activeDiscount > 0 && <p style={{ margin: "0 0 0.25rem", fontSize: "0.875rem", color: "#16a34a" }}>Diskon: − {fmt(activeDiscount)}</p>}
              <p style={{ margin: 0, fontSize: "1.1rem" }}>Total: <strong>{fmt(total)}</strong></p>
            </div>

            {/* Tabs */}
            <div className="actions">
              {(["cash", "qris", "debt"] as const).map(tab => (
                <button key={tab} className={paymentTab === tab ? "" : "secondary"}
                  onClick={() => { setPaymentTab(tab); setQrisPaid(false); }}>
                  {tab === "cash" ? "💵 Tunai" : tab === "qris" ? "📱 QRIS" : "📋 Tunda Bayar"}
                </button>
              ))}
            </div>

            {/* Tunai */}
            {paymentTab === "cash" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <label style={{ fontSize: "0.875rem" }}>Uang Bayar</label>
                <input
                  ref={cashInputRef}
                  type="text"
                  inputMode="numeric"
                  value={cashInput}
                  onChange={e => setCashInput(e.target.value.replace(/\D/g, ""))}
                  onKeyDown={e => e.key === "Enter" && cashPaid >= total && processPayment("cash")}
                  style={{ padding: "0.6rem", border: "1px solid #e5e7eb", borderRadius: "6px", fontSize: "1.1rem" }}
                  placeholder="0"
                />
                {/* Quick amounts */}
                <div className="actions">
                  {[50000, 100000, 200000, 500000].map(amt => (
                    <button key={amt} className="secondary" style={{ fontSize: "0.8rem", padding: "0.3rem 0.5rem" }}
                      onClick={() => setCashInput(String(amt))}>
                      {fmt(amt)}
                    </button>
                  ))}
                </div>
                {cashPaid > 0 && (
                  <div style={{ background: cashPaid >= total ? "#f0fdf4" : "#fef2f2", border: `1px solid ${cashPaid >= total ? "#bbf7d0" : "#fecaca"}`, borderRadius: "8px", padding: "0.5rem 0.75rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span>Dibayar:</span><strong>{fmt(cashPaid)}</strong>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", color: cashPaid >= total ? "#16a34a" : "#dc2626" }}>
                      <span>{cashPaid >= total ? "Kembalian:" : "Kurang:"}</span>
                      <strong>{fmt(Math.abs(cashPaid - total))}</strong>
                    </div>
                  </div>
                )}
                <button disabled={cashPaid < total} onClick={() => processPayment("cash")}
                  style={{ opacity: cashPaid < total ? 0.5 : 1 }}>
                  ✅ Konfirmasi Bayar Tunai
                </button>
              </div>
            )}

            {/* QRIS */}
            {paymentTab === "qris" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", alignItems: "center", textAlign: "center" }}>
                <p style={{ margin: 0, fontSize: "0.875rem", color: "#6b7280" }}>Scan QR di bawah untuk membayar</p>
                {/* QR Code via free API */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrisData)}`}
                  alt="QRIS QR Code"
                  width={200}
                  height={200}
                  style={{ border: "4px solid #1d4ed8", borderRadius: "8px" }}
                />
                <p style={{ margin: 0, fontWeight: "bold", fontSize: "1.1rem", color: "#1d4ed8" }}>{fmt(total)}</p>
                {!qrisPaid ? (
                  <button className="secondary" onClick={() => setQrisPaid(true)}>Tandai Sudah Dibayar</button>
                ) : (
                  <button onClick={() => processPayment("qris")} style={{ background: "#16a34a" }}>
                    ✅ Konfirmasi QRIS Diterima
                  </button>
                )}
              </div>
            )}

            {/* Tunda Bayar */}
            {paymentTab === "debt" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {!selectedCustomer ? (
                  <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "8px", padding: "0.75rem" }}>
                    <p style={{ margin: "0 0 0.5rem", color: "#dc2626" }}>⚠️ Harus pilih customer terlebih dahulu.</p>
                    <button onClick={() => { setShowPayment(false); setShowCustomer(true); }}>👤 Pilih Customer</button>
                  </div>
                ) : (
                  <>
                    <div style={{ background: "#fef9c3", border: "1px solid #fde68a", borderRadius: "8px", padding: "0.75rem" }}>
                      <p style={{ margin: "0 0 0.25rem", fontSize: "0.875rem" }}>Customer: <strong>{selectedCustomer.name}</strong></p>
                      <p style={{ margin: "0 0 0.25rem", fontSize: "0.875rem" }}>Piutang saat ini: <span style={{ color: "#dc2626" }}>{fmt(selectedCustomer.debt)}</span></p>
                      <p style={{ margin: 0, fontSize: "0.875rem" }}>Akan ditambah: <strong style={{ color: "#dc2626" }}>{fmt(total)}</strong></p>
                    </div>
                    <button onClick={() => processPayment("debt")}>
                      📋 Simpan sebagai Piutang
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </Modal>
      )}

      {/* ── MODAL: RETUR ── */}
      {showReturn && (
        <Modal title="↩️ Retur / Refund" onClose={() => setShowReturn(false)}>
          <p style={{ fontSize: "0.9rem" }}>Fitur retur memerlukan nomor transaksi. Lihat riwayat transaksi untuk memproses retur.</p>
          <div className="actions">
            <button onClick={() => { window.location.href = "/transactions"; }}>Buka Riwayat Transaksi</button>
            <button className="secondary" onClick={() => setShowReturn(false)}>Tutup</button>
          </div>
        </Modal>
      )}
    </>
  );
}
