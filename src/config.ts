/* ==========================================================================
   KING OF MUSIC — Configuración de la aplicación
   Punto único de control para el CTA de descarga y datos globales.
   Los textos visibles van en los dos idiomas (tipo L, ver src/i18n).
   ========================================================================== */

import type { L } from './i18n/types'
import { mediaUrl } from './lib/media'

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
   DESCARGAS: JUEGO (WINDOWS) Y APP MÓVIL (ANDROID)
   --------------------------------------------------------------------------
   Para activar un botón basta con poner su enlace en `url`:
     - Un enlace externo (GitHub Releases, Google Drive, Cloudflare R2…):
         url: 'https://…/KingOfMusic_Setup.exe'
     - O un archivo dentro de `public/downloads/`:
         url: './downloads/king-of-music.apk'

   Mientras `url` esté vacío, el botón aparece desactivado con el aviso
   "Próximamente" y nunca apunta a un archivo inexistente.
   -------------------------------------------------------------------------- */
export interface DownloadTarget {
  id: 'game' | 'app'
  /** Enlace de descarga. Vacío = "Próximamente". */
  url: string
  title: L
  description: L
  /** Plataforma y tamaño, p. ej. "Windows 10/11 · 64 bits · 154 MB". */
  details: L
}

export const downloads: DownloadTarget[] = [
  {
    id: 'game',
    // Instalador en Cloudflare R2 (ver src/lib/media.ts).
    url: mediaUrl('KingOfMusic_Setup.exe'),
    title: { es: 'Juego para PC', en: 'PC game' },
    description: {
      es: 'El torneo completo: campaña, versus local y los siete luchadores.',
      en: 'The full tournament: campaign, local versus and all seven fighters.',
    },
    details: {
      es: 'Windows 10/11 · 64 bits · instalador de 154 MB',
      en: 'Windows 10/11 · 64-bit · 154 MB installer',
    },
  },
  {
    id: 'app',
    url: '',
    title: { es: 'App para Android', en: 'Android app' },
    description: {
      es: 'Este sitio como app: personajes en 3D, historia, mapa y reseñas.',
      en: 'This site as an app: 3D characters, story, map and reviews.',
    },
    details: {
      es: 'Android · APK',
      en: 'Android · APK',
    },
  },
]

/** Texto del botón cuando todavía no hay enlace. */
export const comingSoonLabel: L = { es: 'Próximamente', en: 'Coming soon' }


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

// Tráiler oficial y su miniatura en Cloudflare R2 (ver src/lib/media.ts).
export const trailerAsset = mediaUrl('Trailer Oficial.mp4')

export const trailerPosterAsset = mediaUrl('Miniatura trailer.png')

// MAPA

export const mapAsset: string | undefined =
  '/images/map.webp'
