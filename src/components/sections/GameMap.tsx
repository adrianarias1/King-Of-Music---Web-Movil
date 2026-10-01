import { MapPin } from 'lucide-react'
import { useCallback, useState } from 'react'
import { locations } from '../../data/locations'
import { SmartImage } from '../ui/SmartImage'
import './GameMap.css'

interface Props {
  /** Imagen del mapa. Sin archivo, se dibuja un mapa esquematico con CSS. */
  mapImage?: string | undefined
}

const copy = {
  eyebrow: 'Escenarios',
  title: 'Mapa del juego',
  lead: 'El torneo recorre los simbolos culturales de la ciudad. Selecciona un lugar para ver sus detalles.',
} as const

/**
 * Mapa conceptual del videojuego.
 *
 * - No usa Google Maps, Mapbox, Leaflet ni ninguna API externa.
 * - Es una imagen (o un esquema hecho con CSS) + hotspots posicionados
 *   en porcentajes X/Y definidos en src/data/locations.ts
 *
 * ASSET PENDIENTE: public/images/map.jpg
 */
export function GameMap({ mapImage }: Props) {
  const [selectedId, setSelectedId] = useState(locations[0]?.id ?? '')
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  const selected = locations.find((item) => item.id === selectedId)

  const select = useCallback((id: string) => setSelectedId(id), [])

  return (
    <section id="mapa" className="section theme-dark map" aria-label={copy.title}>
      <div className="container">
        <div className="map__head">
          <div>
            <p className="section-head__index label">
              <span>05</span>
              <span aria-hidden="true">/</span>
              <span>{copy.eyebrow}</span>
            </p>
            <h2 className="title">{copy.title}</h2>
            <p className="lead">{copy.lead}</p>
          </div>

          <ul className="map__legend" aria-label="Lugares del mapa">
            {locations.map((location) => {
              const active = location.id === selectedId
              return (
                <li key={location.id}>
                  <button
                    type="button"
                    className={`map__legend-item${active ? ' is-active' : ''}`}
                    onClick={() => select(location.id)}
                    aria-pressed={active}
                  >
                    <MapPin size={14} strokeWidth={1.5} aria-hidden="true" />
                    <span>{location.name}</span>
                  </button>
                </li>
              )
            })}
          </ul>
        </div>

        <div className="map__layout">
          {/* Mapa + hotspots */}
          <div className="map__canvas">
            {mapImage ? (
              <img
                className="map__img"
                src={mapImage}
                alt="Mapa del juego"
                loading="lazy"
                decoding="async"
              />
            ) : (
              <div className="map__schematic" role="img" aria-label="Mapa esquematico provisional">
                <span className="map__grid" aria-hidden="true" />
                <span className="map__schematic-label label">Mapa provisional</span>
                <span className="map__schematic-sub">
                  Reemplazar con public/images/map.jpg
                </span>
              </div>
            )}

            {/* Hotspots posicionados en % sobre la imagen */}
            {locations.map((location) => {
              const active = location.id === selectedId
              const hovered = location.id === hoveredId
              return (
                <button
                  key={location.id}
                  type="button"
                  className={`map__hotspot${active ? ' is-active' : ''}${hovered ? ' is-hovered' : ''}`}
                  style={{ left: `${location.x}%`, top: `${location.y}%` }}
                  onClick={() => select(location.id)}
                  onMouseEnter={() => setHoveredId(location.id)}
                  onMouseLeave={() => setHoveredId((current) =>
                    current === location.id ? null : current,
                  )}
                  onFocus={() => setHoveredId(location.id)}
                  onBlur={() => setHoveredId((current) =>
                    current === location.id ? null : current,
                  )}
                  aria-label={`${location.name}. Ver detalles.`}
                  aria-pressed={active}
                >
                  <span className="map__hotspot-dot" aria-hidden="true" />
                  <span className="map__hotspot-label">{location.name}</span>
                </button>
              )
            })}
          </div>

          {/* Panel de detalle */}
          <aside className="map__panel" aria-live="polite">
            {selected ? (
              <>
                <SmartImage
                  src={selected.image}
                  alt={`Imagen de ${selected.name}`}
                  placeholderLabel={selected.name}
                  ratio="4 / 3"
                />
                <h3 className="map__panel-name">{selected.name}</h3>
                <p className="map__panel-desc">{selected.description}</p>
                <dl className="map__panel-meta">
                  <div>
                    <dt className="label">ID</dt>
                    <dd>{selected.id}</dd>
                  </div>
                  <div>
                    <dt className="label">Coords</dt>
                    <dd>
                      {Math.round(selected.x)}% / {Math.round(selected.y)}%
                    </dd>
                  </div>
                </dl>
              </>
            ) : (
              <p className="notice">Selecciona un lugar del mapa</p>
            )}
          </aside>
        </div>
      </div>
    </section>
  )
}