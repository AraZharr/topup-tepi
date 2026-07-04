import type { Metadata } from 'next'
import './globals.css'
export const metadata: Metadata = {
  title: 'TopUp Tepi - Top Up, PPOB, title: 'TopUp Tepi - Top Up TopUp Tepi - Pembayaran Online Termurah PPOB Termurah' Pembayaran Termurah',
  description: 'Bayar Pulsa, Token Listrik, PDAM, BPJS, Game, dan lainnya.',
  manifest: '/manifest.json',
}
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <head><meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1"/></head>
      <body className="min-h-screen bg-gray-50">{children}</body>
    </html>
  )
}
