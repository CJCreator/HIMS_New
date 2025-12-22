import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'happy-dom',
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    exclude: ['node_modules', 'dist', '.idea', '.git', '.cache'],
    
    // Coverage configuration
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      reportsDirectory: './coverage',
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.d.ts',
        '**/*.stories.tsx',
        'src/main.tsx',
        'src/vite-env.d.ts',
        '**/*.config.*',
        'dist/',
        'coverage/',
        'e2e/'
      ],
      
      // Global coverage thresholds
      thresholds: {
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80
        },
        
        // Critical modules require higher coverage
        'src/utils/dosageCalculator.ts': {
          branches: 95,
          functions: 95,
          lines: 95,
          statements: 95
        },
        'src/utils/allergyChecker.ts': {
          branches: 95,
          functions: 95,
          lines: 95,
          statements: 95
        },
        'src/utils/validation.ts': {
          branches: 90,
          functions: 90,
          lines: 90,
          statements: 90
        }
      }
    },
    
    // Performance monitoring
    benchmark: {
      include: ['src/**/*.bench.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
      reporters: ['verbose']
    },
    
    // Test timeout configuration
    testTimeout: 10000,
    hookTimeout: 10000,
    
    // Retry configuration for flaky tests
    retry: 2,
    
    // Reporter configuration
    reporter: ['verbose', 'json', 'html'],
    outputFile: {
      json: './test-results/results.json',
      html: './test-results/index.html'
    }
  },
  
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});