import type { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'com.kingofmusic.app',
  appName: 'King of Music',
  webDir: 'dist',
  android: {
    backgroundColor: '#000000',
  },
  server: {
    androidScheme: 'https',
  },
}

export default config