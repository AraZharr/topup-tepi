# 📘 DOKUMENTASI LENGKAP PROYEK TopUp Tepi

---

## 📋 DAFTAR ISI

1. [Apa Itu TopUp Tepi?](#-1-apa-itu-topup-tepi)
2. [Tech Stack & Teknologi](#-2-tech-stack--teknologi)
3. [Arsitektur Sistem](#-3-arsitektur-sistem)
4. [Flow / Alur Bisnis Lengkap](#-4-flow--alur-bisnis-lengkap)
5. [Database & Struktur Data](#-5-database--struktur-data)
6. [API Endpoint Documentation](#-6-api-endpoint-documentation)
7. [Halaman & UI](#-7-halaman--ui)
8. [Integrasi Pihak Ketiga](#-8-integrasi-pihak-ketiga)
9. [Webhook & Notifikasi](#-9-webhook--notifikasi)
10. [Google Apps Script](#-10-google-apps-script)
11. [Deployment & CI/CD](#-11-deployment--cicd)
12. [Cara Setup Dari Awal](#-12-cara-setup-dari-awal)
13. [Biaya Operasional](#-13-biaya-operasional)
14. [FAQ](#-14-faq)

---

## 🧐 1. Apa Itu TopUp Tepi?

**TopUp Tepi** adalah aplikasi **Payment Point Online Bank** (PPOB) berbasis web yang memungkinkan pengguna melakukan berbagai pembayaran digital dalam satu platform.

### ✨ Fitur Utama:

| Fitur | Deskripsi |
|-------|-----------|
| 💳 **Pulsa & Data** | Isi pulsa/paket data semua operator (Telkomsel, XL, Indosat, Tri, Smartfren) |
| ⚡ **Token Listrik** | Token PLN Prabayar & tagihan Pascabayar |
| 💧 **PDAM** | Bayar tagihan air PDAM berbagai daerah |
| 🏥 **BPJS Kesehatan** | Bayar iuran BPJS per bulan |
| 🎮 **Voucher Game** | Diamond MLBB, Free Fire, PUBG, Valorant, dll |
| 📺 **TV & Internet** | Indihome, First Media, Biznet, MNC Play |
| 💰 **E-Wallet** | GoPay, OVO, DANA, LinkAja |
| 🏦 **Pembayaran Lainnya** | Pajak, Multifinance, Telepon |

### 🎯 Target Pengguna:

```
┌─────────────────────────────────────────────┐
│            TARGET PENGGUNA                   │
├─────────────────────────────────────────────┤
│  🧑 Individu     - Beli pulsa, token, bayar │
│                    tagihan sendiri           │
│  🏪 Reseller     - Jualan pulsa & PPOB ke   │
│                    pelanggan sendiri         │
│  🏢 Agen / Konter - Konter HP yang mau       │
│                    jualan PPOB digital       │
│  🏫 Komunitas    - Arisan, grup, RT/RW      │
└─────────────────────────────────────────────┘
```

---

## ⚙️ 2. Tech Stack & Teknologi

### 🖥️ Frontend (Client-side)

| Teknologi | Kegunaan |
|-----------|----------|
| **Next.js 14** | Framework React untuk SSR & SSG |
| **TypeScript** | Type safety & better developer experience |
| **Tailwind CSS 3** | Utility-first CSS framework |
| **React 18** | UI library |

### 🔧 Backend (Server-side)

| Teknologi | Kegunaan |
|-----------|----------|
| **Next.js API Routes** | REST API endpoints |
| **Jose (JWT)** | JSON Web Token authentication |
| **Zod** | Schema validation untuk input |
| **Nanoid** | Generate unique ID |

### ☁️ Cloud Infrastructure

| Layanan | Kegunaan |
|---------|----------|
| **Cloudflare Pages** | Hosting aplikasi (static + functions) |
| **Cloudflare D1** | SQLite database serverless |
| **GitHub Actions** | CI/CD auto deploy |
| **Cloudflare Workers** | Edge functions (via Pages Functions) |

### 🔌 Third-party Integrations

| Layanan | Kegunaan |
|---------|----------|
| **Digiflazz** | Penyedia produk PPOB (pulsa, PLN, PDAM, BPJS, dll) |
| **Paywuz** | Payment Gateway (Virtual Account, QRIS, E-Wallet) |
| **Google Apps Script** | Monitoring, email forwarding, backup |
| **Gmail** | Email notifikasi & laporan harian |

---

## 🏗️ 3. Arsitektur Sistem

### Diagram Arsitektur Lengkap

```
                              🌐 INTERNET
                                   │
                                   ▼
                  ┌─────────────────────────────┐
                  │     🌩️ CLOUDFLARE CDN       │
                  │  (DDoS Protection, SSL,     │
                  │   Cache, Bot Fight Mode)    │
                  └─────────────┬───────────────┘
                                │
                                ▼
                  ┌─────────────────────────────┐
                  │   📄 CLOUDFLARE PAGES        │
                  │                              │
                  │  ┌───────────────────────┐   │
                  │  │   STATIC ASSETS       │   │
                  │  │   (HTML, CSS, JS)     │   │
                  │  │   - Landing Page      │   │
                  │  │   - Dashboard         │   │
                  │  │   - Login/Register    │   │
                  │  └───────────────────────┘   │
                  │                              │
                  │  ┌───────────────────────┐   │
                  │  │   PAGES FUNCTIONS     │   │
                  │  │   (Edge API Routes)   │   │
                  │  │   - Auth (JWT)        │   │
                  │  │   - Transaksi PPOB    │   │
                  │  │   - Payment Gateway   │   │
                  │  │   - Webhook Handlers  │   │
                  │  └───────────────────────┘   │
                  └─────────────┬─────────────────┘
                                │
          ┌─────────────────────┼─────────────────────┐
          │                     │                     │
          ▼                     ▼                     ▼
┌─────────────────┐   ┌─────────────────┐   ┌─────────────────┐
│  🗄️ CLOUDFLARE  │   │  📦 DIGIFLAZZ   │   │  💳 PAYWUZ      │
│     D1 DATABASE │   │     API         │   │     API        │
│                 │   │                 │   │                 │
│  - users        │   │  Check Price    │   │  Create Payment │
│  - transactions │   │  TopUp Prepaid  │   │  Check Status   │
│  - topups       │   │  TopUp Postpaid │   │  Webhook        │
│  - products     │   │  Check Balance  │   │                 │
│  - settings     │   │  Webhook        │   │                 │
└────────┬────────┘   └─────────────────┘   └─────────────────┘
         │
         ▼
┌──────────────────────┐
│  📜 GOOGLE APPS      │
│     SCRIPT           │
│                      │
│  - Monitoring        │
│  - Daily Report      │
│  - Email Forwarding  │
│  - Backup ke Sheets  │
│  - Webhook Backup    │
└──────────────────────┘
```

### 🔄 Alur Request/Response

```
                       ┌──────────┐
                       │  BROWSER │
                       └────┬─────┘
                            │
                     Request URL
                            │
                            ▼
                   ┌────────────────┐
                   │  CLOUDFLARE    │
                   │  EDGE NETWORK  │
                   └───────┬────────┘
                           │
                    ┌──────┴──────┐
                    │             │
              Static File    API Route
              (page.tsx)    (/api/...)
                    │             │
                    ▼             ▼
           ┌────────────┐  ┌──────────────┐
           │ Serve HTML  │  │ Pages Function │
           │ + CSS + JS  │  │ (Edge Runtime) │
           └────────────┘  └──────┬───────┘
                                  │
                        ┌─────────┴─────────┐
                        │                   │
                   Akses DB           Call External
                   (D1)               API (Digiflazz/
                                       Paywuz)
                        │                   │
                        ▼                   ▼
                 ┌────────────┐    ┌──────────────┐
                 │   D1 SQL   │    │ Digiflazz /  │
                 │   Result   │    │ Paywuz API   │
                 └────────────┘    └──────────────┘
                        │                   │
                        └─────────┬─────────┘
                                  │
                                  ▼
                        ┌──────────────────┐
                        │  Response JSON   │
                        │  atau Redirect   │
                        └──────────────────┘
                                  │
                                  ▼
                            ┌──────────┐
                            │ BROWSER  │
                            └──────────┘
```

---

## 🔄 4. Flow / Alur Bisnis Lengkap

### 🅰️ **Alur Registrasi & Login**

```
┌─────────────────────────────────────────────────────────────────┐
│                    REGISTRASI AKUN BARU                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  USER                     FRONTEND                  BACKEND     │
│   │                          │                        │         │
│   │ 1. Buka halaman /register│                        │         │
│   │────────────────────────► │                        │         │
│   │                          │                        │         │
│   │ 2. Isi form:             │                        │         │
│   │    - Nama Lengkap        │                        │         │
│   │    - Email               │                        │         │
│   │    - No. HP (opsional)   │                        │         │
│   │    - Password            │                        │         │
│   │    - Konfirmasi Password │                        │         │
│   │────────────────────────► │                        │         │
│   │                          │                        │         │
│   │                          │ 3. Validasi:           │         │
│   │                          │    - Email valid?      │         │
│   │                          │    - Min 6 char pass?  │         │
│   │                          │    - Pass match?       │         │
│   │                          │    - Nama min 2 char?  │         │
│   │                          │                        │         │
│   │                          │ 4. POST /api/auth/     │         │
│   │                          │    register            │         │
│   │                          │────────────────────►   │         │
│   │                          │                        │         │
│   │                          │                        │ (Nanti) │
│   │                          │                        │ Hash    │
│   │                          │                        │ password │
│   │                          │                        │ + Save  │
│   │                          │                        │ ke D1   │
│   │                          │                        │         │
│   │                          │◄── {success: true} ────│         │
│   │                          │                        │         │
│   │◄── Redirect ke /login ◄──│                        │         │
│   │                          │                        │         │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                           LOGIN                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  USER                     FRONTEND                  BACKEND     │
│   │                          │                        │         │
│   │ 1. Buka halaman /login   │                        │         │
│   │────────────────────────► │                        │         │
│   │                          │                        │         │
│   │ 2. Isi email & password  │                        │         │
│   │────────────────────────► │                        │         │
│   │                          │                        │         │
│   │                          │ 3. POST /api/auth/login│         │
│   │                          │────────────────────►   │         │
│   │                          │                        │         │
│   │                          │                        │ 4. Cek  │
│   │                          │                        │ user di │
│   │                          │                        │ DB      │
│   │                          │                        │         │
│   │                          │                        │ 5. Buat │
│   │                          │                        │ JWT     │
│   │                          │                        │ Token   │
│   │                          │                        │ (24 jam)│
│   │                          │                        │         │
│   │                          │◄── {token, user} ──────│         │
│   │                          │                        │         │
│   │                          │ 6. Simpan di           │         │
│   │                          │    localStorage:       │         │
│   │                          │    - token             │         │
│   │                          │    - user (JSON)       │         │
│   │                          │                        │         │
│   │◄── Redirect ke /dashboard│                        │         │
│   │                          │                        │         │
│   │ 7. Setiap request:       │                        │         │
│   │    Header Authorization: │                        │         │
│   │    "Bearer {token}"      │                        │         │
│   │                          │                        │         │
└─────────────────────────────────────────────────────────────────┘
```

### 🅱️ **Alur Pembelian Pulsa / Produk PPOB**

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    TRANSAKSI PEMBELIAN PRODUK PPOB                       │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  USER                  FRONTEND              BACKEND          DIGIFLAZZ │
│   │                       │                    │                  │     │
│   │ 1. Buka /dashboard/   │                    │                  │     │
│    │   transactions       │                    │                  │     │
│   │─────────────────────► │                    │                  │     │
│   │                       │                    │                  │     │
│   │ 2. Pilih kategori     │                    │                  │     │
│   │    (Pulsa)            │                    │                  │     │
│   │─────────────────────► │                    │                  │     │
│   │                       │                    │                  │     │
│   │ 3. Lihat daftar       │                    │                  │     │
│   │    produk + harga     │                    │                  │     │
│   │◄────────────────────  │                    │                  │     │
│   │                       │                    │                  │     │
│   │ 4. Masukkan nomor HP  │                    │                  │     │
│   │    081234567890       │                    │                  │     │
│   │─────────────────────► │                    │                  │     │
│   │                       │                    │                  │     │
│   │ 5. Klik produk        │                    │                  │     │
│   │    "Telkomsel 10rb"   │                    │                  │     │
│   │─────────────────────► │                    │                  │     │
│   │                       │                    │                  │     │
│   │                       │ 6. POST /api/ppob/ │                  │     │
│   │                       │    transaction     │                  │     │
│   │                       │   (Authorization:  │                  │     │
│   │                       │    Bearer {token}) │                  │     │
│   │                       │──────────────────►│                  │     │
│   │                       │                    │                  │     │
│   │                       │                    │ 7. Verifikasi    │     │
│   │                       │                    │    JWT token     │     │
│   │                       │                    │    (auth.ts)     │     │
│   │                       │                    │                  │     │
│   │                       │                    │ 8. Generate      │     │
│   │                       │                    │    ref_id:       │     │
│   │                       │                    │    PPOB-aBcXyZ   │     │
│   │                       │                    │                  │     │
│   │                       │                    │ 9. Call API      │     │
│   │                       │                    │    Digiflazz     │     │
│   │                       │                    │  POST /v1/       │     │
│   │                       │                    │  transaction     │     │
│   │                       │                    │─────────────────►│     │
│   │                       │                    │                  │     │
│   │                       │                    │ 10. {rc: "00",   │     │
│   │                       │                    │     sn:"123456"} │     │
│   │                       │                    │◄──────────────── │     │
│   │                       │                    │                  │     │
│   │                       │                    │ (Nanti:          │     │
│   │                       │                    │  simpan ke D1)   │     │
│   │                       │                    │                  │     │
│   │                       │◄── {success,       │                  │     │
│   │                       │      data} ──────── │                  │     │
│   │                       │                    │                  │     │
│   │◄── Notifikasi:       │                    │                  │     │
│   │     ✅ Transaksi      │                    │                  │     │
│   │        Berhasil!      │                    │                  │     │
│   │     SN: 123456        │                    │                  │     │
│   │                       │                    │                  │     │
└─────────────────────────────────────────────────────────────────────────┘
```

### 🅲 **Alur Top Up Saldo (Deposit)**

```
┌─────────────────────────────────────────────────────────────────────┐
│                    TOP UP / DEPOSIT SALDO                            │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  USER                  FRONTEND              BACKEND        PAYWUZ  │
│   │                       │                    │               │     │
│   │ 1. Buka /dashboard/   │                    │               │     │
│    │   topup              │                    │               │     │
│   │─────────────────────► │                    │               │     │
│   │                       │                    │               │     │
│   │ 2. Pilih jumlah:      │                    │               │     │
│   │    Rp 50.000          │                    │               │     │
│   │─────────────────────► │                    │               │     │
│   │                       │                    │               │     │
│   │ 3. Pilih metode:      │                    │               │     │
│   │    BCA Virtual        │                    │               │     │
│   │    Account            │                    │               │     │
│   │─────────────────────► │                    │               │     │
│   │                       │                    │               │     │
│   │                       │ 4. POST /api/      │               │     │
│   │                       │    payment/create  │               │     │
│   │                       │   (Authorization:  │               │     │
│   │                       │    Bearer {token}) │               │     │
│   │                       │──────────────────►│               │     │
│   │                       │                    │               │     │
│   │                       │                    │ 5. Generate   │     │
│   │                       │                    │    order_id:  │     │
│   │                       │                    │    TOPUP-xyz  │     │
│   │                       │                    │               │     │
│   │                       │                    │ 6. Call       │     │
│   │                       │                    │    Paywuz API │     │
│   │                       │                    │  POST /v1/    │     │
│   │                       │                    │  transaction/ │     │
│   │                       │                    │  create       │     │
│   │                       │                    │──────────────►│     │
│   │                       │                    │               │     │
│   │                       │                    │ 7. {va_number │     │
│   │                       │                    │    :"123456", │     │
│   │                       │                    │     amount:   │     │
│   │                       │                    │     51000}    │     │
│   │                       │                    │◄──────────────│     │
│   │                       │                    │               │     │
│   │                       │◄── {data: {        │               │     │
│   │                       │      va_number:    │               │     │
│   │                       │      "123456"}}    │               │     │
│   │                       │                    │               │     │
│   │◄── VA: 1234567890    │                    │               │     │
│   │     Total: Rp51.000  │                    │               │     │
│   │                       │                    │               │     │
│   │ 8. Buka m-BCA/ATM    │                    │               │     │
│   │  Transfer ke VA       │                    │               │     │
│   │ ──────────────────────────────────────────────────────────────────►│
│   │                       │                    │               │     │
│   │                       │                    │ 9. Paywuz     │     │
│   │                       │                    │    kirim      │     │
│   │                       │                    │    webhook    │     │
│   │                       │                    │  POST /api/   │     │
│   │                       │                    │  webhook/     │     │
│   │                       │                    │  paywuz       │     │
│   │                       │                    │◄──────────────│     │
│   │                       │                    │               │     │
│   │                       │                    │ 10. Update DB │     │
│   │                       │                    │     topup=paid│     │
│   │                       │                    │     saldo+=50k│     │
│   │                       │                    │               │     │
│   │ 11. Cek dashboard     │                    │               │     │
│   │  Saldo bertambah!     │                    │               │     │
│   │                       │                    │               │     │
└─────────────────────────────────────────────────────────────────────┘
```

### 🅳 **Alur Webhook (Notifikasi Otomatis)**

```
DIGIFLAZZ / PAYWUZ                  CLOUDFLARE                    DATABASE
       │                                 │                            │
       │ 1. Transaksi selesai/sukses     │                            │
       │                                 │                            │
       │ 2. POST /api/webhook/           │                            │
       │    {                             │                            │
       │     "event":"payment",          │                            │
       │     "data":{                    │                            │
       │      "ref_id":"PPOB-xxx",       │                            │
       │      "status":"Sukses",         │                            │
       │      "sn":"1234567890"          │                            │
       │     }                           │                            │
       │    }                            │                            │
       │────────────────────────────►    │                            │
       │                                 │                            │
       │                                 │ 3. Validasi signature      │
       │                                 │    (cek keaslian)          │
       │                                 │                            │
       │                                 │ 4. UPDATE transactions     │
       │                                 │    SET status='success',   │
       │                                 │    sn='1234567890'         │
       │                                 │    WHERE id='PPOB-xxx'     │
       │                                 │─────────────────────────►  │
       │                                 │                            │
       │                                 │ 5. ◄── OK ──────────────  │
       │                                 │                            │
       │◄── 200 OK ───────────────────── │                            │
       │                                 │                            │

📌 UNTUK TOPUP (dari Paywuz):

PAYWUZ                             CLOUDFLARE                    DATABASE
  │                                     │                            │
  │ User sudah transfer ke VA           │                            │
  │                                     │                            │
  │ POST /api/webhook/paywuz            │                            │
  │ {order_id:"TOPUP-xxx",              │                            │
  │  status:"paid",                     │                            │
  │  amount:50000}                      │                            │
  │────────────────────────────────►    │                            │
  │                                     │                            │
  │                                     │ 1. Cek signature           │
  │                                     │ 2. Update topups SET       │
  │                                     │    status='paid'           │
  │                                     │─────────────────────────►  │
  │                                     │                            │
  │                                     │ 3. UPDATE users            │
  │                                     │    SET saldo = saldo +     │
  │                                     │    50000                   │
  │                                     │    WHERE id = user_id      │
  │                                     │─────────────────────────►  │
  │                                     │                            │
  │◄── 200 OK ──────────────────────────│                            │
```

---

## 🗄️ 5. Database & Struktur Data

### 📊 Entity Relationship Diagram (ERD)

```
┌─────────────────────────────────────────────────────────────────┐
│                      DATABASE RELATIONSHIPS                     │
│                                                                  │
│   ┌──────────┐          ┌────────────────┐                      │
│   │  USERS   │          │  TRANSACTIONS  │                      │
│   ├──────────┤          ├────────────────┤                      │
│   │ id (PK)  │◄─────────│ user_id (FK)   │                      │
│   │ email    │    1:N   │ id (PK)        │                      │
│   │ nama     │          │ customer_no    │                      │
│   │ phone    │          │ product_code   │                      │
│   │ password │          │ product_name   │                      │
│   │ role     │          │ kategori       │                      │
│   │ saldo    │          │ harga          │                      │
│   └────┬─────┘          │ status         │                      │
│        │                │ sn             │                      │
│        │ 1:N            │ message        │                      │
│        │                │ created_at     │                      │
│        ▼                └────────────────┘                      │
│   ┌──────────┐                                                   │
│   │  TOPUPS  │          ┌────────────────┐                      │
│   ├──────────┤          │   PRODUCTS     │                      │
│   │ id (PK)  │          ├────────────────┤                      │
│   │ user_id  │          │ code (PK)      │                      │
│   │ amount   │          │ name           │                      │
│   │ fee      │          │ category       │                      │
│   │ total    │          │ brand          │                      │
│   │ status   │          │ price          │                      │
│   │ va_number│          │ markup         │                      │
│   │ qr_url   │          │ status         │                      │
│   │ created  │          └────────────────┘                      │
│   └──────────┘                                                   │
│                                                                  │
│   ┌──────────┐                                                   │
│   │ SETTINGS │                                                   │
│   ├──────────┤                                                   │
│   │ key (PK) │                                                   │
│   │ value    │                                                   │
│   └──────────┘                                                   │
└─────────────────────────────────────────────────────────────────┘
```

### 📋 Detail Tabel

#### 👤 **Tabel: `users`**
Menyimpan data pengguna aplikasi.

| Kolom | Tipe | Constraint | Deskripsi | Contoh |
|-------|------|-----------|-----------|--------|
| `id` | TEXT | PRIMARY KEY | ID unik user | `user-aBcXyZ123` |
| `email` | TEXT | UNIQUE, NOT NULL | Email login | `user@email.com` |
| `nama` | TEXT | NOT NULL | Nama lengkap | `Budi Santoso` |
| `phone` | TEXT | - | Nomor HP | `081234567890` |
| `password` | TEXT | NOT NULL | Hash bcrypt | `$2a$12$...` |
| `role` | TEXT | CHECK('user','admin') | Level akses | `user` |
| `saldo` | INTEGER | DEFAULT 0 | Saldo (Rupiah) | `50000` |
| `created_at` | TEXT | DEFAULT NOW() | Waktu daftar | `2026-07-05 14:30:00` |

#### 📦 **Tabel: `transactions`**
Menyimpan riwayat transaksi PPOB.

| Kolom | Tipe | Constraint | Deskripsi | Contoh |
|-------|------|-----------|-----------|--------|
| `id` | TEXT | PRIMARY KEY | Ref ID dari Digiflazz | `PPOB-aBcXyZ123` |
| `user_id` | TEXT | FK -> users.id | Pembeli | `user-xxx` |
| `customer_no` | TEXT | NOT NULL | No HP/Meter/ID | `081234567890` |
| `product_code` | TEXT | NOT NULL | Kode produk | `TSEL10` |
| `product_name` | TEXT | - | Nama produk | `Telkomsel 10rb` |
| `kategori` | TEXT | - | Kategori | `pulsa` |
| `harga` | INTEGER | NOT NULL | Harga | `10500` |
| `status` | TEXT | CHECK | `pending/success/failed` | `success` |
| `sn` | TEXT | - | Serial Number | `1234567890` |
| `message` | TEXT | - | Pesan error/sukses | `Transaksi Sukses` |
| `created_at` | TEXT | DEFAULT NOW() | Waktu transaksi | `2026-07-05` |

#### 💰 **Tabel: `topups`**
Menyimpan data deposit/top-up saldo.

| Kolom | Tipe | Constraint | Deskripsi | Contoh |
|-------|------|-----------|-----------|--------|
| `id` | TEXT | PRIMARY KEY | Order ID | `TOPUP-xyz` |
| `user_id` | TEXT | FK -> users.id | Penyetor | `user-xxx` |
| `amount` | INTEGER | NOT NULL | Jumlah | `50000` |
| `fee` | INTEGER | DEFAULT 0 | Biaya admin | `1000` |
| `total` | INTEGER | NOT NULL | Total dibayar | `51000` |
| `payment_method` | TEXT | - | Metode | `va` |
| `payment_channel` | TEXT | - | Channel | `bca` |
| `status` | TEXT | CHECK | `pending/paid/expired` | `paid` |
| `va_number` | TEXT | - | No VA | `1234567890` |
| `qr_url` | TEXT | - | URL QRIS | `https://...` |
| `created_at` | TEXT | DEFAULT NOW() | Waktu | `2026-07-05` |

#### 🏷️ **Tabel: `products`**
Cache produk dari Digiflazz (opsional, untuk tampilan cepat).

| Kolom | Tipe | Deskripsi |
|-------|------|-----------|
| `code` | TEXT (PK) | Kode produk Digiflazz |
| `name` | TEXT | Nama produk |
| `category` | TEXT | Kategori |
| `brand` | TEXT | Brand/Merk |
| `price` | INTEGER | Harga pokok |
| `markup` | INTEGER | Markup keuntungan |
| `selling_price` | INTEGER | Harga jual ke user |
| `status` | INTEGER | 1=aktif, 0=nonaktif |

#### ⚙️ **Tabel: `settings`**
Konfigurasi aplikasi.

| Key | Value | Deskripsi |
|-----|-------|-----------|
| `app_name` | `TopUp Tepi` | Nama aplikasi |
| `markup_persen` | `0` | Persen markup default |
| `min_topup` | `5000` | Minimal top-up |
| `max_topup` | `2000000` | Maksimal top-up |
| `fee_topup_persen` | `2` | Fee top-up (%) |

---

## 🔌 6. API Endpoint Documentation

### 📍 Base URL
```
https://topup-tepi.pages.dev
```
atau custom domain (setelah setup):
```
https://topup.tepi.my.id
```

---

### 🔐 **Auth Endpoints**

#### `POST /api/auth/register`
Mendaftarkan user baru.

**Request Body:**
```json
{
  "email": "user@email.com",
  "nama": "Budi Santoso",
  "phone": "081234567890",
  "password": "rahasia123"
}
```

**Response Sukses (201):**
```json
{
  "success": true,
  "message": "Registrasi berhasil!",
  "data": {
    "email": "user@email.com",
    "nama": "Budi Santoso"
  }
}
```

**Response Error (400):**
```json
{
  "success": false,
  "message": "Email sudah terdaftar"
}
```

---

#### `POST /api/auth/login`
Login user, mengembalikan JWT token.

**Request Body:**
```json
{
  "email": "user@email.com",
  "password": "rahasia123"
}
```

**Response Sukses (200):**
```json
{
  "success": true,
  "message": "Login berhasil",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "email": "user@email.com",
      "role": "user"
    }
  }
}
```

**Response Error (401):**
```json
{
  "success": false,
  "message": "Email atau password salah"
}
```

---

### 📱 **PPOB Endpoints**

#### `GET /api/ppob/check-price?type=prepaid`
Mendapatkan daftar harga produk dari Digiflazz.

**Headers:** `Authorization: Bearer {token}` (opsional)

**Parameter:**
| Param | Tipe | Deskripsi |
|-------|------|-----------|
| type | string | `prepaid` atau `postpaid` |

**Response:**
```json
{
  "success": true,
  "data": {
    "products": [
      {
        "buyer_sku_code": "TSEL10",
        "product_name": "Telkomsel 10rb",
        "category": "Pulsa",
        "brand": "Telkomsel",
        "price": 10500,
        "buyer_product_status": true
      }
    ]
  }
}
```

---

#### `POST /api/ppob/transaction`
Melakukan pembelian produk PPOB.

**Headers:** `Authorization: Bearer {token}` (wajib)

**Request Body:**
```json
{
  "productCode": "TSEL10",
  "customerNo": "081234567890"
}
```

**Response Sukses:**
```json
{
  "success": true,
  "message": "Transaksi berhasil diproses",
  "data": {
    "refId": "PPOB-aBcXyZ123",
    "rc": "00",
    "sn": "1234567890",
    "status": "Sukses"
  }
}
```

---

### 💳 **Payment Endpoints**

#### `POST /api/payment/create`
Membuat transaksi pembayaran top-up saldo.

**Headers:** `Authorization: Bearer {token}` (wajib)

**Request Body:**
```json
{
  "amount": 50000,
  "paymentMethod": "va",
  "paymentChannel": "bca"
}
```

**Channel yang didukung:**
| paymentChannel | paymentMethod | Deskripsi |
|----------------|---------------|-----------|
| `bca` | `va` | BCA Virtual Account |
| `mandiri` | `va` | Mandiri Virtual Account |
| `bni` | `va` | BNI Virtual Account |
| `briva` | `va` | BRI Virtual Account |
| `qris` | `qris` | QRIS (semua aplikasi) |
| `gopay` | `ewallet` | GoPay |
| `ovo` | `ewallet` | OVO |
| `dana` | `ewallet` | DANA |

**Response Sukses (VA):**
```json
{
  "success": true,
  "message": "Pembayaran berhasil dibuat",
  "data": {
    "orderId": "TOPUP-xyz123",
    "va_number": "1234567890123",
    "amount": 50000,
    "expired_at": "2026-07-05T15:30:00Z"
  }
}
```

**Response Sukses (QRIS):**
```json
{
  "success": true,
  "message": "Pembayaran berhasil dibuat",
  "data": {
    "orderId": "TOPUP-xyz123",
    "qr_url": "https://paywuz.com/qr/abc123.png",
    "amount": 50000,
    "expired_at": "2026-07-05T15:30:00Z"
  }
}
```

---

### 📡 **Webhook Endpoints**

#### `POST /api/webhook/paywuz`
Menerima notifikasi status pembayaran dari Paywuz.

**Headers:** `X-Signature: {sha256_signature}` (untuk verifikasi)

**Request Body (dari Paywuz):**
```json
{
  "order_id": "TOPUP-xyz123",
  "status": "paid",
  "amount": 50000,
  "signature": "abc123...",
  "timestamp": "2026-07-05T14:35:00Z"
}
```

**Status Values:**
| Status | Arti | Action |
|--------|------|--------|
| `paid` | Dibayar | Tambah saldo user |
| `expired` | Kadaluarsa | Tandai expired |
| `cancelled` | Dibatalkan | Tandai cancelled |
| `pending` | Menunggu | Biarkan pending |

**Response:**
```json
{
  "status": true
}
```

---

#### `POST /api/webhook/digiflazz`
Menerima notifikasi status transaksi PPOB dari Digiflazz.

**Request Body (dari Digiflazz):**
```json
{
  "event": "payment",
  "data": {
    "ref_id": "PPOB-aBcXyZ123",
    "customer_no": "081234567890",
    "buyer_sku_code": "TSEL10",
    "status": "Sukses",
    "serial_number": "1234567890",
    "message": "Transaksi Sukses"
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "OK"
}
```

---

### 📋 **Tabel Ringkasan Endpoint**

| Method | Endpoint | Auth | Fungsi |
|--------|----------|------|--------|
| POST | `/api/auth/register` | ❌ | Registrasi user |
| POST | `/api/auth/login` | ❌ | Login user |
| GET | `/api/ppob/check-price` | ❌ | Daftar harga produk |
| POST | `/api/ppob/transaction` | ✅ | Beli produk PPOB |
| POST | `/api/payment/create` | ✅ | Buat top-up payment |
| POST | `/api/webhook/paywuz` | ❌* | Webhook Paywuz |
| POST | `/api/webhook/digiflazz` | ❌* | Webhook Digiflazz |

> *Webhook diverifikasi via signature, bukan JWT.

---

## 🖥️ 7. Halaman & UI

### 📄 Daftar Halaman

| # | Halaman | Path | Akses | Deskripsi |
|---|---------|------|-------|-----------|
| 1 | **Landing Page** | `/` | Publik | Beranda, fitur, produk, CTA |
| 2 | **Login** | `/login` | Publik | Form masuk akun |
| 3 | **Register** | `/register` | Publik | Form daftar akun baru |
| 4 | **Dashboard** | `/dashboard` | User | Beranda dengan saldo & shortcut |
| 5 | **Transaksi Baru** | `/dashboard/transactions` | User | Beli pulsa/PLN/dll |
| 6 | **Top Up Saldo** | `/dashboard/topup` | User | Isi saldo via VA/QRIS |
| 7 | **Riwayat** | `/dashboard/history` | User | Semua transaksi user |
| 8 | **Profil** | `/dashboard/profile` | User | Info akun |
| 9 | **Admin Panel** | `/admin` | Admin | Dashboard admin |

### 🎨 Desain UI

> **Catatan:** Aplikasi menggunakan **Tailwind CSS** dengan warna utama:
> - Primary: `#3b82f6` (Biru)
> - Secondary: `#8b5cf6` (Ungu)
> - Background: `#f8fafc` (Abu terang)
> - Text: `#1e293b` (Slate gelap)

#### Layout Dashboard:
```
┌─────────────────────────────────────────────────┐
│  ┌────────┐  ┌────────────────────────────────┐ │
│  │        │  │  📱 TopUp Tepi           👤      │ │
│  │  🏠    │  │  (Top Bar - Mobile only)       │ │
│  │  Beranda│  ├────────────────────────────────┤ │
│  │        │  │                                │ │
│  │  🛒    │  │  [CONTENT AREA]                │ │
│  │  Trans.│  │                                │ │
│  │        │  │  - Dashboard cards             │ │
│  │  💰    │  │  - Form transaksi              │ │
│  │  Top Up│  │  - Riwayat list                │ │
│  │        │  │  - Profile info                │ │
│  │  📋    │  │                                │ │
│  │  Riwayat│  │                                │ │
│  │        │  │                                │ │
│  │  👤    │  └────────────────────────────────┤ │
│  │  Profil│  │  © 2026 TopUp Tepi                │ │
│  └────────┘  └────────────────────────────────┘ │
│    SIDEBAR            MAIN CONTENT              │
└─────────────────────────────────────────────────┘
```

---

## 🔗 8. Integrasi Pihak Ketiga

### 📦 **Digiflazz** — Penyedia Produk PPOB

**Daftar Produk yang Didukung:**

| Kategori | Contoh Produk |
|----------|---------------|
| Pulsa Prabayar | Telkomsel, XL, Indosat, Tri, Smartfren, Axis |
| Paket Data | Internet all operator |
| Token Listrik | PLN Prabayar (20rb, 50rb, 100rb, 200rb, 500rb, 1jt) |
| Listrik Pascabayar | Cek & bayar tagihan PLN |
| PDAM | Bayar tagihan PDAM |
| BPJS Kesehatan | Bayar iuran |
| Telepon | Telkom, Flexi |
| TV & Internet | Indihome, First Media, MNC Play, Biznet |
| Game Voucher | Mobile Legends, Free Fire, PUBG, Valorant |
| E-Wallet | GoPay, OVO, DANA, LinkAja |
| Pajak | PBB, STNK |
| Multifinance | FIF, Adira, Kredit Plus |

**Flow Integrasi:**
```
APP → Sign payload (MD5) → POST ke api.digiflazz.com → Response
```

**Dokumentasi API Digiflazz:**
- Base URL: `https://api.digiflazz.com/v1`
- Price List: `POST /price-list`
- Transaksi: `POST /transaction`
- Cek Saldo: `POST /cek-saldo`
- Webhook: Dikirim ke endpoint kita

---

### 💳 **Paywuz** — Payment Gateway

**Metode Pembayaran yang Didukung:**

| Metode | Channel | Kode |
|--------|---------|------|
| Virtual Account | BCA | `va_bca` |
| Virtual Account | Mandiri | `va_mandiri` |
| Virtual Account | BNI | `va_bni` |
| Virtual Account | BRI/BRIVA | `va_briva` |
| QRIS | QRIS | `qris` |
| E-Wallet | GoPay | `gopay` |
| E-Wallet | OVO | `ovo` |
| E-Wallet | DANA | `dana` |
| E-Wallet | LinkAja | `linkaja` |

**Flow Integrasi:**
```
APP → POST ke paywuz.com/api/v1 → Dapat VA/QR URL
User transfer → Paywuz notifikasi via webhook → APP update saldo
```

**Dokumentasi API Paywuz:**
- Base URL: `https://paywuz.com/api/v1`
- Create Transaction: `POST /transaction/create`
- Check Status: `POST /transaction/status`
- Webhook: Dikirim ke endpoint kita dengan signature

---

## 📡 9. Webhook & Notifikasi

### 🎯 **Apa itu Webhook?**

Webhook adalah cara agar server pihak ketiga (Digiflazz/Paywuz) bisa memberitahu aplikasi kita secara otomatis ketika ada event/kejadian penting.

**Tanpa Webhook:** Kita harus terus-terusan ngecek ("polling") ke Digiflazz tiap detik.
**Dengan Webhook:** Digiflazz langsung kirim notifikasi ke kita begitu transaksi selesai.

```
❌ TANPA WEBHOOK (Borong resource):
   APP ──?──► DIGIFLAZZ  (setiap 5 detik: "Udah selesai belum?")
   APP ──?──► DIGIFLAZZ  (setiap 5 detik: "Udah selesai belum?")
   APP ──?──► DIGIFLAZZ  (setiap 5 detik: "Udah selesai belum?")

✅ DENGAN WEBHOOK (Efisien):
   APP  (diam, nunggu)
   DIGIFLAZZ ──► APP  ("Eh, transaksi udah sukses nih!")
```

### 📥 **Endpoint Webhook**

| Endpoint | Dari | Event |
|----------|------|-------|
| `/api/webhook/paywuz` | Paywuz | Pembayaran top-up berhasil |
| `/api/webhook/digiflazz` | Digiflazz | Transaksi PPOB selesai |

### 🔐 **Verifikasi Webhook**

Untuk memastikan webhook benar-benar dari Paywuz/Digiflazz (bukan dari hacker):

**Paywuz:**
```
Signature = SHA256(body_json + private_key)
```

**Digiflazz:**
```
Signature = MD5(webhook_key + JSON.stringify(body))
```

Aplikasi akan mengecek signature sebelum memproses webhook.

### 📧 **Notifikasi ke Admin**

Google Apps Script juga mengirim notifikasi ke email admin jika:
1. ✅ **Laporan Harian** — Setiap jam 07:00 WIB
2. 🔴 **Webhook Down** — Jika webhook tidak bisa diakses
3. ⚠️ **Transaksi Gagal** — Jika banyak transaksi gagal

---

## 📜 10. Google Apps Script

### 🎯 **Peran Apps Script**

Apps Script berjalan di **server Google** secara gratis, bertugas sebagai **asisten monitoring dan backup** untuk aplikasi PPOB.

### 📋 **Fitur Apps Script**

| Fitur | Jadwal | Fungsi |
|-------|--------|--------|
| 📊 **Laporan Harian** | Setiap hari jam 07:00 | Kirim email laporan transaksi kemarin |
| 🩺 **Cek Kesehatan Webhook** | Setiap 1 jam | Test endpoint webhook, kirim alert jika down |
| 💾 **Backup Data** | Setiap minggu | Backup spreadsheet ke file terpisah |
| 📧 **Email Forwarding** | Real-time | Forward email dari alias ke Gmail |
| 🔄 **Webhook Alternatif** | Real-time | Backup endpoint jika Cloudflare down |

### 📧 **Email Alias (Custom Email)**

Apps Script bisa jadi **penerus email**. Misal:
- `support@topup.tepi.my.id` → `emailkamu@gmail.com`
- `admin@topup.tepi.my.id` → `emailkamu@gmail.com`

**Cara kerja:**
```
Email masuk ke support@topup.tepi.my.id
         │
         ▼
Cloudflare Email Routing (forward ke Apps Script)
         │
         ▼
Google Apps Script (doPost)
         │
         ▼
Forward ke Gmail kamu
```

### 📊 **Logging & Monitoring**

Semua aktivitas dicatat di Google Spreadsheet:

| Sheet | Isi |
|-------|-----|
| `Transaksi` | Semua transaksi PPOB (auto-log dari webhook) |
| `TopUp` | Semua deposit user |
| `Log` | Log error, warning, info dari Apps Script |

### 🚀 **Setup Apps Script di HP:**

1. Buka `script.google.com`
2. Buat project baru
3. Paste kode dari `apps-script/code.gs`
4. Jalankan fungsi `init()` (akan buat sheet + trigger)
5. Deploy sebagai Web App
6. Copy URL untuk webhook alternatif

---

## 🚀 11. Deployment & CI/CD

### 📦 **Build Process**

```
KODE SUMBER (.ts, .tsx)
        │
        ▼
   npx @cloudflare/next-on-pages
        │
        ├──► Static HTML, CSS, JS → /public
        │         (Halaman: Landing, Dashboard, Login, dll)
        │
        └──► Cloudflare Pages Functions
                  (API Routes: /api/auth, /api/ppob, dll)
```

### 🤖 **GitHub Actions (Auto Deploy)**

Setiap kali kamu push ke branch `main`, otomatis:
1. Checkout kode dari GitHub
2. Install dependencies (`npm ci`)
3. Build project (`npm run pages:build`)
4. Deploy ke Cloudflare Pages

**File workflow:** `.github/workflows/deploy.yml`

### 🏗️ **Cloudflare Pages Setup**

```
┌─────────────────────────────────────────────┐
│              CLOUDFLARE PAGES                │
│                                              │
│  ┌──────────────────────────────────────┐   │
│  │ Project: topup-tepi                    │   │
│  │ Domain: topup-tepi.pages.dev          │   │
│  │ (atau custom domain)                │   │
│  └──────────────────────────────────────┘   │
│                                              │
│  Build Settings:                             │
│  ├── Framework: Next.js                     │
│  ├── Build command: npm run pages:build     │
│  └── Output dir: .vercel/output/static      │
│                                              │
│  Environment Variables:                      │
│  ├── JWT_SECRET = "..."                     │
│  ├── DIGIFLAZZ_USERNAME = "..."            │
│  ├── DIGIFLAZZ_API_KEY = "..."             │
│  ├── PAYWUZ_API_KEY = "..."                │
│  └── PAYWUZ_PRIVATE_KEY = "..."            │
│                                              │
│  D1 Database Binding:                       │
│  ├── Variable: DB                           │
│  └── Database: topup-tepi-database                │
└─────────────────────────────────────────────┘
```

---

## 📝 12. Cara Setup Dari Awal (Step-by-Step)

### ✅ **Prerequisites (yang harus disiapkan)**

| # | Item | Cara Dapat | Biaya |
|---|------|-----------|-------|
| 1 | Akun GitHub | github.com (daftar gratis) | Rp0 |
| 2 | Akun Cloudflare | dash.cloudflare.com (daftar gratis) | Rp0 |
| 3 | Akun Digiflazz | member.digiflazz.com (daftar gratis) | Rp0 (isi saldo nanti) |
| 4 | Akun Paywuz | paywuz.com (daftar gratis) | Rp0 |
| 5 | Google Account | gmail.com | Rp0 |
| 6 | Domain (opsional) | Niagahoster / Cloudflare Registrar | Rp20-50rb/thn |

---

### 📱 **Langkah 1: Upload Project ke GitHub (dari HP)**

1. Buka **github.com** di browser HP
2. Login akun GitHub kamu
3. Tap ikon `+` (kanan atas) → **New repository**
4. Nama repository: `topup-tepi`
5. Pilih **Public** (biar gampang)
6. Tap **Create repository**
7. Di halaman repo baru, tap **uploading an existing file**
8. Drag & drop **semua file project** (folder `src/`, `cloudflare/`, dll)
9. Scroll bawah, isi pesan: `Initial commit`
10. Tap **Commit changes**

---

### ☁️ **Langkah 2: Setup Cloudflare D1 Database**

1. Buka **dash.cloudflare.com**
2. Login → **Workers & Pages** → **D1**
3. Tap **Create database**
4. Nama: `topup-tepi-database`
5. Tap **Create**
6. **Copy Database ID** yang muncul (simpan di catatan!)
7. Tap tab **Console** (atau Query)
8. Buka file `cloudflare/d1-schema.sql` (baca isinya)
9. Copy paste semua SQL ke console
10. Tap **Execute**
11. ✅ Database siap!

---

### 🌐 **Langkah 3: Setup Cloudflare Pages**

1. Cloudflare Dashboard → **Workers & Pages** → **Pages**
2. Tap **Create** → **Connect to Git**
3. Pilih **GitHub** → Authorize (jika belum)
4. Pilih repo `topup-tepi`
5. **Configure build:**
   ```
   Project name: topup-tepi
   Production branch: main
   Framework: Next.js
   Build command: npm run pages:build
   Build output: .vercel/output/static
   Root dir: /
   ```
6. Tap **Save and Deploy**
7. Tunggu 2-3 menit sampai selesai
8. ✅ Aplikasi online di `https://topup-tepi.pages.dev`

---

### 🔐 **Langkah 4: Set Environment Variables**

1. Cloudflare Pages → **topup-tepi** → **Settings** → **Environment variables**

2. Tap **Add variable** untuk masing-masing:

| Variable | Contoh Value | Keterangan |
|----------|-------------|-----------|
| `JWT_SECRET` | `ppob-rahasia-super-kuat-123!` | String acak, semakin random semakin baik |
| `DIGIFLAZZ_USERNAME` | `member@email.com` | Username login Digiflazz |
| `DIGIFLAZZ_API_KEY` | `abc123def456` | API Key dari Digiflazz |
| `PAYWUZ_API_KEY` | `pwz_xxxxx` | API Key dari Paywuz |
| `PAYWUZ_PRIVATE_KEY` | `sk_xxxxx` | Private Key dari Paywuz |

3. Setiap variable: pilih **Production** (dan **Preview** jika mau)
4. Tap **Save**

---

### 🗄️ **Langkah 5: D1 Database Binding**

1. Cloudflare Pages → **topup-tepi** → **Settings** → **Functions**
2. Scroll ke **D1 database bindings**
3. Tap **Add binding**
4. ```
   Variable name: DB
   Database: topup-tepi-database (pilih dari dropdown)
   ```
5. Tap **Save**
6. **Redeploy** aplikasi (tab Deployments → trigger deploy baru)

---

### 💎 **Langkah 6: Daftar & Setup Digiflazz**

1. Buka **member.digiflazz.com/register**
2. Daftar (isi data lengkap, verifikasi email)
3. Login → Dashboard → **Profile / API**
4. Catat:
   - `Username` (email)
   - `API Key`
5. **Isi saldo** Digiflazz (min Rp50rb untuk testing)
6. **Setup Webhook:**
   - Cari menu Webhook di dashboard Digiflazz
   - Set URL: `https://topup-tepi.pages.dev/api/webhook/digiflazz`
   - Simpan

---

### 💳 **Langkah 7: Daftar & Setup Paywuz**

1. Buka **paywuz.com**
2. Daftar akun merchant
3. Verifikasi data
4. Dashboard → **API Settings**
5. Catat:
   - `API Key`
   - `Private Key`
   - `Merchant Code`
6. **Setup Callback URL:**
   - Di menu Callback/Webhook
   - Set URL: `https://topup-tepi.pages.dev/api/webhook/paywuz`
   - Simpan

---

### 📜 **Langkah 8: Setup Google Apps Script**

1. Buka **script.google.com**
2. Tap **+ New Project**
3. Hapus kode default
4. Buka file `apps-script/code.gs` → copy semua
5. Paste ke editor Apps Script
6. Ubah konfigurasi (jika perlu):
   ```javascript
   const CONFIG = {
     ADMIN_EMAIL: 'emailkamu@gmail.com',
     SPREADSHEET_ID: 'YOUR_SPREADSHEET_ID',
     ...
   }
   ```
7. Buat spreadsheet baru: `sheets.new` → copy ID dari URL
8. Save project (Ctrl+S) → nama: `TopUp Tepi Monitoring`
9. Pilih fungsi `init` → tap **Run** → Authorize
10. Deploy → **New deployment** → **Web App**
    - Execute as: `Me`
    - Access: `Anyone`
    - Tap **Deploy** → copy URL

---

### 🌍 **Langkah 9: Setup Domain (jika punya)**

1. Beli domain di **Niagahoster** / **Cloudflare Registrar** / **Domainesia**
2. Ganti **nameserver** ke Cloudflare:
   ```
   darl.ns.cloudflare.com
   james.ns.cloudflare.com
   ```
3. Tunggu 1-24 jam propagasi
4. Cloudflare Dashboard → **Pages** → **topup-tepi** → **Custom domains**
5. Tap **Set up a custom domain**
6. Masukkan domain: `topup.tepi.my.id`
7. Selesai!

### 📧 **Langkah 10: Setup Email (jika punya domain)**

1. Cloudflare Dashboard → Pilih domain → **Email** → **Email Routing**
2. Aktifkan Email Routing
3. **Create route:**
   - `support@topup.tepi.my.id` → `emailkamu@gmail.com`
   - `admin@topup.tepi.my.id` → `emailkamu@gmail.com`
   - `info@topup.tepi.my.id` → `emailkamu@gmail.com`

---

## 💰 13. Biaya Operasional

### 🏗️ **Biaya Setup (Sekali)**

| Item | Biaya | Keterangan |
|------|-------|------------|
| Domain (.my.id / .xyz) | **Rp20.000 - Rp50.000** | Per tahun, opsional |
| **Total Setup** | **Rp0 - Rp50.000** | |

### 📅 **Biaya Bulanan**

| Layanan | Biaya | Batasan |
|---------|-------|---------|
| Cloudflare Pages | **Gratis** | Bandwidth unlimited, 500 build/bln |
| Cloudflare D1 (Free) | **Gratis** | 5GB storage, 10M read/bln |
| GitHub | **Gratis** | Repo publik/unlimited |
| Google Apps Script | **Gratis** | 6 jam eksekusi/hari |
| Digiflazz | **Sesuai transaksi** | Modal produk + margin |
| Paywuz | **Fee 1-2%** | Per transaksi top-up |
| Gmail | **Gratis** | 15GB storage |

### 💎 **Estimasi per Bulan (jika sudah jalan)**

| Item | Biaya |
|------|-------|
| Cloudflare | Rp0 |
| Domain (amortisasi) | Rp2.000 - Rp4.000/bln |
| Fee Paywuz (misal 50 top-up @Rp50rb) | Rp25.000 - Rp50.000 |
| **Total/bulan** | **Rp27.000 - Rp54.000** |

---

## ❓ 14. FAQ

### 🤔 **Apa bedanya PPOB dengan payment gateway biasa?**

**PPOB** fokus ke pembelian produk digital seperti pulsa, token listrik, PDAM — biasanya punya margin kecil tapi volume tinggi.
**Payment Gateway** (seperti Paywuz) adalah jembatan untuk menerima pembayaran dari user — via VA, QRIS, dll.

Di project ini, **keduanya digabung**:
- PPOB → **Digiflazz** (beli produk)
- Payment Gateway → **Paywuz** (terima bayaran dari user)

---

### 🤔 **Apa itu D1 Database?**

**Cloudflare D1** adalah database SQLite serverless yang terintegrasi dengan Cloudflare. Data disimpan di edge network Cloudflare sehingga aksesnya cepat. Gratis sampai 5GB.

---

### 🤔 **Kenapa pilih static export? Bukannya Next.js lebih bagus untuk SSR?**

Karena Cloudflare Pages versi gratis hanya support **static export** dengan **Pages Functions** untuk API. SSR (Server-Side Rendering) perlu **Cloudflare Workers** yang lebih kompleks. Tapi untuk aplikasi PPOB, static export sudah cukup karena semua data diambil via API di sisi client.

---

### 🤔 **Apa itu JWT Token?**

**JWT (JSON Web Token)** adalah cara untuk mengotentikasi user tanpa menyimpan session di server. Cara kerja:
1. User login → server buat token terenkripsi → dikirim ke client
2. Client simpan token di localStorage
3. Setiap request, client kirim token di header
4. Server verifikasi token → jika valid, proses request

Token berlaku **24 jam**, setelah itu user harus login ulang.

---

### 🤔 **Apakah aman? Data user disimpan di mana?**

- ✅ **Password di-hash** dengan bcrypt (tidak bisa dibaca balik)
- ✅ **Token JWT** untuk autentikasi
- ✅ **HTTPS** dari Cloudflare (otomatis)
- ✅ **D1 Database** hanya bisa diakses dari Pages Functions
- ✅ **API Keys** disimpan di Environment Variables, bukan di kode
- ❌ **Jangan commit** API keys ke GitHub!

Data user disimpan di **Cloudflare D1** yang berlokasi di data center Cloudflare terdekat.

---

### 🤔 **Bisa dipakai langsung setelah deploy?**

Bisa untuk **testing**, tapi untuk produksi perlu:
1. ✅ Isi saldo Digiflazz
2. ✅ Setup Paywuz dengan data merchant valid
3. ✅ Beli domain (biar lebih profesional)
4. ✅ Setup webhook di Digiflazz & Paywuz
5. ✅ Testing transaksi dengan nominal kecil dulu

---

### 🤔 **Kalau Cloudflare down, webhook ilang dong?**

**AMAN!** Google Apps Script punya endpoint webhook alternatif. Jadi setting webhook di Digiflazz/Paywuz ke:
1. **Utama:** `https://topup-tepi.pages.dev/api/webhook/...`
2. **Backup:** `https://script.google.com/macros/s/.../exec`

Jika Cloudflare mati, Apps Script akan menerima webhook dan menyimpannya di spreadsheet sementara.

---

### 🤔 **Bisa dipasang di HP? Ada Play Store-nya nggak?**

Untuk sekarang, akses via **browser** (Chrome/Samsung Internet). Tapi karena kita pakai PWA (Progressive Web App), user bisa:
1. Buka `https://topup-tepi.pages.dev` di Chrome
2. Tap menu → **Add to Home Screen**
3. Icon akan muncul di layar HP seperti aplikasi native
4. Bisa akses offline untuk halaman yang sudah dikunjungi

Untuk **Play Store**, perlu Android wrapper (pakai Capacitor/TWA) — itu bisa dilakukan di tahap selanjutnya.

---

### 🤔 **Apa yang harus dilakukan jika ada error?**

1. **Cek log** di Cloudflare Pages dashboard (tab Logs)
2. **Cek log** di Google Apps Script (tab Executions)
3. **Cek saldo Digiflazz** — mungkin habis
4. **Cek API key** — mungkin expired
5. **Redeploy** — mungkin ada bug yang sudah diperbaiki
6. **Hubungi support** Digiflazz atau Paywuz jika problem dari mereka

---

### 🤔 **Bisa custom tampilan (branding sendiri)?**

**Tentu!** Semua kode ada di folder `src/app/`. Kamu bisa:
- Ganti logo, warna, font
- Tambah halaman baru
- Ubah teks dan konten
- Tambah fitur kustom

Yang perlu diubah:
1. `src/app/layout.tsx` — Title, meta tags
2. `src/app/globals.css` — Warna tema
3. `src/app/page.tsx` — Landing page
4. `public/favicon.svg` — Icon
5. `public/manifest.json` — PWA config

---

> **Dokumentasi ini dibuat untuk memudahkan pemahaman proyek TopUp Tepi secara menyeluruh.**
>
> Jika ada pertanyaan, jangan ragu untuk bertanya! 😊
