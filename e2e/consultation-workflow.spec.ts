import { test, expect } from '@playwright/test';

test.describe('Doctor Consultation Workflow', () => {
  test.beforeEach(async ({ page }) => {
    // Login as doctor
    await page.goto('/auth/signin');
    await page.fill('[data-testid="email"]', 'doctor@hospital.com');
    await page.fill('[data-testid="password"]', 'password123');
    await page.click('[data-testid="signin-button"]');
    
    // Wait for dashboard to load
    await expect(page.locator('[data-testid="doctor-dashboard"]')).toBeVisible();
  });

  test('completes full 14-step consultation workflow', async ({ page }) => {
    // Navigate to patient queue
    await page.click('[data-testid="patient-queue-nav"]');
    await expect(page.locator('[data-testid="queue-list"]')).toBeVisible();
    
    // Select first patient in queue
    await page.click('[data-testid="patient-item"]:first-child');
    await page.click('[data-testid="start-consultation"]');
    
    // Step 1: Patient Selection (already done)
    await expect(page.locator('[data-testid="consultation-step-1"]')).toBeVisible();
    await page.click('[data-testid="next-step"]');
    
    // Step 2: Medical History Review
    await expect(page.locator('[data-testid="medical-history"]')).toBeVisible();
    await expect(page.locator('[data-testid="previous-diagnoses"]')).toBeVisible();
    await page.click('[data-testid="next-step"]');
    
    // Step 3: Vital Signs Review
    await expect(page.locator('[data-testid="vital-signs-display"]')).toBeVisible();
    await expect(page.locator('[data-testid="blood-pressure"]')).toContainText('120/80');
    await page.click('[data-testid="next-step"]');
    
    // Step 4: Chief Complaint (optional - skip)
    await page.click('[data-testid="skip-step"]');
    
    // Step 5: Symptoms Recording (optional - add some)
    await page.fill('[data-testid="symptom-description"]', 'Headache and fatigue');
    await page.selectOption('[data-testid="symptom-severity"]', 'moderate');
    await page.fill('[data-testid="symptom-duration"]', '3 days');
    await page.click('[data-testid="add-symptom"]');
    await page.click('[data-testid="next-step"]');
    
    // Step 6: Physical Examination (optional - skip)
    await page.click('[data-testid="skip-step"]');
    
    // Step 7: Diagnosis Entry (required)
    await page.fill('[data-testid="diagnosis-search"]', 'Hypertension');
    await page.click('[data-testid="diagnosis-I10"]');
    await page.check('[data-testid="primary-diagnosis"]');
    await page.fill('[data-testid="diagnosis-notes"]', 'Essential hypertension, well controlled');
    await page.click('[data-testid="next-step"]');
    
    // Step 8: Treatment Plan (optional - add)
    await page.fill('[data-testid="treatment-plan"]', 'Continue current medication, lifestyle modifications');
    await page.click('[data-testid="next-step"]');
    
    // Step 9: Prescription Creation (required if medications needed)
    await page.fill('[data-testid="medication-search"]', 'Lisinopril');
    await page.click('[data-testid="medication-lisinopril"]');
    await page.selectOption('[data-testid="dosage"]', '10mg');
    await page.selectOption('[data-testid="frequency"]', 'once-daily');
    await page.fill('[data-testid="duration"]', '30');
    await page.selectOption('[data-testid="duration-unit"]', 'days');
    await page.fill('[data-testid="instructions"]', 'Take with food in the morning');
    
    // Check for drug interactions
    await expect(page.locator('[data-testid="interaction-check"]')).toContainText('No interactions found');
    
    await page.click('[data-testid="add-medication"]');
    await page.click('[data-testid="next-step"]');
    
    // Step 10: Lab Test Orders (optional - skip)
    await page.click('[data-testid="skip-step"]');
    
    // Step 11: Follow-up Scheduling (optional - add)
    await page.click('[data-testid="schedule-followup"]');
    await page.selectOption('[data-testid="followup-duration"]', '4-weeks');
    await page.click('[data-testid="next-step"]');
    
    // Step 12: Consultation Notes (optional - add)
    await page.fill('[data-testid="consultation-notes"]', 'Patient responding well to treatment. Continue current regimen.');
    await page.click('[data-testid="next-step"]');
    
    // Step 13: Review & Confirm (required)
    await expect(page.locator('[data-testid="consultation-summary"]')).toBeVisible();
    await expect(page.locator('[data-testid="diagnosis-summary"]')).toContainText('Hypertension');
    await expect(page.locator('[data-testid="prescription-summary"]')).toContainText('Lisinopril 10mg');
    await page.click('[data-testid="confirm-consultation"]');
    
    // Step 14: Summary & Print (required)
    await expect(page.locator('[data-testid="consultation-complete"]')).toBeVisible();
    await page.click('[data-testid="print-summary"]');
    
    // Verify prescription sent to pharmacy
    await expect(page.locator('[data-testid="pharmacy-notification"]')).toContainText('Prescription sent to pharmacy');
    
    // Mark consultation complete
    await page.click('[data-testid="complete-consultation"]');
    
    // Verify return to queue
    await expect(page.locator('[data-testid="queue-list"]')).toBeVisible();
  });

  test('handles drug interaction alerts during prescription', async ({ page }) => {
    // Start consultation and navigate to prescription step
    await page.click('[data-testid="patient-queue-nav"]');
    await page.click('[data-testid="patient-item"]:first-child');
    await page.click('[data-testid="start-consultation"]');
    
    // Skip to prescription step
    for (let i = 0; i < 8; i++) {
      await page.click('[data-testid="next-step"], [data-testid="skip-step"]');
    }
    
    // Add first medication (Warfarin)
    await page.fill('[data-testid="medication-search"]', 'Warfarin');
    await page.click('[data-testid="medication-warfarin"]');
    await page.selectOption('[data-testid="dosage"]', '5mg');
    await page.click('[data-testid="add-medication"]');
    
    // Add conflicting medication (Aspirin)
    await page.fill('[data-testid="medication-search"]', 'Aspirin');
    await page.click('[data-testid="medication-aspirin"]');
    await page.selectOption('[data-testid="dosage"]', '81mg');
    
    // Verify interaction alert appears
    await expect(page.locator('[data-testid="interaction-alert"]')).toBeVisible();
    await expect(page.locator('[data-testid="interaction-severity"]')).toContainText('High Risk');
    await expect(page.locator('[data-testid="interaction-description"]')).toContainText('bleeding risk');
    
    // Verify cannot proceed without acknowledging
    await expect(page.locator('[data-testid="add-medication"]')).toBeDisabled();
    
    // Acknowledge interaction
    await page.check('[data-testid="acknowledge-interaction"]');
    await page.fill('[data-testid="interaction-notes"]', 'Patient counseled on bleeding risk. Will monitor INR closely.');
    
    // Now can add medication
    await expect(page.locator('[data-testid="add-medication"]')).toBeEnabled();
    await page.click('[data-testid="add-medication"]');
  });

  test('validates required fields in consultation steps', async ({ page }) => {
    await page.click('[data-testid="patient-queue-nav"]');
    await page.click('[data-testid="patient-item"]:first-child');
    await page.click('[data-testid="start-consultation"]');
    
    // Skip to diagnosis step (required)
    for (let i = 0; i < 6; i++) {
      await page.click('[data-testid="next-step"], [data-testid="skip-step"]');
    }
    
    // Try to proceed without diagnosis
    await page.click('[data-testid="next-step"]');
    
    // Verify validation error
    await expect(page.locator('[data-testid="diagnosis-error"]')).toContainText('At least one diagnosis is required');
    await expect(page.locator('[data-testid="diagnosis-search"]')).toHaveClass(/border-red/);
    
    // Add diagnosis and proceed
    await page.fill('[data-testid="diagnosis-search"]', 'Hypertension');
    await page.click('[data-testid="diagnosis-I10"]');
    await page.click('[data-testid="next-step"]');
    
    // Should now proceed to next step
    await expect(page.locator('[data-testid="consultation-step-8"]')).toBeVisible();
  });
});

