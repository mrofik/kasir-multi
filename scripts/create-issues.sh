#!/bin/bash
# Script untuk membuat GitHub Issues Kasir Multi POS
# Jalankan: bash scripts/create-issues.sh
# Pastikan sudah login gh CLI: gh auth login

REPO="mrofik/kasir-multi"

echo "🚀 Membuat GitHub Issues untuk Kasir Multi POS..."
echo ""

# ─────────────────────────────────────────
# ISSUE 1: EPIC / Master Feature List
# ─────────────────────────────────────────
gh issue create --repo "$REPO" \
  --title "📦 [EPIC] Kasir Multi POS - Master Feature List" \
  --body "## 📋 Ringkasan Proyek

Kasir Multi adalah aplikasi Point of Sale (POS) modern untuk **toko grosir dan restoran** berbasis **PWA** (Progressive Web App) yang responsif di mobile, tablet, dan desktop.

## 🎯 Fitur Utama

| Fitur | Deskripsi |
|-------|-----------|
| 2 Tampilan Kasir | Kasir Grosir & Kasir Restoran |
| Multi-Level Pricing | Berdasarkan qty, member, nominal transaksi |
| Multi-Cabang | Pengelolaan beberapa toko/outlet |
| Hold Transaksi | Simpan & lanjutkan transaksi kapan saja |
| Keyboard Shortcuts | Akses cepat di halaman kasir |
| Print Thermal | 58mm & 80mm, USB/Network/Bluetooth |
| Pembayaran | Tunai, QRIS, Tunda Bayar, Kartu, Cek |
| PWA | Installable, offline-ready |
| Laporan Lengkap | Pendapatan, stok, piutang, dll |
| Pengaturan Lengkap | Printer, pajak, diskon, struk |

