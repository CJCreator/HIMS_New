import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  base: '/HIMS_New/',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})