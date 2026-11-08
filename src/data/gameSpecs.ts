import type { L } from '../types'

/* ==========================================================================
   DETRÁS DEL JUEGO — FICHA TÉCNICA, REQUISITOS, HITOS, PRUEBAS Y REPOS
   --------------------------------------------------------------------------
   Fuente: documento del proyecto (4.1.4 Ficha técnica, 4.2 Desarrollo —
   CI/CD y 4.3 Testing). Todo texto visible va en { es, en }.
   ========================================================================== */

export interface SpecRow {
  id: string
  label: L
  value: L
}

export interface RequirementRow {
  id: string
  component: L
  minimum: L
  recommended: L
}

export interface Milestone {
  id: string
  date: L
  title: L
  description: L
}

export interface TestCase {
  id: string
  title: L
  criterion: L
}

export interface Repository {
  id: string
  name: L
  description: L
  stack: string
  url: string
}

const same = (text: string): L => ({ es: text, en: text })

/* --- Ficha técnica (identificación del producto) ------------------------ */

export const specSheet: SpecRow[] = [
  {
    id: 'genre',
    label: { es: 'Género', en: 'Genre' },
    value: {
      es: 'Pelea 3D (2.5D): desplazamiento lateral sobre un plano con profundidad limitada',
      en: '3D fighting (2.5D): side-scrolling on a plane with limited depth',
    },
  },
  {
    id: 'theme',
    label: { es: 'Tema', en: 'Theme' },
    value: {
      es: 'Torneo de lucha entre géneros musicales mexicanos',
      en: 'A fighting tournament between Mexican music genres',
    },
  },
  {
    id: 'modes',
    label: { es: 'Modos de juego', en: 'Game modes' },
    value: {
      es: 'Campaña de un jugador y versus local a dos jugadores',
      en: 'Single-player campaign and local two-player versus',
    },
  },
  {
    id: 'rating',
    label: { es: 'Clasificación', en: 'Content rating' },
    value: {
      es: 'Violencia fantástica no realista, sin sangre',
      en: 'Unrealistic fantasy violence, no blood',
    },
  },
  {
    id: 'content',
    label: { es: 'Contenido', en: 'Content' },
    value: {
      es: '7 luchadores, 3 recintos con variante final, 8 ataques, 3 combos y 6 especiales',
      en: '7 fighters, 3 venues plus a final variant, 8 attacks, 3 combos and 6 specials',
    },
  },
  {
    id: 'version',
    label: { es: 'Versión entregada', en: 'Delivered version' },
    value: { es: '0.1.0 (build del 2 de noviembre de 2026)', en: '0.1.0 (build of November 2, 2026)' },
  },
  {
    id: 'engine',
    label: { es: 'Motor', en: 'Engine' },
    value: same('Unity 6000.6.6f1 · Universal Render Pipeline 17.6.0'),
  },
  {
    id: 'platform',
    label: { es: 'Plataforma', en: 'Platform' },
    value: { es: 'Windows 10/11 de 64 bits', en: 'Windows 10/11, 64-bit' },
  },
  {
    id: 'distribution',
    label: { es: 'Distribución', en: 'Distribution' },
    value: {
      es: 'Instalador Inno Setup por usuario, sin privilegios de administrador (154 MB comprimido, cerca de 370 MB instalado)',
      en: 'Per-user Inno Setup installer, no administrator rights needed (154 MB compressed, about 370 MB installed)',
    },
  },
  {
    id: 'language',
    label: { es: 'Idioma', en: 'Language' },
    value: {
      es: 'Interfaz en español, con capa de localización español/inglés en los datos',
      en: 'Spanish interface, with a Spanish/English localization layer in the data',
    },
  },
]

/* --- Requisitos de hardware --------------------------------------------- */

