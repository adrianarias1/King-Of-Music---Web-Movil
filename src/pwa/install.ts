import { useEffect, useState, useSyncExternalStore } from 'react'

/* ==========================================================================
   KING OF MUSIC — Instalación de la PWA
   --------------------------------------------------------------------------
   Chrome, Edge y Android lanzan "beforeinstallprompt" cuando el sitio cumple
   los requisitos para instalarse (manifiesto + service worker + iconos).
   Se guarda ese evento para mostrar un botón propio "Instalar app".
   En iPhone (Safari) no existe ese evento: se muestran instrucciones.
   ========================================================================== */

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

let deferred: BeforeInstallPromptEvent | null = null
let installed = false
const listeners = new Set<() => void>()
const notify = () => listeners.forEach((listener) => listener())

/** Se llama al iniciar la app (main.tsx) para no perder el evento. */
export function listenForInstallPrompt(): void {
  window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault() // se mostrará con el botón propio
    deferred = event as BeforeInstallPromptEvent
    notify()
  })
  window.addEventListener('appinstalled', () => {
    deferred = null
    installed = true
    notify()
  })
}

const subscribe = (listener: () => void) => {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

function isStandalone(): boolean {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (navigator as Navigator & { standalone?: boolean }).standalone === true
  )
}

export type InstallState = 'available' | 'installed' | 'ios' | 'unsupported'

/** Estado de instalación y acción para instalar. */
export function usePwaInstall(): { state: InstallState; install: () => Promise<void> } {
  const snapshot = useSyncExternalStore(
    subscribe,
    () => (installed ? 'installed' : deferred ? 'available' : 'none'),
    () => 'none',
  )
  const [standalone, setStandalone] = useState(() => (typeof window === 'undefined' ? false : isStandalone()))

  useEffect(() => {
    const query = window.matchMedia('(display-mode: standalone)')
    const update = () => setStandalone(isStandalone())
    query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  }, [])

  const ios = typeof navigator !== 'undefined' && /iphone|ipad|ipod/i.test(navigator.userAgent)

  const state: InstallState =
    standalone || snapshot === 'installed'
      ? 'installed'
      : snapshot === 'available'
        ? 'available'
        : ios
          ? 'ios'
          : 'unsupported'

  const install = async () => {
    if (!deferred) return
    const prompt = deferred
    await prompt.prompt()
    const { outcome } = await prompt.userChoice
    deferred = null
    if (outcome === 'accepted') installed = true
    notify()
  }

  return { state, install }
}

/** true mientras el dispositivo tiene conexión. */
export function useOnline(): boolean {
  return useSyncExternalStore(
    (listener) => {
      window.addEventListener('online', listener)
      window.addEventListener('offline', listener)
      return () => {
        window.removeEventListener('online', listener)
        window.removeEventListener('offline', listener)
      }
    },
    () => navigator.onLine,
    () => true,
  )
}
