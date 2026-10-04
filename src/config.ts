/* ==========================================================================
   KING OF MUSIC — Configuración de la aplicación
   Punto único de control para el CTA de descarga y datos globales.
   ========================================================================== */

export const siteConfig = {
  name: 'King of Music',
  shortName: 'KOM',
  tagline: 'Un videojuego de combate inspirado en la escena musical mexicana.',
  description:
    'King of Music es un videojuego de combate inspirado en la escena musical mexicana. Explora a los artistas, conoce sus habilidades y descubre los escenarios del juego.',
  repository: 'https://github.com/adrianarias1/King-Of-Music---Web-Movil',
  universityProject: true,
} as const

/* --------------------------------------------------------------------------
   DESCARGA / ANDROID
   --------------------------------------------------------------------------
   Para habilitar la descarga:
     1. Coloca el archivo en `public/downloads/`
        (por ejemplo `public/downloads/king-of-music.apk`)
     2. Define `download.url` con la ruta correcta
     3. Cambia `download.available` a `true`

   Mientras `available` sea `false`, el CTA no apunta a ningún archivo
   inexistente y muestra el estado "Próximamente".
   -------------------------------------------------------------------------- */
export const download = {
  available: false,
  /** Ruta dentro de `public/`. Solo se usa si available === true. */
  url: './downloads/king-of-music.apk',
  platformLabel: 'Android',
  sizeLabel: '',
  /** Texto mostrado en el CTA cuando no hay build disponible. */
  comingSoonLabel: 'Próximamente',
} as const

/* --------------------------------------------------------------------------
   ASSETS
   Rutas declaradas aquí para que el reemplazo sea obvious.
   Usa `undefined` cuando el asset todavía no existe: los componentes
  shown placeholders y NO generan errores 404.
   -------------------------------------------------------------------------- */

/** Fondo del Hero. Reemplazar con public/images/hero.jpg */
export const heroAsset: string | undefined = undefined
/** Video de fondo del Hero (loop silencioso). Reemplazar con public/videos/hero.mp4 */
export const heroVideoAsset: string | undefined = undefined
/** Video del trailer. Reemplazar con public/videos/trailer.mp4 */
export const trailerAsset: string | undefined = undefined
/** Poster/thumbnail del trailer. Reemplazar con public/images/trailer-poster.jpg */
export const trailerPosterAsset: string | undefined = undefined
/** Imagen del mapa conceptual. Reemplazar con public/images/map.png */
export const mapAsset: string | undefined = '/images/map.png'

/** Puede sobrescribirse con window.KING_OF_MUSIC en builds nativos. */
declare global {
  interface Window {
    KING_OF_MUSIC?: Partial<{
      downloadUrl: string
      downloadAvailable: boolean
    }>
  }
}

const runtime = typeof window !== 'undefined' ? window.KING_OF_MUSIC : undefined

export const resolvedDownload = {
  available: runtime?.downloadAvailable ?? download.available,
  url: runtime?.downloadUrl ?? download.url,
  platformLabel: download.platformLabel,
  sizeLabel: download.sizeLabel,
  comingSoonLabel: download.comingSoonLabel,
} as const