export const requirements: RequirementRow[] = [
  {
    id: 'os',
    component: { es: 'Sistema operativo', en: 'Operating system' },
    minimum: { es: 'Windows 10 de 64 bits (1909 o posterior)', en: 'Windows 10 64-bit (1909 or later)' },
    recommended: { es: 'Windows 11 de 64 bits', en: 'Windows 11 64-bit' },
  },
  {
    id: 'cpu',
    component: { es: 'Procesador', en: 'Processor' },
    minimum: {
      es: '4 núcleos a 2.5 GHz (Core i5-4460 / FX-6300)',
      en: '4 cores at 2.5 GHz (Core i5-4460 / FX-6300)',
    },
    recommended: {
      es: '6 núcleos (Ryzen 5 3600 / Core i5-10400)',
      en: '6 cores (Ryzen 5 3600 / Core i5-10400)',
    },
  },
  {
    id: 'ram',
    component: { es: 'Memoria RAM', en: 'Memory' },
    minimum: same('8 GB'),
    recommended: same('16 GB'),
  },
  {
    id: 'gpu',
    component: { es: 'Tarjeta gráfica', en: 'Graphics card' },
    minimum: {
      es: 'Compatible con DirectX 12 y 4 GB de VRAM (GTX 1050 Ti / RX 570)',
      en: 'DirectX 12 compatible with 4 GB VRAM (GTX 1050 Ti / RX 570)',
    },
    recommended: {
      es: 'GTX 1660 Super o RTX 3060, 6–8 GB de VRAM',
      en: 'GTX 1660 Super or RTX 3060, 6–8 GB VRAM',
    },
  },
  {
    id: 'storage',
    component: { es: 'Almacenamiento', en: 'Storage' },
    minimum: { es: '1 GB libre en disco duro', en: '1 GB free on a hard drive' },
    recommended: { es: '2 GB libres en SSD', en: '2 GB free on an SSD' },
  },
  {
    id: 'directx',
    component: same('DirectX'),
    minimum: { es: 'Versión 12', en: 'Version 12' },
    recommended: { es: 'Versión 12', en: 'Version 12' },
  },
  {
    id: 'input',
    component: { es: 'Periféricos', en: 'Peripherals' },
    minimum: { es: 'Teclado', en: 'Keyboard' },
    recommended: { es: 'Teclado', en: 'Keyboard' },
  },
]

/* --- Especificaciones técnicas del proyecto ----------------------------- */

export const technicalSpecs: SpecRow[] = [
  {
    id: 'render',
    label: { es: 'Render', en: 'Rendering' },
    value: {
      es: 'URP 17.6.0 · HDR · MSAA 4× · sombras a 50 m con mapa de 2048 px',
      en: 'URP 17.6.0 · HDR · 4× MSAA · shadows at 50 m with a 2048 px map',
    },
  },
  {
    id: 'api',
    label: { es: 'API gráfica', en: 'Graphics API' },
    value: { es: 'Direct3D 12 · espacio de color lineal', en: 'Direct3D 12 · linear color space' },
  },
  {
    id: 'code',
    label: { es: 'Código', en: 'Code' },
    value: {
      es: 'C# sobre .NET Standard 2.1 · Mono · 59 scripts, ~26 900 líneas',
      en: 'C# on .NET Standard 2.1 · Mono · 59 scripts, ~26,900 lines',
    },
  },
  {
    id: 'input',
    label: { es: 'Entrada', en: 'Input' },
    value: {
      es: 'Input System 1.20.0 con lectura directa; teclado y dos gamepads en versus',
      en: 'Input System 1.20.0 with direct reading; keyboard and two gamepads in versus',
    },
  },
  {
    id: 'architecture',
    label: { es: 'Arquitectura', en: 'Architecture' },
    value: {
      es: 'Data-driven: catálogos JSON de personajes, escenarios, torneo e historia',
      en: 'Data-driven: JSON catalogs for characters, stages, tournament and story',
    },
  },
  {
    id: 'scenes',
    label: { es: 'Escenas', en: 'Scenes' },
    value: same('MainMenu · Story · CharacterSelect · Map · Combat · Ending'),
  },
  {
    id: 'animation',
    label: { es: 'Animación', en: 'Animation' },
    value: {
      es: 'AnimatorController de 2 capas; 32 clips por personaje (38 en la jefa)',
      en: '2-layer AnimatorController; 32 clips per character (38 for the boss)',
    },
  },
  {
    id: 'performance',
    label: { es: 'Rendimiento', en: 'Performance' },
    value: {
      es: '60 fps a 1080p · ventana redimensionable y pantalla completa',
      en: '60 fps at 1080p · resizable window and fullscreen',
    },
  },
  {
    id: 'build',
    label: { es: 'Build', en: 'Build' },
    value: {
      es: '381 MB · 0 errores · 0 avisos (StandaloneWindows64)',
      en: '381 MB · 0 errors · 0 warnings (StandaloneWindows64)',
    },
  },
]

/* --- Hitos del desarrollo (18 oct – 6 nov 2026) ------------------------- */

