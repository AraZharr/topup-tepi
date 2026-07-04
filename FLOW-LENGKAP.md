# 🧭 ALUR LENGKAP TOPUP TEPI (DARI AWAL SAMPAI SELESAI)

Dokumen ini menjelaskan seluruh alur aplikasi **TopUp Tepi** secara detail, langkah per langkah, dari pengguna masuk aplikasi sampai transaksi selesai. Dibuat dengan nomor urut biar mudah diikuti.

---

## 📌 BAGIAN 1 — ALUR REGISTRASI (Daftar Akun Baru)

---

**Langkah 1 — Pengguna membuka website**

Pengguna buka browser HP, ketik alamat: `https://topup-tepi.pages.dev` (nanti kalau sudah punya domain: `https://topup.tepi.my.id`). Yang muncul pertama adalah halaman **Landing Page**. Di halaman ini ada:
- Logo huruf "T" warna biru-ungu
- Nama "TopUp Tepi" di pojok kiri atas
- Tombol "Masuk" dan "Daftar" di pojok kanan atas
- Penjelasan fitur, produk yang tersedia, dan statistik

---

**Langkah 2 — Pengguna klik tombol "Daftar"**

Pengguna tertarik dan klik tombol "Daftar" (atau "Daftar Gratis"). Browser pindah ke halaman `/register`.

---

**Langkah 3 — Halaman Register tampil**

Di halaman Register, pengguna melihat formulir dengan 5 kolom:
- **Nama Lengkap** — harus diisi, minimal 2 karakter
- **Email** — harus diisi, format email valid
- **Nomor HP** — opsional, boleh dikosongkan
- **Password** — harus diisi, minimal 6 karakter
- **Konfirmasi Password** — harus diisi, harus sama dengan password

Di bagian bawah ada tombol "Daftar Gratis" berwarna gradien biru-ungu. Di bagian paling bawah ada link "Sudah punya akun? Masuk".

---

**Langkah 4 — Pengguna mengisi formulir**

Pengguna mengisi semua kolom. Misalnya:
- Nama: "Budi Santoso"
- Email: "budi@gmail.com"
- HP: "081234567890"
- Password: "rahasia123"
- Konfirmasi: "rahasia123"

Lalu menekan tombol "Daftar Gratis".

---

**Langkah 5 — Validasi di sisi browser (Frontend)**

Sebelum dikirim ke server, halaman web melakukan pengecekan sendiri dulu:
- Apakah password dan konfirmasi password sama? Kalau beda, muncul pesan error merah: "Password tidak cocok". Berhenti di sini.
- Apakah password minimal 6 karakter? Kalau kurang, muncul pesan: "Password minimal 6 karakter". Berhenti di sini.

Kalau semua valid, lanjut ke langkah berikutnya.

---

**Langkah 6 — Fetch ke API Register (Frontend → Backend)**

Browser mengirim request `POST /api/auth/register` ke server dengan data:
```
{
  "email": "budi@gmail.com",
  "nama": "Budi Santoso",
  "phone": "081234567890",
  "password": "rahasia123"
}
```

---

**Langkah 7 — API menerima dan memvalidasi (Backend)**

Server (Cloudflare Pages Functions) menerima request. Pertama dicek lagi menggunakan **Zod** (library validasi):
- Apakah email benar-benar format email valid?
- Apakah nama minimal 2 karakter?
- Apakah password minimal 6 karakter?

Kalau validasi gagal, server langsung balikin response error, misal: `{ "success": false, "message": "Email tidak valid" }`.

Kalau validasi lolos, lanjut.

---

**Langkah 8 — Proses simpan ke database (Backend → D1)**

Server akan melakukan:
- Hash password menggunakan bcrypt (password diacak jadi kode, tidak bisa dibaca balik)
- Generate ID unik untuk user baru (contoh: `user-aBcXyZ123`)
- Simpan data ke tabel `users` di Cloudflare D1 Database

Data yang disimpan:
```
id: "user-aBcXyZ123"
email: "budi@gmail.com"
nama: "Budi Santoso"
phone: "081234567890"
password: "$2a$12$abc123def456..." (sudah di-hash)
role: "user" (default, bukan admin)
saldo: 0 (belum punya saldo)
created_at: "2026-07-05 14:30:00" (waktu WIB)
```

