import { test, expect } from '@playwright/test';

test.describe('Lab Technician Login', () => {
  test('lab option should be available in role dropdown', async ({ page }) => {
    await page.goto('/signin');
    
    const roleSelect = page.locator('[data-testid="role-select"]');
    await expect(roleSelect).toBeVisible();
    
    // Check if lab option exists
    const labOption = roleSelect.locator('option[value="lab"]');
    await expect(labOption).toBeVisible();
    await expect(labOption).toHaveText('Lab Technician');
  });

  test('can select lab role and login', async ({ page }) => {
    await page.goto('/signin');
    
    // Fill in credentials
    await page.fill('[data-testid="email"]', 'labtech@hospital.com');
    await page.fill('[data-testid="password"]', 'lab123');
    
    // Select lab role
    await page.selectOption('[data-testid="role-select"]', 'lab');
    
    // Verify lab is selected
    const selectedValue = await page.locator('[data-testid="role-select"]').inputValue();
    expect(selectedValue).toBe('lab');
    
    // Click sign in
    await page.click('[data-testid="signin-button"]');
    
    // Should navigate to lab dashboard
    await page.waitForURL('/lab');
    await expect(page).toHaveURL('/lab');
  });

  test('all role options should be present', async ({ page }) => {
    await page.goto('/signin');
    
    const roleSelect = page.locator('[data-testid="role-select"]');
    
    // Check all expected roles
    const expectedRoles = [
      { value: 'admin', text: 'Admin' },
      { value: 'doctor', text: 'Doctor' },
      { value: 'receptionist', text: 'Receptionist' },
      { value: 'nurse', text: 'Nurse' },
      { value: 'pharmacist', text: 'Pharmacist' },
      { value: 'lab', text: 'Lab Technician' }
    ];
    
    for (const role of expectedRoles) {
      const option = roleSelect.locator(`option[value="${role.value}"]`);
      await expect(option).toBeVisible();
      await expect(option).toHaveText(role.text);
    }
  });
});
