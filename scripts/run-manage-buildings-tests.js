const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('🏢 Starting Manage Buildings Test Suite (AWT Environment)');
console.log('========================================================');

// Configuration
const testFiles = [
    'tests/manage_buildings_recorded.spec.js',
    'tests/manage_buildings_comprehensive.spec.js'
];

const playwrightConfig = 'playwright.config.js';

// Function to run a single test file
function runTestFile(testFile) {
    console.log(`\n🔍 Running test file: ${testFile}`);
    console.log('-------------------------------------');
    
    try {
        // Check if test file exists
        if (!fs.existsSync(testFile)) {
            console.log(`❌ Test file not found: ${testFile}`);
            return false;
        }

        // Run the test using Playwright
        const command = `npx playwright test ${testFile} --config=${playwrightConfig} --reporter=list`;
        console.log(`🚀 Executing: ${command}`);
        
        const result = execSync(command, { 
            stdio: 'inherit',
            cwd: process.cwd(),
            encoding: 'utf8'
        });
        
        console.log(`✅ Test file completed successfully: ${testFile}`);
        return true;
        
    } catch (error) {
        console.log(`❌ Test file failed: ${testFile}`);
        console.log(`Error: ${error.message}`);
        return false;
    }
}

// Function to run all tests
function runAllTests() {
    console.log('🎯 Running all Manage Buildings tests...\n');
    
    let successCount = 0;
    let totalCount = testFiles.length;
    
    for (const testFile of testFiles) {
        const success = runTestFile(testFile);
        if (success) {
            successCount++;
        }
        
        // Add a small delay between tests
        console.log('⏳ Waiting 2 seconds before next test...');
        setTimeout(() => {}, 2000);
    }
    
    // Summary
    console.log('\n📊 Test Summary');
    console.log('===============');
    console.log(`Total tests: ${totalCount}`);
    console.log(`Successful: ${successCount}`);
    console.log(`Failed: ${totalCount - successCount}`);
    
    if (successCount === totalCount) {
        console.log('🎉 All tests passed successfully!');
        process.exit(0);
    } else {
        console.log('⚠️ Some tests failed. Please check the output above.');
        process.exit(1);
    }
}

// Function to run specific test
function runSpecificTest(testName) {
    console.log(`🎯 Running specific test: ${testName}`);
    
    const testFile = testFiles.find(file => file.includes(testName));
    if (!testFile) {
        console.log(`❌ Test not found: ${testName}`);
        console.log(`Available tests: ${testFiles.map(f => path.basename(f, '.spec.js')).join(', ')}`);
        process.exit(1);
    }
    
    const success = runTestFile(testFile);
    if (success) {
        console.log('🎉 Test completed successfully!');
        process.exit(0);
    } else {
        console.log('❌ Test failed!');
        process.exit(1);
    }
}

// Main execution
function main() {
    const args = process.argv.slice(2);
    
    if (args.length === 0) {
        // Run all tests
        runAllTests();
    } else if (args[0] === '--help' || args[0] === '-h') {
        console.log('🏢 Manage Buildings Test Runner (AWT Environment)');
        console.log('================================================');
        console.log('');
        console.log('Usage:');
        console.log('  node scripts/run-manage-buildings-tests.js                    # Run all tests');
        console.log('  node scripts/run-manage-buildings-tests.js recorded           # Run recorded test only');
        console.log('  node scripts/run-manage-buildings-tests.js comprehensive      # Run comprehensive test only');
        console.log('  node scripts/run-manage-buildings-tests.js --help             # Show this help');
        console.log('');
        console.log('Available tests:');
        console.log('  - recorded: Basic recorded workflow test');
        console.log('  - comprehensive: Full comprehensive test suite');
        console.log('');
        process.exit(0);
    } else {
        // Run specific test
        const testName = args[0];
        runSpecificTest(testName);
    }
}

// Error handling
process.on('uncaughtException', (error) => {
    console.log('❌ Uncaught Exception:', error.message);
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    console.log('❌ Unhandled Rejection at:', promise, 'reason:', reason);
    process.exit(1);
});

// Run the main function
main();
