import type { Location } from '../types'

/* ==========================================================================
   ESCENARIOS / MAPA
   --------------------------------------------------------------------------
   El mapa es CONCEPTUAL: es una imagen del juego, no un mapa geografico real.
   No se usa ninguna API externa.

   `x` y `y` son porcentajes (0-100) respecto al ancho y alto de la imagen
   del mapa en public/images/map.jpg

   COMO AGREGAR O MOVER UN LUGAR:
     - Edita x / y hasta que el punto caiga sobre el lugar correcto.
     - Cambia name y description.
     - Opcionalmente agrega image: '/images/locations/<id>.jpg'

   NOTA: Palacio de Bellas Artes, Palacio Nacional y Forostage Arena
   son placeholders funcionales de prueba.
   ========================================================================== */

export const locations: Location[] = [
  {
    id: 'palacio-bellas-artes',
    name: 'Palacio de Bellas Artes',
    description:
      'Punto de partida del torneo. La explanada funciona como arena tutorial y presenta a los artistas antes de la primera ronda.',
    x: 22,
    y: 63,
    image: '/images/locations/palacio-bellas-artes.jpg',
  },
  {
    id: 'palacio-nacional',
    name: 'Palacio Nacional',
    description:
      'Escenario principal de la ronda final. Zocalo amplio, publico denso y las mejores condiciones acusticas del juego.',
    x: 56,
    y: 27,
    image: '/images/locations/palacio-nacional.jpg',
  },
  {
    id: 'arena-forostage',
    name: 'Forostage Arena',
    description:
      'Arena cerrada construida para el torneo. Escenario nocturno con gradas cercanas al ring.',
    x: 78,
    y: 68,
    image: '/images/locations/arena-forostage.jpg',
  },
  {
    id: 'estacion-norte',
    name: 'Estacion del Norte',
    description:
      'Zona de duelos rapidos. Menos espacio y menos pausa: un escenario de resistencia.',
    x: 38,
    y: 82,
    image: '/images/locations/estacion-norte.jpg',
  },
]

export const defaultLocationId = locations[0]?.id ?? ''

export function getLocation(id: string): Location | undefined {
  return locations.find((location) => location.id === id)
}