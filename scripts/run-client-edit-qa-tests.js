#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');

console.log('🚀 Client Edit QA Test Runner');
console.log('==============================');

// Parse command line arguments
const args = process.argv.slice(2);
let command = 'npx playwright test tests/client_edit_qa.spec.js';

// Add options based on arguments
if (args.includes('--headed')) {
    command += ' --headed';
}

if (args.includes('--debug')) {
    command += ' --debug';
}

// Add grep filter if specified
const grepIndex = args.findIndex(arg => arg.startsWith('-g=') || arg.startsWith('--grep='));
if (grepIndex !== -1) {
    const grepValue = args[grepIndex].split('=')[1];
    command += ` -g "${grepValue}"`;
}

// Add reporter if specified
const reporterIndex = args.findIndex(arg => arg.startsWith('--reporter='));
if (reporterIndex !== -1) {
    const reporterValue = args[reporterIndex].split('=')[1];
    command += ` --reporter=${reporterValue}`;
}

console.log(`📋 Running command: ${command}`);
console.log('');

try {
    execSync(command, { 
        stdio: 'inherit',
        cwd: process.cwd()
    });
    console.log('\n✅ Client edit QA tests completed successfully!');
} catch (error) {
    console.error('\n❌ Client edit QA tests failed!');
    process.exit(1);
}

console.log('\n📖 Usage Examples:');
console.log('  node scripts/run-client-edit-qa-tests.js                    # Run all QA edit tests');
console.log('  node scripts/run-client-edit-qa-tests.js --headed           # Run with headed browser');
console.log('  node scripts/run-client-edit-qa-tests.js --debug            # Run in debug mode');
console.log('  node scripts/run-client-edit-qa-tests.js -g="Debug"         # Run specific test');
console.log('  node scripts/run-client-edit-qa-tests.js --reporter=list    # Use list reporter');
