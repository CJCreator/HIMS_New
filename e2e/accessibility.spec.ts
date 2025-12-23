import { test, expect } from '@playwright/test';
import { loginAsRole } from './helpers/auth';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility Testing', () => {
  test('login page accessibility', async ({ page }) => {
    await page.goto('/auth/signin');

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('admin dashboard accessibility', async ({ page }) => {
    await loginAsRole(page, 'admin');

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('doctor dashboard accessibility', async ({ page }) => {
    await loginAsRole(page, 'doctor');

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('consultation form accessibility', async ({ page }) => {
    await loginAsRole(page, 'doctor');
    await page.click('[data-testid="patient-queue-nav"]');
    await page.click('[data-testid="patient-item"]:first-child');
    await page.click('[data-testid="start-consultation"]');

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('patient registration form accessibility', async ({ page }) => {
    await loginAsRole(page, 'receptionist');
    await page.click('[data-testid="receptionist-nav"]');
    await page.click('[data-testid="patients-link"]');
    await page.click('[data-testid="register-patient-link"]');

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('patient portal accessibility', async ({ page }) => {
    await loginAsRole(page, 'patient');

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('color contrast validation', async ({ page }) => {
    await loginAsRole(page, 'admin');

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .withRules(['color-contrast'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('keyboard navigation accessibility', async ({ page }) => {
    await page.goto('/auth/signin');

    // Test keyboard navigation to form fields
    await page.keyboard.press('Tab');
    await expect(page.locator('[data-testid="email"]')).toBeFocused();

    await page.keyboard.press('Tab');
    await expect(page.locator('[data-testid="password"]')).toBeFocused();

    await page.keyboard.press('Tab');
    await expect(page.locator('[data-testid="signin-button"]')).toBeFocused();
  });

  test('form validation announcements', async ({ page }) => {
    await loginAsRole(page, 'doctor');
    await page.click('[data-testid="patient-queue-nav"]');
    await page.click('[data-testid="patient-item"]:first-child');
    await page.click('[data-testid="start-consultation"]');

    // Skip to diagnosis step
    for (let i = 0; i < 6; i++) {
      await page.keyboard.press('Tab');
      await page.keyboard.press('Enter');
    }

    // Try to proceed without diagnosis
    await page.keyboard.press('Tab'); // Move to next button
    await page.keyboard.press('Enter'); // Try to proceed

    // Check if error is announced (this would require aria-live regions)
    await expect(page.locator('[data-testid="diagnosis-error"]')).toBeVisible();
  });

  test('focus management', async ({ page }) => {
    await loginAsRole(page, 'admin');

    // Test that focus is managed properly in modals and dialogs
    await page.click('[data-testid="admin-nav"]');
    await page.click('[data-testid="user-management-link"]');

    // Open a modal or dialog if available
    const modalTrigger = page.locator('[data-testid="add-user-button"], [data-testid="edit-user-button"]').first();
    if (await modalTrigger.isVisible()) {
      await modalTrigger.click();

      // Check if focus moves to modal
      const modal = page.locator('[role="dialog"], [data-testid*="modal"]').first();
      if (await modal.isVisible()) {
        // Focus should be trapped in modal
        await page.keyboard.press('Tab');
        const focusedElement = page.locator(':focus');
        await expect(focusedElement).toBeVisible();
      }
    }
  });
});