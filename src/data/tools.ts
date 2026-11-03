import type { DevShot, Tool } from '../types'

/* ==========================================================================
   BEHIND THE GAME — HERRAMIENTAS
   --------------------------------------------------------------------------
   Fuente: documento del proyecto (Requerimientos técnicos y Herramientas
   de software). Los logos van en public/images/tools/<id>.png; mientras
   no existan, la tarjeta muestra las iniciales de la herramienta.
   ========================================================================== */

export const tools: Tool[] = [
  {
    id: 'unity',
    name: 'Unity 6.3',
    description:
      'Motor principal. Integra modelos, animaciones, escenarios, interfaz, audio y la programación de las mecánicas de combate.',
    logo: '/images/tools/unity.png',
  },
  {
    id: 'visual-studio',
    name: 'Visual Studio 2026',
    description:
      'Programación en C# de movimiento, colisiones, daño, barras de vida, selección de personajes y habilidades especiales.',
    logo: '/images/tools/visual-studio.png',
  },
  {
    id: 'blender',
    name: 'Blender 5.2',
    description:
      'Modelado, rigging y animación de los seis personajes jugables, escenarios y objetos, y optimización de modelos antes de Unity.',
    logo: '/images/tools/blender.png',
  },
  {
    id: 'krita',
    name: 'Krita 5.3.4',
    description:
      'Concept art de personajes, escenarios y objetos, y dibujo de los storyboards de la historia y las mecánicas.',
    logo: '/images/tools/krita.png',
  },
  {
    id: 'photoshop',
    name: 'Adobe Photoshop 2020',
    description:
      'Logotipos, iconos, interfaz, barras de vida, imágenes promocionales y edición de texturas para los modelos 3D.',
    logo: '/images/tools/photoshop.png',
  },
  {
    id: 'flstudio',
    name: 'FL Studio 2024',
    description:
      'Composición de música original para menús, combates y escenarios, y edición y mezcla de efectos de sonido.',
    logo: '/images/tools/fl-studio.png',
  },
  {
    id: 'mixamo',
    name: 'Adobe Mixamo',
    description:
      'Rigging automático y animaciones base (caminar, correr, saltar, guardia) que después se ajustan en Blender.',
    logo: '/images/tools/mixamo.png',
  },
  {
    id: 'hunyuan',
    name: 'Tencent Hunyuan 3D',
    description:
      'Apoyo con IA para generar bases 3D de objetos y accesorios; el equipo las revisa y termina en Blender.',
    logo: '/images/tools/hunyuan.png',
  },
]

/* ==========================================================================
   GALERIA DE DESARROLLO
   Capturas reales del proceso en public/images/dev/ (WebP 1280 x 800,
   recortadas a 16:10 para los recuadros de la galería).
   ========================================================================== */

export const devShots: DevShot[] = [
  {
    id: 'krita-escenario-la-madrugadora',
    caption: 'Edición del escenario La Madrugadora en Krita',
    image: '/images/dev/krita-escenario-la-madrugadora.webp',
  },
  {
    id: 'blender-esculpido-personaje',
    caption: 'Esculpido de personaje en Blender',
    image: '/images/dev/blender-esculpido-personaje.webp',
  },
  {
    id: 'blender-rigging-personajes',
    caption: 'Rigging y animación del roster en Blender',
    image: '/images/dev/blender-rigging-personajes.webp',
  },
  {
    id: 'unity-prueba-de-combate',
    caption: 'Prueba de combate en Unity: Juan Grabriel vs. José José José',
    image: '/images/dev/unity-prueba-de-combate.webp',
  },
]

/* ==========================================================================
   PROCESO — FASES
   ========================================================================== */

export const processSteps: { id: string; title: string; description: string }[] = [
  {
    id: 'requerimientos',
    title: 'Requerimientos y herramientas',
    description:
      'Se investigaron los requisitos técnicos de cada programa y se eligió cada herramienta según su función y el dominio del equipo.',
  },
  {
    id: 'concepto',
    title: 'Concepto',
    description:
      'Juego de peleas 3D con artistas ficticios de la música mexicana, pensado para jugadores desde los 10 años y sin violencia gráfica.',
  },
  {
    id: 'historia',
    title: 'Historia y storyboard',
    description:
      'Un México alternativo y el Torneo del Bienestar: cada derrota veta un género musical. La historia se bocetó en Krita.',
  },
  {
    id: 'arte',
    title: 'Personajes, escenarios y poderes',
    description:
      'Seis artistas jugables, la villana Flavia Cheinbaum, tres escenarios, seis poderes especiales y seis items, del concept art al modelo 3D.',
  },
  {
    id: 'integracion',
    title: 'Mecánicas e integración',
    description:
      'En Unity se programan movimiento, ataques, combos y poderes, y se integran animaciones, música y efectos de sonido.',
  },
]
