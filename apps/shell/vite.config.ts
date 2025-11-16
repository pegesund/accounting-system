import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { federation } from '@module-federation/vite'

// https://vite.dev/config/
export default defineConfig(({ command, mode }) => {
  // Only use module federation in production/preview mode
  const useModuleFederation = command === 'build' || mode === 'production';

  const plugins = [react()];

  if (useModuleFederation) {
    plugins.push(
      federation({
        name: 'shell',
        remotes: {
          dashboard: 'dashboard@http://localhost:4201/mf-manifest.json',
          invoicing: 'invoicing@http://localhost:4202/mf-manifest.json',
          expenses: 'expenses@http://localhost:4203/mf-manifest.json',
          reports: 'reports@http://localhost:4204/mf-manifest.json',
          clients: 'clients@http://localhost:4205/mf-manifest.json',
          settings: 'settings@http://localhost:4206/mf-manifest.json',
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
    );
  }

  return {
    plugins,
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
  };
});
