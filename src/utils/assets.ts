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
  const base = import.meta.env.BASE_URL || '/'
  const normalized = path.startsWith('/') ? path.slice(1) : path
  return `${base}${normalized}`
}

/** Cachea las comprobaciones HEAD para no repetir peticiones. */
const availability = new Map<string, boolean>()

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
 * Las comprobaciones fallidas se cachean como `false` durante la sesion.
 */
export async function assetExists(path: string | undefined): Promise<boolean> {
  if (!path) return false

  const cached = availability.get(path)
  if (cached !== undefined) return cached

  try {
    const response = await fetch(assetUrl(path), {
      method: 'HEAD',
      cache: 'no-cache',
    })

    if (!response.ok) {
      availability.set(path, false)
      return false
    }

    // Fallback SPA: devolvieron HTML en lugar del asset solicitado.
    const contentType = response.headers.get('content-type') ?? ''
    const isHtml = contentType.includes('text/html')
    const exists = !isHtml

    availability.set(path, exists)
    return exists
  } catch {
    availability.set(path, false)
    return false
  }
}

/** Permite reiniciar el cache (util en desarrollo). */
export function resetAssetCache(): void {
  availability.clear()
}