---

**Langkah 9 — Response balik ke browser**

Server mengirim response sukses:
```json
{
  "success": true,
  "message": "Registrasi berhasil!",
  "data": {
    "email": "budi@gmail.com",
    "nama": "Budi Santoso"
  }
}
```

---

**Langkah 10 — Redirect ke halaman Login**

Browser menerima response sukses, lalu langsung mengarahkan pengguna ke halaman `/login?registered=true` (dengan parameter registered=true yang bisa dipakai untuk menampilkan notifikasi "Pendaftaran berhasil, silakan login").

**Selesai — Registrasi berhasil! 🎉**

---

## 📌 BAGIAN 2 — ALUR LOGIN (Masuk ke Akun)

---

**Langkah 1 — Pengguna membuka halaman Login**

Pengguna bisa sampai ke halaman login dengan beberapa cara:
- Baru selesai register, langsung diarahkan ke `/login`
- Klik tombol "Masuk" di landing page
- Ketik langsung `https://topup-tepi.pages.dev/login` di browser

---

**Langkah 2 — Halaman Login tampil**

Halaman login menampilkan:
- Logo "T" dan tulisan "TopUp Tepi" di tengah atas
- Form dengan 2 kolom: Email dan Password
- Tombol "Masuk" warna gradien
- Link "Belum punya akun? Daftar" di bawah

---

**Langkah 3 — Pengguna mengisi email dan password**

Pengguna mengisi:
- Email: `budi@gmail.com`
- Password: `rahasia123`

Lalu tekan tombol "Masuk".

---

**Langkah 4 — Fetch ke API Login (Frontend → Backend)**

Browser mengirim `POST /api/auth/login` dengan data:
```json
{
  "email": "budi@gmail.com",
  "password": "rahasia123"
}
```

---

**Langkah 5 — Validasi input di server**

Server mengecek dengan Zod:
- Apakah email formatnya valid?
- Apakah password tidak kosong?

---

**Langkah 6 — Cek user di database**

Server mencari user dengan email `budi@gmail.com` di tabel `users`. Kalau tidak ketemu, response error: "Email atau password salah".

Kalau ketemu, server ambil data user termasuk password yang sudah di-hash.

---

**Langkah 7 — Bandingkan password**

Server menggunakan bcrypt untuk membandingkan:
- Password yang diketik pengguna: `rahasia123`
- Password hash di database: `$2a$12$abc123...`

Kalau tidak cocok, response error: "Email atau password salah".

---

**Langkah 8 — Buat JWT Token**

Kalau password cocok, server membuat **JWT Token** menggunakan library `jose`. Token ini berisi:
```
{
  "userId": "user-aBcXyZ123",
  "email": "budi@gmail.com",
  "role": "user",
  "iat": 1690000000,     (waktu dibuat)
  "exp": 1690086400      (waktu kadaluarsa, 24 jam kemudian)
}
```

Token ini di-encrypt dan ditandatangani pakai `JWT_SECRET` (yang disimpan di Environment Variables Cloudflare).

---

**Langkah 9 — Response login berhasil**

Server mengirim:
```json
{
  "success": true,
  "message": "Login berhasil",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",     (JWT token panjang)
    "user": {
      "email": "budi@gmail.com",
      "role": "user"
    }
  }
}
```

---

**Langkah 10 — Simpan token di browser**

Browser menerima response, lalu menyimpan dua hal ke **localStorage** HP pengguna:
- `token` → berisi JWT token (dipakai untuk semua request selanjutnya)
- `user` → berisi data user (dipakai untuk menampilkan nama, email, dll)

---

**Langkah 11 — Redirect ke Dashboard**

Browser langsung mengarahkan pengguna ke halaman `/dashboard`.

**Selesai — Login berhasil! 🎉 Sekarang pengguna sudah masuk ke dalam aplikasi.**

---

## 📌 BAGIAN 3 — ALUR DASHBOARD (Setelah Login)

---

**Langkah 1 — Layout Dashboard tampil**

Begitu masuk `/dashboard`, yang pertama muncul adalah layout dashboard:

