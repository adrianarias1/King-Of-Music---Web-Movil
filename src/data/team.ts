import type { TeamMember } from '../types'

/* ==========================================================================
   EQUIPO
   --------------------------------------------------------------------------
   Fuente: portada del documento del proyecto (alumnos) y roles confirmados
   por el equipo.
   Para activar una foto: coloca el archivo en public/images/team/<id>.jpg
   Mientras no exista, la tarjeta muestra un placeholder.
   ========================================================================== */

export const team: TeamMember[] = [
  {
    id: 'cristopher-larios',
    name: 'Cristopher Larios García',
    role: 'Programación en Unity',
    description:
      'Desarrollo del videojuego en Unity: mecánicas de combate, integración de recursos y programación en C#.',
    image: '/images/team/cristopher-larios.jpg',
  },
  {
    id: 'carlos-lopez',
    name: 'Carlos Eduardo López Castillo',
    role: 'Desarrollador Backend',
    description: 'Sistema de reseñas y sesiones de usuario del sitio con Supabase.',
    image: '/images/team/carlos-lopez.jpg',
  },
  {
    id: 'adrian-arias',
    name: 'Adrián de Jesús Pérez Arias',
    role: 'Diseño gráfico · App móvil y PWA',
    description:
      'Recursos gráficos en Photoshop y conversión de la aplicación web en app móvil y aplicación web progresiva.',
    image: '/images/team/adrian-arias.jpg',
  },
  {
    id: 'yoel-ramos',
    name: 'Yoel Guadalupe Ramos Rivera',
    role: 'Desarrollador Web',
    description: 'Codificación del esqueleto principal de la página web.',
    image: '/images/team/yoel-ramos.jpg',
  },
  {
    id: 'gael-zamora',
    name: 'Enrique Gael Zamora Partida',
    role: 'Música y animación web',
    description:
      'Música y efectos de sonido en FL Studio, y animaciones del sitio con GSAP y ScrollTrigger.',
    image: '/images/team/gael-zamora.jpg',
  },
]

/* ==========================================================================
   ASIGNATURA / PROYECTO
   ========================================================================== */

export const projectMeta = {
  type: 'Proyecto universitario',
  subject: 'Creación de Videojuegos',
  group: 'IDGS-101',
  teacher: 'Ing. Juan Manuel Tovar Sánchez',
  repository: 'https://github.com/adrianarias1/King-Of-Music---Web-Movil',
} as const
