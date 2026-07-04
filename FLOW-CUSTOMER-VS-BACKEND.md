# 👤 CUSTOMER vs 🔧 BELAKANG LAYAR
## Flow Lengkap TopUp Tepi — Dari Mata Pengguna & Sisi Server

---

## 🅰️ FLOW 1 — REGISTRASI (Daftar Akun)

---

### 👤 YANG DILIHAT CUSTOMER

**Langkah 1 — Buka Website**
Customer buka Chrome/ browser HP, ketik `topup-tepi.pages.dev`.
Muncul halaman Landing Page:
- Logo huruf T warna biru-ungu
- Nama "TopUp Tepi"
- Tombol "Masuk" dan "Daftar"
- Penjelasan fitur dan produk

**Langkah 2 — Klik "Daftar"**
Customer tap tombol "Daftar Gratis".
Browser pindah ke halaman daftar.

**Langkah 3 — Isi Form**
Customer lihat 5 kolom:
- Nama Lengkap
- Email
- Nomor HP (opsional)
- Password
- Konfirmasi Password

Customer isi semua, misal:
- Nama: "Budi Santoso"
- Email: "budi@gmail.com"
- No HP: "081234567890"
- Password: "rahasia123"
- Konfirmasi: "rahasia123"

**Langkah 4 — Tap "Daftar Gratis"**
Tombol berubah jadi "Mendaftar..." dengan animasi loading.
Beberapa detik kemudian muncul notifikasi atau langsung pindah halaman.

**Langkah 5 — Redirect ke Halaman Login**
Customer dibawa ke halaman `/login` dan bisa login dengan akun barunya.

---

### 🔧 YANG TERJADI DI BELAKANG LAYAR

**Langkah 1 — Browser Render Landing Page**
- File `page.tsx` di-load sebagai HTML statis dari Cloudflare CDN
- CSS Tailwind di-render, gamabr icon dimuat

**Langkah 2 — Navigasi ke /register**
- Cloudflare Pages serve file `register/page.tsx`
- Browser render form register

**Langkah 3 — Validasi Awal (Client-side)**
- Saat customer isi form, SEBELUM submit, browser cek:
  - Password >= 6 karakter?
  - Konfirmasi password cocok?
  - Email format valid? (cek ada @ dan .)
- Kalau ada masalah, error muncul tanpa perlu ke server

**Langkah 4 — Fetch API Register**
Browser kirim request:
```
POST /api/auth/register
Body: { email, nama, phone, password }
```

**Langkah 5 — Cloudflare Pages Functions aktif**
Request sampai ke server Cloudflare (Edge Network):
- Fungsi `register/route.ts` dijalankan
- Validasi ulang pakai Zod (keamanan lapis kedua)
- Hash password pakai bcrypt (password diacak jadi kode tidak terbaca)
- Generate ID user unik pakai nanoid: `user-XyZ123abc`

**Langkah 6 — Simpan ke Database D1**
SQL dijalankan ke Cloudflare D1:
```sql
INSERT INTO users (id, email, nama, phone, password, role, saldo)
VALUES ('user-XyZ123abc', 'budi@gmail.com', 'Budi Santoso', 
        '081234567890', '$2a$12$hash...', 'user', 0)
```
- Data langsung disimpan di edge database Cloudflare
- Password sudah di-hash, AMAN

**Langkah 7 — Response balik**
Server kirim: `{ success: true, message: "Registrasi berhasil!" }`
Browser terima → redirect ke `/login`

---

## 🅱️ FLOW 2 — LOGIN (Masuk Akun)

---

### 👤 YANG DILIHAT CUSTOMER

**Langkah 1 — Halaman Login**
Customer lihat form:
- Email: "budi@gmail.com"
- Password: "********"
- Tombol "Masuk" warna biru-ungu
- Link "Belum punya akun? Daftar"

**Langkah 2 — Isi & Tap Masuk**
Customer isi email dan password, tap "Masuk".
Tombol berubah "Memproses..." sebentar.

