import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import federation from '@originjs/vite-plugin-federation'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'clients',
      filename: 'remoteEntry.js',
      exposes: {
        './Module': './src/App.tsx',
      },
      shared: {
        react: {
          singleton: true,
          requiredVersion: '^19.1.1',
        },
        'react-dom': {
          singleton: true,
          requiredVersion: '^19.1.1',
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
      } as any
    })
  ],
  server: {
    port: 4205,
    strictPort: true,
  },
  preview: {
    port: 4205,
  },
  build: {
    target: 'esnext',
    minify: false,
    cssCodeSplit: false
  }
})
