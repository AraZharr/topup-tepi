'use client'
import { useState } from 'react'
const sample = [
  {id:'PPOB-abc', date:'2026-07-05 14:30', product:'Telkomsel 10rb', customer:'081234567890', amount:10500, status:'success'},
  {id:'PPOB-def', date:'2026-07-05 13:15', product:'Token PLN 50rb', customer:'123456789012', amount:50000, status:'success'},
  {id:'PPOB-ghi', date:'2026-07-04 10:00', product:'PDAM', customer:'1122334455', amount:45000, status:'pending'},
  {id:'TOPUP-xyz', date:'2026-07-03 20:00', product:'Top Up BCA', customer:'-', amount:100000, status:'paid'},
]
export default function HistoryPage() {
  const [filter, setFilter] = useState('all')
  const filtered = filter==='all' ? sample : sample.filter(t=>t.status===filter)
  const colors: Record<string,string> = {success:'bg-green-100 text-green-700',paid:'bg-green-100 text-green-700',pending:'bg-yellow-100 text-yellow-700',failed:'bg-red-100 text-red-700'}
  const labels: Record<string,string> = {success:'Sukses',paid:'Lunas',pending:'Pending',failed:'Gagal'}
  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold">Riwayat Transaksi</h1><p className="text-gray-500">Semua transaksi Anda</p></div>
      <div className="flex gap-2 overflow-x-auto">{['all','success','pending','paid','failed'].map(f => <button key={f} onClick={()=>setFilter(f)} className={`px-4 py-2 rounded-xl text-sm font-medium transition ${filter===f?'bg-blue-600 text-white':'bg-white text-gray-600 border'}`}>{f==='all'?'Semua':labels[f]||f}</button>)}</div>
      {filtered.length===0 ? <div className="text-center py-16 text-gray-400"><div className="text-4xl mb-4">📭</div><p>Belum ada transaksi</p></div> : <div className="space-y-3">{filtered.map(t => <div key={t.id} className="bg-white rounded-2xl p-4 border"><div className="flex items-start justify-between mb-2"><div><p className="font-semibold text-sm">{t.product}</p><p className="text-xs text-gray-400">{t.customer} • {t.date}</p></div><span className={`px-2.5 py-1 rounded-full text-xs font-medium ${colors[t.status]||'bg-gray-100'}`}>{labels[t.status]||t.status}</span></div><div className="flex justify-between"><span className="text-xs text-gray-400">{t.id}</span><span className="font-bold">Rp {t.amount.toLocaleString('id-ID')}</span></div></div>)}</div>}
    </div>
  )
}
