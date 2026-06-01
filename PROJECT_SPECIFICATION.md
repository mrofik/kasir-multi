# 📋 Kasir Multi - Spesifikasi Proyek POS Aplikasi

**Versi:** 1.0  
**Tanggal:** Juni 2026  
**Status:** Planning & Design Phase

---

## 🎯 Ringkasan Proyek

Kasir Multi adalah aplikasi Point of Sale (POS) modern yang dirancang khusus untuk **toko grosir dan restoran** dengan arsitektur multi-cabang. Aplikasi ini dibangun sebagai **Progressive Web App (PWA)** yang dapat diakses dari berbagai device (mobile, tablet, desktop) dengan interface yang fully responsive.

**Fitur Utama:**
- 2 tampilan halaman kasir yang berbeda (Grosir & Restoran)
- Management produk, customer, dan transaksi
- Multi-level pricing (berbasis quantity, member, atau nominal transaksi)
- Multi-cabang support
- Hold transaksi
- Keyboard shortcuts
- Print thermal
- Laporan pendapatan
- Pengaturan aplikasi lengkap

---

## 🏗️ Arsitektur Teknis

### **Technology Stack**

```
Frontend:
├── Framework: React 18+ / Next.js 14+ (PWA-ready)
├── State Management: Zustand / Redux Toolkit
├── Database: IndexedDB / SQLite (untuk offline support)
├── UI Framework: TailwindCSS / Material-UI
├── Responsive: Mobile-First Design
└── PWA: Workbox / SWR untuk caching

Backend:
├── Framework: Node.js + Express / Next.js API Routes
├── Database: PostgreSQL / MySQL
├── Authentication: JWT + Session-based
├── Real-time: WebSocket / Socket.io (optional)
└── Deployment: Docker + Kubernetes / VPS

Mobile/Desktop:
├── Cross-platform: Electron (optional untuk desktop)
├── Package: APK via PWA Install (Android)
└── Package: Web Clip (iOS)
```

### **Fitur PWA**
- ✅ Installable di home screen
- ✅ Offline functionality
- ✅ Push notifications
- ✅ Background sync
- ✅ Full responsiveness

---

## 📊 Struktur Database

### **Core Entities**

