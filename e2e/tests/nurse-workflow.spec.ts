import { test, expect } from '@playwright/test';
import { TestHelpers } from '../utils/test-helpers';
import testData from '../fixtures/test-data.json';

test.describe('Nurse Workflow', () => {
  let helpers: TestHelpers;

  test.beforeEach(async ({ page }) => {
    helpers = new TestHelpers(page);
    await helpers.login('nurse');
  });

  test('should record patient vitals with validation', async ({ page }) => {
    await page.click('[data-testid="vitals-entry"]');
    
    // Select patient
    await page.fill('[data-testid="patient-search"]', 'John Doe');
    await page.click('[data-testid="patient-result"]:first-child');
    
    // Record vital signs
    await page.fill('[data-testid="blood-pressure-systolic"]', '120');
    await page.fill('[data-testid="blood-pressure-diastolic"]', '80');
    await page.fill('[data-testid="heart-rate"]', '72');
    await page.fill('[data-testid="temperature"]', '98.6');
    await page.fill('[data-testid="respiratory-rate"]', '16');
    await page.fill('[data-testid="oxygen-saturation"]', '98');
    
    // Record height and weight for BMI calculation
    await page.fill('[data-testid="height"]', '70'); // inches
    await page.fill('[data-testid="weight"]', '180'); // pounds
    
    // Verify BMI auto-calculation
    await expect(page.locator('[data-testid="calculated-bmi"]')).toContainText('25.8');
    
    // Check for abnormal values
    await page.fill('[data-testid="blood-pressure-systolic"]', '160'); // High BP
    await expect(page.locator('[data-testid="bp-warning"]')).toBeVisible();
    await expect(page.locator('[data-testid="bp-warning"]')).toContainText('Elevated');
    
    // Add vital signs notes
    await page.fill('[data-testid="vitals-notes"]', 'Patient reports feeling well. BP slightly elevated.');
    
    // Save vitals
    await page.click('[data-testid="save-vitals"]');
    await helpers.expectToastMessage('Vital signs recorded successfully');
  });

  test('should manage medication requests', async ({ page }) => {
    await page.click('[data-testid="medication-requests"]');
    
    // View pending medication requests
    await expect(page.locator('[data-testid="pending-requests"]')).toBeVisible();
    
    // Process medication request
    await page.click('[data-testid="medication-request"]:first-child');
    
    // Review request details
    await expect(page.locator('[data-testid="patient-name"]')).toBeVisible();
    await expect(page.locator('[data-testid="requested-medication"]')).toBeVisible();
    await expect(page.locator('[data-testid="prescribing-doctor"]')).toBeVisible();
    
    // Verify patient allergies
    await page.click('[data-testid="check-allergies"]');
    await expect(page.locator('[data-testid="allergy-status"]')).toBeVisible();
    
    // Administer medication
    await page.fill('[data-testid="administered-dose"]', '10mg');
    await page.fill('[data-testid="administration-route"]', 'Oral');
    await page.fill('[data-testid="administration-time"]', '14:30');
    
    // Document administration
    await page.fill('[data-testid="administration-notes"]', 'Medication administered as prescribed. Patient tolerated well.');
    
    await page.click('[data-testid="confirm-administration"]');
    await helpers.expectToastMessage('Medication administration recorded');
  });

  test('should verify and update patient allergies', async ({ page }) => {
    await page.click('[data-testid="patient-care"]');
    await page.click('[data-testid="allergy-management"]');
    
    // Select patient
    await page.fill('[data-testid="patient-search"]', 'John Doe');
    await page.click('[data-testid="patient-result"]:first-child');
    
    // Review existing allergies
    await expect(page.locator('[data-testid="current-allergies"]')).toBeVisible();
    
    // Add new allergy
    await page.click('[data-testid="add-allergy"]');
    await page.fill('[data-testid="allergen"]', 'Penicillin');
    await page.click('[data-testid="reaction-type"]');
    await page.click('[data-testid="reaction-rash"]');
    await page.click('[data-testid="severity"]');
    await page.click('[data-testid="severity-moderate"]');
    
    await page.fill('[data-testid="allergy-notes"]', 'Patient reports rash when taking penicillin-based antibiotics');
    
    await page.click('[data-testid="save-allergy"]');
    await helpers.expectToastMessage('Allergy information updated');
    
    // Verify allergy alert
    await expect(page.locator('[data-testid="allergy-alert"]')).toBeVisible();
    await expect(page.locator('[data-testid="allergy-alert"]')).toContainText('PENICILLIN ALLERGY');
  });

  test('should prepare patients for procedures', async ({ page }) => {
    await page.click('[data-testid="procedure-prep"]');
    
    // Select patient for procedure
    await page.click('[data-testid="scheduled-procedure"]:first-child');
    
    // Review procedure requirements
    await expect(page.locator('[data-testid="procedure-name"]')).toBeVisible();
    await expect(page.locator('[data-testid="prep-instructions"]')).toBeVisible();
    
    // Complete pre-procedure checklist
    await page.check('[data-testid="consent-obtained"]');
    await page.check('[data-testid="allergies-verified"]');
    await page.check('[data-testid="vitals-current"]');
    await page.check('[data-testid="fasting-confirmed"]');
    await page.check('[data-testid="medications-reviewed"]');
    
    // Document preparation
    await page.fill('[data-testid="prep-notes"]', 'Patient prepared for procedure. All requirements met. Patient understands procedure.');
    
    // Mark patient ready
    await page.click('[data-testid="mark-ready"]');
    await helpers.expectToastMessage('Patient prepared for procedure');
    
    // Notify procedure team
    await page.click('[data-testid="notify-team"]');
    await helpers.expectToastMessage('Procedure team notified');
  });

  test('should document patient assessments', async ({ page }) => {
    await page.click('[data-testid="patient-assessment"]');
    
    // Select patient
    await page.fill('[data-testid="patient-search"]', 'John Doe');
    await page.click('[data-testid="patient-result"]:first-child');
    
    // Perform nursing assessment
    await page.click('[data-testid="general-appearance"]');
    await page.click('[data-testid="appearance-alert"]');
    
    await page.click('[data-testid="pain-assessment"]');
    await page.click('[data-testid="pain-scale-3"]');
    await page.fill('[data-testid="pain-location"]', 'Lower back');
    
    await page.click('[data-testid="mobility-assessment"]');
    await page.click('[data-testid="mobility-independent"]');
    
    // Skin assessment
    await page.click('[data-testid="skin-assessment"]');
    await page.click('[data-testid="skin-intact"]');
    
    // Mental status
    await page.click('[data-testid="mental-status"]');
    await page.click('[data-testid="alert-oriented"]');
    
    // Add assessment notes
    await page.fill('[data-testid="assessment-notes"]', 'Patient alert and cooperative. Mild back pain reported. Skin intact without lesions.');
    
    await page.click('[data-testid="save-assessment"]');
    await helpers.expectToastMessage('Nursing assessment completed');
  });

  test('should manage patient education', async ({ page }) => {
    await page.click('[data-testid="patient-education"]');
    
    // Select patient
    await page.fill('[data-testid="patient-search"]', 'John Doe');
    await page.click('[data-testid="patient-result"]:first-child');
    
    // Select education topics
    await page.check('[data-testid="medication-education"]');
    await page.check('[data-testid="diet-education"]');
    await page.check('[data-testid="exercise-education"]');
    
    // Provide education
    await page.click('[data-testid="start-education"]');
    
    // Document education provided
    await page.fill('[data-testid="education-notes"]', 'Discussed medication compliance, dietary restrictions, and exercise recommendations. Patient verbalized understanding.');
    
    // Patient acknowledgment
    await page.click('[data-testid="patient-understood"]');
    
    // Provide educational materials
    await page.click('[data-testid="print-materials"]');
    await page.check('[data-testid="diabetes-brochure"]');
    await page.check('[data-testid="medication-guide"]');
    
    await page.click('[data-testid="complete-education"]');
    await helpers.expectToastMessage('Patient education completed');
  });

  test('should handle emergency situations', async ({ page }) => {
    await page.click('[data-testid="emergency-response"]');
    
    // Activate emergency alert
    await page.click('[data-testid="emergency-alert"]');
    await page.click('[data-testid="code-blue"]');
    
    // Document emergency response
    await page.fill('[data-testid="emergency-time"]', '15:45');
    await page.fill('[data-testid="emergency-location"]', 'Room 205');
    await page.fill('[data-testid="emergency-description"]', 'Patient found unresponsive');
    
    // Record interventions
    await page.check('[data-testid="cpr-initiated"]');
    await page.check('[data-testid="oxygen-administered"]');
    await page.check('[data-testid="iv-access"]');
    
    // Document response team
    await page.fill('[data-testid="responding-physician"]', 'Dr. Smith');
    await page.fill('[data-testid="responding-nurses"]', 'Nurse Jane, Nurse Bob');
    
    // Record outcome
    await page.click('[data-testid="patient-stabilized"]');
    await page.fill('[data-testid="outcome-notes"]', 'Patient responded to interventions. Vital signs stable. Transferred to ICU.');
    
    await page.click('[data-testid="complete-emergency-report"]');
    await helpers.expectToastMessage('Emergency response documented');
  });

  test('should coordinate patient discharge', async ({ page }) => {
    await page.click('[data-testid="discharge-planning"]');
    
    // Select patient for discharge
    await page.click('[data-testid="discharge-patient"]:first-child');
    
    // Complete discharge checklist
    await page.check('[data-testid="physician-orders-complete"]');
    await page.check('[data-testid="medications-reconciled"]');
    await page.check('[data-testid="education-provided"]');
    await page.check('[data-testid="follow-up-scheduled"]');
    
    // Provide discharge instructions
    await page.fill('[data-testid="discharge-instructions"]', 'Continue medications as prescribed. Follow up with primary care in 1 week. Return if symptoms worsen.');
    
    // Verify patient understanding
    await page.click('[data-testid="patient-understands-discharge"]');
    
    // Arrange transportation
    await page.click('[data-testid="transportation-method"]');
    await page.click('[data-testid="family-transport"]');
    
    // Complete discharge
    await page.click('[data-testid="complete-discharge"]');
    await helpers.expectToastMessage('Patient discharge completed');
    
    // Print discharge summary
    await page.click('[data-testid="print-discharge-summary"]');
    await expect(page.locator('[data-testid="discharge-summary-preview"]')).toBeVisible();
  });
});