test.describe('Emergency Scenarios', () => {
  test('handles critical lab values alert', async ({ page }) => {
    // Login as doctor
    await page.goto('/auth/signin');
    await page.fill('[data-testid="email"]', 'doctor@hospital.com');
    await page.fill('[data-testid="password"]', 'password123');
    await page.click('[data-testid="signin-button"]');
    
    // Simulate critical lab result notification
    await page.evaluate(() => {
      window.dispatchEvent(new CustomEvent('critical-lab-result', {
        detail: {
          patientId: 'patient-1',
          patientName: 'John Doe',
          testName: 'Troponin I',
          value: '15.2',
          normalRange: '0.0-0.04',
          severity: 'critical'
        }
      }));
    });
    
    // Verify critical alert appears
    await expect(page.locator('[data-testid="critical-alert"]')).toBeVisible();
    await expect(page.locator('[data-testid="alert-title"]')).toContainText('CRITICAL LAB VALUE');
    await expect(page.locator('[data-testid="patient-name"]')).toContainText('John Doe');
    await expect(page.locator('[data-testid="test-value"]')).toContainText('15.2');
    
    // Verify alert actions
    await expect(page.locator('[data-testid="view-patient"]')).toBeVisible();
    await expect(page.locator('[data-testid="acknowledge-alert"]')).toBeVisible();
    
    // Click to view patient
    await page.click('[data-testid="view-patient"]');
    
    // Should navigate to patient details
    await expect(page.locator('[data-testid="patient-details"]')).toBeVisible();
    await expect(page.locator('[data-testid="lab-results-section"]')).toBeVisible();
  });
});

