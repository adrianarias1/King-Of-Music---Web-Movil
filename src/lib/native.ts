import { Capacitor } from '@capacitor/core'
import { Browser } from '@capacitor/browser'

/* ==========================================================================
   Utilidades para la app Android (Capacitor)
   ========================================================================== */

export const isNativeApp = Capacitor.isNativePlatform()

/**
 * Deep link al que Supabase regresa después de iniciar sesión con Google
 * dentro de la app. Debe coincidir con:
 *   - el intent-filter de android/app/src/main/AndroidManifest.xml
 *     (scheme = custom_url_scheme de strings.xml, host = login-callback)
 *   - Supabase → Authentication → URL Configuration → Redirect URLs
 */
export const NATIVE_AUTH_REDIRECT = 'com.kingofmusic.app://login-callback'

/**
 * Abre un enlace externo.
 * - Web: pestaña nueva.
 * - App: Custom Tab del navegador del sistema (el WebView de la app no debe
 *   navegar fuera del sitio).
 */
export async function openExternal(url: string): Promise<void> {
  if (isNativeApp) {
    await Browser.open({ url })
    return
  }
  window.open(url, '_blank', 'noopener,noreferrer')
}

/**
 * Solo en la app: cualquier enlace a otro sitio (o con target="_blank") se
 * abre en el navegador del sistema en lugar de sacar al WebView del juego.
 * Se instala una vez desde main.tsx.
 */
export function installExternalLinkHandler(): void {
  if (!isNativeApp) return
  document.addEventListener('click', (event) => {
    if (event.defaultPrevented || event.button !== 0) return
    const anchor = (event.target as Element | null)?.closest?.('a[href]')
    if (!(anchor instanceof HTMLAnchorElement)) return
    const url = new URL(anchor.href, window.location.href)
    const external = url.origin !== window.location.origin
    if (!/^https?:$/.test(url.protocol) || (!external && anchor.target !== '_blank')) return
    event.preventDefault()
    void openExternal(url.toString())
  })
}
