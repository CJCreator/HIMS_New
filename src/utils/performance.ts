import { onCLS, onFCP, onLCP, onTTFB, onINP, Metric } from 'web-vitals';
import { useEffect } from 'react';

// Performance monitoring configuration
interface PerformanceConfig {
  enableLogging: boolean;
  enableReporting: boolean;
  reportEndpoint?: string;
  thresholds: {
    lcp: number; // Largest Contentful Paint (ms)
    inp: number; // Interaction to Next Paint (ms)
    cls: number; // Cumulative Layout Shift
    fcp: number; // First Contentful Paint (ms)
    ttfb: number; // Time to First Byte (ms)
  };
}

const defaultConfig: PerformanceConfig = {
  enableLogging: process.env.NODE_ENV === 'development',
  enableReporting: process.env.NODE_ENV === 'production',
  thresholds: {
    lcp: 2500, // 2.5s
    inp: 200,  // 200ms
    cls: 0.1,  // 0.1
    fcp: 1800, // 1.8s
    ttfb: 800, // 800ms
  },
};

class PerformanceMonitor {
  private config: PerformanceConfig;
  private metrics: Map<string, Metric> = new Map();

  constructor(config: Partial<PerformanceConfig> = {}) {
    this.config = { ...defaultConfig, ...config };
    this.initializeMonitoring();
  }

  private initializeMonitoring() {
    // Monitor Core Web Vitals
    onCLS(this.handleMetric.bind(this));
    onINP(this.handleMetric.bind(this));
    onFCP(this.handleMetric.bind(this));
    onLCP(this.handleMetric.bind(this));
    onTTFB(this.handleMetric.bind(this));

    // Monitor navigation timing
    if (window.performance && window.performance.timing) {
      window.addEventListener('load', () => {
        setTimeout(() => this.reportNavigationTiming(), 0);
      });
    }

    // Monitor long tasks
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.duration > 50) { // Long task > 50ms
            this.reportLongTask(entry as PerformanceEntry);
          }
        }
      });
      observer.observe({ entryTypes: ['longtask'] });
    }
  }

  private handleMetric(metric: Metric) {
    this.metrics.set(metric.name, metric);

    if (this.config.enableLogging) {
      console.log(`[Performance] ${metric.name}:`, {
        value: metric.value,
        rating: this.getRating(metric),
        delta: metric.delta,
      });
    }

    // Check against thresholds
    const threshold = this.config.thresholds[metric.name.toLowerCase() as keyof PerformanceConfig['thresholds']];
    if (threshold && metric.value > threshold) {
      console.warn(`[Performance] ${metric.name} exceeded threshold: ${metric.value} > ${threshold}`);
    }

    // Report to endpoint if enabled
    if (this.config.enableReporting && this.config.reportEndpoint) {
      this.reportMetric(metric);
    }
  }

  private getRating(metric: Metric): 'good' | 'needs-improvement' | 'poor' {
    const { name, value } = metric;

    switch (name) {
      case 'CLS':
        return value <= 0.1 ? 'good' : value <= 0.25 ? 'needs-improvement' : 'poor';
      case 'INP':
        return value <= 200 ? 'good' : value <= 500 ? 'needs-improvement' : 'poor';
      case 'FCP':
      case 'LCP':
        return value <= 1800 ? 'good' : value <= 3000 ? 'needs-improvement' : 'poor';
      case 'TTFB':
        return value <= 800 ? 'good' : 'needs-improvement';
      default:
        return 'good';
    }
  }

  private reportNavigationTiming() {
    const timing = window.performance.timing;
    const navigation = {
      dnsLookup: timing.domainLookupEnd - timing.domainLookupStart,
      tcpConnect: timing.connectEnd - timing.connectStart,
      serverResponse: timing.responseStart - timing.requestStart,
      pageLoad: timing.loadEventEnd - timing.navigationStart,
      domReady: timing.domContentLoadedEventEnd - timing.navigationStart,
    };

    if (this.config.enableLogging) {
      console.log('[Performance] Navigation Timing:', navigation);
    }

    if (this.config.enableReporting && this.config.reportEndpoint) {
      fetch(this.config.reportEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'navigation',
          data: navigation,
          timestamp: Date.now(),
          url: window.location.href,
        }),
      }).catch(console.error);
    }
  }

  private reportLongTask(entry: PerformanceEntry) {
    if (this.config.enableLogging) {
      console.warn('[Performance] Long task detected:', {
        duration: entry.duration,
        startTime: entry.startTime,
      });
    }
  }

  private reportMetric(metric: Metric) {
    fetch(this.config.reportEndpoint!, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'web-vital',
        metric: metric.name,
        value: metric.value,
        rating: this.getRating(metric),
        timestamp: Date.now(),
        url: window.location.href,
      }),
    }).catch(console.error);
  }

  // Public API
  public getMetrics() {
    return Object.fromEntries(this.metrics);
  }

  public getMetric(name: string) {
    return this.metrics.get(name);
  }

  public updateConfig(newConfig: Partial<PerformanceConfig>) {
    this.config = { ...this.config, ...newConfig };
  }
}

// Create singleton instance
export const performanceMonitor = new PerformanceMonitor();

// React hook for component-level performance tracking
export function usePerformanceTracking(componentName: string) {
  const startTime = performance.now();

  useEffect(() => {
    const duration = performance.now() - startTime;
    if (defaultConfig.enableLogging) {
      console.log(`[Performance] ${componentName} render time: ${duration.toFixed(2)}ms`);
    }
  });
}

// Utility to measure function performance
export function measurePerformance<T extends (...args: any[]) => any>(
  fn: T,
  name: string
): T {
  return ((...args: Parameters<T>) => {
    const start = performance.now();
    const result = fn(...args);
    const duration = performance.now() - start;

    if (defaultConfig.enableLogging) {
      console.log(`[Performance] ${name}: ${duration.toFixed(2)}ms`);
    }

    return result;
  }) as T;
}
