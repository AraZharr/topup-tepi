'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
export default function RegisterPage() {
  const router = useRouter()
  const [form, setForm] = useState({ email:'', nama:'', phone:'', password:'', confirmPassword:'' })
  const [loading, setLoading] = useState(false); const [error, setError] = useState('')
  function upd(k: string, v: string) { setForm(p=>({...p,[k]:v})) }
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); setLoading(true); setError('')
    if (form.password !== form.confirmPassword) { setError('Password tidak cocok'); setLoading(false); return }
    if (form.password.length < 6) { setError('Password minimal 6 karakter'); setLoading(false); return }
    try {
      const res = await fetch('/api/auth/register', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({email:form.email, nama:form.nama, phone:form.phone, password:form.password}) })
      const data = await res.json()
      if (data.success) router.push('/login?registered=true')
      else setError(data.message)
    } catch { setError('Gagal terhubung ke server') }
    finally { setLoading(false) }
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center"><span className="text-white font-bold text-lg">T</span></div>
            <span className="font-bold text-2xl text-gray-800">TopUp<span className="text-blue-600"</span><span class='text-blue-600'>Tepi</span></span>
          </Link>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Daftar Akun</h2>
          <p className="text-gray-500 mb-8">Buat akun baru Anda</p>
          {error && <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg p-4 mb-6 text-sm">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div><label className="block text-sm font-medium text-gray-700 mb-2">Nama Lengkap</label><input type="text" required value={form.nama} onChange={e=>upd('nama',e.target.value)} placeholder="Nama Anda" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"/></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-2">Email</label><input type="email" required value={form.email} onChange={e=>upd('email',e.target.value)} placeholder="nama@email.com" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"/></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-2">No. HP (opsional)</label><input type="tel" value={form.phone} onChange={e=>upd('phone',e.target.value)} placeholder="0812xxxxxxx" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"/></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-2">Password</label><input type="password" required value={form.password} onChange={e=>upd('password',e.target.value)} placeholder="Minimal 6 karakter" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"/></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-2">Konfirmasi Password</label><input type="password" required value={form.confirmPassword} onChange={e=>upd('confirmPassword',e.target.value)} placeholder="Ulangi password" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"/></div>
            <button type="submit" disabled={loading} className="w-full py-3 btn-gradient rounded-xl font-semibold disabled:opacity-60">{loading ? <span className="flex items-center justify-center gap-2"><span className="spinner !w-5 !h-5 !border-white !border-t-blue-300"></span>Mendaftar...</span> : 'Daftar Gratis'}</button>
          </form>
          <div className="mt-6 text-center"><p className="text-gray-500">Sudah punya akun? <Link href="/login" className="text-blue-600 font-semibold hover:underline">Masuk</Link></p></div>
        </div>
      </div>
    </div>
  )
}
