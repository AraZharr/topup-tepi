import { NextRequest, NextResponse } from 'next/server'
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    console.log('[DIGIFLAZZ]', JSON.stringify(body))
    const { event, data } = body
    if (event === 'payment' && data) {
      if (data.status === 'Sukses') console.log(`Transaksi SUCCESS: ${data.ref_id}, SN: ${data.serial_number}`)
      else if (data.status === 'Gagal') console.log(`Transaksi FAILED: ${data.ref_id}`)
    }
    return NextResponse.json({ success: true })
  } catch (e: any) { return NextResponse.json({ success: false, message: e.message }, { status: 500 }) }
}
