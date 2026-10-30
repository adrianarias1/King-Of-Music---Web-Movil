import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

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
        globIgnores: ['**/*.glb'],
        maximumFileSizeToCacheInBytes: 8 * 1024 * 1024,
        cleanupOutdatedCaches: true,
        skipWaiting: true,
        clientsClaim: true,
        navigateFallback: 'index.html',
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/pub-635f10d16c96474cb14af54616e8ce39\.r2\.dev\/models\/characters\/.*\.glb(?:\?.*)?$/i,
            handler: 'NetworkOnly',
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
