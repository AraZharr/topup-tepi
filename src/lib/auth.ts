import * as jose from 'jose'
const JWT_SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET || 'ppob-secret-key-kamu')
export interface JwtPayload { userId: string; email: string; role: 'user' | 'admin'; [key: string]: unknown }

export async function generateToken(payload: JwtPayload): Promise<string> {
  return await new jose.SignJWT({...payload})
    .setProtectedHeader({alg:'HS256'}).setIssuedAt().setExpirationTime('24h')
    .sign(JWT_SECRET_KEY)
}

export async function verifyToken(token: string): Promise<JwtPayload | null> {
  try { return (await jose.jwtVerify(token, JWT_SECRET_KEY)).payload as unknown as JwtPayload }
  catch { return null }
}

export function getTokenFromRequest(request: Request): string | null {
  const auth = request.headers.get('Authorization')
  if (!auth || !auth.startsWith('Bearer ')) return null
  return auth.slice(7)
}

export async function getUserFromRequest(request: Request): Promise<JwtPayload | null> {
  const token = getTokenFromRequest(request)
  if (!token) return null
  return verifyToken(token)
}
