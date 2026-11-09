/* ==========================================================================
   KING OF MUSIC — Archivos en Cloudflare R2
   --------------------------------------------------------------------------
   Bucket público:
     <MEDIA_BASE>/Trailer Oficial.mp4        tráiler oficial
     <MEDIA_BASE>/Miniatura trailer.png      miniatura del tráiler
     <MEDIA_BASE>/KingOfMusic_Setup.exe      instalador del juego (Windows)
     <MEDIA_BASE>/models/combos/<archivo>.mp4  habilidades y combos
   Ejemplos de combos: alex_llora_combo1.mp4, juan_grabriel_special_beam.mp4

   No se empaquetan en el sitio ni en el APK ni entran en la caché sin
   conexión (son pesados): se cargan solo al abrir su modal.
   La URL base se puede cambiar con VITE_MEDIA_BASE_URL.
   ========================================================================== */

const MEDIA_BASE = (
  import.meta.env.VITE_MEDIA_BASE_URL || 'https://pub-635f10d16c96474cb14af54616e8ce39.r2.dev'
).replace(/\/+$/, '')

/** URL de un archivo del bucket. Codifica cada parte (espacios, acentos). */
export function mediaUrl(path: string): string {
  return `${MEDIA_BASE}/${path.split('/').map(encodeURIComponent).join('/')}`
}

/** URL de un video de la carpeta models/combos del bucket. */
export function comboVideo(file: string): string {
  return `${MEDIA_BASE}/models/combos/${file}`
}
