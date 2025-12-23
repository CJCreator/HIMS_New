import { test, expect } from '@playwright/test';
import { loginAsRole } from './helpers/auth';

test.describe('Admin Role Navigation and Permissions', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsRole(page, 'admin');
  });

  test('admin can access main dashboard', async ({ page }) => {
    await expect(page.locator('[data-testid="admin-dashboard"]')).toBeVisible();
    await expect(page.locator('[data-testid="admin-stats"]')).toBeVisible();
  });

  test('admin can access user management', async ({ page }) => {
    await page.click('[data-testid="admin-nav"]');
    await page.click('[data-testid="user-management-link"]');
    await expect(page.locator('[data-testid="user-list"]')).toBeVisible();
    await expect(page.locator('[data-testid="add-user-button"]')).toBeVisible();
  });

  test('admin can access analytics dashboard', async ({ page }) => {
    await page.click('[data-testid="admin-nav"]');
    await page.click('[data-testid="analytics-link"]');
    await expect(page.locator('[data-testid="analytics-charts"]')).toBeVisible();
    await expect(page.locator('[data-testid="appointment-analytics"]')).toBeVisible();
  });

  test('admin can access system settings', async ({ page }) => {
    await page.click('[data-testid="admin-nav"]');
    await page.click('[data-testid="settings-link"]');
    await expect(page.locator('[data-testid="system-settings"]')).toBeVisible();
    await expect(page.locator('[data-testid="notification-settings"]')).toBeVisible();
  });

  test('admin can access queue analytics', async ({ page }) => {
    await page.click('[data-testid="admin-nav"]');
    await page.click('[data-testid="queue-analytics-link"]');
    await expect(page.locator('[data-testid="queue-metrics"]')).toBeVisible();
  });

  test('admin can access patient demographics', async ({ page }) => {
    await page.click('[data-testid="admin-nav"]');
    await page.click('[data-testid="patient-demographics-link"]');
    await expect(page.locator('[data-testid="demographics-charts"]')).toBeVisible();
  });

  test('admin can access notification management', async ({ page }) => {
    await page.click('[data-testid="admin-nav"]');
    await page.click('[data-testid="notification-link"]');
    await expect(page.locator('[data-testid="notification-templates"]')).toBeVisible();
    await expect(page.locator('[data-testid="notification-history"]')).toBeVisible();
  });

  test('admin can access bed management', async ({ page }) => {
    await page.click('[data-testid="admin-nav"]');
    await page.click('[data-testid="bed-management-link"]');
    await expect(page.locator('[data-testid="bed-occupancy"]')).toBeVisible();
  });

  test('admin can access API documentation', async ({ page }) => {
    await page.click('[data-testid="admin-nav"]');
    await page.click('[data-testid="api-docs-link"]');
    await expect(page.locator('[data-testid="api-endpoints"]')).toBeVisible();
  });

  test('admin can access implementation progress', async ({ page }) => {
    await page.click('[data-testid="admin-nav"]');
    await page.click('[data-testid="implementation-link"]');
    await expect(page.locator('[data-testid="progress-metrics"]')).toBeVisible();
  });
});