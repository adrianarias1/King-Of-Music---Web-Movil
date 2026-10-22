export type ReviewSection = 'mapa' | 'escenarios' | 'personajes' | 'nosotros'

export interface ReviewTarget {
  section: ReviewSection
  subjectId: string
}

export interface Review extends ReviewTarget {
  id: string
  authorName: string
  rating: number
  comment: string
  createdAt: string
}

export type NewReview = Omit<Review, 'id' | 'createdAt'>

// A future remote adapter must derive author identity from the authenticated
// session and enforce validation/permissions server-side, never trust this name.
export interface ReviewRepository {
  list(target: ReviewTarget): Promise<Review[]>
  create(input: NewReview): Promise<Review>
}

const STORAGE_KEY = 'king-of-music:reviews:v1'
const sections: ReviewSection[] = ['mapa', 'escenarios', 'personajes', 'nosotros']

function isReview(value: unknown): value is Review {
  if (!value || typeof value !== 'object') return false
  const r = value as Partial<Review>
  return typeof r.id === 'string' && typeof r.subjectId === 'string' &&
    sections.includes(r.section as ReviewSection) &&
    typeof r.authorName === 'string' && r.authorName.trim().length >= 2 && r.authorName.length <= 50 &&
    Number.isInteger(r.rating) && Number(r.rating) >= 1 && Number(r.rating) <= 5 &&
    typeof r.comment === 'string' && r.comment.trim().length >= 10 && r.comment.length <= 1000 &&
    typeof r.createdAt === 'string' && Number.isFinite(Date.parse(r.createdAt))
}

function read(): Review[] {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) return []
  const data: unknown = JSON.parse(raw)
  if (!Array.isArray(data) || !data.every(isReview)) {
    throw new Error('Invalid review storage')
  }
  return data
}

export function validateReview(input: NewReview): string | null {
  if (!sections.includes(input.section) || !input.subjectId.trim()) return 'Selecciona qué quieres reseñar.'
  if (input.authorName.trim().length < 2 || input.authorName.trim().length > 50) return 'Escribe un nombre de entre 2 y 50 caracteres.'
  if (!Number.isInteger(input.rating) || input.rating < 1 || input.rating > 5) return 'Selecciona una calificación de 1 a 5 estrellas.'
  if (input.comment.trim().length < 10 || input.comment.trim().length > 1000) return 'Escribe un comentario de entre 10 y 1000 caracteres.'
  return null
}

export const localReviewRepository: ReviewRepository = {
  async list(target) {
    return read().filter(r => r.section === target.section && r.subjectId === target.subjectId)
  },
  async create(input) {
    const error = validateReview(input)
    if (error) throw new Error(error)
    const review: Review = {
      ...input,
      authorName: input.authorName.trim(),
      comment: input.comment.trim(),
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    }
    const reviews = read()
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...reviews, review]))
    return review
  },
}
