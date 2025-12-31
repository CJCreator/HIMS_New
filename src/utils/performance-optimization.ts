// Performance optimization utilities
export const performanceOptimizations = {
  // Lazy load images with intersection observer
  lazyLoadImages: () => {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          img.src = img.dataset.src!;
          img.classList.remove('lazy');
          imageObserver.unobserve(img);
        }
      });
    });
    images.forEach(img => imageObserver.observe(img));
  },

  // Preload critical resources
  preloadCriticalResources: () => {
    const criticalResources = [
      '/api/user/profile',
      '/api/notifications/unread'
    ];
    
    criticalResources.forEach(url => {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = url;
      document.head.appendChild(link);
    });
  },

  // Optimize bundle loading
  optimizeBundleLoading: () => {
    // Preload next likely routes based on user role
    const userRole = localStorage.getItem('userRole');
    const roleRoutes = {
      doctor: ['/doctor/queue', '/doctor/consultation'],
      nurse: ['/nurse/vitals', '/nurse/medications'],
      patient: ['/patient/appointments', '/patient/records']
    };
    
    const routes = roleRoutes[userRole as keyof typeof roleRoutes] || [];
    routes.forEach(route => {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = route;
      document.head.appendChild(link);
    });
  },

  // Memory management
  cleanupMemory: () => {
    // Clear old cache entries
    if ('caches' in window) {
      caches.keys().then(names => {
        names.forEach(name => {
          if (name.includes('old') || name.includes('v0')) {
            caches.delete(name);
          }
        });
      });
    }
    
    // Clear unused event listeners
    window.removeEventListener('scroll', () => {});
    window.removeEventListener('resize', () => {});
  }
};

// Performance monitoring
export const performanceMonitor = {
  // Measure and report Core Web Vitals
  measureWebVitals: async () => {
    try {
      const { onCLS, onFCP, onLCP, onTTFB } = await import('web-vitals');
      
      onCLS(console.log);
      onFCP(console.log);
      onLCP(console.log);
      onTTFB(console.log);
    } catch (error) {
      console.warn('Web Vitals not available:', error);
    }
  },

  // Bundle size analysis
  analyzeBundleSize: () => {
    const scripts = document.querySelectorAll('script[src]');
    let totalSize = 0;
    
    scripts.forEach(script => {
      const scriptElement = script as HTMLScriptElement;
      fetch(scriptElement.src, { method: 'HEAD' })
        .then(response => {
          const size = parseInt(response.headers.get('content-length') || '0');
          totalSize += size;
          console.log(`Bundle size: ${(totalSize / 1024).toFixed(2)}KB`);
        });
    });
  },

  // Performance budget monitoring
  checkPerformanceBudget: () => {
    const budget = {
      maxBundleSize: 500 * 1024, // 500KB
      maxLoadTime: 3000, // 3 seconds
      maxLCP: 2500 // 2.5 seconds
    };
    
    // Check load time
    const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
    if (loadTime > budget.maxLoadTime) {
      console.warn(`Load time exceeded budget: ${loadTime}ms > ${budget.maxLoadTime}ms`);
    }
    
    return {
      loadTime,
      withinBudget: loadTime <= budget.maxLoadTime
    };
  }
};