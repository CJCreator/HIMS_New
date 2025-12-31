import React from 'react'
import ReactDOM from 'react-dom/client'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Toaster } from 'sonner'
import App from './App.tsx'
import { queryClient } from './lib/queryClient'
import { initSentry } from './utils/sentry'
import { trackWebVitals } from './utils/performance'
import { performanceOptimizations } from './utils/performance-optimization'
import { ErrorBoundary } from './components/ErrorBoundary'
import './index.css'

// Initialize Sentry
initSentry();

// Initialize performance monitoring
trackWebVitals();

// Register service worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => console.log('SW registered:', registration))
      .catch(error => console.log('SW registration failed:', error));
  });
}

// Initialize performance optimizations
performanceOptimizations.preloadCriticalResources();
performanceOptimizations.optimizeBundleLoading();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <Toaster position="top-right" richColors closeButton />
        <App />
        {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
      </QueryClientProvider>
    </ErrorBoundary>
  </React.StrictMode>,
)