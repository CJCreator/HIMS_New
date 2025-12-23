import { test, expect } from '@playwright/test';
import { loginAsRole } from './helpers/auth';

test.describe('Pharmacist Role Navigation and Workflows', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsRole(page, 'pharmacist');
  });

  test('pharmacist can access main dashboard', async ({ page }) => {
    await expect(page.locator('[data-testid="pharmacy-dashboard"]')).toBeVisible();
    await expect(page.locator('[data-testid="prescription-stats"]')).toBeVisible();
  });

  test('pharmacist can access prescription queue', async ({ page }) => {
    await page.click('[data-testid="pharmacy-nav"]');
    await page.click('[data-testid="prescription-queue-link"]');
    await expect(page.locator('[data-testid="pending-prescriptions"]')).toBeVisible();
    await expect(page.locator('[data-testid="queue-filters"]')).toBeVisible();
  });

  test('pharmacist can process prescription', async ({ page }) => {
    await page.click('[data-testid="pharmacy-nav"]');
    await page.click('[data-testid="prescription-queue-link"]');

    await page.click('[data-testid="prescription-item"]:first-child');
    await expect(page.locator('[data-testid="prescription-details"]')).toBeVisible();

    // Verify prescription details
    await expect(page.locator('[data-testid="patient-name"]')).toBeVisible();
    await expect(page.locator('[data-testid="medication-list"]')).toBeVisible();
    await expect(page.locator('[data-testid="dosage-instructions"]')).toBeVisible();

    // Process prescription
    await page.click('[data-testid="verify-prescription"]');
    await page.click('[data-testid="dispense-medication"]');
    await expect(page.locator('[data-testid="prescription-dispensed"]')).toBeVisible();
  });

  test('pharmacist can access inventory management', async ({ page }) => {
    await page.click('[data-testid="pharmacy-nav"]');
    await page.click('[data-testid="inventory-link"]');
    await expect(page.locator('[data-testid="inventory-list"]')).toBeVisible();
    await expect(page.locator('[data-testid="low-stock-alerts"]')).toBeVisible();
  });

  test('pharmacist can update inventory', async ({ page }) => {
    await page.click('[data-testid="pharmacy-nav"]');
    await page.click('[data-testid="inventory-link"]');

    await page.click('[data-testid="inventory-item"]:first-child');
    await page.fill('[data-testid="quantity-input"]', '50');
    await page.click('[data-testid="update-stock"]');
    await expect(page.locator('[data-testid="stock-updated"]')).toBeVisible();
  });

  test('pharmacist can manage medication requests', async ({ page }) => {
    await page.click('[data-testid="pharmacy-nav"]');
    await page.click('[data-testid="medication-requests-link"]');
    await expect(page.locator('[data-testid="requests-list"]')).toBeVisible();
  });

  test('pharmacist can view batch tracking', async ({ page }) => {
    await page.click('[data-testid="pharmacy-nav"]');
    await page.click('[data-testid="batch-tracking-link"]');
    await expect(page.locator('[data-testid="batch-list"]')).toBeVisible();
    await expect(page.locator('[data-testid="expiry-dates"]')).toBeVisible();
  });

  test('pharmacist can monitor expiry alerts', async ({ page }) => {
    await page.click('[data-testid="pharmacy-nav"]');
    await page.click('[data-testid="expiry-alerts-link"]');
    await expect(page.locator('[data-testid="expiring-medications"]')).toBeVisible();
  });

  test('pharmacist can access inventory analytics', async ({ page }) => {
    await page.click('[data-testid="pharmacy-nav"]');
    await page.click('[data-testid="inventory-analytics-link"]');
    await expect(page.locator('[data-testid="usage-charts"]')).toBeVisible();
    await expect(page.locator('[data-testid="reorder-reports"]')).toBeVisible();
  });

  test('pharmacist can manage reorder points', async ({ page }) => {
    await page.click('[data-testid="pharmacy-nav"]');
    await page.click('[data-testid="reorder-management-link"]');
    await expect(page.locator('[data-testid="reorder-list"]')).toBeVisible();
    await page.click('[data-testid="generate-order"]');
    await expect(page.locator('[data-testid="order-generated"]')).toBeVisible();
  });
});