**Langkah 3 — Masuk Dashboard**
Customer langsung dibawa ke halaman Dashboard.
Di pojok kiri ada nama "Budi Santoso". 
Saldo terlihat Rp 0.
Ada menu di samping: Beranda, Transaksi Baru, Top Up, Riwayat, Profil.

---

### 🔧 YANG TERJADI DI BELAKANG LAYAR

**Langkah 1 — Browser Fetch API Login**
```
POST /api/auth/login
Body: { email: "budi@gmail.com", password: "rahasia123" }
```

**Langkah 2 — Cari User di Database**
```sql
SELECT * FROM users WHERE email = 'budi@gmail.com'
```
- Kalau tidak ketemu → error "Email atau password salah"
- Kalau ketemu, ambil password hash dari database

**Langkah 3 — Verifikasi Password**
Bandingkan pake bcrypt:
- Password dari form: `"rahasia123"`
- Hash di DB: `"$2a$12$abc123def456..."`
- bcrypt punya fungsi khusus compare, karena hash tidak bisa didecrypt

**Langkah 4 — Generate JWT Token**
Buat token pakai library `jose`:
```json
{
  "userId": "user-XyZ123abc",
  "email": "budi@gmail.com",
  "role": "user",
  "exp": 1690086400  // 24 jam dari sekarang
}
```
Token ini di-sign pake `JWT_SECRET` dari Environment Variable.

**Langkah 5 — Response Login**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": { "email": "budi@gmail.com", "role": "user" }
  }
}
```

**Langkah 6 — Browser Simpan Token**
- Token disimpan di `localStorage` HP customer
- Data user juga disimpan di `localStorage`
- Setiap halaman Dashboard nanti, token ini dipakai sebagai "KTP digital"

**Langkah 7 — Dashboard Layout Dimuat**
- Layout Dashboard cek localStorage
- Kalau token tidak ada → redirect balik ke login
- Kalau ada → tampilkan sidebar + konten

---

## 🅲 FLOW 3 — TOP UP SALDO (Isi Saldo)

---

### 👤 YANG DILIHAT CUSTOMER

**Langkah 1 — Buka Halaman Top Up**
Customer tap menu "💰 Top Up Saldo" di sidebar.

**Langkah 2 — Lihat Halaman Top Up**
Ada:
- Input jumlah (bisa ketik manual)
- 6 tombol cepat: Rp 10rb, 20rb, 50rb, 100rb, 200rb, 500rb
- Rincian biaya (belum muncul karena belum pilih nominal)
- Metode pembayaran:
  - Virtual Account: BCA, Mandiri, BNI, BRI
  - E-Wallet: QRIS, GoPay, OVO, DANA
- Tombol besar "Top Up" di bawah

**Langkah 3 — Pilih Jumlah & Metode**
Customer tap tombol "Rp 50.000".
Otomatis kolom terisi 50000.
Rincian muncul:
- Jumlah: Rp 50.000
- Biaya (2%): Rp 1.000
- Total: Rp 51.000

Customer tap tombol "BCA" (Virtual Account BCA).
Tombol BCA berubah biru.

**Langkah 4 — Tap "Top Up"**
Tombol berubah "Memproses..." dengan animasi.

**Langkah 5 — Dapat Nomor Virtual Account**
Muncul kartu hijau:
```
✅ Pembayaran Dibuat!
Virtual Account: 1234567890123
Total: Rp 51.000
Segera transfer sebelum jam 15:30 WIB
```

**Langkah 6 — Transfer ke Bank**
Customer buka aplikasi m-BCA, pilih transfer ke Virtual Account.
Masukkan nomor: 1234567890123
Jumlah: Rp 51.000
Konfirmasi transfer.

**Langkah 7 — Cek Dashboard (setelah transfer)**
Customer kembali ke Dashboard, refresh.
Saldo berubah dari Rp 0 menjadi Rp 50.000! 🎉

---

### 🔧 YANG TERJADI DI BELAKANG LAYAR

**Langkah 1 — Render Halaman Top Up**
- File `topup/page.tsx` di-load
- Semua komponen React di-render di browser

**Langkah 2 — Customer Pilih Nominal (Client-side)**
- Nilai 50000 disimpan di state React (`useState`)
- Rincian biaya dihitung otomatis di browser: `fee = 50000 * 0.02 = 1000`
- Tidak perlu ke server untuk perhitungan ini

**Langkah 3 — Customer Pilih Metode (Client-side)**
- Channel "bca" disimpan di state React
- CSS update: tombol BCA jadi warna biru

**Langkah 4 — Fetch API (Saat Tap "Top Up")**
```
POST /api/payment/create
Headers: { Authorization: "Bearer eyJhbGci..." }
Body: { amount: 50000, paymentMethod: "va", paymentChannel: "bca" }
```

**Langkah 5 — Server Verifikasi JWT**
- Ambil token dari header
- Verifikasi pake `jose` + `JWT_SECRET`
- Kalau expired → 401 error, customer harus login ulang

**Langkah 6 — Server Generate Order ID**
- `nanoid(12)` menghasilkan ID unik: `TOPUP-aBcXyZ123`

**Langkah 7 — Server Panggil API Paywuz**
```
POST https://paywuz.com/api/v1/transaction/create
Headers: { X-API-Key: "pwz_xxxxx" }
Body: {
  amount: 50000,
  customer_name: "Budi",
  customer_email: "budi@gmail.com",
  order_id: "TOPUP-aBcXyZ123",
  payment_method: "va_bca",
  expired_minutes: 60,
  callback_url: "https://topup-tepi.pages.dev/api/webhook/paywuz"
}
```
- Paywuz adalah payment gateway, mereka yang ngurusin pembuatan Virtual Account
- `callback_url` = alamat yang akan Paywuz panggil nanti kalau customer sudah bayar

**Langkah 8 — Paywuz Merespon dengan VA**
```json
{
  "status": true,
  "data": {
    "va_number": "1234567890123",
    "amount": 51000,
    "expired_at": "2026-07-05T15:30:00Z"
  }
}
```
Paywuz membuatkan Virtual Account BCA atas nama TopUp Tepi, khusus untuk transaksi ini.

**Langkah 9 — Server Simpan ke Database**
```sql
INSERT INTO topups (id, user_id, amount, fee, total, payment_method, 
                    payment_channel, status, va_number, expired_at)
