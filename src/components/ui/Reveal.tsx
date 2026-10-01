import type { ReactNode } from 'react'
import { motion, useReducedMotion } from 'motion/react'

type Direction = 'up' | 'down' | 'left' | 'right'

interface Props {
  children: ReactNode
  delay?: number
  /** Distancia maxima del recorrido en px. */
  distance?: number
  direction?: Direction
  /** Duracion en segundos (0.2 - 0.6). */
  duration?: number
  className?: string
  as?: 'div' | 'li' | 'article' | 'figure'
}

const OFFSET: Record<Direction, { x: number; y: number }> = {
  up: { x: 0, y: 1 },
  down: { x: 0, y: -1 },
  left: { x: 1, y: 0 },
  right: { x: -1, y: 0 },
}

/**
 * Entrada suave al hacer scroll.
 * - IntersectionObserver via `whileInView` (se desconecta tras la primera vez)
 * - Sin transform cuando prefers-reduced-motion esta activo
 */
export function Reveal({
  children,
  delay = 0,
  distance = 26,
  direction = 'up',
  duration = 0.45,
  className,
  as = 'div',
}: Props) {
  const reduced = useReducedMotion()
  const Component = motion[as]

  if (reduced) {
    const Static = as
    return <Static className={className}>{children}</Static>
  }

  const offset = OFFSET[direction]

  return (
    <Component
      className={className}
      initial={{ opacity: 0, x: offset.x * distance, y: offset.y * distance }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </Component>
  )
}