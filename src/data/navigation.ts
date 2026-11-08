import type { NavLink } from '../types'

/* ==========================================================================
   NAVEGACION
   Los anchors deben coincidir con los `id` de las secciones.
   ========================================================================== */

export const desktopNav: NavLink[] = [
  { label: {
   es: 'Personajes',
   en: 'Characters',
 }, href: '#personajes' },
  { label: {
   es: 'Historia',
   en: 'Story',
 }, href: '#historia' },
  { label: {
   es: 'Mapa',
   en: 'Map',
 }, href: '#mapa' },
  { label: {
   es: 'Desarrollo',
   en: 'Development',
 }, href: '#desarrollo' },
]

export const mobileNav: NavLink[] = [
  { label: {
   es: 'Inicio',
   en: 'Home',
 }, href: '#inicio' },
  { label: {
   es: 'Personajes',
   en: 'Characters',
 }, href: '#personajes' },
  { label: {
   es: 'Trailer',
   en: 'Trailer',
 }, href: '#trailer' },
  { label: {
   es: 'Historia',
   en: 'Story',
 }, href: '#historia' },
  { label: {
   es: 'Mapa',
   en: 'Map',
 }, href: '#mapa' },
  { label: {
   es: 'Desarrollo',
   en: 'Development',
 }, href: '#desarrollo' },
  { label: {
   es: 'Equipo',
   en: 'Team',
 }, href: '#equipo' },
]