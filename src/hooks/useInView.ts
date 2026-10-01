import { useEffect, useRef, useState } from 'react'

interface Options {
  /** Margen extra en px alrededor del viewport antes de activar. */
  rootMargin?: string
  /** Fraccion visible necesaria para activar. */
  threshold?: number
  /** Si es false, el observer queda desconectado. */
  enabled?: boolean
  /** Valor inicial antes de la primera observacion. */
  initialValue?: boolean
}

const SUPPORTS_OBSERVER = typeof IntersectionObserver !== 'undefined'

/**
 * IntersectionObserver en un solo lugar.
 * Se usa para lazy loading, animaciones de entrada y para pausar el
 * render 3D fuera de pantalla.
 */
export function useInView<T extends Element = HTMLDivElement>({
  rootMargin = '200px',
  threshold = 0,
  enabled = true,
  initialValue = false,
}: Options = {}) {
  const ref = useRef<T | null>(null)
  const [inView, setInView] = useState(() => initialValue || !SUPPORTS_OBSERVER)

  useEffect(() => {
    const node = ref.current
    if (!enabled || !node || !SUPPORTS_OBSERVER) return undefined

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          setInView(entry.isIntersecting)
        }
      },
      { rootMargin, threshold },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [enabled, rootMargin, threshold])

  return { ref, inView }
}