## 📎 Referensi
Lihat file \`PROJECT_SPECIFICATION.md\` untuk detail lengkap spesifikasi proyek.

## 🗺️ Development Phases
- Phase 1: Core Setup (Week 1-2)
- Phase 2: Kasir Grosir (Week 3-4)
- Phase 3: Kasir Restoran (Week 5-6)
- Phase 4: Multi-Level Pricing (Week 7)
- Phase 5: Laporan & Analytics (Week 8-9)
- Phase 6: Settings & Konfigurasi (Week 10)
- Phase 7: Produk & Inventori (Week 11-12)
- Phase 8: Multi-Cabang (Week 13-14)
- Phase 9: PWA & Mobile (Week 15-16)
- Phase 10: Testing & Deployment (Week 17-18)"
echo "✅ Issue EPIC dibuat"

# ─────────────────────────────────────────
# ISSUE 2: Phase 1 - Core Setup
# ─────────────────────────────────────────
gh issue create --repo "$REPO" \
  --title "🏗️ [Phase 1] Core Setup - Project Initialization, Auth & User Management" \
  --body "## 📋 Deskripsi
Setup fondasi aplikasi: inisialisasi proyek, desain database, autentikasi, dan manajemen user/role/cabang.

## ✅ Task List
- [ ] Project initialization (Next.js + TailwindCSS + PWA config)
- [ ] Database design & implementasi (PostgreSQL)
- [ ] Authentication system (JWT + Session)
- [ ] User management (CRUD: Admin, Manager, Cashier, Staff)
- [ ] Role & permission system (RBAC)
- [ ] Branch management dasar (multi-cabang)
- [ ] Activity logging (audit trail)
- [ ] Setup CI/CD pipeline

## 📅 Target
Week 1-2"
echo "✅ Issue Phase 1 dibuat"

# ─────────────────────────────────────────
# ISSUE 3: Phase 2 - Kasir Grosir
# ─────────────────────────────────────────
gh issue create --repo "$REPO" \
  --title "🛒 [Phase 2] Modul Kasir Grosir (Retail POS)" \
  --body "## 📋 Deskripsi
Implementasi halaman kasir untuk toko grosir dengan fitur lengkap POS.

## ✅ Task List

### Tampilan & UI
- [ ] Layout halaman kasir grosir (split: produk + cart)
- [ ] Product list dengan search & filter
- [ ] Barcode scanner input
- [ ] Shopping cart management (add, remove, update qty)

### Transaksi
- [ ] Customer selection
- [ ] Tax calculation otomatis
- [ ] Discount (manual & otomatis)
- [ ] Hold transaction (simpan & lanjutkan)
- [ ] Return / Refund processing

### Pembayaran
- [ ] Pembayaran tunai (input nominal, hitung kembalian)
- [ ] QRIS (generate QR dinamis per transaksi)
- [ ] Tunda bayar / piutang pelanggan
- [ ] Kartu debit/kredit
- [ ] Cek/Giro

### Printer
- [ ] Print struk thermal (58mm & 80mm)
- [ ] Reprint struk

### Keyboard Shortcuts
- [ ] F1-F10 shortcuts
- [ ] Ctrl+H Hold, Ctrl+R Resume, Ctrl+P Print
- [ ] Shortcut help overlay (F1)

## 📅 Target
Week 3-4"
echo "✅ Issue Phase 2 (Kasir Grosir) dibuat"

# ─────────────────────────────────────────
# ISSUE 4: Phase 3 - Kasir Restoran
# ─────────────────────────────────────────
gh issue create --repo "$REPO" \
  --title "🍽️ [Phase 3] Modul Kasir Restoran (Restaurant POS)" \
  --body "## 📋 Deskripsi
Implementasi halaman kasir untuk restoran dengan manajemen meja, order, dan kitchen.

## ✅ Task List

### Table Management
- [ ] Grid layout meja (table map)
- [ ] Status meja (available, occupied, reserved)
- [ ] Pilih / buka meja baru

### Order Management
- [ ] Menu display per kategori dengan gambar
- [ ] Add to order dengan qty & notes per item
- [ ] Order modification sebelum konfirmasi
- [ ] Hold order (simpan per meja)
- [ ] Move order ke meja lain

### Billing
- [ ] Split bill (per item / per orang)
- [ ] Table merging
- [ ] Pembayaran (tunai, QRIS, tunda bayar)

### Kitchen
- [ ] Print kitchen order (nota dapur)
- [ ] Kitchen display system (opsional)

## 📅 Target
Week 5-6"
echo "✅ Issue Phase 3 (Kasir Resto) dibuat"

# ─────────────────────────────────────────
# ISSUE 5: Phase 4 - Multi-Level Pricing
# ─────────────────────────────────────────
gh issue create --repo "$REPO" \
  --title "💰 [Phase 4] Multi-Level Pricing Engine" \
  --body "## 📋 Deskripsi
Implementasi engine harga multi-level yang otomatis menerapkan harga/diskon berdasarkan aturan yang dikonfigurasi.

## ✅ Task List

### Tipe Harga
- [ ] Quantity-based pricing (contoh: 1-5 pcs normal, 6-10 pcs diskon 5%, 11+ diskon 10%)
- [ ] Member-based pricing (Regular, Silver, Gold, Platinum)
- [ ] Amount-based pricing (transaksi > Rp500rb, > Rp1jt, dll)

### Rule Engine
- [ ] CRUD aturan harga (price level rules)
- [ ] Multiple rules per produk
- [ ] Priority rule handling (rule mana yang diutamakan)
- [ ] Seasonal pricing / override sementara
- [ ] Bulk pricing untuk grosir

### UI & Konfigurasi
- [ ] Halaman konfigurasi price levels
- [ ] Apply rules ke produk / kategori
- [ ] Preview harga sebelum simpan
- [ ] Auto-apply saat kasir input qty / pilih customer

## 📅 Target
Week 7"
echo "✅ Issue Phase 4 (Multi-Level Pricing) dibuat"

# ─────────────────────────────────────────
# ISSUE 6: Phase 5 - Reports & Analytics
# ─────────────────────────────────────────
gh issue create --repo "$REPO" \
  --title "📊 [Phase 5] Laporan & Analytics" \
  --body "## 📋 Deskripsi
Implementasi modul laporan lengkap dengan berbagai tipe laporan dan opsi ekspor.

## ✅ Task List

### Laporan Penjualan
- [ ] Laporan penjualan harian / mingguan / bulanan / custom range
- [ ] Laporan per kasir
- [ ] Laporan per metode pembayaran (tunai, QRIS, piutang, kartu)
- [ ] Laporan per pelanggan
- [ ] Laporan produk terlaris & terburuk

### Laporan Keuangan
- [ ] Laporan pendapatan (revenue)
- [ ] Laporan pajak (PPh, PPN)
- [ ] Laporan piutang / hutang pelanggan
- [ ] Perbandingan periode (MoM, YoY)

### Laporan Stok
- [ ] Laporan stok saat ini
- [ ] Laporan mutasi stok
- [ ] Laporan valuasi inventori
- [ ] Alert stok menipis

### Multi-Cabang
- [ ] Laporan per cabang
- [ ] Laporan konsolidasi semua cabang
- [ ] Perbandingan antar cabang

### Ekspor
- [ ] Download PDF
- [ ] Download Excel/CSV
- [ ] Print ke thermal printer
- [ ] Kirim laporan via email (opsional)

## 📅 Target
Week 8-9"
echo "✅ Issue Phase 5 (Laporan) dibuat"

# ─────────────────────────────────────────
# ISSUE 7: Phase 6 - Settings
# ─────────────────────────────────────────
gh issue create --repo "$REPO" \
  --title "⚙️ [Phase 6] Pengaturan & Konfigurasi Aplikasi" \
  --body "## 📋 Deskripsi
Implementasi modul pengaturan lengkap untuk konfigurasi semua aspek aplikasi.

## ✅ Task List

### General Settings
- [ ] Informasi toko / cabang (nama, alamat, telepon, email)
- [ ] Upload logo bisnis
- [ ] Timezone & format tanggal
- [ ] Format mata uang & angka

### Printer Settings
- [ ] Deteksi & konfigurasi printer thermal
- [ ] Pilih ukuran kertas (58mm, 80mm)
- [ ] Test print
- [ ] Multiple printer management (kasir, dapur)
- [ ] Koneksi USB, Network, Bluetooth

### Receipt Settings
- [ ] Header struk (nama toko, alamat, telepon)
- [ ] Footer struk (pesan terima kasih, kontak)
- [ ] Show/hide komponen struk (pajak, diskon, barcode, QR, dll)
- [ ] Font size struk
- [ ] Preview struk

### Tax Settings
- [ ] Jenis pajak (PPh 21, PPN 11%, dll)
- [ ] Persentase pajak per produk/kategori
- [ ] Kalkulasi inclusive / exclusive

### Discount Settings
- [ ] Tipe diskon (persentase, nominal tetap)
- [ ] Batas maksimum diskon
- [ ] Approval workflow diskon besar
- [ ] Permission level kasir

### Payment Settings
- [ ] Enable/disable metode pembayaran
- [ ] Konfigurasi QRIS (merchant ID, API key gateway)
- [ ] Konfigurasi tunda bayar (approval, batas piutang per pelanggan)

### User & Role Management
- [ ] CRUD user & role
- [ ] Assignment permission per role
- [ ] Activity log & audit trail
- [ ] Kebijakan password

### Backup & Restore
- [ ] Manual backup database
- [ ] Jadwal backup otomatis
- [ ] Restore dari backup

## 📅 Target
Week 10"
echo "✅ Issue Phase 6 (Settings) dibuat"

# ─────────────────────────────────────────
# ISSUE 8: Phase 7 - Product & Inventory
# ─────────────────────────────────────────
gh issue create --repo "$REPO" \
  --title "📦 [Phase 7] Manajemen Produk & Inventori" \
  --body "## 📋 Deskripsi
Implementasi manajemen produk, stok, pembelian, dan supplier.

## ✅ Task List

### Product Management
- [ ] CRUD produk (nama, kode, barcode, harga beli/jual, stok, satuan, gambar)
- [ ] Kategori produk (CRUD, reorder)
- [ ] Satuan produk (pcs, dus, kg, ltr, dll)
- [ ] Bulk import produk via CSV/Excel
- [ ] Barcode generator & print label sticker
- [ ] Upload foto produk

### Stock Management
- [ ] Tampilan stok saat ini per produk
- [ ] Stock adjustment (koreksi stok manual)
- [ ] Stock opname (hitungan fisik)
- [ ] Low stock alert & notifikasi
- [ ] Riwayat mutasi stok (masuk, keluar, penyesuaian)

### Purchase Orders
- [ ] CRUD Purchase Order (PO)
- [ ] Terima barang (goods receipt) — update stok otomatis
- [ ] Partial receipt
- [ ] Riwayat pembelian per supplier

### Supplier Management
- [ ] CRUD data supplier
- [ ] Riwayat pembelian per supplier

## 📅 Target
Week 11-12"
echo "✅ Issue Phase 7 (Produk & Inventori) dibuat"

# ─────────────────────────────────────────
# ISSUE 9: Phase 8 - Multi-Cabang
# ─────────────────────────────────────────
gh issue create --repo "$REPO" \
  --title "🏢 [Phase 8] Multi-Cabang Support" \
  --body "## 📋 Deskripsi
Implementasi fitur multi-cabang untuk mengelola lebih dari satu toko/outlet dari satu sistem.

## ✅ Task List

### Branch Management
- [ ] CRUD cabang (nama, alamat, kode, kontak)
- [ ] Setting khusus per cabang (pajak, printer, struk, dll)
- [ ] Assign user ke satu atau beberapa cabang
- [ ] Switch cabang (untuk user yang punya akses multi cabang)

### Data Isolation
- [ ] Produk & stok terpisah per cabang
- [ ] Transaksi terpisah per cabang
- [ ] Pelanggan bisa share antar cabang (configurable)

### Centralized Reporting
- [ ] Laporan gabungan semua cabang
- [ ] Filter laporan per cabang
- [ ] Perbandingan performa antar cabang (dashboard)

### Synchronization
- [ ] Sinkronisasi produk master ke semua cabang (opsional)
- [ ] Transfer stok antar cabang
- [ ] Real-time sync via WebSocket (opsional)

## 📅 Target
Week 13-14"
echo "✅ Issue Phase 8 (Multi-Cabang) dibuat"

# ─────────────────────────────────────────
# ISSUE 10: Phase 9 - PWA & Mobile
# ─────────────────────────────────────────
gh issue create --repo "$REPO" \
  --title "📱 [Phase 9] PWA & Mobile Optimization" \
  --body "## 📋 Deskripsi
Implementasi Progressive Web App (PWA) dan optimasi tampilan untuk semua perangkat.

## ✅ Task List

### PWA Setup
- [ ] Service Worker (Workbox) untuk caching & offline
- [ ] Web App Manifest (nama, icon, theme color, display: standalone)
- [ ] Install prompt (Add to Home Screen)
- [ ] Standalone / full-screen experience

### Offline Functionality
- [ ] Deteksi offline & notifikasi ke user
- [ ] Local storage dengan IndexedDB (Dexie.js)
- [ ] Background sync (transaksi offline diupload saat online)
- [ ] Cache strategy (static assets, API responses)

### Responsive Design
- [ ] Mobile layout (<640px) — Smartphone
- [ ] Tablet layout (640-1024px) — iPad, Android tablet
- [ ] Desktop layout (>1024px) — Laptop, Desktop, POS terminal
- [ ] Touch-friendly UI (tombol besar, swipe gestures)
- [ ] Keyboard & barcode scanner friendly

### Performance
- [ ] Code splitting & lazy loading
- [ ] Image optimization (WebP, lazy load)
- [ ] Bundle size optimization
- [ ] Lighthouse PWA score ≥ 90

### Device Support
- [ ] Android (Chrome PWA install)
- [ ] iOS (Safari Web Clip / Add to Home Screen)
- [ ] Windows/Mac Desktop (Chrome/Edge PWA)
- [ ] POS Terminal Browser

## 📅 Target
Week 15-16"
echo "✅ Issue Phase 9 (PWA & Mobile) dibuat"

# ─────────────────────────────────────────
# ISSUE 11: Phase 10 - Testing & Deployment
# ─────────────────────────────────────────
gh issue create --repo "$REPO" \
  --title "🧪 [Phase 10] Testing, QA & Deployment" \
  --body "## 📋 Deskripsi
Testing menyeluruh, bug fixing, dan deployment ke production.

## ✅ Task List

### Testing
- [ ] Unit testing (komponen & fungsi bisnis)
- [ ] Integration testing (alur transaksi end-to-end)
- [ ] User Acceptance Testing (UAT) dengan stakeholder
- [ ] Cross-browser testing (Chrome, Firefox, Safari, Edge)
- [ ] Cross-device testing (Android, iOS, Desktop)
- [ ] Performance testing (load time, transaksi volume tinggi)

### Security
- [ ] Security audit (CSRF, XSS, SQL Injection)
- [ ] Authentication & authorization review
- [ ] Data encryption review
- [ ] Rate limiting & DDoS protection

### Bug Fixes
- [ ] Fix bug dari hasil testing
- [ ] Fix UI/UX issues dari feedback UAT

### Documentation
- [ ] Dokumentasi API (Swagger/OpenAPI)
- [ ] User manual / panduan penggunaan
- [ ] Deployment guide

### Deployment
- [ ] Setup server / cloud (VPS, Docker, atau managed cloud)
- [ ] Environment config (production)
- [ ] SSL certificate & domain
- [ ] Monitoring & alerting (Sentry, Uptime Robot)
- [ ] Backup production database

## 📅 Target
Week 17-18"
echo "✅ Issue Phase 10 (Testing & Deployment) dibuat"

# ─────────────────────────────────────────
# ISSUE 12: Hold Transaction Feature
# ─────────────────────────────────────────
gh issue create --repo "$REPO" \
  --title "⏸️ [Feature] Hold & Resume Transaction" \
  --body "## 📋 Deskripsi
Fitur menyimpan transaksi yang sedang berjalan untuk dilanjutkan kapan saja, tanpa kehilangan data keranjang belanja.

## ✅ Task List
- [ ] Tombol Hold di halaman kasir (shortcut: Ctrl+H / F4)
- [ ] Input alasan hold (opsional)
- [ ] Simpan state transaksi lengkap (produk, qty, customer, diskon, catatan)
- [ ] Tampilkan daftar held transactions dengan shortcut (Ctrl+R)
- [ ] Resume held transaction dengan 1 klik
- [ ] Delete held transaction
- [ ] Multiple hold sekaligus (bisa hold lebih dari 1 transaksi)
- [ ] Auto-expire hold setelah X jam (configurable di settings)
- [ ] Notifikasi hold yang akan kadaluarsa
- [ ] Hold history & audit log

## 📅 Masuk ke Phase 2 & 3"
echo "✅ Issue Hold Transaction dibuat"

# ─────────────────────────────────────────
# ISSUE 13: QRIS Payment Integration
# ─────────────────────────────────────────
gh issue create --repo "$REPO" \
  --title "📲 [Feature] Integrasi QRIS Payment" \
  --body "## 📋 Deskripsi
Implementasi pembayaran via QRIS (Quick Response Code Indonesian Standard) sesuai standar BI (Bank Indonesia).

## ✅ Task List

### Static QR
- [ ] Setting merchant QRIS static (upload QR merchant)
- [ ] Tampilkan QR di layar kasir untuk di-scan pelanggan
- [ ] Konfirmasi pembayaran manual oleh kasir
- [ ] Cetak QR pada struk

### Dynamic QR
- [ ] Generate QR Code dinamis per transaksi (jumlah sudah ter-embed)
- [ ] Integrasi payment gateway (Midtrans / Xendit / bank langsung)
- [ ] Callback webhook — transaksi auto-complete setelah pembayaran
- [ ] Timeout & cancel jika QR tidak di-scan dalam waktu tertentu

### UI/UX
- [ ] Tampilan QR yang besar & jelas di layar
- [ ] Countdown timer expiry QR
- [ ] Loading / waiting state
- [ ] Animasi sukses / gagal

### Receipt
- [ ] Tampilkan info QRIS pada struk (metode, reference number)
- [ ] Nomor referensi transaksi QRIS

## 📅 Masuk ke Phase 2 & 6"
echo "✅ Issue QRIS Payment dibuat"

# ─────────────────────────────────────────
# ISSUE 14: Customer Debt / Tunda Bayar
# ─────────────────────────────────────────
gh issue create --repo "$REPO" \
  --title "💳 [Feature] Tunda Bayar / Manajemen Piutang Pelanggan" \
  --body "## 📋 Deskripsi
Fitur pembayaran tunda (bayar nanti) dan manajemen piutang pelanggan secara komprehensif.

## ✅ Task List

### Tunda Bayar di Kasir
- [ ] Opsi 'Tunda Bayar / Bayar Nanti' saat checkout
- [ ] Wajib pilih / input pelanggan untuk tunda bayar
- [ ] Batas kredit per pelanggan (configurable di master customer)
- [ ] Warning jika melebihi batas kredit
- [ ] Approval workflow (kasir perlu approval manager untuk piutang di atas batas)

### Manajemen Piutang
- [ ] Daftar piutang per pelanggan
- [ ] Total outstanding per pelanggan
- [ ] Riwayat transaksi piutang (detail per transaksi)
- [ ] Input pembayaran piutang (sebagian atau penuh)
- [ ] Print bukti pembayaran piutang

### Notifikasi & Reminder
- [ ] Reminder piutang jatuh tempo (opsional)
- [ ] Laporan piutang aging (0-30hr, 31-60hr, 61-90hr, >90hr)

### Laporan Piutang
- [ ] Daftar piutang outstanding
- [ ] Riwayat pembayaran piutang
- [ ] Ekspor laporan piutang

## 📅 Masuk ke Phase 2, 5, & 6"
echo "✅ Issue Tunda Bayar / Piutang dibuat"

# ─────────────────────────────────────────
# ISSUE 15: Keyboard Shortcuts
# ─────────────────────────────────────────
gh issue create --repo "$REPO" \
  --title "⌨️ [Feature] Keyboard Shortcuts di Halaman Kasir" \
  --body "## 📋 Deskripsi
Implementasi keyboard shortcut lengkap di halaman kasir untuk mempercepat operasional.

## 📋 Daftar Shortcut

| Shortcut | Aksi |
|----------|------|
| F1 | Tampilkan help / daftar shortcut |
| F2 | Clear cart (kosongkan keranjang) |
| F3 | Buka dialog diskon |
| F4 | Hold transaction |
| F5 | Refresh daftar produk |
| F6 | Info pelanggan |
| F7 | Print struk |
| F8 | Buka dialog pembayaran |
| F9 | Return / Refund |
| F10 | Buka settings |
| Ctrl+H | Hold transaction |
| Ctrl+R | Resume held transaction |
| Ctrl+P | Print struk |
| Ctrl+S | Save / selesaikan transaksi |
| Ctrl+Q | Quick report |
| Enter | Konfirmasi aksi |
| Escape | Batal / tutup dialog |
| + / - | Tambah / kurangi qty item di cart |
| / | Fokus ke search produk |

## ✅ Task List
- [ ] Implementasi semua shortcut di atas
- [ ] Shortcut help overlay (tekan F1)
- [ ] Shortcut tidak aktif saat user sedang input di form
- [ ] Customizable shortcuts (opsional)
- [ ] Shortcut untuk kasir restoran (berbeda dengan grosir)

## 📅 Masuk ke Phase 2 & 3"
echo "✅ Issue Keyboard Shortcuts dibuat"

echo ""
echo "🎉 Semua 15 issues berhasil dibuat!"
echo "Cek di: https://github.com/$REPO/issues"
