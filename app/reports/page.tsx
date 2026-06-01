const reports = [
  "Laporan Penjualan Harian",
  "Laporan Pendapatan",
  "Laporan Per Metode Pembayaran (Tunai/QRIS/Piutang)",
  "Laporan Produk Terlaris",
  "Laporan Piutang",
  "Laporan Multi-Cabang",
];

export default function ReportsPage() {
  return (
    <section className="grid" style={{ gap: "1rem" }}>
      <div className="card">
        <h2 className="title">Laporan</h2>
        <p className="muted">Starter daftar modul laporan sesuai spesifikasi.</p>
      </div>

      <div className="card">
        <ul className="list">
          {reports.map((report) => (
            <li key={report}>{report}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
