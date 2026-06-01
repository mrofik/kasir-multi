import { products } from "@/lib/mock-data";

export default function ProductsPage() {
  return (
    <section className="grid" style={{ gap: "1rem" }}>
      <div className="card">
        <h2 className="title">Manajemen Produk</h2>
        <p className="muted">Starter CRUD produk, kategori, stok, dan multi-level pricing.</p>
      </div>

      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th>Kode</th>
              <th>Nama</th>
              <th>Kategori</th>
              <th>Harga Dasar</th>
              <th>Stok</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>{product.id}</td>
                <td>{product.name}</td>
                <td>{product.category}</td>
                <td>Rp {product.price.toLocaleString("id-ID")}</td>
                <td>{product.stock}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
