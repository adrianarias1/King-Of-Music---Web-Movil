
import { useRef } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { ChevronDown } from 'lucide-react'

import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

import { siteConfig, gameLogoAsset, portalImageAsset } from '../../config'
import { useAssetExists } from '../../hooks/useAssetExists'

import './Hero.css'

// =========================================================
// KING OF MUSIC — HERO CINEMATOGRÁFICO V6
//
// Experiencia:
// 1. Presentación del videojuego
// 2. Aparición de la Piedra del Sol
// 3. Acercamiento cinematográfico
// 4. Apertura del portal
// 5. Imagen anfitriona con profundidad
// 6. Texto y contador animado
// 7. Continuación hacia el tráiler
//
// Motion: animaciones iniciales
// GSAP: recorrido vinculado al scroll
// =========================================================

gsap.registerPlugin(ScrollTrigger, useGSAP)

const DEBUG_SCROLL = false

// Los recursos gráficos se administran desde src/config.ts.

// Contenido promocional del prototipo.
// IMPORTANTE: la cifra es ilustrativa, no una estadística real.
const PORTAL_CONTENT = {
  eyebrow: 'KING OF MUSIC',
  title: 'DONDE EL RITMO SE CONVIERTE EN BATALLA',
  subtitle: 'La música tiene un nuevo escenario.',
  downloads: 5000,
  downloadsLabel: 'Descargas en Steam',
  demoLabel: 'Cifra ilustrativa · Prototipo',
} as const

interface Props {
  /** Imagen principal de la portada. */
  heroImage?: string | undefined

  /** Video ambiental de la portada. */
  heroVideo?: string | undefined

  /** Se conserva por compatibilidad con App.tsx. */
  trailerPoster?: string | undefined
}

