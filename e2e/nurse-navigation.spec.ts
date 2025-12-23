import { test, expect } from '@playwright/test';
import { loginAsRole } from './helpers/auth';

test.describe('Nurse Role Navigation and Workflows', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsRole(page, 'nurse');
  });

  test('nurse can access main dashboard', async ({ page }) => {
    await expect(page.locator('[data-testid="nurse-dashboard"]')).toBeVisible();
    await expect(page.locator('[data-testid="ward-overview"]')).toBeVisible();
  });

  test('nurse can access vitals entry workflow', async ({ page }) => {
    await page.click('[data-testid="nurse-nav"]');
    await page.click('[data-testid="vitals-entry-link"]');
    await expect(page.locator('[data-testid="patient-selector"]')).toBeVisible();
    await expect(page.locator('[data-testid="vitals-form"]')).toBeVisible();
  });

  test('nurse can record patient vitals', async ({ page }) => {
    await page.click('[data-testid="nurse-nav"]');
    await page.click('[data-testid="vitals-entry-link"]');

    // Select patient
    await page.click('[data-testid="patient-selector"]');
    await page.click('[data-testid="patient-option"]:first-child');

    // Enter vitals
    await page.fill('[data-testid="blood-pressure-systolic"]', '120');
    await page.fill('[data-testid="blood-pressure-diastolic"]', '80');
    await page.fill('[data-testid="heart-rate"]', '72');
    await page.fill('[data-testid="temperature"]', '98.6');
    await page.fill('[data-testid="respiratory-rate"]', '16');
    await page.fill('[data-testid="oxygen-saturation"]', '98');

    await page.click('[data-testid="save-vitals"]');
    await expect(page.locator('[data-testid="vitals-saved-message"]')).toBeVisible();
  });

  test('nurse can access patient records', async ({ page }) => {
    await page.click('[data-testid="nurse-nav"]');
    await page.click('[data-testid="patient-records-link"]');
    await expect(page.locator('[data-testid="patient-list"]')).toBeVisible();
    await expect(page.locator('[data-testid="search-patient"]')).toBeVisible();
  });

  test('nurse can view patient details', async ({ page }) => {
    await page.click('[data-testid="nurse-nav"]');
    await page.click('[data-testid="patient-records-link"]');

    await page.click('[data-testid="patient-item"]:first-child');
    await expect(page.locator('[data-testid="patient-details"]')).toBeVisible();
    await expect(page.locator('[data-testid="medical-history"]')).toBeVisible();
    await expect(page.locator('[data-testid="current-medications"]')).toBeVisible();
  });

  test('nurse can access ward management', async ({ page }) => {
    await page.click('[data-testid="nurse-nav"]');
    await page.click('[data-testid="ward-management-link"]');
    await expect(page.locator('[data-testid="bed-occupancy"]')).toBeVisible();
    await expect(page.locator('[data-testid="patient-assignment"]')).toBeVisible();
  });

  test('nurse can manage shift handover', async ({ page }) => {
    await page.click('[data-testid="nurse-nav"]');
    await page.click('[data-testid="shift-handover-link"]');
    await expect(page.locator('[data-testid="handover-notes"]')).toBeVisible();
    await expect(page.locator('[data-testid="critical-events"]')).toBeVisible();
  });

  test('nurse can handle medication requests', async ({ page }) => {
    await page.click('[data-testid="nurse-nav"]');
    await page.click('[data-testid="medication-requests-link"]');
    await expect(page.locator('[data-testid="pending-requests"]')).toBeVisible();
    await expect(page.locator('[data-testid="request-actions"]')).toBeVisible();
  });

  test('nurse can process medication request', async ({ page }) => {
    await page.click('[data-testid="nurse-nav"]');
    await page.click('[data-testid="medication-requests-link"]');

    await page.click('[data-testid="request-item"]:first-child');
    await page.click('[data-testid="approve-request"]');
    await expect(page.locator('[data-testid="request-approved"]')).toBeVisible();
  });
});