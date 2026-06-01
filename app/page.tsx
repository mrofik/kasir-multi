import Link from "next/link";
import { summary } from "@/lib/mock-data";

export default function Home() {
  return (
    <section className="grid" style={{ gap: "1.25rem" }}>
      <div className="card">
        <h2 className="title">Dashboard</h2>
        <p className="muted">
          Starter aplikasi sesuai spesifikasi: POS grosir + restoran, multi-cabang, multi-level harga,
          hold transaksi, QRIS, tunda bayar, dan PWA.
        </p>
      </div>

      <div className="grid grid-2">
        {summary.map((item) => (
          <article key={item.label} className="card">
            <p className="muted">{item.label}</p>
            <h3>{item.value}</h3>
          </article>
        ))}
      </div>

      <div className="card">
        <h3>Quick Actions</h3>
        <div className="actions">
          <Link href="/kasir/retail"><button>Mulai Kasir Grosir</button></Link>
          <Link href="/kasir/restaurant"><button className="secondary">Mulai Kasir Resto</button></Link>
          <Link href="/transactions/held"><button className="secondary">Lihat Transaksi Hold</button></Link>
        </div>
      </div>
    </section>
  );
}
