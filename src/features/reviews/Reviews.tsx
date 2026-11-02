import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { ArrowLeft, LogIn, MessageSquareText, PenLine, Pencil, Star, Trash2, Users, X } from 'lucide-react'

import { characters } from '../../data/characters'
import { locations } from '../../data/locations'
import { useBodyScrollLock } from '../../hooks/useBodyScrollLock'
import { useDialog } from '../../hooks/useDialog'
import { useMediaQuery } from '../../hooks/useMediaQuery'
import { useScrolledPast } from '../../hooks/useScrolledPast'
import { useAuth } from '../auth/authContext'
import { ReviewError, supabaseReviewRepository } from './repository'
import type { Review, ReviewRepository, ReviewStats } from './repository'
import { COMMENT_MAX, COMMENT_MIN, hasErrors, normalizeComment, validateReviewDraft } from './validation'
import type { ReviewErrors, ReviewSection } from './validation'
import './Reviews.css'

// =========================================================
// KING OF MUSIC — RESEÑAS (BOTÓN FLOTANTE)
//
// Botón dorado fijo que abre un panel con dos áreas:
//   1. Escribir (o editar) una reseña — requiere sesión de Google.
//   2. Comunidad — reseñas de todos los usuarios (Supabase).
//
// Escritorio: panel lateral con ambas áreas lado a lado.
// Móvil: hoja inferior con pestañas.
//
// Validación en dos capas: este formulario (validation.ts) y la base de
// datos (public.reviews: checks, triggers y RLS).
// =========================================================

type CategoryId = 'juego' | 'personajes' | 'escenarios'

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

// Los IDs coinciden con el catálogo public.review_subjects.
// "El juego en general" es la vista por defecto: formulario para opinar
// del juego y lista con las últimas reseñas de toda la comunidad.
const CATEGORIES: Category[] = [
  {
    id: 'juego',
    label: 'El juego en general',
    subjects: [{ id: 'general', name: 'El juego', section: 'juego' }],
  },
  {
    id: 'personajes',
    label: 'Personajes',
    subjects: characters.map((c) => ({ id: c.id, name: c.name, section: 'personajes' })),
  },
  {
    id: 'escenarios',
    label: 'Mapa y escenarios',
    subjects: [
      { id: 'general', name: 'Mapa general', section: 'mapa' },
      ...locations.map((l) => ({ id: l.id, name: l.name, section: 'escenarios' as const })),
    ],
  },
]

/** Nombre legible de cada elemento: "personajes:juan-grabriel" -> "Juan Grabriel". */
const SUBJECT_NAMES = new Map(
  CATEGORIES.flatMap((c) => c.subjects.map((s) => [`${s.section}:${s.id}`, s.name] as const)),
)

function categoryOf(section: ReviewSection): CategoryId {
  if (section === 'juego') return 'juego'
  if (section === 'personajes') return 'personajes'
  return 'escenarios'
}

/** Categorías que abarca "Ver todas" según el elemento elegido. */
const CATEGORY_SECTIONS: Record<ReviewSection, readonly ReviewSection[]> = {
  juego: ['juego'],
  personajes: ['personajes'],
  escenarios: ['escenarios', 'mapa'],
  mapa: ['escenarios', 'mapa'],
}

/** Reseñas por página en la vista general. */
const RECENT_PAGE_SIZE = 15

/** Mismo breakpoint que el resto de la landing. */
const MOBILE_QUERY = '(max-width: 767px)'

type View = 'write' | 'feed'

interface Props {
  /** Abre el diálogo de inicio de sesión (el panel se cierra antes). */
  onRequestLogin: () => void
  repository?: ReviewRepository
}

