import type { Character } from '../types'

/* ==========================================================================
   PERSONAJES — DATOS DEMO
   --------------------------------------------------------------------------
   IMPORTANTE: los modelos `.glb` definitivos todavia NO existen.
   `model` apunta a la ruta donde ira el archivo final:
       public/models/<id>.glb
   Mientras el archivo no exista, el visor 3D muestra un placeholder
   geometrico y un aviso discreto (sin errores 404).

   COMO AGREGAR UN PERSONAJE:
     1. Anade una entrada a este array.
     2. Coloca el archivo en public/models/<id>.glb
     3. Coloca la ilustracion en public/images/characters/<id>.jpg
   ========================================================================== */

export const characters: Character[] = [
  {
    id: 'azteca',
    name: 'Peso Plomo',
    tagline: 'El origen del ritmo',
    description:
      'Primer guardian de la escena. Su estilo mezcla percusion tradicional con sintetizadores oscuros, y su furia concentra energia antes de cada golpe.',
    model: '/models/azteca.glb',
    preview: '/images/characters/azteca.jpg',
    scale: 1,
    cameraPosition: [0, 1.15, 3.4],
    accent: '#002F61',
    abilities: [
      {
        id: 'tambor-mayor',
        name: 'Golpe de Tambor',
        description:
          'Golpe transversal con amplificador. El primer contacto congela brevemente al rival.',
        combo: 'A',
        icon: 'Drum',
      },
      {
        id: 'cascada-sonora',
        name: 'Cascada Sonora',
        description:
          'Rafaga de notas que avanza en linea recta. Util para controlar la distancia.',
        combo: 'B',
        icon: 'Waves',
      },
      {
        id: 'estribillo-final',
        name: 'Estribillo Final',
        description:
          'Remate de karaoke. Alto dano, requiere precision en el timing del beat.',
        combo: 'A + A + B + C',
        icon: 'Star',
      },
      {
        id: 'canto-prolongado',
        name: 'Canto Prolongado',
        description:
          'Ataque de area que altera el tempo del rival. Bloquea combos durante unos segundos.',
        combo: 'Hold C',
        icon: 'Mic2',
      },
    ],
  },
  {
    id: 'mariachi',
    name: 'José José José',
    tagline: 'Precision de filarmonica',
    description:
      'Equilibrado y rapido. Domina el combate a media distancia y convierte cada frase en una oportunidad.',
    model: '/models/mariachi.glb',
    preview: '/images/characters/mariachi.jpg',
    scale: 0.98,
    cameraPosition: [0, 1.1, 3.2],
    accent: '#BABABA',
    abilities: [
      {
        id: 'arpegio',
        name: 'Arpegio',
        description: 'Serie rapida de notas ascendentes. Presion ligera con buen control de espaciado.',
        combo: 'A + A',
        icon: 'Music2',
      },
      {
        id: 'tipleo',
        name: 'Tripleo',
        description: 'Tres impactos en cruz. Castiga intentos de dash.',
        combo: 'B + B + B',
        icon: 'Repeat',
      },
      {
        id: 'crescendo',
        name: 'Crescendo',
        description: 'Aumenta el dano de los siguientes golpes mientras dure la fase de carga.',
        combo: 'Hold B',
        icon: 'TrendingUp',
      },
      {
        id: 'ruptura',
        name: 'Ruptura',
        description: 'Descarga de escala musical. Antiaereo, deja al rival sin bloqueo.',
        combo: 'Down + C',
        icon: 'Zap',
      },
    ],
  },
  {
    id: 'banda',
    name: 'Juan Grabiel',
    tagline: 'Peso y volumen',
    description:
      'Tanque de combate. Menos velocidad, mas alcance y una defensa que absorbe combos completos.',
    model: '/models/banda.glb',
    preview: '/images/characters/banda.jpg',
    scale: 1.08,
    cameraPosition: [0, 1.25, 3.8],
    accent: '#333333',
    abilities: [
      {
        id: 'marcha',
        name: 'Marcha',
        description: 'Avance pesado con bonificacion de armadura. No puede ser interrumpido.',
        combo: 'B',
        icon: 'Footprints',
      },
      {
        id: 'crescendo-mayor',
        name: 'Crescendo Mayor',
        description: 'Golpe cargado. Dano muy alto a cambio de una ventana de recuperacion larga.',
        combo: 'Hold A + A',
        icon: 'Hammer',
      },
      {
        id: 'metales',
        name: 'Metales',
        description: 'Proyeccion de sonido en cono. Elimina opciones de escape por encima.',
        combo: 'Up + B',
        icon: 'Volume2',
      },
      {
        id: 'redoble',
        name: 'Redoble Final',
        description: 'Rafaga automatica de golpes mientras el rival este en el suelo.',
        combo: 'Air + C',
        icon: 'Layers',
      },
    ],
  },
  {
    id: 'electrica',
    name: 'Alex Llora',
    tagline: 'Velocidad sobrehumana',
    description:
      'El personaje mas tecnico del roster. Prioriza movilidad, cancelaciones y combos encadenados de baja duracion.',
    model: '/models/electrica.glb',
    preview: '/images/characters/electrica.jpg',
    scale: 0.95,
    cameraPosition: [0, 1.05, 3.1],
    accent: '#002F61',
    abilities: [
      {
        id: 'pulsacion',
        name: 'Pulsacion',
        description: 'Doble toque automatico. El segundo golpe sale con cancelacion activa.',
        combo: 'A + A',
        icon: 'Activity',
      },
      {
        id: 'glitch',
        name: 'Glitch',
        description: 'Desplazamiento instantaneo a traves del rival. Ideal para reposicionarse.',
        combo: 'Down + B',
        icon: 'Ghost',
      },
      {
        id: 'saturacion',
        name: 'Saturacion',
        description: 'Revierte el timing del rival durante 3 segundos. Rompe combos defensivos.',
        combo: 'Hold C',
        icon: 'Radio',
      },
      {
        id: 'overdrive',
        name: 'Overdrive',
        description:
          'Modo final. Todos los comandos se ejecutan el doble de rapido a cambio de agotar la barra de vida.',
        combo: 'C + C',
        icon: 'Gauge',
      },
    ],
  },
  {
    id: 'electrica',
    name: 'Natanael Chano',
    tagline: 'Velocidad sobrehumana',
    description:
      'El personaje mas tecnico del roster. Prioriza movilidad, cancelaciones y combos encadenados de baja duracion.',
    model: '/models/electrica.glb',
    preview: '/images/characters/electrica.jpg',
    scale: 0.95,
    cameraPosition: [0, 1.05, 3.1],
    accent: '#002F61',
    abilities: [
      {
        id: 'pulsacion',
        name: 'Pulsacion',
        description: 'Doble toque automatico. El segundo golpe sale con cancelacion activa.',
        combo: 'A + A',
        icon: 'Activity',
      },
      {
        id: 'glitch',
        name: 'Glitch',
        description: 'Desplazamiento instantaneo a traves del rival. Ideal para reposicionarse.',
        combo: 'Down + B',
        icon: 'Ghost',
      },
      {
        id: 'saturacion',
        name: 'Saturacion',
        description: 'Revierte el timing del rival durante 3 segundos. Rompe combos defensivos.',
        combo: 'Hold C',
        icon: 'Radio',
      },
      {
        id: 'overdrive',
        name: 'Overdrive',
        description:
          'Modo final. Todos los comandos se ejecutan el doble de rapido a cambio de agotar la barra de vida.',
        combo: 'C + C',
        icon: 'Gauge',
      },
    ],
  },
  {
    id: 'electrica',
    name: '',
    tagline: 'Velocidad sobrehumana',
    description:
      'El personaje mas tecnico del roster. Prioriza movilidad, cancelaciones y combos encadenados de baja duracion.',
    model: '/models/electrica.glb',
    preview: '/images/characters/electrica.jpg',
    scale: 0.95,
    cameraPosition: [0, 1.05, 3.1],
    accent: '#002F61',
    abilities: [
      {
        id: 'pulsacion',
        name: 'Pulsacion',
        description: 'Doble toque automatico. El segundo golpe sale con cancelacion activa.',
        combo: 'A + A',
        icon: 'Activity',
      },
      {
        id: 'glitch',
        name: 'Glitch',
        description: 'Desplazamiento instantaneo a traves del rival. Ideal para reposicionarse.',
        combo: 'Down + B',
        icon: 'Ghost',
      },
      {
        id: 'saturacion',
        name: 'Saturacion',
        description: 'Revierte el timing del rival durante 3 segundos. Rompe combos defensivos.',
        combo: 'Hold C',
        icon: 'Radio',
      },
      {
        id: 'overdrive',
        name: 'Overdrive',
        description:
          'Modo final. Todos los comandos se ejecutan el doble de rapido a cambio de agotar la barra de vida.',
        combo: 'C + C',
        icon: 'Gauge',
      },
    ],
  },
]

export const defaultCharacterId = characters[0]?.id ?? ''

export function getCharacter(id: string): Character | undefined {
  return characters.find((character) => character.id === id)
}