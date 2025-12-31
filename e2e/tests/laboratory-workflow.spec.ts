import { test, expect } from '@playwright/test';
import { TestHelpers } from '../utils/test-helpers';
import testData from '../fixtures/test-data.json';

test.describe('Laboratory Workflow', () => {
  let helpers: TestHelpers;

  test.beforeEach(async ({ page }) => {
    helpers = new TestHelpers(page);
    await helpers.login('lab');
  });

  test('should process lab order queue', async ({ page }) => {
    await page.click('[data-testid="lab-orders"]');
    
    // View pending orders
    await expect(page.locator('[data-testid="pending-orders"]')).toBeVisible();
    
    // Select first order
    await page.click('[data-testid="lab-order-item"]:first-child');
    
    // View order details
    await expect(page.locator('[data-testid="patient-name"]')).toBeVisible();
    await expect(page.locator('[data-testid="ordered-tests"]')).toBeVisible();
    await expect(page.locator('[data-testid="ordering-doctor"]')).toBeVisible();
    
    // Start processing
    await page.click('[data-testid="start-processing"]');
    await helpers.expectToastMessage('Lab order processing started');
  });

  test('should collect samples with proper tracking', async ({ page }) => {
    await page.click('[data-testid="sample-collection"]');
    
    // Select order for sample collection
    await page.click('[data-testid="collect-sample-order"]:first-child');
    
    // Record sample collection
    await page.fill('[data-testid="sample-id"]', 'LAB-2025-001');
    await page.fill('[data-testid="collection-time"]', '2025-01-20T10:30');
    
    // Select sample type
    await page.check('[data-testid="sample-blood"]');
    await page.check('[data-testid="sample-urine"]');
    
    // Add collection notes
    await page.fill('[data-testid="collection-notes"]', 'Samples collected successfully, patient fasted');
    
    // Confirm collection
    await page.click('[data-testid="confirm-collection"]');
    await helpers.expectToastMessage('Sample collection recorded');
    
    // Print sample labels
    await page.click('[data-testid="print-labels"]');
    await expect(page.locator('[data-testid="label-preview"]')).toBeVisible();
  });

  test('should enter test results with validation', async ({ page }) => {
    await page.click('[data-testid="result-entry"]');
    
    // Select completed test
    await page.click('[data-testid="completed-test"]:first-child');
    
    // Enter CBC results
    await page.fill('[data-testid="wbc-count"]', '7.5');
    await page.fill('[data-testid="rbc-count"]', '4.8');
    await page.fill('[data-testid="hemoglobin"]', '14.2');
    await page.fill('[data-testid="hematocrit"]', '42.5');
    
    // Check for critical values
    await page.fill('[data-testid="glucose"]', '250'); // High value
    await expect(page.locator('[data-testid="critical-alert"]')).toBeVisible();
    await expect(page.locator('[data-testid="critical-alert"]')).toContainText('Critical Value');
    
    // Add result notes
    await page.fill('[data-testid="result-notes"]', 'Glucose level elevated, recommend immediate physician review');
    
    // Mark as critical
    await page.check('[data-testid="mark-critical"]');
    
    // Save results
    await page.click('[data-testid="save-results"]');
    await helpers.expectToastMessage('Results saved successfully');
    
    // Verify critical alert notification
    await expect(page.locator('[data-testid="critical-notification"]')).toBeVisible();
  });

  test('should verify and approve results', async ({ page }) => {
    await page.click('[data-testid="result-verification"]');
    
    // Select results for verification
    await page.click('[data-testid="pending-verification"]:first-child');
    
    // Review all test results
    await expect(page.locator('[data-testid="test-results-summary"]')).toBeVisible();
    
    // Check quality control
    await page.click('[data-testid="quality-control"]');
    await expect(page.locator('[data-testid="qc-passed"]')).toBeVisible();
    
    // Add verification notes
    await page.fill('[data-testid="verification-notes"]', 'Results reviewed and verified. All values within expected ranges except glucose.');
    
    // Approve results
    await page.click('[data-testid="approve-results"]');
    await helpers.expectToastMessage('Results approved and released');
    
    // Verify notification sent to doctor
    await expect(page.locator('[data-testid="doctor-notification-sent"]')).toBeVisible();
  });

  test('should handle urgent/STAT orders', async ({ page }) => {
    await page.click('[data-testid="urgent-orders"]');
    
    // View STAT orders
    await expect(page.locator('[data-testid="stat-order-badge"]')).toBeVisible();
    
    // Process urgent order
    await page.click('[data-testid="stat-order"]:first-child');
    
    // Fast-track processing
    await page.click('[data-testid="fast-track"]');
    await helpers.expectToastMessage('Order fast-tracked for processing');
    
    // Immediate sample collection
    await page.click('[data-testid="immediate-collection"]');
    await page.fill('[data-testid="stat-sample-id"]', 'STAT-2025-001');
    
    // Rush processing
    await page.click('[data-testid="rush-processing"]');
    
    // Enter results immediately
    await page.fill('[data-testid="critical-test-result"]', '2.5');
    await page.click('[data-testid="immediate-verify"]');
    
    // Send urgent notification
    await page.click('[data-testid="send-urgent-notification"]');
    await helpers.expectToastMessage('Urgent results sent to physician');
  });

  test('should manage lab inventory', async ({ page }) => {
    await page.click('[data-testid="inventory"]');
    
    // Check reagent levels
    await expect(page.locator('[data-testid="reagent-list"]')).toBeVisible();
    
    // Update inventory
    await page.click('[data-testid="update-inventory"]');
    await page.fill('[data-testid="reagent-count"]', '25');
    await page.fill('[data-testid="expiry-date"]', '2025-12-31');
    
    // Set low stock alert
    await page.fill('[data-testid="low-stock-threshold"]', '5');
    
    await page.click('[data-testid="save-inventory"]');
    await helpers.expectToastMessage('Inventory updated successfully');
    
    // Check for expiring items
    await page.click('[data-testid="expiring-items"]');
    await expect(page.locator('[data-testid="expiry-alert"]')).toBeVisible();
  });

  test('should generate lab reports', async ({ page }) => {
    await page.click('[data-testid="lab-reports"]');
    
    // Generate daily productivity report
    await page.click('[data-testid="productivity-report"]');
    await page.click('[data-testid="date-range-picker"]');
    await page.click('[data-testid="today"]');
    
    await page.click('[data-testid="generate-report"]');
    await helpers.waitForLoadingToComplete();
    
    // Verify report data
    await expect(page.locator('[data-testid="tests-completed"]')).toBeVisible();
    await expect(page.locator('[data-testid="turnaround-time"]')).toBeVisible();
    await expect(page.locator('[data-testid="critical-values"]')).toBeVisible();
    
    // Export report
    await page.click('[data-testid="export-report"]');
    await page.click('[data-testid="export-excel"]');
    await helpers.expectToastMessage('Report exported successfully');
  });

  test('should handle quality control procedures', async ({ page }) => {
    await page.click('[data-testid="quality-control"]');
    
    // Run daily QC
    await page.click('[data-testid="run-qc"]');
    
    // Enter control values
    await page.fill('[data-testid="control-level-1"]', '95.2');
    await page.fill('[data-testid="control-level-2"]', '185.7');
    
    // Check if values are within range
    await page.click('[data-testid="validate-qc"]');
    await expect(page.locator('[data-testid="qc-status"]')).toContainText('Passed');
    
    // Document QC results
    await page.fill('[data-testid="qc-notes"]', 'All control values within acceptable range');
    
    await page.click('[data-testid="save-qc"]');
    await helpers.expectToastMessage('Quality control documented');
  });

  test('should track specimen chain of custody', async ({ page }) => {
    await page.click('[data-testid="chain-of-custody"]');
    
    // Select specimen
    await page.click('[data-testid="specimen-item"]:first-child');
    
    // View custody history
    await expect(page.locator('[data-testid="custody-log"]')).toBeVisible();
    
    // Add custody transfer
    await page.click('[data-testid="transfer-custody"]');
    await page.fill('[data-testid="transferred-to"]', 'Lab Technician 2');
    await page.fill('[data-testid="transfer-reason"]', 'Specialized testing');
    
    await page.click('[data-testid="confirm-transfer"]');
    await helpers.expectToastMessage('Custody transferred successfully');
    
    // Verify audit trail
    await expect(page.locator('[data-testid="audit-trail"]')).toContainText('Transferred to Lab Technician 2');
  });
});