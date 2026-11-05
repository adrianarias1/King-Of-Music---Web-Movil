import { useEffect, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import { characters } from '../../data/characters'
import { assetUrl } from '../../utils/assets'
import './HeroCharacterReel.css'

// =========================================================
// KING OF MUSIC — CARRUSEL CINEMATOGRÁFICO DE PERSONAJES
//
// Fondo del portal del Hero (detrás de "+5,000 descargas"),
// al estilo de las pantallas de carga de GTA V:
//
//   - El personaje se desliza de izquierda a derecha.
//   - El resplandor de su color y los destellos de luz se
//     mueven en sentido contrario (derecha → izquierda).
//   - Cada personaje entra y sale con un fundido; luego
//     sigue el siguiente, en bucle.
//
// El color de cada uno es `glow` de src/data/characters.ts
// (el mismo resplandor del visor 3D).
//
// Imágenes: public/images/loading/<id>.webp (recortes con
// fondo transparente). Para agregar un personaje basta con
// poner su archivo y su id en LOADING_IMAGES.
// =========================================================

/** Duración de cada personaje en pantalla (ms). Debe coincidir con --reel-duration. */
const SLIDE_MS = 4500

/** Recortes disponibles (id del personaje → imagen). */
const LOADING_IMAGES: Record<string, string> = {
  'juan-grabriel': '/images/loading/juan-grabriel.webp',
  'peso-plomo': '/images/loading/peso-plomo.webp',
  'natanael-chano': '/images/loading/natanael-chano.webp',
  'roman-ayala': '/images/loading/roman-ayala.webp',
  flavia: '/images/loading/flavia.webp',
}

const SLIDES = characters
  .filter((character) => LOADING_IMAGES[character.id])
  .map((character) => ({
    id: character.id,
    name: character.name,
    color: character.glow ?? '#C5A45B',
    image: assetUrl(LOADING_IMAGES[character.id] ?? ''),
  }))

interface Props {
  /** Sin animación: muestra el primer personaje fijo. */
  reduced?: boolean
}

export function HeroCharacterReel({ reduced = false }: Props) {
  const rootRef = useRef<HTMLDivElement>(null)
  const [index, setIndex] = useState(0)
  const [running, setRunning] = useState(false)

  // Precarga de todos los recortes (son ligeros, ~100–200 KB).
  useEffect(() => {
    for (const slide of SLIDES) {
      const img = new Image()
      img.decoding = 'async'
      img.src = slide.image
    }
  }, [])

  // Solo avanza mientras el Hero está en pantalla y la pestaña visible.
  useEffect(() => {
    const node = rootRef.current
    if (!node || reduced) return undefined
    let onScreen = false
    const sync = () => setRunning(onScreen && document.visibilityState === 'visible')
    const observer = new IntersectionObserver(([entry]) => {
      onScreen = Boolean(entry?.isIntersecting)
      sync()
    })
    observer.observe(node)
    document.addEventListener('visibilitychange', sync)
    return () => {
      observer.disconnect()
      document.removeEventListener('visibilitychange', sync)
    }
  }, [reduced])

  useEffect(() => {
    if (!running || SLIDES.length < 2) return undefined
    const timer = window.setTimeout(() => setIndex((i) => (i + 1) % SLIDES.length), SLIDE_MS)
    return () => window.clearTimeout(timer)
  }, [running, index])

  const slide = SLIDES[index]
  if (!slide) return null

  return (
    <div
      ref={rootRef}
      className={`reel${reduced ? ' reel--static' : ''}${running ? '' : ' reel--paused'}`}
      style={{ ['--reel-duration' as string]: `${SLIDE_MS}ms` } as CSSProperties}
      aria-hidden="true"
    >
      {/* key: al cambiar de personaje se reinician las animaciones */}
      <div
        key={slide.id}
        className="reel__slide"
        style={{ ['--reel-color' as string]: slide.color } as CSSProperties}
      >
        <div className="reel__glow" />
        <div className="reel__beams" />
        <div className="reel__flare" />
        <img className="reel__character" src={slide.image} alt="" decoding="async" draggable={false} />
        <div className="reel__floor" />
      </div>
      <div className="reel__vignette" />
    </div>
  )
}
