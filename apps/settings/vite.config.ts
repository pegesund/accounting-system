import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { federation } from '@module-federation/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'settings',
      filename: 'remoteEntry.js',
      exposes: {
        './Module': './src/App.tsx',
      },
      shared: {
        react: {
          singleton: true,
        },
        'react-dom': {
          singleton: true,
        },
        'react-router-dom': {
          singleton: true,
        },
        'react-i18next': {
          singleton: true,
        },
        'i18next': {
          singleton: true,
        },
      }
    })
  ],
  server: {
    port: 4206,
    strictPort: true,
  },
  preview: {
    port: 4206,
  },
  build: {
    target: 'esnext',
    minify: false,
    cssCodeSplit: false
  }
})
