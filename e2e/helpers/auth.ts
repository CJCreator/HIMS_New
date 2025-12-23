import { Page } from '@playwright/test';

export interface UserCredentials {
  email: string;
  password: string;
  role: string;
}

export const userCredentials: Record<string, UserCredentials> = {
  admin: {
    email: 'admin@hospital.com',
    password: 'admin123',
    role: 'admin'
  },
  doctor: {
    email: 'doctor@hospital.com',
    password: 'password123',
    role: 'doctor'
  },
  nurse: {
    email: 'nurse@hospital.com',
    password: 'nurse123',
    role: 'nurse'
  },
  pharmacist: {
    email: 'pharmacist@hospital.com',
    password: 'pharm123',
    role: 'pharmacist'
  },
  receptionist: {
    email: 'receptionist@hospital.com',
    password: 'recept123',
    role: 'receptionist'
  },
  patient: {
    email: 'patient@hospital.com',
    password: 'patient123',
    role: 'patient'
  },
  labTech: {
    email: 'labtech@hospital.com',
    password: 'lab123',
    role: 'labTech'
  }
};

export async function loginAsRole(page: Page, role: string): Promise<void> {
  const credentials = userCredentials[role];
  if (!credentials) {
    throw new Error(`No credentials found for role: ${role}`);
  }

  await page.goto('/auth/signin');
  await page.fill('[data-testid="email"]', credentials.email);
  await page.fill('[data-testid="password"]', credentials.password);
  await page.click('[data-testid="signin-button"]');

  // Wait for successful login - adjust selector based on role
  const dashboardSelectors: Record<string, string> = {
    admin: '[data-testid="admin-dashboard"]',
    doctor: '[data-testid="doctor-dashboard"]',
    nurse: '[data-testid="nurse-dashboard"]',
    pharmacist: '[data-testid="pharmacy-dashboard"]',
    receptionist: '[data-testid="receptionist-dashboard"]',
    patient: '[data-testid="patient-dashboard"]',
    labTech: '[data-testid="lab-dashboard"]'
  };

  const selector = dashboardSelectors[role];
  if (selector) {
    await page.waitForSelector(selector, { timeout: 15000 });
  }
}

export async function logout(page: Page): Promise<void> {
  // Assuming there's a logout button or menu
  await page.click('[data-testid="user-menu"]');
  await page.click('[data-testid="logout-button"]');
  await page.waitForURL('/auth/signin');
}