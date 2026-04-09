/* global process */
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Detectar ambiente
const isDev = process.env.NODE_ENV !== 'production'
const isElectron = process.env.VITE_PLATFORM === 'desktop'
const isMobile = process.env.VITE_PLATFORM === 'mobile'

export default defineConfig({
  plugins: [
    react()
  ],

  server: {
    host: true,
    port: process.env.VITE_PORT || 5173,
    strictPort: false,
    cors: {
      origin: '*'
    },
    proxy: {
      '/api': {
        target: process.env.VITE_API_URL || 'http://192.168.1.248:5000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  },

  build: {
    target: 'esnext',
    minify: isDev ? false : 'esbuild',
    esbuild: {
      drop: !isDev ? ['console', 'debugger'] : []
    },
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) {
            return 'react-vendor';
          }
          if (id.includes('node_modules/axios')) {
            return 'utils';
          }
          if (id.includes('node_modules/react-router-dom')) {
            return 'router';
          }
        }
      }
    },
    reportCompressedSize: true,
    sourcemap: isDev,
    outDir: 'dist',
    assetsDir: 'assets',
    cssCodeSplit: true,
    brotliSize: !isDev
  },

  resolve: {
    alias: {
      '@': '/src'
    },
    extensions: ['.js', '.jsx', '.json', '.ts', '.tsx']
  },

  // Otimizações específicas por plataforma
  define: {
    __DEV__: isDev,
    __PLATFORM__: JSON.stringify(process.env.VITE_PLATFORM || 'web'),
    __VERSION__: JSON.stringify(process.env.npm_package_version || '1.0.0')
  },

  // Configuração para diferentes plataformas
  ...(isElectron && {
    base: './'
  }),

  ...(isMobile && {
    base: './'
  })
})
