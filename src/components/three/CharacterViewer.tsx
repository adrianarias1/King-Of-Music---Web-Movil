import { ChevronLeft, ChevronRight, Info, MousePointer2, Move3d } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { characters, defaultCharacterId } from '../../data/characters'
import { useInView } from '../../hooks/useInView'
import type { Ability, Combo } from '../../types'
import { ErrorBoundary } from '../ui/ErrorBoundary'
import { Reveal } from '../ui/Reveal'
import { SectionHeading } from '../ui/SectionHeading'
import { AbilityModal } from './AbilityModal'
import type { MoveDetail } from './AbilityModal'
import { ViewerCanvas, type ModelState } from './ViewerCanvas'
import { clearModel, isModelPrepared, preloadModel } from './gltfModelCache'
import './CharacterViewer.css'

const copy = {
  eyebrow: 'Seleccion',
  title: 'Elige a tu artista',
  lead: 'Arrastra para girar cada modelo en cualquier dirección y usa la rueda o pellizca para acercarte. Doble toque para restablecer la vista.',
} as const

export function CharacterViewer() {
  const [activeId, setActiveId] = useState(defaultCharacterId)
  const [move, setMove] = useState<MoveDetail | null>(null)

  // ---------------------------------------------------------
  // Selector horizontal: flechas para recorrerlo con el mouse
  // ---------------------------------------------------------
  const selectorRef = useRef<HTMLDivElement>(null)
  const [canScroll, setCanScroll] = useState({ left: false, right: false })

  const updateScrollState = useCallback(() => {
    const node = selectorRef.current
    if (!node) return
    const max = node.scrollWidth - node.clientWidth
    const next = { left: node.scrollLeft > 4, right: node.scrollLeft < max - 4 }
    setCanScroll((prev) => (prev.left === next.left && prev.right === next.right ? prev : next))
  }, [])

  useEffect(() => {
    const node = selectorRef.current
    if (!node) return undefined
    updateScrollState()
    const observer = new ResizeObserver(updateScrollState)
    observer.observe(node)
    return () => observer.disconnect()
  }, [updateScrollState])

  /** Desplaza el selector ~80 % de su ancho visible. */
  const scrollSelector = (direction: -1 | 1) => {
    const node = selectorRef.current
    if (!node) return
    node.scrollBy({ left: direction * node.clientWidth * 0.8, behavior: 'smooth' })
  }

  // El personaje elegido siempre queda completo a la vista (solo se
  // desplaza el selector, nunca la página).
  useEffect(() => {
    const node = selectorRef.current
    const tab = node?.querySelector<HTMLElement>(`#tab-${activeId}`)
    if (!node || !tab) return
    const left = tab.offsetLeft - node.offsetLeft
    const right = left + tab.offsetWidth
    if (left < node.scrollLeft) node.scrollTo({ left: left - 8, behavior: 'smooth' })
    else if (right > node.scrollLeft + node.clientWidth) {
      node.scrollTo({ left: right - node.clientWidth + 8, behavior: 'smooth' })
    }
  }, [activeId])

  const openAbility = (entry: Ability) =>
    setMove({ kind: 'Habilidad', id: entry.id, name: entry.name, description: entry.description, keys: entry.combo, media: entry.media, preview: entry.preview })
  const openCombo = (entry: Combo, characterName: string) =>
    setMove({ kind: 'Combo', id: entry.id, name: entry.name, description: `Secuencia de ataques encadenados de ${characterName}.`, keys: entry.keys, media: entry.media })
  const [loadAttempt, setLoadAttempt] = useState(0)
  const [modelStates, setModelStates] = useState<Partial<Record<string, ModelState>>>({})

  // El Canvas se monta cerca del viewport, no al cargar la pagina.
  const { ref: mountRef, inView } = useInView<HTMLDivElement>({
    rootMargin: '300px 0px',
    threshold: 0.01,
  })
  // Una vez montado, el Canvas se conserva aunque la sección salga de
  // pantalla. Se actualiza durante el render (patrón recomendado por
  // React para estado derivado) en lugar de un efecto adicional.
  const [hasMounted, setHasMounted] = useState(inView)
  if (inView && !hasMounted) setHasMounted(true)

  // Pausa el render 3D cuando la seccion sale de pantalla.
  const { ref: activeRef, inView: onScreen } = useInView<HTMLDivElement>({
    rootMargin: '150px 0px',
    threshold: 0.01,
    initialValue: true,
  })

  const character =
    characters.find((item) => item.id === activeId) ?? characters[0]
  const prepared = character?.model ? isModelPrepared(character.model) : false
  const modelState: ModelState = !character?.model
    ? 'placeholder'
    : prepared
      ? 'loaded'
      : modelStates[character.id] === 'loaded'
        ? 'loading'
        : modelStates[character.id] ?? 'loading'

  const handleModelState = useCallback((state: ModelState) => {
    setModelStates((previous) => ({ ...previous, [activeId]: state }))
  }, [activeId])

  const handleSelect = useCallback((id: string) => {
    setActiveId(id)
    const next = characters.find((item) => item.id === id)
    setModelStates((previous) => ({ ...previous, [id]: !next?.model ? 'placeholder' : isModelPrepared(next.model) ? 'loaded' : 'loading' }))
    setMove(null)
    setLoadAttempt(0)
  }, [])

  const retryModel = useCallback(() => {
    if (character?.model) clearModel(character.model)
    if (character) setModelStates((previous) => ({ ...previous, [character.id]: 'loading' }))
    setLoadAttempt((attempt) => attempt + 1)
  }, [character])

  useEffect(() => {
    if (!character?.model || !onScreen || modelState !== 'loaded' || !navigator.onLine) return
    const connection = (navigator as Navigator & { connection?: { effectiveType?: string; saveData?: boolean } }).connection
    if (connection?.saveData || ['slow-2g', '2g', '3g'].includes(connection?.effectiveType ?? '')) return
    const mobile = /android|iphone|ipad|ipod/i.test(navigator.userAgent)
    const count = mobile ? (connection?.effectiveType === '4g' ? 1 : 0) : 1
    const current = characters.findIndex((item) => item.id === character.id)
    for (let offset = 1, loaded = 0; offset < characters.length && loaded < count; offset += 1) {
      const next = characters[(current + offset) % characters.length]
      if (next?.model && !isModelPrepared(next.model)) { preloadModel(next.model); loaded += 1 }
    }
  }, [character, modelState, onScreen])

  if (!character) return null

  return (
    <section id="artistas" className="section theme-dark viewer" aria-label={copy.title}>
      <div className="container">
        <SectionHeading index="02" eyebrow={copy.eyebrow} title={copy.title} lead={copy.lead} />

        {/* Selector de personajes (con flechas para recorrerlo con el mouse) */}
        <div className={`viewer__selector-wrap${canScroll.left ? ' can-left' : ''}${canScroll.right ? ' can-right' : ''}`}>
          <button
            type="button"
            className="viewer__selector-arrow viewer__selector-arrow--prev"
            onClick={() => scrollSelector(-1)}
            disabled={!canScroll.left}
            aria-label="Ver personajes anteriores"
            tabIndex={-1}
          >
            <ChevronLeft size={20} strokeWidth={1.6} aria-hidden="true" />
          </button>
          <div
            ref={selectorRef}
            className="viewer__selector"
            role="tablist"
            aria-label="Seleccionar personaje"
            onScroll={updateScrollState}
          >
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
          <button
            type="button"
            className="viewer__selector-arrow viewer__selector-arrow--next"
            onClick={() => scrollSelector(1)}
            disabled={!canScroll.right}
            aria-label="Ver más personajes"
            tabIndex={-1}
          >
            <ChevronRight size={20} strokeWidth={1.6} aria-hidden="true" />
          </button>
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
              <ErrorBoundary
                key={`${character.id}-${loadAttempt}`}
                label="Visor 3D no disponible"
                fallback={
                  <div className="viewer-fallback" role="status">
                    <span className="label">No se pudo cargar el modelo.</span>
                    <button type="button" onClick={retryModel}>Reintentar</button>
                  </div>
                }
              >
                {hasMounted ? (
                  <ViewerCanvas
                    character={character}
                    modelState={modelState}
                    active={onScreen}
                    onModelStateChange={handleModelState}
                  />
                ) : (
                  <div className="viewer__placeholder" aria-hidden="true" />
                )}
              </ErrorBoundary>

              <p className="viewer__hint notice notice--inline">
                <Move3d size={14} strokeWidth={1.5} aria-hidden="true" />
                <span>Arrastra para girar</span>
                <span className="viewer__hint-zoom">· Rueda para zoom</span>
                <span className="viewer__hint-pinch">· Pellizca para zoom</span>
              </p>

              {modelState === 'placeholder' ? (
                <p className="viewer__model-notice notice">
                  <Info size={14} strokeWidth={1.5} aria-hidden="true" />
                  Modelo provisional — pendiente{' '}
                  {character.model ? <code>{character.model}</code> : 'archivo 3D'}
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
                    onClick={() => openAbility(entry)}
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

            {character.combos?.length ? (
              <>
                <h4 className="label viewer__abilities-title viewer__combos-title">
                  Combos
                  <span className="viewer__abilities-count">
                    {String(character.combos.length).padStart(2, '0')}
                  </span>
                </h4>

                <ul className="viewer__abilities">
                  {character.combos.map((entry) => (
                    <li key={entry.id}>
                      <button
                        type="button"
                        className="ability"
                        onClick={() => openCombo(entry, character.name)}
                        aria-haspopup="dialog"
                      >
                        <span className="ability__main">
                          <span className="ability__name">{entry.name}</span>
                          {entry.keys ? <span className="ability__combo">{entry.keys}</span> : null}
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
              </>
            ) : null}
          </Reveal>
        </div>
      </div>

      <AbilityModal move={move} characterName={character.name} onClose={() => setMove(null)} />
    </section>
  )
}