VALUES ('TOPUP-aBcXyZ123', 'user-XyZ123abc', 50000, 1000, 51000,
        'va', 'bca', 'pending', '1234567890123', '2026-07-05 15:30:00')
```
- Status masih `pending` karena customer belum bayar

**Langkah 10 — Response ke Browser**
```json
{
  "success": true, "message": "Pembayaran dibuat",
  "data": { "va_number": "1234567890123", "amount": 51000 }
}
```

**Langkah 11 — Browser Tampilkan VA**
React update state, muncul kartu hijau dengan VA number.

**— CUSTOMER TRANSFER (di luar aplikasi) —**

**Langkah 12 — Paywuz Deteksi Pembayaran**
- Bank BCA memberi tahu Paywuz: "Ada transfer Rp 51.000 ke VA 1234567890123"
- Paywuz cocokkan dengan data transaksi: ini milik order TOPUP-aBcXyZ123

**Langkah 13 — Paywuz Kirim Webhook ke Server Kita**
```
POST https://topup-tepi.pages.dev/api/webhook/paywuz
Headers: { X-Signature: "sha256_hash..." }
Body: {
  "order_id": "TOPUP-aBcXyZ123",
  "status": "paid",
  "amount": 51000
}
```
Webhook = notifikasi otomatis. Server Paywuz langsung hubungi server kita.

**Langkah 14 — Server Verifikasi Webhook**
Buat hash SHA256 dari `body + PAYWUZ_PRIVATE_KEY`, bandingkan dengan `X-Signature`.
Kalau cocok → asli dari Paywuz, bukan hacker.
Kalau tidak cocok → tolak (401).

**Langkah 15 — Update Database TopUp**
```sql
UPDATE topups SET status = 'paid' WHERE id = 'TOPUP-aBcXyZ123'
```

**Langkah 16 — Tambah Saldo Customer**
Cari user_id dari data top-up, lalu:
```sql
UPDATE users SET saldo = saldo + 50000 WHERE id = 'user-XyZ123abc'
```
Saldo customer berubah: Rp 0 → Rp 50.000 ✅

**Langkah 17 — Balas Webhook 200 OK**
Server bilang ke Paywuz: "Udah saya terima, makasih!"
Paywuz stop ngirim ulang webhook.

**Langkah 18 — Customer Refresh Dashboard**
Browser fetch ulang data (atau saldo tampil dari localStorage yang diupdate).
Saldo tampil Rp 50.000.

---

## 🅳 FLOW 4 — BELI PULSA (Transaksi PPOB)

---

### 👤 YANG DILIHAT CUSTOMER

**Langkah 1 — Buka Halaman Transaksi**
Di Dashboard, customer lihat grid shortcut. Tap "📱 Pulsa".
Browser pindah ke `/dashboard/transactions?cat=pulsa`.

**Langkah 2 — Lihat Daftar Produk**
Kategori "Pulsa" otomatis terpilih (warna biru).
Customer lihat daftar:
- ✨ Telkomsel 5rb — Rp 5.500
- ✨ Telkomsel 10rb — Rp 10.500
- ✨ Telkomsel 20rb — Rp 20.500
- ✨ XL 5rb — Rp 5.500
- ✨ XL 10rb — Rp 10.500
- ✨ Indosat 5rb — Rp 5.500
- ✨ Indosat 10rb — Rp 10.500

Di atas ada kolom input "Nomor HP" dengan placeholder "08xx-xxxx-xxxx".

**Langkah 3 — Input Nomor & Pilih Produk**
Customer ketik: "081234567890"
Lalu tap kartu "Telkomsel 10rb — Rp 10.500".

**Langkah 4 — Loading**
Tombol berubah jadi spinner, tulisan "Memproses..."
Beberapa detik kemudian:

**Langkah 5 — Notifikasi Sukses**
Muncul kartu hijau:
```
✅ Transaksi Berhasil!
Telkomsel 10rb
Nomor: 081234567890
SN: 1234567890
```

Customer cek HP tujuan 081234567890, pulsa sudah masuk! 📱

---

### 🔧 YANG TERJADI DI BELAKANG LAYAR

**Langkah 1 — Browser Render Halaman**
- File `transactions/page.tsx` di-load
- Parameter `?cat=pulsa` dibaca dari URL
- Produk pulsa ditampilkan dari data sample (nanti dari API Digiflazz)

**Langkah 2 — Customer Pilih Produk**
- `productCode: "TSEL10"` disimpan
- `customerNo: "081234567890"` disimpan
- Event handler `handleBuy()` dipanggil

**Langkah 3 — Fetch API Transaction**
```
POST /api/ppob/transaction
Headers: { Authorization: "Bearer eyJhbGci..." }
Body: { productCode: "TSEL10", customerNo: "081234567890" }
```

**Langkah 4 — Server Verifikasi**
- Cek JWT token: valid?
- Validasi input: productCode tidak kosong? customerNo minimal 3 digit?
- Ambil data user dari database (untuk cek saldo)

**Langkah 5 — Cek Saldo**
```sql
SELECT saldo FROM users WHERE id = 'user-XyZ123abc'
```
Saldo customer = Rp 50.000
Harga produk = Rp 10.500
Saldo cukup? 50.000 > 10.500 ✅, lanjut.

**Langkah 6 — Generate Ref ID**
```
PPOB-aBcXyZ123Pakai nanoid
```

**Langkah 7 — Kurangi Saldo (Sementara)**
```sql
UPDATE users SET saldo = saldo - 10500 WHERE id = 'user-XyZ123abc'
```
Saldo jadi Rp 39.500. Nanti kalau gagal, di-refund.

**Langkah 8 — Hitung Signature Digiflazz**
```
sign = MD5(username + api_key + ref_id)
```
Ini cara Digiflazz verifikasi bahwa request benar dari server kita (bukan orang lain).

**Langkah 9 — Panggil API Digiflazz**
```
POST https://api.digiflazz.com/v1/transaction
Body: {
  username: "member@email.com",
  sign: "a1b2c3d4e5f6...",
  buyer_sku_code: "TSEL10",
  customer_no: "081234567890",
  ref_id: "PPOB-aBcXyZ123"
}
```

**Langkah 10 — Digiflazz Proses Pengiriman Pulsa**
- Validasi sign (cocok tidak?)
- Cek stok produk TSEL10 (ada tidak?)
- Kirim pulsa 10rb ke nomor 081234567890 via operator Telkomsel
- Operator Telkomsel proses pengiriman

**Langkah 11 — Digiflazz Response Sukses**
```json
{
  "data": {
    "rc": "00",
    "status": "Sukses",
    "sn": "1234567890",
    "message": "Transaksi Sukses"
  }
}
```
- `rc: "00"` = kode sukses (standar banking/PPOB)
- `sn` = Serial Number, bukti transaksi

**Langkah 12 — Simpan Transaksi ke Database**
```sql
INSERT INTO transactions (id, user_id, customer_no, product_code, 
                          product_name, kategori, harga, status, sn)
