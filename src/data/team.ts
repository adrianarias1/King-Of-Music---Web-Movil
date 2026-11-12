import type { TeamMember } from '../types'

/* ==========================================================================
   EQUIPO
   --------------------------------------------------------------------------
   Fuente: portada del documento del proyecto (alumnos) y roles confirmados
   por el equipo.
   Fotos: public/images/team/<id>.webp (800 × 800, recortadas en cuadrado).
   Mientras no exista, la tarjeta muestra un placeholder.
   ========================================================================== */

export const team: TeamMember[] = [
  {
    id: 'carlos-lopez',
    name: 'Carlos Eduardo López Castillo',
    role: {
      es: 'Desarrollador Backend',
      en: 'Backend developer',
    },
    description: {
      es: 'Sistema de reseñas y sesiones de usuario del sitio con Supabase.',
      en: 'The site\'s review system and user sessions with Supabase.',
    },
    image: '/images/team/carlos-lopez.webp',
  },
  {
    id: 'adrian-arias',
    name: 'Adrián de Jesús Pérez Arias',
    role: {
      es: 'Diseño gráfico · App móvil y PWA',
      en: 'Graphic design · Mobile app and PWA',
    },
    description: {
      es: 'Recursos gráficos en Photoshop y conversión de la aplicación web en app móvil y aplicación web progresiva.',
      en: 'Graphic assets in Photoshop and conversion of the web app into a mobile app and a progressive web app.',
    },
    image: '/images/team/adrian-arias.webp',
  },
  {
    id: 'yoel-ramos',
    name: 'Yoel Guadalupe Ramos Rivera',
    role: {
      es: 'Desarrollador Web',
      en: 'Web developer',
    },
    description: {
      es: 'Codificación del esqueleto principal de la página web.',
      en: 'Coding of the website\'s core structure.',
    },
    image: '/images/team/yoel-ramos.webp',
  },
  {
    id: 'gael-zamora',
    name: 'Enrique Gael Zamora Partida',
    role: {
      es: 'Música y animación web',
      en: 'Music and web animation',
    },
    description: {
      es: 'Música y efectos de sonido en FL Studio, y animaciones del sitio con GSAP y ScrollTrigger.',
      en: 'Music and sound effects in FL Studio, and site animations with GSAP and ScrollTrigger.',
    },
    image: '/images/team/gael-zamora.webp',
  },
  {
    id: 'cristopher-larios',
    name: 'Cristopher Larios García',
    role: {
      es: 'Programación en Unity',
      en: 'Unity programming',
    },
    description: {
      es: 'Desarrollo del videojuego en Unity: mecánicas de combate, integración de recursos y programación en C#.',
      en: 'Game development in Unity: combat mechanics, asset integration and C# programming.',
    },
    image: '/images/team/cristopher-larios.webp',
  },
]

/* ==========================================================================
   ASIGNATURA / PROYECTO
   ========================================================================== */

export const projectMeta = {
  type: {
    es: 'Proyecto Integrador - Videojuegos 2026',
    en: 'Capstone Project - Video Games 2026',
  },
  subject: {
    es: 'Creación de Videojuegos',
    en: 'Video Game Creation',
  },
  group: 'IDGS-101',
  teacher: 'Ing. Juan Manuel Tovar Sánchez',
  repository: 'https://github.com/adrianarias1/King-Of-Music---Web-Movil',
} as const
