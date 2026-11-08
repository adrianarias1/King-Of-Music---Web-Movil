import type { Location } from '../types'

/* ==========================================================================
   ESCENARIOS / MAPA
   --------------------------------------------------------------------------
   El mapa es CONCEPTUAL: es una imagen del juego, no un mapa geografico real.
   No se usa ninguna API externa.

   `x` y `y` son porcentajes (0-100) respecto al ancho y alto de la imagen
   del mapa en public/images/map.webp

   COMO AGREGAR O MOVER UN LUGAR:
     - Edita x / y hasta que el punto caiga sobre el lugar correcto.
     - Cambia name y description.
     - Opcionalmente agrega image: '/images/locations/<id>.webp'

   NOTA: Palacio de Bellas Artes, Palacio Nacional y Forostage Arena
   son placeholders funcionales de prueba.
   ========================================================================== */

export const locations: Location[] = [
  {
    id: 'la-madrugadora',
    name: {
      es: 'La Madrugadora',
      en: 'La Madrugadora',
    },
    description: {
      es: 'Escenario inicial y tutorial del Torneo del Bienestar. Un espacio de transmisión gubernamental donde el jugador aprende las mecánicas fundamentales antes de regresar para la batalla final.',
      en: 'Opening stage and tutorial of the Wellbeing Tournament. A government broadcast studio where players learn the core mechanics before returning for the final battle.',
    },
    x: 26.4,
    y: 69.5,
    image: '/images/locations/la-madrugadora.webp',
  },
  {
    id: 'bellas-artes',
    name: {
      es: 'Bellas Artes',
      en: 'Bellas Artes',
    },
    description: {
      es: 'Primera arena completa del torneo. Su plataforma circular, obstáculos e ítems obligan al jugador a controlar con precisión la distancia frente al rival.',
      en: 'The tournament\'s first full arena. Its circular platform, obstacles and items force players to precisely control their distance from the rival.',
    },
    x: 35.3,
    y: 36.5,
    image: '/images/locations/bellas-artes.webp',
  },
  {
    id: 'zocalo-ciudad-de-mexico',
    name: {
      es: 'Zócalo de la Ciudad de México',
      en: 'Mexico City Zócalo',
    },
    description: {
      es: 'Un escenario exterior amplio que favorece el desplazamiento, las persecuciones y los ataques de larga distancia.',
      en: 'A wide outdoor stage that rewards movement, chases and long-range attacks.',
    },
    x: 74.68,
    y: 69.5,
    image: '/images/locations/zocalo.webp',
  },
]

export const defaultLocationId = locations[0]?.id ?? ''

export function getLocation(id: string): Location | undefined {
  return locations.find((location) => location.id === id)
}