VALUES ('PPOB-aBcXyZ123', 'user-XyZ123abc', '081234567890', 'TSEL10',
        'Telkomsel 10rb', 'pulsa', 10500, 'success', '1234567890')
```

**Langkah 13 — Response ke Browser**
```json
{
  "success": true,
  "message": "Transaksi berhasil diproses",
  "data": { "refId": "PPOB-aBcXyZ123", "sn": "1234567890" }
}
```

**Langkah 14 — Browser Tampilkan Notifikasi**
React update state, render kartu hijau.

---

## 🅴 FLOW 5 — WEBHOOK DARI DIGIFLAZZ (Step Tambahan)

Sama seperti Paywuz, Digiflazz juga kirim webhook. Tapi ini lebih ke "konfirmasi" karena transaksi sudah dianggap sukses dari response sebelumnya.

---

### 🔧 TERJADI DI BELAKANG LAYAR (Otomatis)

**Langkah 1 — Digiflazz Kirim Webhook**
Beberapa saat setelah transaksi, Digiflazz kirim:
```
POST /api/webhook/digiflazz
Body: {
  "event": "payment", 
  "data": {
    "ref_id": "PPOB-aBcXyZ123",
    "status": "Sukses",
    "serial_number": "1234567890"
  }
}
```

**Langkah 2 — Server Update Database (Konfirmasi)**
```sql
UPDATE transactions 
SET status = 'success', sn = '1234567890' 
WHERE id = 'PPOB-aBcXyZ123'
```
(Kalau udah di-update pas transaksi, ini hanya konfirmasi ulang)

**Langkah 3 — Kalau Status "Gagal"**
```sql
UPDATE transactions SET status = 'failed' WHERE id = 'PPOB-xxx'
UPDATE users SET saldo = saldo + 10500 WHERE id = 'user-xxx' -- REFUND!
```
Saldo dikembalikan ke customer. 💸

---

## 🅵 FLOW 6 — RIWAYAT & PROFIL

---

### 👤 YANG DILIHAT CUSTOMER

**Riwayat Transaksi (`/dashboard/history`):**
Customer lihat daftar semua transaksi:
- Tanggal, produk, nominal, status
- Bisa filter: Semua, Sukses, Pending, Gagal
- Setiap item klik bisa lihat detail

**Profil (`/dashboard/profile`):**
Customer lihat:
- Foto avatar (inisial)
- Email, No HP, Role
- Nama aplikasi "TopUp Tepi v1.0.0"

**Logout:**
Customer tap "Keluar" di sidebar → balik ke halaman login.

---

### 🔧 YANG TERJADI DI BELAKANG LAYAR

**Riwayat:**
- Data diambil dari localStorage user
- Filter dikerjakan 100% di browser (JavaScript filter array)
- Nanti kalau sudah connect D1, data diambil dari database

**Profil:**
- Data ditampilkan dari localStorage (`user`)
- Tidak ada fetch ke server

**Logout:**
- Browser hapus key `token` dan `user` dari localStorage
- Token JWT TIDAK di-invalidate di server (karena kita pake JWT stateless)
- Tapi karena token sudah dihapus dari HP, customer harus login ulang
- Token lama akan expired otomatis dalam 24 jam

---

## 🅶 FLOW 7 — LANDING PAGE (Sebelum Login)

---

### 👤 YANG DILIHAT CUSTOMER (Pengunjung Baru)

**Halaman Depan (`/`):**
- Hero section: "Top Up & Pembayaran Online Termurah & Termudah"
- Statistik: 50K+ Transaksi, 10K+ Pelanggan, 100+ Produk
- 6 Kartu fitur: Proses Cepat, Harga Murah, Aman, Laporan, Banyak Produk, Support
- 8 Ikon produk: Pulsa, Data, Token, PDAM, BPJS, Game, TV, E-Wallet
- Tombol "Mulai Sekarang" → ke /register
- Footer: copyright 2026, kontak

---

### 🔧 YANG TERJADI DI BELAKANG LAYAR

- File `page.tsx` di-load dari Cloudflare CDN (static)
- Semua teks dan ikon sudah di-render (tidak butuh database)
- Halaman ini bisa diakses SIAPAPUN tanpa login
- Load time: super cepat karena static HTML dari CDN

---

## 🅷 FLOW 8 — LOGOUT

---

### 👤 YANG DILIHAT CUSTOMER

Customer tap "Keluar" di sidebar (bawah, warna merah).
Browser langsung pindah ke halaman login.
Token/login sebelumnya hilang.

---

### 🔧 YANG TERJADI DI BELAKANG LAYAR

```javascript
localStorage.removeItem('token')
localStorage.removeItem('user')
router.push('/login')
```
- Token dihapus dari HP
- Tidak ada panggilan API ke server
- JWT token sebenarnya MASIH valid sampai 24 jam, tapi karena sudah hilang dari HP, tidak bisa dipakai lagi
- Untuk keamanan lebih: nanti bisa ditambah blacklist token di database

---

## 🆃 FLOW END-TO-END COMPLETE

### Satu Skenario Lengkap: Budi Beli Pulsa Rp 10.000

```
WAKTU      | CUSTOMER (Budi)                     | SERVER (Belakang Layar)
-----------+--------------------------------------+-----------------------------------
09:00      | Buka website                        | CDN serve landing page (static)
09:01      | Klik "Daftar"                       | Serve halaman register
09:02      | Isi form: Budi, budi@gmail.com,     | Validasi client-side
           | password: rahasia123                 |
