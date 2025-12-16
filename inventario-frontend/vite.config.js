import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/productos': 'http://localhost:8080',
      '/ventas': 'http://localhost:8080',
      '/auth': 'http://localhost:8080',
      '/categorias': 'http://localhost:8080',
      '/marcas': 'http://localhost:8080'
    }
  }
})
