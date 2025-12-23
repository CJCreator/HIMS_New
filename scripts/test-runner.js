#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');

const args = process.argv.slice(2);
const testType = args[0];

console.log('🧪 Running HIMS Test Suite');
console.log(`Test Type: ${testType || 'all'}`);
console.log('='.repeat(50));

function runCommand(command, description) {
  console.log(`\n${description}`);
  console.log('-'.repeat(description.length));
  try {
    execSync(command, { stdio: 'inherit', cwd: path.join(__dirname, '..') });
    console.log(`✅ ${description} completed successfully`);
  } catch (error) {
    console.error(`❌ ${description} failed`);
    process.exit(1);
  }
}

switch (testType) {
  case 'cross-browser':
    runCommand('npm run test:cross-browser', 'Cross-Browser Testing');
    break;

  case 'devices':
    runCommand('npm run test:devices', 'Device Testing');
    break;

  case 'accessibility':
    runCommand('npm run test:e2e -- e2e/accessibility.spec.ts', 'Accessibility Testing');
    break;

  case 'performance':
    runCommand('npm run test:e2e -- e2e/performance.spec.ts', 'Performance Testing');
    break;

  case 'role-based':
    runCommand('npm run test:e2e -- e2e/admin-navigation.spec.ts', 'Admin Role Testing');
    runCommand('npm run test:e2e -- e2e/consultation-workflow.spec.ts', 'Doctor Role Testing');
    runCommand('npm run test:e2e -- e2e/nurse-navigation.spec.ts', 'Nurse Role Testing');
    runCommand('npm run test:e2e -- e2e/pharmacist-navigation.spec.ts', 'Pharmacist Role Testing');
    runCommand('npm run test:e2e -- e2e/receptionist-navigation.spec.ts', 'Receptionist Role Testing');
    runCommand('npm run test:e2e -- e2e/patient-portal.spec.ts', 'Patient Role Testing');
    break;

  case 'all':
  default:
    console.log('\n🚀 Running Complete Test Suite');
    console.log('This will take several minutes...');
    
    // Run all test categories
    runCommand('npm run test:cross-browser', 'Cross-Browser Testing');
    runCommand('npm run test:devices', 'Device Testing');
    runCommand('npm run test:e2e -- e2e/accessibility.spec.ts', 'Accessibility Testing');
    runCommand('npm run test:e2e -- e2e/performance.spec.ts', 'Performance Testing');
    
    // Run role-based tests
    runCommand('npm run test:e2e -- e2e/admin-navigation.spec.ts', 'Admin Role Testing');
    runCommand('npm run test:e2e -- e2e/consultation-workflow.spec.ts', 'Doctor Role Testing');
    runCommand('npm run test:e2e -- e2e/nurse-navigation.spec.ts', 'Nurse Role Testing');
    runCommand('npm run test:e2e -- e2e/pharmacist-navigation.spec.ts', 'Pharmacist Role Testing');
    runCommand('npm run test:e2e -- e2e/receptionist-navigation.spec.ts', 'Receptionist Role Testing');
    runCommand('npm run test:e2e -- e2e/patient-portal.spec.ts', 'Patient Role Testing');
    
    // Run existing consultation workflow tests
    runCommand('npm run test:e2e -- e2e/consultation-workflow.spec.ts', 'Consultation Workflow Testing');
    
    console.log('\n🎉 All tests completed successfully!');
    break;
}

console.log('\n' + '='.repeat(50));
console.log('Test execution completed. Check the Playwright report for detailed results.');