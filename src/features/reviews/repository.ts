import { supabase } from '../../lib/supabase'
import { normalizeComment } from './validation'
import type { ReviewSection } from './validation'

/* ==========================================================================
   Reseñas — acceso a datos (Supabase, tabla public.reviews)
   --------------------------------------------------------------------------
   Seguridad (RLS + permisos por columna en la base de datos):
     - Leer: cualquiera, solo reseñas publicadas (el autor ve también las
       suyas ocultas por moderación).
     - Crear: usuario con sesión; autor, nombre y foto los pone el servidor.
     - Editar: solo el autor, y solo rating y comment.
     - Borrar: solo el autor.
     - Anti-spam: máximo 5 reseñas por minuto por usuario.
   ========================================================================== */

export type { ReviewSection }

export interface Review {
  id: string
  userId: string
  section: ReviewSection
  subjectId: string
  rating: number
  comment: string
  authorName: string
  authorAvatarUrl: string | null
  status: 'published' | 'hidden'
  /** Desde dónde se publicó: "Estado, País" (opcional). */
  location: string | null
  createdAt: string
  updatedAt: string
  /** true si se editó después de publicarse. */
  edited: boolean
}

export interface ReviewTarget {
  section: ReviewSection
  subjectId: string
}

export interface ReviewContent {
  rating: number
  comment: string
}

export type ReviewInput = ReviewTarget & ReviewContent & {
  /** "Estado, País" o null si el usuario no compartió su ubicación. */
  location?: string | null
}

export type ReviewErrorCode = 'auth' | 'rate_limit' | 'validation' | 'not_found' | 'network' | 'unknown'

export class ReviewError extends Error {
  readonly code: ReviewErrorCode

  constructor(code: ReviewErrorCode, message: string) {
    super(message)
    this.name = 'ReviewError'
    this.code = code
  }
}

/** Página de la vista general (últimas reseñas de toda la comunidad). */
export interface ReviewPage {
  reviews: Review[]
  hasMore: boolean
}

export interface ReviewStats {
  total: number
  /** null si aún no hay reseñas. */
  average: number | null
}

export interface ReviewRepository {
  list(target: ReviewTarget): Promise<Review[]>
  /**
   * Últimas reseñas publicadas (de todo, o solo de `sections`);
   * `after` = última reseña cargada, para paginar.
   */
  listRecent(options: { limit: number; after?: Review; sections?: readonly ReviewSection[] }): Promise<ReviewPage>
  /** Total y promedio de las reseñas publicadas (de todo o de `sections`). */
  stats(sections?: readonly ReviewSection[]): Promise<ReviewStats>
  create(input: ReviewInput): Promise<Review>
  update(id: string, content: ReviewContent): Promise<Review>
  remove(id: string): Promise<void>
}

// Las reseñas de la versión local (solo navegador) eran de prueba y no
// tienen autor verificado: se descartan.
try {
  globalThis.localStorage?.removeItem('king-of-music:reviews:v1')
} catch {
  // Almacenamiento no disponible: nada que limpiar.
}

const COLUMNS =
  'id, user_id, section, subject_id, rating, comment, author_name, author_avatar_url, status, location, created_at, updated_at'

interface ReviewRow {
  id: string
  user_id: string
  section: ReviewSection
  subject_id: string
  rating: number
  comment: string
  author_name: string
  author_avatar_url: string | null
  status: 'published' | 'hidden'
  location: string | null
  created_at: string
  updated_at: string
}

function toReview(row: ReviewRow): Review {
  return {
    id: row.id,
    userId: row.user_id,
    section: row.section,
    subjectId: row.subject_id,
    rating: row.rating,
    comment: row.comment,
    authorName: row.author_name,
    authorAvatarUrl: row.author_avatar_url,
    status: row.status,
    location: row.location ?? null,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    // Margen de 1 s: inserción y fecha de edición se generan juntas.
    edited: Date.parse(row.updated_at) - Date.parse(row.created_at) > 1000,
  }
}

