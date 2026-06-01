const sections = [
  "General Settings",
  "Printer Settings (58mm/80mm)",
  "Receipt Settings",
  "Tax & Discount Settings",
  "Payment Settings (Tunai, QRIS, Tunda Bayar)",
  "Role & Permission",
  "Branch Settings",
];

export default function SettingsPage() {
  return (
    <section className="grid" style={{ gap: "1rem" }}>
      <div className="card">
        <h2 className="title">Settings</h2>
        <p className="muted">Pusat konfigurasi aplikasi POS multi-cabang.</p>
      </div>

      <div className="card">
        <ul className="list">
          {sections.map((section) => (
            <li key={section}>{section}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
