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

export type AuthErrorCode = 'not_enabled' | 'cancelled' | 'rejected' | 'browser' | 'generic'

export interface AuthContextValue {
  status: AuthStatus
  session: Session | null
  user: User | null
  profile: Profile | null
  sessionInfo: SessionInfo | null
  /** Motivo del último intento fallido de inicio de sesión (el texto
   *  se traduce en la interfaz: t.auth.errors[código]). */
  error: AuthErrorCode | null
  /** true dentro de la app Android (Capacitor). */
  isNative: boolean
  signInWithGoogle: () => Promise<void>
  signOut: () => Promise<void>
  clearError: () => void
}

export const AuthContext = createContext<AuthContextValue | null>(null)

export function useAuth(): AuthContextValue {
  const value = useContext(AuthContext)
  if (!value) throw new Error('useAuth must be used inside <AuthProvider>.')
  return value
}
