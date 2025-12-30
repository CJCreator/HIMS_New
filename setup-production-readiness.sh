#!/bin/bash

# HIMS Production Readiness - Quick Start Script
# This script sets up the initial structure and dependencies for production readiness

echo "🚀 HIMS Production Readiness Setup"
echo "=================================="

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root."
    exit 1
fi

echo "📦 Installing production dependencies..."

# Install security dependencies
npm install dompurify @types/dompurify

# Install monitoring dependencies  
npm install @sentry/react @sentry/tracing web-vitals

# Install development dependencies
npm install -D @playwright/test @axe-core/playwright axe-core

echo "✅ Dependencies installed successfully!"

echo "📁 Creating directory structure..."

# Create directory structure
mkdir -p src/config
mkdir -p src/middleware  
mkdir -p src/utils
mkdir -p e2e/tests
mkdir -p e2e/fixtures
mkdir -p e2e/utils
mkdir -p .github/workflows

echo "✅ Directory structure created!"

echo "📝 Creating initial configuration files..."

# Create CSP config
cat > src/config/csp.config.ts << 'EOF'
export const CSP_CONFIG = {
  'default-src': ["'self'"],
  'script-src': ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net"],
  'style-src': ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
  'font-src': ["'self'", "https://fonts.gstatic.com"],
  'img-src': ["'self'", "data:", "https:"],
  'connect-src': ["'self'", process.env.VITE_API_URL || "http://localhost:3001"],
};
EOF

# Create security middleware
cat > src/middleware/security.middleware.ts << 'EOF'
export const securityHeaders = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  'Referrer-Policy': 'strict-origin-when-cross-origin'
};
EOF

# Create sanitization utils
cat > src/utils/sanitize.ts << 'EOF'
import DOMPurify from 'dompurify';

export const sanitizeHtml = (html: string): string => {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em'],
    ALLOWED_ATTR: []
  });
};

export const sanitizeInput = (input: string): string => {
  return input.replace(/[<>]/g, '');
};
EOF

# Create Sentry config
cat > src/utils/sentry.ts << 'EOF'
import * as Sentry from '@sentry/react';

export const initSentry = () => {
  if (process.env.NODE_ENV === 'production') {
    Sentry.init({
      dsn: process.env.VITE_SENTRY_DSN,
      environment: process.env.NODE_ENV,
      tracesSampleRate: 0.1,
    });
  }
};
EOF

# Create performance monitoring
cat > src/utils/performance.ts << 'EOF'
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

export const trackWebVitals = () => {
  getCLS(sendToAnalytics);
  getFID(sendToAnalytics);
  getFCP(sendToAnalytics);
  getLCP(sendToAnalytics);
  getTTFB(sendToAnalytics);
};

const sendToAnalytics = (metric: any) => {
  // Send to your analytics service
  if (process.env.NODE_ENV === 'development') {
    console.log('Web Vital:', metric);
  }
  
  // TODO: Send to actual analytics service
  // Example: gtag('event', metric.name, { value: metric.value });
};
EOF

# Create Playwright config
cat > playwright.config.ts << 'EOF'
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  timeout: 30000,
  retries: process.env.CI ? 2 : 0,
  use: {
    baseURL: 'http://localhost:3000',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
  webServer: {
    command: 'npm run dev',
    port: 3000,
    reuseExistingServer: !process.env.CI,
  },
});
EOF

# Create basic E2E test
cat > e2e/tests/auth.spec.ts << 'EOF'
import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test('should login successfully with valid credentials', async ({ page }) => {
    await page.goto('/login');
    
    await page.fill('[data-testid="username"]', 'test@example.com');
    await page.fill('[data-testid="password"]', 'password');
    await page.click('[data-testid="login-button"]');
    
    // Should redirect to dashboard
    await expect(page).toHaveURL(/.*dashboard/);
  });

  test('should show error with invalid credentials', async ({ page }) => {
    await page.goto('/login');
    
    await page.fill('[data-testid="username"]', 'invalid@example.com');
    await page.fill('[data-testid="password"]', 'wrongpassword');
    await page.click('[data-testid="login-button"]');
    
    // Should show error message
    await expect(page.locator('[data-testid="error-message"]')).toBeVisible();
  });
});
EOF

