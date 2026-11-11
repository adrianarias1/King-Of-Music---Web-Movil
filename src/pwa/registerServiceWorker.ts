import { isNativeApp } from '../lib/native'

/* ==========================================================================
   KING OF MUSIC — Registro del service worker (PWA)
   --------------------------------------------------------------------------
   Registra ./sw.js (código en src/sw.js) con alcance en la carpeta del sitio.
   Se puede comprobar en el navegador:
     DevTools → Application → Service Workers  ("activated and is running")
     DevTools → Application → Cache Storage     (kom-shell-…, kom-models-…)

   No se registra:
     - en desarrollo (npm run dev): se prueba con npm run build + preview;
     - dentro de la app Android (Capacitor): ahí los archivos ya van en el APK.
   ========================================================================== */

export function registerServiceWorker(): void {
  if (!import.meta.env.PROD || isNativeApp || !('serviceWorker' in navigator)) return

  // Si ya había una versión controlando la página, al activarse una nueva se
  // recarga una vez para usar los archivos actualizados.
  const hadController = Boolean(navigator.serviceWorker.controller)
  let reloading = false
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (!hadController || reloading) return
    reloading = true
    window.location.reload()
  })

  const register = () => {
    const base = import.meta.env.BASE_URL || './'
    navigator.serviceWorker
      .register(`${base}sw.js`, { scope: base })
      .then((registration) => {
        console.info('[KOM] Service worker registrado:', registration.scope)
        // Busca una versión nueva cada vez que se abre la página.
        void registration.update()
      })
      .catch((error: unknown) => {
        console.error('[KOM] No se pudo registrar el service worker:', error)
      })
  }

  // Después de la carga, para no competir con la primera pintura.
  if (document.readyState === 'complete') register()
  else window.addEventListener('load', register, { once: true })
}
