'use client'
import { useState } from 'react'
export default function TopUpPage() {
  const [amount, setAmount] = useState(0); const [channel, setChannel] = useState('')
  const [loading, setLoading] = useState(false); const [result, setResult] = useState<any>(null)
  const quick = [10000,20000,50000,100000,200000,500000]
  const methods = [
    { cat:'Virtual Account', channels:[{id:'bca',name:'BCA'},{id:'mandiri',name:'Mandiri'},{id:'bni',name:'BNI'},{id:'briva',name:'BRI'}] },
    { cat:'E-Wallet', channels:[{id:'qris',name:'QRIS'},{id:'gopay',name:'GoPay'},{id:'ovo',name:'OVO'},{id:'dana',name:'DANA'}] },
  ]
  async function handleTopUp() {
    if (amount<5000){alert('Min Rp5.000');return}
    if(!channel){alert('Pilih metode');return}
    setLoading(true)
    try {
      const res = await fetch('/api/payment/create', { method:'POST', headers:{'Content-Type':'application/json', Authorization:`Bearer ${localStorage.getItem('token')}`}, body: JSON.stringify({amount, paymentMethod:['bca','mandiri','bni','briva'].includes(channel)?'va':'ewallet', paymentChannel:channel}) })
      setResult(await res.json())
    } catch { setResult({success:false, message:'Gagal'}) }
    finally { setLoading(false) }
  }
  return (
    <div className="space-y-6 max-w-lg mx-auto">
      <div><h1 className="text-2xl font-bold">Top Up Saldo</h1><p className="text-gray-500">Isi saldo untuk bertransaksi</p></div>
      <div className="bg-white rounded-2xl p-6 border">
        <label className="block text-sm font-medium mb-3">Jumlah Top Up</label>
        <div className="relative mb-4"><span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-semibold">Rp</span><input type="number" value={amount||''} onChange={e=>setAmount(Number(e.target.value))} placeholder="0" className="w-full pl-12 pr-4 py-4 text-2xl font-bold rounded-xl border focus:border-blue-500 outline-none transition"/></div>
        <div className="grid grid-cols-3 gap-2">{quick.map(q => <button key={q} onClick={()=>setAmount(q)} className={`py-2 rounded-xl text-sm font-medium transition ${amount===q?'bg-blue-600 text-white':'bg-gray-50 text-gray-600'}`}>Rp {q.toLocaleString('id-ID')}</button>)}</div>
        {amount>=5000 && <div className="mt-4 pt-4 border-t space-y-2 text-sm"><div className="flex justify-between text-gray-500"><span>Jumlah</span><span>Rp {amount.toLocaleString('id-ID')}</span></div><div className="flex justify-between text-gray-500"><span>Biaya (2%)</span><span>Rp {Math.round(amount*0.02).toLocaleString('id-ID')}</span></div><div className="flex justify-between font-bold"><span>Total</span><span>Rp {Math.round(amount*1.02).toLocaleString('id-ID')}</span></div></div>}
      </div>
      <div className="bg-white rounded-2xl p-6 border">{methods.map(g => <div key={g.cat} className="mb-4"><p className="text-xs font-medium text-gray-400 uppercase mb-2">{g.cat}</p><div className="grid grid-cols-4 gap-2">{g.channels.map(ch => <button key={ch.id} onClick={()=>setChannel(ch.id)} className={`py-3 rounded-xl text-center transition ${channel===ch.id?'bg-blue-600 text-white':'bg-gray-50 text-gray-600 border'}`}><div className="text-xs font-medium">{ch.name}</div></button>)}</div></div>)}
      <button onClick={handleTopUp} disabled={loading||amount<5000} className="w-full py-4 btn-gradient rounded-xl font-semibold disabled:opacity-60">{loading?'Memproses...':`Top Up Rp ${amount.toLocaleString('id-ID')}`}</button>
      {result && <div className={`rounded-2xl p-6 ${result.success?'bg-green-50 border-green-200':'bg-red-50 border-red-200'}`}><span className="text-2xl">{result.success?'✅':'❌'}</span><p>{result.message}</p>{result.data?.va_number && <div className="bg-white rounded-xl p-4 mt-3"><p className="text-xs text-gray-500">VA:</p><p className="text-xl font-bold tracking-wider">{result.data.va_number}</p></div>}</div>}
    </div>
  )
}
