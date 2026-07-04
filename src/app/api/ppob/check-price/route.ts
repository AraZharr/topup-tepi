import { NextRequest, NextResponse } from 'next/server'
export async function GET(req: NextRequest) {
  try {
    const type = new URL(req.url).searchParams.get('type') || 'prepaid'
    const { createHash } = require('crypto')
    const username = process.env.DIGIFLAZZ_USERNAME; const apiKey = process.env.DIGIFLAZZ_API_KEY
    if (!username || !apiKey) return NextResponse.json({ success: false, message: 'Digiflazz not configured' }, { status: 500 })
    const sign = createHash('md5').update(username + apiKey).digest('hex')
    const res = await fetch('https://api.digiflazz.com/v1/price-list', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, sign, type }),
    })
    return NextResponse.json({ success: true, data: (await res.json()).data })
  } catch (e: any) { return NextResponse.json({ success: false, message: e.message }, { status: 500 }) }
}