# Create accessibility test
cat > e2e/tests/accessibility.spec.ts << 'EOF'
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility', () => {
  test('should not have accessibility violations on login page', async ({ page }) => {
    await page.goto('/login');
    
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('should not have accessibility violations on dashboard', async ({ page }) => {
    // Login first
    await page.goto('/login');
    await page.fill('[data-testid="username"]', 'test@example.com');
    await page.fill('[data-testid="password"]', 'password');
    await page.click('[data-testid="login-button"]');
    
    // Check dashboard accessibility
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
    expect(accessibilityScanResults.violations).toEqual([]);
  });
});
EOF

# Create CI workflow
cat > .github/workflows/ci.yml << 'EOF'
name: CI

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run linting
      run: npm run lint
    
    - name: Run unit tests
      run: npm run test:coverage
    
    - name: Build application
      run: npm run build
    
    - name: Upload coverage reports
      uses: codecov/codecov-action@v3
      with:
        file: ./coverage/lcov.info
        fail_ci_if_error: true

  e2e:
    runs-on: ubuntu-latest
    needs: test

    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Install Playwright browsers
      run: npx playwright install --with-deps
    
    - name: Run E2E tests
      run: npm run test:e2e
    
    - name: Upload E2E test results
      uses: actions/upload-artifact@v3
      if: failure()
      with:
        name: playwright-report
        path: playwright-report/
EOF

# Create environment files
cat > .env.example << 'EOF'
# API Configuration
VITE_API_URL=http://localhost:3001
VITE_WS_URL=ws://localhost:3001

# Environment
VITE_ENVIRONMENT=development

# Monitoring
VITE_SENTRY_DSN=your-sentry-dsn-here

# Feature Flags
VITE_FEATURE_TELEMEDICINE=false
VITE_FEATURE_AI_DIAGNOSIS=false
EOF

cat > .env.production << 'EOF'
# API Configuration
VITE_API_URL=https://api.hims.arocord.com
VITE_WS_URL=wss://ws.hims.arocord.com

# Environment
VITE_ENVIRONMENT=production

# Monitoring
VITE_SENTRY_DSN=your-production-sentry-dsn

# Feature Flags
VITE_FEATURE_TELEMEDICINE=true
VITE_FEATURE_AI_DIAGNOSIS=false
EOF

echo "✅ Configuration files created!"

echo "📋 Updating package.json scripts..."

# Update package.json scripts (this is a simplified version - you may need to adjust)
npm pkg set scripts.test:coverage="vitest run --coverage"
npm pkg set scripts.test:e2e="playwright test"
npm pkg set scripts.test:a11y="playwright test e2e/tests/accessibility.spec.ts"
npm pkg set scripts.build:staging="vite build --mode staging"
npm pkg set scripts.build:production="vite build --mode production"

echo "✅ Package.json scripts updated!"

echo "🎯 Installing Playwright browsers..."
npx playwright install

echo ""
echo "🎉 Setup Complete!"
echo "=================="
echo ""
echo "Next steps:"
echo "1. Review and customize the generated configuration files"
echo "2. Update your vite.config.ts with security headers"
echo "3. Add Sentry initialization to your main.tsx"
echo "4. Start implementing the tasks from TASK_TRACKER.md"
echo ""
echo "Quick commands:"
echo "  npm run test:coverage  # Run tests with coverage"
echo "  npm run test:e2e      # Run E2E tests"
echo "  npm run test:a11y     # Run accessibility tests"
echo "  npm run build:production  # Build for production"
echo ""
echo "📖 See PRODUCTION_READINESS_PLAN.md for detailed implementation steps"
echo "📋 Track progress in TASK_TRACKER.md"