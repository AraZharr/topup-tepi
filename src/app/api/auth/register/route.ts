import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
const schema = z.object({ email: z.string().email(), nama: z.string().min(2), phone: z.string().optional(), password: z.string().min(6) })
export async function POST(req: NextRequest) {
  try {
    const body = await req.json(); const v = schema.safeParse(body)
    if (!v.success) return NextResponse.json({ success: false, message: v.error.errors[0].message }, { status: 400 })
    return NextResponse.json({ success: true, message: 'Registrasi berhasil!', data: { email: v.data.email, nama: v.data.nama } })
  } catch (e: any) { return NextResponse.json({ success: false, message: e.message }, { status: 500 }) }
}
