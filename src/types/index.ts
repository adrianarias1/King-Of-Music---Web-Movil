/* ==========================================================================
   KING OF MUSIC — Tipos de dominio
   ========================================================================== */

/** Vector 3D usado para posiciones de cámara. */
export type Vec3 = [number, number, number]

/** Habilidad de un personaje. */
export interface Ability {
  id: string
  name: string
  description: string
  /** Notación de combo, p. ej. "A + A + B + C". */
  combo?: string
  /** Nombre de icono de Lucide. Opcional: si no existe, se usa uno por defecto. */
  icon?: string
  /** Ruta a imagen de preview (opcional, aún no incluida). */
  preview?: string
  /**
   * Reserved: Allows mounting video or 3D content inside the ability modal
   * without changing the component API.
   */
  media?: AbilityMedia
}

export type AbilityMedia =
  | { type: 'video'; src: string; poster?: string }
  | { type: 'model'; src: string }

/** Personaje jugable del juego. */
export interface Character {
  id: string
  name: string
  /** Alias o subtítulo corto (género / estilo). */
  tagline?: string
  description: string
  /** Ruta al .glb/.gltf. Si no existe el archivo, el visor usa un placeholder 3D. */
  model: string
  /** Ruta a la ilustración/portrait. Placeholder si no existe. */
  preview: string
  scale: number
  cameraPosition?: Vec3
  /** Color de acento usado en la interfaz (de la paleta del juego). */
  accent?: string
  abilities: Ability[]
}

/** Ubicación del mapa conceptual del juego. Coordenadas en porcentaje 0-100. */
export interface Location {
  id: string
  name: string
  description: string
  /** Posición horizontal en % dentro de la imagen del mapa. */
  x: number
  /** Posición vertical en % dentro de la imagen del mapa. */
  y: number
  image?: string
}

/** Herramienta de desarrollo. */
export interface Tool {
  id: string
  name: string
  description: string
  /** Ruta a logo (opcional). */
  logo?: string
  /** Versión opcional. No se inventa si no se proporciona. */
  version?: string
}

/** Miembro del equipo. */
export interface TeamMember {
  id: string
  name: string
  role: string
  /** Ruta a foto. Placeholder si no existe. */
  image?: string
  links?: SocialLink[]
}

export interface SocialLink {
  label: string
  href: string
  icon?: 'github' | 'linkedin' | 'mail' | 'globe'
}

/** Página del storyboard / cómic. */
export interface StoryboardPage {
  id: string
  /** Título o pie de viñeta. */
  caption: string
  /** Ruta a la imagen de la página. Placeholder si no existe. */
  image?: string
  /** Texto narrativo opcional. */
  text?: string
}

/** Elemento de la galería de desarrollo. */
export interface DevShot {
  id: string
  caption: string
  image?: string
}

/** Enlace de navegación del header. */
export interface NavLink {
  label: string
  href: string
}