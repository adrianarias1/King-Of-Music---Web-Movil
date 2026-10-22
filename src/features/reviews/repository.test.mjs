import { test, beforeEach } from 'node:test'
import assert from 'node:assert/strict'
import { localReviewRepository as repository, validateReview } from './repository.ts'

let storage
beforeEach(() => {
  storage = new Map()
  Object.defineProperty(globalThis, 'localStorage', { configurable: true, value: {
    getItem: key => storage.get(key) ?? null,
    setItem: (key, value) => storage.set(key, value),
  } })
})
const input = { section: 'mapa', subjectId: 'general', authorName: '  Ana  ', rating: 4, comment: '  Me gusta la distribución del mapa.  ' }

test('persists normalized reviews and isolates sections and subjects', async () => {
  const saved = await repository.create(input)
  assert.equal(saved.authorName, 'Ana')
  assert.equal(saved.comment, 'Me gusta la distribución del mapa.')
  assert.ok(saved.id)
  assert.ok(Number.isFinite(Date.parse(saved.createdAt)))
  assert.deepEqual(await repository.list(input), [saved])
  assert.deepEqual(await repository.list({ section: 'nosotros', subjectId: 'general' }), [])
  assert.deepEqual(await repository.list({ section: 'mapa', subjectId: 'other' }), [])
})
test('rejects invalid ratings, blank names and short/oversized comments without writing', async () => {
  for (const change of [{ rating: 0 }, { rating: 6 }, { rating: 2.5 }, { authorName: '  ' }, { comment: 'hola' }, { comment: 'x'.repeat(1001) }]) {
    const invalid = { ...input, ...change }
    assert.ok(validateReview(invalid))
    await assert.rejects(repository.create(invalid))
  }
  assert.equal(storage.size, 0)
})
test('corrupt data is reported and never silently overwritten', async () => {
  storage.set('king-of-music:reviews:v1', '{broken')
  await assert.rejects(repository.list(input))
  await assert.rejects(repository.create(input))
  assert.equal(storage.get('king-of-music:reviews:v1'), '{broken')
})
test('storage write failures propagate rather than claiming success', async () => {
  globalThis.localStorage.setItem = () => { throw new Error('Quota exceeded') }
  await assert.rejects(repository.create(input), /Quota exceeded/)
})
