import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
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