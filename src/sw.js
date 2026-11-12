/* ==========================================================================
   KING OF MUSIC — Service worker (sw.js)
   --------------------------------------------------------------------------
   Lo registra src/pwa/registerServiceWorker.ts como "./sw.js".
   Al compilar (npm run build), vite-plugin-pwa reemplaza self.__WB_MANIFEST
   por la lista de archivos del sitio (página principal, JS, CSS, imágenes,
   iconos, manifiesto y página sin conexión) con su versión, y lo copia a
   dist/sw.js.

   Ciclo de vida:
     1. install  → guarda en caché la página principal y los recursos
                   esenciales (precarga).
     2. activate → BORRA las cachés de versiones anteriores y toma el control.
     3. fetch    → responde desde la caché y, si no hay conexión, muestra la
                   versión guardada o la página offline.html.

   Estrategias por tipo de petición:
     - HEAD (comprobar si una imagen existe): red; sin red, copia guardada.
     - Navegación (abrir la página): red primero; sin red → index.html
       guardado (con el aviso "Sin conexión"); si se abre /offline.html, o
       index.html no está guardado → offline.html.
     - Las páginas se guardan sin la redirección de Cloudflare
       (/index.html → /, /offline.html → /offline).
     - Archivos precargados (JS, CSS, imágenes): caché primero.
     - Modelos 3D (.glb): caché primero (los precarga src/lib/modelCache.ts).
     - Otros archivos del mismo sitio: caché y actualización en segundo plano.
     - Otros dominios (Supabase, Cloudflare R2, Google): no se tocan.
   ========================================================================== */

import { MODELS_CACHE } from './modelsVersion'

/** Lista de archivos a precargar. La inyecta vite-plugin-pwa al compilar. */
const PRECACHE_MANIFEST = self.__WB_MANIFEST

/** Versión de la caché: cambia sola cuando cambia cualquier archivo. */
const VERSION = hash(PRECACHE_MANIFEST.map((entry) => `${entry.url}@${entry.revision ?? ''}`).join('|'))

const SHELL_CACHE = `kom-shell-${VERSION}`
const RUNTIME_CACHE = 'kom-runtime-v1'
const RUNTIME_MAX_ENTRIES = 80

const APP_SHELL = 'index.html'
const OFFLINE_PAGE = 'offline.html'
/** Si la red tarda más que esto al abrir la página, se usa la copia guardada. */
const NAVIGATION_TIMEOUT_MS = 4000

/** Cachés propias que se conservan; las demás de King of Music se borran. */
const CURRENT_CACHES = [SHELL_CACHE, RUNTIME_CACHE, MODELS_CACHE]

/* --------------------------------------------------------------------------
   1. INSTALACIÓN: precarga de la página principal y recursos esenciales
   -------------------------------------------------------------------------- */
self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(SHELL_CACHE)
      await Promise.all(
        PRECACHE_MANIFEST.map(async (entry) => {
          const url = toUrl(entry.url)
          // cache: 'reload' evita guardar una copia vieja de la caché HTTP.
          const response = await fetch(new Request(url, { cache: 'reload' }))
          if (!response.ok) throw new Error(`No se pudo precargar ${entry.url} (HTTP ${response.status})`)
          // Cloudflare redirige /index.html → / y /offline.html → /offline.
          // Una respuesta "redirigida" no se puede entregar a una navegación
          // (Chrome muestra "No se puede acceder a este sitio"), así que se
          // guarda una copia limpia con el mismo contenido.
          await cache.put(url, await withoutRedirect(response))
        }),
      )
      // La nueva versión se activa sin esperar a que se cierren las pestañas.
      await self.skipWaiting()
    })(),
  )
})

/* --------------------------------------------------------------------------
   2. ACTIVACIÓN: elimina versiones anteriores de la caché
   -------------------------------------------------------------------------- */
self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const names = await caches.keys()
      await Promise.all(
        names
          .filter((name) => isOwnCache(name) && !CURRENT_CACHES.includes(name))
          .map((name) => {
            console.info('[KOM sw] Borrando caché anterior:', name)
            return caches.delete(name)
          }),
      )
      // Controla de inmediato las pestañas abiertas.
      await self.clients.claim()
    })(),
  )
})

/** Cachés creadas por King of Music (versiones actuales y anteriores). */
function isOwnCache(name) {
  return (
    name.startsWith('kom-shell-') ||
    name.startsWith('kom-runtime-') ||
    name.startsWith('kom-models-') ||
    name === 'kom-artwork' ||
    // Versiones anteriores del sitio usaban la precarga de Workbox.
    name.startsWith('workbox-precache')
  )
}

