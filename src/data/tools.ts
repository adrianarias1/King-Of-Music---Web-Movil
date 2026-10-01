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
    name: 'Unity',
    description:
      'Motor principal del proyecto. Render, fisica de combate, animacion y compilacion del juego para Android.',
    logo: '/images/tools/unity.svg',
  },
  {
    id: 'blender',
    name: 'Blender',
    description:
      'Modelado, rigs, UVs y texturizado de los artistas y los escenarios del juego.',
    logo: '/images/tools/blender.svg',
  },
  {
    id: 'maya',
    name: 'Maya',
    description:
      'Animacion de combate, captura de movimiento y limpieza de curvas para el estilo de pelea del juego.',
    logo: '/images/tools/maya.svg',
  },
  {
    id: 'substance',
    name: 'Substance Painter',
    description:
      'Pintura de texturas y materiales PBR para mantener la consistencia visual del equipo.',
    logo: '/images/tools/substance.svg',
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