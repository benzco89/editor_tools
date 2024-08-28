import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/editor_tools/',
  define: {
    'process.env': process.env
  }
})