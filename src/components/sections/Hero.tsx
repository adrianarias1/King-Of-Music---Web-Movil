
import { useRef } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { ChevronDown } from 'lucide-react'

import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

import {
  siteConfig,
  gameLogoAsset,
  portalImageAsset,
} from '../../config'

import { useAssetExists } from '../../hooks/useAssetExists'

import './Hero.css'

// =========================================================
// KING OF MUSIC — HERO CINEMATOGRÁFICO V8
//
// MEJORAS:
// - Movimiento de cámara durante el contador.
// - Menor sensación de anclaje.
// - Salida progresiva del texto.
// - Fundido hacia el tráiler.
// - Se conserva el portal de la Piedra del Sol.
// - Compatible con el diseño responsive del Hero.
//
// Motion: animaciones iniciales.
// GSAP: recorrido cinematográfico con scroll.
// =========================================================

gsap.registerPlugin(ScrollTrigger, useGSAP)

const DEBUG_SCROLL = false

// =========================================================
// CONTENIDO NARRATIVO DEL PORTAL
//
// La cifra de descargas es demostrativa.
// No corresponde a descargas reales del videojuego.
// =========================================================

const PORTAL_CONTENT = {
  eyebrow: 'KING OF MUSIC',
  title: 'ELIGE A TU ARTISTA FAVORITO',
  subtitle: 'Y SALTA A A LA ARENA DE COMBATE.',
  downloads: 5000,
  downloadsLabel: 'Descargas en Steam',
} as const

interface Props {
  /** Imagen principal de la portada. */
  heroImage?: string | undefined

  /** Video ambiental opcional de la portada. */
  heroVideo?: string | undefined

  /** Propiedad conservada por compatibilidad. */
  trailerPoster?: string | undefined
}