09:02:30   | Klik "Daftar Gratis"                 | Kirim POST /api/auth/register
           |                                      | Validasi Zod, hash bcrypt
           |                                      | INSERT ke D1: users
           |                                      | Response: { success: true }
09:03      | Redirect ke /login                   | Serve halaman login
09:04      | Login: budi@gmail.com / rahasia123   | Kirim POST /api/auth/login
           |                                      | SELECT user from D1
           |                                      | Compare bcrypt password
           |                                      | Generate JWT token (exp: 24 jam)
           |                                      | Response: { token, user }
09:04:30   | Masuk Dashboard                      | Simpan token di localStorage
           |                                      | Render dashboard layout
           | Saldo: Rp 0                           | SELECT saldo from D1
09:05      | Klik "Top Up Saldo"                  | Serve halaman top up
09:06      | Pilih Rp 50.000 + BCA VA             | Hitung fee: 50000*2% = 1000
09:06:30   | Klik "Top Up"                        | Kirim POST /api/payment/create
           |                                      | Verifikasi JWT
           |                                      | Generate order ID: TOPUP-xxx
           |                                      | Panggil API Paywuz (create VA)
           |                                      | INSERT ke D1: topups (pending)
           |                                      | Response: { va_number: 12345 }
09:07      | Dapat VA: 1234567890123              | Tampilkan VA di browser
           | Total: Rp 51.000                     |
