#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');

console.log('🚀 Client Edit Test Runner');
console.log('==========================\n');

// Check if we're in the right directory
const packageJsonPath = path.join(process.cwd(), 'package.json');
try {
    require(packageJsonPath);
} catch (error) {
    console.error('❌ Error: package.json not found. Please run this script from the project root directory.');
    process.exit(1);
}

// Parse command line arguments
const args = process.argv.slice(2);
const testFile = 'tests/client_edit.spec.js';

let command = 'npx playwright test';

// Add specific test file
command += ` ${testFile}`;

// Add options based on arguments
if (args.includes('--headed') || args.includes('-h')) {
    command += ' --headed';
    console.log('📺 Running tests in headed mode (browser will be visible)');
}

if (args.includes('--debug') || args.includes('-d')) {
    command += ' --debug';
    console.log('🐛 Running tests in debug mode');
}

if (args.includes('--workers=1') || args.includes('-w=1')) {
    command += ' --workers=1';
    console.log('🔧 Running tests with single worker');
}

if (args.includes('--reporter=html') || args.includes('-r=html')) {
    command += ' --reporter=html';
    console.log('📊 Generating HTML report');
}

// Add specific test filter if provided
const testFilter = args.find(arg => arg.startsWith('--grep=') || arg.startsWith('-g='));
if (testFilter) {
    const filter = testFilter.split('=')[1];
    command += ` -g "${filter}"`;
    console.log(`🎯 Running tests matching: "${filter}"`);
}

console.log(`\n📋 Command: ${command}`);
console.log('⏳ Starting tests...\n');

try {
    // Run the tests
    execSync(command, { 
        stdio: 'inherit',
        cwd: process.cwd()
    });
    
    console.log('\n✅ Client edit tests completed successfully!');
    console.log('📸 Check the test-results/ directory for screenshots');
    
} catch (error) {
    console.error('\n❌ Client edit tests failed!');
    console.error('💡 Tips for debugging:');
    console.error('   - Run with --headed to see the browser');
    console.error('   - Run with --debug to pause on failures');
    console.error('   - Check test-results/ for screenshots');
    console.error('   - Verify your environment variables are set correctly');
    process.exit(1);
}

console.log('\n📚 Available test scenarios:');
console.log('   1. Edit client with all fields');
console.log('   2. Edit client with minimal fields only');
console.log('   3. Edit client and verify data persistence');
console.log('   4. Edit client validation - required fields');

console.log('\n🔧 Usage examples:');
console.log('   node scripts/run-client-edit-tests.js');
console.log('   node scripts/run-client-edit-tests.js --headed');
console.log('   node scripts/run-client-edit-tests.js --debug');
console.log('   node scripts/run-client-edit-tests.js -g "Edit client with all fields"');
console.log('   node scripts/run-client-edit-tests.js --workers=1 --headed');
