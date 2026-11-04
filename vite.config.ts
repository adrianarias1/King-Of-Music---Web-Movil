import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import { MODELS_CACHE } from './src/modelsVersion.ts'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      // La app registra el SW solo en navegador web, nunca en la WebView nativa.
      injectRegister: null,
      includeAssets: ['icons/favicon.svg', 'icons/king-of-music-32.png'],
      manifest: {
        name: 'King of Music',
        short_name: 'King of Music',
        display: 'standalone',
        start_url: './',
        scope: './',
        theme_color: '#002F61',
        background_color: '#050505',
        lang: 'es-MX',
        icons: [
          {
            src: './icons/king-of-music-192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: './icons/king-of-music-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webp,jpg,jpeg,woff2,json,webmanifest}'],
        // Storyboard e ilustraciones de personajes son pesadas y no hacen
        // falta para arrancar: se excluyen de la precarga y se guardan en
        // caché la primera vez que el usuario las ve (runtimeCaching).
        globIgnores: ['**/*.glb', 'images/storyboard/**', 'images/characters/**'],
        maximumFileSizeToCacheInBytes: 8 * 1024 * 1024,
        cleanupOutdatedCaches: true,
        skipWaiting: true,
        clientsClaim: true,
        navigateFallback: 'index.html',
        runtimeCaching: [
          {
            // Modelos 3D: se sirven desde la caché aunque no haya internet.
            // La página los precarga en esta misma caché al abrirse
            // (src/lib/modelCache.ts). La versión va en la URL (?v=…).
            urlPattern: /\/models\/characters\/[^/?]+\.glb(?:\?.*)?$/i,
            handler: 'CacheFirst',
            options: {
              cacheName: MODELS_CACHE,
              cacheableResponse: { statuses: [200] },
              matchOptions: { ignoreVary: true },
            },
          },
          {
            urlPattern: /\/images\/(?:storyboard|characters)\/[^?]+\.(?:webp|png|jpe?g)(?:\?.*)?$/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'kom-artwork',
              expiration: { maxEntries: 60, maxAgeSeconds: 60 * 60 * 24 * 30 },
            },
          },
        ],
      },
    }),
  ],
  // Rutas relativas: permite abrir dist/index.html desde el sistema de
  // archivos y desde el WebView de Capacitor (file://) sin romper assets.
  base: './',
  build: {
    target: 'es2020',
    cssTarget: 'chrome80',
    assetsInlineLimit: 2048,
    // El chunk de three.js supera 500 kB, pero se carga de forma diferida
    // (React.lazy en App.tsx) y nunca bloquea el render inicial.
    chunkSizeWarningLimit: 1200,
    rollupOptions: {
      output: {
        // IMPORTANTE: no se fuerza un chunk para three.js.
        // Si se fuerza, el chunk entra como dependencia estatica del entry y
        // Vite lo anade como <link modulepreload> en index.html, anulando el
        // lazy loading de CharacterViewer. Se deja que el import dinamico de
        // App.tsx lo separe de forma natural.
        manualChunks: (id) => {
          if (id.includes('node_modules/motion')) return 'motion'
          return undefined
        },
      },
    },
  },
})
