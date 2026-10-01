import type { NavLink } from '../types'

/* ==========================================================================
   NAVEGACION
   Los anchors deben coincidir con los `id` de las secciones.
   ========================================================================== */

export const desktopNav: NavLink[] = [
  { label: 'Personajes', href: '#personajes' },
  { label: 'Historia', href: '#historia' },
  { label: 'Mapa', href: '#mapa' },
  { label: 'Desarrollo', href: '#desarrollo' },
]

export const mobileNav: NavLink[] = [
  { label: 'Inicio', href: '#inicio' },
  { label: 'Personajes', href: '#personajes' },
  { label: 'Trailer', href: '#trailer' },
  { label: 'Historia', href: '#historia' },
  { label: 'Mapa', href: '#mapa' },
  { label: 'Desarrollo', href: '#desarrollo' },
  { label: 'Equipo', href: '#equipo' },
]