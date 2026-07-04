'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState(''); const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false); const [error, setError] = useState('')
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); setLoading(true); setError('')
    try {
      const res = await fetch('/api/auth/login', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({email,password}) })
      const data = await res.json()
      if (data.success) { localStorage.setItem('token', data.data.token); localStorage.setItem('user', JSON.stringify(data.data.user)); router.push('/dashboard') }
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
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Masuk</h2>
          <p className="text-gray-500 mb-8">Masuk ke akun Anda</p>
          {error && <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg p-4 mb-6 text-sm">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div><label className="block text-sm font-medium text-gray-700 mb-2">Email</label><input type="email" required value={email} onChange={e=>setEmail(e.target.value)} placeholder="nama@email.com" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"/></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-2">Password</label><input type="password" required value={password} onChange={e=>setPassword(e.target.value)} placeholder="Masukkan password" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"/></div>
            <button type="submit" disabled={loading} className="w-full py-3 btn-gradient rounded-xl font-semibold disabled:opacity-60">{loading ? <span className="flex items-center justify-center gap-2"><span className="spinner !w-5 !h-5 !border-white !border-t-blue-300"></span>Memproses...</span> : 'Masuk'}</button>
          </form>
          <div className="mt-6 text-center"><p className="text-gray-500">Belum punya akun? <Link href="/register" className="text-blue-600 font-semibold hover:underline">Daftar</Link></p></div>
        </div>
      </div>
    </div>
  )
}
