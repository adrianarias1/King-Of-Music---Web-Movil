import { test } from 'node:test'
import assert from 'node:assert/strict'
import { normalizeComment, validateReviewDraft, hasErrors } from './validation.ts'

const valid = { section: 'personajes', subjectId: 'juan-grabriel', rating: 5, comment: 'Me encanta su voz y su estilo.' }

test('normaliza espacios y saltos de línea igual que el servidor', () => {
  assert.equal(normalizeComment('   Muy   buen personaje.\r\n\r\n\r\n\r\nMe encanta.   '), 'Muy buen personaje.\n\nMe encanta.')
  assert.equal(normalizeComment('linea con espacios   \nsiguiente'), 'linea con espacios\nsiguiente')
  assert.equal(normalizeComment('\n\n   \t  \n'), '')
})

test('acepta una reseña válida', () => {
  assert.equal(hasErrors(validateReviewDraft(valid)), false)
})

test('rechaza calificaciones fuera de 1 a 5 o no enteras', () => {
  for (const rating of [0, 6, 2.5, Number.NaN]) {
    assert.ok(validateReviewDraft({ ...valid, rating }).rating)
  }
})

test('rechaza comentarios vacíos, solo espacios, solo símbolos, cortos o largos', () => {
  for (const comment of ['', '      \n\n   ', '!!!!!!!!!!!!!!', 'corto', 'x'.repeat(1001)]) {
    assert.ok(validateReviewDraft({ ...valid, comment }).comment, `debería rechazar: ${JSON.stringify(comment.slice(0, 20))}`)
  }
})

test('acepta reseñas sobre el juego en general', () => {
  assert.equal(hasErrors(validateReviewDraft({ ...valid, section: 'juego', subjectId: 'general' })), false)
})

test('exige categoría y elemento válidos', () => {
  assert.ok(validateReviewDraft({ ...valid, section: 'nosotros' }).subject)
  assert.ok(validateReviewDraft({ ...valid, subjectId: '   ' }).subject)
})

test('cuenta la longitud después de normalizar', () => {
  // 6 letras + muchos espacios: "abc def" (7) sigue siendo corto.
  assert.ok(validateReviewDraft({ ...valid, comment: '   abc        def      ' }).comment)
})
