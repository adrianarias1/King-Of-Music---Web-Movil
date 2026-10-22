import { useEffect, useId, useState } from 'react'
import type { FormEvent } from 'react'
import { Star } from 'lucide-react'
import { localReviewRepository, validateReview } from './repository'
import type { Review, ReviewRepository, ReviewSection } from './repository'
import './Reviews.css'

interface Props {
  section: ReviewSection
  title: string
  subjects?: { id: string; name: string; section?: ReviewSection }[]
  repository?: ReviewRepository
}

export function Reviews({ section, title, subjects, repository = localReviewRepository }: Props) {
  const [subjectId, setSubjectId] = useState(subjects?.[0]?.id ?? 'general')
  const targetSection = subjects?.find(subject => subject.id === subjectId)?.section ?? section
  return (
    <section className="reviews" aria-labelledby={`reviews-${section}`}>
      <div className="container">
        <div className="reviews__heading">
          <div><p className="label">La voz de la comunidad</p><h2 id={`reviews-${section}`}>Reseñas · {title}</h2></div>
          {subjects?.length ? <label className="reviews__subject">Qué quieres reseñar
            <select value={subjectId} onChange={e => setSubjectId(e.target.value)}>
              {subjects.map(subject => <option key={subject.id} value={subject.id}>{subject.name}</option>)}
            </select>
          </label> : null}
        </div>
        <p className="reviews__notice">Vista previa local: tus reseñas se guardan en este dispositivo y no se comparten con otros usuarios.</p>
        <ReviewPanel key={`${targetSection}:${subjectId}`} section={targetSection} subjectId={subjectId} repository={repository} />
      </div>
    </section>
  )
}

function ReviewPanel({ section, subjectId, repository }: { section: ReviewSection; subjectId: string; repository: ReviewRepository }) {
  const id = useId()
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState(false)
  const [retry, setRetry] = useState(0)
  const [authorName, setAuthorName] = useState('')
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [sort, setSort] = useState('recent')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    let active = true
    repository.list({ section, subjectId }).then(data => {
      if (active) setReviews(data)
    }).catch(() => { if (active) setLoadError(true) }).finally(() => { if (active) setLoading(false) })
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
      setReviews(current => [...current, review])
      setComment('')
      setRating(0)
      setSuccess('Tu reseña se guardó en este dispositivo.')
    } catch {
      setError('No pudimos guardar tu reseña. Comprueba que el almacenamiento esté disponible e inténtalo de nuevo. Tu texto se conserva.')
    } finally { setSaving(false) }
  }

  const average = reviews.length ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1) : '—'
  const sorted = [...reviews].sort((a, b) => sort === 'best'
    ? b.rating - a.rating || Date.parse(b.createdAt) - Date.parse(a.createdAt)
    : Date.parse(b.createdAt) - Date.parse(a.createdAt))

  return <div className="reviews__grid">
    <form className="reviews__form" onSubmit={submit} aria-describedby={`${id}-error`}>
      <h3>Comparte tu opinión</h3>
      <label htmlFor={`${id}-name`}>Nombre para mostrar</label>
      <input id={`${id}-name`} value={authorName} onChange={e => setAuthorName(e.target.value)} autoComplete="nickname" required minLength={2} maxLength={50} placeholder="Cómo quieres aparecer" />
      <fieldset className="reviews__rating" disabled={saving}>
        <legend>Tu calificación</legend>
        <div>{[1, 2, 3, 4, 5].map(value => <label key={value} className={value <= rating ? 'is-selected' : ''}>
          <input type="radio" name={`${id}-rating`} value={value} checked={rating === value} onChange={() => setRating(value)} required />
          <Star size={26} fill={value <= rating ? 'currentColor' : 'none'} aria-hidden="true" />
          <span className="sr-only">{value} {value === 1 ? 'estrella' : 'estrellas'}</span>
        </label>)}</div>
      </fieldset>
      <label htmlFor={`${id}-comment`}>Tu reseña</label>
      <textarea id={`${id}-comment`} value={comment} onChange={e => setComment(e.target.value)} required minLength={10} maxLength={1000} rows={5} placeholder="¿Qué te gustó? ¿Qué mejorarías?" aria-describedby={`${id}-count`} />
      <small id={`${id}-count`}>{comment.length}/1000 caracteres · mínimo 10</small>
      <p id={`${id}-error`} role="alert" className="reviews__error">{error}</p>
      <p role="status">{success}</p>
      <button className="reviews__submit" type="submit" disabled={saving || loading || loadError}>{saving ? 'Guardando…' : 'Guardar reseña'}</button>
    </form>
    <div className="reviews__feed" aria-busy={loading}>
      {loading ? <p role="status">Cargando reseñas…</p> : loadError ? <div role="alert"><p>No pudimos leer las reseñas guardadas. No se modificó su contenido.</p><button className="reviews__retry" onClick={() => { setLoading(true); setLoadError(false); setRetry(value => value + 1) }}>Reintentar</button></div> : <>
        <div className="reviews__summary"><div><strong>{average} <span aria-hidden="true">★</span></strong><p>{reviews.length} {reviews.length === 1 ? 'reseña' : 'reseñas'}</p></div>
          <label>Ordenar por<select value={sort} onChange={e => setSort(e.target.value)}><option value="recent">Más recientes</option><option value="best">Mejor calificación</option></select></label>
        </div>
        {!reviews.length ? <div className="reviews__empty"><Star size={32} aria-hidden="true" /><h3>Tu opinión abre la conversación</h3><p>Aún no hay reseñas aquí. Comparte la primera.</p></div> : <ul className="reviews__list">{sorted.map(review => <li key={review.id}><article>
          <div className="reviews__byline"><strong>{review.authorName}</strong><time dateTime={review.createdAt}>{new Date(review.createdAt).toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: 'numeric' })}</time></div>
          <p className="reviews__stars" aria-label={`${review.rating} de 5 estrellas`}>{'★'.repeat(review.rating)}<span aria-hidden="true">{'☆'.repeat(5 - review.rating)}</span></p>
          <p className="reviews__comment">{review.comment}</p>
        </article></li>)}</ul>}
      </>}
    </div>
  </div>
}