```
1. BRANCHES (Cabang)
   - branch_id (PK)
   - branch_name
   - branch_code
   - address
   - phone
   - email
   - is_active
   - created_at

2. USERS (Pengguna/Kasir)
   - user_id (PK)
   - branch_id (FK)
   - username
   - password (hashed)
   - fullname
   - role (admin, manager, cashier, staff)
   - permissions
   - is_active
   - created_at

3. PRODUCTS (Produk)
   - product_id (PK)
   - branch_id (FK)
   - product_code
   - product_name
   - description
   - category_id (FK)
   - unit_id (FK)
   - purchase_price
   - selling_price
   - stock_quantity
   - min_stock
   - barcode
   - image_url
   - is_active
   - created_at

4. PRODUCT_CATEGORIES
   - category_id (PK)
   - branch_id (FK)
   - category_name
   - is_active

5. UNITS (Satuan)
   - unit_id (PK)
   - branch_id (FK)
   - unit_name (pcs, dus, kg, ltr, dll)
   - is_active

6. PRICE_LEVELS (Multi-Level Pricing)
   - price_level_id (PK)
   - branch_id (FK)
   - level_name
   - level_type (quantity, member, amount)
   - is_active
   - created_at

7. PRICE_LEVEL_ITEMS
   - item_id (PK)
   - price_level_id (FK)
   - product_id (FK)
   - min_qty / member_id / min_amount
   - max_qty / max_amount (optional)
   - discount_percentage
   - fixed_price
   - priority

8. CUSTOMERS (Pelanggan)
   - customer_id (PK)
   - branch_id (FK)
   - customer_code
   - customer_name
   - phone
   - email
   - address
   - member_type (regular, member_gold, member_platinum, dll)
   - member_since
   - total_purchase
   - total_debt
   - is_active
   - created_at

9. TRANSACTIONS (Transaksi/Penjualan)
   - transaction_id (PK)
   - branch_id (FK)
   - user_id (FK)
   - customer_id (FK)
   - transaction_type (sale, return, payment)
   - transaction_date
   - status (pending, hold, completed, cancelled)
   - subtotal
   - tax_amount
   - discount_amount
   - total_amount
   - paid_amount
   - change_amount
   - payment_method (cash, qris, card, check, debt/tunda_bayar)
   - notes
   - receipt_printed
   - created_at
   - updated_at

10. TRANSACTION_ITEMS
    - item_id (PK)
    - transaction_id (FK)
    - product_id (FK)
    - quantity
    - unit_price
    - discount_amount
    - discount_percentage
    - subtotal
    - created_at

11. HELD_TRANSACTIONS (Hold Transaksi)
    - hold_id (PK)
    - transaction_id (FK)
    - branch_id (FK)
    - user_id (FK)
    - customer_id (FK)
    - hold_date
    - hold_reason
    - transaction_data (JSON)
    - resumed_at (nullable)
    - expired_at

12. PAYMENTS (Pembayaran)
    - payment_id (PK)
    - transaction_id (FK)
    - payment_method
    - amount
    - reference_number
    - payment_date
    - created_at

13. SETTINGS (Pengaturan)
    - setting_id (PK)
    - branch_id (FK)
    - setting_key
    - setting_value
    - data_type
    - created_at
    - updated_at

14. PRINTER_SETTINGS
    - printer_id (PK)
    - branch_id (FK)
    - printer_name
    - printer_model
    - connection_type (usb, network, bluetooth)
    - ip_address
    - port
    - paper_size (58mm, 80mm)
    - is_default
    - is_active

15. STOCK_MOVEMENTS
    - movement_id (PK)
    - branch_id (FK)
    - product_id (FK)
    - movement_type (in, out, adjustment)
    - quantity
    - reference_type (purchase, sale, return, adjustment)
    - reference_id
    - notes
    - created_at

16. PURCHASE_ORDERS
    - po_id (PK)
    - branch_id (FK)
    - supplier_id (FK)
    - po_date
    - delivery_date
    - status (pending, received, partial)
    - total_amount
    - notes
    - created_at

17. SUPPLIERS
    - supplier_id (PK)
    - branch_id (FK)
    - supplier_code
    - supplier_name
    - contact_person
    - phone
    - email
    - address
    - is_active
```

---

## 🎨 Struktur UI & Pages

### **1. Authentication Module**
```
📄 /login
   └─ Login dengan username & password
   └─ Remember me option
   └─ Forgot password link

📄 /register (Admin only)
   └─ Register user baru
```

### **2. Dashboard & Analytics**
```
📄 /dashboard
   ├─ Overview (Today's Sales, Outstanding Debt, Pending Transactions)
   ├─ Sales Chart (Daily, Weekly, Monthly)
   ├─ Top Products
   ├─ Payment Status
   └─ Quick Actions
```

### **3. Sales Module (Kasir)**
```
📄 /kasir/retail (Toko Grosir)
   ├─ Product List dengan search & filter
   ├─ Barcode Scanner input
   ├─ Shopping Cart
   ├─ Quantity Adjuster
   ├─ Discount/Promo
   ├─ Payment Methods
   ├─ Customer Selection
   ├─ Hold Transaction Button
   ├─ Print Receipt
   └─ Keyboard Shortcuts Panel

📄 /kasir/restaurant (Restoran)
   ├─ Table Management Grid
   ├─ Category-based Menu
   ├─ Item Cards dengan images
   ├─ Order List per table
   ├─ Qty Counter
   ├─ Notes per item
   ├─ Split Bill option
   ├─ Hold Order
   ├─ Print to Kitchen
   ├─ Move to Table
   └─ Payment Section
```

### **4. Held Transactions**
```
📄 /transactions/held
   ├─ List of held transactions
   ├─ Filters (date, cashier, customer)
   ├─ Resume transaction
   ├─ Delete held transaction
   └─ Expired transaction management
```

