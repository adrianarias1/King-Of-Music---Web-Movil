import { MODELS_VERSION } from '../modelsVersion'

/**
 * Resuelve rutas de assets de forma compatible con:
 *  - dev server de Vite (http://localhost:5173)
 *  - build servido desde la raiz del dominio
 *  - build servido como archivo local (file://) dentro de Capacitor Android
 *
 * Los data files guardan rutas con formato "/models/x.glb".
 */
export function assetUrl(path: string): string {
  if (/^(https?:)?\/\//.test(path) || path.startsWith('data:')) return path
  if (path.startsWith('/models/characters/')) {
    // Los modelos viven en el propio sitio (public/models/characters) y
    // también se empaquetan dentro del APK. Opcionalmente pueden servirse
    // desde otro origen con VITE_MODELS_BASE_URL.
    const external = (import.meta.env.VITE_MODELS_BASE_URL || '').replace(/\/+$/, '')
    const local = `${import.meta.env.BASE_URL || '/'}${path.slice(1)}`
    return `${external ? `${external}${path}` : local}?v=${MODELS_VERSION}`
  }
  const base = import.meta.env.BASE_URL || '/'
  const normalized = path.startsWith('/') ? path.slice(1) : path
  return `${base}${normalized}`
}

/** Cachea las comprobaciones HEAD para no repetir peticiones. */
const availability = new Map<string, { exists: boolean; expiresAt: number }>()
const NEGATIVE_CACHE_TTL_MS = 5_000
const RETRY_DELAY_MS = 250

/**
 * Comprueba si un asset existe antes de cargarlo.
 * Evita errores 404 visibles en la consola y permite decidir entre
 * el recurso real y el placeholder.
 *
 * Nota: algunos servidores con fallback SPA responden 200 + text/html a
 * cualquier ruta. Por eso se descarta la respuesta si el Content-Type no es
 * el esperado para un asset binario/de imagen; de lo contrario se intentaria
 * cargar HTML como si fuera un GLB.
 *
 * Las respuestas positivas se cachean durante la sesion. Los 404 y los
 * fallbacks HTML se cachean brevemente; los errores de red no se cachean.
 */
/**
 * true si ya se confirmó que el asset existe (sin esperar).
 * Permite mostrar de inmediato una imagen ya comprobada, sin pasar por el
 * placeholder.
 */
export function assetKnownToExist(path: string | undefined): boolean {
  if (!path) return false
  const cached = availability.get(path)
  return Boolean(cached && cached.exists && cached.expiresAt > Date.now())
}

export async function assetExists(path: string | undefined): Promise<boolean> {
  if (!path) return false
  // Archivos externos (p. ej. Cloudflare R2): una petición HEAD entre
  // dominios puede bloquearse por CORS aunque el archivo exista. Se dan por
  // disponibles; si fallan, <img> y <video> lo notifican con onError.
  if (/^(https?:)?\/\//.test(path)) return true

  const cached = availability.get(path)
  if (cached && cached.expiresAt > Date.now()) return cached.exists

  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      const response = await fetch(assetUrl(path), {
        method: 'HEAD',
        cache: 'no-cache',
      })

      if (!response.ok) {
        if (response.status === 404) {
          availability.set(path, {
            exists: false,
            expiresAt: Date.now() + NEGATIVE_CACHE_TTL_MS,
          })
          return false
        }

        if (attempt === 0) {
          await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS))
          continue
        }

        return false
      }

      // Fallback SPA: devolvieron HTML en lugar del asset solicitado.
      const contentType = response.headers.get('content-type') ?? ''
      const isHtml = contentType.includes('text/html')
      if (isHtml) {
        availability.set(path, {
          exists: false,
          expiresAt: Date.now() + NEGATIVE_CACHE_TTL_MS,
        })
        return false
      }

      availability.set(path, { exists: true, expiresAt: Number.POSITIVE_INFINITY })
      return true
    } catch {
      if (attempt === 0) {
        await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS))
      }
    }
  }

  // Los fallos transitorios de red no se cachean: la siguiente comprobacion
  // puede recuperar el asset sin necesitar una recarga completa.
  return false
}

/** Permite reiniciar el cache (util en desarrollo). */
export function resetAssetCache(): void {
  availability.clear()
}
