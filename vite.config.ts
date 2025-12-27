import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  base: process.env.NODE_ENV === 'production' ? '/HIMS_New/' : '/',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Vendor chunks
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) {
              return 'vendor-react';
            }
            if (id.includes('@reduxjs/toolkit') || id.includes('react-redux')) {
              return 'vendor-redux';
            }
            if (id.includes('@tanstack/react-query')) {
              return 'vendor-react-query';
            }
            if (id.includes('recharts') || id.includes('d3')) {
              return 'vendor-charts';
            }
            if (id.includes('lucide-react') || id.includes('clsx') || id.includes('@headlessui')) {
              return 'vendor-ui';
            }
            if (id.includes('date-fns') || id.includes('web-vitals')) {
              return 'vendor-utils';
            }
            return 'vendor-other';
          }

          // Feature-based chunks
          if (id.includes('pages/consultation') || id.includes('components/Consultation')) {
            return 'feature-consultation';
          }
          if (id.includes('pages/patient') || id.includes('components/Patient')) {
            return 'feature-patient';
          }
          if (id.includes('pages/pharmacy') || id.includes('components/Prescription')) {
            return 'feature-pharmacy';
          }
          if (id.includes('pages/laboratory') || id.includes('components/Lab')) {
            return 'feature-laboratory';
          }
          if (id.includes('pages/admin') || id.includes('components/KPI')) {
            return 'feature-admin';
          }
          if (id.includes('components/charts') || id.includes('components/NPSChart')) {
            return 'feature-analytics';
          }

          // Component library chunks
          if (id.includes('components/') && !id.includes('pages/')) {
            return 'components-shared';
          }
        },
      },
    },
    chunkSizeWarningLimit: 1000,
    sourcemap: false, // Disable for production to reduce bundle size
    reportCompressedSize: true, // Report bundle sizes
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', '@reduxjs/toolkit', 'react-redux'],
  },
})