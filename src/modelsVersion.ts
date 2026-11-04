/**
 * Versión de los modelos 3D. Cambiarla cuando se reemplace algún .glb:
 * la URL cambia (?v=…) y la caché sin conexión descarta la copia anterior.
 *
 * Lo usan la página (src/utils/assets.ts, src/lib/modelCache.ts) y el
 * service worker (vite.config.ts), por eso vive en un archivo sin
 * dependencias.
 */
export const MODELS_VERSION = '2026-11-04'

/** Cache Storage de los modelos (debe coincidir en página y service worker). */
export const MODELS_CACHE = `kom-models-${MODELS_VERSION}`
