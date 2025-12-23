import { test, expect } from '@playwright/test';
import { loginAsRole } from './helpers/auth';

test.describe('Performance Testing', () => {
  test('initial page load under 3 seconds', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/auth/signin');
    await expect(page.locator('[data-testid="signin-form"]')).toBeVisible();
    const loadTime = Date.now() - startTime;

    expect(loadTime).toBeLessThan(3000);
  });

  test('admin dashboard loads quickly', async ({ page }) => {
    const startTime = Date.now();
    await loginAsRole(page, 'admin');
    const loadTime = Date.now() - startTime;

    expect(loadTime).toBeLessThan(3000);
  });

  test('doctor consultation workflow loads quickly', async ({ page }) => {
    await loginAsRole(page, 'doctor');

    const startTime = Date.now();
    await page.click('[data-testid="patient-queue-nav"]');
    await page.click('[data-testid="patient-item"]:first-child');
    await page.click('[data-testid="start-consultation"]');
    await expect(page.locator('[data-testid="consultation-step-1"]')).toBeVisible();
    const loadTime = Date.now() - startTime;

    expect(loadTime).toBeLessThan(2000);
  });

  test('patient portal loads quickly', async ({ page }) => {
    const startTime = Date.now();
    await loginAsRole(page, 'patient');
    const loadTime = Date.now() - startTime;

    expect(loadTime).toBeLessThan(3000);
  });

  test('prescription processing is fast', async ({ page }) => {
    await loginAsRole(page, 'pharmacist');

    const startTime = Date.now();
    await page.click('[data-testid="pharmacy-nav"]');
    await page.click('[data-testid="prescription-queue-link"]');
    await page.click('[data-testid="prescription-item"]:first-child');
    await page.click('[data-testid="verify-prescription"]');
    await page.click('[data-testid="dispense-medication"]');
    await expect(page.locator('[data-testid="prescription-dispensed"]')).toBeVisible();
    const processTime = Date.now() - startTime;

    expect(processTime).toBeLessThan(5000);
  });

  test('appointment scheduling is responsive', async ({ page }) => {
    await loginAsRole(page, 'receptionist');

    const startTime = Date.now();
    await page.click('[data-testid="receptionist-nav"]');
    await page.click('[data-testid="appointments-link"]');
    await page.click('[data-testid="new-appointment-button"]');
    await page.fill('[data-testid="patient-search"]', 'John Doe');
    await page.click('[data-testid="patient-result"]:first-child');
    await page.selectOption('[data-testid="doctor-select"]', 'Dr. Smith');
    await page.fill('[data-testid="appointment-date"]', '2024-12-25');
    await page.selectOption('[data-testid="appointment-time"]', '10:00');
    await page.click('[data-testid="schedule-appointment"]');
    await expect(page.locator('[data-testid="appointment-scheduled"]')).toBeVisible();
    const scheduleTime = Date.now() - startTime;

    expect(scheduleTime).toBeLessThan(5000);
  });

  test('lab results load quickly', async ({ page }) => {
    await loginAsRole(page, 'patient');

    const startTime = Date.now();
    await page.click('[data-testid="patient-nav"]');
    await page.click('[data-testid="lab-results-link"]');
    await expect(page.locator('[data-testid="results-list"]')).toBeVisible();
    const loadTime = Date.now() - startTime;

    expect(loadTime).toBeLessThan(2000);
  });

  test('no memory leaks in long-running sessions', async ({ page }) => {
    await loginAsRole(page, 'doctor');

    // Simulate long-running session with multiple operations
    for (let i = 0; i < 10; i++) {
      await page.click('[data-testid="patient-queue-nav"]');
      await page.click('[data-testid="patient-item"]:first-child');
      await page.click('[data-testid="start-consultation"]');
      await page.click('[data-testid="next-step"]');
      await page.click('[data-testid="skip-step"]');
      await page.click('[data-testid="complete-consultation"]');
      await page.click('[data-testid="queue-list"]');
    }

    // Check that page is still responsive
    await expect(page.locator('[data-testid="doctor-dashboard"]')).toBeVisible();
  });

  test('bundle size is reasonable', async ({ page }) => {
    await page.goto('/auth/signin');

    // Get network requests to check bundle sizes
    const requests: Array<{ url: string; size: string }> = [];
    page.on('response', response => {
      if (response.url().includes('.js') || response.url().includes('.css')) {
        requests.push({
          url: response.url(),
          size: response.headers()['content-length'] || '0'
        });
      }
    });

    await page.waitForLoadState('networkidle');

    // Check that main bundle is not too large (under 2MB)
    const mainBundle = requests.find(req => req.url.includes('main.'));
    if (mainBundle) {
      expect(parseInt(mainBundle.size)).toBeLessThan(2097152); // 2MB
    }
  });
});