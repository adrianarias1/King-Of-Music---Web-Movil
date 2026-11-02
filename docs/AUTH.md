# Inicio de sesión (Supabase Auth + Google)

Proyecto de Supabase: **KING OF MUSIC** (`bwpxwmfhkdxiyprrjxjc`).

## Cómo funciona

1. El botón **Iniciar sesión** del header abre el diálogo y
   `signInWithGoogle()` redirige a Google (OAuth con PKCE).
2. Google regresa a la misma página con `?code=…`; `supabase-js` lo canjea
   por la sesión y limpia la URL.
3. La primera vez, Supabase crea el usuario en `auth.users`. El trigger
   `on_auth_user_created` crea su fila en `public.profiles`.
4. El botón del header muestra el **primer nombre** de la cuenta. Al tocarlo
   se abre el panel de la cuenta: datos de la sesión, enlace a los ajustes de
   Google (pestaña nueva) y **Cerrar sesión**.

Código: `src/lib/supabase.ts`, `src/features/auth/` (`AuthProvider`, `Login`,
`Account`, `AuthDialog`, `sessionPolicy.ts`).

## Base de datos (`supabase/migrations/`)

| Objeto | Qué hace |
|---|---|
| `public.profiles` | Nombre, primer nombre, correo, foto y último inicio de sesión. Se sincroniza desde `auth.users`. RLS: cada usuario solo lee su perfil. |
| `public.user_sessions` | Historial de sesiones (inicio, última actividad, dispositivo, IP, fin y motivo). Espejo de `auth.sessions` vía trigger. RLS: solo las propias. |
| `private.sync_profile()` / `private.sync_session()` | Funciones de los triggers, en un esquema no expuesto. |
| `private.enforce_session_policy()` + pg_cron `kom-enforce-session-policy` | Cada hora cierra sesiones de más de **30 días** o con **7 días** de inactividad. |

El cliente no puede escribir en estas tablas: solo los triggers del servidor.

## Tiempos de sesión

| Concepto | Valor | Dónde se aplica |
|---|---|---|
| Access token (JWT) | 1 hora, se renueva solo | Supabase Auth |
| Duración máxima | 30 días | pg_cron (servidor) |
| Inactividad | 7 días sin abrir la web | pg_cron (servidor) |

Al borrar la sesión en `auth.sessions` se revocan sus refresh tokens; el
navegador deja de renovar y la sesión termina como máximo 1 h después.
Para cambiar los valores, editar `private.enforce_session_policy()` y
`src/features/auth/sessionPolicy.ts`.

## Configuración pendiente (panel de Google y Supabase)

### 1. Google Cloud Console

1. https://console.cloud.google.com/ → crear o elegir un proyecto.
2. **APIs y servicios → Pantalla de consentimiento de OAuth**: tipo *Externo*,
   nombre "King of Music", correo de soporte. Alcances: `openid`, `email`,
   `profile`.
3. **Credenciales → Crear credenciales → ID de cliente de OAuth → Aplicación web**.
   - *Orígenes de JavaScript autorizados*: la URL del sitio publicado y
     `http://localhost:5173` para desarrollo.
   - *URI de redireccionamiento autorizados*:
     `https://bwpxwmfhkdxiyprrjxjc.supabase.co/auth/v1/callback`
4. Copiar el **Client ID** y el **Client Secret**.

### 2. Supabase (panel del proyecto KING OF MUSIC)

1. **Authentication → Sign In / Providers → Google**: activar y pegar el
   Client ID y el Client Secret.
2. **Authentication → URL Configuration**:
   - *Site URL*: la URL del sitio publicado.
   - *Redirect URLs*: la URL del sitio publicado (con `/**`) y
     `http://localhost:5173/**`.

Hasta completar estos pasos, el botón muestra: "El inicio de sesión con
Google todavía no está activado en el servidor."

## App Android (Capacitor)

Google no permite iniciar sesión dentro de un WebView embebido. En la app
Android el botón indica que el acceso está disponible en la versión web.
Para habilitarlo en la app hace falta abrir el login en el navegador del
sistema y volver con un deep link (`@capacitor/browser` + `@capacitor/app`).
