// =====================================================================
// KING OF MUSIC — Revisión de traducciones (npm run check:i18n)
//
// Se ejecuta antes de cada build. Falla si encuentra texto visible
// escrito directamente en un componente en lugar de venir de las
// traducciones (src/i18n/messages/es.ts y en.ts) o de los datos
// bilingües { es, en } de src/data.
//
// Detecta:
//   1. Texto dentro de JSX:            <p>Hola</p>
//   2. Atributos de texto en JSX:       aria-label="Cerrar", alt=`Foto de ${x}`
//   3. Cualquier cadena con acentos, ñ, ¿ o ¡ fuera de src/i18n y src/data
//      (casi siempre es texto en español sin traducir).
//
// Lo que no se traduce a propósito (nombres propios, marca) va en
// ALLOWED_TEXT. Los mensajes de consola y los errores internos se ignoran.
//
// Además comprueba que es.ts y en.ts tengan exactamente las mismas claves
// (TypeScript ya lo exige; esto da un mensaje más claro).
// =====================================================================

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import ts from 'typescript'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const SRC = path.join(ROOT, 'src')

/** Textos que se muestran igual en los dos idiomas (marca, nombres). */
const ALLOWED_TEXT = new Set(['King', 'of', 'Music', 'KING OF MUSIC', 'King of Music', 'GitHub', 'ES', 'EN', '+', '0', '/', '·', '—', '&copy;', '©'])

/** Atributos JSX cuyo valor ve (o escucha) el usuario. */
const TEXT_ATTRS = new Set([
  'aria-label', 'aria-description', 'aria-valuetext', 'aria-roledescription', 'aria-placeholder',
  'title', 'alt', 'placeholder', 'label', 'description', 'caption', 'lead', 'eyebrow', 'tagline',
  'placeholderLabel', 'closeLabel', 'message', 'text', 'heading', 'subtitle',
])

/** Carpetas cuyo texto ya está obligado por tipos a tener es y en. */
const SKIP_DIRS = [path.join(SRC, 'i18n'), path.join(SRC, 'data')]

const SPANISH = /[áéíóúüñÁÉÍÓÚÜÑ¿¡]/
const HAS_WORD = /\p{L}{2,}/u

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      if (!SKIP_DIRS.includes(full)) walk(full, out)
    } else if (/\.(tsx?|mts)$/.test(entry.name) && !/\.d\.ts$/.test(entry.name)) {
      out.push(full)
    }
  }
  return out
}

/** Partes literales de una cadena o plantilla (sin las expresiones ${}). */
function literalText(node) {
  if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) return node.text
  if (ts.isTemplateExpression(node)) {
    return [node.head.text, ...node.templateSpans.map((span) => span.literal.text)].join(' ')
  }
  return null
}

/** true si el nodo está dentro de console.*(), throw new Error() o un import. */
function isDeveloperOnly(node) {
  for (let p = node.parent; p; p = p.parent) {
    if (ts.isImportDeclaration(p) || ts.isExportDeclaration(p)) return true
    if (ts.isCallExpression(p) && /^console\./.test(p.expression.getText())) return true
    if (ts.isNewExpression(p) && /Error$/.test(p.expression.getText())) return true
    if (ts.isThrowStatement(p)) return true
  }
  return false
}

function isAllowed(text) {
  const clean = text.replace(/\s+/g, ' ').trim()
  return !clean || ALLOWED_TEXT.has(clean) || !HAS_WORD.test(clean)
}

const problems = []

for (const file of walk(SRC)) {
  const code = fs.readFileSync(file, 'utf8')
  const kind = file.endsWith('x') ? ts.ScriptKind.TSX : ts.ScriptKind.TS
  const source = ts.createSourceFile(file, code, ts.ScriptTarget.Latest, true, kind)
  const report = (node, text, why) => {
    const { line } = source.getLineAndCharacterOfPosition(node.getStart())
    problems.push(`${path.relative(ROOT, file)}:${line + 1}  ${why}: "${text.replace(/\s+/g, ' ').trim().slice(0, 80)}"`)
  }

  const visit = (node) => {
    if (ts.isJsxText(node)) {
      if (!isAllowed(node.text)) report(node, node.text, 'texto en JSX')
    } else if (ts.isJsxAttribute(node) && node.initializer) {
      const name = node.name.getText()
      if (TEXT_ATTRS.has(name) || /(Label|Text|Title)$/.test(name)) {
        let value = node.initializer
        if (ts.isJsxExpression(value)) value = value.expression
        const text = value ? literalText(value) : null
        if (text !== null && !isAllowed(text)) report(node, text, `atributo ${name}`)
      }
    } else {
      const text = literalText(node)
      // { es: '…', en: '…' }: texto bilingüe, correcto.
      const bilingual =
        node.parent && ts.isPropertyAssignment(node.parent) && ['es', 'en'].includes(node.parent.name.getText())
      if (text !== null && SPANISH.test(text) && !bilingual && !isDeveloperOnly(node)) {
        report(node, text, 'cadena en español')
      }
    }
    ts.forEachChild(node, visit)
  }
  visit(source)
}

// --- Mismas claves en los dos idiomas ---------------------------------
async function compareKeys() {
  // Node 22+ ejecuta .ts directamente (los archivos de mensajes no
  // importan nada en tiempo de ejecución).
  const load = (name) => import(pathToFileURL(path.join(SRC, 'i18n', 'messages', name)).href)
  let es, en
  try {
    ;[{ es }, { en }] = await Promise.all([load('es.ts'), load('en.ts')])
  } catch {
    // Node sin soporte para .ts: TypeScript (tsc -b) ya exige las mismas claves.
    console.warn('i18n: comparación de claves omitida (esta versión de Node no ejecuta .ts).')
    return
  }
  const keys = (obj, prefix = '') =>
    Object.entries(obj).flatMap(([k, v]) =>
      v && typeof v === 'object' ? keys(v, `${prefix}${k}.`) : [`${prefix}${k}`],
    )
  const get = (obj, key) => key.split('.').reduce((o, part) => o?.[part], obj)
  const esKeys = new Set(keys(es))
  const enKeys = new Set(keys(en))
  for (const k of esKeys) if (!enKeys.has(k)) problems.push(`src/i18n/messages/en.ts  falta la clave "${k}"`)
  for (const k of enKeys) if (!esKeys.has(k)) problems.push(`src/i18n/messages/es.ts  sobra la clave "${k}"`)
  for (const k of enKeys) {
    if (get(en, k) === '') problems.push(`src/i18n/messages/en.ts  "${k}" está vacía`)
    if (typeof get(es, k) !== typeof get(en, k)) problems.push(`src/i18n/messages/en.ts  "${k}" no es del mismo tipo que en es.ts`)
  }
}

if (process.argv.includes('--skip-keys')) {
  // Solo revisión de componentes.
} else {
  await compareKeys()
}

if (problems.length) {
  console.error(`\n✖ Traducciones: ${problems.length} texto(s) sin traducir.\n`)
  for (const problem of problems) console.error(`  ${problem}`)
  console.error(
    '\nAgrega el texto a src/i18n/messages/es.ts y en.ts (o usa { es, en } en src/data)' +
      ' y muéstralo con useI18n(). Ver docs/I18N.md.\n',
  )
  process.exit(1)
}
console.log('✔ Traducciones: todo el texto visible está en español e inglés.')