export const milestones: Milestone[] = [
  {
    id: 'it1',
    date: { es: '18 oct', en: 'Oct 18' },
    title: { es: 'Base jugable', en: 'Playable foundation' },
    description: {
      es: 'Catálogos JSON, siete personajes, menú, selección con ruleta de rival, mapa, combate 2.5D, IA con cuatro perfiles, rondas y HUD.',
      en: 'JSON catalogs, seven characters, menu, select screen with rival roulette, map, 2.5D combat, AI with four profiles, rounds and HUD.',
    },
  },
  {
    id: 'it2',
    date: { es: '19 oct', en: 'Oct 19' },
    title: { es: 'Animación y hitboxes', en: 'Animation and hitboxes' },
    description: {
      es: 'Clips por rig, controller por capas, locomoción calibrada, sprint por doble toque y hitboxes con depuración.',
      en: 'Clips per rig, layered controller, calibrated locomotion, double-tap sprint and debuggable hitboxes.',
    },
  },
  {
    id: 'it34',
    date: { es: '31 oct', en: 'Oct 31' },
    title: { es: 'Pose única y especiales', en: 'Unified pose and specials' },
    description: {
      es: 'Especiales con instrumento (guitarra, acordeón, micrófono), efectos visuales procedurales y escenarios reales en blanco y negro.',
      en: 'Instrument-based specials (guitar, accordion, microphone), procedural VFX and real black-and-white stages.',
    },
  },
  {
    id: 'deform',
    date: { es: '1 nov', en: 'Nov 1' },
    title: { es: 'Corrección de deformaciones', en: 'Deformation fixes' },
    description: {
      es: 'Se resolvieron tres causas raíz encadenadas en las animaciones y se añadieron controles de integridad de curvas.',
      en: 'Three chained root causes in the animations were fixed and curve-integrity gates were added.',
    },
  },
  {
    id: 'stages',
    date: { es: '2 nov', en: 'Nov 2' },
    title: { es: 'Escenarios y público', en: 'Stages and crowd' },
    description: {
      es: 'Zócalo con 216 asientos en una sola llamada de dibujo, jefa que hereda poderes, rediseño del HUD y build.',
      en: 'Zócalo with 216 seats in a single draw call, a boss that inherits powers, HUD redesign and build.',
    },
  },
  {
    id: 'versus',
    date: { es: '4 nov', en: 'Nov 4' },
    title: { es: 'Interfaz y versus local', en: 'Interface and local versus' },
    description: {
      es: 'Rediseño de menús y modo de dos jugadores con selección simultánea.',
      en: 'Menu redesign and a two-player mode with simultaneous selection.',
    },
  },
  {
    id: 'release',
    date: { es: '6 nov', en: 'Nov 6' },
    title: { es: 'Cierre y publicación', en: 'Wrap-up and release' },
    description: {
      es: 'Público del Zócalo animado y publicación del repositorio.',
      en: 'Animated Zócalo crowd and public repository release.',
    },
  },
]

/* --- Pruebas ------------------------------------------------------------- */

export const testingSummary: L = {
  es: 'Tres niveles de prueba: validación de datos, integración en modo Play con entrada real y aceptación sobre el build instalado. Cada caso tiene un criterio escrito antes de ejecutarse y un resultado de pasa o no pasa.',
  en: 'Three levels of testing: data validation, Play-mode integration with real input, and acceptance on the installed build. Each case has a criterion written before it runs and a pass/fail result.',
}

export const testStats: { id: string; value: string; label: L }[] = [
  { id: 'cases', value: '15', label: { es: 'Casos de prueba', en: 'Test cases' } },
  { id: 'checks', value: '4 479', label: { es: 'Comprobaciones del catálogo', en: 'Catalog checks' } },
  { id: 'fixes', value: '10', label: { es: 'Correcciones verificadas', en: 'Verified fixes' } },
  { id: 'errors', value: '0', label: { es: 'Errores en el build', en: 'Build errors' } },
]