09:10      | Buka m-BCA, transfer Rp 51.000       | (di luar aplikasi)
           | ke VA 1234567890123                   |
09:11      | (selesai transfer)                   | Paywuz deteksi pembayaran
           |                                      | Paywuz kirim WEBHOOK:
           |                                      | POST /api/webhook/paywuz
           |                                      | Verifikasi signature (SHA256)
           |                                      | UPDATE topups SET status=paid
           |                                      | UPDATE users saldo=saldo+50000
           |                                      | Response 200 OK ke Paywuz
09:12      | Buka Dashboard, refresh              | Render ulang dashboard
           | Saldo: Rp 50.000 🎉                   | Saldo sudah +50000
09:13      | Klik "Pulsa"                         | Serve halaman transaksi
09:15      | Input no: 081234567890               | (client-side)
           | Pilih: Telkomsel 10rb Rp 10.500      |
09:15:30   | Klik "Telkomsel 10rb"                | Kirim POST /api/ppob/transaction
           |                                      | Verifikasi JWT
           |                                      | Cek saldo: 50000 >= 10500 ✅
           |                                      | UPDATE users saldo=saldo-10500
           |                                      | Generate ref ID: PPOB-xxx
           |                                      | Hitung sign MD5
           |                                      | Panggil API Digiflazz
           |                                      | Digiflazz kirim pulsa 10rb
           |                                      | INSERT ke D1: transactions
           |                                      | Response: { success, sn }
