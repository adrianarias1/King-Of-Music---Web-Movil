// =====================================================================
// KING OF MUSIC — reverse-geocode (Supabase Edge Function)
//
// Recibe coordenadas { lat, lng } de un usuario con sesión iniciada y
// devuelve su ubicación como texto "Estado, País" (p. ej. "Nayarit,
// México"), usando OpenStreetMap Nominatim.
//
// Privacidad: las coordenadas no se guardan en ningún lado; solo se usan
// para esta consulta. A la base de datos llega únicamente el texto.
// =====================================================================

import 'jsr:@supabase/functions-js/edge-runtime.d.ts'

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

// Nominatim exige identificar la aplicación (política de uso).
const USER_AGENT = 'KingOfMusic/1.0 (https://king-of-music.tic-310123.workers.dev)'

// Caché en memoria por zona (~1 km): evita repetir consultas.
const cache = new Map<string, { location: string | null; at: number }>()
const CACHE_MS = 24 * 60 * 60 * 1000

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS, 'Content-Type': 'application/json' },
  })
}

/** Limpia una parte: sin comas, sin espacios dobles, máximo 60 caracteres. */
function clean(value: unknown): string {
  return typeof value === 'string'
    ? value.replace(/,/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 60)
    : ''
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS })
  if (req.method !== 'POST') return json({ error: 'method_not_allowed' }, 405)

  let lat: number, lng: number
  try {
    const body = await req.json()
    lat = Number(body?.lat)
    lng = Number(body?.lng)
  } catch {
    return json({ error: 'invalid_body' }, 400)
  }
  if (!Number.isFinite(lat) || !Number.isFinite(lng) || Math.abs(lat) > 90 || Math.abs(lng) > 180) {
    return json({ error: 'invalid_coordinates' }, 400)
  }

  const key = `${lat.toFixed(2)},${lng.toFixed(2)}`
  const hit = cache.get(key)
  if (hit && Date.now() - hit.at < CACHE_MS) return json({ location: hit.location })

  const url = new URL('https://nominatim.openstreetmap.org/reverse')
  url.searchParams.set('format', 'jsonv2')
  url.searchParams.set('lat', String(lat))
  url.searchParams.set('lon', String(lng))
  url.searchParams.set('zoom', '5') // nivel estado
  url.searchParams.set('addressdetails', '1')
  url.searchParams.set('accept-language', 'es')

  let response: Response
  try {
    response = await fetch(url, {
      headers: { 'User-Agent': USER_AGENT, Accept: 'application/json' },
      signal: AbortSignal.timeout(8000),
    })
  } catch {
    return json({ error: 'geocoder_unavailable' }, 502)
  }
  if (!response.ok) return json({ error: 'geocoder_unavailable' }, 502)

  const data = await response.json().catch(() => null)
  const address = data?.address ?? {}
  const country = clean(address.country)
  const region = clean(
    address.state ?? address.region ?? address.province ?? address.state_district ??
      address.county ?? address.city,
  )

  // Formato "Estado, País". Sin alguna de las dos partes (p. ej.
  // coordenadas en el mar) no se devuelve ubicación.
  const location = country && region ? `${region}, ${country}` : null
  cache.set(key, { location, at: Date.now() })
  return json({ location })
})
