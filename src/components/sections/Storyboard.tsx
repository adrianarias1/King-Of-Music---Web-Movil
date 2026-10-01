import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { storyIntro, storyboardPages } from '../../data/storyboard'
import { SmartImage } from '../ui/SmartImage'
import { SectionHeading } from '../ui/SectionHeading'
import './Storyboard.css'

/**
 * Visor de storyboard / comic.
 *
 * - Desktop: hasta 2 paginas visibles a la vez.
 * - Movil: 1 pagina.
 * - Navegacion con botones y swipe tactil (sin dependencias extra).
 * - Si faltan imagenes, se muestran placeholders con el pie de pagina.
 *
 * ASSETS PENDIENTES: public/images/storyboard/<id>.jpg
 */
export function Storyboard() {
  const [rawPage, setRawPage] = useState(0)
  const [perView, setPerView] = useState(1)
  const reduced = useReducedMotion()
  const touchStart = useRef<{ x: number; y: number } | null>(null)

  const total = storyboardPages.length
  const maxPage = Math.max(0, total - perView)

  // Deriva en render en lugar de guardar: al cambiar el ancho nunca queda
  // fuera de rango.
  const page = Math.min(rawPage, maxPage)

  // Ajusta paginas visibles segun el ancho disponible.
  useEffect(() => {
    const query = window.matchMedia('(min-width: 900px)')
    const apply = () => setPerView(query.matches ? 2 : 1)
    apply()
    query.addEventListener('change', apply)
    return () => query.removeEventListener('change', apply)
  }, [])

  const goPrev = useCallback(() => setRawPage(Math.max(0, page - perView)), [page, perView])
  const goNext = useCallback(
    () => setRawPage(Math.min(maxPage, page + perView)),
    [maxPage, page, perView],
  )

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'ArrowLeft') {
      event.preventDefault()
      goPrev()
    } else if (event.key === 'ArrowRight') {
      event.preventDefault()
      goNext()
    }
  }

  const handleTouchStart = (event: React.TouchEvent) => {
    const touch = event.touches[0]
    if (!touch) return
    touchStart.current = { x: touch.clientX, y: touch.clientY }
  }

  const handleTouchEnd = (event: React.TouchEvent) => {
    const start = touchStart.current
    touchStart.current = null
    const touch = event.changedTouches[0]
    if (!start || !touch) return

    const dx = touch.clientX - start.x
    const dy = touch.clientY - start.y

    // Solo cuenta como swipe si es claramente horizontal.
    if (Math.abs(dx) < 45 || Math.abs(dx) < Math.abs(dy) * 1.4) return
    if (dx > 0) goPrev()
    else goNext()
  }

  const visible = storyboardPages.slice(page, page + perView)
  const firstShown = page + 1
  const lastShown = Math.min(page + perView, total)

  return (
    <section id="historia" className="section theme-light story" aria-label={storyIntro.title}>
      <div className="container">
        <SectionHeading index="04" eyebrow="Narrativa" title={storyIntro.title} lead={storyIntro.lead} />

        <div className="story__viewport">
          <div
            className="story__pages"
            onKeyDown={handleKeyDown}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            tabIndex={0}
            role="group"
            aria-label="Paginas del storyboard. Usa las flechas izquierda y derecha."
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={page}
                className="story__row"
                style={{ gridTemplateColumns: `repeat(${perView}, minmax(0, 1fr))` }}
                initial={reduced ? false : { opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={reduced ? undefined : { opacity: 0, x: -12 }}
                transition={{ duration: reduced ? 0 : 0.26, ease: [0.22, 1, 0.36, 1] }}
              >
                {visible.map((item) => (
                  <figure className="story__page" key={item.id}>
                    <SmartImage
                      src={item.image}
                      alt={`${item.caption} del storyboard`}
                      placeholderLabel="Vineta"
                      index={item.caption.replace(/\D/g, '').padStart(2, '0')}
                      ratio="3 / 4"
                    />
                    <figcaption className="story__caption">
                      <span className="label">{item.caption}</span>
                      {item.text ? <p className="story__text">{item.text}</p> : null}
                    </figcaption>
                  </figure>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <div className="story__controls">
          <button
            type="button"
            className="story__nav"
            onClick={goPrev}
            disabled={page === 0}
            aria-label="Pagina anterior"
          >
            <ChevronLeft size={20} strokeWidth={1.5} aria-hidden="true" />
          </button>

          <p className="story__counter label" aria-live="polite">
            <span>
              {String(firstShown).padStart(2, '0')} — {String(lastShown).padStart(2, '0')}
            </span>
            <span aria-hidden="true">/</span>
            <span>{String(total).padStart(2, '0')}</span>
          </p>

          <button
            type="button"
            className="story__nav"
            onClick={goNext}
            disabled={page >= maxPage}
            aria-label="Pagina siguiente"
          >
            <ChevronRight size={20} strokeWidth={1.5} aria-hidden="true" />
          </button>
        </div>
      </div>
    </section>
  )
}