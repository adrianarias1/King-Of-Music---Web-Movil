import { Info, MousePointer2, Move3d } from 'lucide-react'
import { useCallback, useState } from 'react'
import { characters, defaultCharacterId } from '../../data/characters'
import { useInView } from '../../hooks/useInView'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import type { Ability } from '../../types'
import { ErrorBoundary } from '../ui/ErrorBoundary'
import { Reveal } from '../ui/Reveal'
import { SectionHeading } from '../ui/SectionHeading'
import { AbilityModal } from './AbilityModal'
import { ViewerCanvas, type ModelState } from './ViewerCanvas'
import './CharacterViewer.css'

const copy = {
  eyebrow: 'Seleccion',
  title: 'Elige a tu artista',
  lead: 'Arrastra para rotar, usa la rueda o el pellizco para acercar. Cada personaje tiene su propio conjunto de habilidades.',
} as const

const FALLBACK = (
  <div className="viewer-fallback" role="status">
    <span className="label">Visor 3D no disponible en este dispositivo</span>
  </div>
)

export function CharacterViewer() {
  const [activeId, setActiveId] = useState(defaultCharacterId)
  const [ability, setAbility] = useState<Ability | null>(null)
  const [modelState, setModelState] = useState<ModelState>('placeholder')
  const reduced = useReducedMotion()

  // El Canvas se monta cerca del viewport, no al cargar la pagina.
  const { ref: mountRef, inView } = useInView<HTMLDivElement>({
    rootMargin: '300px 0px',
    threshold: 0.01,
  })

  // Pausa el render 3D cuando la seccion sale de pantalla.
  const { ref: activeRef, inView: onScreen } = useInView<HTMLDivElement>({
    rootMargin: '150px 0px',
    threshold: 0.01,
    initialValue: true,
  })

  const character =
    characters.find((item) => item.id === activeId) ?? characters[0]

  const handleModelState = useCallback((state: ModelState) => {
    setModelState(state)
  }, [])

  const handleSelect = useCallback((id: string) => {
    setActiveId(id)
    setAbility(null)
  }, [])

  if (!character) return null

  return (
    <section id="artistas" className="section theme-dark viewer" aria-label={copy.title}>
      <div className="container">
        <SectionHeading index="02" eyebrow={copy.eyebrow} title={copy.title} lead={copy.lead} />

        {/* Selector de personajes */}
        <div className="viewer__selector" role="tablist" aria-label="Seleccionar personaje">
          {characters.map((item, index) => {
            const selected = item.id === activeId
            return (
              <button
                key={item.id}
                type="button"
                role="tab"
                id={`tab-${item.id}`}
                aria-selected={selected}
                aria-controls="viewer-stage"
                className={`viewer__tab${selected ? ' is-active' : ''}`}
                onClick={() => handleSelect(item.id)}
                style={selected ? { ['--tab-accent' as string]: item.accent } : undefined}
              >
                <span className="viewer__tab-num label">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span className="viewer__tab-body">
                  <span className="viewer__tab-name">{item.name}</span>
                  {item.tagline ? <span className="viewer__tab-tag">{item.tagline}</span> : null}
                </span>
              </button>
            )
          })}
        </div>

        {/* Escena + informacion */}
        <div className="viewer__layout" ref={activeRef}>
          <Reveal className="viewer__stage-wrap" direction="left" distance={22}>
            <div
              id="viewer-stage"
              ref={mountRef}
              className="viewer__stage"
              role="tabpanel"
              aria-labelledby={`tab-${character.id}`}
              tabIndex={-1}
            >
              <ErrorBoundary label="Visor 3D no disponible" fallback={FALLBACK}>
                {inView ? (
                  <ViewerCanvas
                    character={character}
                    active={onScreen}
                    reduced={reduced}
                    onModelStateChange={handleModelState}
                  />
                ) : (
                  <div className="viewer__placeholder" aria-hidden="true" />
                )}
              </ErrorBoundary>

              <p className="viewer__hint notice notice--inline">
                <Move3d size={14} strokeWidth={1.5} aria-hidden="true" />
                Arrastra para rotar
              </p>

              {modelState === 'placeholder' ? (
                <p className="viewer__model-notice notice">
                  <Info size={14} strokeWidth={1.5} aria-hidden="true" />
                  Modelo provisional — pendiente <code>{character.model}</code>
                </p>
              ) : null}
            </div>
          </Reveal>

          <Reveal className="viewer__info" direction="right" distance={22} delay={0.08}>
            <p className="label viewer__info-kicker">{character.tagline ?? 'Artista'}</p>
            <h3 className="viewer__name">{character.name}</h3>
            <p className="viewer__desc">{character.description}</p>

            <h4 className="label viewer__abilities-title">
              Habilidades
              <span className="viewer__abilities-count">
                {String(character.abilities.length).padStart(2, '0')}
              </span>
            </h4>

            <ul className="viewer__abilities">
              {character.abilities.map((entry) => (
                <li key={entry.id}>
                  <button
                    type="button"
                    className="ability"
                    onClick={() => setAbility(entry)}
                    aria-haspopup="dialog"
                  >
                    <span className="ability__main">
                      <span className="ability__name">{entry.name}</span>
                      {entry.combo ? <span className="ability__combo">{entry.combo}</span> : null}
                    </span>
                    <MousePointer2
                      className="ability__cue"
                      size={15}
                      strokeWidth={1.5}
                      aria-hidden="true"
                    />
                  </button>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>

      <AbilityModal ability={ability} characterName={character.name} onClose={() => setAbility(null)} />
    </section>
  )
}