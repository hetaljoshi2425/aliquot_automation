#!/usr/bin/env node

const { execSync, spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// Enhanced colors for console output
const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    white: '\x1b[37m'
};

function log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
}

function showBanner() {
    log('\n🚀 Enhanced Customer Test Suite Runner v2.0', 'bright');
    log('=============================================\n', 'bright');
    log('📅 Updated: August 16, 2024', 'cyan');
    log('🔧 Comprehensive customer management testing suite\n', 'cyan');
}

function showHelp() {
    log('\nEnhanced Customer Test Suite Runner', 'bright');
    log('===================================\n', 'bright');
    
    log('Usage:', 'yellow');
    log('  node scripts/run-customer-tests-enhanced.js [options]\n', 'cyan');
    
    log('Test Categories:', 'yellow');
    log('  --all                    Run all customer tests', 'cyan');
    log('  --create                 Run customer creation tests', 'cyan');
    log('  --edit                   Run customer edit tests', 'cyan');
    log('  --delete                 Run customer delete tests', 'cyan');
    log('  --list                   Run customer list tests', 'cyan');
    log('  --details                Run customer details page tests', 'cyan');
    log('  --pagination             Run customer pagination tests', 'cyan');
    log('  --status                 Run customer status filter tests', 'cyan');
    log('  --clone                  Run customer clone tests', 'cyan');
    log('  --validation             Run customer form validation tests', 'cyan');
    log('  --smoke                  Run smoke tests (quick validation)', 'cyan');
    log('  --regression             Run regression tests (full lifecycle)', 'cyan');
    
    log('\nSpecific Test Options:', 'yellow');
    log('  --test=create-basic      Run basic customer creation test', 'cyan');
    log('  --test=create-complete   Run complete customer creation test', 'cyan');
    log('  --test=create-recorded   Run recorded customer creation test', 'cyan');
    log('  --test=edit-phone        Run customer phone edit test', 'cyan');
    log('  --test=edit-complete     Run complete customer edit test', 'cyan');
    log('  --test=delete-simple     Run simple customer delete test', 'cyan');
    log('  --test=delete-correct    Run correct customer delete test', 'cyan');
    log('  --test=delete-complete   Run complete customer delete test', 'cyan');
    log('  --test=list-basic        Run basic customer list test', 'cyan');
    log('  --test=list-comprehensive Run comprehensive customer list test', 'cyan');
    log('  --test=list-active       Run customer active status test', 'cyan');
    log('  --test=details-page      Run customer details page test', 'cyan');
    log('  --test=pagination-count  Run customer pagination count test', 'cyan');
    log('  --test=clone-recorded    Run recorded customer clone test', 'cyan');
    
    log('\nExecution Options:', 'yellow');
    log('  --headed                 Run tests with headed browser', 'cyan');
    log('  --debug                  Run tests in debug mode', 'cyan');
    log('  --parallel               Run tests in parallel', 'cyan');
    log('  --workers=N              Set number of workers (default: 1)', 'cyan');
    log('  --timeout=N              Set test timeout in milliseconds', 'cyan');
    log('  --retries=N              Number of retries for failed tests', 'cyan');
    log('  --continue-on-failure    Continue running tests even if some fail', 'cyan');
    log('  --stop-on-failure        Stop execution on first failure', 'cyan');
    
    log('\nReporting Options:', 'yellow');
    log('  --reporter=html          Generate HTML report', 'cyan');
    log('  --reporter=allure        Generate Allure report', 'cyan');
    log('  --reporter=json          Generate JSON report', 'cyan');
    log('  --reporter=multiple      Generate multiple report formats', 'cyan');
    log('  --output=path            Set output directory for reports', 'cyan');
    log('  --merge-reports          Merge reports from multiple test runs', 'cyan');
    
    log('\nEnvironment Options:', 'yellow');
    log('  --env=staging            Use staging environment', 'cyan');
    log('  --env=production         Use production environment', 'cyan');
    log('  --env=local              Use local environment (default)', 'cyan');
    
    log('\nFiltering Options:', 'yellow');
    log('  --grep="pattern"         Run tests matching specific pattern', 'cyan');
    log('  --grep-invert="pattern"  Run tests NOT matching pattern', 'cyan');
    
    log('\nExamples:', 'yellow');
    log('  node scripts/run-customer-tests-enhanced.js --all --headed', 'cyan');
    log('  node scripts/run-customer-tests-enhanced.js --create --edit --parallel', 'cyan');
    log('  node scripts/run-customer-tests-enhanced.js --test=create-basic --debug', 'cyan');
    log('  node scripts/run-customer-tests-enhanced.js --smoke --reporter=html', 'cyan');
    log('  node scripts/run-customer-tests-enhanced.js --regression --env=staging', 'cyan');
    
    log('\nTest Descriptions:', 'yellow');
    log('  create-basic:      Tests basic customer creation with minimal fields', 'cyan');
    log('  create-complete:   Tests complete customer creation with all fields', 'cyan');
    log('  create-recorded:   Tests recorded customer creation workflow', 'cyan');
    log('  edit-phone:        Tests customer phone number editing', 'cyan');
    log('  edit-complete:     Tests complete customer editing workflow', 'cyan');
    log('  delete-simple:     Tests simple customer deletion', 'cyan');
    log('  delete-correct:    Tests correct customer deletion workflow', 'cyan');
    log('  delete-complete:   Tests complete customer deletion with confirmation', 'cyan');
    log('  list-basic:        Tests basic customer list display', 'cyan');
    log('  list-comprehensive: Tests comprehensive customer list functionality', 'cyan');
    log('  list-active:       Tests customer active status filtering', 'cyan');
    log('  details-page:      Tests customer details page navigation', 'cyan');
    log('  pagination-count:  Tests customer list pagination', 'cyan');
    log('  clone-recorded:    Tests recorded customer cloning workflow', 'cyan');
}

