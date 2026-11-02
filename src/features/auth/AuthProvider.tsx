import { useCallback, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import type { Session, User } from '@supabase/supabase-js'
import { App as CapacitorApp } from '@capacitor/app'
import { Browser } from '@capacitor/browser'

import { supabase } from '../../lib/supabase'
import { isNativeApp, NATIVE_AUTH_REDIRECT } from '../../lib/native'
import { AuthContext } from './authContext'
import type { AuthContextValue, AuthStatus, Profile, SessionInfo } from './authContext'
import { SESSION_MAX_AGE_DAYS } from './sessionPolicy'

/* ==========================================================================
   KING OF MUSIC — Proveedor de sesión (Supabase Auth + Google)
   --------------------------------------------------------------------------
   Flujo:
     1. signInWithGoogle() redirige a Google (OAuth, PKCE).
     2. Google regresa a esta misma página con ?code=…
     3. supabase-js canjea el código por la sesión (detectSessionInUrl).
        - Si es la primera vez, Supabase crea el usuario en auth.users y el
          trigger on_auth_user_created crea su fila en public.profiles.
        - El trigger on_auth_session_change registra la sesión en
          public.user_sessions.
     4. onAuthStateChange actualiza la interfaz (nombre en el header).

   La sesión vive en localStorage ("kom-auth"); el access token dura 1 h y
   se renueva solo. El servidor cierra sesiones vencidas (ver
   sessionPolicy.ts).
   ========================================================================== */

const DAY_MS = 24 * 60 * 60 * 1000

/** Deep links ya procesados: un código OAuth solo se puede canjear una vez. */
const handledAuthUrls = new Set<string>()

/** Lee el session_id del access token (JWT) sin validarlo: solo para UI. */
function sessionIdFromToken(token: string): string | null {
  try {
    const payload = token.split('.')[1]
    if (!payload) return null
    const json = atob(payload.replace(/-/g, '+').replace(/_/g, '/'))
    const data = JSON.parse(json) as { session_id?: unknown }
    return typeof data.session_id === 'string' ? data.session_id : null
  } catch {
    return null
  }
}

const titleCase = (value: string) =>
  value.toLocaleLowerCase('es-MX').replace(/(^|\s)(\p{L})/gu, (_m, space: string, letter: string) => space + letter.toLocaleUpperCase('es-MX'))

/**
 * Nombre visible a partir de los metadatos de Google.
 * Misma regla que private.display_name_parts() en la base de datos:
 * las cuentas institucionales (claim "hd") entregan
 * "APELLIDO APELLIDO NOMBRE(S)" en mayúsculas y se reordenan.
 */
function displayNames(meta: Record<string, unknown>): { fullName: string; firstName: string } {
  const text = (value: unknown) => (typeof value === 'string' ? value.trim().replace(/\s+/g, ' ') : '')
  const raw = text(meta.full_name) || text(meta.name)
  const given = text(meta.given_name)
  const claims = (meta.custom_claims ?? {}) as Record<string, unknown>
  const hd = text(claims.hd) || text(meta.hd)
  if (!raw) return { fullName: given, firstName: given }

  const words = raw.split(' ')
  const allCaps = raw === raw.toLocaleUpperCase('es-MX')
  if (!given && hd && allCaps && words.length >= 3) {
    const reordered = [...words.slice(2), ...words.slice(0, 2)].join(' ')
    return { fullName: titleCase(reordered), firstName: titleCase(words[2] ?? '') }
  }
  const fullName = allCaps ? titleCase(raw) : raw
  return { fullName, firstName: given || fullName.split(' ')[0] || '' }
}

/** Perfil a partir de los metadatos de Google, mientras llega el de la BD. */
function profileFromUser(user: User): Profile {
  const meta = (user.user_metadata ?? {}) as Record<string, unknown>
  const text = (value: unknown) => (typeof value === 'string' ? value.trim() : '')
  const { fullName, firstName } = displayNames(meta)
  return {
    firstName: firstName || (user.email ?? '').split('@')[0] || 'Cuenta',
    fullName: fullName || firstName,
    email: user.email ?? '',
    avatarUrl: text(meta.avatar_url) || text(meta.picture) || null,
  }
}

/** Lee y limpia de la URL los parámetros que deja el regreso de OAuth. */
function consumeOAuthParams(): string | null {
  const url = new URL(window.location.href)
  const hash = new URLSearchParams(url.hash.replace(/^#/, ''))
  const error =
    url.searchParams.get('error_description') ??
    hash.get('error_description') ??
    url.searchParams.get('error') ??
    null

  const keys = ['code', 'error', 'error_code', 'error_description', 'state']
  const hadParams = keys.some((key) => url.searchParams.has(key)) || hash.has('error')
  if (hadParams) {
    keys.forEach((key) => url.searchParams.delete(key))
    if (hash.has('error')) url.hash = ''
    window.history.replaceState(window.history.state, '', url.toString())
  }
  return error
}

function friendlyError(raw: string): string {
  if (/provider is not enabled|Unsupported provider/i.test(raw)) {
    return 'El inicio de sesión con Google todavía no está activado en el servidor.'
  }
  if (/access_denied|denied/i.test(raw)) {
    return 'Cancelaste el inicio de sesión con Google.'
  }
  if (/Unable to exchange external code|invalid_client|server_error/i.test(raw)) {
    return 'Google rechazó la conexión con el servidor. Revisa el Client ID y el Client Secret configurados en Supabase.'
  }
  return 'No se pudo iniciar sesión con Google. Inténtalo de nuevo.'
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>('loading')
  const [session, setSession] = useState<Session | null>(null)
  const [dbProfile, setDbProfile] = useState<{ userId: string; profile: Profile } | null>(null)
  const [sessionInfo, setSessionInfo] = useState<SessionInfo | null>(null)
  const [error, setError] = useState<string | null>(null)

  const isNative = isNativeApp
  const user = session?.user ?? null

  // ---------------------------------------------------------------------
  // 1. Sesión inicial + suscripción a cambios
  // ---------------------------------------------------------------------
  useEffect(() => {
    let alive = true

    // getSession espera a que supabase-js termine de canjear ?code=.
    supabase.auth.getSession().then(({ data, error: sessionError }) => {
      if (!alive) return
      const urlError = consumeOAuthParams()
      const message = urlError ?? sessionError?.message
      if (message) setError(friendlyError(message))
      setSession(data.session)
      setStatus(data.session ? 'signed_in' : 'signed_out')
    })

    const { data: listener } = supabase.auth.onAuthStateChange((_event, next) => {
      if (!alive) return
      setSession(next)
      setStatus(next ? 'signed_in' : 'signed_out')
      if (!next) {
        setDbProfile(null)
        setSessionInfo(null)
      }
    })

    return () => {
      alive = false
      listener.subscription.unsubscribe()
    }
  }, [])

  // ---------------------------------------------------------------------
  // 1b. App Android: regreso de Google por deep link + ciclo de vida
  //
  //   Google no permite iniciar sesión dentro del WebView de la app. Por
  //   eso el login se abre en el navegador del sistema (Custom Tab) y
  //   Supabase regresa a la app con:
  //     com.kingofmusic.app://login-callback?code=…
  //   Aquí se canjea ese código por la sesión (PKCE: el code_verifier quedó
  //   guardado en el almacenamiento de la app antes de abrir el navegador).
  // ---------------------------------------------------------------------
  useEffect(() => {
    if (!isNativeApp) return undefined
    let alive = true

    const handleUrl = async (url: string | undefined) => {
      if (!url || !url.startsWith(NATIVE_AUTH_REDIRECT) || handledAuthUrls.has(url)) return
      handledAuthUrls.add(url)
      await Browser.close().catch(() => undefined)

      const parsed = new URL(url)
      const hash = new URLSearchParams(parsed.hash.replace(/^#/, ''))
      const oauthError =
        parsed.searchParams.get('error_description') ??
        hash.get('error_description') ??
        parsed.searchParams.get('error')
      if (oauthError) {
        if (alive) setError(friendlyError(oauthError))
        return
      }

      const code = parsed.searchParams.get('code')
      if (!code) return
      const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
      if (exchangeError && alive) setError(friendlyError(exchangeError.message))
      // Si funcionó, onAuthStateChange actualiza la sesión.
    }

    const warn = (reason: unknown) => console.warn('[KingOfMusic] Plugin nativo no disponible:', reason)

    // App abierta (o en segundo plano) al llegar el deep link.
    const urlListener = CapacitorApp.addListener('appUrlOpen', ({ url }) => {
      void handleUrl(url)
    }).catch(warn)

    // App cerrada: Android la abre directamente con el deep link.
    CapacitorApp.getLaunchUrl()
      .then((launch) => handleUrl(launch?.url))
      .catch(warn)

    // Renovación del token solo con la app en primer plano: en segundo
    // plano Android congela los temporizadores del WebView.
    const stateListener = CapacitorApp.addListener('appStateChange', ({ isActive }) => {
      if (isActive) void supabase.auth.startAutoRefresh()
      else void supabase.auth.stopAutoRefresh()
    }).catch(warn)

    return () => {
      alive = false
      void urlListener.then((handle) => handle?.remove())
      void stateListener.then((handle) => handle?.remove())
    }
  }, [])

  // ---------------------------------------------------------------------
  // 2. Perfil y datos de la sesión desde la base de datos (RLS: solo propios)
  // ---------------------------------------------------------------------
  const userId = user?.id
  const accessToken = session?.access_token

  useEffect(() => {
    if (!userId || !accessToken) return undefined
    let alive = true

    // Supabase recomienda no llamar a la API dentro de onAuthStateChange;
    // por eso se hace en un efecto aparte.
    const load = async () => {
      const { data: row } = await supabase
        .from('profiles')
        .select('first_name, full_name, email, avatar_url')
        .eq('id', userId)
        .maybeSingle()

      if (alive && row) {
        setDbProfile({
          userId,
          profile: {
            firstName: row.first_name ?? '',
            fullName: row.full_name ?? '',
            email: row.email ?? '',
            avatarUrl: row.avatar_url ?? null,
          },
        })
      }

      const sessionId = sessionIdFromToken(accessToken)
      if (!sessionId) return
      const { data: info } = await supabase
        .from('user_sessions')
        .select('created_at, last_active_at')
        .eq('id', sessionId)
        .maybeSingle()

      if (alive && info) {
        setSessionInfo({
          startedAt: info.created_at,
          lastActiveAt: info.last_active_at,
          maxAgeAt: new Date(
            Date.parse(info.created_at) + SESSION_MAX_AGE_DAYS * DAY_MS,
          ).toISOString(),
        })
      }
    }

    void load()
    return () => {
      alive = false
    }
  }, [userId, accessToken])

  // El perfil de la BD manda; si aún no llega, se usan los metadatos.
  const profile = useMemo<Profile | null>(() => {
    if (!user) return null
    const fallback = profileFromUser(user)
    const fromDb = dbProfile?.userId === user.id ? dbProfile.profile : null
    if (!fromDb) return fallback
    return {
      firstName: fromDb.firstName || fallback.firstName,
      fullName: fromDb.fullName || fallback.fullName,
      email: fromDb.email || fallback.email,
      avatarUrl: fromDb.avatarUrl ?? fallback.avatarUrl,
    }
  }, [user, dbProfile])

  // ---------------------------------------------------------------------
  // 3. Acciones
  // ---------------------------------------------------------------------
  const signInWithGoogle = useCallback(async () => {
    setError(null)

    // App Android: login en el navegador del sistema y regreso por deep link.
    if (isNativeApp) {
      const { data, error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: NATIVE_AUTH_REDIRECT,
          skipBrowserRedirect: true,
          queryParams: { prompt: 'select_account' },
        },
      })
      if (oauthError || !data?.url) {
        setError(friendlyError(oauthError?.message ?? 'No se pudo iniciar sesión'))
        return
      }
      try {
        await Browser.open({ url: data.url, windowName: '_self' })
      } catch {
        setError('No se pudo abrir el navegador para iniciar sesión. Inténtalo de nuevo.')
      }
      return
    }

    // Web: regresa a la misma página (respeta base './' y subcarpetas).
    const redirectTo = `${window.location.origin}${window.location.pathname}`
    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo,
        // Permite elegir cuenta aunque haya una sesión de Google abierta.
        queryParams: { prompt: 'select_account' },
      },
    })
    if (oauthError) setError(friendlyError(oauthError.message))
  }, [])

  const signOut = useCallback(async () => {
    // scope 'local': cierra solo este dispositivo. El trigger marca la
    // sesión como terminada en public.user_sessions.
    const { error: signOutError } = await supabase.auth.signOut({ scope: 'local' })
    if (signOutError) {
      // Aunque falle la red, se limpia la sesión local.
      await supabase.auth.signOut({ scope: 'local' }).catch(() => undefined)
    }
  }, [])

  const clearError = useCallback(() => setError(null), [])

  const value = useMemo<AuthContextValue>(
    () => ({
      status,
      session,
      user,
      profile,
      sessionInfo: user ? sessionInfo : null,
      error,
      isNative,
      signInWithGoogle,
      signOut,
      clearError,
    }),
    [status, session, user, profile, sessionInfo, error, isNative, signInWithGoogle, signOut, clearError],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
