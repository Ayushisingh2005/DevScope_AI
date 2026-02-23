import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,       // Exposes the server to your local network (required for Docker)
    port: 5173,       // Standard Vite port
    watch: {
      usePolling: true // Ensures hot-reloading works seamlessly between Windows and Docker
    }
  }
})