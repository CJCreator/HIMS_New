import { test, expect } from '@playwright/test';
import { TestHelpers } from '../utils/test-helpers';
import testData from '../fixtures/test-data.json';

test.describe('Patient Portal Workflow', () => {
  let helpers: TestHelpers;

  test.beforeEach(async ({ page }) => {
    helpers = new TestHelpers(page);
    await helpers.login('patient');
  });

  test('should book appointment through patient portal', async ({ page }) => {
    await page.click('[data-testid="book-appointment"]');
    
    // Select appointment type
    await page.click('[data-testid="appointment-type"]');
    await page.click('[data-testid="routine-checkup"]');
    
    // Select preferred doctor
    await page.click('[data-testid="doctor-selection"]');
    await page.click('[data-testid="doctor-option"]:first-child');
    
    // Select date and time
    await page.click('[data-testid="calendar"]');
    await page.click('[data-testid="available-date"]:first-child');
    await page.click('[data-testid="time-slot"]:first-child');
    
    // Add reason for visit
    await page.fill('[data-testid="visit-reason"]', 'Annual physical examination');
    
    // Confirm appointment
    await page.click('[data-testid="confirm-appointment"]');
    await helpers.expectToastMessage('Appointment booked successfully');
    
    // Verify appointment appears in schedule
    await page.click('[data-testid="my-appointments"]');
    await expect(page.locator('[data-testid="upcoming-appointment"]')).toBeVisible();
  });

  test('should view and download medical records', async ({ page }) => {
    await page.click('[data-testid="medical-records"]');
    
    // View recent visits
    await expect(page.locator('[data-testid="visit-history"]')).toBeVisible();
    
    // View specific visit details
    await page.click('[data-testid="visit-item"]:first-child');
    await expect(page.locator('[data-testid="visit-summary"]')).toBeVisible();
    await expect(page.locator('[data-testid="diagnosis"]')).toBeVisible();
    await expect(page.locator('[data-testid="treatment-plan"]')).toBeVisible();
    
    // Download visit summary
    await page.click('[data-testid="download-summary"]');
    await helpers.expectToastMessage('Visit summary downloaded');
    
    // View lab results
    await page.click('[data-testid="lab-results"]');
    await expect(page.locator('[data-testid="lab-result-item"]')).toBeVisible();
    
    // Download lab results
    await page.click('[data-testid="download-lab-results"]');
    await helpers.expectToastMessage('Lab results downloaded');
  });

  test('should manage prescriptions', async ({ page }) => {
    await page.click('[data-testid="prescriptions"]');
    
    // View current prescriptions
    await expect(page.locator('[data-testid="active-prescriptions"]')).toBeVisible();
    
    // View prescription details
    await page.click('[data-testid="prescription-item"]:first-child');
    await expect(page.locator('[data-testid="medication-name"]')).toBeVisible();
    await expect(page.locator('[data-testid="dosage-instructions"]')).toBeVisible();
    await expect(page.locator('[data-testid="refills-remaining"]')).toBeVisible();
    
    // Request prescription refill
    await page.click('[data-testid="request-refill"]');
    await page.fill('[data-testid="pharmacy-preference"]', 'CVS Pharmacy - Main St');
    await page.click('[data-testid="submit-refill-request"]');
    
    await helpers.expectToastMessage('Refill request submitted');
    
    // View prescription history
    await page.click('[data-testid="prescription-history"]');
    await expect(page.locator('[data-testid="past-prescriptions"]')).toBeVisible();
  });

  test('should communicate with healthcare team', async ({ page }) => {
    await page.click('[data-testid="messages"]');
    
    // Send new message
    await page.click('[data-testid="compose-message"]');
    
    // Select recipient
    await page.click('[data-testid="recipient-select"]');
    await page.click('[data-testid="primary-doctor"]');
    
    // Select message type
    await page.click('[data-testid="message-type"]');
    await page.click('[data-testid="general-question"]');
    
    // Compose message
    await page.fill('[data-testid="message-subject"]', 'Question about medication side effects');
    await page.fill('[data-testid="message-body"]', 'I have been experiencing mild dizziness since starting the new medication. Is this normal?');
    
    // Send message
    await page.click('[data-testid="send-message"]');
    await helpers.expectToastMessage('Message sent successfully');
    
    // View message history
    await page.click('[data-testid="message-history"]');
    await expect(page.locator('[data-testid="sent-message"]')).toBeVisible();
    
    // Check for replies
    await page.click('[data-testid="inbox"]');
    if (await page.locator('[data-testid="unread-message"]').isVisible()) {
      await page.click('[data-testid="unread-message"]:first-child');
      await expect(page.locator('[data-testid="message-content"]')).toBeVisible();
    }
  });

  test('should update personal information', async ({ page }) => {
    await page.click('[data-testid="profile"]');
    
    // Update contact information
    await page.click('[data-testid="edit-contact-info"]');
    await page.fill('[data-testid="phone-number"]', '555-0199');
    await page.fill('[data-testid="email-address"]', 'john.doe.updated@example.com');
    
    // Update address
    await page.fill('[data-testid="street-address"]', '456 Oak Street');
    await page.fill('[data-testid="city"]', 'New City');
    await page.fill('[data-testid="zip-code"]', '54321');
    
    // Save changes
    await page.click('[data-testid="save-contact-info"]');
    await helpers.expectToastMessage('Contact information updated');
    
    // Update emergency contact
    await page.click('[data-testid="edit-emergency-contact"]');
    await page.fill('[data-testid="emergency-name"]', 'Jane Doe Smith');
    await page.fill('[data-testid="emergency-phone"]', '555-0188');
    await page.fill('[data-testid="emergency-relationship"]', 'Sister');
    
    await page.click('[data-testid="save-emergency-contact"]');
    await helpers.expectToastMessage('Emergency contact updated');
  });

  test('should view and pay bills', async ({ page }) => {
    await page.click('[data-testid="billing"]');
    
    // View outstanding bills
    await expect(page.locator('[data-testid="outstanding-bills"]')).toBeVisible();
    
    // View bill details
    await page.click('[data-testid="bill-item"]:first-child');
    await expect(page.locator('[data-testid="service-details"]')).toBeVisible();
    await expect(page.locator('[data-testid="insurance-coverage"]')).toBeVisible();
    await expect(page.locator('[data-testid="patient-responsibility"]')).toBeVisible();
    
    // Make payment
    await page.click('[data-testid="pay-bill"]');
    
    // Select payment method
    await page.click('[data-testid="payment-method"]');
    await page.click('[data-testid="credit-card"]');
    
    // Enter payment details
    await page.fill('[data-testid="card-number"]', '4111111111111111');
    await page.fill('[data-testid="expiry-date"]', '12/26');
    await page.fill('[data-testid="cvv"]', '123');
    await page.fill('[data-testid="cardholder-name"]', 'John Doe');
    
    // Confirm payment
    await page.click('[data-testid="process-payment"]');
    await helpers.expectToastMessage('Payment processed successfully');
    
    // View payment history
    await page.click('[data-testid="payment-history"]');
    await expect(page.locator('[data-testid="payment-record"]')).toBeVisible();
  });

  test('should manage appointment preferences', async ({ page }) => {
    await page.click('[data-testid="preferences"]');
    
    // Set appointment preferences
    await page.click('[data-testid="appointment-preferences"]');
    
    // Preferred times
    await page.check('[data-testid="morning-preferred"]');
    await page.uncheck('[data-testid="evening-preferred"]');
    
    // Preferred doctors
    await page.click('[data-testid="add-preferred-doctor"]');
    await page.click('[data-testid="doctor-option"]:first-child');
    
    // Notification preferences
    await page.check('[data-testid="email-reminders"]');
    await page.check('[data-testid="sms-reminders"]');
    await page.uncheck('[data-testid="phone-reminders"]');
    
    // Reminder timing
    await page.click('[data-testid="reminder-timing"]');
    await page.click('[data-testid="24-hours-before"]');
    
    // Save preferences
    await page.click('[data-testid="save-preferences"]');
    await helpers.expectToastMessage('Preferences updated successfully');
  });

  test('should access health education resources', async ({ page }) => {
    await page.click('[data-testid="health-resources"]');
    
    // Browse health topics
    await expect(page.locator('[data-testid="health-topics"]')).toBeVisible();
    
    // Search for specific topic
    await page.fill('[data-testid="resource-search"]', 'diabetes');
    await page.click('[data-testid="search-resources"]');
    
    await expect(page.locator('[data-testid="search-results"]')).toBeVisible();
    
    // View educational material
    await page.click('[data-testid="resource-item"]:first-child');
    await expect(page.locator('[data-testid="resource-content"]')).toBeVisible();
    
    // Save resource to favorites
    await page.click('[data-testid="save-to-favorites"]');
    await helpers.expectToastMessage('Resource saved to favorites');
    
    // View saved resources
    await page.click('[data-testid="my-resources"]');
    await expect(page.locator('[data-testid="saved-resource"]')).toBeVisible();
  });

  test('should reschedule appointment', async ({ page }) => {
    await page.click('[data-testid="my-appointments"]');
    
    // Select appointment to reschedule
    await page.click('[data-testid="upcoming-appointment"]:first-child');
    await page.click('[data-testid="reschedule-appointment"]');
    
    // Select new date
    await page.click('[data-testid="calendar"]');
    await page.click('[data-testid="available-date"]:nth-child(2)');
    
    // Select new time
    await page.click('[data-testid="time-slot"]:first-child');
    
    // Add reschedule reason
    await page.fill('[data-testid="reschedule-reason"]', 'Schedule conflict with work');
    
    // Confirm reschedule
    await page.click('[data-testid="confirm-reschedule"]');
    await helpers.expectToastMessage('Appointment rescheduled successfully');
    
    // Verify updated appointment
    await expect(page.locator('[data-testid="updated-appointment"]')).toBeVisible();
  });
});