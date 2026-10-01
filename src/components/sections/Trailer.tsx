import { Play } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useAssetExists } from '../../hooks/useAssetExists'
import { assetExists } from '../../utils/assets'
import { Reveal } from '../ui/Reveal'
import { SectionHeading } from '../ui/SectionHeading'
import './Trailer.css'

interface Props {
  /** Ruta del video. Sin archivo, se muestra el poster/placeholder. */
  videoSrc?: string | undefined
  posterSrc?: string | undefined
}

const copy = {
  eyebrow: 'Video',
  title: 'Trailer',
  lead: 'El combate al ritmo de la escena musical mexicana.',
} as const

/**
 * Trailer cinematico.
 *
 * - El <video> NO existe en el DOM hasta que el usuario pulsa Play.
 * - Nunca hay autoplay ni sonido.
 * - Si el archivo de video no existe, se mantiene el poster con un aviso
 *   discreto en lugar de romper la seccion.
 */
export function Trailer({ videoSrc, posterSrc }: Props) {
  const [playing, setPlaying] = useState(false)
  const [videoReady, setVideoReady] = useState(false)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const { ref: posterCheckRef, exists: posterExists } = useAssetExists(posterSrc)

  useEffect(() => {
    if (!videoSrc) return undefined
    let alive = true

    assetExists(videoSrc).then((exists) => {
      if (alive) setVideoReady(exists)
    })

    return () => {
      alive = false
      setPlaying(false)
    }
  }, [videoSrc])

  const handlePlay = useCallback(() => {
    setPlaying(true)
    // El elemento aparece en este mismo render; se intenta reproducir tras el montaje.
    requestAnimationFrame(() => {
      videoRef.current?.play().catch(() => setPlaying(false))
    })
  }, [])

  const showPlayer = playing && videoReady

  return (
    <section id="trailer" className="section theme-dark trailer" aria-label={copy.title}>
      <div className="container">
        <SectionHeading index="03" eyebrow={copy.eyebrow} title={copy.title} lead={copy.lead} />
      </div>

      <Reveal className="trailer__frame container container--wide" direction="up" distance={30}>
        <div className="trailer__stage" ref={posterCheckRef}>
          {/*
            ASSETS PENDIENTES:
              public/videos/trailer.mp4
              public/images/trailer-poster.jpg
            Hasta que existan, el bloque es un poster generado con CSS.
          */}
          <div className="trailer__poster">
            <span className="trailer__grid" aria-hidden="true" />
            <span className="trailer__badge label">Trailer oficial</span>
            <span className="trailer__ratio label">16 / 9</span>
          </div>

          {posterExists && posterSrc ? (
            <img
              className="trailer__poster-img"
              src={posterSrc}
              alt="Miniatura del trailer"
              loading="lazy"
              decoding="async"
            />
          ) : null}

          {/* El video solo se monta al pulsar Play */}
          {showPlayer && videoSrc ? (
            <video
              ref={videoRef}
              className="trailer__video"
              src={videoSrc}
              poster={posterSrc}
              controls
              playsInline
              preload="metadata"
            />
          ) : null}

          {showPlayer ? null : (
            <button
              type="button"
              className="trailer__play"
              onClick={handlePlay}
              aria-label="Reproducir trailer"
              disabled={!videoReady}
            >
              <span className="trailer__play-ring" aria-hidden="true" />
              <Play size={26} strokeWidth={1.4} aria-hidden="true" />
              <span className="trailer__play-text label">
                {videoReady ? 'Reproducir' : copy.title}
              </span>
            </button>
          )}
        </div>

        {!videoReady ? (
          <p className="notice notice--inline trailer__notice">
            Video pendiente de carga — public/videos/trailer.mp4
          </p>
        ) : null}
      </Reveal>
    </section>
  )
}