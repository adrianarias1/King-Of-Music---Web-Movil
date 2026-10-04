import type { Location } from '../types'

/* ==========================================================================
   ESCENARIOS / MAPA
   --------------------------------------------------------------------------
   El mapa es CONCEPTUAL: es una imagen del juego, no un mapa geografico real.
   No se usa ninguna API externa.

   `x` y `y` son porcentajes (0-100) respecto al ancho y alto de la imagen
   del mapa en public/images/map.png

   COMO AGREGAR O MOVER UN LUGAR:
     - Edita x / y hasta que el punto caiga sobre el lugar correcto.
     - Cambia name y description.
     - Opcionalmente agrega image: '/images/locations/<id>.png'

   NOTA: Palacio de Bellas Artes, Palacio Nacional y Forostage Arena
   son placeholders funcionales de prueba.
   ========================================================================== */

export const locations: Location[] = [
  {
    id: 'palacio-bellas-artes',
    name: 'La Madrugadora',
    description:
      'Punto de partida del torneo. La explanada funciona como arena tutorial y presenta a los artistas antes de la primera ronda.',
    x: 26.5,
    y: 69.5,
    image: '/images/locations/madrugadora.png',
  },
  {
    id: 'palacio-nacional',
    name: 'Bellas Artes',
    description:
      'Escenario principal de la ronda final. Zocalo amplio, publico denso y las mejores condiciones acusticas del juego.',
    x: 35.4,
    y: 36.8,
    image: '/images/locations/bellas-artes.png',
  },
  {
    id: 'arena-forostage',
    name: 'Zócalo',
    description:
      'Arena cerrada construida para el torneo. Escenario nocturno con gradas cercanas al ring.',
    x: 74.8,
    y: 69.5,
    image: '/images/locations/zocalo.png',
  },
  
]

export const defaultLocationId = locations[0]?.id ?? ''

export function getLocation(id: string): Location | undefined {
  return locations.find((location) => location.id === id)
}