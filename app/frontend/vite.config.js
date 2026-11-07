import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Si el 5173 está ocupado, Vite se detiene en vez de saltar a otro puerto
  // que el CORS del backend (FRONTEND_URL) no permitiría.
  server: { port: 5173, strictPort: true },
})
