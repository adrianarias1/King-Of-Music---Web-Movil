import { comboVideo } from '../lib/media'
import type { Character, Combo } from '../types'

/** Teclas de cada combo (iguales para todos los personajes). */
const COMBO_KEYS = ['G + G + G', 'H + H + H', 'J + J + J'] as const

/** Combos 1–3 de un personaje, con sus teclas y su video. */
function combos(prefix: string, characterId: string): Combo[] {
  return COMBO_KEYS.map((keys, index) => ({
    id: `${characterId}-combo-${index + 1}`,
    name: `Combo ${index + 1}`,
    keys,
    media: { type: 'video', src: comboVideo(`${prefix}_combo${index + 1}.mp4`) },
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
    tagline: {
      es: 'Balada mexicana',
      en: 'Mexican ballad',
    },
    description: {
      es: 'Combatiente de largo alcance que transforma la fuerza de su interpretación en ondas sonoras para controlar el espacio.',
      en: 'Long-range fighter who turns the power of his performance into sound waves to control the space.',
    },
    model: '/models/characters/juangrabriel.glb',
    preview: '/images/characters/juan-grabriel.png',
    scale: 0.95,
    cameraPosition: [0, 1.25, 3.8],
    accent: '#002F61',
    glow: '#C5A45B',
    abilities: [
      {
        id: 'rayo-de-la-interpretacion',
        name: {
          es: 'Rayo de la Interpretación',
          en: 'Performance Ray',
        },
        description: {
          es: 'Concentra la energía de su interpretación y el apoyo del público en una esfera musical que dirige hacia el adversario.',
          en: 'Gathers the energy of his performance and the crowd\'s support into a musical sphere that he hurls at his opponent.',
        },
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
    tagline: {
      es: 'Balada romántica',
      en: 'Romantic ballad',
    },
    description: {
      es: 'Utiliza la intensidad emocional de sus interpretaciones para generar ataques de energía y efectos musicales.',
      en: 'Uses the emotional intensity of his performances to unleash energy attacks and musical effects.',
    },
    model: '/models/characters/JoseJose.glb',
    preview: '/images/characters/jose-jose-jose.png',
    scale: 0.98,
    cameraPosition: [0, 1.1, 3.2],
    accent: '#BABABA',
    glow: '#D65A9E',
    abilities: [
      {
        id: 'nota-del-desamor',
        name: {
          es: 'Nota del Desamor',
          en: 'Heartbreak Note',
        },
        description: {
          es: 'Utiliza un micrófono para ejecutar una interpretación de gran intensidad que genera una poderosa onda sonora.',
          en: 'Grabs a microphone for an intense performance that releases a powerful sound wave.',
        },
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
    tagline: {
      es: 'Rock mexicano',
      en: 'Mexican rock',
    },
    description: {
      es: 'Combatiente ofensivo de corta distancia basado en potencia, guitarras, amplificadores y ataques de alto impacto.',
      en: 'Close-range offensive fighter built on raw power, guitars, amplifiers and high-impact attacks.',
    },
    model: '/models/characters/AlexLLora.glb',
    preview: '/images/characters/alex-llora.png',
    scale: 0.95,
    cameraPosition: [0, 1.05, 3.1],
    accent: '#002F61',
    glow: '#C62828',
    abilities: [
      {
        id: 'guitarrazo-de-rock',
        name: {
          es: 'Guitarrazo de Rock',
          en: 'Rock Guitar Smash',
        },
        description: {
          es: 'Utiliza su guitarra eléctrica para realizar un golpe de gran potencia acompañado por una descarga sonora.',
          en: 'Swings his electric guitar in a devastating blow followed by a blast of sound.',
        },
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
    tagline: {
      es: 'Música norteña',
      en: 'Norteño music',
    },
    description: {
      es: 'Especialista en alcance medio que utiliza su acordeón para generar ráfagas de energía y ataques musicales.',
      en: 'Mid-range specialist who uses his accordion to fire bursts of energy and musical attacks.',
    },
    model: '/models/characters/Roman.glb',
    preview: '/images/characters/roman-ayala.png',
    scale: 0.98,
    cameraPosition: [0, 1.1, 3.2],
    accent: '#333333',
    glow: '#2E8B57',
    abilities: [
      {
        id: 'acordeon-de-poder',
        name: {
          es: 'Acordeón de Poder',
          en: 'Power Accordion',
        },
        description: {
          es: 'Lanza su acordeón hacia el oponente siguiendo una trayectoria de ida y regreso para atacar a media distancia.',
          en: 'Throws his accordion at the opponent in a boomerang arc to strike at mid range.',
        },
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
    tagline: {
      es: 'Corridos tumbados',
      en: 'Corridos tumbados',
    },
    description: {
      es: 'Combatiente rápido y ágil especializado en ataques consecutivos y movimientos capaces de sorprender al rival.',
      en: 'Fast, agile fighter specialized in back-to-back attacks and moves that catch rivals off guard.',
    },
    model: '/models/characters/NatanaelChano.glb',
    preview: '/images/characters/natanael-chano.png',
    scale: 0.95,
    cameraPosition: [0, 1.05, 3.1],
    accent: '#002F61',
    glow: '#7B2CBF',
    abilities: [
      {
        id: 'paso-tumbado',
        name: {
          es: 'Paso Tumbado',
          en: 'Tumbado Stomp',
        },
        description: {
          es: 'Ejecuta un fuerte pisotón que genera una vibración y una onda de impacto dirigida hacia el adversario.',
          en: 'Delivers a heavy stomp that sends a tremor and a shockwave toward the opponent.',
        },
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
    tagline: {
      es: 'Corridos bélicos',
      en: 'Corridos bélicos',
    },
    description: {
      es: 'Combatiente de ofensiva constante basado en velocidad, requintos y combinaciones rápidas de ataques.',
      en: 'Relentless fighter built on speed, requinto guitar riffs and quick attack combinations.',
    },
    model: '/models/characters/PesoPumba.glb',
    preview: '/images/characters/peso-plomo.png',
    scale: 1,
    cameraPosition: [0, 1.15, 3.4],
    accent: '#002F61',
    glow: '#287BCE',
    abilities: [
      {
        id: 'cadena-belica',
        name: {
          es: 'Cadena Bélica',
          en: 'War Chain',
        },
        description: {
          es: 'Utiliza su cadena para alcanzar al oponente a media distancia y generar un impacto acompañado por una descarga de baja frecuencia.',
          en: 'Lashes out with his chain to hit the opponent at mid range with an impact followed by a low-frequency blast.',
        },
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
    tagline: {
      es: 'Villana · Jefa final',
      en: 'Villain · Final boss',
    },
    description: {
      es: 'Organizadora del Torneo del Bienestar y jefa final del modo historia. No representa un género: combate con fragmentos de las habilidades de los géneros eliminados.',
      en: 'Organizer of the Wellbeing Tournament and final boss of story mode. She represents no genre: she fights with fragments of the abilities of the eliminated genres.',
    },
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
        name: {
          es: 'Rayo de la Interpretación',
          en: 'Performance Ray',
        },
        description: {
          es: 'Absorbida de Juan Grabriel: una esfera de energía musical dirigida contra el rival.',
          en: 'Absorbed from Juan Grabriel: a sphere of musical energy hurled at the rival.',
        },
        icon: 'Zap',
        combo: 'U',
        media: { type: 'video', src: comboVideo('flavia_special_beam.mp4') },
      },
      {
        id: 'flavia-nota-del-desamor',
        name: {
          es: 'Nota del Desamor',
          en: 'Heartbreak Note',
        },
        description: {
          es: 'Absorbida de José José José: una onda cargada de desamor que golpea a distancia.',
          en: 'Absorbed from José José José: a heartbreak-charged wave that strikes from afar.',
        },
        icon: 'Mic2',
        combo: 'U',
        media: { type: 'video', src: comboVideo('flavia_special_wave.mp4') },
      },
      {
        id: 'flavia-guitarrazo-de-rock',
        name: {
          es: 'Guitarrazo de Rock',
          en: 'Rock Guitar Smash',
        },
        description: {
          es: 'Absorbida de Alex Llora: un golpe explosivo con la energía del rock mexicano.',
          en: 'Absorbed from Alex Llora: an explosive blow with the energy of Mexican rock.',
        },
        icon: 'Activity',
        combo: 'U',
        media: { type: 'video', src: comboVideo('flavia_special_club.mp4') },
      },
      {
        id: 'flavia-acordeon-de-poder',
        name: {
          es: 'Acordeón de Poder',
          en: 'Power Accordion',
        },
        description: {
          es: 'Absorbida de Román Ayala: ráfagas de energía musical lanzadas con el acordeón.',
          en: 'Absorbed from Román Ayala: bursts of musical energy fired from the accordion.',
        },
        icon: 'Music2',
        combo: 'U',
        media: { type: 'video', src: comboVideo('flavia_special_boomerang.mp4') },
      },
      {
        id: 'flavia-paso-tumbado',
        name: {
          es: 'Paso Tumbado',
          en: 'Tumbado Stomp',
        },
        description: {
          es: 'Absorbida de Natanael Chano: un ataque veloz al ritmo de los corridos tumbados.',
          en: 'Absorbed from Natanael Chano: a lightning-fast attack to the beat of corridos tumbados.',
        },
        icon: 'Footprints',
        combo: 'U',
        media: { type: 'video', src: comboVideo('flavia_special_slam.mp4') },
      },
      {
        id: 'flavia-cadena-belica',
        name: {
          es: 'Cadena Bélica',
          en: 'War Chain',
        },
        description: {
          es: 'Absorbida de Peso Plomo: una combinación de golpes rápidos con ritmos contemporáneos.',
          en: 'Absorbed from Peso Plomo: a combination of rapid strikes with contemporary rhythms.',
        },
        icon: 'Zap',
        combo: 'U',
        media: { type: 'video', src: comboVideo('flavia_special_chain.mp4') },
      },
    ],
    combos: combos('flavia', 'flavia'),
  },
]

export const defaultCharacterId = characters[0]?.id ?? ''
