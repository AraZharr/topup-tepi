'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
export default function AdminPage() {
  const router = useRouter(); const [user, setUser] = useState<any>(null)
  useEffect(() => { const u = JSON.parse(localStorage.getItem('user')||'{}'); if (u.role!=='admin') router.push('/dashboard'); else setUser(u) }, [router])
  const stats = [
    {label:'Total User',value:'150',icon:'👥'},{label:'Transaksi Hari Ini',value:'45',icon:'📊'},
    {label:'Total Pendapatan',value:'Rp 5.2jt',icon:'💰'},{label:'Saldo Digiflazz',value:'Rp 2.1jt',icon:'🏦'},
  ]
  if (!user) return null
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between"><div><h1 className="text-2xl font-bold">Admin Dashboard</h1><p className="text-gray-500">Panel administrasi TopUp Tepi</p></div><div className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-medium">Admin</div></div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">{stats.map((s,i)=> <div key={i} className="bg-white rounded-2xl p-5 border"><div className="text-2xl mb-3">{s.icon}</div><p className="text-2xl font-bold">{s.value}</p><p className="text-xs text-gray-500 mt-1">{s.label}</p></div>)}</div>
      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-blue-50 rounded-2xl p-6 card-hover"><div className="text-2xl mb-3">⚙️</div><h3 className="font-semibold">Atur Produk</h3><p className="text-sm text-gray-500">Update harga & status produk</p></div>
        <div className="bg-green-50 rounded-2xl p-6 card-hover"><div className="text-2xl mb-3">📋</div><h3 className="font-semibold">Transaksi</h3><p className="text-sm text-gray-500">Lihat semua transaksi user</p></div>
        <div className="bg-purple-50 rounded-2xl p-6 card-hover"><div className="text-2xl mb-3">🔧</div><h3 className="font-semibold">Setting</h3><p className="text-sm text-gray-500">Konfigurasi API & webhook</p></div>
      </div>
      <div className="bg-white rounded-2xl border p-6"><h3 className="font-semibold mb-4">Transaksi Terbaru</h3><table className="w-full text-sm"><thead><tr className="text-left text-gray-400 border-b"><th className="pb-3 font-medium">Ref</th><th className="pb-3 font-medium">Produk</th><th className="pb-3 font-medium">Status</th><th className="pb-3 font-medium text-right">Total</th></tr></thead><tbody><tr className="border-b"><td className="py-3 text-xs text-gray-500">PPOB-abc</td><td className="py-3 font-medium">Telkomsel 10rb</td><td className="py-3"><span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs">Sukses</span></td><td className="py-3 text-right font-medium">Rp 10.500</td></tr><tr className="border-b"><td className="py-3 text-xs text-gray-500">PPOB-def</td><td className="py-3 font-medium">Token PLN 50rb</td><td className="py-3"><span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs">Sukses</span></td><td className="py-3 text-right font-medium">Rp 50.000</td></tr></tbody></table></div>
    </div>
  )
}
