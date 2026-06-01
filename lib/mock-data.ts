import type { Customer } from "./types";

export const products = [
  { id: "BRG-001", name: "Beras Premium 5kg", price: 78500, stock: 55, category: "Sembako" },
  { id: "BRG-002", name: "Minyak Goreng 2L", price: 38500, stock: 42, category: "Sembako" },
  { id: "BRG-003", name: "Gula Pasir 1kg", price: 16500, stock: 120, category: "Sembako" },
  { id: "BRG-004", name: "Tepung Terigu 1kg", price: 13000, stock: 80, category: "Sembako" },
  { id: "MKN-001", name: "Nasi Goreng Spesial", price: 28000, stock: 99, category: "Makanan" },
  { id: "MKN-002", name: "Ayam Bakar", price: 32000, stock: 99, category: "Makanan" },
  { id: "MKN-003", name: "Soto Ayam", price: 22000, stock: 99, category: "Makanan" },
  { id: "MNM-001", name: "Es Teh Manis", price: 5000, stock: 99, category: "Minuman" },
  { id: "MNM-002", name: "Jus Jeruk", price: 12000, stock: 99, category: "Minuman" },
];

export const customers: Customer[] = [
  { code: "CUS-001", name: "PT Maju Jaya", phone: "081234567890", member: "Gold", debt: 1200000 },
  { code: "CUS-002", name: "Resto Sejahtera", phone: "089876543210", member: "Regular", debt: 0 },
  { code: "CUS-003", name: "Warung Bu Sari", phone: "082345678901", member: "Silver", debt: 500000 },
  { code: "CUS-004", name: "Toko Pak Budi", phone: "085678901234", member: "Platinum", debt: 0 },
  { code: "CUS-005", name: "UD Karya Mandiri", phone: "087654321098", member: "Regular", debt: 250000 },
];

export const summary = [
  { label: "Penjualan Hari Ini", value: "Rp 4.250.000" },
  { label: "Transaksi Hold", value: "7" },
  { label: "Piutang Aktif", value: "Rp 2.100.000" },
  { label: "Cabang Aktif", value: "3" },
];
