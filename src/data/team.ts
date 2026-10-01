import type { TeamMember } from '../types'

/* ==========================================================================
   EQUIPO
   --------------------------------------------------------------------------
   Placeholders: los integrantes reales se anaden aqui.
   Para activar una foto: coloca el archivo en
       public/images/team/<id>.jpg
   ========================================================================== */

export const team: TeamMember[] = [
  {
    id: 'miembro-01',
    name: 'Nombre Apellido',
    role: 'Programacion',
    image: '/images/team/miembro-01.jpg',
    links: [{ label: 'GitHub', href: '', icon: 'github' }],
  },
  {
    id: 'miembro-02',
    name: 'Nombre Apellido',
    role: 'Arte 3D y Modelado',
    image: '/images/team/miembro-02.jpg',
  },
  {
    id: 'miembro-03',
    name: 'Nombre Apellido',
    role: 'Animacion',
    image: '/images/team/miembro-03.jpg',
  },
  {
    id: 'miembro-04',
    name: 'Nombre Apellido',
    role: 'Diseno y UI',
    image: '/images/team/miembro-04.jpg',
  },
  {
    id: 'miembro-05',
    name: 'Nombre Apellido',
    role: 'Audio y Musica',
    image: '/images/team/miembro-05.jpg',
  },
  {
    id: 'miembro-06',
    name: 'Nombre Apellido',
    role: 'Game Design',
    image: '/images/team/miembro-06.jpg',
  },
]

/* ==========================================================================
   ASIGNATURA / PROYECTO
   ========================================================================== */

export const projectMeta = {
  type: 'Proyecto universitario',
  repository: 'https://github.com/adrianarias1/King-Of-Music---Web-Movil',
} as const