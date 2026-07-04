'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter(); const pathname = usePathname()
  const [user, setUser] = useState<any>(null); const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('token'); const u = localStorage.getItem('user')
    if (!token || !u) { router.push('/login'); return }
    setUser(JSON.parse(u))
  }, [router])

  const navItems = [
    { path: '/dashboard', label: 'Beranda', icon: '🏠' },
    { path: '/dashboard/transactions', label: 'Transaksi Baru', icon: '🛒' },
    { path: '/dashboard/topup', label: 'Top Up Saldo', icon: '💰' },
    { path: '/dashboard/history', label: 'Riwayat', icon: '📋' },
    { path: '/dashboard/profile', label: 'Profil', icon: '👤' },
  ]

  function handleLogout() { localStorage.removeItem('token'); localStorage.removeItem('user'); router.push('/login') }
  if (!user) return null

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-30 w-64 bg-white border-r border-gray-200 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static`}>
        <div className="h-full flex flex-col">
          <div className="p-4 border-b"><Link href="/dashboard" className="flex items-center gap-2"><div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center"><span className="text-white font-bold text-sm">T</span></div><span className="font-bold text-lg">TopUp <span className="text-blue-600">Tepi</span></span></Link></div>
          <nav className="flex-1 p-4 space-y-1">
            {navItems.map(item => {
              const isActive = pathname === item.path || (item.path !== '/dashboard' && pathname.startsWith(item.path))
              return <Link key={item.path} href={item.path} onClick={()=>setSidebarOpen(false)} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive ? 'bg-blue-50 text-blue-600 font-semibold' : 'text-gray-600 hover:bg-gray-50'}`}><span>{item.icon}</span>{item.label}</Link>
            })}
          </nav>
          <div className="p-4 border-t">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">{(user.nama||user.email)[0].toUpperCase()}</div>
              <div className="flex-1 min-w-0"><p className="font-medium text-sm truncate">{user.nama||user.email}</p><p className="text-xs text-gray-500 capitalize">{user.role}</p></div>
            </div>
            <button onClick={handleLogout} className="w-full py-2 text-red-500 hover:bg-red-50 rounded-lg text-sm">Keluar</button>
          </div>
        </div>
      </aside>
      {sidebarOpen && <div onClick={()=>setSidebarOpen(false)} className="fixed inset-0 bg-black/30 z-20 lg:hidden" />}
      <div className="flex-1 flex flex-col min-h-screen">
        <header className="lg:hidden bg-white border-b px-4 py-3 flex items-center justify-between sticky top-0 z-10">
          <button onClick={()=>setSidebarOpen(true)} className="p-2 hover:bg-gray-100 rounded-lg"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/></svg></button>
          <span className="font-semibold">TopUp Tepi</span>
          <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">{(user.nama||user.email)[0].toUpperCase()}</div>
        </header>
        <main className="flex-1 p-4 md:p-8 max-w-5xl mx-auto w-full">{children}</main>
      </div>
    </div>
  )
}