### **5. Product Management**
```
📄 /products
   ├─ Product List (table view)
   ├─ Add Product
   ├─ Edit Product
   ├─ Delete Product
   ├─ Bulk Import (CSV/Excel)
   ├─ Stock Management
   └─ Barcode Generator

📄 /products/categories
   ├─ Manage categories
   └─ Reorder categories

📄 /products/price-levels
   ├─ Create price level rules
   ├─ Edit price rules
   ├─ Quantity-based pricing
   ├─ Member-based pricing
   ├─ Amount-based pricing
   └─ Apply rules to products
```

### **6. Customer Management**
```
📄 /customers
   ├─ Customer List
   ├─ Add Customer
   ├─ Edit Customer
   ├─ Customer History
   ├─ Customer Debt Management
   ├─ Member Types Management
   └─ Customer Export

📄 /customers/debt
   ├─ Outstanding Debt List
   ├─ Payment tracking
   └─ Payment reminder
```

### **7. Transactions & Reports**
```
📄 /transactions
   ├─ Transaction History
   ├─ Transaction Detail
   ├─ Reprint Receipt
   ├─ Return/Refund
   ├─ Transaction Filters
   └─ Export to PDF/Excel

📄 /reports
   ├─ Sales Report (Daily/Weekly/Monthly/Custom)
   ├─ Revenue Report
   ├─ Product Sales Report
   ├─ Payment Methods Report
   ├─ Customer Sales Report
   ├─ Tax Report
   ├─ Inventory Report
   ├─ Debt Report
   └─ Export Options (PDF, Excel, Print)
```

### **8. Settings & Configuration**
```
📄 /settings/general
   ├─ Branch Information
   ├─ Business Name
   ├─ Logo Upload
   └─ Timezone

📄 /settings/printer
   ├─ Add Printer
   ├─ Printer Configuration
   ├─ Paper Size Selection (58mm, 80mm)
   ├─ Test Print
   └─ Default Printer Selection

📄 /settings/receipt
   ├─ Receipt Header Text
   ├─ Receipt Footer Text
   ├─ Show/Hide items (tax, discount, etc)
   ├─ Receipt Font Size
   └─ Preview

📄 /settings/tax
   ├─ Tax Type (PPh, PPN)
   ├─ Tax Percentage
   ├─ Apply Tax on specific items
   └─ Tax Calculation Method

📄 /settings/discount
   ├─ Global Discount Settings
   ├─ Discount Rules
   ├─ Max Discount Allowed
   └─ Cashier Permission Level

📄 /settings/users
   ├─ User Management
   ├─ Role Management
   ├─ Permissions Setup
   ├─ User Activity Log
   └─ Change Password

📄 /settings/branches
   ├─ List All Branches
   ├─ Add Branch
   ├─ Edit Branch
   ├─ Branch-specific settings
   └─ Switch Branch (if authorized)

📄 /settings/backup
   ├─ Database Backup
   ├─ Backup Schedule
   ├─ Restore from Backup
   └─ Backup History
```

### **9. Inventory Management**
```
📄 /inventory/stock
   ├─ Current Stock Level
   ├─ Stock Adjustment
   ├─ Stock Opname
   ├─ Low Stock Alert
   └─ Stock Movement History

📄 /inventory/purchase
   ├─ Purchase Order List
   ├─ Create Purchase Order
   ├─ Receive Goods
   ├─ Purchase History
   └─ Supplier Management
```

---

## ✨ Fitur-Fitur Utama

### **A. Kasir (Point of Sale)**

#### **Tampilan Grosir**
- ✅ Product browsing dengan kategori
- ✅ Barcode scanning
- ✅ Cart management (add, remove, update qty)
- ✅ Bulk quantity handling
- ✅ Customer selection
- ✅ Multi-level pricing (auto apply berdasarkan qty/member/amount)
- ✅ Manual discount option
- ✅ Tax calculation
- ✅ Multiple payment methods (tunai/cash, tunda bayar/piutang, QRIS, kartu, cek)
- ✅ QRIS payment integration (scan QR/static & dynamic QR)
- ✅ Tunda pembayaran / bayar nanti (piutang pelanggan)
- ✅ Change calculation
- ✅ Receipt printing (thermal 58mm/80mm)
- ✅ Hold transaction
- ✅ Keyboard shortcuts
- ✅ Refund/Return processing

