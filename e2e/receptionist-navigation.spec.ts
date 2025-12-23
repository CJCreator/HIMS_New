import { test, expect } from '@playwright/test';
import { loginAsRole } from './helpers/auth';

test.describe('Receptionist Role Navigation and Workflows', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsRole(page, 'receptionist');
  });

  test('receptionist can access main dashboard', async ({ page }) => {
    await expect(page.locator('[data-testid="receptionist-dashboard"]')).toBeVisible();
    await expect(page.locator('[data-testid="daily-stats"]')).toBeVisible();
  });

  test('receptionist can access appointment calendar', async ({ page }) => {
    await page.click('[data-testid="receptionist-nav"]');
    await page.click('[data-testid="appointments-link"]');
    await expect(page.locator('[data-testid="appointment-calendar"]')).toBeVisible();
    await expect(page.locator('[data-testid="new-appointment-button"]')).toBeVisible();
  });

  test('receptionist can schedule new appointment', async ({ page }) => {
    await page.click('[data-testid="receptionist-nav"]');
    await page.click('[data-testid="appointments-link"]');
    await page.click('[data-testid="new-appointment-button"]');

    // Fill appointment form
    await page.fill('[data-testid="patient-search"]', 'John Doe');
    await page.click('[data-testid="patient-result"]:first-child');
    await page.selectOption('[data-testid="doctor-select"]', 'Dr. Smith');
    await page.fill('[data-testid="appointment-date"]', '2024-12-25');
    await page.selectOption('[data-testid="appointment-time"]', '10:00');
    await page.selectOption('[data-testid="appointment-type"]', 'Consultation');

    await page.click('[data-testid="schedule-appointment"]');
    await expect(page.locator('[data-testid="appointment-scheduled"]')).toBeVisible();
  });

  test('receptionist can access patient registration', async ({ page }) => {
    await page.click('[data-testid="receptionist-nav"]');
    await page.click('[data-testid="patients-link"]');
    await page.click('[data-testid="register-patient-link"]');
    await expect(page.locator('[data-testid="registration-form"]')).toBeVisible();
  });

  test('receptionist can register new patient', async ({ page }) => {
    await page.click('[data-testid="receptionist-nav"]');
    await page.click('[data-testid="patients-link"]');
    await page.click('[data-testid="register-patient-link"]');

    // Fill registration form
    await page.fill('[data-testid="first-name"]', 'Jane');
    await page.fill('[data-testid="last-name"]', 'Smith');
    await page.fill('[data-testid="date-of-birth"]', '1990-05-15');
    await page.selectOption('[data-testid="gender"]', 'female');
    await page.fill('[data-testid="phone"]', '555-0123');
    await page.fill('[data-testid="email"]', 'jane.smith@email.com');
    await page.fill('[data-testid="address"]', '123 Main St');

    await page.click('[data-testid="register-patient"]');
    await expect(page.locator('[data-testid="patient-registered"]')).toBeVisible();
  });

  test('receptionist can access billing dashboard', async ({ page }) => {
    await page.click('[data-testid="receptionist-nav"]');
    await page.click('[data-testid="billing-link"]');
    await expect(page.locator('[data-testid="billing-dashboard"]')).toBeVisible();
    await expect(page.locator('[data-testid="pending-invoices"]')).toBeVisible();
  });

  test('receptionist can generate invoice', async ({ page }) => {
    await page.click('[data-testid="receptionist-nav"]');
    await page.click('[data-testid="billing-link"]');
    await page.click('[data-testid="new-invoice-button"]');

    await page.fill('[data-testid="patient-search"]', 'John Doe');
    await page.click('[data-testid="patient-result"]:first-child');
    await page.selectOption('[data-testid="service-type"]', 'Consultation');
    await page.fill('[data-testid="amount"]', '150.00');
    await page.fill('[data-testid="description"]', 'General consultation fee');

    await page.click('[data-testid="generate-invoice"]');
    await expect(page.locator('[data-testid="invoice-generated"]')).toBeVisible();
  });

  test('receptionist can process payment', async ({ page }) => {
    await page.click('[data-testid="receptionist-nav"]');
    await page.click('[data-testid="billing-link"]');

    await page.click('[data-testid="pending-invoice"]:first-child');
    await page.click('[data-testid="process-payment"]');
    await page.selectOption('[data-testid="payment-method"]', 'cash');
    await page.fill('[data-testid="amount-received"]', '150.00');

    await page.click('[data-testid="complete-payment"]');
    await expect(page.locator('[data-testid="payment-processed"]')).toBeVisible();
  });

  test('receptionist can access insurance claims', async ({ page }) => {
    await page.click('[data-testid="receptionist-nav"]');
    await page.click('[data-testid="billing-link"]');
    await page.click('[data-testid="insurance-claims-link"]');
    await expect(page.locator('[data-testid="claims-list"]')).toBeVisible();
  });

  test('receptionist can view revenue reports', async ({ page }) => {
    await page.click('[data-testid="receptionist-nav"]');
    await page.click('[data-testid="billing-link"]');
    await page.click('[data-testid="revenue-reports-link"]');
    await expect(page.locator('[data-testid="revenue-charts"]')).toBeVisible();
  });
});