function validateEnvironment() {
    const packageJsonPath = path.join(__dirname, '..', 'package.json');
    if (!fs.existsSync(packageJsonPath)) {
        log('❌ Error: package.json not found. Please run this script from the project root directory.', 'red');
        process.exit(1);
    }
    
    const envPath = path.join(__dirname, '..', '.env');
    if (!fs.existsSync(envPath)) {
        log('⚠️  Warning: .env file not found. Some tests may fail without proper configuration.', 'yellow');
        log('💡 Run: npm run setup', 'cyan');
    }
}

function parseArguments() {
    const args = process.argv.slice(2);
    const options = {
        headed: args.includes('--headed'),
        debug: args.includes('--debug'),
        parallel: args.includes('--parallel'),
        workers: 1,
        timeout: 120000,
        retries: 0,
        continueOnFailure: args.includes('--continue-on-failure'),
        stopOnFailure: args.includes('--stop-on-failure'),
        reporter: 'html',
        output: 'test-results',
        env: 'local',
        grep: null,
        grepInvert: null,
        tests: []
    };

    // Parse specific options
    for (const arg of args) {
        if (arg.startsWith('--workers=')) {
            options.workers = parseInt(arg.split('=')[1]) || 1;
        } else if (arg.startsWith('--timeout=')) {
            options.timeout = parseInt(arg.split('=')[1]) || 120000;
        } else if (arg.startsWith('--retries=')) {
            options.retries = parseInt(arg.split('=')[1]) || 0;
        } else if (arg.startsWith('--reporter=')) {
            options.reporter = arg.split('=')[1];
        } else if (arg.startsWith('--output=')) {
            options.output = arg.split('=')[1];
        } else if (arg.startsWith('--env=')) {
            options.env = arg.split('=')[1];
        } else if (arg.startsWith('--grep=')) {
            options.grep = arg.split('=')[1];
        } else if (arg.startsWith('--grep-invert=')) {
            options.grepInvert = arg.split('=')[1];
        } else if (arg.startsWith('--test=')) {
            options.tests.push(arg.split('=')[1]);
        }
    }

    // Parse test categories
    if (args.includes('--all')) {
        options.testCategories = ['all'];
    } else {
        options.testCategories = [];
        if (args.includes('--create')) options.testCategories.push('create');
        if (args.includes('--edit')) options.testCategories.push('edit');
        if (args.includes('--delete')) options.testCategories.push('delete');
        if (args.includes('--list')) options.testCategories.push('list');
        if (args.includes('--details')) options.testCategories.push('details');
        if (args.includes('--pagination')) options.testCategories.push('pagination');
        if (args.includes('--status')) options.testCategories.push('status');
        if (args.includes('--clone')) options.testCategories.push('clone');
        if (args.includes('--validation')) options.testCategories.push('validation');
        if (args.includes('--smoke')) options.testCategories.push('smoke');
        if (args.includes('--regression')) options.testCategories.push('regression');
    }

    return options;
}

