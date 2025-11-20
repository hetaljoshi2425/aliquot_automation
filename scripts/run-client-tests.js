#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');

// Colors for console output
const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
}

function showHelp() {
    log('\nClient Creation Test Runner', 'bright');
    log('==========================\n', 'bright');
    
    log('Usage:', 'yellow');
    log('  node scripts/run-client-tests.js [options]\n', 'cyan');
    
    log('Options:', 'yellow');
    log('  --all                    Run all client creation tests', 'cyan');
    log('  --full                   Run full client creation test only', 'cyan');
    log('  --minimal                Run minimal client creation test only', 'cyan');
    log('  --validation             Run form validation test only', 'cyan');
    log('  --persistence            Run data persistence test only', 'cyan');
    log('  --headed                 Run tests with headed browser', 'cyan');
    log('  --debug                  Run tests in debug mode', 'cyan');
    log('  --help                   Show this help message', 'cyan');
    
    log('\nExamples:', 'yellow');
    log('  node scripts/run-client-tests.js --all', 'cyan');
    log('  node scripts/run-client-tests.js --full --headed', 'cyan');
    log('  node scripts/run-client-tests.js --validation --debug', 'cyan');
    
    log('\nTest Descriptions:', 'yellow');
    log('  full:        Tests complete client creation with all fields', 'cyan');
    log('  minimal:     Tests client creation with only required fields', 'cyan');
    log('  validation:  Tests form validation for required fields', 'cyan');
    log('  persistence: Tests that created client data persists', 'cyan');
}

function runTest(testName, options = {}) {
    const testFile = path.join(__dirname, '..', 'tests', 'create_client.spec.js');
    let command = 'npx playwright test --workers=1';
    
    if (options.headed) {
        command = 'npm run testhead';
    }
    
    if (testName) {
        command += ` ${testFile} --grep "${testName}"`;
    } else {
        command += ` ${testFile}`;
    }
    
    if (options.debug) {
        command += ' --debug';
    }
    
    log(`\nRunning command: ${command}`, 'blue');
    log('='.repeat(50), 'blue');
    
    try {
        execSync(command, { stdio: 'inherit' });
        log('\n✅ Test completed successfully!', 'green');
    } catch (error) {
        log('\n❌ Test failed!', 'red');
        process.exit(1);
    }
}

function main() {
    const args = process.argv.slice(2);
    
    if (args.includes('--help') || args.length === 0) {
        showHelp();
        return;
    }
    
    const options = {
        headed: args.includes('--headed'),
        debug: args.includes('--debug')
    };
    
    const testMap = {
        '--full': 'Create new client and verify creation',
        '--minimal': 'Create client with minimal required fields',
        '--validation': 'Validate client creation form validation',
        '--persistence': 'Create client and verify data persistence'
    };
    
    let testToRun = null;
    
    for (const [flag, testName] of Object.entries(testMap)) {
        if (args.includes(flag)) {
            testToRun = testName;
            break;
        }
    }
    
    if (args.includes('--all')) {
        log('\n🚀 Running all client creation tests...', 'bright');
        runTest(null, options);
    } else if (testToRun) {
        log(`\n🚀 Running test: ${testToRun}`, 'bright');
        runTest(testToRun, options);
    } else {
        log('\n❌ No valid test option specified!', 'red');
        showHelp();
        process.exit(1);
    }
}

// Run the script
main();
