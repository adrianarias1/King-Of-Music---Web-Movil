
import { Play } from 'lucide-react'
import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'

import { useAssetExists } from '../../hooks/useAssetExists'
import { assetExists } from '../../utils/assets'
import { SectionHeading } from '../ui/SectionHeading'

import './Trailer.css'

// =========================================================
// KING OF MUSIC — TRÁILER CINEMATOGRÁFICO V4
//
// Características:
// - Poster oscuro y desenfocado mediante CSS.
// - Botón Play blanco de alto contraste.
// - Video nítido durante la reproducción.
// - Reproducción bajo demanda.
// - Sin autoplay al entrar en la sección.
// - Transición visual hacia personajes.
// - Compatible con React y Capacitor.
// =========================================================

interface Props {
  videoSrc?: string | undefined
  posterSrc?: string | undefined
}

const copy = {
  eyebrow: 'Video',
  title: 'Tráiler',
  lead: 'El combate al ritmo de la escena musical mexicana.',
} as const

export function Trailer({ videoSrc, posterSrc }: Props) {
  // =====================================================
  // 1. ESTADOS Y REFERENCIAS
  // =====================================================

  const [playing, setPlaying] = useState(false)
  const [videoReady, setVideoReady] = useState(false)

  const videoRef = useRef<HTMLVideoElement | null>(null)

  const {
    ref: posterCheckRef,
    exists: posterExists,
  } = useAssetExists(posterSrc)

  // =====================================================
  // 2. DISPONIBILIDAD DEL VIDEO
  // =====================================================

  useEffect(() => {
    let active = true

    setVideoReady(false)

    if (videoSrc) {
      assetExists(videoSrc)
        .then((exists) => {
          if (active) {
            setVideoReady(exists)
          }
        })
        .catch(() => {
          if (active) {
            setVideoReady(false)
          }
        })
    }

    return () => {
      active = false
    }
  }, [videoSrc])

  // =====================================================
  // 3. REPRODUCCIÓN
  // =====================================================

  const handlePlay = useCallback(() => {
    if (!videoReady || !videoSrc) return

    setPlaying(true)
  }, [videoReady, videoSrc])

  const attachVideo = useCallback(
    (element: HTMLVideoElement | null) => {
      videoRef.current = element

      if (!element) return

      element.play().catch((error: unknown) => {
        console.warn(
          '[King of Music] No se pudo iniciar el tráiler:',
          error,
        )

        setPlaying(false)
      })
    },
    [],
  )

  const showPlayer =
    playing && videoReady && Boolean(videoSrc)

  // =====================================================
  // 4. ESTRUCTURA
  // =====================================================

  return (
    <section
      id="trailer"
      className="section theme-dark trailer"
      aria-label="Tráiler oficial de King of Music"
    >
      {/* Encabezado */}

      <div className="container trailer__heading">
        <SectionHeading
          index="02"
          eyebrow={copy.eyebrow}
          title={copy.title}
          lead={copy.lead}
        />
      </div>

      {/* Escenario principal */}

      <div className="trailer__frame container container--wide">
        <div
          className={`trailer__stage${
            showPlayer ? ' trailer__stage--playing' : ''
          }`}
          ref={posterCheckRef}
          data-portal-destination="true"
        >
          {/* Fondo provisional */}

          <div
            className="trailer__poster"
            aria-hidden="true"
          >
            <span className="trailer__grid" />

            <span className="trailer__badge label">
              Tráiler oficial
            </span>

            <span className="trailer__ratio label">
              16 / 9
            </span>
          </div>

          {/* Póster desenfocado y oscurecido por CSS */}

          {posterExists && posterSrc && (
            <img
              className="trailer__poster-img"
              src={posterSrc}
              alt="Vista previa del tráiler de King of Music"
              loading="lazy"
              decoding="async"
            />
          )}

          {/* Video nítido: sin filtros de blur */}

          {showPlayer && videoSrc && (
            <video
              ref={attachVideo}
              className="trailer__video"
              src={videoSrc}
              poster={
                posterExists && posterSrc
                  ? posterSrc
                  : undefined
              }
              controls
              playsInline
              preload="metadata"
              onEnded={() => setPlaying(false)}
              onError={() => setPlaying(false)}
              aria-label="Video del tráiler oficial de King of Music"
            />
          )}

          {/* Botón de reproducción */}

          {!showPlayer && (
            <button
              type="button"
              className="trailer__play"
              onClick={handlePlay}
              disabled={!videoReady}
              aria-label={
                videoReady
                  ? 'Reproducir tráiler de King of Music'
                  : 'Tráiler todavía no disponible'
              }
            >
              <span
                className="trailer__play-ring"
                aria-hidden="true"
              >
                <Play
                  className="trailer__play-icon"
                  size={30}
                  strokeWidth={1.5}
                  aria-hidden="true"
                />
              </span>

              <span className="trailer__play-text label">
                {videoReady
                  ? 'REPRODUCIR'
                  : 'PRÓXIMAMENTE'}
              </span>
            </button>
          )}
        </div>

        {!videoReady && (
          <p
            className="notice notice--inline trailer__notice"
            role="status"
          >
            Tráiler oficial próximamente disponible.
          </p>
        )}
      </div>
    </section>
  )
}
