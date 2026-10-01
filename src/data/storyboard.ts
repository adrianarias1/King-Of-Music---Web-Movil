import type { StoryboardPage } from '../types'

/* ==========================================================================
   STORYBOARD / HISTORIA
   --------------------------------------------------------------------------
   Las imagenes definitivas todavia NO existen.
   Colocar cada pagina en public/images/storyboard/<id>.jpg
   Sin imagen, el componente dibuja un placeholder con el mismo pie de foto.
   ========================================================================== */

export const storyboardPages: StoryboardPage[] = [
  {
    id: 'page-01',
    caption: 'Pagina 1',
    image: '/images/storyboard/page-01.jpg',
    text: 'Todo empieza con un sonido. En una ciudad donde la musica nunca se apaga, alguien decide ponerla en una arena.',
  },
  {
    id: 'page-02',
    caption: 'Pagina 2',
    image: '/images/storyboard/page-02.jpg',
    text: 'Los artistas aparecen uno por uno. Cada uno trae un estilo, un ritmo y una razon para pelear.',
  },
  {
    id: 'page-03',
    caption: 'Pagina 3',
    image: '/images/storyboard/page-03.jpg',
    text: 'El torneo toma forma. Los escenarios se vuelven parte del combate: cada lugar tiene su propio sonido.',
  },
  {
    id: 'page-04',
    caption: 'Pagina 4',
    image: '/images/storyboard/page-04.jpg',
    text: 'Rival a rival, ronda a ronda. Solo uno puede subir al escenario principal.',
  },
  {
    id: 'page-05',
    caption: 'Pagina 5',
    image: '/images/storyboard/page-05.jpg',
    text: 'El ultimo acorde define al campeon. King of Music.',
  },
  {
    id: 'page-06',
    caption: 'Pagina 6',
    image: '/images/storyboard/page-06.jpg',
    text: 'Fin del primer capitulo.',
  },
]

export const storyIntro = {
  title: 'Historia',
  lead: 'El torneo que convierte cada cancion en una pelea. Asi empieza King of Music.',
} as const