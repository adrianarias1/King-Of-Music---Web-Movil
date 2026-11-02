import { createClient } from '@supabase/supabase-js'

/* ==========================================================================
   KING OF MUSIC — Cliente de Supabase
   --------------------------------------------------------------------------
   Proyecto: KING OF MUSIC (bwpxwmfhkdxiyprrjxjc)

   La URL y la clave PUBLICABLE (sb_publishable_…) están hechas para usarse
   en el navegador: los datos se protegen con RLS en la base de datos.
   NUNCA colocar aquí la clave secreta / service_role.

   Se pueden sobrescribir con variables de entorno (ver .env.example):
     VITE_SUPABASE_URL
     VITE_SUPABASE_PUBLISHABLE_KEY
   ========================================================================== */

const SUPABASE_URL =
  import.meta.env.VITE_SUPABASE_URL || 'https://bwpxwmfhkdxiyprrjxjc.supabase.co'

const SUPABASE_PUBLISHABLE_KEY =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  'sb_publishable_RtxdthA8UNuo9EfzlDo1Iw_3hGO1Wua'

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    // PKCE: Google regresa con ?code= y supabase-js lo canjea por la sesión.
    flowType: 'pkce',
    detectSessionInUrl: true,
    // La sesión se guarda en el navegador y el access token (1 h) se
    // renueva solo mientras la página está abierta.
    persistSession: true,
    autoRefreshToken: true,
    storageKey: 'kom-auth',
  },
})
