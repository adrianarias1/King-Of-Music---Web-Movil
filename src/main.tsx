/// <reference types="vite-plugin-pwa/client" />

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Capacitor } from '@capacitor/core'
import { registerSW } from 'virtual:pwa-register'
import App from './App'
import './styles/index.css'

document.documentElement.classList.toggle('android-app', Capacitor.getPlatform() === 'android')

if (import.meta.env.PROD && !Capacitor.isNativePlatform() && 'serviceWorker' in navigator) {
  registerSW({ immediate: true })
}

const container = document.getElementById('root')

if (!container) {
  throw new Error('No se encontro el elemento #root en index.html')
}

createRoot(container).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
