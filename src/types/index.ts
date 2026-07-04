export type ProdukKategori = 'pulsa' | 'data' | 'listrik' | 'pdam' | 'bpjs' | 'telepon' | 'tv' | 'e-wallet' | 'game' | 'pajak' | 'multifinance'
export type StatusTransaksi = 'pending' | 'processing' | 'success' | 'failed' | 'refund'

export interface ProdukPPOB {
  kode: string; nama: string; kategori: ProdukKategori
  hargaDasar: number; hargaJual: number; markup: number; status: boolean
  deskripsi?: string; icon?: string
}

export interface Transaksi {
  id: string; userId: string; customerNo: string; productCode: string
  productName: string; kategori: ProdukKategori; harga: number
  status: StatusTransaksi; sn?: string; message?: string
  digiflazzTrxId?: string; paymentMethod?: string; paymentStatus?: string
  createdAt: string; updatedAt: string
}

export interface User {
  id: string; email: string; nama: string; phone?: string
  password?: string; role: 'user' | 'admin'; saldo: number; createdAt: string
}

export interface TopUp {
  id: string; userId: string; amount: number; fee: number; total: number
  paymentMethod: string; paymentChannel: string
  status: 'pending' | 'paid' | 'expired' | 'cancelled'
  vaNumber?: string; qrUrl?: string; paywuzTrxId?: string
  expiredAt: string; createdAt: string
}

export interface ApiResponse<T = any> {
  success: boolean; message: string; data?: T
}