Di sisi kiri (atau di atas kalau HP layar kecil) ada **Sidebar** dengan menu:
- 🏠 Beranda
- 🛒 Transaksi Baru
- 💰 Top Up Saldo
- 📋 Riwayat
- 👤 Profil
- Tombol "Keluar" (Logout) di bagian bawah

Di pojok kanan atas ada lingkaran dengan inisial user (contoh: "B" dari Budi).

---

**Langkah 2 — Cek apakah user sudah login**

Sebelum dashboard ditampilkan, aplikasi mengecek localStorage:
- Apakah ada `token`? Kalau tidak ada, langsung redirect ke `/login`.
- Apakah ada `user`? Kalau tidak ada, langsung redirect ke `/login`.

Ini dilakukan setiap kali halaman dashboard dibuka.

---

**Langkah 3 — Halaman Beranda Dashboard**

Halaman utama dashboard menampilkan:
- **Salam**: "Halo, Budi! 👋"
- **Kartu Saldo**: warna gradien biru-ungu, menampilkan saldo (contoh: Rp 0 karena baru daftar), ada tombol "Isi Saldo" yang mengarah ke halaman top-up
- **Grid Transaksi Cepat**: 8 tombol shortcut (Pulsa, Paket Data, Token Listrik, PDAM, BPJS, Game, TV Kabel, E-Wallet) — tinggal tap langsung masuk ke halaman transaksi dengan kategori terpilih
- **Tips & Keamanan**: dua kartu informasi

---

**Langkah 4 — Navigasi ke halaman lain**

Pengguna bisa tap menu di sidebar untuk pindah halaman. Setiap halaman baru akan tetap dalam layout dashboard yang sama (sidebar dan top bar tetap ada). Halaman yang aktif akan diberi warna biru di sidebar.

---

**Langkah 5 — Logout**

Kalau pengguna tap "Keluar", maka:
- Hapus `token` dari localStorage
- Hapus `user` dari localStorage
- Redirect ke halaman `/login`

---

## 📌 BAGIAN 4 — ALUR TOP UP SALDO (Isi Saldo)

Sebelum bisa beli pulsa, pengguna harus punya saldo dulu. Ini cara isi saldo.

---

**Langkah 1 — Buka halaman Top Up**

Pengguna tap menu 💰 "Top Up Saldo" di sidebar. Browser pindah ke `/dashboard/topup`.

---

**Langkah 2 — Halaman Top Up tampil**

Halaman top-up menampilkan:
- Judul "Top Up Saldo"
- **Input jumlah**: kolom dengan simbol Rp di depan, bisa diketik manual
- **Quick Amount**: 6 tombol cepat (Rp10rb, Rp20rb, Rp50rb, Rp100rb, Rp200rb, Rp500rb) — tinggal tap untuk memilih
- **Rincian biaya**: kalau sudah pilih jumlah, muncul:
  - Jumlah: Rp50.000
  - Biaya (2%): Rp1.000
  - Total: Rp51.000
- **Metode Pembayaran**: dua grup:
  - Virtual Account: BCA, Mandiri, BNI, BRI
  - E-Wallet: QRIS, GoPay, OVO, DANA
- **Tombol "Top Up Rp50.000"** warna gradien

---

**Langkah 3 — Pengguna pilih jumlah dan metode**

Misalnya pengguna:
- Tap tombol Rp50.000 (kolom terisi otomatis)
- Tap tombol BCA (metode Virtual Account BCA terpilih)

---

**Langkah 4 — Tap tombol Top Up**

Browser melakukan pengecekan:
- Apakah jumlah minimal Rp5.000? Kalau kurang, muncul alert "Minimal top-up Rp5.000".
- Apakah metode pembayaran sudah dipilih? Kalau belum, muncul alert "Pilih metode pembayaran".

---

**Langkah 5 — Fetch ke API Payment Create**

Kalau semua ok, browser kirim `POST /api/payment/create` dengan:
- Header: `Authorization: Bearer {JWT token dari localStorage}`
- Body:
```json
{
  "amount": 50000,
  "paymentMethod": "va",
  "paymentChannel": "bca"
}
```

---

**Langkah 6 — Verifikasi token JWT**

