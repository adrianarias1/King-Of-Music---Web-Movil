
import {
  animate,
  useMotionValue,
  useReducedMotion,
} from 'motion/react'

import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  X,
} from 'lucide-react'

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'

import type {
  KeyboardEvent,
  PointerEvent as ReactPointerEvent,
} from 'react'

import {
  storyIntro,
  storyboardPages,
} from '../../data/storyboard'

import { SmartImage } from '../ui/SmartImage'
import { StoryPageTurn } from './StoryPageTurn'
import { assetExists } from '../../utils/assets'
import { SectionHeading } from '../ui/SectionHeading'

import './Storyboard.css'

// =========================================================
// KING OF MUSIC — STORYBOARD CINEMATOGRÁFICO V4
//
// 1. Flechas flotantes dentro del visor 16:9.
// 2. Hoja con curvatura real (StoryPageTurn): la esquina se
//    levanta primero, el papel se dobla y se aplana al final.
// 3. Luz y sombra según el ángulo, sombra proyectada sobre
//    la página de abajo y sombra del lomo.
// 4. La hoja se puede arrastrar con el dedo o el mouse; al
//    soltar termina de pasar o regresa con un resorte.
// 5. Navegación con teclado, flechas y arrastre.
// 6. Bloqueo de navegación durante las transiciones.
// 7. Compatibilidad con movimiento reducido.
//
// CONTENIDO:
//
// Las imágenes y descripciones se administran en:
// src/data/storyboard.ts
// =========================================================

// Duración del giro automático (flechas y teclado), en segundos.
const FLIP_DURATION = 1.05

// Curva del giro automático: arranca despacio (se levanta la esquina),
// acelera a la mitad y se asienta suavemente.
const FLIP_EASE: [number, number, number, number] = [0.42, 0.02, 0.16, 1]

// Al soltar la hoja arrastrada, termina o regresa con un resorte.
const RELEASE_SPRING = { type: 'spring' as const, stiffness: 190, damping: 27, restDelta: 0.0008 }

// Arrastre: distancia mínima para empezar y umbrales para completar.
const DRAG_START_PX = 10
const COMMIT_PROGRESS = 0.38
const COMMIT_VELOCITY = 0.9

// Espera máxima a que la imagen destino esté decodificada antes de girar.
const DECODE_WAIT_MS = 600

/**
 * Descarga y DECODIFICA una imagen (una sola vez por URL). Así, al montarse
 * bajo la hoja, se pinta en el mismo cuadro y no se ve negra un instante.
 */
const decoded = new Map<string, Promise<void>>()
function decodeImage(src: string | undefined): Promise<void> {
  if (!src) return Promise.resolve()
  let pending = decoded.get(src)
  if (!pending) {
    const img = new Image()
    img.src = src
    pending = img.decode().catch(() => undefined)
    decoded.set(src, pending)
  }
  return pending
}

// 1 = avanzar, -1 = retroceder.
type Direction = -1 | 1

interface PageTurn {
  from: number
  to: number
  direction: Direction
  /** auto = flechas/teclado; drag = el usuario sostiene la hoja. */
  mode: 'auto' | 'drag'
}

