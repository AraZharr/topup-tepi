'use client'
import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
const sampleProducts: Record<string, {code:string;name:string;price:number}[]> = {
  pulsa: [
    {code:'TSEL5',name:'Telkomsel 5rb',price:5500},{code:'TSEL10',name:'Telkomsel 10rb',price:10500},{code:'TSEL20',name:'Telkomsel 20rb',price:20500},
    {code:'XL5',name:'XL 5rb',price:5500},{code:'XL10',name:'XL 10rb',price:10500},{code:'ISAT5',name:'Indosat 5rb',price:5500},{code:'ISAT10',name:'Indosat 10rb',price:10500},
  ],
  data: [
    {code:'TSEL1GB',name:'Telkomsel 1GB',price:12000},{code:'TSEL5GB',name:'Telkomsel 5GB/30hr',price:35000},{code:'XL1GB',name:'XL 1GB',price:10000},{code:'XL5GB',name:'XL 5GB/30hr',price:30000},
  ],
  listrik: [
    {code:'PLN20',name:'Token PLN 20rb',price:20000},{code:'PLN50',name:'Token PLN 50rb',price:50000},{code:'PLN100',name:'Token PLN 100rb',price:100000},{code:'PLN200',name:'Token PLN 200rb',price:200000},
  ],
  game: [
    {code:'ML86',name:'MLBB 86 DM',price:18000},{code:'ML172',name:'MLBB 172 DM',price:35000},{code:'FF70',name:'FF 70 DM',price:10000},{code:'FF140',name:'FF 140 DM',price:19000},
  ],
}
export default function TransactionsPage() {
  const sp = useSearchParams(); const activeCat = sp.get('cat') || 'pulsa'
  const [customerNo, setCustomerNo] = useState(''); const [loading, setLoading] = useState(false); const [result, setResult] = useState<any>(null)
  const categories = [{id:'pulsa',label:'📱 Pulsa'},{id:'data',label:'🌐 Data'},{id:'listrik',label:'⚡ Listrik'},{id:'pdam',label:'💧 PDAM'},{id:'bpjs',label:'🏥 BPJS'},{id:'game',label:'🎮 Game'},{id:'tv',label:'📺 TV'},{id:'e-wallet',label:'💰 E-Wallet'}]
  const products = sampleProducts[activeCat] || []
  async function handleBuy(product: {code:string;name:string;price:number}) {
    if (!customerNo) { alert('Masukkan nomor pelanggan'); return }
    setLoading(true); setResult(null)
    try {
      const token = localStorage.getItem('token')
      const res = await fetch('/api/ppob/transaction', { method:'POST', headers:{'Content-Type':'application/json', Authorization:`Bearer ${token}`}, body: JSON.stringify({productCode:product.code, customerNo, amount:product.price}) })
      setResult(await res.json())
    } catch { setResult({success:false, message:'Gagal'}) }
    finally { setLoading(false) }
  }
  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold">Transaksi Baru</h1><p className="text-gray-500">Pilih produk dan lakukan pembelian</p></div>
      <div className="flex overflow-x-auto gap-2 pb-2">{categories.map(cat => <a key={cat.id} href={`/dashboard/transactions?cat=${cat.id}`} className={`px-4 py-2 rounded-xl whitespace-nowrap text-sm font-medium transition ${activeCat===cat.id ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 border'}`}>{cat.label}</a>)}</div>
      <div className="bg-white rounded-2xl p-5 border"><label className="block text-sm font-medium mb-2">{activeCat==='listrik'?'Nomor Meter':activeCat==='pulsa'||activeCat==='data'?'Nomor HP':activeCat==='game'?'ID Player':'Nomor Pelanggan'}</label><input type="text" value={customerNo} onChange={e=>setCustomerNo(e.target.value)} placeholder={activeCat==='listrik'?'No meter PLN':activeCat==='pulsa'?'08xx-xxxx-xxxx':'Masukkan nomor'} className="w-full px-4 py-3 rounded-xl border focus:border-blue-500 outline-none transition"/></div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">{products.map(p => <button key={p.code} onClick={()=>handleBuy(p)} disabled={loading} className="bg-white rounded-2xl p-4 border card-hover text-left disabled:opacity-50"><div className="text-xs text-gray-400 mb-1">{p.code}</div><div className="font-semibold text-sm mb-2">{p.name}</div><div className="text-blue-600 font-bold">Rp {p.price.toLocaleString('id-ID')}</div></button>)}</div>
      {loading && <div className="text-center py-8"><div className="spinner mx-auto mb-3"></div><p className="text-gray-500">Memproses...</p></div>}
      {result && <div className={`rounded-2xl p-6 ${result.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}><div className="flex items-center gap-3"><span className="text-2xl">{result.success?'✅':'❌'}</span><div><h3 className="font-semibold">{result.success?'Berhasil!':'Gagal'}</h3><p className="text-sm text-gray-500">{result.message}</p></div></div></div>}
    </div>
  )
}
