import type { DevShot, L, Tool } from '../types'

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
    description: {
      es: 'Motor principal. Integra modelos, animaciones, escenarios, interfaz, audio y la programación de las mecánicas de combate.',
      en: 'Main engine. It brings together models, animations, stages, UI, audio and the programming of the combat mechanics.',
    },
    logo: '/images/tools/unity.png',
  },
  {
    id: 'visual-studio',
    name: 'Visual Studio 2026',
    description: {
      es: 'Programación en C# de movimiento, colisiones, daño, barras de vida, selección de personajes y habilidades especiales.',
      en: 'C# programming for movement, collisions, damage, health bars, character select and special abilities.',
    },
    logo: '/images/tools/visual-studio.png',
  },
  {
    id: 'blender',
    name: 'Blender 5.2',
    description: {
      es: 'Modelado, rigging y animación de los seis personajes jugables, escenarios y objetos, y optimización de modelos antes de Unity.',
      en: 'Modeling, rigging and animation of the six playable characters, stages and props, plus model optimization before Unity.',
    },
    logo: '/images/tools/blender.png',
  },
  {
    id: 'krita',
    name: 'Krita 5.3.4',
    description: {
      es: 'Concept art de personajes, escenarios y objetos, y dibujo de los storyboards de la historia y las mecánicas.',
      en: 'Concept art for characters, stages and props, and drawing of the story and mechanics storyboards.',
    },
    logo: '/images/tools/krita.png',
  },
  {
    id: 'photoshop',
    name: 'Adobe Photoshop 2020',
    description: {
      es: 'Logotipos, iconos, interfaz, barras de vida, imágenes promocionales y edición de texturas para los modelos 3D.',
      en: 'Logos, icons, UI, health bars, promotional images and texture editing for the 3D models.',
    },
    logo: '/images/tools/photoshop.png',
  },
  {
    id: 'flstudio',
    name: 'FL Studio 2024',
    description: {
      es: 'Composición de música original para menús, combates y escenarios, y edición y mezcla de efectos de sonido.',
      en: 'Original music for menus, fights and stages, plus sound effect editing and mixing.',
    },
    logo: '/images/tools/fl-studio.png',
  },
  {
    id: 'mixamo',
    name: 'Adobe Mixamo',
    description: {
      es: 'Rigging automático y animaciones base (caminar, correr, saltar, guardia) que después se ajustan en Blender.',
      en: 'Auto-rigging and base animations (walk, run, jump, guard) that are later refined in Blender.',
    },
    logo: '/images/tools/mixamo.png',
  },
  {
    id: 'hunyuan',
    name: 'Tencent Hunyuan 3D',
    description: {
      es: 'Apoyo con IA para generar bases 3D de objetos y accesorios; el equipo las revisa y termina en Blender.',
      en: 'AI assistance to generate base 3D meshes for props and accessories; the team reviews and finishes them in Blender.',
    },
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
    caption: {
      es: 'Edición del escenario La Madrugadora en Krita',
      en: 'Editing the La Madrugadora stage in Krita',
    },
    image: '/images/dev/krita-escenario-la-madrugadora.webp',
  },
  {
    id: 'blender-esculpido-personaje',
    caption: {
      es: 'Esculpido de personaje en Blender',
      en: 'Sculpting a character in Blender',
    },
    image: '/images/dev/blender-esculpido-personaje.webp',
  },
  {
    id: 'blender-rigging-personajes',
    caption: {
      es: 'Rigging y animación del roster en Blender',
      en: 'Rigging and animating the roster in Blender',
    },
    image: '/images/dev/blender-rigging-personajes.webp',
  },
  {
    id: 'unity-prueba-de-combate',
    caption: {
      es: 'Prueba de combate en Unity: Juan Grabriel vs. José José José',
      en: 'Combat test in Unity: Juan Grabriel vs. José José José',
    },
    image: '/images/dev/unity-prueba-de-combate.webp',
  },
]

/* ==========================================================================
   PROCESO — FASES
   ========================================================================== */

export const processSteps: { id: string; title: L; description: L }[] = [
  {
    id: 'requerimientos',
    title: {
      es: 'Requerimientos y herramientas',
      en: 'Requirements and tools',
    },
    description: {
      es: 'Se investigaron los requisitos técnicos de cada programa y se eligió cada herramienta según su función y el dominio del equipo.',
      en: 'We researched the technical requirements of each program and picked every tool for its role and the team\'s expertise.',
    },
  },
  {
    id: 'concepto',
    title: {
      es: 'Concepto',
      en: 'Concept',
    },
    description: {
      es: 'Juego de peleas 3D con artistas ficticios de la música mexicana, pensado para jugadores desde los 10 años y sin violencia gráfica.',
      en: 'A 3D fighting game with fictional Mexican music artists, designed for players aged 10 and up with no graphic violence.',
    },
  },
  {
    id: 'historia',
    title: {
      es: 'Historia y storyboard',
      en: 'Story and storyboard',
    },
    description: {
      es: 'Un México alternativo y el Torneo del Bienestar: cada derrota veta un género musical. La historia se bocetó en Krita.',
      en: 'An alternate Mexico and the Wellbeing Tournament: every defeat bans a music genre. The story was sketched in Krita.',
    },
  },
  {
    id: 'arte',
    title: {
      es: 'Personajes, escenarios y poderes',
      en: 'Characters, stages and powers',
    },
    description: {
      es: 'Seis artistas jugables, la villana Flavia Cheinbaum, tres escenarios, seis poderes especiales y seis items, del concept art al modelo 3D.',
      en: 'Six playable artists, the villain Flavia Cheinbaum, three stages, six special powers and six items, from concept art to 3D model.',
    },
  },
  {
    id: 'integracion',
    title: {
      es: 'Mecánicas e integración',
      en: 'Mechanics and integration',
    },
    description: {
      es: 'En Unity se programan movimiento, ataques, combos y poderes, y se integran animaciones, música y efectos de sonido.',
      en: 'Movement, attacks, combos and powers are programmed in Unity, and animations, music and sound effects are integrated.',
    },
  },
]