export const testCases: TestCase[] = [
  {
    id: 'TC-01',
    title: { es: 'Una pulsación, un ataque', en: 'One press, one attack' },
    criterion: {
      es: 'Cada pulsación dispara exactamente un ataque (19 casos con tiempos reales).',
      en: 'Each press triggers exactly one attack (19 cases with real timing).',
    },
  },
  {
    id: 'TC-02',
    title: { es: 'Combos por secuencia', en: 'Sequence combos' },
    criterion: {
      es: 'G-G-G, H-H-H y J-J-J-J dentro de 0.55 s activan el combo y suman daño.',
      en: 'G-G-G, H-H-H and J-J-J-J within 0.55 s trigger the combo and add damage.',
    },
  },
  {
    id: 'TC-03',
    title: { es: 'Patada en carrera', en: 'Running kick' },
    criterion: { es: 'Correr y pulsar patada fuerte hace 16 de daño.', en: 'Running and pressing heavy kick deals 16 damage.' },
  },
  {
    id: 'TC-04',
    title: { es: 'Rápido contra fuerte', en: 'Light vs. heavy' },
    criterion: {
      es: 'El ataque fuerte supera al rápido en amplitud, anticipación y daño.',
      en: 'Heavy attacks beat light ones in range, wind-up and damage.',
    },
  },
  {
    id: 'TC-05',
    title: { es: 'Búfer de entrada', en: 'Input buffer' },
    criterion: {
      es: 'La pulsación tardía se ejecuta, la temprana se descarta y cinco toques no apilan órdenes.',
      en: 'Late presses run, early presses are dropped and five rapid taps don\'t stack commands.',
    },
  },
  {
    id: 'TC-06',
    title: { es: 'Cierre de ronda por KO', en: 'Round end by KO' },
    criterion: {
      es: 'Tras el primer KO empieza la ronda 2; tras el segundo, avanza el encuentro.',
      en: 'Round 2 starts after the first KO; the match advances after the second.',
    },
  },
  {
    id: 'TC-07',
    title: { es: 'Versus local completo', en: 'Full local versus' },
    criterion: {
      es: 'Flujo completo con jugador 2 humano, rondas configurables y dos mandos.',
      en: 'Full flow with a human player 2, configurable rounds and two controllers.',
    },
  },
  {
    id: 'TC-08',
    title: { es: 'Pausa con mapa', en: 'Pause with map' },
    criterion: {
      es: 'Al volver de la pausa se conservan la misma ronda y la misma vida.',
      en: 'After pausing, the same round and health are kept.',
    },
  },
  {
    id: 'TC-09',
    title: { es: 'Público del Zócalo', en: 'Zócalo crowd' },
    criterion: {
      es: 'Malla, shader, atlas, euforia y ciclo de animación dentro de rango.',
      en: 'Mesh, shader, atlas, excitement and animation cycle within range.',
    },
  },
  {
    id: 'TC-10',
    title: { es: 'Jefa final', en: 'Final boss' },
    criterion: {
      es: 'Hereda los poderes de los derrotados y los ejecuta con su instrumento.',
      en: 'Inherits the defeated fighters\' powers and uses them with their instrument.',
    },
  },
  {
    id: 'TC-11',
    title: { es: 'Balance', en: 'Balance' },
    criterion: {
      es: 'Cada golpe nace dentro de su alcance; avance del combo de 1.40–1.53 m.',
      en: 'Every hit starts within its reach; combo advance of 1.40–1.53 m.',
    },
  },
  {
    id: 'TC-12',
    title: { es: 'Mezcla de audio', en: 'Audio mix' },
    criterion: {
      es: '6 387 fotogramas muestreados: una sola voz, sin cortes ni recortes.',
      en: '6,387 sampled frames: a single voice, no dropouts or clipping.',
    },
  },
  {
    id: 'TC-13',
    title: { es: 'Catálogo completo', en: 'Full catalog' },
    criterion: {
      es: '4 479 comprobaciones sobre los siete personajes sin errores.',
      en: '4,479 checks across the seven characters with no errors.',
    },
  },
  {
    id: 'TC-14',
    title: { es: 'Instalación y arranque', en: 'Install and launch' },
    criterion: {
      es: 'En Windows 11 instala, crea accesos, arranca sin excepciones y desinstala.',
      en: 'On Windows 11 it installs, creates shortcuts, launches without exceptions and uninstalls.',
    },
  },
  {
    id: 'TC-15',
    title: { es: 'Encuadre de escenarios', en: 'Stage framing' },
    criterion: {
      es: 'Cero pérdidas de encuadre hasta zoom 3.4 en los tres escenarios.',
      en: 'No framing loss up to 3.4 zoom on all three stages.',
    },
  },
]

/* --- Repositorios -------------------------------------------------------- */

export const repositories: Repository[] = [
  {
    id: 'game',
    name: { es: 'Videojuego', en: 'Video game' },
    description: {
      es: 'Proyecto de Unity: código C#, escenas, catálogos y build para Windows.',
      en: 'Unity project: C# code, scenes, catalogs and the Windows build.',
    },
    stack: 'Unity · C#',
    url: 'https://github.com/tic-310019-alt/KingOfMusic',
  },
  {
    id: 'web-mobile',
    name: { es: 'Sitio web y app móvil', en: 'Website and mobile app' },
    description: {
      es: 'Esta página, la aplicación web progresiva (PWA) y la app Android con Capacitor.',
      en: 'This site, the progressive web app (PWA) and the Android app built with Capacitor.',
    },
    stack: 'React · TypeScript · Capacitor',
    url: 'https://github.com/adrianarias1/King-Of-Music---Web-Movil',
  },
]
