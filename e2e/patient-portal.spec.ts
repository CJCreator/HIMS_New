import { test, expect } from '@playwright/test';
import { loginAsRole } from './helpers/auth';

test.describe('Patient Portal Navigation and Features', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsRole(page, 'patient');
  });

  test('patient can access portal dashboard', async ({ page }) => {
    await expect(page.locator('[data-testid="patient-dashboard"]')).toBeVisible();
    await expect(page.locator('[data-testid="upcoming-appointments"]')).toBeVisible();
    await expect(page.locator('[data-testid="recent-results"]')).toBeVisible();
  });

  test('patient can view appointments', async ({ page }) => {
    await page.click('[data-testid="patient-nav"]');
    await page.click('[data-testid="my-appointments-link"]');
    await expect(page.locator('[data-testid="appointments-list"]')).toBeVisible();
    await expect(page.locator('[data-testid="book-appointment-button"]')).toBeVisible();
  });

  test('patient can book appointment', async ({ page }) => {
    await page.click('[data-testid="patient-nav"]');
    await page.click('[data-testid="my-appointments-link"]');
    await page.click('[data-testid="book-appointment-button"]');

    // Select doctor and time
    await page.selectOption('[data-testid="doctor-select"]', 'Dr. Smith');
    await page.fill('[data-testid="preferred-date"]', '2024-12-30');
    await page.selectOption('[data-testid="time-slot"]', '14:00');
    await page.selectOption('[data-testid="appointment-reason"]', 'Follow-up');

    await page.click('[data-testid="submit-appointment"]');
    await expect(page.locator('[data-testid="appointment-requested"]')).toBeVisible();
  });

  test('patient can view prescriptions', async ({ page }) => {
    await page.click('[data-testid="patient-nav"]');
    await page.click('[data-testid="my-prescriptions-link"]');
    await expect(page.locator('[data-testid="prescriptions-list"]')).toBeVisible();
    await expect(page.locator('[data-testid="active-prescriptions"]')).toBeVisible();
  });

  test('patient can view prescription details', async ({ page }) => {
    await page.click('[data-testid="patient-nav"]');
    await page.click('[data-testid="my-prescriptions-link"]');

    await page.click('[data-testid="prescription-item"]:first-child');
    await expect(page.locator('[data-testid="medication-name"]')).toBeVisible();
    await expect(page.locator('[data-testid="dosage-info"]')).toBeVisible();
    await expect(page.locator('[data-testid="refill-status"]')).toBeVisible();
  });

  test('patient can view lab results', async ({ page }) => {
    await page.click('[data-testid="patient-nav"]');
    await page.click('[data-testid="lab-results-link"]');
    await expect(page.locator('[data-testid="results-list"]')).toBeVisible();
  });

  test('patient can view health summary', async ({ page }) => {
    await page.click('[data-testid="patient-nav"]');
    await page.click('[data-testid="health-summary-link"]');
    await expect(page.locator('[data-testid="vital-signs-history"]')).toBeVisible();
    await expect(page.locator('[data-testid="medical-history"]')).toBeVisible();
  });

  test('patient can access medical records', async ({ page }) => {
    await page.click('[data-testid="patient-nav"]');
    await page.click('[data-testid="my-records-link"]');
    await expect(page.locator('[data-testid="records-list"]')).toBeVisible();
    await expect(page.locator('[data-testid="download-button"]')).toBeVisible();
  });

  test('patient can view bills', async ({ page }) => {
    await page.click('[data-testid="patient-nav"]');
    await page.click('[data-testid="my-bills-link"]');
    await expect(page.locator('[data-testid="bills-list"]')).toBeVisible();
    await expect(page.locator('[data-testid="payment-status"]')).toBeVisible();
  });

  test('patient can submit feedback', async ({ page }) => {
    await page.click('[data-testid="patient-nav"]');
    await page.click('[data-testid="feedback-link"]');
    await expect(page.locator('[data-testid="feedback-form"]')).toBeVisible();

    await page.selectOption('[data-testid="service-rating"]', '5');
    await page.fill('[data-testid="comments"]', 'Excellent care and service');
    await page.click('[data-testid="submit-feedback"]');
    await expect(page.locator('[data-testid="feedback-submitted"]')).toBeVisible();
  });

  test('patient can use symptom checker', async ({ page }) => {
    await page.click('[data-testid="patient-nav"]');
    await page.click('[data-testid="symptom-checker-link"]');
    await expect(page.locator('[data-testid="symptom-input"]')).toBeVisible();

    await page.fill('[data-testid="symptom-input"]', 'headache');
    await page.click('[data-testid="check-symptoms"]');
    await expect(page.locator('[data-testid="possible-conditions"]')).toBeVisible();
  });

  test('patient can access secure messaging', async ({ page }) => {
    await page.click('[data-testid="patient-nav"]');
    await page.click('[data-testid="messages-link"]');
    await expect(page.locator('[data-testid="message-list"]')).toBeVisible();
    await expect(page.locator('[data-testid="new-message-button"]')).toBeVisible();
  });
});