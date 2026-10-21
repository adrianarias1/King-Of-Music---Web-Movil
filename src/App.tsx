
import { lazy, Suspense } from 'react'

import {
  heroAsset,
  heroVideoAsset,
  mapAsset,
  trailerAsset,
  trailerPosterAsset,
} from './config'

// =========================================================
// KING OF MUSIC — WEB / MÓVIL
//
// Framework: React + TypeScript
// Estilos: CSS
// Animaciones: GSAP + ScrollTrigger + Motion
// Aplicación móvil: Capacitor 8
//
// Experiencia: Landing page cinematográfica
// controlada mediante scroll.
// =========================================================

// Componentes de navegación
import { Header } from './components/layout/Header'
import { Footer } from './components/layout/Footer'

// Secciones de la landing page
import { Hero } from './components/sections/Hero'
import { Trailer } from './components/sections/Trailer'
import { CharacterCollage } from './components/sections/CharacterCollage'
import { Storyboard } from './components/sections/Storyboard'
import { GameMap } from './components/sections/GameMap'
import { BehindTheGame } from './components/sections/BehindTheGame'
import { TeamSection } from './components/sections/Team'
import { DownloadCTA } from './components/sections/DownloadCTA'

// Manejo de errores
import { ErrorBoundary } from './components/ui/ErrorBoundary'

// =========================================================
// CARGA DIFERIDA DEL VISOR 3D
//
// Three.js y React Three Fiber se mantienen separados
// del bundle principal para optimizar el rendimiento.
// =========================================================

const CharacterViewer = lazy(() =>
  import('./components/three/CharacterViewer').then((module) => ({
    default: module.CharacterViewer,
  })),
)

// =========================================================
// COMPONENTE DE CARGA TEMPORAL
// =========================================================

function SectionFallback() {
  return (
    <div
      className="section theme-dark"
      aria-hidden="true"
    >
      <div className="container">
        <div className="loader">
          <span className="spinner" />
        </div>
      </div>
    </div>
  )
}

// =========================================================
// APLICACIÓN PRINCIPAL
// =========================================================

export default function App() {
  return (
    <>
      {/* Accesibilidad: salto al contenido principal */}

      <a className="skip-link" href="#contenido">
        Saltar al contenido principal
      </a>

      {/* Navegación superior */}

      <Header />

      <main id="contenido">

        {/* =================================================
            01. HERO CINEMATOGRÁFICO

            Introducción a King of Music.

            GSAP controla:
            - Animación inicial del recorrido.
            - Aparición del isotipo.
            - Acercamiento a la Piedra del Sol.
            - Apertura del portal hacia el tráiler.
            ================================================= */}

        <Hero
          heroImage={heroAsset}
          heroVideo={heroVideoAsset}
        />

        {/* =================================================
            02. TRÁILER OFICIAL

            Destino del portal cinematográfico.

            El reproductor aparecerá inmediatamente
            después de terminar la animación del Hero.
            ================================================= */}

        <Trailer
          videoSrc={trailerAsset}
          posterSrc={trailerPosterAsset}
        />

        {/* =================================================
            03. COLLAGE DE PERSONAJES

            Presentación visual de los luchadores.
            ================================================= */}

        <CharacterCollage />

        {/* =================================================
            04. VISOR DE PERSONAJES 3D

            Carga diferida mediante React.lazy.
            ================================================= */}

        <ErrorBoundary label="El visor 3D no pudo cargar">
          <Suspense fallback={<SectionFallback />}>
            <CharacterViewer />
          </Suspense>
        </ErrorBoundary>

        {/* =================================================
            05. HISTORIA Y STORYBOARD
            ================================================= */}

        <Storyboard />

        {/* =================================================
            06. MAPA DEL VIDEOJUEGO
            ================================================= */}

        <GameMap mapImage={mapAsset} />

        {/* =================================================
            07. DETRÁS DEL JUEGO
            ================================================= */}

        <BehindTheGame />

        {/* =================================================
            08. EQUIPO DE DESARROLLO
            ================================================= */}

        <TeamSection />

        {/* =================================================
            09. DESCARGA DEL VIDEOJUEGO
            ================================================= */}

        <DownloadCTA />

        {/* =================================================
            FUTURA IMPLEMENTACIÓN

            Sección de opiniones y reseñas.

            - Supabase Auth
            - Inicio de sesión con Google
            - Almacenamiento de comentarios
            - Consulta de opiniones
            ================================================= */}

      </main>

      {/* Pie de página */}

      <Footer />
    </>
  )
}
