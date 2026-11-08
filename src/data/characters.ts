import { comboVideo } from '../lib/media'
import type { Character, Combo } from '../types'

/** Combos 1–3 de un personaje (teclas por definir). */
function combos(prefix: string, characterId: string): Combo[] {
  return [1, 2, 3].map((n) => ({
    id: `${characterId}-combo-${n}`,
    name: `Combo ${n}`,
    media: { type: 'video', src: comboVideo(`${prefix}_combo${n}.mp4`) },
  }))
}

/* ==========================================================================
   PERSONAJES — DATOS DEL ROSTER
   --------------------------------------------------------------------------
   Los modelos GLB se sirven desde Cloudflare R2 conservando su ruta original.
   Los personajes sin modelo conservan el placeholder en el visor.
   ========================================================================== */

export const characters: Character[] = [
  {
    id: 'juan-grabriel',
    name: 'Juan Grabriel',
    tagline: 'Balada mexicana',
    description:
      'Combatiente de largo alcance que transforma la fuerza de su interpretación en ondas sonoras para controlar el espacio.',
    model: '/models/characters/juangrabriel.glb',
    preview: '/images/characters/juan-grabriel.png',
    scale: 0.95,
    cameraPosition: [0, 1.25, 3.8],
    accent: '#002F61',
    glow: '#C5A45B',
    abilities: [
      {
        id: 'rayo-de-la-interpretacion',
        name: 'Rayo de la Interpretación',
        description:
          'Concentra la energía de su interpretación y el apoyo del público en una esfera musical que dirige hacia el adversario.',
        icon: 'Zap',
        combo: 'U',
        media: { type: 'video', src: comboVideo('juan_grabriel_special_beam.mp4') },
      },
    ],
    combos: combos('juan_grabriel', 'juan-grabriel'),
  },
  {
    id: 'jose-jose-jose',
    name: 'José José José',
    tagline: 'Balada romántica',
    description:
      'Utiliza la intensidad emocional de sus interpretaciones para generar ataques de energía y efectos musicales.',
    model: '/models/characters/JoseJose.glb',
    preview: '/images/characters/jose-jose-jose.png',
    scale: 0.98,
    cameraPosition: [0, 1.1, 3.2],
    accent: '#BABABA',
    glow: '#D65A9E',
    abilities: [
      {
        id: 'nota-del-desamor',
        name: 'Nota del Desamor',
        description:
          'Utiliza un micrófono para ejecutar una interpretación de gran intensidad que genera una poderosa onda sonora.',
        icon: 'Mic2',
        combo: 'U',
        media: { type: 'video', src: comboVideo('jose_jose_special_wave.mp4') },
      },
    ],
    combos: combos('jose_jose', 'jose-jose-jose'),
  },
  {
    id: 'alex-llora',
    name: 'Alex Llora',
    tagline: 'Rock mexicano',
    description:
      'Combatiente ofensivo de corta distancia basado en potencia, guitarras, amplificadores y ataques de alto impacto.',
    model: '/models/characters/AlexLLora.glb',
    preview: '/images/characters/alex-llora.png',
    scale: 0.95,
    cameraPosition: [0, 1.05, 3.1],
    accent: '#002F61',
    glow: '#C62828',
    abilities: [
      {
        id: 'guitarrazo-de-rock',
        name: 'Guitarrazo de Rock',
        description:
          'Utiliza su guitarra eléctrica para realizar un golpe de gran potencia acompañado por una descarga sonora.',
        icon: 'Activity',
        combo: 'U',
        media: { type: 'video', src: comboVideo('alex_llora_special_club.mp4') },
      },
    ],
    combos: combos('alex_llora', 'alex-llora'),
  },
  {
    id: 'roman-ayala',
    name: 'Román Ayala',
    tagline: 'Música norteña',
    description:
      'Especialista en alcance medio que utiliza su acordeón para generar ráfagas de energía y ataques musicales.',
    model: '/models/characters/Roman.glb',
    preview: '/images/characters/roman-ayala.png',
    scale: 0.98,
    cameraPosition: [0, 1.1, 3.2],
    accent: '#333333',
    glow: '#2E8B57',
    abilities: [
      {
        id: 'acordeon-de-poder',
        name: 'Acordeón de Poder',
        description:
          'Lanza su acordeón hacia el oponente siguiendo una trayectoria de ida y regreso para atacar a media distancia.',
        icon: 'Music2',
        combo: 'U',
        media: { type: 'video', src: comboVideo('roman_ayala_special_boomerang.mp4') },
      },
    ],
    combos: combos('roman_ayala', 'roman-ayala'),
  },
  {
    id: 'natanael-chano',
    name: 'Natanael Chano',
    tagline: 'Corridos tumbados',
    description:
      'Combatiente rápido y ágil especializado en ataques consecutivos y movimientos capaces de sorprender al rival.',
    model: '/models/characters/NatanaelChano.glb',
    preview: '/images/characters/natanael-chano.png',
    scale: 0.95,
    cameraPosition: [0, 1.05, 3.1],
    accent: '#002F61',
    glow: '#7B2CBF',
    abilities: [
      {
        id: 'paso-tumbado',
        name: 'Paso Tumbado',
        description:
          'Ejecuta un fuerte pisotón que genera una vibración y una onda de impacto dirigida hacia el adversario.',
        icon: 'Footprints',
        combo: 'U',
        media: { type: 'video', src: comboVideo('natanael_chano_special_slam.mp4') },
      },
    ],
    combos: combos('natanael_chano', 'natanael-chano'),
  },
  {
    id: 'peso-plomo',
    name: 'Peso Plomo',
    tagline: 'Corridos bélicos',
    description:
      'Combatiente de ofensiva constante basado en velocidad, requintos y combinaciones rápidas de ataques.',
    model: '/models/characters/PesoPumba.glb',
    preview: '/images/characters/peso-plomo.png',
    scale: 1,
    cameraPosition: [0, 1.15, 3.4],
    accent: '#002F61',
    glow: '#287BCE',
    abilities: [
      {
        id: 'cadena-belica',
        name: 'Cadena Bélica',
        description:
          'Utiliza su cadena para alcanzar al oponente a media distancia y generar un impacto acompañado por una descarga de baja frecuencia.',
        icon: 'Zap',
        combo: 'U',
        media: { type: 'video', src: comboVideo('peso_plomo_special_chain.mp4') },
      },
    ],
    combos: combos('peso_plomo', 'peso-plomo'),
  },
  {
    id: 'flavia',
    name: 'Flavia',
    tagline: 'Villana · Jefa final',
    description:
      'Organizadora del Torneo del Bienestar y jefa final del modo historia. No representa un género: combate con fragmentos de las habilidades de los géneros eliminados.',
    model: '/models/characters/Flavia.glb',
    preview: '/images/characters/flavia.png',
    scale: 1,
    cameraPosition: [0, 1.1, 3.2],
    accent: '#BABABA',
    glow: '#7A0019',
    abilities: [
      // Absorbe la habilidad especial de cada uno de los otros seis.
      {
        id: 'flavia-rayo-de-la-interpretacion',
        name: 'Rayo de la Interpretación',
        description: 'Absorbida de Juan Grabriel: una esfera de energía musical dirigida contra el rival.',
        icon: 'Zap',
        combo: 'U',
        media: { type: 'video', src: comboVideo('flavia_special_beam.mp4') },
      },
      {
        id: 'flavia-nota-del-desamor',
        name: 'Nota del Desamor',
        description: 'Absorbida de José José José: una onda cargada de desamor que golpea a distancia.',
        icon: 'Mic2',
        combo: 'U',
        media: { type: 'video', src: comboVideo('flavia_special_wave.mp4') },
      },
      {
        id: 'flavia-guitarrazo-de-rock',
        name: 'Guitarrazo de Rock',
        description: 'Absorbida de Alex Llora: un golpe explosivo con la energía del rock mexicano.',
        icon: 'Activity',
        combo: 'U',
        media: { type: 'video', src: comboVideo('flavia_special_club.mp4') },
      },
      {
        id: 'flavia-acordeon-de-poder',
        name: 'Acordeón de Poder',
        description: 'Absorbida de Román Ayala: ráfagas de energía musical lanzadas con el acordeón.',
        icon: 'Music2',
        combo: 'U',
        media: { type: 'video', src: comboVideo('flavia_special_boomerang.mp4') },
      },
      {
        id: 'flavia-paso-tumbado',
        name: 'Paso Tumbado',
        description: 'Absorbida de Natanael Chano: un ataque veloz al ritmo de los corridos tumbados.',
        icon: 'Footprints',
        combo: 'U',
        media: { type: 'video', src: comboVideo('flavia_special_slam.mp4') },
      },
      {
        id: 'flavia-cadena-belica',
        name: 'Cadena Bélica',
        description: 'Absorbida de Peso Plomo: una combinación de golpes rápidos con ritmos contemporáneos.',
        icon: 'Zap',
        combo: 'U',
        media: { type: 'video', src: comboVideo('flavia_special_chain.mp4') },
      },
    ],
    combos: combos('flavia', 'flavia'),
  },
]

export const defaultCharacterId = characters[0]?.id ?? ''
