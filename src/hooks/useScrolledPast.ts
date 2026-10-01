import { useEffect, useState } from 'react'

/**
 * Indica si la pagina ya fue scrolleada mas alla de un umbral.
 * Usa un listener pasivo con throttling por requestAnimationFrame,
 * no un listener de scroll por cada seccion.
 */
export function useScrolledPast(threshold = 24): boolean {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    let frame = 0

    const evaluate = () => {
      frame = 0
      setScrolled(window.scrollY > threshold)
    }

    const onScroll = () => {
      if (frame) return
      frame = window.requestAnimationFrame(evaluate)
    }

    evaluate()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [threshold])

  return scrolled
}