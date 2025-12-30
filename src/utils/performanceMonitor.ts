/**
 * Performance Testing Utilities
 * Measures animation FPS, memory usage, and performance metrics
 */

export class PerformanceMonitor {
  private frames: number[] = [];
  private startTime: number = 0;
  private rafId: number | null = null;

  /**
   * Measure FPS during animations
   */
  measureFPS(duration: number = 5000): Promise<{ avgFPS: number; minFPS: number; maxFPS: number }> {
    return new Promise((resolve) => {
      this.frames = [];
      this.startTime = performance.now();
      let lastFrameTime = this.startTime;

      const measureFrame = () => {
        const currentTime = performance.now();
        const frameDuration = currentTime - lastFrameTime;
        const fps = 1000 / frameDuration;
        
        this.frames.push(fps);
        lastFrameTime = currentTime;

        if (currentTime - this.startTime < duration) {
          this.rafId = requestAnimationFrame(measureFrame);
        } else {
          this.stopMeasuring();
          resolve(this.calculateFPSStats());
        }
      };

      this.rafId = requestAnimationFrame(measureFrame);
    });
  }

  /**
   * Stop FPS measurement
   */
  stopMeasuring() {
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  /**
   * Calculate FPS statistics
   */
  private calculateFPSStats() {
    const avgFPS = this.frames.reduce((a, b) => a + b, 0) / this.frames.length;
    const minFPS = Math.min(...this.frames);
    const maxFPS = Math.max(...this.frames);

    return { avgFPS: Math.round(avgFPS), minFPS: Math.round(minFPS), maxFPS: Math.round(maxFPS) };
  }

  /**
   * Measure memory usage
   */
  measureMemory(): { usedJSHeapSize: number; totalJSHeapSize: number; limit: number } | null {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      return {
        usedJSHeapSize: Math.round(memory.usedJSHeapSize / 1048576), // MB
        totalJSHeapSize: Math.round(memory.totalJSHeapSize / 1048576), // MB
        limit: Math.round(memory.jsHeapSizeLimit / 1048576), // MB
      };
    }
    return null;
  }

  /**
   * Measure animation performance
   */
  async testAnimationPerformance(testName: string, animationFn: () => void, duration: number = 3000) {
    console.log(`🧪 Testing: ${testName}`);
    
    const memoryBefore = this.measureMemory();
    const fpsPromise = this.measureFPS(duration);
    
    // Trigger animation
    animationFn();
    
    const fpsStats = await fpsPromise;
    const memoryAfter = this.measureMemory();

    const results = {
      test: testName,
      fps: fpsStats,
      memory: {
        before: memoryBefore,
        after: memoryAfter,
        leaked: memoryAfter && memoryBefore 
          ? memoryAfter.usedJSHeapSize - memoryBefore.usedJSHeapSize 
          : null,
      },
      passed: fpsStats.avgFPS >= 55, // 55fps threshold (allowing 5fps margin)
    };

    console.log('📊 Results:', results);
    return results;
  }
}

/**
 * Bundle size analyzer
 */
export const analyzeBundleSize = () => {
  const scripts = Array.from(document.querySelectorAll('script[src]'));
  const styles = Array.from(document.querySelectorAll('link[rel="stylesheet"]'));

  console.log('📦 Bundle Analysis:');
  console.log('Scripts:', scripts.length);
  console.log('Stylesheets:', styles.length);
  
  return { scripts: scripts.length, styles: styles.length };
};

/**
 * Lighthouse metrics helper
 */
export const getLighthouseMetrics = () => {
  const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
  
  return {
    FCP: performance.getEntriesByName('first-contentful-paint')[0]?.startTime || 0,
    LCP: 0, // Requires PerformanceObserver
    TTI: navigation?.domInteractive || 0,
    TBT: 0, // Requires Long Tasks API
    CLS: 0, // Requires Layout Shift API
  };
};

/**
 * Test reduced-motion support
 */
export const testReducedMotion = () => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  console.log('♿ Reduced Motion:', prefersReducedMotion ? 'ENABLED' : 'DISABLED');
  return prefersReducedMotion;
};

// Export singleton instance
export const perfMonitor = new PerformanceMonitor();