Server menerima request, ambil token dari header, verifikasi pakai `jose`. Kalau token invalid/expired, balikin error 401 "Unauthorized".

---

**Langkah 7 — Generate Order ID**

Server membuat ID unik untuk transaksi top-up ini: `TOPUP-aBcXyZ123` (menggunakan library `nanoid`).

---

**Langkah 8 — Panggil API Paywuz**

Server memanggil API Paywuz (payment gateway):
```
POST https://paywuz.com/api/v1/transaction/create
Headers:
  Content-Type: application/json
  X-API-Key: {PAYWUZ_API_KEY}

Body:
{
  "amount": 50000,
  "customer_name": "Budi",
  "customer_email": "budi@gmail.com",
  "order_id": "TOPUP-aBcXyZ123",
  "payment_method": "va_bca",
  "expired_minutes": 60,
  "callback_url": "https://topup-tepi.pages.dev/api/webhook/paywuz"
}
```

---

**Langkah 9 — Paywuz merespon dengan Virtual Account**

Paywuz mengirim response berisi nomor Virtual Account:
```json
{
  "status": true,
  "data": {
    "order_id": "TOPUP-aBcXyZ123",
    "va_number": "1234567890123",
    "amount": 51000,
    "expired_at": "2026-07-05T15:30:00Z"
  }
}
```

---

**Langkah 10 — Simpan data top-up ke database**

Server menyimpan data top-up ke tabel `topups` di D1:
```
id: "TOPUP-aBcXyZ123"
user_id: "user-aBcXyZ123"
amount: 50000
fee: 1000
total: 51000
payment_method: "va"
payment_channel: "bca"
status: "pending" (masih menunggu dibayar)
va_number: "1234567890123"
expired_at: "2026-07-05T15:30:00"
created_at: "2026-07-05T14:30:00"
```

---

**Langkah 11 — Response ke browser**

Server mengirim balik ke browser:
```json
{
  "success": true,
  "message": "Pembayaran berhasil dibuat",
  "data": {
    "orderId": "TOPUP-aBcXyZ123",
    "va_number": "1234567890123",
    "amount": 51000,
    "expired_at": "2026-07-05T15:30:00"
  }
}
```

---

**Langkah 12 — Tampilkan Virtual Account ke user**

Browser menampilkan kartu hijau sukses dengan nomor Virtual Account:
```
✅ Pembayaran Dibuat!
Virtual Account Number:
1234567890123
Total: Rp 51.000
Kadaluarsa: 14:30 WIB
```

---

**Langkah 13 — Pengguna transfer ke Virtual Account**

Pengguna membuka aplikasi m-BCA atau datang ke ATM, lalu transfer sejumlah Rp51.000 ke nomor Virtual Account `1234567890123`.

---

**Langkah 14 — Paywuz mendeteksi pembayaran**

Setelah pengguna transfer, Paywuz mengecek dan melihat bahwa uang sudah masuk. Paywuz lalu mengirim **Webhook** (notifikasi otomatis) ke server kita.

---

**Langkah 15 — Webhook diterima server**

Paywuz mengirim `POST /api/webhook/paywuz` dengan data:
```json
{
  "order_id": "TOPUP-aBcXyZ123",
  "status": "paid",
  "amount": 51000,
  "signature": "abc123def456...",
  "timestamp": "2026-07-05T14:35:00Z"
}
```

---

**Langkah 16 — Server verifikasi webhook**

Server mengecek:
- Apakah signature valid? (SHA256 dari body + private key)
- Apakah order_id ada di database?

---

**Langkah 17 — Update database**

Server melakukan dua update ke database D1:
1. Update tabel `topups` — ubah status dari `pending` menjadi `paid`
2. Update tabel `users` — tambah saldo user Budi: `saldo = saldo + 50000`

Jadi saldo Budi berubah dari Rp 0 menjadi Rp 50.000.

---

**Langkah 18 — Balas webhook**

Server membalas Paywuz dengan `200 OK` supaya Paywuz tahu webhook sudah diterima.

---

**Langkah 19 — Pengguna lihat saldo bertambah**

Pengguna kembali ke halaman Dashboard (refresh atau buka ulang). Sekarang saldo yang tampil adalah **Rp 50.000**.

