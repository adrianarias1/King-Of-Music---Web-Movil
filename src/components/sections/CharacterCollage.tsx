import { useEffect, useRef } from 'react'
import { characters } from '../../data/characters'
import { SectionHeading } from '../ui/SectionHeading'
import { SmartImage } from '../ui/SmartImage'
import './CharacterCollage.css'

const copy = {
  eyebrow: 'Roster',
  title: 'Conoce a los artistas',
  lead: 'Conoce a los artistas del roster y explora sus modelos 3D en la sección de selección.',
} as const

export function CharacterCollage() {
  const carouselRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const offsetRef = useRef(0)
  const draggingRef = useRef<{ pointerId: number; x: number; offset: number } | null>(null)
  const pausedRef = useRef(false)

  useEffect(() => {
    const carousel = carouselRef.current
    if (!carousel) return undefined
    let frame = 0
    let previous = 0
    const animate = (time: number) => {
      const track = trackRef.current
      const loopPoint = carousel.querySelector('.collage__row')?.getBoundingClientRect().width ?? 0
      if (previous && track && loopPoint > 0 && !pausedRef.current) {
        offsetRef.current -= Math.min(time - previous, 50) * 0.012
        if (offsetRef.current <= -loopPoint) offsetRef.current += loopPoint
        track.style.transform = `translate3d(${offsetRef.current}px, 0, 0)`
      }
      previous = time
      frame = requestAnimationFrame(animate)
    }
    frame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(frame)
  }, [])

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    const carousel = carouselRef.current
    if (!carousel) return
    draggingRef.current = { pointerId: event.pointerId, x: event.clientX, offset: offsetRef.current }
    pausedRef.current = true
    carousel.setPointerCapture(event.pointerId)
    carousel.classList.add('is-dragging')
  }

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const drag = draggingRef.current
    const carousel = carouselRef.current
    if (!drag || drag.pointerId !== event.pointerId || !carousel) return
    const loopPoint = carousel.querySelector('.collage__row')?.getBoundingClientRect().width ?? 0
    offsetRef.current = drag.offset + (event.clientX - drag.x)
    if (loopPoint > 0) {
      offsetRef.current = ((offsetRef.current % loopPoint) + loopPoint) % loopPoint
      if (offsetRef.current > 0) offsetRef.current -= loopPoint
    }
    if (trackRef.current) trackRef.current.style.transform = `translate3d(${offsetRef.current}px, 0, 0)`
  }

  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    const carousel = carouselRef.current
    if (draggingRef.current?.pointerId !== event.pointerId || !carousel) return
    draggingRef.current = null
    pausedRef.current = false
    carousel.classList.remove('is-dragging')
    if (carousel.hasPointerCapture(event.pointerId)) carousel.releasePointerCapture(event.pointerId)
  }

  return (
    <section id="personajes" className="section theme-light collage" aria-label={copy.title}>
      <div className="container">
        <SectionHeading index="01" eyebrow={copy.eyebrow} title={copy.title} lead={copy.lead} split>
          <p className="collage__count">
            <span className="collage__count-num">{String(characters.length).padStart(2, '0')}</span>
            <span className="label">Artistas</span>
          </p>
        </SectionHeading>

        {/* Retratos opcionales; cuando faltan, SmartImage muestra el nombre. */}
        <div
          ref={carouselRef}
          className="collage__carousel"
          aria-label="Carrusel de artistas; arrastra horizontalmente para recorrerlos"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          onDragStart={(event) => event.preventDefault()}
          onContextMenu={(event) => event.preventDefault()}
        >
          <div ref={trackRef} className="collage__track">
            {[false, true].map((duplicate) => (
              <ul className="collage__row" key={duplicate ? 'duplicate' : 'original'} aria-hidden={duplicate}>
                {characters.map((character, index) => (
                  <li className="collage__item" key={character.id}>
                    <figure className="collage__figure">
                      <SmartImage
                        src={character.preview}
                        alt={duplicate ? '' : `Ilustración de ${character.name}`}
                        placeholderLabel={character.name}
                        index={String(index + 1).padStart(2, '0')}
                        fit="contain"
                        ratio="4 / 5"
                      />
                      <figcaption className="collage__caption">
                        <span className="collage__name">{character.name}</span>
                        {character.tagline ? <span className="collage__tagline">{character.tagline}</span> : null}
                      </figcaption>
                    </figure>
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
