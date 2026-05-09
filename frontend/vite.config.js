import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const apiUrl = env.VITE_API_URL || 'http://localhost:5000'

  return {
    plugins: [react()],
    server: {
      host: true,
      port: parseInt(env.VITE_PORT) || 5173,
      strictPort: false,
      proxy: {
        '/api': {
          target: apiUrl,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, '')
        }
      }
    },
    resolve: {
      alias: { '@': '/src' },
      extensions: ['.js', '.jsx', '.json', '.ts', '.tsx']
    },
    define: {
      __DEV__: mode !== 'production',
      __PLATFORM__: JSON.stringify(env.VITE_PLATFORM || 'web'),
    },
    build: {
      target: 'esnext',
      outDir: 'dist',
      sourcemap: mode === 'development',
    }
  }
})