**Selesai — Top Up berhasil! 💰 Sekarang pengguna punya saldo untuk beli produk PPOB.**

---

## 📌 BAGIAN 5 — ALUR TRANSAKSI PPOB (Beli Pulsa)

Sekarang user sudah punya saldo Rp 50.000. Mari beli pulsa.

---

**Langkah 1 — Buka halaman Transaksi Baru**

Pengguna bisa sampai ke halaman transaksi dengan dua cara:
- Tap shortcut di dashboard (misal: 📱 Pulsa)
- Tap menu 🛒 "Transaksi Baru" di sidebar

Browser pindah ke `/dashboard/transactions`. Kalau dari shortcut Pulsa, URL-nya jadi `/dashboard/transactions?cat=pulsa` (kategori langsung terpilih).

---

**Langkah 2 — Halaman Transaksi tampil**

Halaman transaksi menampilkan:
- **Judul**: "Transaksi Baru"
- **Kategori**: baris horizontal berisi tombol kategori yang bisa di-scroll:
  - 📱 Pulsa (sedang aktif, warna biru)
  - 🌐 Paket Data
  - ⚡ Token Listrik
  - 💧 PDAM
  - 🏥 BPJS
  - 🎮 Game
  - 📺 TV
  - 💰 E-Wallet
- **Input nomor pelanggan**: kolom teks (labelnya berubah sesuai kategori, misal "Nomor HP" untuk pulsa)
- **Daftar produk**: grid 2-3 kolom berisi produk yang tersedia, masing-masing menampilkan:
  - Kode produk (misal: TSEL10)
  - Nama produk (misal: Telkomsel 10rb)
  - Harga (misal: Rp 10.500)

---

**Langkah 3 — Pengguna pilih kategori Pulsa**

Kategori Pulsa sudah aktif (karena dari shortcut). Kalau mau ganti, tap kategori lain. Begitu tap, URL berubah dan daftar produk berubah sesuai kategori.

---

**Langkah 4 — Masukkan nomor HP**

Pengguna mengetik nomor HP tujuan: `081234567890` di kolom input.

---

**Langkah 5 — Pilih produk**

Pengguna melihat daftar produk pulsa, misalnya:
- Telkomsel 5rb — Rp 5.500
- Telkomsel 10rb — Rp 10.500 ✅ (pilih ini)
- Telkomsel 20rb — Rp 20.500
- XL 5rb — Rp 5.500
- XL 10rb — Rp 10.500

Pengguna tap kartu **"Telkomsel 10rb — Rp 10.500"**.

---

**Langkah 6 — Fetch ke API Transaction**

Browser kirim `POST /api/ppob/transaction` dengan:
- Header: `Authorization: Bearer {JWT token}`
- Body:
```json
{
  "productCode": "TSEL10",
  "customerNo": "081234567890"
}
```

---

**Langkah 7 — Verifikasi token**

Server verifikasi JWT token dari header. Kalau valid, lanjut. Kalau tidak, balik 401.

---

**Langkah 8 — Validasi input**

Server cek dengan Zod:
- Apakah `productCode` tidak kosong?
- Apakah `customerNo` minimal 3 karakter?

---

**Langkah 9 — Generate Ref ID**

Server membuat ID unik untuk transaksi ini: `PPOB-aBcXyZ123` (pakai nanoid).

---

**Langkah 10 — Panggil API Digiflazz**

Server memanggil API Digiflazz untuk melakukan transaksi:
```
POST https://api.digiflazz.com/v1/transaction
Content-Type: application/json

{
  "username": "member@email.com",
  "sign": "md5_hash_dari_username+key+ref_id",
  "buyer_sku_code": "TSEL10",
  "customer_no": "081234567890",
  "ref_id": "PPOB-aBcXyZ123"
}
```

Parameter `sign` dibuat dari: `MD5(username + api_key + ref_id)` — ini cara Digiflazz memverifikasi keaslian request.

---

**Langkah 11 — Digiflazz memproses transaksi**

Digiflazz menerima request, memverifikasi sign, mengecek ketersediaan produk, lalu memproses pengiriman pulsa ke nomor 081234567890.

