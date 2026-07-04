'use client'
import { useState, useEffect } from 'react'
export default function ProfilePage() {
  const [user, setUser] = useState<any>({nama:'',email:'',phone:'',role:''})
  useEffect(() => { const u = localStorage.getItem('user'); if (u) setUser((p:any)=>({...p,...JSON.parse(u)})) }, [])
  return (
    <div className="space-y-6 max-w-lg mx-auto">
      <div><h1 className="text-2xl font-bold">Profil Saya</h1><p className="text-gray-500">Informasi akun Anda</p></div>
      <div className="text-center"><div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-3xl font-bold mx-auto mb-4">{(user.nama||user.email||'U')[0].toUpperCase()}</div><p className="font-semibold text-lg">{user.nama||'Pengguna'}</p><p className="text-gray-500 text-sm">{user.role==='admin'?'Administrator':'Pelanggan'}</p></div>
      <div className="bg-white rounded-2xl border divide-y"><div className="p-4 flex justify-between"><span className="text-gray-500">Email</span><span className="font-medium">{user.email}</span></div><div className="p-4 flex justify-between"><span className="text-gray-500">No. HP</span><span className="font-medium">{user.phone||'-'}</span></div><div className="p-4 flex justify-between"><span className="text-gray-500">Role</span><span className="font-medium capitalize">{user.role}</span></div></div>
      <div className="bg-white rounded-2xl p-6 border text-center text-sm text-gray-400"><p>TopUp Tepi v1.0.0</p><p>Next.js + Cloudflare D1</p><p>Digiflazz & Paywuz</p></div>
    </div>
  )
}
