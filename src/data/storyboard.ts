import type { StoryboardPage } from '../types'

/* ==========================================================================
   STORYBOARD / HISTORIA
   --------------------------------------------------------------------------
   Fuente: documento del proyecto, apartado "Storyboard de la historia".
   El orden de las páginas sigue las escenas del documento (el documento no
   incluye las escenas 9 y 10). Una escena puede ocupar varias páginas.

   Imágenes: public/images/storyboard/scene-NN.webp (1600 x 900, WebP).
   Sin imagen, el componente dibuja un placeholder con el mismo pie de foto.
   ========================================================================== */

export const storyboardPages: StoryboardPage[] = [
  {
    id: 'scene-01',
    scene: 1,
    caption: 'Anuncio del torneo',
    image: '/images/storyboard/scene-01.webp',
    text: 'En un México alternativo, el país entero se detiene: una transmisión nacional está a punto de comenzar.',
  },
  {
    id: 'scene-02',
    scene: 1,
    caption: 'Una transmisión nacional',
    image: '/images/storyboard/scene-02.webp',
    text: 'Pantallas en calles y plazas anuncian el Gran Torneo Nacional de Música, presentado como una celebración de la cultura mexicana.',
  },
  {
    id: 'scene-03',
    scene: 1,
    caption: 'La convocatoria',
    image: '/images/storyboard/scene-03.webp',
    text: 'Se anuncia que seis representantes competirán para decidir qué género musical seguirá representando al país.',
  },
  {
    id: 'scene-04',
    scene: 2,
    caption: 'Presentación de los participantes',
    image: '/images/storyboard/scene-04.webp',
    text: 'Los seis artistas aparecen en pantalla, cada uno con el género musical que representa.',
  },
  {
    id: 'scene-05',
    scene: 2,
    caption: 'Román Ayala y Alex Llora',
    image: '/images/storyboard/scene-05.webp',
    text: 'La música norteña y el rock mexicano: el acordeón y la guitarra se convierten en armas sonoras.',
  },
  {
    id: 'scene-06',
    scene: 2,
    caption: 'José José José y Juan Grabiel',
    image: '/images/storyboard/scene-06.webp',
    text: 'La balada romántica y la balada: la emoción de sus canciones y la potencia de su voz.',
  },
  {
    id: 'scene-07',
    scene: 2,
    caption: 'Natanael Chano y Peso Plomo',
    image: '/images/storyboard/scene-07.webp',
    text: 'Los corridos tumbados y los corridos contemporáneos: velocidad y combinaciones de ataques rápidos.',
  },
  {
    id: 'scene-08',
    scene: 3,
    caption: 'Llegada a la arena',
    image: '/images/storyboard/scene-08.webp',
    text: 'Los participantes entran a una arena gigantesca, llena de público, luces, pantallas y bocinas.',
  },
  {
    id: 'scene-09',
    scene: 3,
    caption: 'Las puertas se cierran',
    image: '/images/storyboard/scene-09.webp',
    text: 'Las puertas de la arena se cierran detrás de ellos. Ya no hay vuelta atrás.',
  },
  {
    id: 'scene-10',
    scene: 4,
    caption: 'Revelación de las reglas',
    image: '/images/storyboard/scene-10.webp',
    text: 'Las pantallas revelan la verdad: cada artista representa la existencia de su género. Si pierde, su género será vetado para siempre.',
  },
  {
    id: 'scene-11',
    scene: 5,
    caption: 'Primer combate y veto musical',
    image: '/images/storyboard/scene-11.webp',
    text: 'El primer combate termina con una derrota. Las pantallas se apagan, los instrumentos pierden su sonido y el género queda eliminado.',
  },
  {
    id: 'scene-12',
    scene: 7,
    caption: 'Nuevos escenarios',
    image: '/images/storyboard/scene-12.webp',
    text: 'El torneo avanza por distintos escenarios musicales. Cada victoria desbloquea una nueva parte de la historia.',
  },
  {
    id: 'scene-13',
    scene: 8,
    caption: 'El público interviene',
    image: '/images/storyboard/scene-13.webp',
    text: 'En todo el país, el público apoya a sus géneros favoritos y sus canciones impulsan a los participantes.',
  },
  {
    id: 'scene-14',
    scene: 11,
    caption: 'Últimos participantes',
    image: '/images/storyboard/scene-14.webp',
    text: 'Cada victoria elimina otro género. Al final, solamente queda un participante.',
  },
  {
    id: 'scene-15',
    scene: 12,
    caption: 'El jefe final',
    image: '/images/storyboard/scene-15.webp',
    text: 'En la arena transformada aguarda el jefe final, que reúne los géneros eliminados. La batalla decidirá el destino de toda la música.',
  },
]

export const storyIntro = {
  title: 'Historia',
  lead: 'En un México alternativo, el Torneo del Bienestar convierte cada derrota en la pérdida de un género musical.',
  /** Sinopsis tomada del apartado "Historia del videojuego" del documento. */
  synopsis: [
    'En este universo alternativo, el gobierno considera que la existencia de una gran cantidad de géneros musicales ha provocado una división entre generaciones y regiones del país. Como solución a esta situación se anuncia un evento nacional denominado “Torneo del Bienestar”, presentado inicialmente como un espectáculo destinado a celebrar la cultura mexicana.',
    'La competencia parece inicialmente un espectáculo musical convencional. Sin embargo, los participantes descubren que las reglas son mucho más macabras de lo que imaginaban: cada artista representa la existencia de su género musical y, cuando un participante es derrotado, el género al que representa es vetado de este México alternativo.',
  ],
} as const