---

**Langkah 12 — Digiflazz merespon**

Digiflazz mengirim response:
```json
{
  "data": {
    "rc": "00",
    "message": "Transaksi Sukses",
    "status": 1,
    "buyer_sku_code": "TSEL10",
    "customer_no": "081234567890",
    "serial_number": "1234567890",
    "buyer_last_saldo": 500000
  }
}
```

Kode `rc: "00"` berarti sukses. `serial_number` adalah SN (Serial Number) bukti pengiriman pulsa.

---

**Langkah 13 — Kurangi saldo user**

Server mengurangi saldo user Budi: `saldo = 50000 - 10500 = 39500`.

---

**Langkah 14 — Simpan transaksi ke database**

Server menyimpan data transaksi ke tabel `transactions`:
```
id: "PPOB-aBcXyZ123"
user_id: "user-aBcXyZ123"
customer_no: "081234567890"
product_code: "TSEL10"
product_name: "Telkomsel 10rb"
kategori: "pulsa"
harga: 10500
status: "success"
sn: "1234567890"
message: "Transaksi Sukses"
created_at: "2026-07-05 14:45:00"
```

---

**Langkah 15 — Response ke browser**

Server mengirim balik:
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

**Langkah 16 — Notifikasi di layar**

Browser menampilkan kartu hijau:
```
✅ Transaksi Berhasil!
Telkomsel 10rb
Nomor: 081234567890
SN: 1234567890
```

Pengguna bisa cek HP tujuan, pulsa sudah masuk!

**Selesai — Beli pulsa berhasil! 📱🎉**

---

## 📌 BAGIAN 6 — ALUR WEBHOOK (Notifikasi Otomatis dari Pihak Ketiga)

Ini alur yang terjadi di belakang layar, tanpa perlu pengguna melakukan apa-apa.

---

### 🅰️ Webhook dari Paywuz (Notifikasi Pembayaran Top-Up)

---

**Langkah 1 — Pengguna transfer ke VA**

Pengguna sudah transfer uang ke nomor Virtual Account yang diberikan.

---

**Langkah 2 — Paywuz deteksi pembayaran masuk**

Sistem Paywuz mendeteksi ada transfer masuk sebesar Rp 51.000 ke VA `1234567890123` milik order `TOPUP-aBcXyZ123`.

---

**Langkah 3 — Paywuz kirim Webhook**

Paywuz mengirim request HTTP POST ke server kita:
```
POST https://topup-tepi.pages.dev/api/webhook/paywuz
Headers:
  X-Signature: sha256_hash
  Content-Type: application/json

Body:
{
  "order_id": "TOPUP-aBcXyZ123",
  "status": "paid",
  "amount": 51000,
  "timestamp": "2026-07-05T14:35:00Z"
}
```

---

**Langkah 4 — Server terima webhook**

Fungsi `POST /api/webhook/paywuz/route.ts` dijalankan.

---

**Langkah 5 — Verifikasi signature**

Server mengecek apakah webhook ini benar dari Paywuz:
- Ambil `PAYWUZ_PRIVATE_KEY` dari Environment Variables
- Buat hash SHA256 dari `body_json + private_key`
- Bandingkan dengan `X-Signature` yang dikirim Paywuz
- Kalau cocok, berarti asli. Kalau tidak, tolak.

---

**Langkah 6 — Cek status**

Server lihat field `status`:
- Kalau `"paid"` → pembayaran berhasil
- Kalau `"expired"` → pembayaran kadaluarsa
- Kalau `"cancelled"` → dibatalkan

---

**Langkah 7 — Update database top-ups**

Server jalankan SQL:
```sql
UPDATE topups SET status = 'paid'
WHERE id = 'TOPUP-aBcXyZ123';
```

---

**Langkah 8 — Tambah saldo user**

Server ambil `user_id` dari data top-up, lalu:
```sql
UPDATE users SET saldo = saldo + 50000
WHERE id = 'user-aBcXyZ123';
```

---

**Langkah 9 — Log ke console**

Server mencatat: `[PAYWUZ] Payment SUCCESS: TOPUP-aBcXyZ123, Amount: 50000`

---

**Langkah 10 — Balas Paywuz**

