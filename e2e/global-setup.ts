import { chromium, FullConfig } from '@playwright/test';

async function globalSetup(config: FullConfig) {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  // Setup test database or mock data
  console.log('Setting up test environment...');
  
  // You could setup test users, seed data, etc.
  // For now, we'll just verify the app is running
  try {
    await page.goto('http://localhost:5173');
    await page.waitForSelector('body', { timeout: 30000 });
    console.log('Application is running and accessible');
  } catch (error) {
    console.error('Failed to access application:', error);
    throw error;
  }
  
  await browser.close();
}

export default globalSetup;