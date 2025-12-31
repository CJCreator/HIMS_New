import { test, expect } from '@playwright/test';
import { TestHelpers } from '../utils/test-helpers';
import testData from '../fixtures/test-data.json';

test.describe('Authentication', () => {
  let helpers: TestHelpers;

  test.beforeEach(async ({ page }) => {
    helpers = new TestHelpers(page);
  });

  test('should login successfully with valid doctor credentials', async ({ page }) => {
    const doctor = testData.users.doctor;
    
    await page.goto('/login');
    await page.fill('[data-testid="username"]', doctor.username);
    await page.fill('[data-testid="password"]', doctor.password);
    await page.click('[data-testid="login-button"]');
    
    await page.waitForURL(/.*dashboard/);
    await expect(page.locator('[data-testid="dashboard-title"]')).toBeVisible();
  });

  test('should show error with invalid credentials', async ({ page }) => {
    await page.goto('/login');
    await page.fill('[data-testid="username"]', 'invalid@example.com');
    await page.fill('[data-testid="password"]', 'wrongpassword');
    await page.click('[data-testid="login-button"]');
    
    await expect(page.locator('[data-testid="error-message"]')).toBeVisible();
    await expect(page.locator('[data-testid="error-message"]')).toContainText('Invalid credentials');
  });

  test('should redirect to login when accessing protected route without auth', async ({ page }) => {
    await page.goto('/doctor/dashboard');
    await page.waitForURL('/login');
    await expect(page.locator('[data-testid="login-form"]')).toBeVisible();
  });

  test('should logout successfully', async ({ page }) => {
    await helpers.login('doctor');
    await helpers.logout();
    await expect(page.locator('[data-testid="login-form"]')).toBeVisible();
  });

  test('should maintain session on page refresh', async ({ page }) => {
    await helpers.login('doctor');
    await page.reload();
    await expect(page.locator('[data-testid="dashboard-title"]')).toBeVisible();
  });

  test.describe('Role-based access', () => {
    test('doctor should access doctor dashboard', async ({ page }) => {
      await helpers.login('doctor');
      await expect(page.locator('[data-testid="doctor-dashboard"]')).toBeVisible();
    });

    test('nurse should access nurse dashboard', async ({ page }) => {
      await helpers.login('nurse');
      await expect(page.locator('[data-testid="nurse-dashboard"]')).toBeVisible();
    });

    test('should prevent cross-role access', async ({ page }) => {
      await helpers.login('nurse');
      await page.goto('/doctor/dashboard');
      await expect(page.locator('[data-testid="unauthorized-message"]')).toBeVisible();
    });
  });
});