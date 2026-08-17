import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/active-customers': 'http://localhost:3000',
      '/billed-customers': 'http://localhost:3000',
    },
  },
})
