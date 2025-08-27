/* eslint-disable no-console */
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const API_BASE = process.env.LUMEX_API_BASE
const API_TOKEN = process.env.LUMEX_API_TOKEN
const PAGE_SIZE = 100

if (!API_TOKEN) {
  console.error('❌ Нет LUMEX_API_TOKEN в .env')
  process.exit(1)
}

const endpoints = [
  { path: 'movies', type: 'MOVIE' },
  { path: 'tv-series', type: 'TV_SERIES' },
  { path: 'animes', type: 'ANIME' },
]

async function fetchPage(path, page) {
  const url = new URL(`${API_BASE}/${path}`)
  url.searchParams.set('api_token', API_TOKEN)
  url.searchParams.set('limit', PAGE_SIZE)
  url.searchParams.set('page', page)

  const res = await fetch(url)
  if (!res.ok) throw new Error(`Upstream ${res.status}`)

  const json = await res.json()
  return Array.isArray(json.data) ? json.data : json.results || []
}

function pickFields(item, type) {
  return {
    id: Number(item.id),
    type,
    title: item.title ?? null,
    ru_title: item.ru_title ?? null,
    description: item.description ?? null,
    year: item.year ? Number(item.year) : null,
    released: item.released ?? null,
    poster: item.poster ?? null,
    backdrop: item.backdrop ?? null,
    kinopoisk_id: item.kinopoisk_id ? Number(item.kinopoisk_id) : null,
    imdb_id: item.imdb_id ?? null,
    rating: item.rating != null ? Number(item.rating) : null,
    raw: JSON.stringify(item),
  }
}

async function syncEndpoint({ path, type }) {
  console.log(`=== ${path} (${type}) ===`)
  let page = 1
  let total = 0

  while (true) {
    const batch = await fetchPage(path, page)
    if (!batch.length) break

    for (const item of batch.map(it => pickFields(it, type))) {
      await prisma.content.upsert({
        where: { id: item.id },
        update: { ...item, createdAt: undefined, updatedAt: undefined },
        create: item,
      })
    }

    total += batch.length
    console.log(`страница ${page} → ${batch.length} записей`)
    page++
  }

  console.log(`✅ ${path}: ${total} записей`)
}

async function main() {
  for (const ep of endpoints) {
    await syncEndpoint(ep)
  }
}

main().then(() => {
  console.log('🎉 Синхронизация завершена')
  process.exit(0)
})