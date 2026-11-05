import { useLayoutEffect, useRef } from 'react'
import type { MotionValue } from 'motion/react'

// =========================================================
// KING OF MUSIC — HOJA DEL STORYBOARD (DOBLEZ DE PÁGINA)
//
// El visor muestra una sola página a todo lo ancho, así que la
// hoja no gira sobre una bisagra (saldría del marco): se DOBLA
// sobre sí misma, como al pasar la página en un lector digital.
//
//   - Una línea de doblez recorre la página desde el borde que
//     se levanta hasta el lado opuesto.
//   - La línea se inclina a mitad del recorrido: la esquina
//     inferior se levanta primero.
//   - De un lado queda la parte plana de la hoja; del otro, la
//     solapa doblada, que es el reflejo de la hoja respecto al
//     doblez: se ve el reverso del papel con la imagen apenas
//     transparentada.
//   - Sombras: curvatura junto al doblez, sombra que proyecta la
//     solapa y sombra sobre la página de abajo.
//
// Todo depende de `progress` (0 → 1) y se escribe directamente
// en los estilos en cada cuadro (sin renders de React).
// =========================================================

/** Inclinación máxima de la línea de doblez (grados). */
const TILT_DEGREES = 13

interface Props {
  /** Imagen de la página que se está pasando. */
  image?: string | undefined
  /** 1 = avanzar (se dobla desde la derecha), -1 = retroceder (desde la izquierda). */
  direction: 1 | -1
  progress: MotionValue<number>
}

const fmt = (n: number) => n.toFixed(2)

export function StoryPageTurn({ image, direction, progress }: Props) {
  const rootRef = useRef<HTMLDivElement>(null)
  const flatRef = useRef<HTMLDivElement>(null)
  const flapRef = useRef<HTMLDivElement>(null)
  const castRef = useRef<HTMLDivElement>(null)

  const fromRight = direction === 1

  useLayoutEffect(() => {
    const update = (raw: number) => {
      const root = rootRef.current
      const flat = flatRef.current
      const flap = flapRef.current
      if (!root || !flat || !flap) return

      const W = root.clientWidth || 1
      const H = root.clientHeight || 1
      const p = Math.min(1, Math.max(0, raw))
      const lift = Math.sin(Math.PI * p) // 0 → 1 → 0

      // Línea de doblez: centro en `fold`, inclinada según `lift`.
      const fold = fromRight ? W * (1 - p) : W * p
      const lean = Math.tan(TILT_DEGREES * lift * (Math.PI / 180)) * (H / 2)
      // La esquina inferior del lado que se levanta va por delante.
      const xTop = fromRight ? fold + lean : fold - lean
      const xBottom = fromRight ? fold - lean : fold + lean

      // Parte plana: del lado contrario al borde que se levanta.
      // Fuente de la solapa: del lado del borde que se levanta.
      const leftOfFold = `polygon(0px 0px, ${fmt(xTop)}px 0px, ${fmt(xBottom)}px ${fmt(H)}px, 0px ${fmt(H)}px)`
      const rightOfFold = `polygon(${fmt(xTop)}px 0px, ${fmt(W)}px 0px, ${fmt(W)}px ${fmt(H)}px, ${fmt(xBottom)}px ${fmt(H)}px)`
      flat.style.clipPath = fromRight ? leftOfFold : rightOfFold
      flap.style.clipPath = fromRight ? rightOfFold : leftOfFold

      // Reflejo respecto a la línea de doblez (de T=(xTop,0) a B=(xBottom,H)).
      const dx = xBottom - xTop
      const len = Math.hypot(dx, H)
      const ux = dx / len
      const uy = H / len
      const a = 2 * ux * ux - 1
      const b = 2 * ux * uy
      const d = 2 * uy * uy - 1
      // x' = a·x + b·y + e ; y' = b·x + d·y + f  (T queda fijo)
      const e = xTop - a * xTop
      const f = -b * xTop
      flap.style.transform = `matrix(${a}, ${b}, ${b}, ${d}, ${e}, ${f})`

      // Variables para los degradados de sombra y luz.
      root.style.setProperty('--fold', `${fmt(fold)}px`)
      root.style.setProperty('--fold-r', `${fmt(W - fold)}px`)
      root.style.setProperty('--lift', lift.toFixed(3))
      // La sombra sobre la página de abajo nace y termina en 0: al
      // retirar la hoja no queda ninguna franja oscura que desaparezca
      // de golpe (eso causaba el parpadeo al final).
      if (castRef.current) castRef.current.style.opacity = Math.min(1, 1.6 * lift).toFixed(3)
    }

    update(progress.get())
    const unsubscribe = progress.on('change', update)
    // Si cambia el tamaño (rotación del teléfono), se recalcula.
    const observer = new ResizeObserver(() => update(progress.get()))
    if (rootRef.current) observer.observe(rootRef.current)
    return () => {
      unsubscribe()
      observer.disconnect()
    }
  }, [progress, fromRight])

  const pageStyle = image ? { backgroundImage: `url("${image}")` } : undefined

  return (
    <div
      ref={rootRef}
      className={`turn turn--${fromRight ? 'next' : 'prev'}`}
      aria-hidden="true"
    >
      {/* Sombra sobre la página de abajo, junto al doblez */}
      <div ref={castRef} className="turn__cast" />

      {/* Parte plana de la hoja que aún no se dobla */}
      <div ref={flatRef} className="turn__flat" style={pageStyle}>
        <div className="turn__flat-shade" />
      </div>

      {/* Solapa doblada (reverso del papel) */}
      <div className="turn__flap-shadow">
        <div ref={flapRef} className="turn__flap" style={pageStyle}>
          <div className="turn__flap-paper" />
        </div>
      </div>
    </div>
  )
}
