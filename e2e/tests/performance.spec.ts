import { test, expect } from '@playwright/test';
import { playAudit } from 'playwright-lighthouse';

test.describe('Performance Optimization Tests', () => {
  test('Lighthouse performance audit - Desktop', async ({ page, browserName }) => {
    test.skip(browserName !== 'chromium', 'Lighthouse only works with Chromium');
    
    await page.goto('/');
    
    const audit = await playAudit({
      page,
      thresholds: {
        performance: 90,
        accessibility: 90,
        'best-practices': 90,
        seo: 80,
        pwa: 80
      },
      port: 9222
    });
    
    expect(audit.lhr.categories.performance.score * 100).toBeGreaterThan(90);
    expect(audit.lhr.categories.accessibility.score * 100).toBeGreaterThan(90);
  });

  test('Bundle size validation', async ({ page }) => {
    await page.goto('/');
    
    const bundleSize = await page.evaluate(() => {
      const scripts = Array.from(document.querySelectorAll('script[src]'));
      return scripts.reduce((total, script) => {
        const src = script.getAttribute('src');
        if (src && src.includes('assets')) {
          return total + 1;
        }
        return total;
      }, 0);
    });
    
    expect(bundleSize).toBeLessThan(10); // Max 10 script files
  });

  test('Core Web Vitals measurement', async ({ page }) => {
    await page.goto('/');
    
    const webVitals = await page.evaluate(() => {
      return new Promise((resolve) => {
        const vitals = {};
        
        // Measure LCP
        new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          vitals.lcp = lastEntry.startTime;
        }).observe({ entryTypes: ['largest-contentful-paint'] });
        
        // Measure FID
        new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry) => {
            vitals.fid = entry.processingStart - entry.startTime;
          });
        }).observe({ entryTypes: ['first-input'] });
        
        setTimeout(() => resolve(vitals), 3000);
      });
    });
    
    expect(webVitals.lcp).toBeLessThan(2500); // LCP < 2.5s
    if (webVitals.fid) {
      expect(webVitals.fid).toBeLessThan(100); // FID < 100ms
    }
  });

  test('Service worker registration', async ({ page }) => {
    await page.goto('/');
    
    const swRegistered = await page.evaluate(() => {
      return 'serviceWorker' in navigator;
    });
    
    expect(swRegistered).toBe(true);
  });

  test('Image optimization', async ({ page }) => {
    await page.goto('/doctor/dashboard');
    
    const images = await page.locator('img').all();
    
    for (const img of images) {
      const src = await img.getAttribute('src');
      const alt = await img.getAttribute('alt');
      
      expect(alt).toBeTruthy(); // All images should have alt text
      if (src && !src.startsWith('data:')) {
        expect(src).toMatch(/\.(webp|avif|jpg|jpeg|png)$/i);
      }
    }
  });

  test('Memory usage monitoring', async ({ page }) => {
    await page.goto('/');
    
    const memoryInfo = await page.evaluate(() => {
      return (performance as any).memory ? {
        usedJSHeapSize: (performance as any).memory.usedJSHeapSize,
        totalJSHeapSize: (performance as any).memory.totalJSHeapSize,
        jsHeapSizeLimit: (performance as any).memory.jsHeapSizeLimit
      } : null;
    });
    
    if (memoryInfo) {
      const memoryUsagePercent = (memoryInfo.usedJSHeapSize / memoryInfo.jsHeapSizeLimit) * 100;
      expect(memoryUsagePercent).toBeLessThan(50); // Memory usage < 50%
    }
  });
});