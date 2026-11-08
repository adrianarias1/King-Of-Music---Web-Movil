
import {
  MapPin,
  Maximize2,
  RotateCcw,
} from 'lucide-react'

import {
  useCallback,
  useState,
} from 'react'

import { useReducedMotion } from 'motion/react'

import { locations } from '../../data/locations'
import { Modal } from '../ui/Modal'
import { SmartImage } from '../ui/SmartImage'

import { useI18n } from '../../i18n'

import './GameMap.css'

// =========================================================
// KING OF MUSIC — MAPA INTERACTIVO V2
//
// Nuevas características:
// - Selección de escenarios.
// - Zoom cinematográfico reversible.
// - Movimiento suave entre ubicaciones.
// - Botón para restaurar la vista general.
// - Compatible con ratón, teclado y pantallas táctiles.
// - Conserva el panel de información.
// - Conserva la ampliación de imágenes.
// - Preparado para la identidad dorada.
// =========================================================

interface Props {
  mapImage?: string | undefined
}


// =========================================================
// CONFIGURACIÓN DE CÁMARA
//
// Un acercamiento moderado permite que el usuario
// conserve la referencia espacial del mapa.
// =========================================================

const MAP_ZOOM = 1.18

// Limitar el desplazamiento evita que los escenarios
// se alejen demasiado del área visible.

const MAX_PAN_X = 7
const MAX_PAN_Y = 6

function clamp(
  value: number,
  min: number,
  max: number,
) {
  return Math.min(max, Math.max(min, value))
}

// =========================================================
// COMPONENTE PRINCIPAL
// =========================================================

