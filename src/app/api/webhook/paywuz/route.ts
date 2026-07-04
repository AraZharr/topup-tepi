import { NextRequest, NextResponse } from 'next/server'
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    console.log('[PAYWUZ]', JSON.stringify(body))
    const { order_id, status } = body
    if (status === 'paid') console.log(`Payment SUCCESS: ${order_id}`)
    else if (status === 'expired') console.log(`Payment EXPIRED: ${order_id}`)
    return NextResponse.json({ status: true })
  } catch (e: any) { return NextResponse.json({ status: false, message: e.message }, { status: 500 }) }
}
