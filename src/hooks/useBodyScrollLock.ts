import { useEffect } from 'react'

/**
 * Bloquea el scroll del body mientras un menu o modal esta abierto.
 * Conserva el ancho de la barra de scroll para evitar saltos de layout.
 */
export function useBodyScrollLock(locked: boolean) {
  useEffect(() => {
    if (!locked) return

    const { body, documentElement } = document
    const scrollbarWidth = window.innerWidth - documentElement.clientWidth
    const previousPaddingRight = body.style.paddingRight
    const previousOverflow = body.style.overflow

    body.style.paddingRight = scrollbarWidth > 0 ? `${scrollbarWidth}px` : ''
    body.style.overflow = 'hidden'
    body.classList.add('is-locked')

    return () => {
      body.style.paddingRight = previousPaddingRight
      body.style.overflow = previousOverflow
      body.classList.remove('is-locked')
    }
  }, [locked])
}