export function Hero({
  heroImage,
  heroVideo,
}: Props) {
  const reduced = useReducedMotion()

  const heroRef = useRef<HTMLElement>(null)

  // =====================================================
  // 1. COMPROBACIÓN DE RECURSOS
  // =====================================================

  const { exists: hasImage } = useAssetExists(heroImage, {
    immediate: true,
  })

  const { exists: hasVideo } = useAssetExists(heroVideo, {
    immediate: true,
  })

  const { exists: hasPortalImage } = useAssetExists(
    portalImageAsset,
    { immediate: true },
  )

  // =====================================================
  // 2. ANIMACIÓN CINEMATOGRÁFICA
  // =====================================================

  useGSAP(
    () => {
      const hero = heroRef.current

      if (!hero || reduced) return

      // -------------------------------------------------
      // REFERENCIAS DEL HERO ORIGINAL
      // -------------------------------------------------

      const background = hero.querySelector<HTMLElement>(
        '.hero__bg',
      )

      const content = hero.querySelector<HTMLElement>(
        '.hero__content',
      )

      const scrollIndicator = hero.querySelector<HTMLElement>(
        '.hero__scroll',
      )

      // -------------------------------------------------
      // REFERENCIAS DE LA PIEDRA DEL SOL
      // -------------------------------------------------

      const reveal = hero.querySelector<HTMLElement>(
        '.hero__reveal',
      )

      const logo = hero.querySelector<HTMLElement>(
        '.hero__reveal-logo',
      )

      const portal = hero.querySelector<HTMLElement>(
        '.hero__portal',
      )

      // -------------------------------------------------
      // REFERENCIAS DEL ESCENARIO
      // -------------------------------------------------

      const portalScene = hero.querySelector<HTMLElement>(
        '.hero__portal-scene',
      )

      const portalMedia = hero.querySelector<HTMLElement>(
        '.hero__portal-media',
      )

      const portalMediaImage = hero.querySelector<HTMLElement>(
        '.hero__portal-media-img',
      )

      const portalOverlay = hero.querySelector<HTMLElement>(
        '.hero__portal-overlay',
      )

      // -------------------------------------------------
      // REFERENCIAS DEL CONTENIDO NARRATIVO
      // -------------------------------------------------

      const portalContent = hero.querySelector<HTMLElement>(
        '.hero__portal-content',
      )

      const portalEyebrow = hero.querySelector<HTMLElement>(
        '.hero__portal-eyebrow',
      )

      const portalTitle = hero.querySelector<HTMLElement>(
        '.hero__portal-title',
      )

      const portalSubtitle = hero.querySelector<HTMLElement>(
        '.hero__portal-subtitle',
      )

      const portalStats = hero.querySelector<HTMLElement>(
        '.hero__portal-stats',
      )

      const counterElement = hero.querySelector<HTMLElement>(
        '.hero__portal-counter-value',
      )

      if (
        !background ||
        !content ||
        !reveal ||
        !logo ||
        !portal ||
        !portalScene ||
        !portalMedia ||
        !portalOverlay ||
        !portalContent ||
        !portalEyebrow ||
        !portalTitle ||
        !portalSubtitle ||
        !portalStats ||
        !counterElement
      ) {
        if (DEBUG_SCROLL) {
          console.warn(
            '[KOM] Faltan elementos del Hero cinematográfico.',
          )
        }

        return
      }

      // ===================================================
      // 3. ESTADOS INICIALES
      // ===================================================

      gsap.set(reveal, {
        autoAlpha: 0,
      })

      gsap.set(logo, {
        scale: 0.75,
        rotation: -3,
        autoAlpha: 0,
        transformOrigin: '50% 50%',
      })

      gsap.set(portal, {
        clipPath: 'circle(0% at 50% 50%)',
      })

      gsap.set(portalScene, {
        opacity: 1,
      })

      gsap.set(portalMedia, {
        scale: 1.18,
        opacity: 0.65,
        yPercent: 0,
        transformOrigin: '50% 50%',
      })

      if (portalMediaImage) {
        gsap.set(portalMediaImage, {
          scale: 1,
          yPercent: 0,
          transformOrigin: '50% 50%',
        })
      }

      gsap.set(portalOverlay, {
        opacity: 0.9,
      })

      gsap.set(portalContent, {
        autoAlpha: 0,
        y: 0,
      })

      gsap.set(
        [
          portalEyebrow,
          portalTitle,
          portalSubtitle,
          portalStats,
        ],
        {
          opacity: 0,
          y: 35,
        },
      )

      // -------------------------------------------------
      // CONTADOR NUMÉRICO
      //
      // Se actualiza con el progreso del scroll.
      // La animación funciona en ambas direcciones.
      // -------------------------------------------------

      const counter = {
        value: 0,
      }

      counterElement.textContent = '0'

      // ===================================================
      // 4. TIMELINE PRINCIPAL
      // ===================================================

      const timeline = gsap.timeline({
        defaults: {
          ease: 'none',
        },

        scrollTrigger: {
          id: 'kom-hero-portal-v8',

          trigger: hero,

          start: 'top top',

          // V8:
          // Reducimos la distancia fijada respecto
          // a la versión anterior (3.2 pantallas).
          end: () => `+=${window.innerHeight * 2.65}`,

          // Seguimiento más cercano al movimiento
          // real del usuario.
          scrub: 0.55,

          pin: true,
          pinSpacing: true,

          anticipatePin: 1,
          invalidateOnRefresh: true,

          markers: DEBUG_SCROLL,
        },
      })

      // ===================================================
      // FASE 1 — DESPEDIDA DEL HERO ORIGINAL
      // ===================================================

      timeline.to(
        background,
        {
          scale: 1.08,
          duration: 1.1,
        },
        0,
      )

      timeline.to(
        content,
        {
          y: -45,
          scale: 1.04,
          autoAlpha: 0,
          duration: 0.5,
        },
        0.12,
      )

      if (scrollIndicator) {
        timeline.to(
          scrollIndicator,
          {
            autoAlpha: 0,
            duration: 0.2,
          },
          0,
        )
      }

      // ===================================================
      // FASE 2 — APARICIÓN DE LA PIEDRA DEL SOL
      // ===================================================

      timeline.to(
        reveal,
        {
          autoAlpha: 1,
          duration: 0.25,
        },
        0.6,
      )

      timeline.to(
        logo,
        {
          autoAlpha: 1,
          scale: 1,
          rotation: 0,
          duration: 0.55,
          ease: 'power2.out',
        },
        0.7,
      )

      // ===================================================
      // FASE 3 — ZOOM CINEMATOGRÁFICO
      // ===================================================

      timeline.to(
        logo,
        {
          scale: 2.15,
          rotation: 5,
          duration: 1.3,
          ease: 'sine.inOut',
        },
        1.25,
      )

      // ===================================================
      // FASE 4 — APERTURA DEL PORTAL
      // ===================================================

      timeline.to(
        portal,
        {
          clipPath: 'circle(150% at 50% 50%)',
          duration: 1.5,
          ease: 'sine.inOut',
        },
        2.15,
      )

      timeline.to(
        logo,
        {
          scale: 2.45,
          rotation: 7,
          autoAlpha: 0,
          duration: 0.8,
          ease: 'sine.inOut',
        },
        2.35,
      )

      // ===================================================
      // FASE 5 — REVELACIÓN DE IMAGEN-HERO
      // ===================================================

      // La escena se acerca desde el fondo del portal.
      timeline.to(
        portalMedia,
        {
          scale: 1.07,
          opacity: 1,
          duration: 1.4,
          ease: 'sine.inOut',
        },
        2.3,
      )

      timeline.to(
        portalOverlay,
        {
          opacity: 0.72,
          duration: 1.1,
        },
        2.55,
      )

      // ===================================================
      // FASE 6 — APARICIÓN DEL MENSAJE
      // ===================================================

      timeline.set(
        portalContent,
        {
          autoAlpha: 1,
        },
        3.55,
      )

      timeline.to(
        portalEyebrow,
        {
          opacity: 1,
          y: 0,
          duration: 0.3,
          ease: 'power2.out',
        },
        3.6,
      )

      timeline.to(
        portalTitle,
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: 'power2.out',
        },
        3.7,
      )

      timeline.to(
        portalSubtitle,
        {
          opacity: 1,
          y: 0,
          duration: 0.4,
          ease: 'power2.out',
        },
        3.95,
      )

      // ===================================================
      // FASE 7 — CÁMARA EN MOVIMIENTO
      //
      // CAMBIO PRINCIPAL V8:
      //
      // El fondo continúa moviéndose mientras aparece
      // el contador.
      //
      // Así, aunque ScrollTrigger mantiene fijo el Hero,
      // la escena conserva sensación de desplazamiento.
      // ===================================================

      timeline.to(
        portalMedia,
        {
          scale: 1.12,
          yPercent: -2,
          duration: 1.65,
          ease: 'sine.inOut',
        },
        3.7,
      )

      // Movimiento adicional muy ligero de la fotografía.
      // No modifica el texto ni la máscara circular.
      if (portalMediaImage) {
        timeline.to(
          portalMediaImage,
          {
            scale: 1.025,
            yPercent: -1.5,
            duration: 1.5,
            ease: 'sine.inOut',
          },
          3.85,
        )
      }

      // ===================================================
      // FASE 8 — CONTADOR DINÁMICO
      // ===================================================

      timeline.to(
        portalStats,
        {
          opacity: 1,
          y: 0,
          duration: 0.4,
          ease: 'power2.out',
        },
        4.1,
      )

      timeline.to(
        counter,
        {
          value: PORTAL_CONTENT.downloads,
          duration: 0.9,
          ease: 'power2.out',

          onUpdate: () => {
            counterElement.textContent =
              Math.round(counter.value).toLocaleString('es-MX')
          },
        },
        4.2,
      )

      // ===================================================
      // FASE 9 — SALIDA HACIA EL TRÁILER
      //
      // CAMBIO PRINCIPAL V8:
      //
      // En lugar de mantener una composición inmóvil
      // hasta liberar el pin:
      //
      // 1. El contador termina.
      // 2. El texto asciende y desaparece.
      // 3. La imagen sigue moviéndose.
      // 4. La escena se funde progresivamente a negro.
      // 5. El scroll continúa hacia Trailer.tsx.
      // ===================================================

      timeline.to(
        portalContent,
        {
          y: -42,
          autoAlpha: 0,
          duration: 0.55,
          ease: 'sine.inOut',
        },
        5.12,
      )

      // Último desplazamiento de cámara.
      timeline.to(
        portalMedia,
        {
          yPercent: -3,
          scale: 1.15,
          duration: 0.45,
          ease: 'sine.inOut',
        },
        5.35,
      )

      // El fondo desaparece sobre el negro del Hero.
      // Esto evita un cambio brusco de imagen cuando
      // ScrollTrigger libera la sección.
      timeline.to(
        portalScene,
        {
          opacity: 0,
          duration: 0.5,
          ease: 'sine.inOut',
        },
        5.32,
      )

      // Final breve: no dejamos una pausa prolongada.
      timeline.to(
        {},
        {
          duration: 0.08,
        },
        5.82,
      )

      if (DEBUG_SCROLL) {
        console.log(
          '[KOM] Hero cinematográfico V8 inicializado.',
        )
      }
    },
    {
      scope: heroRef,
      dependencies: [reduced],
      revertOnUpdate: true,
    },
  )

  // =========================================================
  // 5. ESTRUCTURA VISUAL
  // =========================================================

  return (
    <section
      ref={heroRef}
      id="inicio"
      className="hero"
      aria-label="Portada de King of Music"
    >
      {/* ===================================================
          FONDO PRINCIPAL
          =================================================== */}

      <div className="hero__bg" aria-hidden="true">
        {hasImage && heroImage ? (
          <img
            className="hero__bg-img"
            src={heroImage}
            alt=""
            loading="eager"
            decoding="async"
          />
        ) : (
          <div
            className={`hero__bg-art${reduced ? '' : ' is-animated'}`}
          />
        )}

        {hasVideo && heroVideo ? (
          <video
            className="hero__bg-video"
            src={heroVideo}
            muted
            loop
            playsInline
            preload="none"
          />
        ) : null}

        <div className="hero__veil" />
      </div>

      {/* ===================================================
          CONTENIDO PRINCIPAL
          =================================================== */}

      <div className="hero__content container container--wide">
        <motion.p
          className="hero__eyebrow label"
          initial={reduced ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.4,
            delay: 0.05,
          }}
        >
          Proyecto Integrador 2026
        </motion.p>

        <h1 className="hero__title display">
          <motion.span
            className="hero__word"
            initial={reduced ? false : { opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.55,
              delay: 0.12,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            King
          </motion.span>

          <motion.span
            className="hero__word hero__word--thin"
            initial={reduced ? false : { opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.55,
              delay: 0.2,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            of
          </motion.span>

          <motion.span
            className="hero__word"
            initial={reduced ? false : { opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.55,
              delay: 0.26,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            Music
          </motion.span>
        </h1>

        <motion.p
          className="hero__lead lead"
          initial={reduced ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.45,
            delay: 0.36,
          }}
        >
          {siteConfig.tagline}
        </motion.p>

        <motion.div
          className="hero__actions"
          initial={reduced ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.45,
            delay: 0.44,
          }}
        >
          <a
            className="hero__action-button"
            href="#personajes"
          >
            <span className="btn__label">
              Descubrir
            </span>
          </a>

          <a
            className="hero__action-button"
            href="#descargar"
          >
            <span className="btn__label">
              Descargar
            </span>
          </a>
        </motion.div>
      </div>

      {/* ===================================================
          PIEDRA DEL SOL Y PORTAL
          =================================================== */}

      {!reduced && (
        <div
          className="hero__reveal"
          aria-hidden="true"
        >
          <div className="hero__reveal-word-wrapper">
            <img
              className="hero__reveal-logo"
              src={gameLogoAsset}
              alt=""
              width={1024}
              height={1024}
              decoding="async"
              draggable={false}
            />
          </div>

          <div className="hero__portal">
            <div className="hero__portal-scene">

              {/* Imagen anfitriona del portal */}

              <div className="hero__portal-media">
                {hasPortalImage ? (
                  <img
                    className="hero__portal-media-img"
                    src={portalImageAsset}
                    alt=""
                    decoding="async"
                    loading="eager"
                    draggable={false}
                  />
                ) : (
                  <div className="hero__portal-media-fallback" />
                )}
              </div>

              {/* Oscurecimiento ambiental */}

              <div className="hero__portal-overlay" />

              {/* Rejilla ambiental */}

              <div
                className="hero__portal-grid"
                aria-hidden="true"
              />

              {/* Contenido narrativo */}

              <div className="hero__portal-content">
                <span className="hero__portal-eyebrow">
                  {PORTAL_CONTENT.eyebrow}
                </span>

                <h2 className="hero__portal-title">
                  {PORTAL_CONTENT.title}
                </h2>

                <p className="hero__portal-subtitle">
                  {PORTAL_CONTENT.subtitle}
                </p>

                {/* Contador vinculado al scroll */}

                <div className="hero__portal-stats">
                  <div className="hero__portal-counter">
                    <span className="hero__portal-counter-value">
                      0
                    </span>

                    <span className="hero__portal-counter-plus">
                      +
                    </span>
                  </div>

                  <span className="hero__portal-counter-label">
                    {PORTAL_CONTENT.downloadsLabel}
                  </span>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* ===================================================
          INDICADOR DE SCROLL
          =================================================== */}

      <motion.a
        className="hero__scroll"
        href="#trailer"
        aria-label="Ir al tráiler oficial"
        initial={reduced ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          duration: 0.5,
          delay: 0.7,
        }}
      >
        <span className="label">
          Scroll
        </span>

        <ChevronDown
          size={16}
          strokeWidth={1.5}
          aria-hidden="true"
        />
      </motion.a>
    </section>
  )
}
