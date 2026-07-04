'use client'
import Link from 'next/link'
export default function HomePage() {
  const features = [
    { icon: '⚡', title: 'Proses Cepat', desc: 'Transaksi detik. 24 jam non-stop.' },
    { icon: '💰', title: 'Harga Termurah', desc: 'Update harga setiap hari.' },
    { icon: '🔒', title: 'Aman & Terpercaya', desc: 'Terintegrasi Digiflazz & Paywuz.' },
    { icon: '📊', title: 'Laporan Lengkap', desc: 'Riwayat transaksi real-time.' },
    { icon: '🎯', title: '100+ Produk', desc: 'Pulsa, token, PDAM, BPJS, game.' },
    { icon: '💬', title: 'Support 24/7', desc: 'CS siap membantu kapanpun.' },
  ]
  const products = [
    { icon: '📱', name: 'Pulsa', desc: 'All Operator' },
    { icon: '🌐', name: 'Paket Data', desc: 'Internet' },
    { icon: '⚡', name: 'Token Listrik', desc: 'PLN' },
    { icon: '💧', name: 'PDAM', desc: 'Air' },
    { icon: '🏥', name: 'BPJS', desc: 'Kesehatan' },
    { icon: '🎮', name: 'Game', desc: 'ML, FF, PUBG' },
    { icon: '📺', name: 'TV/Internet', desc: 'Indihome' },
    { icon: '💰', name: 'E-Wallet', desc: 'GoPay, OVO, DANA' },
  ]
  return (
    <div className="min-h-screen">
      {/* NAV */}
      <nav className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 flex justify-between items-center h-16">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center"><span className="text-white font-bold text-sm">T</span></div>
            <span className="font-bold text-xl text-gray-800">TopUp<span className="text-blue-600"</span><span class='text-blue-600'>Tepi</span></span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition">Masuk</Link>
            <Link href="/register" className="px-4 py-2 btn-gradient rounded-lg">Daftar</Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-purple-800 text-white">
        <div className="max-w-6xl mx-auto px-4 py-20 md:py-28 text-center md:text-left">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">Pembayaran Online <span className="text-yellow-300">Termurah & Termudah</span></h1>
              <p className="text-blue-100 text-lg mb-8">Bayar pulsa, token listrik, PDAM, BPJS, tagihan game, dan ribuan produk lainnya. Harga murah, proses cepat, 24 jam!</p>
              <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                <Link href="/register" className="px-8 py-4 bg-white text-blue-700 font-semibold rounded-xl hover:shadow-lg transition-all hover:-translate-y-1">Mulai Sekarang</Link>
              </div>
              <div className="grid grid-cols-3 gap-8 mt-12 pt-8 border-t border-white/20">
                <div><div className="text-3xl font-bold">50K+</div><div className="text-blue-200 text-sm">Transaksi</div></div>
                <div><div className="text-3xl font-bold">10K+</div><div className="text-blue-200 text-sm">Pelanggan</div></div>
                <div><div className="text-3xl font-bold">100+</div><div className="text-blue-200 text-sm">Produk</div></div>
              </div>
            </div>
            <div className="hidden md:grid grid-cols-3 gap-4">
              {products.slice(0,6).map((p, i) => (
                <div key={i} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center"><div className="text-4xl mb-2">{p.icon}</div><div className="text-white/80 text-sm">{p.name}</div></div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FITUR */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16"><h2 className="text-3xl font-bold">Kenapa Pilih <span className="text-blue-600">TopUp Tepi</span>?</h2></div>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((f, i) => (
              <div key={i} className="p-8 rounded-2xl border card-hover"><div className="text-4xl mb-4">{f.icon}</div><h3 className="text-xl font-semibold mb-3">{f.title}</h3><p className="text-gray-500">{f.desc}</p></div>
            ))}
          </div>
        </div>
      </section>

      {/* PRODUK */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16"><h2 className="text-3xl font-bold">Produk & Harga</h2><p className="text-gray-500">Lengkap untuk kebutuhan sehari-hari</p></div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {products.map((p, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl border card-hover text-center"><div className="text-3xl mb-2">{p.icon}</div><div className="font-semibold text-sm">{p.name}</div><div className="text-xs text-gray-400">{p.desc}</div></div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-700 py-20 text-center">
        <div className="max-w-4xl mx-auto px-4"><h2 className="text-3xl font-bold text-white mb-4">Siap Memulai?</h2><p className="text-blue-100 mb-8">Daftar sekarang dan nikmati kemudahan bertransaksi!</p><Link href="/register" className="inline-block px-10 py-4 bg-white text-blue-700 font-semibold rounded-xl hover:shadow-lg">Daftar Gratis</Link></div>
      </section>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-6xl mx-auto px-4 text-center"><p>© 2026 TopUp Tepi. All rights reserved.</p></div>
      </footer>
    </div>
  )
}