export function ReviewsDock({ onRequestLogin, repository = supabaseReviewRepository }: Props) {
  const [open, setOpen] = useState(false)
  const visible = useScrolledPast(120)
  const close = useCallback(() => setOpen(false), [])

  const requestLogin = useCallback(() => {
    setOpen(false)
    onRequestLogin()
  }, [onRequestLogin])

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
        <ReviewsDialog open={open} onClose={close} onRequestLogin={requestLogin} repository={repository} />,
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
  onRequestLogin,
  repository,
}: {
  open: boolean
  onClose: () => void
  onRequestLogin: () => void
  repository: ReviewRepository
}) {
  const reduced = useReducedMotion()
  const isMobile = useMediaQuery(MOBILE_QUERY)
  const { panelRef, handleOverlayClick } = useDialog(open, onClose)
  useBodyScrollLock(open)

  const [categoryId, setCategoryId] = useState<CategoryId>('juego')
  const category = CATEGORIES.find((c) => c.id === categoryId) ?? CATEGORIES[0]!
  const [subjectId, setSubjectId] = useState(category.subjects[0]?.id ?? '')
  const subject = category.subjects.find((s) => s.id === subjectId) ?? category.subjects[0]
  const [view, setView] = useState<View>('write')

  function changeCategory(next: CategoryId) {
    setCategoryId(next)
    const first = CATEGORIES.find((c) => c.id === next)?.subjects[0]
    setSubjectId(first?.id ?? '')
  }

  /** Ir directo a un personaje/escenario (desde la etiqueta "Sobre: …"). */
  const navigateTo = useCallback((section: ReviewSection, id: string) => {
    setCategoryId(categoryOf(section))
    setSubjectId(id)
    setView('feed')
  }, [])

  const isGeneral = categoryId === 'juego'

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
            <header className="reviews-dock__head">
              {isMobile ? <span className="reviews-dock__grabber" aria-hidden="true" /> : null}
              <div>
                <p className="reviews-dock__eyebrow">La voz de la comunidad</p>
                <h2 id="reviews-dock-title" className="reviews-dock__title">Reseñas</h2>
              </div>
              <button type="button" className="reviews-dock__close" onClick={onClose} aria-label="Cerrar reseñas">
                <X size={20} strokeWidth={1.5} aria-hidden="true" />
              </button>
            </header>

            {!isGeneral ? (
              <button type="button" className="reviews-dock__back" onClick={() => changeCategory('juego')}>
                <ArrowLeft size={16} aria-hidden="true" /> Volver a la vista general
              </button>
            ) : null}

            <div className={`reviews-dock__pickers${isGeneral ? ' is-single' : ''}`}>
              <label className="reviews-dock__field">
                <span>Categoría</span>
                <select value={categoryId} onChange={(e) => changeCategory(e.target.value as CategoryId)}>
                  {CATEGORIES.map((c) => (
                    <option key={c.id} value={c.id}>{c.label}</option>
                  ))}
                </select>
              </label>
              {!isGeneral ? (
                <label className="reviews-dock__field">
                  <span>{categoryId === 'personajes' ? 'Personaje' : 'Escenario'}</span>
                  <select value={subject?.id ?? ''} onChange={(e) => setSubjectId(e.target.value)}>
                    {category.subjects.map((s) => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </label>
              ) : null}
            </div>

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
                onViewChange={setView}
                onRequestLogin={onRequestLogin}
                onNavigate={navigateTo}
              />
            ) : null}
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
  onViewChange: (view: View) => void
  onRequestLogin: () => void
  onNavigate: (section: ReviewSection, subjectId: string) => void
}

const dateFormat = new Intl.DateTimeFormat('es-MX', { day: 'numeric', month: 'short', year: 'numeric' })