test.describe('Performance and Accessibility', () => {
  test('consultation workflow loads within performance budget', async ({ page }) => {
    // Start performance monitoring
    await page.goto('/auth/signin');
    await page.fill('[data-testid="email"]', 'doctor@hospital.com');
    await page.fill('[data-testid="password"]', 'password123');
    
    const startTime = Date.now();
    await page.click('[data-testid="signin-button"]');
    
    // Wait for dashboard to fully load
    await expect(page.locator('[data-testid="doctor-dashboard"]')).toBeVisible();
    const loadTime = Date.now() - startTime;
    
    // Verify load time is under 3 seconds
    expect(loadTime).toBeLessThan(3000);
    
    // Navigate to consultation
    const consultationStartTime = Date.now();
    await page.click('[data-testid="patient-queue-nav"]');
    await page.click('[data-testid="patient-item"]:first-child');
    await page.click('[data-testid="start-consultation"]');
    
    await expect(page.locator('[data-testid="consultation-step-1"]')).toBeVisible();
    const consultationLoadTime = Date.now() - consultationStartTime;
    
    // Verify consultation loads quickly
    expect(consultationLoadTime).toBeLessThan(2000);
  });

  test('consultation form is keyboard accessible', async ({ page }) => {
    await page.goto('/auth/signin');
    await page.fill('[data-testid="email"]', 'doctor@hospital.com');
    await page.fill('[data-testid="password"]', 'password123');
    await page.click('[data-testid="signin-button"]');
    
    await page.click('[data-testid="patient-queue-nav"]');
    await page.click('[data-testid="patient-item"]:first-child');
    await page.click('[data-testid="start-consultation"]');
    
    // Skip to diagnosis step
    for (let i = 0; i < 6; i++) {
      await page.keyboard.press('Tab');
      await page.keyboard.press('Enter'); // Skip steps
    }
    
    // Test keyboard navigation in diagnosis form
    await page.keyboard.press('Tab'); // Focus on diagnosis search
    await page.keyboard.type('Hypertension');
    await page.keyboard.press('ArrowDown'); // Navigate suggestions
    await page.keyboard.press('Enter'); // Select diagnosis
    
    await page.keyboard.press('Tab'); // Move to primary diagnosis checkbox
    await page.keyboard.press('Space'); // Check checkbox
    
    await page.keyboard.press('Tab'); // Move to notes field
    await page.keyboard.type('Essential hypertension');
    
    await page.keyboard.press('Tab'); // Move to next button
    await page.keyboard.press('Enter'); // Proceed to next step
    
    // Verify we moved to next step
    await expect(page.locator('[data-testid="consultation-step-8"]')).toBeVisible();
  });
});