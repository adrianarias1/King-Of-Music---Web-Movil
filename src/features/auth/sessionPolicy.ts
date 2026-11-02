/* ==========================================================================
   Política de sesiones
   --------------------------------------------------------------------------
   El SERVIDOR es quien la aplica: el trabajo pg_cron
   "kom-enforce-session-policy" (cada hora) ejecuta
   private.enforce_session_policy(), que borra de auth.sessions las sesiones
   vencidas y con ello revoca sus refresh tokens.

   Estos valores solo se usan para mostrar la información al usuario.
   Si cambian, actualizar también la función en Supabase.
   ========================================================================== */

/** Duración máxima absoluta de una sesión. */
export const SESSION_MAX_AGE_DAYS = 30

/** Días sin abrir la web/app tras los cuales la sesión se cierra. */
export const SESSION_INACTIVITY_DAYS = 7

/** Vida del access token (JWT) de Supabase; se renueva automáticamente. */
export const ACCESS_TOKEN_MINUTES = 60

/** Página de ajustes de la cuenta de Google. */
export const GOOGLE_ACCOUNT_URL = 'https://myaccount.google.com/'
