/* ==========================================================================
   Reseñas — validación compartida (formulario y pruebas)
   --------------------------------------------------------------------------
   Las mismas reglas existen en la base de datos (public.reviews y
   private.normalize_review_comment). El formulario avisa antes de enviar;
   la base de datos es la última palabra.
   ========================================================================== */

export type ReviewSection = 'juego' | 'personajes' | 'escenarios' | 'mapa'

export const REVIEW_SECTIONS: readonly ReviewSection[] = ['juego', 'personajes', 'escenarios', 'mapa']

export const COMMENT_MIN = 10
export const COMMENT_MAX = 1000
export const RATING_MIN = 1
export const RATING_MAX = 5

export interface ReviewDraft {
  section: ReviewSection | string
  subjectId: string
  rating: number
  comment: string
}

/** Motivo de cada error. El texto se traduce en la interfaz
 *  (t.reviews.validation). */
export interface ReviewErrors {
  subject?: 'missing'
  rating?: 'invalid'
  comment?: 'empty' | 'symbols' | 'short' | 'long'
}

/**
 * Normaliza el comentario igual que el servidor:
 * saltos de línea uniformes, sin espacios al final de las líneas,
 * máximo una línea en blanco seguida, sin espacios dobles y recortado.
 */
export function normalizeComment(value: string): string {
  return (value ?? '')
    .replace(/\r\n?/g, '\n')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/[ \t]{2,}/g, ' ')
    .replace(/^[ \t\n]+|[ \t\n]+$/g, '')
}

/** Valida un borrador. Devuelve un código por campo (sin código = válido). */
export function validateReviewDraft(draft: ReviewDraft): ReviewErrors {
  const errors: ReviewErrors = {}

  if (!REVIEW_SECTIONS.includes(draft.section as ReviewSection) || !draft.subjectId.trim()) {
    errors.subject = 'missing'
  }

  if (!Number.isInteger(draft.rating) || draft.rating < RATING_MIN || draft.rating > RATING_MAX) {
    errors.rating = 'invalid'
  }

  const comment = normalizeComment(draft.comment)
  if (!comment) {
    errors.comment = 'empty'
  } else if (!/[\p{L}\p{N}]/u.test(comment)) {
    errors.comment = 'symbols'
  } else if (comment.length < COMMENT_MIN) {
    errors.comment = 'short'
  } else if (comment.length > COMMENT_MAX) {
    errors.comment = 'long'
  }

  return errors
}

export function hasErrors(errors: ReviewErrors): boolean {
  return Boolean(errors.subject || errors.rating || errors.comment)
}
