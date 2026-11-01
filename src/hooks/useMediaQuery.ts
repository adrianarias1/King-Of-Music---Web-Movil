import { useSyncExternalStore } from 'react'

/**
 * Indica si una media query CSS se cumple.
 * Reactivo: se actualiza al rotar el dispositivo o redimensionar la ventana.
 * Usar el mismo breakpoint que el CSS correspondiente para mantener coherencia.
 */
export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (onChange) => {
      if (typeof window === 'undefined' || !window.matchMedia) return () => {}
      const list = window.matchMedia(query)
      list.addEventListener('change', onChange)
      return () => list.removeEventListener('change', onChange)
    },
    () =>
      typeof window !== 'undefined' && window.matchMedia
        ? window.matchMedia(query).matches
        : false,
    () => false,
  )
}
