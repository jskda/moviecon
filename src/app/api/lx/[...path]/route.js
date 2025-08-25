import { NextResponse } from 'next/server'

const API_BASE = process.env.NEXT_PUBLIC_API_URL
const API_TOKEN = process.env.NEXT_PUBLIC_API_TOKEN

export async function GET(req, { params }) {
  try {
    if (!API_BASE || !API_TOKEN) {
      return NextResponse.json({ error: 'API env not configured' }, { status: 500 })
    }

   const path = (params?.path ?? []).join('/')
const incomingUrl = new URL(req.url)

const target = new URL(`${API_BASE}/${path}`)
for (const [k, v] of incomingUrl.searchParams.entries()) {
  target.searchParams.set(k, v)
}
target.searchParams.set('api_token', API_TOKEN)

    const upstream = await fetch(target.toString(), {
      method: 'GET',
      headers: { Accept: 'application/json', 'User-Agent': 'MovieCon/1.0' },
      cache: 'no-store',
    })

    if (!upstream.ok) {
      const text = await upstream.text().catch(() => '')
      return NextResponse.json(
        { error: `Upstream ${upstream.status}`, body: safeJson(text) },
        { status: upstream.status }
      )
    }

    const data = await upstream.json().catch(async () => safeJson(await upstream.text()))
    return NextResponse.json(data)
  } catch (e) {
    console.error('Proxy error:', e)
    return NextResponse.json({ error: 'Proxy failure' }, { status: 500 })
  }
}

function safeJson(text) {
  try { return JSON.parse(text) } catch { return text }
}