export function GameMap({ mapImage }: Props) {
  const reduced = useReducedMotion()
  const { t, l } = useI18n()
  const copy = t.map

  // =====================================================
  // 1. ESTADOS
  // =====================================================

  // Escenario del panel de información.
  const [selectedId, setSelectedId] = useState(
    locations[0]?.id ?? '',
  )

  // Escenario al que apunta la cámara.
  // null representa la vista general.
  const [focusedId, setFocusedId] = useState<
    string | null
  >(null)

  const [hoveredId, setHoveredId] = useState<
    string | null
  >(null)

  const [lightboxOpen, setLightboxOpen] =
    useState(false)

  // =====================================================
  // 2. ESCENARIOS ACTIVOS
  // =====================================================

  const selected = locations.find(
    (item) => item.id === selectedId,
  )

  const focusedLocation = locations.find(
    (item) => item.id === focusedId,
  )

  const isZoomed = focusedLocation !== undefined

  // =====================================================
  // 3. SELECCIÓN + ZOOM REVERSIBLE
  //
  // Primer clic:
  // selecciona y acerca la cámara.
  //
  // Clic en el mismo escenario:
  // devuelve el mapa a su vista general.
  //
  // Clic en otro escenario:
  // mueve la cámara hacia el nuevo punto.
  // =====================================================

  const select = useCallback((id: string) => {
    setSelectedId(id)

    setFocusedId((current) => {
      if (current === id) {
        return null
      }

      return id
    })
  }, [])

  // =====================================================
  // 4. RESTAURAR VISTA GENERAL
  // =====================================================

  const resetView = useCallback(() => {
    setFocusedId(null)
  }, [])

  // =====================================================
  // 5. MOVIMIENTO DE CÁMARA
  //
  // La transformación se aplica al conjunto del mapa:
  // imagen y puntos interactivos.
  //
  // Esto permite que las ubicaciones acompañen
  // correctamente el movimiento de la fotografía.
  // =====================================================

  let cameraScale = 1
  let cameraX = 0
  let cameraY = 0

  if (focusedLocation && !reduced) {
    cameraScale = MAP_ZOOM

    // Desplazamiento proporcional a la posición
    // de la ubicación seleccionada.
    //
    // Se limita deliberadamente para no perder
    // de vista el resto del mapa.

    cameraX = clamp(
      (50 - focusedLocation.x) * 0.28,
      -MAX_PAN_X,
      MAX_PAN_X,
    )

    cameraY = clamp(
      (50 - focusedLocation.y) * 0.28,
      -MAX_PAN_Y,
      MAX_PAN_Y,
    )
  }

  // =====================================================
  // 6. MODAL DEL ESCENARIO
  // =====================================================

  const openLightbox = useCallback(() => {
    setLightboxOpen(true)
  }, [])

  const closeLightbox = useCallback(() => {
    setLightboxOpen(false)
  }, [])

  // =====================================================
  // 7. INTERFAZ
  // =====================================================

  return (
    <section
      id="mapa"
      className="section theme-dark map"
      aria-label={copy.title}
    >
      <div className="container">

        {/* ===============================================
            ENCABEZADO
            =============================================== */}

        <div className="map__head">
          <div>
            <p className="section-head__index label">
              <span>05</span>

              <span aria-hidden="true">
                /
              </span>

              <span>
                {copy.eyebrow}
              </span>
            </p>

            <h2 className="title">
              {copy.title}
            </h2>

            <p className="lead">
              {copy.lead}
            </p>
          </div>

          {/* =============================================
              SELECTOR DE ESCENARIOS
              ============================================= */}

          <ul
            className="map__legend"
            aria-label={copy.places}
          >
            {locations.map((location) => {
              const active =
                location.id === selectedId

              const focused =
                location.id === focusedId

              return (
                <li key={location.id}>
                  <button
                    type="button"
                    className={[
                      'map__legend-item',
                      active ? 'is-active' : '',
                      focused ? 'is-focused' : '',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                    onClick={() => select(location.id)}
                    aria-pressed={focused}
                    aria-label={
                      focused
                        ? copy.unzoom(l(location.name))
                        : copy.selectZoom(l(location.name))
                    }
                  >
                    <MapPin
                      size={14}
                      strokeWidth={1.5}
                      aria-hidden="true"
                    />

                    <span>
                      {l(location.name)}
                    </span>
                  </button>
                </li>
              )
            })}
          </ul>
        </div>

        {/* ===============================================
            CONTENIDO PRINCIPAL
            =============================================== */}

        <div className="map__layout">

          {/* =============================================
              ÁREA DEL MAPA
              ============================================= */}

          <div
            className={[
              'map__canvas',
              isZoomed ? 'is-zoomed' : '',
            ]
              .filter(Boolean)
              .join(' ')}
          >

            {/* ===========================================
                CAPA DE CÁMARA

                El zoom se aplica a este contenedor,
                nunca a los hotspots por separado.

                La animación se realizará mediante
                CSS transform y transition.
                =========================================== */}

            <div
              className="map__world"
              style={{
                transform: `
                  translate(
                    ${cameraX}%,
                    ${cameraY}%
                  )
                  scale(${cameraScale})
                `,
                transition: reduced
                  ? 'none'
                  : 'transform 850ms cubic-bezier(0.22, 1, 0.36, 1)',
                transformOrigin: '50% 50%',
              }}
            >

              {/* =========================================
                  IMAGEN DEL MAPA
                  ========================================= */}

              {mapImage ? (
                <img
                  className="map__img"
                  src={mapImage}
                  alt={copy.imageAlt}
                  loading="lazy"
                  decoding="async"
                />
              ) : (
                <div
                  className="map__schematic"
                  role="img"
                  aria-label={copy.schematic}
                >
                  <span
                    className="map__grid"
                    aria-hidden="true"
                  />

                  <span className="map__schematic-label label">
                    {copy.provisional}
                  </span>

                  <span className="map__schematic-sub">
                    {copy.replaceHint}
                  </span>
                </div>
              )}

              {/* =========================================
                  HOTSPOTS

                  Mantienen las coordenadas originales
                  de src/data/locations.ts.
                  ========================================= */}

              {locations.map((location) => {
                const active =
                  location.id === selectedId

                const focused =
                  location.id === focusedId

                const hovered =
                  location.id === hoveredId

                return (
                  <button
                    key={location.id}
                    type="button"
                    className={[
                      'map__hotspot',
                      active ? 'is-active' : '',
                      focused ? 'is-focused' : '',
                      hovered ? 'is-hovered' : '',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                    style={{
                      left: `${location.x}%`,
                      top: `${location.y}%`,
                    }}
                    onClick={() => select(location.id)}
                    onMouseEnter={() =>
                      setHoveredId(location.id)
                    }
                    onMouseLeave={() =>
                      setHoveredId((current) =>
                        current === location.id
                          ? null
                          : current,
                      )
                    }
                    onFocus={() =>
                      setHoveredId(location.id)
                    }
                    onBlur={() =>
                      setHoveredId((current) =>
                        current === location.id
                          ? null
                          : current,
                      )
                    }
                    aria-label={
                      focused
                        ? copy.hotspotBack(l(location.name))
                        : copy.hotspotSelect(l(location.name))
                    }
                    aria-pressed={focused}
                  >
                    <span
                      className="map__hotspot-dot"
                      aria-hidden="true"
                    />

                    <span className="map__hotspot-label">
                      {l(location.name)}
                    </span>
                  </button>
                )
              })}
            </div>

            {/* ===========================================
                RESTAURAR CÁMARA

                Se mantiene fuera de map__world
                para no moverse con el zoom.
                =========================================== */}

            {isZoomed && (
              <button
                type="button"
                className="map__reset"
                onClick={resetView}
                aria-label={copy.resetLabel}
                title={copy.overview}
              >
                <RotateCcw
                  size={16}
                  strokeWidth={1.6}
                  aria-hidden="true"
                />

                <span>
                  {copy.overview}
                </span>
              </button>
            )}
          </div>

          {/* =============================================
              PANEL DE INFORMACIÓN
              ============================================= */}

          <aside
            className="map__panel"
            aria-live="polite"
          >
            {selected ? (
              <>
                <div className="map__media">
                  <button
                    type="button"
                    className="map__media-open"
                    onClick={openLightbox}
                    disabled={!selected.image}
                    aria-label={copy.enlarge(l(selected.name))}
                  >
                    <SmartImage
                      src={selected.image}
                      alt={copy.imageOf(l(selected.name))}
                      placeholderLabel={l(selected.name)}
                      ratio="4 / 3"
                      fit="contain"
                    />
                  </button>

                  {selected.image ? (
                    <button
                      type="button"
                      className="map__media-expand"
                      onClick={openLightbox}
                      aria-label={copy.enlarge(l(selected.name))}
                      title={copy.enlargeShort}
                    >
                      <Maximize2
                        size={16}
                        strokeWidth={1.5}
                        aria-hidden="true"
                      />
                    </button>
                  ) : null}
                </div>

                <h3 className="map__panel-name">
                  {l(selected.name)}
                </h3>

                <p className="map__panel-desc">
                  {l(selected.description)}
                </p>
              </>
            ) : (
              <p className="notice">
                {copy.selectPlace}
              </p>
            )}
          </aside>
        </div>
      </div>

      {/* ===============================================
          MODAL DEL ESCENARIO
          =============================================== */}

      <Modal
        open={lightboxOpen}
        onClose={closeLightbox}
        title={selected ? l(selected.name) : ''}
        description={copy.lightbox}
        wide
      >
        <div className="map__lightbox">
          <SmartImage
            src={selected?.image}
            alt={
              selected
                ? copy.lightboxOf(l(selected.name))
                : ''
            }
            ratio="4 / 3"
            fit="contain"
            loading="eager"
          />
        </div>
      </Modal>
    </section>
  )
}
