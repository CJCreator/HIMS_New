# HIMS Testing Documentation

This document provides comprehensive information about the testing infrastructure and procedures for the HIMS application.

## 🧪 Test Categories

### 1. Cross-Browser Testing
- **Chrome** (latest version)
- **Firefox** (latest version)
- **Safari** (latest version)
- **Edge** (latest version)

### 2. Device Testing
- **Desktop** (1920x1080)
- **Tablet** (768x1024)
- **Mobile** (375x667)
- **Large Desktop** (2560x1440)

### 3. Role-Based Testing
- **Admin** - User management, analytics, system settings
- **Doctor** - Patient queue, consultation workflow
- **Nurse** - Vitals entry, patient records, ward management
- **Pharmacist** - Prescription queue, inventory management
- **Receptionist** - Appointments, patient registration, billing
- **Patient** - Portal access, appointment booking, health records
- **Lab Technician** - Lab orders, result entry, verification

### 4. Accessibility Testing
- Screen reader compatibility (NVDA/JAWS/VoiceOver)
- Keyboard-only navigation
- Color contrast validation (WCAG AA)
- Focus management
- Form validation announcements

### 5. Performance Testing
- Initial page load under 3 seconds
- Bundle size analysis
- Lighthouse audit score >90
- Memory leak detection

## 🚀 Quick Start

### Prerequisites
```bash
npm install
npx playwright install --with-deps
```

### Running Tests

#### All Tests
```bash
npm run test:runner:all
```

#### Specific Categories
```bash
# Cross-browser testing
npm run test:runner:cross-browser

# Device testing
npm run test:runner:devices

# Accessibility testing
npm run test:runner:accessibility

# Performance testing
npm run test:runner:performance

# Role-based testing
npm run test:runner:role-based
```

#### Individual Test Files
```bash
# Using Playwright directly
npm run test:e2e -- e2e/admin-navigation.spec.ts
npm run test:e2e -- e2e/accessibility.spec.ts
npm run test:e2e -- e2e/performance.spec.ts
```

## 📊 Test Reports

### Generate Test Report
```bash
npm run test:report
```

This generates:
- HTML report: `test-report/index.html`
- JSON report: `test-report/report.json`

### View Dashboard
```bash
npm run test:dashboard
```

## 🏗️ Test Structure

### Test Files Location
```
e2e/
├── admin-navigation.spec.ts      # Admin role tests
├── consultation-workflow.spec.ts # Doctor workflow tests
├── nurse-navigation.spec.ts      # Nurse role tests
├── pharmacist-navigation.spec.ts # Pharmacist role tests
├── receptionist-navigation.spec.ts # Receptionist role tests
├── patient-portal.spec.ts        # Patient role tests
├── accessibility.spec.ts         # Accessibility tests
├── performance.spec.ts           # Performance tests
└── helpers/
    └── auth.ts                   # Authentication helpers
```

### Helper Functions
Located in `e2e/helpers/auth.ts`:
- `loginAsRole(page, role)` - Login with specific role
- `logout(page)` - Logout function
- User credentials for all roles

## 🔄 CI/CD Integration

### GitHub Actions
The `.github/workflows/test.yml` file provides:
- Automated testing on push/PR
- Multi-node version testing
- Cross-browser and device testing
- Accessibility and performance testing
- Test result artifacts

### Test Matrix
- Node.js versions: 18.x, 20.x
- Multiple test categories
- Parallel execution for faster results

## 🎯 Test Coverage

### Functional Testing
- ✅ User authentication and authorization
- ✅ Role-based navigation and permissions
- ✅ Core workflows (consultation, prescriptions, appointments)
- ✅ Data entry and validation
- ✅ Error handling and edge cases

### Non-Functional Testing
- ✅ Cross-browser compatibility
- ✅ Responsive design across devices
- ✅ Accessibility compliance (WCAG AA)
- ✅ Performance benchmarks
- ✅ Memory leak detection

## 🛠️ Custom Test Commands

### Development Testing
```bash
# Run tests in headed mode for debugging
npm run test:e2e:headed

# Run tests with debug mode
npm run test:e2e:debug

# Run tests with UI
npm run test:e2e:ui
```

### Continuous Integration
```bash
# Run all tests for CI
npm run test:runner:all

# Generate reports for CI
npm run test:report
```

## 📈 Performance Benchmarks

### Load Time Targets
- Initial page load: < 3 seconds
- Dashboard navigation: < 2 seconds
- Form submissions: < 5 seconds
- API responses: < 1 second

### Bundle Size Limits
- Main bundle: < 2MB
- Total assets: < 5MB
- Lighthouse score: > 90

## 🔧 Troubleshooting

### Common Issues

#### Playwright Installation
```bash
# Reinstall browsers
npx playwright install --force

# Check browser installation
npx playwright doctor
```

#### Test Failures
- Check Playwright report: `playwright-report/index.html`
- Run tests in headed mode for debugging
- Verify test data and user credentials

#### Performance Issues
- Check network conditions
- Verify test environment resources
- Review bundle size and optimization

### Debug Mode
```bash
# Run with debug output
DEBUG=pw:api npm run test:e2e

# Run specific test with debug
npm run test:e2e:debug -- e2e/admin-navigation.spec.ts
```

## 📋 Test Checklist

Use this checklist to verify all testing requirements are met:

- [ ] Cross-browser testing completed
- [ ] Device testing completed
- [ ] All role-based tests passing
- [ ] Accessibility tests passing
- [ ] Performance benchmarks met
- [ ] Test reports generated
- [ ] CI/CD pipeline working

## 🤝 Contributing

### Adding New Tests
1. Create test file in `e2e/` directory
2. Use existing patterns and helpers
3. Add to appropriate test category
4. Update this documentation

### Test Naming Conventions
- Use descriptive test names
- Group related tests in describe blocks
- Use data-testid attributes for selectors
- Follow existing code patterns

### Best Practices
- Use helper functions for common operations
- Implement proper error handling
- Add meaningful assertions
- Clean up test data after tests

## 📞 Support

For testing-related issues:
1. Check the troubleshooting section
2. Review test reports and logs
3. Run tests in debug mode
4. Check GitHub issues for known problems

## 📄 License

This testing infrastructure is part of the HIMS project and follows the same license terms.