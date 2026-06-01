import Link from "next/link";
import { customers } from "@/lib/mock-data";

export default function CustomersPage() {
  return (
    <section className="grid" style={{ gap: "1rem" }}>
      <div className="card">
        <h2 className="title">Manajemen Customer</h2>
        <p className="muted">Data pelanggan, member level, dan piutang.</p>
        <div style={{ marginTop: "0.75rem" }}>
          <Link href="/customers/debt">
            <button className="secondary">📋 Lihat Manajemen Piutang</button>
          </Link>
        </div>
      </div>

      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th>Kode</th>
              <th>Nama</th>
              <th>Telepon</th>
              <th>Level Member</th>
              <th>Piutang</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <tr key={customer.code}>
                <td style={{ fontSize: "0.8rem", color: "#6b7280" }}>{customer.code}</td>
                <td>{customer.name}</td>
                <td style={{ fontSize: "0.85rem" }}>{customer.phone}</td>
                <td>
                  <span style={{ fontSize: "0.75rem", background: "#dbeafe", borderRadius: "999px", padding: "0.1rem 0.4rem" }}>
                    {customer.member}
                  </span>
                </td>
                <td style={{ color: customer.debt > 0 ? "#dc2626" : "#16a34a", fontWeight: customer.debt > 0 ? "bold" : "normal" }}>
                  Rp {customer.debt.toLocaleString("id-ID")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
