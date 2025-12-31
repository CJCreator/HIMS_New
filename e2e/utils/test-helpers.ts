import { Page, expect } from '@playwright/test';
import testData from '../fixtures/test-data.json';

export class TestHelpers {
  constructor(private page: Page) {}

  async login(userType: keyof typeof testData.users) {
    const user = testData.users[userType];
    
    await this.page.goto('/login');
    await this.page.fill('[data-testid="username"]', user.username);
    await this.page.fill('[data-testid="password"]', user.password);
    await this.page.click('[data-testid="login-button"]');
    
    // Wait for navigation to dashboard
    await this.page.waitForURL(/.*dashboard/);
    await expect(this.page.locator('[data-testid="user-name"]')).toContainText(user.name);
  }

  async logout() {
    await this.page.click('[data-testid="user-menu"]');
    await this.page.click('[data-testid="logout-button"]');
    await this.page.waitForURL('/login');
  }

  async waitForLoadingToComplete() {
    await this.page.waitForSelector('[data-testid="loading-spinner"]', { state: 'hidden' });
  }

  async fillPatientForm(patient = testData.patients.testPatient) {
    await this.page.fill('[data-testid="first-name"]', patient.firstName);
    await this.page.fill('[data-testid="last-name"]', patient.lastName);
    await this.page.fill('[data-testid="date-of-birth"]', patient.dateOfBirth);
    await this.page.fill('[data-testid="phone"]', patient.phone);
    await this.page.fill('[data-testid="email"]', patient.email);
    await this.page.fill('[data-testid="address"]', patient.address);
  }

  async expectToastMessage(message: string) {
    await expect(this.page.locator('[data-testid="toast"]')).toContainText(message);
  }

  async expectPageTitle(title: string) {
    await expect(this.page.locator('h1')).toContainText(title);
  }
}