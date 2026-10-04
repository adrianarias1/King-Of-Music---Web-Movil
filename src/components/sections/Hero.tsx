import { motion, useReducedMotion } from 'motion/react'
import { ChevronDown } from 'lucide-react'
import { siteConfig } from '../../config'
import { useAssetExists } from '../../hooks/useAssetExists'
import './Hero.css'

interface Props {
  /** Imagen de fondo definitiva (aun no existe). */
  heroImage?: string | undefined
  /** Video de fondo (aun no existe). No se carga hasta tener `videoReady`. */
  heroVideo?: string | undefined
}

export function Hero({ heroImage, heroVideo }: Props) {
  const reduced = useReducedMotion()
  // El Hero esta siempre en pantalla: se comprueba sin esperar al viewport.
  const { exists: hasImage } = useAssetExists(heroImage, { immediate: true })
  const { exists: hasVideo } = useAssetExists(heroVideo, { immediate: true })

  return (
    <section id="inicio" className="hero" aria-label="Portada">
      {/* ASSET PENDIENTE: public/images/hero.jpg (docs/CONTENT.md)
          Mientras no exista, el fondo es un gradiente generado con CSS. */}
      <div className="hero__bg" aria-hidden="true">
        {hasImage && heroImage ? (
          <img className="hero__bg-img" src={heroImage} alt="" loading="eager" decoding="async" />
        ) : (
          <div className={`hero__bg-art${reduced ? '' : ' is-animated'}`} />
        )}
        {hasVideo && heroVideo ? (
          <video className="hero__bg-video" src={heroVideo} muted loop playsInline preload="none" />
        ) : null}
        <div className="hero__veil" />
      </div>

      <div className="hero__content container container--wide">
        <motion.p
          className="hero__eyebrow label"
          initial={reduced ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
        >
          Desarrollo de Videojuegos - Desarrollo Móvil - Desarrollo Web - 2026
        </motion.p>

        <h1 className="hero__title display">
          <motion.span
            className="hero__word"
            initial={reduced ? false : { opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
          >
            King
          </motion.span>
          <motion.span
            className="hero__word hero__word--thin"
            initial={reduced ? false : { opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            of
          </motion.span>
          <motion.span
            className="hero__word"
            initial={reduced ? false : { opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.26, ease: [0.22, 1, 0.36, 1] }}
          >
            Music
          </motion.span>
        </h1>

        <motion.p
          className="hero__lead lead"
          initial={reduced ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.36 }}
        >
          {siteConfig.tagline}
        </motion.p>

        <motion.div
          className="hero__actions"
          initial={reduced ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.44 }}
        >
          <a className="btn btn--primary btn--lg" href="#personajes">
            <span className="btn__label">Descubrir</span>
          </a>
          <a className="btn btn--secondary btn--lg" href="#descargar">
            <span className="btn__label">Descargar</span>
          </a>
        </motion.div>
      </div>

      <motion.a
        className="hero__scroll"
        href="#personajes"
        aria-label="Ir a la seccion de personajes"
        initial={reduced ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.7 }}
      >
        <span className="label">Scroll</span>
        <ChevronDown size={16} strokeWidth={1.5} aria-hidden="true" />
      </motion.a>
    </section>
  )
}