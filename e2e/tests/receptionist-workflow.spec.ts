import { test, expect } from '@playwright/test';
import { TestHelpers } from '../utils/test-helpers';
import testData from '../fixtures/test-data.json';

test.describe('Receptionist Workflow', () => {
  let helpers: TestHelpers;

  test.beforeEach(async ({ page }) => {
    helpers = new TestHelpers(page);
    await helpers.login('receptionist');
  });

  test('should register new patient', async ({ page }) => {
    await page.click('[data-testid="patient-registration"]');
    
    // Fill patient registration form
    await helpers.fillPatientForm();
    
    // Add insurance information
    await page.fill('[data-testid="insurance-provider"]', 'Blue Cross Blue Shield');
    await page.fill('[data-testid="policy-number"]', 'BC123456789');
    
    // Add emergency contact
    await page.fill('[data-testid="emergency-contact-name"]', 'Jane Doe');
    await page.fill('[data-testid="emergency-contact-phone"]', '555-0124');
    
    await page.click('[data-testid="register-patient"]');
    await helpers.expectToastMessage('Patient registered successfully');
    
    // Verify patient appears in patient list
    await page.click('[data-testid="patient-list"]');
    await expect(page.locator('[data-testid="patient-row"]').first()).toContainText('John Doe');
  });

  test('should schedule appointment', async ({ page }) => {
    await page.click('[data-testid="appointments"]');
    await page.click('[data-testid="schedule-appointment"]');
    
    // Select patient
    await page.fill('[data-testid="patient-search"]', 'John Doe');
    await page.click('[data-testid="patient-result"]:first-child');
    
    // Select doctor
    await page.click('[data-testid="doctor-select"]');
    await page.click('[data-testid="doctor-option"]:first-child');
    
    // Select date and time
    await page.click('[data-testid="date-picker"]');
    await page.click('[data-testid="next-available-date"]');
    await page.click('[data-testid="time-slot"]:first-child');
    
    // Add appointment details
    await page.fill('[data-testid="appointment-reason"]', testData.appointments.routine.type);
    await page.fill('[data-testid="appointment-notes"]', testData.appointments.routine.notes);
    
    await page.click('[data-testid="schedule-appointment-confirm"]');
    await helpers.expectToastMessage('Appointment scheduled successfully');
  });

  test('should manage appointment waitlist', async ({ page }) => {
    await page.click('[data-testid="waitlist"]');
    
    // Add patient to waitlist
    await page.click('[data-testid="add-to-waitlist"]');
    await page.fill('[data-testid="patient-search"]', 'John Doe');
    await page.click('[data-testid="patient-result"]:first-child');
    
    await page.click('[data-testid="preferred-doctor"]');
    await page.click('[data-testid="doctor-option"]:first-child');
    
    await page.fill('[data-testid="preferred-date"]', '2025-02-01');
    await page.click('[data-testid="add-to-waitlist-confirm"]');
    
    await helpers.expectToastMessage('Patient added to waitlist');
    
    // Move from waitlist to appointment when slot opens
    await page.click('[data-testid="waitlist-item"]:first-child');
    await page.click('[data-testid="convert-to-appointment"]');
    
    await page.click('[data-testid="available-slot"]:first-child');
    await page.click('[data-testid="confirm-appointment"]');
    
    await helpers.expectToastMessage('Appointment scheduled from waitlist');
  });

  test('should process patient check-in', async ({ page }) => {
    await page.click('[data-testid="check-in"]');
    
    // Search for patient with appointment
    await page.fill('[data-testid="patient-search"]', 'John Doe');
    await page.click('[data-testid="patient-result"]:first-child');
    
    // Verify appointment details
    await expect(page.locator('[data-testid="appointment-time"]')).toBeVisible();
    await expect(page.locator('[data-testid="doctor-name"]')).toBeVisible();
    
    // Update patient information if needed
    await page.click('[data-testid="update-insurance"]');
    await page.fill('[data-testid="insurance-provider"]', 'Updated Insurance');
    await page.click('[data-testid="save-insurance"]');
    
    // Complete check-in
    await page.click('[data-testid="complete-check-in"]');
    await helpers.expectToastMessage('Patient checked in successfully');
    
    // Verify patient appears in doctor queue
    await expect(page.locator('[data-testid="queue-status"]')).toContainText('In Queue');
  });

  test('should handle billing and payments', async ({ page }) => {
    await page.click('[data-testid="billing"]');
    
    // Create new bill
    await page.click('[data-testid="create-bill"]');
    await page.fill('[data-testid="patient-search"]', 'John Doe');
    await page.click('[data-testid="patient-result"]:first-child');
    
    // Add services
    await page.click('[data-testid="add-service"]');
    await page.click('[data-testid="service-consultation"]');
    await page.fill('[data-testid="service-amount"]', '150.00');
    
    await page.click('[data-testid="add-service"]');
    await page.click('[data-testid="service-lab-work"]');
    await page.fill('[data-testid="service-amount"]', '75.00');
    
    // Apply insurance
    await page.click('[data-testid="apply-insurance"]');
    await expect(page.locator('[data-testid="insurance-coverage"]')).toContainText('80%');
    
    // Generate invoice
    await page.click('[data-testid="generate-invoice"]');
    await helpers.expectToastMessage('Invoice generated successfully');
    
    // Process payment
    await page.click('[data-testid="collect-payment"]');
    await page.click('[data-testid="payment-method-card"]');
    await page.fill('[data-testid="payment-amount"]', '45.00'); // Patient portion
    
    await page.click('[data-testid="process-payment"]');
    await helpers.expectToastMessage('Payment processed successfully');
  });

  test('should reschedule appointment', async ({ page }) => {
    await page.click('[data-testid="appointments"]');
    
    // Find existing appointment
    await page.click('[data-testid="appointment-item"]:first-child');
    await page.click('[data-testid="reschedule-appointment"]');
    
    // Select new date and time
    await page.click('[data-testid="date-picker"]');
    await page.click('[data-testid="next-week"]');
    await page.click('[data-testid="available-slot"]:first-child');
    
    // Add reschedule reason
    await page.fill('[data-testid="reschedule-reason"]', 'Patient requested different time');
    
    await page.click('[data-testid="confirm-reschedule"]');
    await helpers.expectToastMessage('Appointment rescheduled successfully');
    
    // Verify notification sent to patient
    await expect(page.locator('[data-testid="notification-sent"]')).toBeVisible();
  });

  test('should cancel appointment with proper workflow', async ({ page }) => {
    await page.click('[data-testid="appointments"]');
    
    // Find appointment to cancel
    await page.click('[data-testid="appointment-item"]:first-child');
    await page.click('[data-testid="cancel-appointment"]');
    
    // Select cancellation reason
    await page.click('[data-testid="cancellation-reason"]');
    await page.click('[data-testid="reason-patient-request"]');
    
    // Add notes
    await page.fill('[data-testid="cancellation-notes"]', 'Patient needs to reschedule due to emergency');
    
    // Confirm cancellation
    await page.click('[data-testid="confirm-cancellation"]');
    await helpers.expectToastMessage('Appointment cancelled successfully');
    
    // Check if waitlist patient can be moved up
    await expect(page.locator('[data-testid="waitlist-notification"]')).toBeVisible();
  });

  test('should generate and print reports', async ({ page }) => {
    await page.click('[data-testid="reports"]');
    
    // Generate daily appointment report
    await page.click('[data-testid="daily-appointments-report"]');
    await page.click('[data-testid="date-picker"]');
    await page.click('[data-testid="today"]');
    
    await page.click('[data-testid="generate-report"]');
    await helpers.waitForLoadingToComplete();
    
    await expect(page.locator('[data-testid="report-data"]')).toBeVisible();
    
    // Print report
    await page.click('[data-testid="print-report"]');
    // Note: Actual print testing would require additional setup
    
    // Export report
    await page.click('[data-testid="export-report"]');
    await page.click('[data-testid="export-pdf"]');
    await helpers.expectToastMessage('Report exported successfully');
  });
});