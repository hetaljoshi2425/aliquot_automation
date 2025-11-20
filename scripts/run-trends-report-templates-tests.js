#!/usr/bin/env node

/**
 * Run script for Trends Report Templates Tests
 * This script executes the trends report templates test suite with proper configuration
 */

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('🚀 Starting Trends Report Templates Test Suite...\n');

// Configuration
const testFile = 'tests/regression/functional/Trends_report_templates.spec.ts';
const allureResultsDir = 'allure-results';
const testResultsDir = 'test-results';
const playwrightReportDir = 'playwright-report';

// Ensure directories exist
const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`📁 Created directory: ${dir}`);
  }
};

ensureDir(allureResultsDir);
ensureDir(testResultsDir);
ensureDir(playwrightReportDir);

// Test configuration
const testConfig = {
  // Browser configuration
  browser: 'chromium', // or 'firefox', 'webkit'
  headless: false, // Set to true for headless mode
  slowMo: 1000, // Slow down operations by 1 second
  
  // Video recording configuration
  video: 'retain-on-failure',
  videoSize: { width: 1280, height: 720 },
  
  // Screenshot configuration
  screenshot: 'only-on-failure',
  
  // Timeout configuration
  timeout: 60000, // 60 seconds
  actionTimeout: 30000, // 30 seconds
  
  // Retry configuration
  retries: 1,
  
  // Parallel execution
  workers: 1, // Run tests sequentially for better video recording
  
  // Reporter configuration
  reporter: [
    ['html', { outputFolder: playwrightReportDir }],
    ['json', { outputFile: path.join(testResultsDir, 'trends-report-templates-results.json') }],
    ['junit', { outputFile: path.join(testResultsDir, 'trends-report-templates-results.xml') }]
  ]
};

// Build the Playwright command
const buildCommand = () => {
  const baseCommand = 'npx playwright test';
  const options = [
    testFile,
    `--browser=${testConfig.browser}`,
    `--workers=${testConfig.workers}`,
    `--retries=${testConfig.retries}`,
    `--timeout=${testConfig.timeout}`,
    `--action-timeout=${testConfig.actionTimeout}`,
    `--video=${testConfig.video}`,
    `--video-size=${testConfig.videoSize.width}x${testConfig.videoSize.height}`,
    `--screenshot=${testConfig.screenshot}`,
    `--reporter=html:${playwrightReportDir}`,
    `--reporter=json:${path.join(testResultsDir, 'trends-report-templates-results.json')}`,
    `--reporter=junit:${path.join(testResultsDir, 'trends-report-templates-results.xml')}`
  ];

  if (!testConfig.headless) {
    options.push('--headed');
  }

  if (testConfig.slowMo > 0) {
    options.push(`--slow-mo=${testConfig.slowMo}`);
  }

  return `${baseCommand} ${options.join(' ')}`;
};

// Execute the test
const runTests = () => {
  try {
    console.log('📋 Test Configuration:');
    console.log(`   Browser: ${testConfig.browser}`);
    console.log(`   Headless: ${testConfig.headless}`);
    console.log(`   Video Recording: ${testConfig.video}`);
    console.log(`   Screenshots: ${testConfig.screenshot}`);
    console.log(`   Timeout: ${testConfig.timeout}ms`);
    console.log(`   Retries: ${testConfig.retries}`);
    console.log(`   Workers: ${testConfig.workers}`);
    console.log(`   Slow Mo: ${testConfig.slowMo}ms\n`);

    console.log('🎬 Starting video recording for all test results...');
    console.log('📊 Test execution will include comprehensive reporting...\n');

    const command = buildCommand();
    console.log(`🔧 Executing command: ${command}\n`);
    
    execSync(command, { 
      stdio: 'inherit',
      cwd: process.cwd(),
      env: {
        ...process.env,
        // Ensure video recording is enabled
        PWVIDEO: '1',
        // Set allure results directory
        ALLURE_RESULTS_DIR: allureResultsDir
      }
    });

    console.log('\n✅ Trends Report Templates Tests completed successfully!');
    console.log(`📊 Test results available at: ${playwrightReportDir}/index.html`);
    console.log(`📁 Test artifacts saved in: ${testResultsDir}`);
    console.log(`🎬 Video recordings saved in: ${testResultsDir}`);
    console.log(`📈 Allure results saved in: ${allureResultsDir}`);

  } catch (error) {
    console.error('\n❌ Test execution failed:');
    console.error(error.message);
    
    console.log('\n📊 Test results still available at:');
    console.log(`   HTML Report: ${playwrightReportDir}/index.html`);
    console.log(`   Test Artifacts: ${testResultsDir}`);
    console.log(`   Video Recordings: ${testResultsDir}`);
    console.log(`   Allure Results: ${allureResultsDir}`);
    
    process.exit(1);
  }
};

// Generate Allure report if available
const generateAllureReport = () => {
  try {
    console.log('\n📈 Generating Allure report...');
    execSync('npx allure generate allure-results --clean -o allure-report', { stdio: 'inherit' });
    console.log('✅ Allure report generated successfully!');
    console.log('📊 Open allure-report/index.html in your browser to view the detailed report');
  } catch (error) {
    console.log('⚠️  Allure report generation skipped (allure-commandline not installed)');
    console.log('   Install with: npm install -g allure-commandline');
  }
};

// Main execution
const main = () => {
  console.log('🎯 Trends Report Templates Test Suite');
  console.log('=====================================\n');
  
  console.log('📝 This test suite covers:');
  console.log('   1. Login with valid credentials');
  console.log('   2. Navigate to Dashboard and Trends Charting');
  console.log('   3. Verify page elements (Filter Customer, Manage Template, Save as Template, Generate Graph)');
  console.log('   4. Select filters (Client, Customer, Facility, Building, System)');
  console.log('   5. Generate graph and verify default settings');
  console.log('   6. Select data source, component, and test');
  console.log('   7. Save configuration as template');
  console.log('   8. Verify template is saved correctly\n');

  runTests();
  generateAllureReport();
  
  console.log('\n🎉 Test execution completed!');
  console.log('📋 Check the generated reports for detailed results and video recordings.');
};

// Run the main function
main();