Server kirim `200 OK` dengan response `{ "status": true }`. Paywuz akan menganggap webhook berhasil.

---

### 🅱️ Webhook dari Digiflazz (Notifikasi Status Transaksi PPOB)

---

**Langkah 1 — Digiflazz proses transaksi**

Setelah server kita memanggil API Digiflazz untuk transaksi, Digiflazz memprosesnya. Kalau sudah selesai (sukses atau gagal), Digiflazz kirim webhook.

---

**Langkah 2 — Digiflazz kirim Webhook**

```
POST https://topup-tepi.pages.dev/api/webhook/digiflazz
Content-Type: application/json

Body:
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

---

**Langkah 3 — Server terima dan proses**

Fungsi `POST /api/webhook/digiflazz/route.ts` dijalankan.

Server cek:
- Kalau `status = "Sukses"` → update transaksi jadi success, simpan SN
- Kalau `status = "Gagal"` → update transaksi jadi failed, refund saldo user

---

**Langkah 4 — Update database**

```sql
UPDATE transactions
SET status = 'success', sn = '1234567890', message = 'Transaksi Sukses'
WHERE id = 'PPOB-aBcXyZ123';
```

---

**Langkah 5 — Balas Digiflazz**

Server balas `200 OK` dengan `{ "success": true }`.

---

## 📌 BAGIAN 7 — ALUR RIWAYAT & CEK TRANSAKSI

---

**Langkah 1 — Buka halaman Riwayat**

Pengguna tap menu 📋 "Riwayat" di sidebar. Browser pindah ke `/dashboard/history`.

---

**Langkah 2 — Data transaksi ditampilkan**

Halaman menampilkan daftar semua transaksi yang pernah dilakukan user, diurutkan dari yang terbaru. Setiap transaksi menunjukkan:
- Nama produk (misal: "Telkomsel 10rb")
- Nomor pelanggan
- Tanggal dan jam
- Status (label warna: 🟢 Sukses, 🟡 Pending, 🔴 Gagal)
- Jumlah (Rp 10.500)
- Ref ID (PPOB-aBcXyZ123)

---

**Langkah 3 — Filter transaksi**

User bisa tap filter di atas untuk menyaring:
- "Semua" — menampilkan semua
- "Sukses" — hanya yang berhasil
- "Pending" — yang masih diproses
- "Lunas" — top-up yang sudah dibayar
- "Gagal" — yang gagal

---

## 📌 BAGIAN 8 — ALUR ADMIN (Khusus Role Admin)

Pengguna dengan role `admin` punya akses ke halaman admin.

---

**Langkah 1 — Buka halaman Admin**

Admin bisa akses `/admin` langsung atau dari menu.

---

**Langkah 2 — Cek role**

Aplikasi mengecek `localStorage.getItem('user').role`. Kalau bukan `admin`, langsung redirect ke `/dashboard`.

---

**Langkah 3 — Dashboard Admin tampil**

Halaman admin menampilkan:
- **Stats**: Total User, Transaksi Hari Ini, Total Pendapatan, Saldo Digiflazz
- **Menu cepat**: Atur Produk, Lihat Transaksi, Setting
- **Tabel transaksi terbaru**: semua transaksi dari seluruh user

---

## 📌 BAGIAN 9 — ALUR GOOGLE APPS SCRIPT (Monitoring Otomatis)

Ini berjalan di latar belakang, menggunakan server Google.

---

**Langkah 1 — Cek kesehatan webhook (setiap jam)**

Apps Script memanggil endpoint webhook kita setiap jam untuk test. Kalau gagal, kirim email notifikasi ke admin.

---

**Langkah 2 — Kirim laporan harian (setiap jam 07:00)**

Apps Script ngitung jumlah transaksi kemarin, lalu kirim email:
```
Subjek: 📊 Laporan Harian TopUp Tepi - 2026-07-05
Isi:
  Total Transaksi: 45
  ✅ Sukses: 40
  ❌ Gagal: 3
  ⏳ Pending: 2
  Total Revenue: Rp 500.000