#### **Tampilan Restoran**
- ✅ Table-based ordering
- ✅ Menu display dengan kategori dan gambar
- ✅ Add to order dengan qty
- ✅ Special notes per item
- ✅ Order modification before confirmation
- ✅ Split bill functionality
- ✅ Table merging
- ✅ Hold order (dapat di resume)
- ✅ Print to kitchen printer
- ✅ Payment per table/split
- ✅ Order history per table

### **B. Multi-Level Pricing**

#### **Tipe Pricing:**
1. **Quantity-Based**
   - 1-5 pcs: Harga normal
   - 6-10 pcs: Diskon 5%
   - 11-20 pcs: Diskon 10%
   - 21+ pcs: Diskon 15%

2. **Member-Based**
   - Regular: Harga normal
   - Member Silver: Diskon 5%
   - Member Gold: Diskon 10%
   - Member Platinum: Diskon 15%

3. **Amount-Based** (Minimum Transaction)
   - Transaksi Rp 500k-1jt: Diskon 3%
   - Transaksi Rp 1jt-5jt: Diskon 5%
   - Transaksi Rp 5jt+: Diskon 10%

#### **Fitur:**
- ✅ Automatic price calculation based on rules
- ✅ Multiple rules per product
- ✅ Priority rule handling
- ✅ Bulk pricing for wholesale
- ✅ Seasonal pricing override
- ✅ Rule configuration UI

### **C. Multi-Cabang Support**

#### **Fitur:**
- ✅ Separate branch data isolation
- ✅ Branch-specific settings
- ✅ Centralized reporting (all branches)
- ✅ User assignment per branch
- ✅ Stock synchronization (optional)
- ✅ Branch switching
- ✅ Inter-branch transfer

### **D. Hold & Resume Transaction**

#### **Fitur:**
- ✅ Save ongoing transaction
- ✅ Multiple held transactions
- ✅ Hold reason tracking
- ✅ Hold duration tracking
- ✅ Resume with one click
- ✅ Auto-expire old holds (configurable)
- ✅ Hold history

### **E. Keyboard Shortcuts**

```
Kasir Mode:
├─ F1: Help
├─ F2: Clear Cart
├─ F3: Discount
├─ F4: Hold Transaction
├─ F5: Refresh Products
├─ F6: Customer Info
├─ F7: Print Receipt
├─ F8: Payment
├─ F9: Return/Refund
├─ F10: Settings
├─ Ctrl+S: Save Transaction
├─ Ctrl+P: Print
├─ Ctrl+H: Hold Transaction
├─ Ctrl+R: Resume Held
├─ Ctrl+Q: Quick Report
├─ Enter: Confirm Action
├─ Escape: Cancel/Close
└─ +/- : Adjust Quantity
```

### **F. Printing System**

#### **Thermal Printer Support**
- ✅ 58mm & 80mm paper size
- ✅ USB, Network, Bluetooth connection
- ✅ Direct printing via browser API (Chrome)
- ✅ Multiple printer support
- ✅ Print queue management
- ✅ Offline print queue (PWA feature)

#### **Print Documents**
- ✅ Receipt (Transaction)
- ✅ Invoice (Detailed)
- ✅ Kitchen Order
- ✅ Daily Report
- ✅ Customer Statement
- ✅ Label/Sticker

### **G. Laporan & Analytics**

#### **Report Types**
- ✅ Daily Sales Summary
- ✅ Sales by Product Category
- ✅ Sales by Cashier
- ✅ Sales by Payment Method
- ✅ Sales by Customer
- ✅ Revenue Comparison (Period)
- ✅ Top Products
- ✅ Worst Selling Products
- ✅ Tax Report
- ✅ Debt Report (Outstanding)
- ✅ Stock Level Report
- ✅ Stock Movement Report
- ✅ Customer Purchase Report
- ✅ Inventory Valuation

