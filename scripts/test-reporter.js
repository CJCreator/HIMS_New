#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('📊 Generating HIMS Test Report');
console.log('='.repeat(50));

const testResultsDir = path.join(__dirname, '..', 'test-results');
const reportDir = path.join(__dirname, '..', 'test-report');

// Ensure report directory exists
if (!fs.existsSync(reportDir)) {
  fs.mkdirSync(reportDir, { recursive: true });
}

function generateReport() {
  const report = {
    timestamp: new Date().toISOString(),
    summary: {
      totalTests: 0,
      passedTests: 0,
      failedTests: 0,
      skippedTests: 0
    },
    categories: {
      crossBrowser: { passed: 0, failed: 0, total: 0 },
      devices: { passed: 0, failed: 0, total: 0 },
      accessibility: { passed: 0, failed: 0, total: 0 },
      performance: { passed: 0, failed: 0, total: 0 },
      roleBased: { passed: 0, failed: 0, total: 0 }
    },
    details: []
  };

  // Read test results
  if (fs.existsSync(testResultsDir)) {
    const files = fs.readdirSync(testResultsDir);
    files.forEach(file => {
      if (file.endsWith('.json')) {
        try {
          const content = fs.readFileSync(path.join(testResultsDir, file), 'utf8');
          const testResult = JSON.parse(content);
          
          // Process test results
          testResult.suites.forEach(suite => {
            suite.tests.forEach(test => {
              report.summary.totalTests++;
              if (test.status === 'passed') {
                report.summary.passedTests++;
              } else if (test.status === 'failed') {
                report.summary.failedTests++;
              } else if (test.status === 'skipped') {
                report.summary.skippedTests++;
              }
            });
          });
        } catch (error) {
          console.warn(`Warning: Could not parse ${file}: ${error.message}`);
        }
      }
    });
  }

  // Generate HTML report
  const htmlReport = generateHTMLReport(report);
  fs.writeFileSync(path.join(reportDir, 'index.html'), htmlReport);

  // Generate JSON report
  fs.writeFileSync(path.join(reportDir, 'report.json'), JSON.stringify(report, null, 2));

  console.log('\n✅ Test report generated successfully!');
  console.log(`📄 HTML Report: ${path.join(reportDir, 'index.html')}`);
  console.log(`📄 JSON Report: ${path.join(reportDir, 'report.json')}`);
  
  return report;
}

function generateHTMLReport(report) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>HIMS Test Report</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 20px; background-color: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        h1 { color: #2c3e50; border-bottom: 3px solid #3498db; padding-bottom: 10px; }
        .summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin: 30px 0; }
        .card { background: #f8f9fa; padding: 20px; border-radius: 8px; border-left: 4px solid #3498db; }
        .card h3 { margin: 0 0 10px 0; font-size: 14px; text-transform: uppercase; color: #666; }
        .card .value { font-size: 24px; font-weight: bold; color: #2c3e50; }
        .categories { margin: 30px 0; }
        .category { background: #fff; border: 1px solid #e0e0e0; border-radius: 8px; padding: 20px; margin-bottom: 20px; }
        .category h3 { margin: 0 0 15px 0; color: #2c3e50; }
        .metrics { display: flex; gap: 20px; }
        .metric { flex: 1; text-align: center; padding: 15px; background: #f8f9fa; border-radius: 6px; }
        .metric .label { font-size: 12px; color: #666; text-transform: uppercase; }
        .metric .number { font-size: 20px; font-weight: bold; margin-top: 5px; }
        .status-passed { color: #27ae60; }
        .status-failed { color: #e74c3c; }
        .status-skipped { color: #f39c12; }
        .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #e0e0e0; color: #666; font-size: 12px; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🏥 HIMS Test Report</h1>
        <p><strong>Generated:</strong> ${new Date(report.timestamp).toLocaleString()}</p>
        
        <div class="summary">
            <div class="card">
                <h3>Total Tests</h3>
                <div class="value">${report.summary.totalTests}</div>
            </div>
            <div class="card">
                <h3>Passed</h3>
                <div class="value status-passed">${report.summary.passedTests}</div>
            </div>
            <div class="card">
                <h3>Failed</h3>
                <div class="value status-failed">${report.summary.failedTests}</div>
            </div>
            <div class="card">
                <h3>Skipped</h3>
                <div class="value status-skipped">${report.summary.skippedTests}</div>
            </div>
        </div>

        <div class="categories">
            <div class="category">
                <h3>📊 Test Categories</h3>
                <div class="metrics">
                    <div class="metric">
                        <div class="label">Cross-Browser</div>
                        <div class="number">${report.categories.crossBrowser.passed}/${report.categories.crossBrowser.total}</div>
                    </div>
                    <div class="metric">
                        <div class="label">Device Testing</div>
                        <div class="number">${report.categories.devices.passed}/${report.categories.devices.total}</div>
                    </div>
                    <div class="metric">
                        <div class="label">Accessibility</div>
                        <div class="number">${report.categories.accessibility.passed}/${report.categories.accessibility.total}</div>
                    </div>
                    <div class="metric">
                        <div class="label">Performance</div>
                        <div class="number">${report.categories.performance.passed}/${report.categories.performance.total}</div>
                    </div>
                    <div class="metric">
                        <div class="label">Role-Based</div>
                        <div class="number">${report.categories.roleBased.passed}/${report.categories.roleBased.total}</div>
                    </div>
                </div>
            </div>
        </div>

        <div class="footer">
            <p>💡 Tip: Run <code>npm run test:runner:all</code> to execute the complete test suite</p>
            <p>🔧 For detailed test results, check the Playwright report in the <code>playwright-report/</code> directory</p>
        </div>
    </div>
</body>
</html>
  `;
}

// Generate the report
const report = generateReport();

// Print summary to console
console.log('\n📈 Test Summary:');
console.log(`   Total: ${report.summary.totalTests}`);
console.log(`   Passed: ${report.summary.passedTests}`);
console.log(`   Failed: ${report.summary.failedTests}`);
console.log(`   Skipped: ${report.summary.skippedTests}`);

// Exit with error code if tests failed
if (report.summary.failedTests > 0) {
  console.log('\n❌ Some tests failed. Please check the detailed report.');
  process.exit(1);
} else {
  console.log('\n✅ All tests passed!');
}