/** Traduce errores de Supabase/Postgres a mensajes para el usuario. */
function toReviewError(error: { message?: string; code?: string; details?: string } | null | undefined): ReviewError {
  const message = `${error?.message ?? ''} ${error?.details ?? ''}`
  const code = error?.code ?? ''

  if (/KOM_RATE_LIMIT/.test(message)) {
    return new ReviewError('rate_limit', 'Publicaste varias reseñas seguidas. Espera un minuto antes de escribir otra.')
  }
  if (/KOM_AUTH_REQUIRED|JWT|not authenticated/i.test(message) || code === '42501' || code === 'PGRST301') {
    return new ReviewError('auth', 'Tu sesión expiró. Inicia sesión de nuevo para continuar.')
  }
  if (code === '23514' || code === '23503' || code === '22P02') {
    return new ReviewError('validation', 'La reseña no cumple los requisitos. Revisa la calificación y el texto.')
  }
  if (code === 'PGRST116') {
    return new ReviewError('not_found', 'Esta reseña ya no existe o no te pertenece.')
  }
  if (/Failed to fetch|NetworkError|network/i.test(message)) {
    return new ReviewError('network', 'No hay conexión con el servidor. Revisa tu internet e inténtalo de nuevo.')
  }
  return new ReviewError('unknown', 'Ocurrió un error inesperado. Inténtalo de nuevo.')
}

export const supabaseReviewRepository: ReviewRepository = {
  async list({ section, subjectId }) {
    const { data, error } = await supabase
      .from('reviews')
      .select(COLUMNS)
      .eq('section', section)
      .eq('subject_id', subjectId)
      .order('created_at', { ascending: false })
      .limit(200)
    if (error) throw toReviewError(error)
    return (data as ReviewRow[]).map(toReview)
  },

  async listRecent({ limit, after, sections }) {
    let query = supabase
      .from('reviews')
      .select(COLUMNS)
      .eq('status', 'published')
      .order('created_at', { ascending: false })
      .order('id', { ascending: false })
      .limit(limit + 1)

    if (sections?.length) query = query.in('section', [...sections])

    // Paginación por cursor (fecha + id): estable aunque lleguen reseñas nuevas.
    if (after) {
      query = query.or(
        // Fechas entre comillas: contienen ".", ":" y "+".
        `created_at.lt."${after.createdAt}",and(created_at.eq."${after.createdAt}",id.lt.${after.id})`,
      )
    }

    const { data, error } = await query
    if (error) throw toReviewError(error)
    const rows = (data as ReviewRow[]).map(toReview)
    return { reviews: rows.slice(0, limit), hasMore: rows.length > limit }
  },

  async stats(sections) {
    const { data, error } = await supabase
      .rpc('review_stats', sections?.length ? { sections: [...sections] } : {})
      .single()
    if (error) throw toReviewError(error)
    const row = data as { total: number; average: number | string | null }
    const average = row.average === null ? null : Number(row.average)
    return { total: row.total ?? 0, average: Number.isFinite(average) ? average : null }
  },

  async create({ section, subjectId, rating, comment, location }) {
    const { data, error } = await supabase
      .from('reviews')
      .insert({
        section,
        subject_id: subjectId,
        rating,
        comment: normalizeComment(comment),
        location: location ?? null,
      })
      .select(COLUMNS)
      .single()
    if (error) throw toReviewError(error)
    return toReview(data as ReviewRow)
  },

  async update(id, { rating, comment }) {
    const { data, error } = await supabase
      .from('reviews')
      .update({ rating, comment: normalizeComment(comment) })
      .eq('id', id)
      .select(COLUMNS)
      .single()
    if (error) throw toReviewError(error)
    return toReview(data as ReviewRow)
  },

  async remove(id) {
    const { data, error } = await supabase.from('reviews').delete().eq('id', id).select('id')
    if (error) throw toReviewError(error)
    if (!data || data.length === 0) {
      throw new ReviewError('not_found', 'Esta reseña ya no existe o no te pertenece.')
    }
  },
}
