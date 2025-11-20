#!/usr/bin/env node

/**
 * Run Create Report Draft Tests
 * 
 * This script runs the Create Report Draft test suite with proper configuration
 */

const { execSync } = require('child_process');
const path = require('path');

console.log('🚀 Starting Create Report Draft Tests...\n');

// Test configuration
const testConfig = {
  testFile: 'tests/regression/functional/Create_Report_Draft.spec.ts',
  reporters: ['html', 'json', 'allure-playwright'],
  timeout: 300000, // 5 minutes
  retries: 2,
  workers: 1,
  headed: false,
  video: true
};

// Build the Playwright command
const buildCommand = () => {
  const baseCommand = 'npx playwright test';
  const options = [
    `"${testConfig.testFile}"`,
    `--reporter=${testConfig.reporters.join(',')}`,
    `--timeout=${testConfig.timeout}`,
    `--retries=${testConfig.retries}`,
    `--workers=${testConfig.workers}`,
    '--project=chromium'
  ];

  if (testConfig.video) {
    options.push('--video=on');
  }

  if (testConfig.headed) {
    options.push('--headed');
  }

  return `${baseCommand} ${options.join(' ')}`;
};

// Run the tests
try {
  console.log('📋 Test Configuration:');
  console.log(`   File: ${testConfig.testFile}`);
  console.log(`   Reporters: ${testConfig.reporters.join(', ')}`);
  console.log(`   Timeout: ${testConfig.timeout}ms`);
  console.log(`   Retries: ${testConfig.retries}`);
  console.log(`   Workers: ${testConfig.workers}`);
  console.log(`   Video: ${testConfig.video ? 'Enabled' : 'Disabled'}`);
  console.log(`   Headed: ${testConfig.headed ? 'Enabled' : 'Disabled'}`);
  console.log('');

  const command = buildCommand();
  console.log(`🔧 Executing: ${command}\n`);

  execSync(command, { 
    stdio: 'inherit',
    cwd: process.cwd()
  });

  console.log('\n✅ Create Report Draft Tests completed successfully!');
  console.log('\n📊 Test Reports Generated:');
  console.log('   • HTML Report: playwright-report/index.html');
  console.log('   • Allure Report: allure-results/');
  console.log('   • JSON Report: test-results/');

} catch (error) {
  console.error('\n❌ Create Report Draft Tests failed!');
  console.error(`Error: ${error.message}`);
  process.exit(1);
}
