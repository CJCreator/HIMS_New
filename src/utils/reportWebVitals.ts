export const reportWebVitals = (onPerfEntry?: (metric: any) => void) => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS(onPerfEntry);
      getFID(onPerfEntry);
      getFCP(onPerfEntry);
      getLCP(onPerfEntry);
      getTTFB(onPerfEntry);
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