function ReviewPanel({
  section,
  subjectId,
  subjectName,
  repository,
  view,
  isMobile,
  onViewChange,
  onRequestLogin,
  onNavigate,
}: PanelProps) {
  const id = useId()
  // Vista general: últimas reseñas de todo + promedio global.
  const general = section === 'juego'
  const { status, user, profile } = useAuth()
  const signedIn = status === 'signed_in' && Boolean(user)

  // Listado
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [retry, setRetry] = useState(0)
  const [sort, setSort] = useState<'recent' | 'best' | 'all'>('recent')
  const [hasMore, setHasMore] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)
  const [stats, setStats] = useState<ReviewStats | null>(null)

  // "Ver todas": todas las reseñas de la categoría del elemento elegido
  // (p. ej. todos los escenarios y el mapa), no solo las de Bellas Artes.
  const showAll = !general && sort === 'all'
  const categoryLabel = section === 'personajes' ? 'Personajes' : 'Mapa y escenarios'
  // Vista paginada con etiqueta "Sobre: …": la general o "Ver todas".
  const paged = general || showAll
  const pageSections = general ? undefined : CATEGORY_SECTIONS[section]

  // Formulario
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [editing, setEditing] = useState<Review | null>(null)
  const [touched, setTouched] = useState<{ rating?: boolean; comment?: boolean }>({})
  const [submitted, setSubmitted] = useState(false)
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState('')
  const [success, setSuccess] = useState('')

  // Borrado con confirmación
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [feedError, setFeedError] = useState('')

  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const refreshStats = useCallback(() => {
    repository.stats(pageSections).then(setStats).catch(() => undefined)
  }, [repository, pageSections])

  useEffect(() => {
    let active = true
    const load = paged
      ? Promise.all([
          repository.listRecent({ limit: RECENT_PAGE_SIZE, sections: pageSections }),
          repository.stats(pageSections),
        ]).then(
          ([page, globalStats]) => {
            if (!active) return page.reviews
            setHasMore(page.hasMore)
            setStats(globalStats)
            return page.reviews
          },
        )
      : repository.list({ section, subjectId })
    load
      .then((data) => {
        if (active) {
          setReviews(data)
          setLoadError('')
        }
      })
      .catch((error: unknown) => {
        if (active) setLoadError(error instanceof ReviewError ? error.message : 'No pudimos cargar las reseñas.')
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [repository, section, subjectId, retry, paged, pageSections])

  async function loadMore() {
    const last = reviews[reviews.length - 1]
    if (!last || loadingMore) return
    setLoadingMore(true)
    setFeedError('')
    try {
      const page = await repository.listRecent({ limit: RECENT_PAGE_SIZE, after: last, sections: pageSections })
      setReviews((current) => {
        const seen = new Set(current.map((r) => r.id))
        return [...current, ...page.reviews.filter((r) => !seen.has(r.id))]
      })
      setHasMore(page.hasMore)
    } catch (error) {
      setFeedError(error instanceof ReviewError ? error.message : 'No pudimos cargar más reseñas.')
    } finally {
      setLoadingMore(false)
    }
  }

  // ---------------------------------------------------------
  // Validación en vivo (se muestra al tocar el campo o al enviar)
  // ---------------------------------------------------------
  const errors: ReviewErrors = useMemo(
    () => validateReviewDraft({ section, subjectId, rating, comment }),
    [section, subjectId, rating, comment],
  )
  const showError = (field: 'rating' | 'comment') => (submitted || touched[field]) && errors[field]
  const normalizedLength = normalizeComment(comment).length

  function resetForm() {
    setRating(0)
    setComment('')
    setEditing(null)
    setTouched({})
    setSubmitted(false)
    setFormError('')
  }

  function startEdit(review: Review) {
    setEditing(review)
    setRating(review.rating)
    setComment(review.comment)
    setTouched({})
    setSubmitted(false)
    setFormError('')
    setSuccess('')
    setConfirmDeleteId(null)
    onViewChange('write')
    requestAnimationFrame(() => textareaRef.current?.focus())
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (saving) return
    setSubmitted(true)
    setFormError('')
    setSuccess('')
    if (!signedIn) {
      onRequestLogin()
      return
    }
    if (hasErrors(errors)) return

    setSaving(true)
    try {
      if (editing) {
        const updated = await repository.update(editing.id, { rating, comment })
        setReviews((current) => current.map((r) => (r.id === updated.id ? updated : r)))
        setSuccess('Tu reseña se actualizó.')
        if (paged) refreshStats()
      } else {
        const created = await repository.create({ section, subjectId, rating, comment })
        setReviews((current) => [created, ...current])
        setSuccess('¡Gracias! Tu reseña ya está publicada.')
        if (paged) refreshStats()
      }
      resetForm()
      if (isMobile) onViewChange('feed')
    } catch (error) {
      setFormError(error instanceof ReviewError ? error.message : 'No pudimos guardar tu reseña. Tu texto se conserva.')
    } finally {
      setSaving(false)
    }
  }

  async function confirmDelete(review: Review) {
    setDeletingId(review.id)
    setFeedError('')
    try {
      await repository.remove(review.id)
      setReviews((current) => current.filter((r) => r.id !== review.id))
      if (paged) refreshStats()
      if (editing?.id === review.id) resetForm()
      setConfirmDeleteId(null)
    } catch (error) {
      setFeedError(error instanceof ReviewError ? error.message : 'No pudimos eliminar la reseña.')
    } finally {
      setDeletingId(null)
    }
  }

  // ---------------------------------------------------------
  // Datos derivados del listado
  // ---------------------------------------------------------
  const published = reviews.filter((r) => r.status === 'published')
  const localAverage = published.length
    ? (published.reduce((sum, r) => sum + r.rating, 0) / published.length).toFixed(1)
    : '—'
  // Vista general: promedio y total de TODA la comunidad (servidor).
  const average = paged ? (stats?.average != null ? stats.average.toFixed(1) : '—') : localAverage
  const totalCount = paged ? stats?.total ?? published.length : published.length

  const sorted = useMemo(
    () =>
      [...reviews].sort((a, b) =>
        !general && sort === 'best'
          ? b.rating - a.rating || Date.parse(b.createdAt) - Date.parse(a.createdAt)
          : Date.parse(b.createdAt) - Date.parse(a.createdAt),
      ),
    [reviews, sort, general],
  )

  const showWrite = !isMobile || view === 'write'
  const showFeed = !isMobile || view === 'feed'
  const commentInvalid = Boolean(showError('comment'))
  const ratingInvalid = Boolean(showError('rating'))

  return (
    <div className="reviews-dock__body">
      {/* ======================== ESCRIBIR ======================== */}
      <div
        id="reviews-area-write"
        role={isMobile ? 'tabpanel' : undefined}
        aria-labelledby={isMobile ? 'reviews-tab-write' : undefined}
        className="reviews-dock__form-wrap"
        hidden={!showWrite}
      >
        {status === 'loading' ? (
          <div className="reviews-dock__form reviews-dock__gate" aria-busy="true">
            <p>Comprobando tu sesión…</p>
          </div>
        ) : !signedIn ? (
          <div className="reviews-dock__form reviews-dock__gate">
            <h3 className="reviews-dock__area-title">
              {general ? <>Opina sobre <span>King of Music</span></> : <>Evalúa a <span>{subjectName}</span></>}
            </h3>
            <p>Inicia sesión con tu cuenta de Google para publicar tu reseña. Puedes leer las de la comunidad sin iniciar sesión.</p>
            <button type="button" className="reviews-dock__submit" onClick={onRequestLogin}>
              <LogIn size={17} aria-hidden="true" /> Iniciar sesión para escribir
            </button>
          </div>
        ) : (
          <form className="reviews-dock__form" onSubmit={submit} noValidate aria-describedby={`${id}-form-error`}>
            <h3 className="reviews-dock__area-title">
              {editing ? 'Editar tu reseña de ' : general ? 'Opina sobre ' : 'Evalúa a '}
              <span>{general ? 'King of Music' : subjectName}</span>
            </h3>

            <p className="reviews-dock__author">
              <Avatar name={profile?.fullName || profile?.firstName || ''} url={profile?.avatarUrl ?? null} />
              Publicarás como <strong>{profile?.fullName || profile?.firstName}</strong>
            </p>

            <fieldset
              className={`reviews-dock__rating${ratingInvalid ? ' is-invalid' : ''}`}
              disabled={saving}
              aria-describedby={ratingInvalid ? `${id}-rating-error` : undefined}
              aria-invalid={ratingInvalid || undefined}
            >
              <legend>Tu calificación <span aria-hidden="true">*</span></legend>
              <div>
                {[1, 2, 3, 4, 5].map((value) => (
                  <label key={value} className={value <= rating ? 'is-selected' : ''}>
                    <input
                      type="radio"
                      name={`${id}-rating`}
                      value={value}
                      checked={rating === value}
                      onChange={() => {
                        setRating(value)
                        setTouched((t) => ({ ...t, rating: true }))
                      }}
                    />
                    <Star size={24} fill={value <= rating ? 'currentColor' : 'none'} aria-hidden="true" />
                    <span className="sr-only">{value} {value === 1 ? 'estrella' : 'estrellas'}</span>
                  </label>
                ))}
              </div>
              {ratingInvalid ? <p id={`${id}-rating-error`} className="reviews-dock__field-error">{errors.rating}</p> : null}
            </fieldset>

            <label htmlFor={`${id}-comment`}>Tu reseña <span aria-hidden="true">*</span></label>
            <textarea
              ref={textareaRef}
              id={`${id}-comment`}
              value={comment}
              onChange={(e) => setComment(e.target.value.slice(0, COMMENT_MAX + 200))}
              onBlur={() => setTouched((t) => ({ ...t, comment: true }))}
              rows={5}
              disabled={saving}
              placeholder={general ? '¿Qué te pareció King of Music?' : '¿Qué te gustó? ¿Qué mejorarías?'}
              aria-required="true"
              aria-invalid={commentInvalid || undefined}
              aria-describedby={`${id}-count${commentInvalid ? ` ${id}-comment-error` : ''}`}
              className={commentInvalid ? 'is-invalid' : undefined}
            />
            <small
              id={`${id}-count`}
              className={normalizedLength > COMMENT_MAX ? 'is-over' : undefined}
            >
              {normalizedLength}/{COMMENT_MAX} caracteres · mínimo {COMMENT_MIN}
            </small>
            {commentInvalid ? <p id={`${id}-comment-error`} className="reviews-dock__field-error">{errors.comment}</p> : null}

            <p id={`${id}-form-error`} role="alert" className="reviews-dock__error">{formError}</p>
            <p role="status" className="reviews-dock__success">{isMobile ? '' : success}</p>

            <div className="reviews-dock__actions">
              <button
                className="reviews-dock__submit"
                type="submit"
                disabled={saving || (submitted && hasErrors(errors))}
                aria-busy={saving}
              >
                {saving ? 'Guardando…' : editing ? 'Guardar cambios' : 'Publicar reseña'}
              </button>
              {editing ? (
                <button type="button" className="reviews-dock__secondary" onClick={resetForm} disabled={saving}>
                  Cancelar
                </button>
              ) : null}
            </div>
          </form>
        )}
      </div>

      {/* ======================== COMUNIDAD ======================== */}
      <section
        id="reviews-area-feed"
        role={isMobile ? 'tabpanel' : undefined}
        aria-labelledby={isMobile ? 'reviews-tab-feed' : `${id}-feed-title`}
        className="reviews-dock__feed"
        hidden={!showFeed}
        aria-busy={loading}
      >
        <h3 id={`${id}-feed-title`} className="reviews-dock__area-title">
          {general
            ? 'Últimas reseñas de la comunidad'
            : showAll
              ? `Todas las reseñas de ${categoryLabel}`
              : `Opiniones sobre ${subjectName}`}
        </h3>

        {loading ? (
          <p role="status" className="reviews-dock__muted">Cargando reseñas…</p>
        ) : loadError ? (
          <div role="alert" className="reviews-dock__muted">
            <p>{loadError}</p>
            <button
              type="button"
              className="reviews-dock__retry"
              onClick={() => {
                setLoading(true)
                setLoadError('')
                setRetry((v) => v + 1)
              }}
            >
              Reintentar
            </button>
          </div>
        ) : (
          <>
            <div className="reviews-dock__summary">
              <div>
                <strong>{average} <span aria-hidden="true">★</span></strong>
                <p>
                  {totalCount} {totalCount === 1 ? 'reseña' : 'reseñas'}
                  {general ? ' en toda la comunidad' : showAll ? ` en ${categoryLabel}` : ''}
                </p>
              </div>
              {!general ? (
                <label>
                  <span>Mostrar</span>
                  <select
                    value={sort}
                    onChange={(e) => {
                      const next = e.target.value as 'recent' | 'best' | 'all'
                      // Entrar o salir de "Ver todas" cambia la consulta.
                      if ((next === 'all') !== (sort === 'all')) {
                        setLoading(true)
                        setFeedError('')
                      }
                      setSort(next)
                    }}
                  >
                    <option value="recent">Más recientes</option>
                    <option value="best">Mejor calificación</option>
                    <option value="all">Ver todas</option>
                  </select>
                </label>
              ) : null}
            </div>

            {isMobile && success ? <p className="reviews-dock__success" role="status">{success}</p> : null}
            {feedError ? <p className="reviews-dock__error" role="alert">{feedError}</p> : null}

            {!reviews.length ? (
              <div className="reviews-dock__empty">
                <Star size={28} aria-hidden="true" />
                <h4>Tu opinión abre la conversación</h4>
                <p>
                  {general
                    ? 'Aún no hay reseñas. Sé el primero en opinar sobre King of Music.'
                    : showAll
                      ? `Aún no hay reseñas en ${categoryLabel}.`
                      : `Aún no hay reseñas para ${subjectName}. Comparte la primera.`}
                </p>
              </div>
            ) : (
              <ul className="reviews-dock__list">
                {sorted.map((review) => {
                  const mine = user?.id === review.userId
                  const confirming = confirmDeleteId === review.id
                  return (
                    <li key={review.id} className={mine ? 'is-mine' : undefined}>
                      <article>
                        <div className="reviews-dock__byline">
                          <span className="reviews-dock__who">
                            <Avatar name={review.authorName} url={review.authorAvatarUrl} />
                            <strong>{review.authorName}</strong>
                            {mine ? <span className="reviews-dock__badge">Tú</span> : null}
                          </span>
                          <time dateTime={review.createdAt}>
                            {dateFormat.format(Date.parse(review.createdAt))}
                            {review.edited ? ' · editada' : ''}
                          </time>
                        </div>
                        {paged ? (
                          review.section === 'juego' ? (
                            <span className="reviews-dock__about">Sobre: el juego</span>
                          ) : (
                            <button
                              type="button"
                              className="reviews-dock__about reviews-dock__about--link"
                              onClick={() => onNavigate(review.section, review.subjectId)}
                              title="Ver todas las reseñas de este elemento"
                            >
                              Sobre: {SUBJECT_NAMES.get(`${review.section}:${review.subjectId}`) ?? review.subjectId}
                            </button>
                          )
                        ) : null}
                        <p className="reviews-dock__stars" aria-label={`${review.rating} de 5 estrellas`}>
                          {'★'.repeat(review.rating)}
                          <span aria-hidden="true">{'☆'.repeat(5 - review.rating)}</span>
                        </p>
                        <p className="reviews-dock__comment">{review.comment}</p>

                        {review.status === 'hidden' && mine ? (
                          <p className="reviews-dock__hidden-note">
                            Ocultada por moderación: solo tú puedes verla.
                          </p>
                        ) : null}

                        {mine ? (
                          confirming ? (
                            <div className="reviews-dock__confirm" role="group" aria-label="Confirmar eliminación">
                              <span>¿Eliminar esta reseña?</span>
                              <button
                                type="button"
                                className="reviews-dock__danger"
                                onClick={() => void confirmDelete(review)}
                                disabled={deletingId === review.id}
                              >
                                {deletingId === review.id ? 'Eliminando…' : 'Sí, eliminar'}
                              </button>
                              <button type="button" className="reviews-dock__link" onClick={() => setConfirmDeleteId(null)}>
                                Cancelar
                              </button>
                            </div>
                          ) : (
                            <div className="reviews-dock__own-actions">
                              <button type="button" className="reviews-dock__link" onClick={() => startEdit(review)}>
                                <Pencil size={14} aria-hidden="true" /> Editar
                              </button>
                              <button
                                type="button"
                                className="reviews-dock__link reviews-dock__link--danger"
                                onClick={() => {
                                  setConfirmDeleteId(review.id)
                                  setFeedError('')
                                }}
                              >
                                <Trash2 size={14} aria-hidden="true" /> Eliminar
                              </button>
                            </div>
                          )
                        ) : null}
                      </article>
                    </li>
                  )
                })}
              </ul>
            )}

            {paged && hasMore ? (
              <button
                type="button"
                className="reviews-dock__more"
                onClick={() => void loadMore()}
                disabled={loadingMore}
                aria-busy={loadingMore}
              >
                {loadingMore ? 'Cargando…' : 'Ver más reseñas'}
              </button>
            ) : null}
          </>
        )}
      </section>
    </div>
  )
}

/** Foto del autor; si no hay o falla, inicial en dorado. */
function Avatar({ name, url }: { name: string; url: string | null }) {
  const [failed, setFailed] = useState(false)
  const initial = (name.trim().charAt(0) || '?').toUpperCase()
  return (
    <span className="reviews-dock__avatar" aria-hidden="true">
      {url && !failed ? (
        <img src={url} alt="" width={28} height={28} loading="lazy" referrerPolicy="no-referrer" onError={() => setFailed(true)} />
      ) : (
        initial
      )}
    </span>
  )
}
