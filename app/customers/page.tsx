const customers = [
  { code: "CUS-001", name: "PT Maju Jaya", member: "Gold", debt: 1200000 },
  { code: "CUS-002", name: "Resto Sejahtera", member: "Regular", debt: 0 },
];

export default function CustomersPage() {
  return (
    <section className="grid" style={{ gap: "1rem" }}>
      <div className="card">
        <h2 className="title">Manajemen Customer</h2>
        <p className="muted">Data pelanggan, member level, dan piutang.</p>
      </div>

      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th>Kode</th>
              <th>Nama</th>
              <th>Level Member</th>
              <th>Piutang</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <tr key={customer.code}>
                <td>{customer.code}</td>
                <td>{customer.name}</td>
                <td>{customer.member}</td>
                <td>Rp {customer.debt.toLocaleString("id-ID")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