#### **Export Options**
- ✅ PDF Download
- ✅ Excel/CSV Download
- ✅ Print to Thermal
- ✅ Email Report
- ✅ Schedule Report

### **H. Settings & Configuration**

#### **General Settings**
- ✅ Branch information
- ✅ Business logo
- ✅ Timezone & date format
- ✅ Currency & number format

#### **Printer Settings**
- ✅ Printer detection & configuration
- ✅ Paper size selection
- ✅ Test print
- ✅ Multiple printer management

#### **Receipt Settings**
- ✅ Receipt header text (company name, address)
- ✅ Receipt footer text (thank you, contact)
- ✅ Show/hide components
- ✅ Font customization
- ✅ Receipt preview

#### **Tax Settings**
- ✅ Tax types (PPh 21, PPN 10%, dll)
- ✅ Tax percentage
- ✅ Product-specific tax rules
- ✅ Tax calculation method
- ✅ Tax inclusion/exclusion in price

#### **Discount Settings**
- ✅ Discount type (percentage, fixed amount)
- ✅ Maximum discount allowed
- ✅ Discount approval workflow
- ✅ Cashier permission level

#### **Payment Method Settings**
- ✅ Enable/disable payment methods
- ✅ Tunai (Cash): kembalian otomatis
- ✅ QRIS: integrasi QR Code pembayaran (static & dynamic), scan to pay
- ✅ Tunda Bayar / Piutang: bayar nanti, approval & tracking
- ✅ Kartu Debit/Kredit
- ✅ Payment method names
- ✅ Approval for check/debt

#### **User & Role Management**
- ✅ User CRUD
- ✅ Role creation
- ✅ Permission assignment
- ✅ Activity logging
- ✅ Password policies

### **I. Payment Methods**

#### **Metode Pembayaran yang Didukung:**

1. **Tunai (Cash)**
   - Input nominal bayar
   - Hitung kembalian otomatis
   - Konfirmasi sebelum selesai

2. **QRIS**
   - Generate QR Code dinamis per transaksi
   - Support static QR (merchant QR)
   - Notifikasi pembayaran berhasil (callback)
   - Integrasi payment gateway (Midtrans, Xendit, atau QRIS mandiri)
   - Cetak QR pada struk

3. **Tunda Bayar / Bayar Nanti (Piutang)**
   - Simpan transaksi sebagai piutang pelanggan
   - Tracking outstanding debt per pelanggan
   - Pembayaran piutang sebagian atau penuh
   - Reminder otomatis (opsional)
   - Laporan piutang

4. **Kartu Debit/Kredit**
   - Input referensi transaksi
   - Konfirmasi manual

5. **Cek/Giro**
   - Input nomor cek dan tanggal jatuh tempo
   - Approval workflow

---



- ✅ User authentication (username/password)
- ✅ Role-based access control (RBAC)
- ✅ Permission management
- ✅ Activity logging & audit trail
- ✅ Data encryption (passwords, sensitive data)
- ✅ Session management & timeout
- ✅ Backup & recovery
- ✅ Data validation (server & client)
- ✅ CSRF protection
- ✅ Rate limiting

---

## 📱 Responsive Design Breakpoints

```
Mobile:      < 640px   (Phones)
Tablet:      640px - 1024px
Desktop:     > 1024px  (Laptops/Desktops)

Devices Supported:
├─ Smartphone (iOS/Android)
├─ Tablet (iPad, Android Tablet)
├─ Desktop (Windows, Mac, Linux)
└─ POS Terminal
```

---

## 🚀 Progressive Web App (PWA) Features

### **Install & Access**
- ✅ Add to Home Screen (Mobile)
- ✅ Desktop Shortcut (Desktop)
- ✅ Web Clip (iOS)
- ✅ Full screen experience

### **Offline Functionality**
- ✅ Service Worker caching
- ✅ Offline mode detection
- ✅ Local data storage (IndexedDB)
- ✅ Background sync
- ✅ Auto-sync when online

### **Performance**
- ✅ Code splitting
- ✅ Lazy loading
- ✅ Image optimization
- ✅ Minification
- ✅ Caching strategy
- ✅ Fast load time

