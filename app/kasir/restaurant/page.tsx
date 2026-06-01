import { products } from "@/lib/mock-data";

const tables = ["A1", "A2", "A3", "B1", "B2", "VIP"];

export default function RestaurantPage() {
  return (
    <section className="grid" style={{ gap: "1rem" }}>
      <div className="card">
        <h2 className="title">Kasir Restoran</h2>
        <p className="muted">Starter mode meja, split bill, dan kitchen print.</p>
      </div>

      <div className="grid grid-2">
        <div className="card">
          <h3>Table Management</h3>
          <div className="grid grid-3">
            {tables.map((table) => (
              <article key={table} className="card">
                <strong>Meja {table}</strong>
                <p className="muted">Status: Available</p>
                <button className="secondary">Buka Order</button>
              </article>
            ))}
          </div>
        </div>

        <div className="card">
          <h3>Menu Populer</h3>
          <ul className="list">
            {products
              .filter((item) => item.category === "Makanan")
              .map((item) => (
                <li key={item.id}>
                  {item.name} — Rp {item.price.toLocaleString("id-ID")}
                </li>
              ))}
          </ul>
          <div className="actions" style={{ marginTop: "1rem" }}>
            <button>Split Bill</button>
            <button className="secondary">Hold Order</button>
            <button className="secondary">Print Kitchen</button>
          </div>
        </div>
      </div>
    </section>
  );
}
