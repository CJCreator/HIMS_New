interface PerformanceMetric {
  name: string;
  duration: number;
  timestamp: number;
}

class PerformanceMonitor {
  private metrics: PerformanceMetric[] = [];
  private marks: Map<string, number> = new Map();

  startMeasure(name: string): void {
    this.marks.set(name, performance.now());
  }

  endMeasure(name: string): number {
    const startTime = this.marks.get(name);
    if (!startTime) {
      console.warn(`No start mark found for: ${name}`);
      return 0;
    }

    const duration = performance.now() - startTime;
    this.metrics.push({
      name,
      duration,
      timestamp: Date.now(),
    });

    this.marks.delete(name);
    return duration;
  }

  measureAsync<T>(name: string, fn: () => Promise<T>): Promise<T> {
    this.startMeasure(name);
    return fn().finally(() => {
      const duration = this.endMeasure(name);
      if (duration > 1000) {
        console.warn(`Slow operation: ${name} took ${duration.toFixed(2)}ms`);
      }
    });
  }

  getMetrics(): PerformanceMetric[] {
    return [...this.metrics];
  }

  getAverageDuration(name: string): number {
    const filtered = this.metrics.filter(m => m.name === name);
    if (filtered.length === 0) return 0;
    return filtered.reduce((sum, m) => sum + m.duration, 0) / filtered.length;
  }

  clearMetrics(): void {
    this.metrics = [];
    this.marks.clear();
  }

  getSlowOperations(threshold: number = 1000): PerformanceMetric[] {
    return this.metrics.filter(m => m.duration > threshold);
  }

  logSummary(): void {
    const summary = this.metrics.reduce((acc, metric) => {
      if (!acc[metric.name]) {
        acc[metric.name] = { count: 0, total: 0, avg: 0, max: 0 };
      }
      acc[metric.name].count++;
      acc[metric.name].total += metric.duration;
      acc[metric.name].max = Math.max(acc[metric.name].max, metric.duration);
      acc[metric.name].avg = acc[metric.name].total / acc[metric.name].count;
      return acc;
    }, {} as Record<string, { count: number; total: number; avg: number; max: number }>);

    console.table(summary);
  }
}

export const performanceMonitor = new PerformanceMonitor();

// React hook for performance monitoring
export function usePerformanceMonitor(name: string) {
  const startTime = performance.now();

  return () => {
    const duration = performance.now() - startTime;
    performanceMonitor.getMetrics().push({
      name,
      duration,
      timestamp: Date.now(),
    });
  };
}
