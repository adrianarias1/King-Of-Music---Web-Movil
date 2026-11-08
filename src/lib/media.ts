/* ==========================================================================
   KING OF MUSIC — Videos de habilidades y combos
   --------------------------------------------------------------------------
   Los videos viven en el bucket público de Cloudflare R2:
     <MEDIA_BASE>/models/combos/<archivo>.mp4
   Ejemplos: alex_llora_combo1.mp4, juan_grabriel_special_beam.mp4

   No se empaquetan en el sitio ni en el APK ni entran en la caché sin
   conexión (son pesados): se cargan solo al abrir su modal.
   La URL base se puede cambiar con VITE_MEDIA_BASE_URL.
   ========================================================================== */

const MEDIA_BASE = (
  import.meta.env.VITE_MEDIA_BASE_URL || 'https://pub-635f10d16c96474cb14af54616e8ce39.r2.dev'
).replace(/\/+$/, '')

/** URL de un video de la carpeta models/combos del bucket. */
export function comboVideo(file: string): string {
  return `${MEDIA_BASE}/models/combos/${file}`
}
