import type { L, StoryboardPage } from '../types'

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
    caption: {
      es: 'Anuncio del torneo',
      en: 'The tournament is announced',
    },
    image: '/images/storyboard/scene-01.webp',
    text: {
      es: 'En un México alternativo, el país entero se detiene: una transmisión nacional está a punto de comenzar.',
      en: 'In an alternate Mexico, the whole country stops: a national broadcast is about to begin.',
    },
  },
  {
    id: 'scene-02',
    scene: 1,
    caption: {
      es: 'Una transmisión nacional',
      en: 'A national broadcast',
    },
    image: '/images/storyboard/scene-02.webp',
    text: {
      es: 'Pantallas en calles y plazas anuncian el Gran Torneo Nacional de Música, presentado como una celebración de la cultura mexicana.',
      en: 'Screens in streets and plazas announce the Great National Music Tournament, presented as a celebration of Mexican culture.',
    },
  },
  {
    id: 'scene-03',
    scene: 1,
    caption: {
      es: 'La convocatoria',
      en: 'The call',
    },
    image: '/images/storyboard/scene-03.webp',
    text: {
      es: 'Se anuncia que seis representantes competirán para decidir qué género musical seguirá representando al país.',
      en: 'Six representatives will compete to decide which music genre will keep representing the country.',
    },
  },
  {
    id: 'scene-04',
    scene: 2,
    caption: {
      es: 'Presentación de los participantes',
      en: 'Meet the contenders',
    },
    image: '/images/storyboard/scene-04.webp',
    text: {
      es: 'Los seis artistas aparecen en pantalla, cada uno con el género musical que representa.',
      en: 'The six artists appear on screen, each one with the music genre they represent.',
    },
  },
  {
    id: 'scene-05',
    scene: 2,
    caption: {
      es: 'Román Ayala y Alex Llora',
      en: 'Román Ayala and Alex Llora',
    },
    image: '/images/storyboard/scene-05.webp',
    text: {
      es: 'La música norteña y el rock mexicano: el acordeón y la guitarra se convierten en armas sonoras.',
      en: 'Norteño music and Mexican rock: the accordion and the guitar become sonic weapons.',
    },
  },
  {
    id: 'scene-06',
    scene: 2,
    caption: {
      es: 'José José José y Juan Grabiel',
      en: 'José José José and Juan Grabiel',
    },
    image: '/images/storyboard/scene-06.webp',
    text: {
      es: 'La balada romántica y la balada: la emoción de sus canciones y la potencia de su voz.',
      en: 'Romantic ballad and ballad: the emotion of their songs and the power of their voices.',
    },
  },
  {
    id: 'scene-07',
    scene: 2,
    caption: {
      es: 'Natanael Chano y Peso Plomo',
      en: 'Natanael Chano and Peso Plomo',
    },
    image: '/images/storyboard/scene-07.webp',
    text: {
      es: 'Los corridos tumbados y los corridos contemporáneos: velocidad y combinaciones de ataques rápidos.',
      en: 'Corridos tumbados and contemporary corridos: speed and quick attack combos.',
    },
  },
  {
    id: 'scene-08',
    scene: 3,
    caption: {
      es: 'Llegada a la arena',
      en: 'Arrival at the arena',
    },
    image: '/images/storyboard/scene-08.webp',
    text: {
      es: 'Los participantes entran a una arena gigantesca, llena de público, luces, pantallas y bocinas.',
      en: 'The contenders enter a gigantic arena packed with crowds, lights, screens and speakers.',
    },
  },
  {
    id: 'scene-09',
    scene: 3,
    caption: {
      es: 'Las puertas se cierran',
      en: 'The doors close',
    },
    image: '/images/storyboard/scene-09.webp',
    text: {
      es: 'Las puertas de la arena se cierran detrás de ellos. Ya no hay vuelta atrás.',
      en: 'The arena doors close behind them. There is no turning back.',
    },
  },
  {
    id: 'scene-10',
    scene: 4,
    caption: {
      es: 'Revelación de las reglas',
      en: 'The rules are revealed',
    },
    image: '/images/storyboard/scene-10.webp',
    text: {
      es: 'Las pantallas revelan la verdad: cada artista representa la existencia de su género. Si pierde, su género será vetado para siempre.',
      en: 'The screens reveal the truth: each artist embodies the existence of their genre. If they lose, their genre will be banned forever.',
    },
  },
  {
    id: 'scene-11',
    scene: 5,
    caption: {
      es: 'Primer combate y veto musical',
      en: 'First fight and the music ban',
    },
    image: '/images/storyboard/scene-11.webp',
    text: {
      es: 'El primer combate termina con una derrota. Las pantallas se apagan, los instrumentos pierden su sonido y el género queda eliminado.',
      en: 'The first fight ends in defeat. The screens go dark, the instruments fall silent and the genre is wiped out.',
    },
  },
  {
    id: 'scene-12',
    scene: 7,
    caption: {
      es: 'Nuevos escenarios',
      en: 'New stages',
    },
    image: '/images/storyboard/scene-12.webp',
    text: {
      es: 'El torneo avanza por distintos escenarios musicales. Cada victoria desbloquea una nueva parte de la historia.',
      en: 'The tournament moves through different musical stages. Every victory unlocks a new chapter of the story.',
    },
  },
  {
    id: 'scene-13',
    scene: 8,
    caption: {
      es: 'El público interviene',
      en: 'The crowd steps in',
    },
    image: '/images/storyboard/scene-13.webp',
    text: {
      es: 'En todo el país, el público apoya a sus géneros favoritos y sus canciones impulsan a los participantes.',
      en: 'All over the country, fans cheer for their favorite genres and their songs power up the contenders.',
    },
  },
  {
    id: 'scene-14',
    scene: 11,
    caption: {
      es: 'Últimos participantes',
      en: 'The last contenders',
    },
    image: '/images/storyboard/scene-14.webp',
    text: {
      es: 'Cada victoria elimina otro género. Al final, solamente queda un participante.',
      en: 'Every victory wipes out another genre. In the end, only one contender remains.',
    },
  },
  {
    id: 'scene-15',
    scene: 12,
    caption: {
      es: 'El jefe final',
      en: 'The final boss',
    },
    image: '/images/storyboard/scene-15.webp',
    text: {
      es: 'En la arena transformada aguarda el jefe final, que reúne los géneros eliminados. La batalla decidirá el destino de toda la música.',
      en: 'In the transformed arena awaits the final boss, who wields the eliminated genres. This battle will decide the fate of all music.',
    },
  },
]