---

## 📋 Roadmap & Development Phases

### **Phase 1: Core Setup (Week 1-2)**
- [x] Project initialization
- [x] Technology stack setup
- [ ] Database design & implementation
- [ ] Authentication system
- [ ] User management
- [ ] Role & permission system

### **Phase 2: Kasir Module (Week 3-4)**
- [x] Retail POS interface
- [x] Product management
- [x] Shopping cart functionality
- [x] Basic payment processing (tunai, QRIS, tunda bayar)
- [x] Receipt printing
- [x] Held transaction feature

### **Phase 3: Restaurant Module (Week 5-6)**
- [x] Table management (basic grid)
- [x] Menu display
- [ ] Order management
- [ ] Kitchen order printing
- [ ] Table merging & split bill

### **Phase 4: Multi-Level Pricing (Week 7)**
- [ ] Pricing rule engine
- [ ] Quantity-based pricing
- [ ] Member-based pricing
- [ ] Amount-based pricing
- [ ] Automatic price calculation

### **Phase 5: Reports & Analytics (Week 8-9)**
- [ ] Report generation
- [ ] Charts & visualizations
- [ ] Export functionality
- [ ] Schedule reports

### **Phase 6: Settings & Configuration (Week 10)**
- [ ] Printer configuration
- [ ] Receipt customization
- [ ] Tax setup
- [ ] Discount configuration
- [ ] All other settings

### **Phase 7: Inventory & Purchasing (Week 11-12)**
- [ ] Stock management
- [ ] Purchase order system
- [ ] Supplier management
- [ ] Stock movements

### **Phase 8: Multi-Branch Support (Week 13-14)**
- [ ] Branch management
- [ ] Centralized reporting
- [ ] Inter-branch operations
- [ ] Synchronization

### **Phase 9: PWA & Mobile (Week 15-16)**
- [ ] Service worker setup
- [ ] Offline functionality
- [ ] Installation feature
- [ ] Responsive design refinement

### **Phase 10: Testing & Deployment (Week 17-18)**
- [ ] Unit testing
- [ ] Integration testing
- [ ] User acceptance testing
- [ ] Bug fixes
- [ ] Production deployment
- [ ] Performance optimization

---

## 📦 Project Dependencies (Preliminary)

```json
{
  "frontend": {
    "react": "^18.2.0",
    "react-router-dom": "^6.x",
    "zustand": "^4.x",
    "axios": "^1.x",
    "tailwindcss": "^3.x",
    "react-query": "^3.x",
    "date-fns": "^2.x",
    "recharts": "^2.x",
    "dexie": "^3.x",
    "workbox": "^7.x",
    "qrcode.react": "^1.x",
    "jsprint": "^1.x"
  },
  "backend": {
    "express": "^4.x",
    "sequelize": "^6.x",
    "postgresql": "^14.x",
    "jsonwebtoken": "^9.x",
    "bcrypt": "^5.x",
    "multer": "^1.x",
    "cors": "^2.x"
  }
}
```

---

## 🎯 Success Criteria

- ✅ Application fully functional for retail & restaurant
- ✅ Multi-branch support working
- ✅ PWA installable on mobile & desktop
- ✅ Responsive on all device sizes
- ✅ Thermal printer working
- ✅ Keyboard shortcuts operational
- ✅ Hold & resume transactions working
- ✅ Multi-level pricing auto-applied
- ✅ Reports generating correctly
- ✅ Offline mode functional
- ✅ User authentication secure
- ✅ Performance optimized (< 3s load time)

---

## 📞 Notes & Considerations

1. **Database Backup**: Implement regular automated backups
2. **Data Security**: Encrypt sensitive data (passwords, payment info)
3. **Scalability**: Design for future expansion
4. **User Training**: Prepare user documentation & training materials
5. **Support**: Plan support system for users
6. **Maintenance**: Plan regular updates & maintenance schedule
7. **Integration**: Plan for future POS integrations (payment gateway, accounting software, etc.)

---

**End of Specification Document**
