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

Google no permite iniciar sesión dentro del WebView de una app, así que en el
APK el flujo es distinto al de la web:

1. `signInWithGoogle()` pide a Supabase la URL de Google con
   `redirectTo = com.kingofmusic.app://login-callback` y
   `skipBrowserRedirect: true`, y la abre con **`@capacitor/browser`**
   (Custom Tab del navegador del sistema).
2. Al terminar, Supabase redirige a `com.kingofmusic.app://login-callback?code=…`.
   Android entrega ese deep link a la app gracias al `intent-filter` de
   `android/app/src/main/AndroidManifest.xml`.
3. **`@capacitor/app`** recibe el enlace (`appUrlOpen`, o `getLaunchUrl` si la
   app estaba cerrada), se cierra el navegador y se canjea el código con
   `exchangeCodeForSession` (PKCE). Cada código se procesa una sola vez.
4. La sesión se guarda en el almacenamiento de la app. La renovación del token
   se pausa en segundo plano y se reanuda al volver (`appStateChange`).

Además, en la app cualquier enlace externo (ajustes de Google, GitHub…) se abre
en el navegador del sistema (`installExternalLinkHandler`, `src/lib/native.ts`).

| Pieza | Valor |
|---|---|
| Deep link | `com.kingofmusic.app://login-callback` (`NATIVE_AUTH_REDIRECT`) |
| Esquema en Android | `@string/custom_url_scheme` = `com.kingofmusic.app` |
| Plugins | `@capacitor/app` 8.1.2 · `@capacitor/browser` 8.0.5 |

### Configuración en Supabase (una sola vez)

**Authentication → URL Configuration → Redirect URLs** → agregar:

```
com.kingofmusic.app://login-callback
```

No hace falta cambiar nada en Google Cloud: Google sigue regresando a
`https://bwpxwmfhkdxiyprrjxjc.supabase.co/auth/v1/callback`.

### Generar el APK

```bash
npm install
npm run build
npx cap sync android
```

Luego abrir `android/` en Android Studio (o `cd android && ./gradlew assembleDebug`).
`cap sync` copia la web a la app y registra los plugins; repetirlo después de
cada cambio en la web o en las dependencias de Capacitor.
