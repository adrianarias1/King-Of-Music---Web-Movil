import { assetUrl } from '../utils/assets'
import { MODELS_CACHE } from '../modelsVersion'
import { isNativeApp } from './native'

/* ==========================================================================
   KING OF MUSIC — Caché sin conexión de los modelos 3D (PWA)
   --------------------------------------------------------------------------
   Al abrir la página, en segundo plano, se descargan los .glb de todos los
   personajes a la Cache Storage "kom-models-<versión>". El service worker
   (src/sw.js, "caché primero" con el mismo nombre) los sirve desde ahí:
     - cambiar de personaje ya no vuelve a descargar nada;
     - la carga es más rápida;
     - sin internet los modelos siguen cargando.

   Se guarda directo en Cache Storage (no a través del service worker) para
   que funcione también en la primera visita, antes de que el SW controle la
   página.

   No se precarga:
     - con "ahorro de datos" activado o en conexiones 2G (cada modelo se guarda
       igualmente la primera vez que se ve, por la regla del SW);
     - en la app Android: ahí los modelos ya vienen dentro del APK;
     - en desarrollo (sin service worker).
   ========================================================================== */

const CACHE_PREFIX = 'kom-models-'

interface NetworkInformationLike {
  saveData?: boolean
  effectiveType?: string
}

function shouldSkipPrefetch(): boolean {
  const connection = (navigator as Navigator & { connection?: NetworkInformationLike }).connection
  if (connection?.saveData) return true
  return /(^|-)2g$/.test(connection?.effectiveType ?? '')
}

/** Ejecuta cuando el navegador esté libre, sin competir con la carga inicial. */
function whenIdle(task: () => void): void {
  const start = () => {
    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(task, { timeout: 5000 })
    } else {
      setTimeout(task, 1500)
    }
  }
  if (document.readyState === 'complete') start()
  else window.addEventListener('load', start, { once: true })
}

/** Borra cachés de versiones anteriores y modelos que ya no están en la lista. */
async function cleanup(cache: Cache, wanted: Set<string>): Promise<void> {
  const names = await caches.keys()
  await Promise.all(
    names
      .filter((name) => name.startsWith(CACHE_PREFIX) && name !== MODELS_CACHE)
      .map((name) => caches.delete(name)),
  )
  const requests = await cache.keys()
  await Promise.all(
    requests.filter((request) => !wanted.has(request.url)).map((request) => cache.delete(request)),
  )
}

/**
 * Precarga los modelos indicados (rutas "/models/characters/x.glb").
 * Descarga de uno en uno para no saturar la conexión.
 */
export function prefetchCharacterModels(paths: readonly string[]): void {
  if (!import.meta.env.PROD || isNativeApp) return
  if (typeof window === 'undefined' || !('caches' in window) || !('serviceWorker' in navigator)) return

  whenIdle(() => {
    void (async () => {
      try {
        const urls = [...new Set(paths)].map((path) => new URL(assetUrl(path), window.location.href).href)
        const cache = await caches.open(MODELS_CACHE)
        await cleanup(cache, new Set(urls))

        if (shouldSkipPrefetch()) return

        for (const url of urls) {
          if (!navigator.onLine) return
          if (await cache.match(url)) continue
          const response = await fetch(url, { cache: 'no-cache' })
          // Solo respuestas reales del modelo (no un fallback HTML de la SPA).
          const type = response.headers.get('content-type') ?? ''
          if (response.ok && !type.includes('text/html')) {
            await cache.put(url, response)
          }
        }
      } catch (error) {
        // Sin espacio, sin red o caché no disponible: el visor sigue
        // funcionando descargando bajo demanda.
        console.warn('[KingOfMusic] No se pudieron precargar los modelos 3D:', error)
      }
    })()
  })
}