function getTestFiles(categories, specificTests) {
    const testMap = {
        'create': [
            'tests/customer-create.spec.js',
            'tests/customer-create-recorded.spec.js'
        ],
        'edit': [
            'tests/customer-edit-phone.spec.js',
            'tests/edit_customer.spec.js'
        ],
        'delete': [
            'tests/customer-delete.spec.js',
            'tests/customer-delete-simple.spec.js',
            'tests/customer-delete-correct.spec.js',
            'tests/delete_customer.spec.js'
        ],
        'list': [
            'tests/customers-basic.spec.js',
            'tests/customers-comprehensive.spec.js',
            'tests/Customerslist.spec.js',
            'tests/customer-list-direct.spec.js'
        ],
        'details': [
            'tests/customer-details-page.spec.js',
            'tests/customer-details-recorded.spec.js'
        ],
        'pagination': [
            'tests/customer-pagination-count.spec.js',
            'tests/customer-pagination-mock.spec.js'
        ],
        'status': [
            'tests/customer-active-status.spec.js',
            'tests/customer-active-radio-test.spec.js',
            'tests/customer-inactive-radio-test.spec.js'
        ],
        'clone': [
            'tests/customer-clone-recorded.spec.js'
        ],
        'validation': [
            'tests/customer-create.spec.js',
            'tests/customer-edit-phone.spec.js'
        ],
        'smoke': [
            'tests/customers-basic.spec.js',
            'tests/customer-create.spec.js',
            'tests/customer-list-direct.spec.js'
        ],
        'regression': [
            'tests/customers-comprehensive.spec.js',
            'tests/customer-create.spec.js',
            'tests/customer-edit-phone.spec.js',
            'tests/customer-delete.spec.js',
            'tests/customer-details-page.spec.js',
            'tests/customer-pagination-count.spec.js'
        ]
    };

    const specificTestMap = {
        'create-basic': 'tests/customer-create.spec.js',
        'create-complete': 'tests/customer-create.spec.js',
        'create-recorded': 'tests/customer-create-recorded.spec.js',
        'edit-phone': 'tests/customer-edit-phone.spec.js',
        'edit-complete': 'tests/edit_customer.spec.js',
        'delete-simple': 'tests/customer-delete-simple.spec.js',
        'delete-correct': 'tests/customer-delete-correct.spec.js',
        'delete-complete': 'tests/customer-delete.spec.js',
        'list-basic': 'tests/customers-basic.spec.js',
        'list-comprehensive': 'tests/customers-comprehensive.spec.js',
        'list-active': 'tests/customer-active-status.spec.js',
        'details-page': 'tests/customer-details-page.spec.js',
        'pagination-count': 'tests/customer-pagination-count.spec.js',
        'clone-recorded': 'tests/customer-clone-recorded.spec.js'
    };

    let testFiles = [];

    // Add specific tests
    if (specificTests.length > 0) {
        for (const test of specificTests) {
            if (specificTestMap[test]) {
                testFiles.push(specificTestMap[test]);
            } else {
                log(`⚠️  Warning: Unknown specific test "${test}"`, 'yellow');
            }
        }
    }

    // Add category tests
    if (categories.includes('all')) {
        Object.values(testMap).forEach(files => testFiles.push(...files));
    } else {
        for (const category of categories) {
            if (testMap[category]) {
                testFiles.push(...testMap[category]);
            }
        }
    }

    // Remove duplicates
    testFiles = [...new Set(testFiles)];

    // Filter out non-existent files
    const existingFiles = testFiles.filter(file => {
        const filePath = path.join(__dirname, '..', file);
        const exists = fs.existsSync(filePath);
        if (!exists) {
            log(`⚠️  Warning: Test file not found: ${file}`, 'yellow');
        }
        return exists;
    });

    return existingFiles;
}

