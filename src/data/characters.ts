import type { Character } from '../types'

/* ==========================================================================
   PERSONAJES — DATOS REALES (condensados)
   --------------------------------------------------------------------------
   IMPORTANTE: los modelos `.glb` definitivos todavia NO existen.
   `model` apunta a la ruta donde ira el archivo final:
       public/models/<id>.glb
   Mientras el archivo no exista, el visor 3D muestra un placeholder
   geometrico y un aviso discreto (sin errores 404).
   ========================================================================== */

export const characters: Character[] = [
  {
    id: 'juan-grabriel',
    name: 'Juan Grabriel',
    tagline: 'Balada mexicana',
    description:
      'Combatiente de largo alcance que transforma la fuerza de su interpretación en ondas sonoras para controlar el espacio.',
    model: '/models/juan-grabriel.glb',
    preview: '/images/characters/juan-grabriel.jpg',
    scale: 1.08,
    cameraPosition: [0, 1.25, 3.8],
    accent: '#002F61',
    abilities: [
      {
        id: 'rayo-de-la-interpretacion',
        name: 'Rayo de la Interpretación',
        description:
          'Concentra la energía de su interpretación y el apoyo del público en una esfera musical que dirige hacia el adversario.',
        icon: 'Zap',
      },
    ],
  },
  {
    id: 'jose-jose-jose',
    name: 'José José José',
    tagline: 'Balada romántica',
    description:
      'Utiliza la intensidad emocional de sus interpretaciones para generar ataques de energía y efectos musicales.',
    model: '/models/jose-jose-jose.glb',
    preview: '/images/characters/jose-jose-jose.jpg',
    scale: 0.98,
    cameraPosition: [0, 1.1, 3.2],
    accent: '#BABABA',
    abilities: [
      {
        id: 'nota-del-desamor',
        name: 'Nota del Desamor',
        description:
          'Utiliza un micrófono para ejecutar una interpretación de gran intensidad que genera una poderosa onda sonora.',
        icon: 'Mic2',
      },
    ],
  },
  {
    id: 'alex-llora',
    name: 'Alex Llora',
    tagline: 'Rock mexicano',
    description:
      'Combatiente ofensivo de corta distancia basado en potencia, guitarras, amplificadores y ataques de alto impacto.',
    model: '/models/alex-llora.glb',
    preview: '/images/characters/alex-llora.jpg',
    scale: 0.95,
    cameraPosition: [0, 1.05, 3.1],
    accent: '#002F61',
    abilities: [
      {
        id: 'guitarrazo-de-rock',
        name: 'Guitarrazo de Rock',
        description:
          'Utiliza su guitarra eléctrica para realizar un golpe de gran potencia acompañado por una descarga sonora.',
        icon: 'Activity',
      },
    ],
  },
  {
    id: 'roman-ayala',
    name: 'Román Ayala',
    tagline: 'Música norteña',
    description:
      'Especialista en alcance medio que utiliza su acordeón para generar ráfagas de energía y ataques musicales.',
    model: '/models/roman-ayala.glb',
    preview: '/images/characters/roman-ayala.jpg',
    scale: 0.98,
    cameraPosition: [0, 1.1, 3.2],
    accent: '#333333',
    abilities: [
      {
        id: 'acordeon-de-poder',
        name: 'Acordeón de Poder',
        description:
          'Lanza su acordeón hacia el oponente siguiendo una trayectoria de ida y regreso para atacar a media distancia.',
        icon: 'Music2',
      },
    ],
  },
  {
    id: 'natanael-chano',
    name: 'Natanael Chano',
    tagline: 'Corridos tumbados',
    description:
      'Combatiente rápido y ágil especializado en ataques consecutivos y movimientos capaces de sorprender al rival.',
    model: '/models/natanael-chano.glb',
    preview: '/images/characters/natanael-chano.jpg',
    scale: 0.95,
    cameraPosition: [0, 1.05, 3.1],
    accent: '#002F61',
    abilities: [
      {
        id: 'paso-tumbado',
        name: 'Paso Tumbado',
        description:
          'Ejecuta un fuerte pisotón que genera una vibración y una onda de impacto dirigida hacia el adversario.',
        icon: 'Footprints',
      },
    ],
  },
  {
    id: 'peso-plomo',
    name: 'Peso Plomo',
    tagline: 'Corridos bélicos',
    description:
      'Combatiente de ofensiva constante basado en velocidad, requintos y combinaciones rápidas de ataques.',
    model: '/models/peso-plomo.glb',
    preview: '/images/characters/peso-plomo.jpg',
    scale: 1,
    cameraPosition: [0, 1.15, 3.4],
    accent: '#002F61',
    abilities: [
      {
        id: 'cadena-belica',
        name: 'Cadena Bélica',
        description:
          'Utiliza su cadena para alcanzar al oponente a media distancia y generar un impacto acompañado por una descarga de baja frecuencia.',
        icon: 'Zap',
      },
    ],
  },
]

export const defaultCharacterId = characters[0]?.id ?? ''
