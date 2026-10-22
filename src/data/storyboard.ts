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
    caption: 'Anuncio del torneo',
    image: '/images/storyboard/page-01.jpg',
    text: 'El gobierno presenta el Torneo del Bienestar como una celebración nacional de la música mexicana.',
  },
  {
    id: 'page-02',
    caption: 'Revelación de las reglas',
    image: '/images/storyboard/page-02.jpg',
    text: 'Los participantes descubren que cada uno representa la existencia de su género y que perder significa su eliminación.',
  },
  {
    id: 'page-03',
    caption: 'Veto musical',
    image: '/images/storyboard/page-03.jpg',
    text: 'Después de cada derrota, canciones, instrumentos y elementos culturales del género vencido comienzan a desaparecer.',
  },
  {
    id: 'page-04',
    caption: 'Batalla final',
    image: '/images/storyboard/page-04.jpg',
    text: 'El último representante debe descubrir el verdadero propósito del torneo y enfrentarse al jefe final.',
  },
]

export const storyIntro = {
  title: 'Historia',
  lead: 'En un México alternativo, el Torneo del Bienestar convierte cada derrota en la pérdida de un género musical.',
} as const
