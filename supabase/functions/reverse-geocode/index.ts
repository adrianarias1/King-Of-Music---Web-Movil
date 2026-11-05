// =====================================================================
// KING OF MUSIC — reverse-geocode (Supabase Edge Function)
//
// Recibe coordenadas { lat, lng } de un usuario con sesión iniciada y
// devuelve su ubicación como texto "Estado, País" (p. ej. "Nayarit,
// México"). Usa OpenStreetMap: Nominatim y, si falla, Photon. Los errores
// de cada proveedor quedan en los logs de la función.
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

/** "Estado, País" o null si falta alguna parte (p. ej. coordenadas en el mar). */
function format(region: unknown, country: unknown): string | null {
  const r = clean(region)
  const c = clean(country)
  return r && c ? `${r}, ${c}` : null
}

async function getJson(url: URL): Promise<Record<string, unknown>> {
  const response = await fetch(url, {
    headers: { 'User-Agent': USER_AGENT, Accept: 'application/json' },
    signal: AbortSignal.timeout(6000),
  })
  if (!response.ok) {
    const body = (await response.text().catch(() => '')).slice(0, 160)
    throw new Error(`HTTP ${response.status} ${body}`)
  }
  return await response.json()
}

/** OpenStreetMap Nominatim (nombres en español). */
async function nominatim(lat: number, lng: number): Promise<string | null> {
  const url = new URL('https://nominatim.openstreetmap.org/reverse')
  url.searchParams.set('format', 'jsonv2')
  url.searchParams.set('lat', String(lat))
  url.searchParams.set('lon', String(lng))
  url.searchParams.set('zoom', '5') // nivel estado
  url.searchParams.set('addressdetails', '1')
  url.searchParams.set('accept-language', 'es')
  const data = await getJson(url)
  const address = (data.address ?? {}) as Record<string, unknown>
  return format(
    address.state ?? address.region ?? address.province ?? address.state_district ??
      address.county ?? address.city,
    address.country,
  )
}

/** Photon (komoot), también con datos de OpenStreetMap. Sin "lang" devuelve
 *  el nombre local (en México: español). */
async function photon(lat: number, lng: number): Promise<string | null> {
  const url = new URL('https://photon.komoot.io/reverse')
  url.searchParams.set('lat', String(lat))
  url.searchParams.set('lon', String(lng))
  url.searchParams.set('limit', '1')
  const data = await getJson(url)
  const feature = (data.features as Array<{ properties?: Record<string, unknown> }> | undefined)?.[0]
  const props = feature?.properties ?? {}
  return format(props.state ?? props.county ?? props.city, props.country)
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

  // Proveedores en orden: si uno falla o lo bloquean, se usa el siguiente.
  let location: string | null = null
  let resolved = false
  for (const provider of [nominatim, photon]) {
    try {
      location = await provider(lat, lng)
      resolved = true
      break
    } catch (error) {
      console.error(`[reverse-geocode] ${provider.name} falló:`, String(error))
    }
  }
  if (!resolved) return json({ error: 'geocoder_unavailable' }, 502)

  cache.set(key, { location, at: Date.now() })
  return json({ location })
})
