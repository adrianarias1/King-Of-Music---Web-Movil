import { createContext, useContext } from 'react'
import type { Session, User } from '@supabase/supabase-js'

/* ==========================================================================
   Contrato de la sesión que consume la interfaz.
   ========================================================================== */

export type AuthStatus = 'loading' | 'signed_out' | 'signed_in'

export interface Profile {
  firstName: string
  fullName: string
  email: string
  avatarUrl: string | null
}

/** Datos de la sesión actual, leídos de public.user_sessions. */
export interface SessionInfo {
  startedAt: string
  lastActiveAt: string
  /** Fecha límite por duración máxima (inicio + 30 días). */
  maxAgeAt: string
}

export interface AuthContextValue {
  status: AuthStatus
  session: Session | null
  user: User | null
  profile: Profile | null
  sessionInfo: SessionInfo | null
  /** Mensaje de error del último intento de inicio de sesión. */
  error: string | null
  /** true dentro de la app Android (Capacitor). */
  isNative: boolean
  signInWithGoogle: () => Promise<void>
  signOut: () => Promise<void>
  clearError: () => void
}

export const AuthContext = createContext<AuthContextValue | null>(null)

export function useAuth(): AuthContextValue {
  const value = useContext(AuthContext)
  if (!value) throw new Error('useAuth debe usarse dentro de <AuthProvider>.')
  return value
}
