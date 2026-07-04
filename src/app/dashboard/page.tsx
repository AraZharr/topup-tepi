'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  useEffect(() => { const u = localStorage.getItem('user'); if (u) setUser(JSON.parse(u)) }, [])
  const actions = [
    { icon: '📱', label: 'Pulsa', href: '/dashboard/transactions?cat=pulsa', color: 'bg-blue-50 text-blue-600' },
    { icon: '🌐', label: 'Paket Data', href: '/dashboard/transactions?cat=data', color: 'bg-green-50 text-green-600' },
    { icon: '⚡', label: 'Token Listrik', href: '/dashboard/transactions?cat=listrik', color: 'bg-yellow-50 text-yellow-600' },
    { icon: '💧', label: 'PDAM', href: '/dashboard/transactions?cat=pdam', color: 'bg-cyan-50 text-cyan-600' },
    { icon: '🏥', label: 'BPJS', href: '/dashboard/transactions?cat=bpjs', color: 'bg-red-50 text-red-600' },
    { icon: '🎮', label: 'Game', href: '/dashboard/transactions?cat=game', color: 'bg-purple-50 text-purple-600' },
    { icon: '📺', label: 'TV Kabel', href: '/dashboard/transactions?cat=tv', color: 'bg-orange-50 text-orange-600' },
    { icon: '💰', label: 'E-Wallet', href: '/dashboard/transactions?cat=e-wallet', color: 'bg-indigo-50 text-indigo-600' },
  ]
  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold text-gray-800">Halo, {user?.nama || user?.email?.split('@')[0] || 'Pengguna'}! 👋</h1><p className="text-gray-500">Selamat datang di dashboard TopUp Tepi</p></div>
      <div className="bg-gradient-to-r from-blue-600 to-purple-700 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between mb-4"><div><p className="text-blue-100 text-sm">Saldo Anda</p><p className="text-3xl font-bold mt-1">Rp 0</p></div><div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center">💰</div></div>
        <Link href="/dashboard/topup" className="inline-block px-6 py-2 bg-white text-blue-700 font-semibold rounded-xl text-sm hover:shadow-lg">Isi Saldo</Link>
      </div>
      <div><h2 className="text-lg font-semibold text-gray-800 mb-4">Transaksi Cepat</h2><div className="grid grid-cols-4 gap-3">{actions.map((a,i)=> <Link key={i} href={a.href} className={`${a.color} p-4 rounded-xl text-center card-hover`}><div className="text-2xl mb-1">{a.icon}</div><div className="text-xs font-medium">{a.label}</div></Link>)}</div></div>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl p-6 border"><h3 className="font-semibold mb-2">💡 Tips</h3><p className="text-sm text-gray-500">Isi saldo dulu sebelum transaksi. Minimal top-up Rp5.000.</p></div>
        <div className="bg-white rounded-2xl p-6 border"><h3 className="font-semibold mb-2">🛡️ Keamanan</h3><p className="text-sm text-gray-500">Jangan berikan password/OTP ke siapapun.</p></div>
      </div>
    </div>
  )
}