export function Storyboard() {
  const reduced = useReducedMotion()

  // =====================================================
  // 1. ESTADOS
  // =====================================================

  const [currentPage, setCurrentPage] = useState(0)

  const [pageTurn, setPageTurn] =
    useState<PageTurn | null>(null)
  const [imageExpanded, setImageExpanded] = useState(false)

  // Avance del giro (0 → 1) compartido por la hoja y sus sombras.
  const progress = useMotionValue(0)

  const viewportRef = useRef<HTMLDivElement>(null)

  // Estado del arrastre con dedo o mouse.
  const drag = useRef<{
    pointerId: number
    x: number
    y: number
    active: boolean
    direction: Direction | null
  } | null>(null)

  useEffect(() => {
    if (!imageExpanded) return undefined
    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape') setImageExpanded(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [imageExpanded])

  // =====================================================
  // 2. DATOS Y PÁGINAS
  // =====================================================

  const total = storyboardPages.length

  const safePage = Math.min(
    currentPage,
    Math.max(0, total - 1),
  )

  const current = storyboardPages[safePage]

  const turning = pageTurn !== null

  // La página de destino se coloca bajo la hoja
  // antes de iniciar el giro.
  const visibleIndex = pageTurn
    ? pageTurn.to
    : safePage

  const visiblePage = storyboardPages[visibleIndex]

  const turningFrom = pageTurn
    ? storyboardPages[pageTurn.from]
    : undefined

  // Precarga la página anterior y la siguiente: al pasar la hoja la
  // imagen ya está en caché y no aparece el placeholder intermedio.
  useEffect(() => {
    for (const offset of [1, -1]) {
      const src = storyboardPages[safePage + offset]?.image
      if (!src) continue
      void assetExists(src)
      // Misma URL que usa SmartImage para aprovechar la caché.
      void decodeImage(src)
    }
    void decodeImage(storyboardPages[safePage]?.image)
  }, [safePage])

  // Evita iniciar otro giro mientras se espera la decodificación.
  const startingRef = useRef(false)

  // =====================================================
  // 3. NAVEGACIÓN
  // =====================================================

  const navigate = useCallback(
    (direction: Direction) => {
      // Impedir transiciones superpuestas.
      if (pageTurn || total <= 1) return

      const target = safePage + direction

      if (target < 0 || target >= total) return

      if (imageExpanded) {
        setCurrentPage(target)
        return
      }

      // Cambio directo para usuarios que prefieren
      // reducir las animaciones.
      if (reduced) {
        setCurrentPage(target)
        return
      }

      if (startingRef.current) return
      startingRef.current = true

      // El giro empieza cuando la imagen destino ya está decodificada
      // (normalmente ya lo está por la precarga; si no, se espera poco).
      const ready = decodeImage(storyboardPages[target]?.image)
      const timeout = new Promise<void>((resolve) => setTimeout(resolve, DECODE_WAIT_MS))
      void Promise.race([ready, timeout]).then(() => {
        startingRef.current = false
        // Reinicio antes de montar la hoja: así su primer cuadro ya es el
        // de la hoja plana sobre la página actual.
        progress.jump(0)
        setPageTurn({
          from: safePage,
          to: target,
          direction,
          mode: 'auto',
        })
      })
    },
    [pageTurn, total, safePage, reduced, imageExpanded, progress],
  )

  const goNext = useCallback(() => {
    navigate(1)
  }, [navigate])

  const goPrev = useCallback(() => {
    navigate(-1)
  }, [navigate])

  // =====================================================
  // 4. GIRO AUTOMÁTICO Y FINALIZACIÓN
  //
  // commit = true  → la hoja terminó de pasar.
  // commit = false → el usuario la soltó antes y regresó.
  // =====================================================

  // Giro en curso, legible desde callbacks de animación ya registrados.
  const turnRef = useRef<PageTurn | null>(null)
  useEffect(() => {
    turnRef.current = pageTurn
  }, [pageTurn])

  const finishTurn = useCallback(
    (commit: boolean) => {
      const turn = turnRef.current
      if (turn && commit) setCurrentPage(turn.to)
      turnRef.current = null
      // No se reinicia `progress` aquí: hacerlo antes de que React retire
      // la hoja la redibujaba entera (plana, con la imagen anterior) durante
      // un cuadro y se veía un destello. Se reinicia al empezar cada giro.
      setPageTurn(null)
    },
    [],
  )

  useEffect(() => {
    if (!pageTurn || pageTurn.mode !== 'auto') return undefined
    progress.jump(0)
    const controls = animate(progress, 1, { duration: FLIP_DURATION, ease: FLIP_EASE })
    void controls.then(() => finishTurn(true))
    return () => controls.stop()
  }, [pageTurn, progress, finishTurn])

  // =====================================================
  // 5. NAVEGACIÓN CON TECLADO
  // =====================================================

  const handleKeyDown = (
    event: KeyboardEvent<HTMLDivElement>,
  ) => {
    if (event.key === 'ArrowLeft') {
      event.preventDefault()
      goPrev()
    }

    if (event.key === 'ArrowRight') {
      event.preventDefault()
      goNext()
    }
  }

  // =====================================================
  // 6. ARRASTRAR LA HOJA (dedo o mouse)
  //
  // La hoja sigue al puntero. Al soltar, si se pasó lo
  // suficiente (o se soltó con impulso) termina de pasar;
  // si no, regresa a su lugar. El scroll vertical de la
  // página no se bloquea (touch-action: pan-y).
  // =====================================================

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (turning || imageExpanded) return
    if (event.pointerType === 'mouse' && event.button !== 0) return
    if ((event.target as HTMLElement).closest('button')) return
    drag.current = { pointerId: event.pointerId, x: event.clientX, y: event.clientY, active: false, direction: null }
  }

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const state = drag.current
    if (!state || state.pointerId !== event.pointerId) return
    const dx = event.clientX - state.x
    const dy = event.clientY - state.y

    if (!state.active) {
      if (Math.abs(dx) < DRAG_START_PX) return
      // Gesto vertical: es scroll, se abandona el arrastre.
      if (Math.abs(dx) < Math.abs(dy) * 1.3) {
        drag.current = null
        return
      }
      const direction: Direction = dx < 0 ? 1 : -1
      const target = safePage + direction
      if (target < 0 || target >= total) {
        drag.current = null
        return
      }
      state.active = true
      state.direction = direction
      event.currentTarget.setPointerCapture(event.pointerId)
      if (!reduced) {
        progress.jump(0)
        const turn: PageTurn = { from: safePage, to: target, direction, mode: 'drag' }
        turnRef.current = turn
        setPageTurn(turn)
      }
    }

    if (reduced || !state.direction) return
    const width = viewportRef.current?.clientWidth || 1
    // Avanzar = arrastrar a la izquierda; retroceder = a la derecha.
    const travel = state.direction === 1 ? -dx : dx
    progress.set(Math.min(1, Math.max(0, travel / (width * 0.85))))
  }

  const handlePointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    const state = drag.current
    drag.current = null
    if (!state || state.pointerId !== event.pointerId || !state.active || !state.direction) return
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }

    // Movimiento reducido: el gesto cambia de página sin animación.
    if (reduced) {
      navigate(state.direction)
      return
    }

    const current = progress.get()
    const velocity = progress.getVelocity()
    const commit =
      event.type !== 'pointercancel' &&
      (current > COMMIT_PROGRESS || velocity > COMMIT_VELOCITY) &&
      velocity > -COMMIT_VELOCITY

    const controls = animate(progress, commit ? 1 : 0, { ...RELEASE_SPRING, velocity })
    void controls.then(() => finishTurn(commit))
  }

  // =====================================================
  // 7. CONTROLES
  // =====================================================

  const canGoPrev = safePage > 0 && !turning

  const canGoNext =
    safePage < total - 1 && !turning

  // =====================================================
  // 9. INTERFAZ PRINCIPAL
  // =====================================================

  return (
    <section
      id="historia"
      className="section theme-light story"
      aria-label={storyIntro.title}
    >
      <div className="container">

        {/* ===============================================
            ENCABEZADO
            =============================================== */}

        <SectionHeading
          index="04"
          eyebrow="Narrativa"
          title={storyIntro.title}
          lead={storyIntro.lead}
        />

        {/* ===============================================
            SINOPSIS
            =============================================== */}

        <div className="story__synopsis">
          {storyIntro.synopsis.map((paragraph) => (
            <p key={paragraph.slice(0, 24)}>{paragraph}</p>
          ))}
        </div>

        {/* ===============================================
            VISOR DE PÁGINAS
            =============================================== */}

        {visiblePage ? (
          <div className="story__viewer">

            <div
              ref={viewportRef}
              className={`story__viewport${turning ? ' is-turning' : ''}`}
              onKeyDown={handleKeyDown}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
              onDragStart={(event) => event.preventDefault()}
              tabIndex={0}
              role="group"
              aria-label="Storyboard interactivo. Usa las flechas izquierda y derecha para cambiar de página."
            >
              <button
                type="button"
                className="story__expand"
                onClick={() => setImageExpanded(true)}
                aria-label="Ver imagen completa"
                title="Ver imagen completa"
              >
                <Maximize2 size={18} aria-hidden="true" />
              </button>

              {/* =========================================
                  LIBRO DIGITAL EN PERSPECTIVA
                  ========================================= */}

              <div className="story__book">

                {/* =======================================
                    PÁGINA BASE

                    Durante el giro se muestra la
                    página a la que vamos a llegar.
                    ======================================= */}

                <div
                  className="story__base-page"
                  key={visiblePage.id}
                >
                  <div className="story__page-image">
                    <SmartImage
                      src={visiblePage.image}
                      alt={
                        visiblePage.caption
                          ? `${visiblePage.caption} del storyboard`
                          : 'Viñeta del storyboard'
                      }
                      placeholderLabel="Viñeta"
                      index={String(
                        visibleIndex + 1,
                      ).padStart(2, '0')}
                      ratio="16 / 9"
                      fit="contain"
                      loading="eager"
                      decoding="sync"
                    />
                  </div>

                  <span
                    className="story__page-number label"
                    aria-hidden="true"
                  >
                    {String(
                      visibleIndex + 1,
                    ).padStart(2, '0')}
                  </span>
                </div>

                {/* =======================================
                    HOJA QUE GIRA (StoryPageTurn)

                    Avanzar: bisagra a la izquierda.
                    Retroceder: bisagra a la derecha.
                    ======================================= */}

                {pageTurn && turningFrom && (
                  <StoryPageTurn
                    key={[pageTurn.from, pageTurn.to, pageTurn.direction].join('-')}
                    image={turningFrom.image}
                    direction={pageTurn.direction}
                    progress={progress}
                  />
                )}
              </div>

              {/* =========================================
                  FLECHA IZQUIERDA

                  Se coloca encima del visor.
                  No gira junto con la hoja.
                  ========================================= */}

              <button
                type="button"
                className="story__nav story__nav--prev"
                onClick={goPrev}
                disabled={!canGoPrev}
                aria-label="Página anterior"
                title="Página anterior"
              >
                <ChevronLeft
                  size={24}
                  strokeWidth={1.6}
                  aria-hidden="true"
                />
              </button>

              {/* =========================================
                  FLECHA DERECHA
                  ========================================= */}

              <button
                type="button"
                className="story__nav story__nav--next"
                onClick={goNext}
                disabled={!canGoNext}
                aria-label="Página siguiente"
                title="Página siguiente"
              >
                <ChevronRight
                  size={24}
                  strokeWidth={1.6}
                  aria-hidden="true"
                />
              </button>

            </div>

            {imageExpanded && current ? (
              <div className="story__lightbox" role="dialog" aria-modal="true" aria-label={`${current.caption || 'Imagen'} — vista completa`}>
                <button className="story__lightbox-backdrop" onClick={() => setImageExpanded(false)} aria-label="Cerrar imagen completa" />
                <button type="button" className="story__lightbox-close" onClick={() => setImageExpanded(false)} aria-label="Cerrar">
                  <X size={22} aria-hidden="true" />
                </button>
                <button type="button" className="story__lightbox-nav story__lightbox-nav--prev" onClick={goPrev} disabled={!canGoPrev} aria-label="Página anterior">
                  <ChevronLeft size={28} aria-hidden="true" />
                </button>
                <figure className="story__lightbox-content">
                  <SmartImage src={current.image} alt={current.caption || 'Imagen narrativa'} fit="contain" />
                  <figcaption>{current.caption} · {safePage + 1} / {total}</figcaption>
                </figure>
                <button type="button" className="story__lightbox-nav story__lightbox-nav--next" onClick={goNext} disabled={!canGoNext} aria-label="Página siguiente">
                  <ChevronRight size={28} aria-hidden="true" />
                </button>
              </div>
            ) : null}

            {/* ===========================================
                INFORMACIÓN DE LA PÁGINA

                El contenido proviene del arreglo
                src/data/storyboard.ts.
                =========================================== */}

            <div
              className="story__details"
              aria-live="polite"
              aria-atomic="true"
            >
              <div className="story__details-heading">

                <span className="story__details-index label">
                  {current?.scene ? (
                    <>
                      ESCENA {String(current.scene).padStart(2, '0')}
                      {' · '}
                    </>
                  ) : null}
                  PÁGINA{' '}
                  {String(
                    safePage + 1,
                  ).padStart(2, '0')}
                </span>

                <h3 className="story__details-title">
                  {current?.caption || 'Sin título'}
                </h3>
              </div>

              {current?.text ? (
                <p className="story__text">
                  {current.text}
                </p>
              ) : (
                <p className="story__text story__text--pending">
                  Descripción pendiente de incorporar.
                </p>
              )}
            </div>

          </div>
        ) : (
          <p className="story__empty">
            Las páginas del storyboard estarán disponibles próximamente.
          </p>
        )}

        {/* ===============================================
            CONTADOR

            Se conserva debajo del visor, pero
            SIN los botones de navegación.

            Ya no será necesario bajar hasta aquí
            para cambiar de página.
            =============================================== */}

        <div className="story__controls">
          <p
            className="story__counter label"
            aria-live="polite"
          >
            <span className="story__counter-current">
              {String(
                total > 0 ? safePage + 1 : 0,
              ).padStart(2, '0')}
            </span>

            <span
              className="story__counter-separator"
              aria-hidden="true"
            >
              /
            </span>

            <span className="story__counter-total">
              {String(total).padStart(2, '0')}
            </span>
          </p>
        </div>

        {/* ===============================================
            INSTRUCCIÓN
            =============================================== */}

        <p className="story__hint label">
          Desliza o utiliza las flechas para pasar de página
        </p>

      </div>
    </section>
  )
}
