import { test, expect } from '@playwright/test';
import { TestHelpers } from '../utils/test-helpers';
import testData from '../fixtures/test-data.json';

test.describe('Pharmacy Workflow', () => {
  let helpers: TestHelpers;

  test.beforeEach(async ({ page }) => {
    helpers = new TestHelpers(page);
    await helpers.login('pharmacist');
  });

  test('should process prescription queue', async ({ page }) => {
    await page.click('[data-testid="prescription-queue"]');
    
    // View pending prescriptions
    await expect(page.locator('[data-testid="pending-prescriptions"]')).toBeVisible();
    
    // Select first prescription
    await page.click('[data-testid="prescription-item"]:first-child');
    
    // Review prescription details
    await expect(page.locator('[data-testid="patient-name"]')).toBeVisible();
    await expect(page.locator('[data-testid="prescribing-doctor"]')).toBeVisible();
    await expect(page.locator('[data-testid="medication-list"]')).toBeVisible();
    
    // Start processing
    await page.click('[data-testid="start-processing"]');
    await helpers.expectToastMessage('Prescription processing started');
  });

  test('should verify prescription and check drug interactions', async ({ page }) => {
    await page.click('[data-testid="prescription-queue"]');
    await page.click('[data-testid="prescription-item"]:first-child');
    
    // Review medication details
    await expect(page.locator('[data-testid="medication-name"]')).toContainText('Lisinopril');
    await expect(page.locator('[data-testid="dosage"]')).toContainText('10mg');
    await expect(page.locator('[data-testid="quantity"]')).toContainText('30');
    
    // Check drug interactions
    await page.click('[data-testid="check-interactions"]');
    await helpers.waitForLoadingToComplete();
    
    // Handle interaction alert if present
    const interactionAlert = page.locator('[data-testid="interaction-alert"]');
    if (await interactionAlert.isVisible()) {
      await expect(interactionAlert).toContainText('Drug Interaction Detected');
      
      // Contact prescriber
      await page.click('[data-testid="contact-prescriber"]');
      await page.fill('[data-testid="interaction-notes"]', 'Potential interaction with current medications');
      await page.click('[data-testid="send-notification"]');
    }
    
    // Verify prescription
    await page.click('[data-testid="verify-prescription"]');
    await helpers.expectToastMessage('Prescription verified');
  });

  test('should dispense medication with proper documentation', async ({ page }) => {
    await page.click('[data-testid="prescription-queue"]');
    await page.click('[data-testid="verified-prescription"]:first-child');
    
    // Check inventory availability
    await page.click('[data-testid="check-inventory"]');
    await expect(page.locator('[data-testid="stock-level"]')).toBeVisible();
    
    // Select medication from inventory
    await page.click('[data-testid="select-medication"]');
    await page.click('[data-testid="medication-batch"]:first-child');
    
    // Verify batch information
    await expect(page.locator('[data-testid="batch-number"]')).toBeVisible();
    await expect(page.locator('[data-testid="expiry-date"]')).toBeVisible();
    
    // Count and dispense
    await page.fill('[data-testid="dispensed-quantity"]', '30');
    await page.click('[data-testid="dispense-medication"]');
    
    // Print medication label
    await page.click('[data-testid="print-label"]');
    await expect(page.locator('[data-testid="label-preview"]')).toBeVisible();
    
    // Complete dispensing
    await page.click('[data-testid="complete-dispensing"]');
    await helpers.expectToastMessage('Medication dispensed successfully');
  });

  test('should provide patient counseling', async ({ page }) => {
    await page.click('[data-testid="patient-counseling"]');
    
    // Select patient for counseling
    await page.click('[data-testid="counseling-patient"]:first-child');
    
    // Review medication information
    await expect(page.locator('[data-testid="medication-info"]')).toBeVisible();
    
    // Document counseling points
    await page.check('[data-testid="dosage-instructions"]');
    await page.check('[data-testid="side-effects"]');
    await page.check('[data-testid="drug-interactions"]');
    await page.check('[data-testid="storage-instructions"]');
    
    // Add custom counseling notes
    await page.fill('[data-testid="counseling-notes"]', 'Patient understands to take with food. Advised about potential dizziness.');
    
    // Patient acknowledgment
    await page.click('[data-testid="patient-acknowledged"]');
    
    // Complete counseling
    await page.click('[data-testid="complete-counseling"]');
    await helpers.expectToastMessage('Patient counseling completed');
  });

  test('should manage inventory and restock alerts', async ({ page }) => {
    await page.click('[data-testid="inventory-management"]');
    
    // View current inventory
    await expect(page.locator('[data-testid="medication-inventory"]')).toBeVisible();
    
    // Check low stock items
    await page.click('[data-testid="low-stock-items"]');
    await expect(page.locator('[data-testid="low-stock-alert"]')).toBeVisible();
    
    // Add new stock
    await page.click('[data-testid="add-stock"]');
    await page.fill('[data-testid="medication-search"]', 'Lisinopril');
    await page.click('[data-testid="medication-result"]:first-child');
    
    await page.fill('[data-testid="quantity-received"]', '100');
    await page.fill('[data-testid="batch-number"]', 'BATCH-2025-001');
    await page.fill('[data-testid="expiry-date"]', '2026-12-31');
    await page.fill('[data-testid="supplier"]', 'MedSupply Inc');
    
    await page.click('[data-testid="add-to-inventory"]');
    await helpers.expectToastMessage('Inventory updated successfully');
    
    // Set reorder point
    await page.fill('[data-testid="reorder-point"]', '20');
    await page.click('[data-testid="save-reorder-point"]');
  });

  test('should handle medication returns and recalls', async ({ page }) => {
    await page.click('[data-testid="returns-recalls"]');
    
    // Process medication return
    await page.click('[data-testid="process-return"]');
    await page.fill('[data-testid="patient-search"]', 'John Doe');
    await page.click('[data-testid="patient-result"]:first-child');
    
    // Select medication to return
    await page.click('[data-testid="dispensed-medication"]:first-child');
    
    // Enter return reason
    await page.click('[data-testid="return-reason"]');
    await page.click('[data-testid="reason-adverse-reaction"]');
    
    await page.fill('[data-testid="return-notes"]', 'Patient experienced side effects');
    await page.fill('[data-testid="returned-quantity"]', '25');
    
    // Process refund
    await page.click('[data-testid="process-refund"]');
    await page.fill('[data-testid="refund-amount"]', '75.00');
    
    await page.click('[data-testid="complete-return"]');
    await helpers.expectToastMessage('Medication return processed');
    
    // Handle recall notification
    await page.click('[data-testid="recall-notifications"]');
    if (await page.locator('[data-testid="active-recall"]').isVisible()) {
      await page.click('[data-testid="active-recall"]:first-child');
      await page.click('[data-testid="identify-affected-patients"]');
      await page.click('[data-testid="notify-patients"]');
      await helpers.expectToastMessage('Recall notifications sent');
    }
  });

  test('should generate pharmacy reports', async ({ page }) => {
    await page.click('[data-testid="pharmacy-reports"]');
    
    // Generate dispensing report
    await page.click('[data-testid="dispensing-report"]');
    await page.click('[data-testid="date-range-picker"]');
    await page.click('[data-testid="this-week"]');
    
    await page.click('[data-testid="generate-report"]');
    await helpers.waitForLoadingToComplete();
    
    // Verify report data
    await expect(page.locator('[data-testid="prescriptions-filled"]')).toBeVisible();
    await expect(page.locator('[data-testid="revenue-generated"]')).toBeVisible();
    await expect(page.locator('[data-testid="top-medications"]')).toBeVisible();
    
    // Generate controlled substance report
    await page.click('[data-testid="controlled-substance-report"]');
    await page.click('[data-testid="generate-cs-report"]');
    
    await expect(page.locator('[data-testid="cs-dispensed"]')).toBeVisible();
    await expect(page.locator('[data-testid="cs-inventory"]')).toBeVisible();
    
    // Export reports
    await page.click('[data-testid="export-report"]');
    await page.click('[data-testid="export-pdf"]');
    await helpers.expectToastMessage('Report exported successfully');
  });

  test('should handle insurance verification and billing', async ({ page }) => {
    await page.click('[data-testid="prescription-queue"]');
    await page.click('[data-testid="prescription-item"]:first-child');
    
    // Verify insurance coverage
    await page.click('[data-testid="verify-insurance"]');
    await helpers.waitForLoadingToComplete();
    
    await expect(page.locator('[data-testid="insurance-status"]')).toContainText('Active');
    await expect(page.locator('[data-testid="copay-amount"]')).toBeVisible();
    
    // Handle prior authorization if needed
    const priorAuthAlert = page.locator('[data-testid="prior-auth-required"]');
    if (await priorAuthAlert.isVisible()) {
      await page.click('[data-testid="request-prior-auth"]');
      await page.fill('[data-testid="clinical-justification"]', 'Patient has tried alternative medications without success');
      await page.click('[data-testid="submit-prior-auth"]');
      await helpers.expectToastMessage('Prior authorization request submitted');
    }
    
    // Process insurance claim
    await page.click('[data-testid="submit-claim"]');
    await helpers.waitForLoadingToComplete();
    
    await expect(page.locator('[data-testid="claim-status"]')).toContainText('Approved');
    
    // Collect patient copay
    await page.click('[data-testid="collect-copay"]');
    await page.fill('[data-testid="copay-amount"]', '15.00');
    await page.click('[data-testid="process-payment"]');
    
    await helpers.expectToastMessage('Payment processed successfully');
  });

  test('should manage controlled substances', async ({ page }) => {
    await page.click('[data-testid="controlled-substances"]');
    
    // View controlled substance inventory
    await expect(page.locator('[data-testid="cs-inventory"]')).toBeVisible();
    
    // Dispense controlled substance
    await page.click('[data-testid="cs-prescription"]:first-child');
    
    // Verify DEA number
    await expect(page.locator('[data-testid="prescriber-dea"]')).toBeVisible();
    
    // Record dispensing
    await page.fill('[data-testid="cs-quantity-dispensed"]', '30');
    await page.fill('[data-testid="pharmacist-initials"]', 'JP');
    
    // Update perpetual inventory
    await page.click('[data-testid="update-perpetual-inventory"]');
    
    // Complete controlled substance log
    await page.click('[data-testid="complete-cs-dispensing"]');
    await helpers.expectToastMessage('Controlled substance dispensed and logged');
    
    // Verify audit trail
    await expect(page.locator('[data-testid="cs-audit-trail"]')).toBeVisible();
  });
});