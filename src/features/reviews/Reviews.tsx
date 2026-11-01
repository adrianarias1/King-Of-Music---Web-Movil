import { useCallback, useEffect, useId, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { MessageSquareText, PenLine, Star, Users, X } from 'lucide-react'

import { characters } from '../../data/characters'
import { locations } from '../../data/locations'
import { useBodyScrollLock } from '../../hooks/useBodyScrollLock'
import { useDialog } from '../../hooks/useDialog'
import { useMediaQuery } from '../../hooks/useMediaQuery'
import { useScrolledPast } from '../../hooks/useScrolledPast'
import { localReviewRepository, validateReview } from './repository'
import type { Review, ReviewRepository, ReviewSection } from './repository'
import './Reviews.css'

// =========================================================
// KING OF MUSIC — RESEÑAS (BOTÓN FLOTANTE)
//
// Las reseñas ya no se montan como secciones dentro del
// recorrido principal. Un botón dorado fijo abre un panel
// con dos áreas:
//   1. Escribir reseña (formulario).
//   2. Comunidad (reseñas de otros usuarios).
//
// Escritorio: panel lateral derecho, ambas áreas lado a lado.
// Móvil: hoja inferior con pestañas para alternar áreas.
//
// Los destinos (section + subjectId) se conservan iguales a
// la versión anterior, así las reseñas guardadas siguen
// apareciendo en el mismo personaje / escenario.
// =========================================================

type CategoryId = 'personajes' | 'escenarios'

interface Subject {
  id: string
  name: string
  section: ReviewSection
}

interface Category {
  id: CategoryId
  label: string
  subjects: Subject[]
}

const CATEGORIES: Category[] = [
  {
    id: 'personajes',
    label: 'Personajes',
    subjects: characters.map((c) => ({ id: c.id, name: c.name, section: 'personajes' })),
  },
  {
    id: 'escenarios',
    label: 'Mapa y escenarios',
    subjects: [
      // `mapa/general` conserva las reseñas antiguas del mapa.
      { id: 'general', name: 'Mapa general', section: 'mapa' },
      ...locations.map((l) => ({ id: l.id, name: l.name, section: 'escenarios' as const })),
    ],
  },
]

/** Mismo breakpoint que el resto de la landing. */
const MOBILE_QUERY = '(max-width: 767px)'

type View = 'write' | 'feed'

interface Props {
  repository?: ReviewRepository
}

export function ReviewsDock({ repository = localReviewRepository }: Props) {
  const [open, setOpen] = useState(false)
  const visible = useScrolledPast(120)
  const close = useCallback(() => setOpen(false), [])

  return (
    <>
      <button
        type="button"
        className={`reviews-fab${visible ? ' is-visible' : ''}`}
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls="reviews-dock"
        tabIndex={visible ? 0 : -1}
      >
        <MessageSquareText size={20} strokeWidth={1.6} aria-hidden="true" />
        <span className="reviews-fab__label">Reseñas</span>
      </button>

      {createPortal(
        <ReviewsDialog open={open} onClose={close} repository={repository} />,
        document.body,
      )}
    </>
  )
}

// =========================================================
// PANEL
// =========================================================

function ReviewsDialog({
  open,
  onClose,
  repository,
}: {
  open: boolean
  onClose: () => void
  repository: ReviewRepository
}) {
  const reduced = useReducedMotion()
  const isMobile = useMediaQuery(MOBILE_QUERY)
  const { panelRef, handleOverlayClick } = useDialog(open, onClose)
  useBodyScrollLock(open)

  const [categoryId, setCategoryId] = useState<CategoryId>('personajes')
  const category = CATEGORIES.find((c) => c.id === categoryId) ?? CATEGORIES[0]!
  const [subjectId, setSubjectId] = useState(category.subjects[0]?.id ?? '')
  const subject = category.subjects.find((s) => s.id === subjectId) ?? category.subjects[0]
  const [view, setView] = useState<View>('write')
  // El nombre se conserva al cambiar de personaje o escenario.
  const [authorName, setAuthorName] = useState('')

  function changeCategory(next: CategoryId) {
    setCategoryId(next)
    const first = CATEGORIES.find((c) => c.id === next)?.subjects[0]
    setSubjectId(first?.id ?? '')
  }

  const offscreen = isMobile ? { y: '100%' } : { x: '100%' }

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="reviews-dock__overlay"
          onClick={handleOverlayClick}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduced ? 0 : 0.25 }}
        >
          <motion.div
            ref={panelRef}
            id="reviews-dock"
            className="reviews-dock"
            role="dialog"
            aria-modal="true"
            aria-labelledby="reviews-dock-title"
            tabIndex={-1}
            initial={reduced ? { opacity: 0 } : offscreen}
            animate={reduced ? { opacity: 1 } : { x: 0, y: 0 }}
            exit={reduced ? { opacity: 0 } : offscreen}
            transition={{ duration: reduced ? 0 : 0.42, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Encabezado */}
            <header className="reviews-dock__head">
              {isMobile ? <span className="reviews-dock__grabber" aria-hidden="true" /> : null}
              <div>
                <p className="reviews-dock__eyebrow">La voz de la comunidad</p>
                <h2 id="reviews-dock-title" className="reviews-dock__title">Reseñas</h2>
              </div>
              <button
                type="button"
                className="reviews-dock__close"
                onClick={onClose}
                aria-label="Cerrar reseñas"
              >
                <X size={20} strokeWidth={1.5} aria-hidden="true" />
              </button>
            </header>

            {/* Selección del destino */}
            <div className="reviews-dock__pickers">
              <label className="reviews-dock__field">
                <span>Categoría</span>
                <select
                  value={categoryId}
                  onChange={(e) => changeCategory(e.target.value as CategoryId)}
                >
                  {CATEGORIES.map((c) => (
                    <option key={c.id} value={c.id}>{c.label}</option>
                  ))}
                </select>
              </label>
              <label className="reviews-dock__field">
                <span>{categoryId === 'personajes' ? 'Personaje' : 'Escenario'}</span>
                <select value={subject?.id ?? ''} onChange={(e) => setSubjectId(e.target.value)}>
                  {category.subjects.map((s) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </label>
            </div>

            {/* Pestañas (solo móvil, ver CSS) */}
            <div className="reviews-dock__tabs" role="tablist" aria-label="Áreas de reseñas">
              <button
                type="button"
                role="tab"
                id="reviews-tab-write"
                aria-selected={view === 'write'}
                aria-controls="reviews-area-write"
                className={view === 'write' ? 'is-active' : ''}
                onClick={() => setView('write')}
              >
                <PenLine size={16} aria-hidden="true" /> Escribir reseña
              </button>
              <button
                type="button"
                role="tab"
                id="reviews-tab-feed"
                aria-selected={view === 'feed'}
                aria-controls="reviews-area-feed"
                className={view === 'feed' ? 'is-active' : ''}
                onClick={() => setView('feed')}
              >
                <Users size={16} aria-hidden="true" /> Comunidad
              </button>
            </div>

            {subject ? (
              <ReviewPanel
                key={`${subject.section}:${subject.id}`}
                section={subject.section}
                subjectId={subject.id}
                subjectName={subject.name}
                repository={repository}
                view={view}
                isMobile={isMobile}
                authorName={authorName}
                onAuthorNameChange={setAuthorName}
                onSubmitted={() => { if (isMobile) setView('feed') }}
              />
            ) : null}

            <p className="reviews-dock__notice">
              Vista previa local: tus reseñas se guardan en este dispositivo y no se comparten con otros usuarios.
            </p>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}

// =========================================================
// FORMULARIO + LISTADO
// =========================================================

interface PanelProps {
  section: ReviewSection
  subjectId: string
  subjectName: string
  repository: ReviewRepository
  view: View
  isMobile: boolean
  authorName: string
  onAuthorNameChange: (value: string) => void
  onSubmitted: () => void
}

function ReviewPanel({
  section,
  subjectId,
  subjectName,
  repository,
  view,
  isMobile,
  authorName,
  onAuthorNameChange,
  onSubmitted,
}: PanelProps) {
  const id = useId()
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState(false)
  const [retry, setRetry] = useState(0)
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [sort, setSort] = useState('recent')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    let active = true
    repository.list({ section, subjectId })
      .then((data) => { if (active) setReviews(data) })
      .catch(() => { if (active) setLoadError(true) })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [repository, section, subjectId, retry])

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (saving) return
    setError('')
    setSuccess('')
    const input = { section, subjectId, authorName, rating, comment }
    const validation = validateReview(input)
    if (validation) { setError(validation); return }
    setSaving(true)
    try {
      const review = await repository.create(input)
      setReviews((current) => [...current, review])
      setComment('')
      setRating(0)
      setSuccess('Tu reseña se guardó en este dispositivo.')
      onSubmitted()
    } catch {
      setError('No pudimos guardar tu reseña. Comprueba que el almacenamiento esté disponible e inténtalo de nuevo. Tu texto se conserva.')
    } finally {
      setSaving(false)
    }
  }

  const average = reviews.length
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : '—'

  const sorted = useMemo(() => [...reviews].sort((a, b) => sort === 'best'
    ? b.rating - a.rating || Date.parse(b.createdAt) - Date.parse(a.createdAt)
    : Date.parse(b.createdAt) - Date.parse(a.createdAt)), [reviews, sort])

  // En móvil solo se muestra el área activa; en escritorio ambas.
  const showWrite = !isMobile || view === 'write'
  const showFeed = !isMobile || view === 'feed'

  return (
    <div className="reviews-dock__body">
      <form
        id="reviews-area-write"
        role={isMobile ? 'tabpanel' : undefined}
        aria-labelledby={isMobile ? 'reviews-tab-write' : undefined}
        className="reviews-dock__form"
        hidden={!showWrite}
        onSubmit={submit}
        aria-describedby={`${id}-error`}
      >
        <h3 className="reviews-dock__area-title">
          Evalúa a <span>{subjectName}</span>
        </h3>

        <label htmlFor={`${id}-name`}>Nombre para mostrar</label>
        <input
          id={`${id}-name`}
          value={authorName}
          onChange={(e) => onAuthorNameChange(e.target.value)}
          autoComplete="nickname"
          required
          minLength={2}
          maxLength={50}
          placeholder="Cómo quieres aparecer"
        />

        <fieldset className="reviews-dock__rating" disabled={saving}>
          <legend>Tu calificación</legend>
          <div>
            {[1, 2, 3, 4, 5].map((value) => (
              <label key={value} className={value <= rating ? 'is-selected' : ''}>
                <input
                  type="radio"
                  name={`${id}-rating`}
                  value={value}
                  checked={rating === value}
                  onChange={() => setRating(value)}
                  required
                />
                <Star size={24} fill={value <= rating ? 'currentColor' : 'none'} aria-hidden="true" />
                <span className="sr-only">{value} {value === 1 ? 'estrella' : 'estrellas'}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <label htmlFor={`${id}-comment`}>Tu reseña</label>
        <textarea
          id={`${id}-comment`}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          required
          minLength={10}
          maxLength={1000}
          rows={4}
          placeholder="¿Qué te gustó? ¿Qué mejorarías?"
          aria-describedby={`${id}-count`}
        />
        <small id={`${id}-count`}>{comment.length}/1000 caracteres · mínimo 10</small>

        <p id={`${id}-error`} role="alert" className="reviews-dock__error">{error}</p>
        <p role="status" className="reviews-dock__success">{success}</p>

        <button
          className="reviews-dock__submit"
          type="submit"
          disabled={saving || loading || loadError}
        >
          {saving ? 'Guardando…' : 'Publicar reseña'}
        </button>
      </form>

      <section
        id="reviews-area-feed"
        role={isMobile ? 'tabpanel' : undefined}
        aria-labelledby={isMobile ? 'reviews-tab-feed' : `${id}-feed-title`}
        className="reviews-dock__feed"
        hidden={!showFeed}
        aria-busy={loading}
      >
        <h3 id={`${id}-feed-title`} className="reviews-dock__area-title">
          Opiniones de la comunidad
        </h3>

        {loading ? (
          <p role="status">Cargando reseñas…</p>
        ) : loadError ? (
          <div role="alert">
            <p>No pudimos leer las reseñas guardadas. No se modificó su contenido.</p>
            <button
              type="button"
              className="reviews-dock__retry"
              onClick={() => { setLoading(true); setLoadError(false); setRetry((v) => v + 1) }}
            >
              Reintentar
            </button>
          </div>
        ) : (
          <>
            <div className="reviews-dock__summary">
              <div>
                <strong>{average} <span aria-hidden="true">★</span></strong>
                <p>{reviews.length} {reviews.length === 1 ? 'reseña' : 'reseñas'}</p>
              </div>
              <label>
                <span>Ordenar por</span>
                <select value={sort} onChange={(e) => setSort(e.target.value)}>
                  <option value="recent">Más recientes</option>
                  <option value="best">Mejor calificación</option>
                </select>
              </label>
            </div>

            {isMobile && success ? <p className="reviews-dock__success">{success}</p> : null}

            {!reviews.length ? (
              <div className="reviews-dock__empty">
                <Star size={28} aria-hidden="true" />
                <h4>Tu opinión abre la conversación</h4>
                <p>Aún no hay reseñas para {subjectName}. Comparte la primera.</p>
              </div>
            ) : (
              <ul className="reviews-dock__list">
                {sorted.map((review) => (
                  <li key={review.id}>
                    <article>
                      <div className="reviews-dock__byline">
                        <strong>{review.authorName}</strong>
                        <time dateTime={review.createdAt}>
                          {new Date(review.createdAt).toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </time>
                      </div>
                      <p className="reviews-dock__stars" aria-label={`${review.rating} de 5 estrellas`}>
                        {'★'.repeat(review.rating)}
                        <span aria-hidden="true">{'☆'.repeat(5 - review.rating)}</span>
                      </p>
                      <p className="reviews-dock__comment">{review.comment}</p>
                    </article>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </section>
    </div>
  )
}