export function Hero({
  heroImage,
  heroVideo,
}: Props) {
  const reduced = useReducedMotion()

  const heroRef = useRef<HTMLElement>(null)

  // =====================================================
  // 1. VERIFICACIÓN DE RECURSOS
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
  // 2. ANIMACIÓN PRINCIPAL CON GSAP
  // =====================================================

  useGSAP(
    () => {
      const hero = heroRef.current

      if (!hero || reduced) return

      // Elementos principales
      const background = hero.querySelector<HTMLElement>(
        '.hero__bg',
      )

      const content = hero.querySelector<HTMLElement>(
        '.hero__content',
      )

      const scrollIndicator = hero.querySelector<HTMLElement>(
        '.hero__scroll',
      )

      // Elementos de la revelación
      const reveal = hero.querySelector<HTMLElement>(
        '.hero__reveal',
      )

      const logo = hero.querySelector<HTMLElement>(
        '.hero__reveal-logo',
      )

      const portal = hero.querySelector<HTMLElement>(
        '.hero__portal',
      )

      const portalImage = hero.querySelector<HTMLElement>(
        '.hero__portal-media',
      )

      const portalOverlay = hero.querySelector<HTMLElement>(
        '.hero__portal-overlay',
      )

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
        !portalImage ||
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
            '[KOM] Faltan elementos para iniciar el portal.',
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

      // El portal comienza completamente cerrado.
      gsap.set(portal, {
        clipPath: 'circle(0% at 50% 50%)',
      })

      gsap.set(portalImage, {
        scale: 1.18,
        opacity: 0.65,
        transformOrigin: 'center center',
      })

      gsap.set(portalOverlay, {
        opacity: 0.9,
      })

      gsap.set(portalContent, {
        autoAlpha: 0,
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

      // Objeto numérico controlado por GSAP.
      // El valor se actualiza también al hacer scroll
      // en sentido contrario.
      const counter = {
        value: 0,
      }

      counterElement.textContent = '0'

      // ===================================================
      // 4. TIMELINE CINEMATOGRÁFICA
      // ===================================================

      const timeline = gsap.timeline({
        defaults: {
          ease: 'none',
        },

        scrollTrigger: {
          id: 'kom-hero-portal-v6',

          trigger: hero,

          start: 'top top',

          // Distancia narrativa del recorrido.
          end: () => `+=${window.innerHeight * 3.2}`,

          scrub: 0.8,

          pin: true,
          pinSpacing: true,

          anticipatePin: 1,
          invalidateOnRefresh: true,

          markers: DEBUG_SCROLL,
        },
      })

      // ===================================================
      // FASE 1 — DESPEDIDA DEL HERO
      // ===================================================

      timeline.to(
        background,
        {
          scale: 1.08,
          duration: 1.1,
        },
        0,
      )

      // Animamos el contenedor completo para evitar
      // conflictos con las animaciones individuales
      // de entrada realizadas mediante Motion.
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
      // FASE 2 — APARICIÓN DEL ISOTIPO
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
      // FASE 3 — ACERCAMIENTO CINEMATOGRÁFICO
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
      // FASE 4 — APERTURA DE LA PIEDRA DEL SOL
      // ===================================================

      // Una única expansión continua.
      // El radio de 150% cubre completamente
      // la pantalla, incluidas las esquinas.
      timeline.to(
        portal,
        {
          clipPath: 'circle(150% at 50% 50%)',
          duration: 1.5,
          ease: 'sine.inOut',
        },
        2.15,
      )

      // El logo termina de acercarse y desaparece
      // cuando el portal ocupa el centro de la pantalla.
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
      // FASE 5 — REVELACIÓN DE LA IMAGEN ANFITRIONA
      // ===================================================

      // La imagen realiza un acercamiento ambiental
      // contrario a la apertura del portal.
      timeline.to(
        portalImage,
        {
          scale: 1,
          opacity: 1,
          duration: 1.5,
          ease: 'sine.inOut',
        },
        2.3,
      )

      // El sombreado se ajusta para revelar
      // progresivamente la imagen sin perder contraste.
      timeline.to(
        portalOverlay,
        {
          opacity: 0.72,
          duration: 1.1,
        },
        2.55,
      )

      // ===================================================
      // FASE 6 — MENSAJE PROMOCIONAL
      // ===================================================

      timeline.set(
        portalContent,
        {
          autoAlpha: 1,
        },
        3.55,
      )

      // Etiqueta superior
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

      // Frase principal
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

      // Subtítulo
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
      // FASE 7 — CONTADOR DINÁMICO
      // ===================================================

      // Primero aparece el espacio del contador.
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

      // Animación del número: 0 → 5000.
      // Está vinculada al progreso del scroll,
      // por lo que funciona también al retroceder.
      timeline.to(
        counter,
        {
          value: PORTAL_CONTENT.downloads,
          duration: 1.1,
          ease: 'power2.out',

          onUpdate: () => {
            counterElement.textContent =
              Math.round(counter.value).toLocaleString('es-MX')
          },
        },
        4.2,
      )

      // ===================================================
      // FASE 8 — CIERRE DE LA SECUENCIA
      // ===================================================

      // Mantener la composición terminada durante
      // un pequeño tramo del recorrido.
      timeline.to(
        {},
        {
          duration: 0.45,
        },
        5.3,
      )

      // La siguiente sección aparece cuando se libera
      // el pin. No introducimos otro reproductor aquí.

      if (DEBUG_SCROLL) {
        console.log(
          '[KOM] Hero cinematográfico V6 inicializado.',
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
  // 5. ESTRUCTURA VISUAL DEL HERO
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
          Desarrollo de Videojuegos - Desarrollo Móvil - Desarrollo Web - 2026
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
            className="btn btn--primary btn--lg"
            href="#personajes"
          >
            <span className="btn__label">
              Descubrir
            </span>
          </a>

          <a
            className="btn btn--secondary btn--lg"
            href="#descargar"
          >
            <span className="btn__label">
              Descargar
            </span>
          </a>
        </motion.div>
      </div>

      {/* ===================================================
          REVELACIÓN CINEMATOGRÁFICA
          =================================================== */}

      {!reduced && (
        <div
          className="hero__reveal"
          aria-hidden="true"
        >
          {/* Logotipo oficial */}

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

          {/* =================================================
              PORTAL DE LA PIEDRA DEL SOL
              ================================================= */}

          <div className="hero__portal">
            <div className="hero__portal-scene">

              {/* Imagen anfitriona */}

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

              {/* Filtro oscuro y resplandor dorado */}

              <div className="hero__portal-overlay" />

              {/* Rejilla ambiental */}

              <div
                className="hero__portal-grid"
                aria-hidden="true"
              />

              {/* ===========================================
                  CONTENIDO NARRATIVO DEL PORTAL
                  =========================================== */}

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

                {/* =======================================
                    CONTADOR DEMOSTRATIVO
                    ======================================= */}

                <div className="hero__portal-stats">

                  <div className="hero__portal-counter">
                    <span
                      className="hero__portal-counter-value"
                    >
                      0
                    </span>

                    <span className="hero__portal-counter-plus">
                      +
                    </span>
                  </div>

                  <span className="hero__portal-counter-label">
                    {PORTAL_CONTENT.downloadsLabel}
                  </span>

                  <span className="hero__portal-counter-demo">
                    {PORTAL_CONTENT.demoLabel}
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