```

---

**Langkah 3 — Backup data (setiap minggu)**

Apps Script membuat salinan spreadsheet ke file baru sebagai backup.

---

## 📌 BAGIAN 10 — ALUR END-TO-END (Dari Awal sampai Akhir)

Ini ringkasan semua alur dalam satu rangkaian:

---

**🎬 Scene: Budi mau beli pulsa Telkomsel 10rb**

```
1️⃣  Budi buka website → Landing Page
2️⃣  Budi tap "Daftar" → isi form → tap "Daftar Gratis"
3️⃣  Redirect ke Login → Budi login (email + password)
4️⃣  Dapat JWT Token → masuk Dashboard
5️⃣  Budi lihat saldo Rp 0 → tap "Isi Saldo"
6️⃣  Pilih Rp 50.000 → metode BCA VA → tap "Top Up"
7️⃣  Dapat nomor VA: 1234567890123
8️⃣  Budi buka m-BCA → transfer Rp 51.000 ke VA
9️⃣  Paywuz deteksi pembayaran → kirim webhook
🔟  Server update: topup=paid, saldo=+50.000
1️⃣1️⃣ Budi kembali ke Dashboard → saldo Rp 50.000 ✅
1️⃣2️⃣ Budi tap "Pulsa" → masukkan no HP 081234567890
1️⃣3️⃣ Budi pilih "Telkomsel 10rb" Rp 10.500
1️⃣4️⃣ Server panggil Digiflazz → pulsa dikirim ✅
1️⃣5️⃣ Server kurangi saldo: 50.000 - 10.500 = 39.500
1️⃣6️⃣ Notifikasi "Transaksi Berhasil!" + SN
1️⃣7️⃣ Budi cek HP → pulsa masuk! 🎉
1️⃣8️⃣ Apps Script kirim laporan harian ke email admin
```

**Selesai! 🔄 Seluruh flow dari daftar sampai transaksi selesai.**

---

## 📌 BAGIAN 11 — ALUR DEPLOYMENT (Dari Kode ke Online)

Ini alur untuk kamu (developer) saat mau deploy aplikasi.

---

**Langkah 1 — Push ke GitHub**

Kamu commit dan push semua file project ke repository GitHub.

---

**Langkah 2 — GitHub Actions jalan**

File `.github/workflows/deploy.yml` terpicu. GitHub mulai menjalankan job:
- Checkout kode dari repository
- Setup Node.js versi 20
- Install dependencies: `npm ci`
- Build project: `npm run pages:build`
- Deploy ke Cloudflare Pages

---

**Langkah 3 — Cloudflare Pages menerima build**

Cloudflare menerima hasil build, lalu:
- File statis (HTML, CSS, JS) disimpan di edge network Cloudflare (tersebar di banyak server di seluruh dunia)
- Pages Functions (API Routes) siap dijalankan di edge

---

**Langkah 4 — Website online**

Aplikasi bisa diakses di:
- `https://topup-tepi.pages.dev` (domain default Cloudflare)
- `https://topup.tepi.my.id` (kalau sudah setup custom domain)

---

**Langkah 5 — User akses dari HP**

User buka URL di browser HP. DNS Cloudflare langsung mengarahkan ke server terdekat. Halaman landing page tampil dalam hitungan detik.

---

## 📌 PENUTUP

Itulah seluruh alur aplikasi **TopUp Tepi** secara lengkap dan detail.

**Ringkasan alur utama:**

| Aktivitas | Melibatkan | Proses |
|-----------|-----------|--------|
| Daftar | Browser → API → D1 | Validasi → Hash password → Simpan user |
| Login | Browser → API → D1 → JWT | Cek email & password → Buat token |
| Top Up | Browser → API → Paywuz → Webhook → D1 | Dapat VA → Transfer → Webhook → Saldo nambah |
| Beli Pulsa | Browser → API → Digiflazz → D1 | Panggil Digiflazz → Kurangi saldo → Simpan transaksi |
| Webhook | Paywuz/Digiflazz → API → D1 | Verifikasi signature → Update status |
| Monitoring | Apps Script → Email | Laporan harian, cek kesehatan, backup |
| Deploy | GitHub → Actions → Cloudflare | Build → Deploy → Online |

**Ada yang masih kurang jelas atau mau ditanyakan dari bagian tertentu?**
