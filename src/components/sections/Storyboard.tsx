
import {
  motion,
  useReducedMotion,
} from 'motion/react'

import {
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'

import {
  useCallback,
  useRef,
  useState,
} from 'react'

import type {
  KeyboardEvent,
  TouchEvent,
} from 'react'

import {
  storyIntro,
  storyboardPages,
} from '../../data/storyboard'

import { SmartImage } from '../ui/SmartImage'
import { SectionHeading } from '../ui/SectionHeading'

import './Storyboard.css'

// =========================================================
// KING OF MUSIC — STORYBOARD CINEMATOGRÁFICO V3
//
// NOVEDADES:
//
// 1. Flechas flotantes dentro del visor 16:9.
// 2. Giro tridimensional en ambas direcciones.
// 3. Desvanecimiento progresivo al terminar el giro.
// 4. La nueva página permanece visible bajo la hoja.
// 5. Navegación con teclado, botones y swipe.
// 6. Bloqueo de navegación durante las transiciones.
// 7. Compatibilidad con movimiento reducido.
//
// CONTENIDO:
//
// Las imágenes y descripciones se administran en:
// src/data/storyboard.ts
// =========================================================

// Duración total de la transición en segundos.
const FLIP_DURATION = 0.95

// 1 = avanzar, -1 = retroceder.
type Direction = -1 | 1

interface PageTurn {
  from: number
  to: number
  direction: Direction
}

export function Storyboard() {
  const reduced = useReducedMotion()

  // =====================================================
  // 1. ESTADOS
  // =====================================================

  const [currentPage, setCurrentPage] = useState(0)

  const [pageTurn, setPageTurn] =
    useState<PageTurn | null>(null)

  const touchStart = useRef<{
    x: number
    y: number
  } | null>(null)

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

  // =====================================================
  // 3. NAVEGACIÓN
  // =====================================================

  const navigate = useCallback(
    (direction: Direction) => {
      // Impedir transiciones superpuestas.
      if (pageTurn || total <= 1) return

      const target = safePage + direction

      if (target < 0 || target >= total) return

      // Cambio directo para usuarios que prefieren
      // reducir las animaciones.
      if (reduced) {
        setCurrentPage(target)
        return
      }

      setPageTurn({
        from: safePage,
        to: target,
        direction,
      })
    },
    [pageTurn, total, safePage, reduced],
  )

  const goNext = useCallback(() => {
    navigate(1)
  }, [navigate])

  const goPrev = useCallback(() => {
    navigate(-1)
  }, [navigate])

  // =====================================================
  // 4. FINALIZAR EL GIRO
  //
  // La hoja terminará con opacidad cero.
  // Así podrá retirarse sin generar un corte visible.
  // =====================================================

  const finishTurn = useCallback(() => {
    if (!pageTurn) return

    setCurrentPage(pageTurn.to)
    setPageTurn(null)
  }, [pageTurn])

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
  // 6. GESTOS TÁCTILES
  // =====================================================

  const handleTouchStart = (
    event: TouchEvent<HTMLDivElement>,
  ) => {
    const touch = event.touches[0]

    if (!touch || turning) return

    touchStart.current = {
      x: touch.clientX,
      y: touch.clientY,
    }
  }

  const handleTouchEnd = (
    event: TouchEvent<HTMLDivElement>,
  ) => {
    const start = touchStart.current
    touchStart.current = null

    const touch = event.changedTouches[0]

    if (!start || !touch || turning) return

    const dx = touch.clientX - start.x
    const dy = touch.clientY - start.y

    // Ignorar desplazamientos pequeños y verticales.
    if (
      Math.abs(dx) < 50 ||
      Math.abs(dx) < Math.abs(dy) * 1.4
    ) {
      return
    }

    if (dx > 0) {
      goPrev()
    } else {
      goNext()
    }
  }

  // =====================================================
  // 7. CONTROLES
  // =====================================================

  const canGoPrev = safePage > 0 && !turning

  const canGoNext =
    safePage < total - 1 && !turning

  // =====================================================
  // 8. CONFIGURACIÓN DEL GIRO SUAVIZADO
  //
  // La rotación comienza con la hoja visible.
  //
  // Durante la última parte:
  // - El giro continúa.
  // - La opacidad disminuye progresivamente.
  // - La página de destino queda descubierta.
  //
  // Al terminar, la hoja ya es invisible y
  // React puede desmontarla sin un salto brusco.
  // =====================================================

  const turnAngle: number =
    pageTurn?.direction === 1 ? -180 : 180

  const flipAnimation = {
    rotateY: [
      0,
      turnAngle * 0.55,
      turnAngle * 0.86,
      turnAngle,
    ],

    opacity: [
      1,
      1,
      0.65,
      0,
    ],
  }

  
const flipTransition = {
  duration: FLIP_DURATION,
  times: [0, 0.6, 0.84, 1],
  ease: [0.45, 0.05, 0.2, 1] as [
    number,
    number,
    number,
    number,
  ],
}


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
            VISOR DE PÁGINAS
            =============================================== */}

        {visiblePage ? (
          <div className="story__viewer">

            <div
              className="story__viewport"
              onKeyDown={handleKeyDown}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              tabIndex={0}
              role="group"
              aria-label="Storyboard interactivo. Usa las flechas izquierda y derecha para cambiar de página."
            >

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
                    HOJA QUE GIRA

                    Avanzar:
                    rotación hacia la izquierda.

                    Retroceder:
                    rotación hacia la derecha.

                    La hoja se desvanece al finalizar
                    para evitar el corte abrupto.
                    ======================================= */}

                {pageTurn && turningFrom && (
                  <motion.div
                    key={[
                      pageTurn.from,
                      pageTurn.to,
                      pageTurn.direction,
                    ].join('-')}
                    className={[
                      'story__turning-page',
                      pageTurn.direction === 1
                        ? 'story__turning-page--next'
                        : 'story__turning-page--prev',
                    ].join(' ')}
                    initial={{
                      rotateY: 0,
                      opacity: 1,
                    }}
                    animate={flipAnimation}
                    transition={flipTransition}
                    onAnimationComplete={finishTurn}
                    aria-hidden="true"
                  >

                    {/* Cara frontal */}

                    <div className="story__page-front">
                      <SmartImage
                        src={turningFrom.image}
                        alt=""
                        placeholderLabel="Viñeta"
                        index={String(
                          pageTurn.from + 1,
                        ).padStart(2, '0')}
                        ratio="16 / 9"
                        fit="contain"
                      />

                      <span
                        className="story__page-shadow"
                        aria-hidden="true"
                      />
                    </div>

                    {/* Reverso */}

                    <div className="story__page-back">
                      <div
                        className="story__paper-texture"
                        aria-hidden="true"
                      />

                      <span className="story__page-back-label label">
                        KING OF MUSIC
                      </span>
                    </div>

                  </motion.div>
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
