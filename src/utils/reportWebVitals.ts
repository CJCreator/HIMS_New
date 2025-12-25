export const reportWebVitals = (onPerfEntry?: (metric: any) => void) => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    import('web-vitals').then(({ onCLS, onFCP, onLCP, onTTFB, onINP }) => {
      onCLS(onPerfEntry);
      onFCP(onPerfEntry);
      onLCP(onPerfEntry);
      onTTFB(onPerfEntry);
      onINP(onPerfEntry);
    });
  }
};

export const logPerformance = () => {
  if (typeof window !== 'undefined' && 'performance' in window) {
    const perfData = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    
    console.log('Performance Metrics:', {
      loadTime: Math.round(perfData.loadEventEnd - perfData.fetchStart),
      domReady: Math.round(perfData.domContentLoadedEventEnd - perfData.fetchStart),
      ttfb: Math.round(perfData.responseStart - perfData.requestStart),
    });
  }
};