/* --------------------------------------------------------------------------
   3. PETICIONES
   -------------------------------------------------------------------------- */
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)
  // Supabase, Cloudflare R2, Google, etc.: siempre por la red.
  if (url.origin !== self.location.origin) return

  // HEAD: la página comprueba si una imagen existe antes de mostrarla
  // (src/utils/assets.ts). Sin conexión se responde con la copia guardada.
  if (request.method === 'HEAD') {
    event.respondWith(headResponse(request))
    return
  }
  if (request.method !== 'GET') return

  if (request.mode === 'navigate') {
    event.respondWith(pageResponse(request))
    return
  }

  if (/\/models\/characters\/[^/?]+\.glb$/i.test(url.pathname)) {
    event.respondWith(cacheFirst(request, MODELS_CACHE))
    return
  }

  event.respondWith(assetResponse(request, event))
})

/** Página: red primero; sin conexión, la copia guardada o offline.html. */
async function pageResponse(request) {
  try {
    const response = await withTimeout(fetch(request), NAVIGATION_TIMEOUT_MS)
    // "opaqueredirect": el servidor redirige (p. ej. /offline.html → /offline);
    // se entrega tal cual para que el navegador siga la redirección.
    if (response.ok || response.type === 'opaqueredirect') return response
    throw new Error(`HTTP ${response.status}`)
  } catch {
    const cache = await caches.open(SHELL_CACHE)
    const path = new URL(request.url).pathname
    // Quien abre directamente la página sin conexión la ve; el resto de
    // rutas muestran la app guardada (con el aviso "Sin conexión").
    const wantsOfflinePage = /\/offline(\.html)?$/.test(path)
    const cached = wantsOfflinePage
      ? await cache.match(toUrl(OFFLINE_PAGE), { ignoreVary: true })
      : ((await cache.match(toUrl(APP_SHELL), { ignoreVary: true })) ??
        (await cache.match(toUrl(OFFLINE_PAGE), { ignoreVary: true })))
    if (cached) return withoutRedirect(cached)
    return new Response('<h1>Sin conexión</h1>', { status: 503, headers: { 'Content-Type': 'text/html; charset=utf-8' } })
  }
}

/** Recursos: precargados → caché; resto → caché y actualización en segundo plano. */
async function assetResponse(request, event) {
  // ignoreVary: algunos servidores responden "Vary: Origin" y los scripts de
  // tipo módulo envían Origin; sin esto la copia guardada no se encontraría.
  const precached = await caches.match(request, { cacheName: SHELL_CACHE, ignoreVary: true })
  if (precached) return precached

  const runtime = await caches.open(RUNTIME_CACHE)
  const cached = await runtime.match(request, { ignoreVary: true })
  const network = fetch(request)
    .then(async (response) => {
      if (response.ok && response.type === 'basic') {
        await runtime.put(request, response.clone())
        await trimCache(runtime, RUNTIME_MAX_ENTRIES)
      }
      return response
    })
    .catch(() => undefined)

  if (cached) {
    event.waitUntil(network)
    return cached
  }
  return (await network) ?? new Response('', { status: 504, statusText: 'Offline' })
}

/** HEAD: red primero; sin conexión, cabeceras de la copia guardada. */
async function headResponse(request) {
  try {
    return await fetch(request)
  } catch {
    const cached = await caches.match(request.url, { ignoreVary: true })
    if (cached) return new Response(null, { status: 200, headers: cached.headers })
    return new Response(null, { status: 504, statusText: 'Offline' })
  }
}

/** Caché primero: si está guardado se responde al instante; si no, red. */
async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName)
  const cached = await cache.match(request, { ignoreVary: true })
  if (cached) return cached
  const response = await fetch(request)
  if (response.ok) await cache.put(request, response.clone())
  return response
}

/* --------------------------------------------------------------------------
   Utilidades
   -------------------------------------------------------------------------- */

/** Copia de una respuesta sin la marca de "redirigida" (mismo contenido). */
async function withoutRedirect(response) {
  if (!response.redirected) return response
  return new Response(await response.blob(), {
    status: response.status,
    statusText: response.statusText,
    headers: response.headers,
  })
}

/** Ruta del manifiesto → URL absoluta dentro del alcance del service worker. */
function toUrl(path) {
  return new URL(path, self.registration.scope).href
}

/** Limita el número de entradas de una caché (borra las más antiguas). */
async function trimCache(cache, maxEntries) {
  const keys = await cache.keys()
  for (let i = 0; i < keys.length - maxEntries; i += 1) await cache.delete(keys[i])
}

function withTimeout(promise, ms) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('timeout')), ms)
    promise.then(
      (value) => {
        clearTimeout(timer)
        resolve(value)
      },
      (error) => {
        clearTimeout(timer)
        reject(error)
      },
    )
  })
}

/** Hash corto (djb2) para nombrar la versión de la caché. */
function hash(text) {
  let value = 5381
  for (let i = 0; i < text.length; i += 1) value = ((value << 5) + value + text.charCodeAt(i)) | 0
  return (value >>> 0).toString(36)
}