export const storyIntro: { title: L; lead: L; synopsis: readonly L[] } = {
  title: {
    es: 'Historia',
    en: 'Story',
  },
  lead: {
    es: 'En un México alternativo, el Torneo del Bienestar convierte cada derrota en la pérdida de un género musical.',
    en: 'In an alternate Mexico, the Wellbeing Tournament turns every defeat into the loss of a music genre.',
  },
  /** Sinopsis tomada del apartado "Historia del videojuego" del documento. */
  synopsis: [
    {
      es: 'En este universo alternativo, el gobierno considera que la existencia de una gran cantidad de géneros musicales ha provocado una división entre generaciones y regiones del país. Como solución a esta situación se anuncia un evento nacional denominado “Torneo del Bienestar”, presentado inicialmente como un espectáculo destinado a celebrar la cultura mexicana.',
      en: 'In this alternate universe, the government believes that having so many music genres has divided the country across generations and regions. As a solution, it announces a national event called the “Wellbeing Tournament”, first presented as a show meant to celebrate Mexican culture.',
    },
    {
      es: 'La competencia parece inicialmente un espectáculo musical convencional. Sin embargo, los participantes descubren que las reglas son mucho más macabras de lo que imaginaban: cada artista representa la existencia de su género musical y, cuando un participante es derrotado, el género al que representa es vetado de este México alternativo.',
      en: 'At first, the competition looks like an ordinary music show. But the contenders soon discover that the rules are far more sinister than they imagined: each artist embodies the existence of their music genre and, when a contender is defeated, the genre they represent is banned from this alternate Mexico.',
    },
  ],
}
