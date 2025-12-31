import { test, expect } from '@playwright/test';
import { TestHelpers } from '../utils/test-helpers';
import testData from '../fixtures/test-data.json';

test.describe('Doctor Workflow', () => {
  let helpers: TestHelpers;

  test.beforeEach(async ({ page }) => {
    helpers = new TestHelpers(page);
    await helpers.login('doctor');
  });

  test('should complete full consultation workflow', async ({ page }) => {
    // Start consultation from patient queue
    await page.click('[data-testid="patient-queue"]');
    await page.click('[data-testid="start-consultation"]:first-child');
    
    // Step 1: Patient Overview
    await helpers.expectPageTitle('Patient Overview');
    await page.fill('[data-testid="chief-complaint"]', 'Headache and fatigue');
    await page.click('[data-testid="next-step"]');
    
    // Step 2: Vitals Review
    await helpers.expectPageTitle('Vitals Review');
    await page.click('[data-testid="vitals-reviewed"]');
    await page.click('[data-testid="next-step"]');
    
    // Step 3: Clinical Assessment
    await helpers.expectPageTitle('Clinical Assessment');
    await page.fill('[data-testid="symptoms"]', 'Patient reports moderate headache');
    await page.fill('[data-testid="examination"]', 'Normal physical examination');
    await page.click('[data-testid="next-step"]');
    
    // Step 4: Diagnosis & Treatment
    await helpers.expectPageTitle('Diagnosis & Treatment');
    await page.fill('[data-testid="diagnosis"]', 'Tension headache');
    await page.fill('[data-testid="treatment-plan"]', 'Rest and hydration');
    await page.click('[data-testid="next-step"]');
    
    // Step 5: Prescriptions & Orders
    await helpers.expectPageTitle('Prescriptions & Orders');
    await page.click('[data-testid="add-prescription"]');
    await page.fill('[data-testid="medication-name"]', 'Ibuprofen');
    await page.fill('[data-testid="dosage"]', '400mg');
    await page.fill('[data-testid="frequency"]', 'Every 6 hours as needed');
    await page.click('[data-testid="save-prescription"]');
    
    // Complete consultation
    await page.click('[data-testid="complete-consultation"]');
    await helpers.expectToastMessage('Consultation completed successfully');
  });

  test('should auto-save consultation progress', async ({ page }) => {
    await page.click('[data-testid="patient-queue"]');
    await page.click('[data-testid="start-consultation"]:first-child');
    
    await page.fill('[data-testid="chief-complaint"]', 'Test complaint');
    
    // Wait for auto-save indicator
    await expect(page.locator('[data-testid="auto-save-indicator"]')).toHaveText('Saved');
    
    // Refresh page and verify data persists
    await page.reload();
    await expect(page.locator('[data-testid="chief-complaint"]')).toHaveValue('Test complaint');
  });

  test('should create and print prescription', async ({ page }) => {
    await page.click('[data-testid="prescriptions"]');
    await page.click('[data-testid="create-prescription"]');
    
    // Fill prescription details
    await page.fill('[data-testid="patient-search"]', 'John Doe');
    await page.click('[data-testid="patient-result"]:first-child');
    
    await page.click('[data-testid="add-medication"]');
    await page.fill('[data-testid="medication-name"]', testData.medications.common[0].name);
    await page.fill('[data-testid="dosage"]', testData.medications.common[0].dosage);
    await page.fill('[data-testid="frequency"]', testData.medications.common[0].frequency);
    
    await page.click('[data-testid="save-prescription"]');
    await helpers.expectToastMessage('Prescription created successfully');
    
    // Test print functionality
    await page.click('[data-testid="print-prescription"]');
    // Note: Actual print testing would require additional setup
  });

  test('should order lab tests', async ({ page }) => {
    await page.click('[data-testid="lab-orders"]');
    await page.click('[data-testid="create-lab-order"]');
    
    await page.fill('[data-testid="patient-search"]', 'John Doe');
    await page.click('[data-testid="patient-result"]:first-child');
    
    await page.check('[data-testid="test-cbc"]');
    await page.check('[data-testid="test-glucose"]');
    
    await page.fill('[data-testid="clinical-notes"]', 'Routine screening');
    
    await page.click('[data-testid="submit-lab-order"]');
    await helpers.expectToastMessage('Lab order submitted successfully');
  });

  test('should view performance metrics', async ({ page }) => {
    await page.click('[data-testid="performance"]');
    
    await expect(page.locator('[data-testid="consultations-today"]')).toBeVisible();
    await expect(page.locator('[data-testid="average-time"]')).toBeVisible();
    await expect(page.locator('[data-testid="patient-satisfaction"]')).toBeVisible();
    
    // Test date range filter
    await page.click('[data-testid="date-range-picker"]');
    await page.click('[data-testid="last-week"]');
    await helpers.waitForLoadingToComplete();
    
    await expect(page.locator('[data-testid="performance-chart"]')).toBeVisible();
  });

  test('should manage appointments', async ({ page }) => {
    await page.click('[data-testid="appointments"]');
    
    // View today's appointments
    await expect(page.locator('[data-testid="appointment-list"]')).toBeVisible();
    
    // Reschedule appointment
    await page.click('[data-testid="reschedule-appointment"]:first-child');
    await page.click('[data-testid="date-picker"]');
    await page.click('[data-testid="next-available-slot"]');
    await page.click('[data-testid="confirm-reschedule"]');
    
    await helpers.expectToastMessage('Appointment rescheduled successfully');
  });
});