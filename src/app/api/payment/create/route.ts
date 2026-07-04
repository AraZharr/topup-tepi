import { NextRequest, NextResponse } from 'next/server'
import { getUserFromRequest } from '@/lib/auth'
import { z } from 'zod'
import { nanoid } from 'nanoid'
const schema = z.object({ amount: z.number().min(5000), paymentMethod: z.string().min(1), paymentChannel: z.string().min(1) })
export async function POST(req: NextRequest) {
  try {
    const user = await getUserFromRequest(req)
    if (!user) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
    const body = await req.json(); const v = schema.safeParse(body)
    if (!v.success) return NextResponse.json({ success: false, message: v.error.errors[0].message }, { status: 400 })
    const orderId = `TOPUP-${nanoid(12)}`
    const apiKey = process.env.PAYWUZ_API_KEY
    const channelMap: Record<string, string> = { bca: 'va_bca', mandiri: 'va_mandiri', bni: 'va_bni', briva: 'va_briva', qris: 'qris', ovo: 'ovo', gopay: 'gopay', dana: 'dana' }
    const paywuzRes = await fetch('https://paywuz.com/api/v1/transaction/create', {
      method: 'POST', headers: { 'Content-Type': 'application/json', 'X-API-Key': apiKey || '' },
      body: JSON.stringify({
        amount: v.data.amount, customer_name: user.email?.split('@')[0] || 'Customer', customer_email: user.email,
        order_id: orderId, payment_method: channelMap[v.data.paymentChannel] || v.data.paymentChannel,
        expired_minutes: 60, callback_url: `${req.nextUrl.origin}/api/webhook/paywuz`,
      }),
    })
    const result = await paywuzRes.json()
    return NextResponse.json({ success: true, message: 'Pembayaran dibuat', data: { orderId, ...result.data } })
  } catch (e: any) { return NextResponse.json({ success: false, message: e.message }, { status: 500 }) }
}