09:16      | ✅ Transaksi Berhasil!               | Tampilkan SN: 1234567890
           | SN: 1234567890                       |
09:17      | Cek HP 081234567890                  | Pulsa Telkomsel 10rb MASUK!
           | Pulsa masuk! 🎉                      |
09:17:30   | Digiflazz kirim webhook (konfirmasi) | UPDATE transactions confirmation
-----------+--------------------------------------+-----------------------------------
SALDO AKHIR: Rp 39.500                           | 
```

---

## 🆀 RINGKASAN — SIAPA MELAKUKAN APA

| Komponen | Tugas |
|----------|-------|
| **Browser (HP Customer)** | Nampilin halaman, validasi form dasar, simpan token, kirim fetch API |
| **Cloudflare CDN** | Nyimpen file statis (HTML, CSS, JS), deliver cepat ke HP customer |
| **Cloudflare Pages Functions** | Jalanin kode backend (API Routes) di edge server |
| **Cloudflare D1** | Database SQLite, nyimpen users, transactions, topups |
| **Digiflazz API** | Provider produk PPOB, ngirim pulsa/token/PDAM ke nomor tujuan |
| **Paywuz API** | Payment gateway, bikin Virtual Account / QRIS buat customer transfer |
| **Google Apps Script** | Monitoring, kirim email laporan, backup data otomatis |
| **GitHub Actions** | Auto-build & deploy tiap kali ada push ke GitHub |

---

## 💡 ISTILAH PENTING

| Istilah | Arti Sederhana |
|---------|---------------|
| **JWT Token** | KTP digital yang expired 24 jam. Dipakai biar server tahu "ini Budi" tanpa perlu login ulang |
| **Hash (bcrypt)** | Password diacak jadi kode. Kalau database bocor, password asli tidak bisa dibaca |
| **Webhook** | Notifikasi otomatis. "Hei, si Budi udah transfer nih!" |
| **Signature** | Tanda tangan digital. Biar server yakin webhook bener dari Paywuz, bukan hacker |
| **VA (Virtual Account)** | Nomor rekening virtual khusus buat 1 transaksi. Misal: 1234567890123 |
| **SN (Serial Number)** | Bukti transaksi PPOB. Kode unik tiap pembelian pulsa |
| **D1** | Database SQLite punya Cloudflare, gratis 5GB |
| **CDN** | Server Cloudflare tersebar di banyak negara, bikin website cepet dibuka dari mana aja |
| **localStorage** | Penyimpanan di browser HP, bisa dipake nyimpen token |
| **Ref ID** | ID unik transaksi biar gak dobel |
| **Checkout** | Proses pembayaran |
