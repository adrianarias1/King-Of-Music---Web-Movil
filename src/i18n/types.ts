/* ==========================================================================
   KING OF MUSIC — Tipos de idioma
   ========================================================================== */

/** Idiomas disponibles en el sitio. */
export const LANGS = ['es', 'en'] as const
export type Lang = (typeof LANGS)[number]

/**
 * Texto traducido. Todo texto que vea el usuario en los datos
 * (src/data/*) se escribe así: { es: '…', en: '…' }.
 * TypeScript no compila si falta alguno de los dos idiomas.
 */
export type L = Readonly<Record<Lang, string>>

/** Configuración regional de cada idioma (fechas y números). */
export const LOCALES: Record<Lang, string> = {
  es: 'es-MX',
  en: 'en-US',
}
