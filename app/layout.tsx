import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kasir Multi",
  description: "POS PWA untuk toko grosir dan restoran",
  manifest: "/manifest.webmanifest",
};

const links = [
  { href: "/", label: "Dashboard" },
  { href: "/kasir/retail", label: "Kasir Grosir" },
  { href: "/kasir/restaurant", label: "Kasir Resto" },
  { href: "/transactions/held", label: "Hold" },
  { href: "/products", label: "Produk" },
  { href: "/customers", label: "Customer" },
  { href: "/reports", label: "Laporan" },
  { href: "/settings", label: "Settings" },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body>
        <header className="header">
          <div>
            <h1>Kasir Multi</h1>
            <p>POS Grosir & Restoran (PWA-ready)</p>
          </div>
        </header>

        <nav className="nav">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="nav-link">
              {link.label}
            </Link>
          ))}
        </nav>

        <main className="container">{children}</main>
      </body>
    </html>
  );
}