function buildPlaywrightCommand(options, testFiles) {
    let command = 'npx playwright test';

    // Add test files
    if (testFiles.length > 0) {
        command += ` ${testFiles.join(' ')}`;
    }

    // Add options
    if (options.headed) command += ' --headed';
    if (options.debug) command += ' --debug';
    if (options.parallel) command += ' --workers=' + options.workers;
    if (options.timeout) command += ` --timeout=${options.timeout}`;
    if (options.retries > 0) command += ` --retries=${options.retries}`;
    if (options.continueOnFailure) command += ' --reporter=list';
    if (options.stopOnFailure) command += ' --reporter=line';

    // Add reporter
    switch (options.reporter) {
        case 'html':
            command += ' --reporter=html';
            break;
        case 'allure':
            command += ' --reporter=allure';
            break;
        case 'json':
            command += ' --reporter=json';
            break;
        case 'multiple':
            command += ' --reporter=html,json,allure';
            break;
    }

    // Add output directory
    if (options.output) {
        command += ` --output=${options.output}`;
    }

    // Add grep filters
    if (options.grep) {
        command += ` --grep="${options.grep}"`;
    }
    if (options.grepInvert) {
        command += ` --grep-invert="${options.grepInvert}"`;
    }

    return command;
}

function runTests(command, options) {
    log(`\n🚀 Running customer tests with command:`, 'bright');
    log(`   ${command}\n`, 'cyan');

    const startTime = Date.now();

    try {
        execSync(command, { 
            stdio: 'inherit',
            cwd: path.join(__dirname, '..'),
            env: {
                ...process.env,
                PLAYWRIGHT_TEST_TIMEOUT: options.timeout.toString(),
                PLAYWRIGHT_TEST_RETRIES: options.retries.toString()
            }
        });

        const duration = Math.round((Date.now() - startTime) / 1000);
        log(`\n✅ Customer tests completed successfully in ${duration}s!`, 'green');
        
        if (options.reporter === 'html' || options.reporter === 'multiple') {
            log(`📊 HTML report available at: ${options.output}/playwright-report/index.html`, 'cyan');
        }
        
        return true;
    } catch (error) {
        const duration = Math.round((Date.now() - startTime) / 1000);
        log(`\n❌ Customer tests failed after ${duration}s!`, 'red');
        
        if (error.status === 1) {
            log('   Some tests failed. Check the output above for details.', 'yellow');
        } else {
            log(`   Error: ${error.message}`, 'red');
        }
        
        return false;
    }
}

function showTestSummary(testFiles, options) {
    log('\n📋 Test Summary:', 'bright');
    log('===============\n', 'bright');
    
    log(`🎯 Test Categories: ${options.testCategories.join(', ') || 'None specified'}`, 'cyan');
    log(`📄 Test Files: ${testFiles.length}`, 'cyan');
    log(`🔧 Execution Mode: ${options.parallel ? 'Parallel' : 'Sequential'}`, 'cyan');
    log(`👥 Workers: ${options.workers}`, 'cyan');
    log(`⏱️  Timeout: ${options.timeout}ms`, 'cyan');
    log(`🔄 Retries: ${options.retries}`, 'cyan');
    log(`📊 Reporter: ${options.reporter}`, 'cyan');
    log(`🌍 Environment: ${options.env}`, 'cyan');
    
    if (testFiles.length > 0) {
        log('\n📁 Test Files to Run:', 'yellow');
        testFiles.forEach((file, index) => {
            log(`   ${index + 1}. ${file}`, 'cyan');
        });
    }
    
    log('\n' + '='.repeat(50), 'bright');
}

function main() {
    showBanner();
    
    // Check for help flag
    if (process.argv.includes('--help') || process.argv.includes('-h')) {
        showHelp();
        return;
    }
    
    validateEnvironment();
    
    const options = parseArguments();
    
    // If no test categories or specific tests specified, show help
    if (options.testCategories.length === 0 && options.tests.length === 0) {
        log('❌ Error: No test categories or specific tests specified.', 'red');
        log('💡 Use --help to see available options.', 'cyan');
        process.exit(1);
    }
    
    const testFiles = getTestFiles(options.testCategories, options.tests);
    
    if (testFiles.length === 0) {
        log('❌ Error: No valid test files found for the specified options.', 'red');
        log('💡 Use --help to see available test options.', 'cyan');
        process.exit(1);
    }
    
    showTestSummary(testFiles, options);
    
    const command = buildPlaywrightCommand(options, testFiles);
    const success = runTests(command, options);
    
    if (!success && !options.continueOnFailure) {
        process.exit(1);
    }
    
    log('\n🎉 Customer test suite execution completed!', 'bright');
    log('📚 For more information, run: node scripts/run-customer-tests-enhanced.js --help', 'cyan');
}

if (require.main === module) {
    main();
}

module.exports = {
    showBanner,
    showHelp,
    validateEnvironment,
    parseArguments,
    getTestFiles,
    buildPlaywrightCommand,
    runTests,
    showTestSummary
};
