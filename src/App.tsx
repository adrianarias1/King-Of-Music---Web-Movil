import { lazy, Suspense } from 'react'
import { heroAsset, heroVideoAsset, mapAsset, trailerAsset, trailerPosterAsset } from './config'
import { Header } from './components/layout/Header'
import { Footer } from './components/layout/Footer'
import { Hero } from './components/sections/Hero'
import { CharacterCollage } from './components/sections/CharacterCollage'
import { Trailer } from './components/sections/Trailer'
import { Storyboard } from './components/sections/Storyboard'
import { GameMap } from './components/sections/GameMap'
import { BehindTheGame } from './components/sections/BehindTheGame'
import { TeamSection } from './components/sections/Team'
import { DownloadCTA } from './components/sections/DownloadCTA'
import { ErrorBoundary } from './components/ui/ErrorBoundary'

/* --------------------------------------------------------------------------
   CARGA DIFERIDA
   El visor 3D arrastra Three.js (~600 kB). No debe entrar en el bundle
   inicial: se descarga solo cuando la seccion se acerca al viewport.
   -------------------------------------------------------------------------- */
const CharacterViewer = lazy(() =>
  import('./components/three/CharacterViewer').then((module) => ({
    default: module.CharacterViewer,
  })),
)

function SectionFallback() {
  return (
    <div className="section theme-dark" aria-hidden="true">
      <div className="container">
        <div className="loader">
          <span className="spinner" />
        </div>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <>
      <a className="skip-link" href="#contenido">
        Saltar al contenido principal
      </a>

      <Header />

      <main id="contenido">
        {/* 01. Hero */}
        <Hero heroImage={heroAsset} heroVideo={heroVideoAsset} />

        {/* 02. Collage de personajes */}
        <CharacterCollage />

        {/* 03. Visor 3D (lazy) */}
        <ErrorBoundary label="El visor 3D no pudo cargar">
          <Suspense fallback={<SectionFallback />}>
            <CharacterViewer />
          </Suspense>
        </ErrorBoundary>

        {/* 04. Trailer */}
        <Trailer videoSrc={trailerAsset} posterSrc={trailerPosterAsset} />

        {/* 05. Historia / Storyboard */}
        <Storyboard />

        {/* 06. Mapa */}
        <GameMap mapImage={mapAsset} />

        {/* 07. Detras del juego */}
        <BehindTheGame />

        {/* 08. Equipo */}
        <TeamSection />

        {/* 09. Descarga */}
        <DownloadCTA />
      </main>

      <Footer />
    </>
  )
}