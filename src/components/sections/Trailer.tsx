
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
// KING OF MUSIC — TRÁILER CINEMATOGRÁFICO V3
//
// Destino del portal de la Piedra del Sol.
//
// Características:
// - Compatible con React y Capacitor.
// - Reproductor bajo demanda.
// - Sin reproducción automática al entrar a la sección.
// - Preparado para transiciones con GSAP.
// - Poster y fondo provisional.
// =========================================================

interface Props {
  /** Ruta del archivo de video. */
  videoSrc?: string | undefined

  /** Imagen de portada del tráiler. */
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

  // Comprobación de la imagen del poster.
  const {
    ref: posterCheckRef,
    exists: posterExists,
  } = useAssetExists(posterSrc)

  // =====================================================
  // 2. COMPROBAR DISPONIBILIDAD DEL VIDEO
  // =====================================================

  useEffect(() => {
    let active = true

    // Restablecer el estado cuando cambia la fuente.
    // No es necesario modificar el estado en el cleanup.
    if (!videoSrc) {
      return
    }

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

    return () => {
      active = false
    }
  }, [videoSrc])

  // =====================================================
  // 3. REPRODUCCIÓN BAJO DEMANDA
  // =====================================================

  const handlePlay = useCallback(() => {
    if (!videoReady || !videoSrc) return

    setPlaying(true)
  }, [videoReady, videoSrc])

  // Ejecutar play cuando React haya montado el video.
  // Evita depender de requestAnimationFrame.
  const attachVideo = useCallback((element: HTMLVideoElement | null) => {
    videoRef.current = element

    if (!element) return

    element.play().catch((error: unknown) => {
      console.warn(
        '[King of Music] No se pudo iniciar el tráiler:',
        error,
      )

      setPlaying(false)
    })
  }, [])

  const showPlayer = playing && videoReady && Boolean(videoSrc)

  // =====================================================
  // 4. ESTRUCTURA PRINCIPAL
  // =====================================================

  return (
    <section
      id="trailer"
      className="section theme-dark trailer"
      aria-label="Tráiler oficial de King of Music"
    >
      {/* =================================================
          ENCABEZADO

          El tráiler ahora es la sección 02.
          ================================================= */}

      <div className="container trailer__heading">
        <SectionHeading
          index="02"
          eyebrow={copy.eyebrow}
          title={copy.title}
          lead={copy.lead}
        />
      </div>

      {/* =================================================
          ESCENARIO DEL TRÁILER

          Se elimina Reveal para que posteriormente
          GSAP controle la entrada de esta sección.

          La clase trailer__frame se conserva para
          mantener los estilos existentes.
          ================================================= */}

      <div className="trailer__frame container container--wide">

        <div
          className="trailer__stage"
          ref={posterCheckRef}
          data-portal-destination="true"
        >
          {/* =============================================
              POSTER PROVISIONAL

              Mientras no exista la imagen definitiva,
              el fondo se genera mediante CSS.
              ============================================= */}

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

          {/* =============================================
              IMAGEN DE PORTADA
              ============================================= */}

          {posterExists && posterSrc ? (
            <img
              className="trailer__poster-img"
              src={posterSrc}
              alt="Vista previa del tráiler de King of Music"
              loading="lazy"
              decoding="async"
            />
          ) : null}

          {/* =============================================
              REPRODUCTOR

              El video solo se monta después de que
              el usuario pulsa el botón de reproducción.
              ============================================= */}

          {showPlayer && videoSrc ? (
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
          ) : null}

          {/* =============================================
              BOTÓN DE REPRODUCCIÓN
              ============================================= */}

          {!showPlayer && (
            <button
              type="button"
              className="trailer__play"
              onClick={handlePlay}
              aria-label={
                videoReady
                  ? 'Reproducir tráiler de King of Music'
                  : 'Tráiler todavía no disponible'
              }
              disabled={!videoReady}
            >
              <span
                className="trailer__play-ring"
                aria-hidden="true"
              />

              <Play
                size={26}
                strokeWidth={1.4}
                aria-hidden="true"
              />

              <span className="trailer__play-text label">
                {videoReady
                  ? 'Reproducir'
                  : 'Próximamente'}
              </span>
            </button>
          )}
        </div>

        {/* =============================================
            AVISO DE VIDEO PENDIENTE

            Se muestra mientras el recurso no esté
            disponible. No afecta al portal.
            ============================================= */}

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
