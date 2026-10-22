import type { DevShot, Tool } from '../types'

/* ==========================================================================
   BEHIND THE GAME — HERRAMIENTAS
   --------------------------------------------------------------------------
   IMPORTANTE: no se inventan versiones. `version` es opcional y se omite
   hasta que el equipo confirme la version que utiliza.
   ========================================================================== */

export const tools: Tool[] = [
  {
    id: 'unity',
    name: 'UNITY 6.3',
    description:
      'Motor principal donde se integran combate, escenarios, animaciones, interfaces, audio y mecánicas.',
    logo: '/images/tools/unity.png',
  },
  {
    id: 'blender',
    name: 'BLENDER 5.2',
    description:
      'Modelado, optimización, rigging y animación de personajes, objetos y escenarios.',
    logo: '/images/tools/blender.png',
  },
  {
    id: 'flstudio',
    name: 'FL STUDIO 2024',
    description:
      'Producción musical, efectos de sonido y diseño sonoro de King of Music.',
    logo: '/images/tools/fl-studio.png',
  },
  {
    id: 'photoshop',
    name: 'ADOBE PHOTOSHOP 2020',
    description:
      'Diseño y edición de interfaces, texturas, imágenes promocionales y recursos gráficos 2D.',
    logo: '/images/tools/photoshop.png',
  },
]

/* ==========================================================================
   GALERIA DE DESARROLLO
   Colocar capturas en public/images/dev/
   ========================================================================== */

export const devShots: DevShot[] = [
  { id: 'shot-01', caption: 'Modelado de personaje en Blender', image: '/images/dev/shot-01.jpg' },
  { id: 'shot-02', caption: 'Rig y esqueleto de combate', image: '/images/dev/shot-02.jpg' },
  { id: 'shot-03', caption: 'Prueba de partidas en Unity', image: '/images/dev/shot-03.jpg' },
  { id: 'shot-04', caption: 'Render de escenario con luz de escenario', image: '/images/dev/shot-04.jpg' },
]

/* ==========================================================================
   PROCESO — FASES
   ========================================================================== */

export const processSteps: { id: string; title: string; description: string }[] = [
  {
    id: 'concept',
    title: 'Concepto',
    description: 'Definicion del roster, escenarios y reglas base del combate musical.',
  },
  {
    id: 'blockout',
    title: 'Blockout',
    description: 'Pruebas de ritmo de combate, alcance de ataques y control de camara.',
  },
  {
    id: 'art',
    title: 'Arte',
    description: 'Modelado, texturas, animaciones e iluminacion de cada escenario.',
  },
  {
    id: 'polish',
    title: 'Pulido',
    description: 'Balance, efectos, audio, interfaz y optimizacion para Android.',
  },
]