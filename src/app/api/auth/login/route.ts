import { NextRequest, NextResponse } from 'next/server'
import { generateToken } from '@/lib/auth'
import { z } from 'zod'
const schema = z.object({ email: z.string().email(), password: z.string().min(1) })
export async function POST(req: NextRequest) {
  try {
    const body = await req.json(); const v = schema.safeParse(body)
    if (!v.success) return NextResponse.json({ success: false, message: v.error.errors[0].message }, { status: 400 })
    const token = await generateToken({ userId: 'user-' + Date.now(), email: v.data.email, role: v.data.email.includes('admin') ? 'admin' : 'user' })
    return NextResponse.json({ success: true, message: 'Login berhasil', data: { token, user: { email: v.data.email, role: v.data.email.includes('admin') ? 'admin' : 'user' } } })
  } catch (e: any) { return NextResponse.json({ success: false, message: e.message }, { status: 500 }) }
}
