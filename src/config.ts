/* ==========================================================================
   KING OF MUSIC — Configuración de la aplicación
   Punto único de control para el CTA de descarga y datos globales.
   Los textos visibles van en los dos idiomas (tipo L, ver src/i18n).
   ========================================================================== */

import type { L } from './i18n/types'

export const siteConfig = {
  name: 'King of Music',
  shortName: 'KOM',
  tagline: {
    es: 'Un videojuego de combate inspirado en la escena musical mexicana.',
    en: 'A fighting game inspired by the Mexican music scene.',
  } satisfies L,
  description: {
    es: 'King of Music es un videojuego de combate inspirado en la escena musical mexicana. Explora a los artistas, conoce sus habilidades y descubre los escenarios del juego.',
    en: 'King of Music is a fighting game inspired by the Mexican music scene. Explore the artists, learn their abilities and discover the game\'s stages.',
  } satisfies L,
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
  comingSoonLabel: { es: 'Próximamente', en: 'Coming soon' } satisfies L,
} as const


/* =========================================================
   KING OF MUSIC — RECURSOS MULTIMEDIA
   ========================================================= */

// PORTADA PRINCIPAL

export const heroAsset: string | undefined = '/images/poster-hero.webp'

/** Versión ligera del póster para pantallas pequeñas (srcset). */
export const heroMobileAsset = '/images/poster-hero-mobile.webp'

export const heroVideoAsset: string | undefined = undefined

// IDENTIDAD Y PORTAL

export const gameLogoAsset = '/images/king-of-music-logo.webp'

/** Logo pequeño para header y diálogos (40–72 px). */
export const gameLogoSmallAsset = '/images/king-of-music-logo-sm.webp'

export const portalImageAsset = '/images/imagen-hero.jpeg'

// TRÁILER

export const trailerAsset = '/videos/trailer.mp4'

export const trailerPosterAsset = '/images/imagen-hero.jpeg'

// MAPA

export const mapAsset: string | undefined =
  '/images/map.webp'


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