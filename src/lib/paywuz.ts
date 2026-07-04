const BASE = 'https://paywuz.com/api/v1'

export async function createPayment(env: any, params: {
  amount: number; customer_name: string; customer_email: string; customer_phone?: string
  order_id: string; payment_method?: string; expired_minutes?: number
  callback_url?: string; redirect_url?: string
}) {
  const apiKey = env.PAYWUZ_API_KEY
  const res = await fetch(`${BASE}/transaction/create`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-API-Key': apiKey },
    body: JSON.stringify(params),
  })
  return res.json()
}

export async function checkStatus(env: any, orderId: string) {
  const apiKey = env.PAYWUZ_API_KEY
  const res = await fetch(`${BASE}/transaction/status`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-API-Key': apiKey },
    body: JSON.stringify({ order_id: orderId }),
  })
  return res.json()
}

export function verifyWebhookSignature(env: any, body: string, signature: string): boolean {
  const privateKey = env.PAYWUZ_PRIVATE_KEY
  if (!privateKey) return false
  const { createHash } = require('crypto')
  return createHash('sha256').update(body + privateKey).digest('hex') === signature
}
