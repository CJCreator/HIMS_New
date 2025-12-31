import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { AccessibilityHelper } from '../utils/accessibility.helper';
import fs from 'fs';
import path from 'path';

interface AccessibilityReport {
  url: string;
  timestamp: string;
  violations: any[];
  passes: any[];
  incomplete: any[];
  wcagLevel: string;
  score: number;
}

test.describe('WCAG 2.1 AA Compliance Audit', () => {
  let accessibilityHelper: AccessibilityHelper;
  const reports: AccessibilityReport[] = [];

  test.beforeEach(async ({ page }) => {
    accessibilityHelper = new AccessibilityHelper(page);
    await page.goto('/');
  });

  test.afterAll(async () => {
    // Generate accessibility report
    const reportPath = path.join(process.cwd(), 'accessibility-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(reports, null, 2));
    console.log(`Accessibility report generated: ${reportPath}`);
  });

  const auditPage = async (page: any, url: string, description: string) => {
    await page.goto(url);
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();

    const score = Math.max(0, 100 - (results.violations.length * 10));
    
    reports.push({
      url,
      timestamp: new Date().toISOString(),
      violations: results.violations,
      passes: results.passes,
      incomplete: results.incomplete,
      wcagLevel: 'AA',
      score
    });

    console.log(`${description}: ${results.violations.length} violations, Score: ${score}/100`);
    return results;
  };

  test('Authentication pages accessibility', async ({ page }) => {
    const results = await auditPage(page, '/', 'Login Page');
    expect(results.violations).toEqual([]);
  });

  test('Doctor workflow accessibility', async ({ page }) => {
    await page.fill('[data-testid="email"]', 'doctor@hims.com');
    await page.fill('[data-testid="password"]', 'password123');
    await page.click('[data-testid="login-button"]');
    
    const dashboardResults = await auditPage(page, '/doctor/dashboard', 'Doctor Dashboard');
    const queueResults = await auditPage(page, '/doctor/queue', 'Doctor Queue');
    const consultationResults = await auditPage(page, '/doctor/consultation', 'Doctor Consultation');
    
    expect(dashboardResults.violations.length).toBeLessThan(3);
    expect(queueResults.violations.length).toBeLessThan(3);
    expect(consultationResults.violations.length).toBeLessThan(3);
  });

  test('Nurse workflow accessibility', async ({ page }) => {
    await page.fill('[data-testid="email"]', 'nurse@hims.com');
    await page.fill('[data-testid="password"]', 'password123');
    await page.click('[data-testid="login-button"]');
    
    const dashboardResults = await auditPage(page, '/nurse/dashboard', 'Nurse Dashboard');
    const vitalsResults = await auditPage(page, '/nurse/vitals', 'Nurse Vitals');
    
    expect(dashboardResults.violations.length).toBeLessThan(3);
    expect(vitalsResults.violations.length).toBeLessThan(3);
  });

  test('Patient portal accessibility', async ({ page }) => {
    await page.fill('[data-testid="email"]', 'patient@hims.com');
    await page.fill('[data-testid="password"]', 'password123');
    await page.click('[data-testid="login-button"]');
    
    const dashboardResults = await auditPage(page, '/patient/dashboard', 'Patient Dashboard');
    const appointmentsResults = await auditPage(page, '/patient/appointments', 'Patient Appointments');
    
    expect(dashboardResults.violations.length).toBeLessThan(3);
    expect(appointmentsResults.violations.length).toBeLessThan(3);
  });

  test('Form accessibility compliance', async ({ page }) => {
    await page.goto('/receptionist/patient-registration');
    
    const results = await accessibilityHelper.runAccessibilityAudit({
      tags: ['wcag2a', 'wcag2aa'],
      include: ['form']
    });
    
    // Check for critical form violations
    const formViolations = results.violations.filter(v => 
      ['label', 'form-field-multiple-labels', 'aria-required-attr'].includes(v.id)
    );
    
    expect(formViolations).toEqual([]);
  });

  test('Keyboard navigation compliance', async ({ page }) => {
    await page.fill('[data-testid="email"]', 'doctor@hims.com');
    await page.fill('[data-testid="password"]', 'password123');
    await page.press('[data-testid="login-button"]', 'Enter');
    
    // Test tab navigation
    await page.keyboard.press('Tab');
    const firstFocused = await page.locator(':focus').getAttribute('data-testid');
    expect(firstFocused).toBeTruthy();
    
    // Test skip links
    await page.keyboard.press('Alt+s');
    const mainContent = await page.locator('#main-content');
    expect(await mainContent.isVisible()).toBe(true);
  });

  test('Color contrast compliance', async ({ page }) => {
    const results = await accessibilityHelper.checkColorContrast();
    expect(results.length).toBe(0);
  });

  test('Screen reader compatibility', async ({ page }) => {
    const results = await accessibilityHelper.runAccessibilityAudit({
      tags: ['wcag2a', 'wcag2aa']
    });
    
    const screenReaderViolations = results.violations.filter(v =>
      ['aria-hidden-focus', 'aria-valid-attr-value', 'button-name'].includes(v.id)
    );
    
    expect(screenReaderViolations.length).toBeLessThan(2);
  });
});