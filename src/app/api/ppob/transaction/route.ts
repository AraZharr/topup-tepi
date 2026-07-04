import { NextRequest, NextResponse } from 'next/server'
import { getUserFromRequest } from '@/lib/auth'
import { z } from 'zod'
import { nanoid } from 'nanoid'
const schema = z.object({ productCode: z.string().min(1), customerNo: z.string().min(3) })
export async function POST(req: NextRequest) {
  try {
    const user = await getUserFromRequest(req)
    if (!user) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
    const body = await req.json(); const v = schema.safeParse(body)
    if (!v.success) return NextResponse.json({ success: false, message: v.error.errors[0].message }, { status: 400 })
    const refId = `PPOB-${nanoid(12)}`
    const { createHash } = require('crypto')
    const username = process.env.DIGIFLAZZ_USERNAME; const apiKey = process.env.DIGIFLAZZ_API_KEY
    const sign = createHash('md5').update(username + apiKey + refId).digest('hex')
    const res = await fetch('https://api.digiflazz.com/v1/transaction', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, sign, buyer_sku_code: v.data.productCode, customer_no: v.data.customerNo, ref_id: refId }),
    })
    const data = await res.json()
    return NextResponse.json({ success: true, message: 'Transaksi diproses', data: { refId, ...data.data } })
  } catch (e: any) { return NextResponse.json({ success: false, message: e.message }, { status: 500 }) }
}
