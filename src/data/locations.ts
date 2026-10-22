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
    id: 'la-madrugadora',
    name: 'La Madrugadora',
    description:
      'Escenario inicial y tutorial del Torneo del Bienestar. Un espacio de transmisión gubernamental donde el jugador aprende las mecánicas fundamentales antes de regresar para la batalla final.',
    x: 22,
    y: 63,
    image: '/images/locations/la-madrugadora.png',
  },
  {
    id: 'bellas-artes',
    name: 'Bellas Artes',
    description:
      'Primera arena completa del torneo. Su plataforma circular, obstáculos e ítems obligan al jugador a controlar con precisión la distancia frente al rival.',
    x: 56,
    y: 27,
    image: '/images/locations/bellas-artes.png',
  },
  {
    id: 'zocalo-ciudad-de-mexico',
    name: 'Zócalo de la Ciudad de México',
    description:
      'Un escenario exterior amplio que favorece el desplazamiento, las persecuciones y los ataques de larga distancia.',
    x: 78,
    y: 68,
    image: '/images/locations/zocalo.png',
  },
]

export const defaultLocationId = locations[0]?.id ?? ''

export function getLocation(id: string): Location | undefined {
  return locations.find((location) => location.id === id)
}