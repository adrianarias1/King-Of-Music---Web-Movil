
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
import { useI18n } from '../../i18n'

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

export function Trailer({ videoSrc, posterSrc }: Props) {
  const { t } = useI18n()
  const copy = t.trailer
  // =====================================================
  // 1. ESTADOS Y REFERENCIAS
  // =====================================================

  const [playing, setPlaying] = useState(false)
  // Se guarda junto con la ruta comprobada: si cambia `videoSrc`,
  // el resultado anterior deja de valer sin un setState extra.
  const [videoCheck, setVideoCheck] = useState<{ src: string; ready: boolean } | null>(null)
  const videoReady = Boolean(videoSrc) && videoCheck?.src === videoSrc && videoCheck?.ready === true

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

    if (videoSrc) {
      assetExists(videoSrc)
        .then((exists) => {
          if (active) {
            setVideoCheck({ src: videoSrc, ready: exists })
          }
        })
        .catch(() => {
          if (active) {
            setVideoCheck({ src: videoSrc, ready: false })
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
      aria-label={copy.sectionLabel}
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
              {copy.badge}
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
              alt={copy.posterAlt}
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
              aria-label={copy.videoLabel}
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
                  ? copy.play
                  : copy.notYet
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
                  ? copy.playShort
                  : copy.soonShort}
              </span>
            </button>
          )}
        </div>

        {!videoReady && (
          <p
            className="notice notice--inline trailer__notice"
            role="status"
          >
            {copy.soonNotice}
          </p>
        )}
      </div>
    </section>
  )
}
