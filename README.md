# 🚀 TopUp Tepi - Full Stack Payment Point Online Banking

Aplikasi pembayaran online (PPOB) berbasis **Next.js** + **Cloudflare Pages** + **D1 Database**, terintegrasi dengan **Digiflazz** (produk PPOB) dan **Paywuz** (payment gateway).

## 📱 Untuk Pengguna Android (Tanpa Laptop/PC)

Semua setup bisa dilakukan dari **browser HP Android** tanpa Termux menggunakan:
1. **GitHub** — hosting kode
2. **Cloudflare Dashboard** — deploy & database
3. **Google Apps Script** — email alias & monitoring

## 🚀 Quick Setup (Langkah demi Langkah)

### 1. Upload ke GitHub
- Buka https://github.com/new → Buat repo `topup-tepi`
- Buka https://github.com/username/topup-tepi/upload → Upload semua file project
- Commit

### 2. Setup Cloudflare D1 Database
- Buka https://dash.cloudflare.com → Workers & Pages → D1
- Create database: `topup-tepi-database`
- Copy **Database ID** → paste ke `cloudflare/wrangler.toml` di bagian `database_id`
- Buka tab Query, paste isi `cloudflare/d1-schema.sql`, Execute

### 3. Setup Cloudflare Pages
- Workers & Pages → Pages → Create → Connect to Git
- Pilih repo `topup-tepi`
- Build settings: Framework=Next.js, Build command=`npm run pages:build`, Output dir=`.vercel/output/static`
- Save & Deploy

### 4. Setting Environment Variables
Di Cloudflare Pages → Settings → Environment variables → Add:
- `JWT_SECRET` = (string acak, misal: `rahasia-ppob-2024`)
- `DIGIFLAZZ_USERNAME` = username Digiflazz
- `DIGIFLAZZ_API_KEY` = API Key Digiflazz
- `PAYWUZ_API_KEY` = API Key Paywuz
- `PAYWUZ_PRIVATE_KEY` = Private Key Paywuz

### 5. D1 Binding
Di Settings → Functions → D1 database bindings:
- Variable name: `DB`
- Database: `topup-tepi-database`

### 6. Google Apps Script
- Buka https://script.google.com → New Project
- Paste isi `apps-script/code.gs` → Save sebagai "TopUp Tepi"
- Jalankan fungsi `init()` → Authorize
- Deploy → Web App → Execute as: Me → Access: Anyone

## 📁 Struktur Project
```
topup-tepi/
├── src/app/          # Pages & API Routes
├── src/lib/          # Library (Digiflazz, Paywuz, DB, Auth)
├── src/types/        # TypeScript types
├── cloudflare/       # D1 schema & wrangler config
├── apps-script/      # Google Apps Script
├── .github/          # GitHub Actions deploy
└── public/           # Static files
```

## 🧪 Testing
- **Login:** email: `admin@topup.tepi.my.id`, pass: `admin123` (sesuaikan)
- **Webhook:** `https://topup-tepi.pages.dev/api/webhook/paywuz`
- **Dashboard:** `https://topup-tepi.pages.dev/dashboard`

## 💰 Biaya
- **Cloudflare Pages:** Gratis (bandwidth unlimited)
- **Cloudflare D1:** Gratis (5GB)
- **Digiflazz:** Sesuai transaksi
- **Paywuz:** Fee transaksi
- **Domain:** Rp20-50rb/tahun (opsional)

Dibuat ❤️ untuk kemudahan bertransaksi di Indonesia.
