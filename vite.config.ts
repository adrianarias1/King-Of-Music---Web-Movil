import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // PWA (lista de cotejo, sección 3):
    //  - Manifiesto escrito a mano: public/manifest.webmanifest, enlazado en
    //    index.html (por eso manifest: false).
    //  - Service worker propio: src/sw.js → dist/sw.js. El plugin solo le
    //    inyecta la lista de archivos a precargar (self.__WB_MANIFEST).
    //  - Registro explícito: src/pwa/registerServiceWorker.ts.
    VitePWA({
      strategies: 'injectManifest',
      srcDir: 'src',
      filename: 'sw.js',
      injectRegister: null,
      manifest: false,
      injectManifest: {
        // Página principal, offline.html, JS, CSS, iconos, manifiesto e
        // imágenes (historia, personajes, mapa, escenarios): todo lo
        // necesario para consultar el sitio sin conexión.
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webp,jpg,jpeg,woff2,json,webmanifest}'],
        // Los modelos 3D (.glb) se guardan aparte (src/lib/modelCache.ts) y
        // las capturas del manifiesto solo las usa el diálogo de instalación.
        globIgnores: ['**/*.glb', 'screenshots/**'],
        maximumFileSizeToCacheInBytes: 8 * 1024 * 1024,
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
