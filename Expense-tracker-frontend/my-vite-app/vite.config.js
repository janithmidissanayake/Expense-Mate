import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'


export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://backend:8080', // Pointing to backend service
        changeOrigin: true,             // Ensures correct origin header
        // No need for rewrite, so this can be removed:
        // rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})
