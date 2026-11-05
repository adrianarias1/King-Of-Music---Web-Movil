import { Geolocation } from '@capacitor/geolocation'
import { supabase } from './supabase'
import { isNativeApp } from './native'

/* ==========================================================================
   KING OF MUSIC — Ubicación aproximada del usuario ("Estado, País")
   --------------------------------------------------------------------------
   1. Pide permiso de ubicación:
        - Web: API de geolocalización del navegador.
        - App Android: @capacitor/geolocation (permiso de ubicación aproximada).
   2. Obtiene coordenadas de baja precisión (no hace falta GPS exacto).
   3. La Edge Function "reverse-geocode" de Supabase las convierte en texto
      "Estado, País" (OpenStreetMap). Las coordenadas no se guardan.

   Uso: resolveLocation() → { status: 'ok', location } o el motivo del fallo.
   ========================================================================== */

export type LocationResult =
  | { status: 'ok'; location: string }
  | { status: 'denied' | 'unavailable' | 'unsupported' | 'error' }

interface Coords {
  lat: number
  lng: number
}

const POSITION_OPTIONS = {
  enableHighAccuracy: false,
  timeout: 12000,
  // Una posición de hace 10 min sirve: solo se necesita el estado.
  maximumAge: 10 * 60 * 1000,
}

// La ubicación se resuelve una vez por sesión de la página.
let cached: Promise<LocationResult> | null = null

class LocationError extends Error {
  readonly reason: 'denied' | 'unavailable' | 'unsupported'

  constructor(reason: 'denied' | 'unavailable' | 'unsupported') {
    super(reason)
    this.reason = reason
  }
}

async function nativePosition(): Promise<Coords> {
  let permission = await Geolocation.checkPermissions()
  if (permission.coarseLocation !== 'granted' && permission.location !== 'granted') {
    permission = await Geolocation.requestPermissions({ permissions: ['coarseLocation'] })
  }
  if (permission.coarseLocation !== 'granted' && permission.location !== 'granted') {
    throw new LocationError('denied')
  }
  try {
    const position = await Geolocation.getCurrentPosition(POSITION_OPTIONS)
    return { lat: position.coords.latitude, lng: position.coords.longitude }
  } catch {
    // GPS/ubicación del sistema apagada o sin señal.
    throw new LocationError('unavailable')
  }
}

function webPosition(): Promise<Coords> {
  return new Promise((resolve, reject) => {
    if (!('geolocation' in navigator)) {
      reject(new LocationError('unsupported'))
      return
    }
    navigator.geolocation.getCurrentPosition(
      (position) => resolve({ lat: position.coords.latitude, lng: position.coords.longitude }),
      (error) =>
        reject(new LocationError(error.code === error.PERMISSION_DENIED ? 'denied' : 'unavailable')),
      POSITION_OPTIONS,
    )
  })
}

async function resolve(): Promise<LocationResult> {
  try {
    const coords = isNativeApp ? await nativePosition() : await webPosition()
    const { data, error } = await supabase.functions.invoke<{ location: string | null }>(
      'reverse-geocode',
      { body: coords },
    )
    if (error || !data?.location) return { status: 'error' }
    return { status: 'ok', location: data.location }
  } catch (error) {
    if (error instanceof LocationError) return { status: error.reason }
    return { status: 'error' }
  }
}

/** Obtiene "Estado, País". Reutiliza el resultado si ya se consiguió. */
export function resolveLocation(): Promise<LocationResult> {
  if (!cached) {
    cached = resolve().then((result) => {
      // Un fallo no se queda guardado: el usuario puede reintentar.
      if (result.status !== 'ok') cached = null
      return result
    })
  }
  return cached
}

/** "Nayarit, México" → "México" (lo que se muestra en la lista). */
export function countryOf(location: string | null | undefined): string | null {
  if (!location) return null
  const country = location.split(',').pop()?.trim()
  return country || null
}

/* --- Preferencia del usuario (recordada en este dispositivo) ------------- */

const PREF_KEY = 'kom-review-location'

export function getLocationPreference(): boolean {
  try {
    return localStorage.getItem(PREF_KEY) !== 'off'
  } catch {
    return true
  }
}

export function setLocationPreference(enabled: boolean): void {
  try {
    localStorage.setItem(PREF_KEY, enabled ? 'on' : 'off')
  } catch {
    // Almacenamiento no disponible: solo dura esta visita.
  }
}
