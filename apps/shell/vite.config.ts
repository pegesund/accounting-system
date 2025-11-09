import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import federation from '@originjs/vite-plugin-federation'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'shell',
      remotes: {
        dashboard: 'http://localhost:4201/assets/remoteEntry.js',
        invoicing: 'http://localhost:4202/assets/remoteEntry.js',
        expenses: 'http://localhost:4203/assets/remoteEntry.js',
        reports: 'http://localhost:4204/assets/remoteEntry.js',
        clients: 'http://localhost:4205/assets/remoteEntry.js',
      },
      shared: ['react', 'react-dom', 'react-router-dom']
    })
  ],
  server: {
    port: 4200,
    strictPort: true,
  },
  preview: {
    port: 4200,
  },
  build: {
    target: 'esnext',
    minify: false,
    cssCodeSplit: false
  }
})
