const BASE = 'https://api.digiflazz.com/v1'
import { createHash } from 'crypto'

export async function checkPrice(env: any, type = 'prepaid') {
  const { username, apiKey } = { username: env.DIGIFLAZZ_USERNAME, apiKey: env.DIGIFLAZZ_API_KEY }
  const sign = createHash('md5').update(username + apiKey).digest('hex')
  const res = await fetch(`${BASE}/price-list`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, sign, type }),
  })
  return res.json()
}

export async function topUp(env: any, params: { buyer_sku_code: string; customer_no: string; ref_id: string }) {
  const { username, apiKey } = { username: env.DIGIFLAZZ_USERNAME, apiKey: env.DIGIFLAZZ_API_KEY }
  const sign = createHash('md5').update(username + apiKey + params.ref_id).digest('hex')
  const res = await fetch(`${BASE}/transaction`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...params, username, sign }),
  })
  return res.json()
}

export async function checkBalance(env: any) {
  const { username, apiKey } = { username: env.DIGIFLAZZ_USERNAME, apiKey: env.DIGIFLAZZ_API_KEY }
  const sign = createHash('md5').update(username + apiKey + 'deposit').digest('hex')
  const res = await fetch(`${BASE}/cek-saldo`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, sign }),
  })
  return res.json()
}
