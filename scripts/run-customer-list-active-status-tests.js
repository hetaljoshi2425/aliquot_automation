#!/usr/bin/env node

const { execSync } = require('child_process');
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
    log('\n📋 Customer List Active Status Test Runner', 'bright');
    log('===========================================\n', 'bright');
    log('🎯 Test: Active Customers are displayed as a Table', 'cyan');
    log('📅 Created: August 16, 2024', 'cyan');
    log('🔧 Purpose: Verify customer list displays active customers in table format\n', 'cyan');
}

function showHelp() {
    log('\nCustomer List Active Status Test Runner', 'bright');
    log('========================================\n', 'bright');

    log('Usage:', 'yellow');
    log('  node scripts/run-customer-list-active-status-tests.js [options]\n', 'cyan');

    log('Execution Options:', 'yellow');
    log('  --headed                  Run tests with headed browser', 'cyan');
    log('  --debug                   Run tests in debug mode', 'cyan');
    log('  --workers=N               Set number of workers (default: 1)', 'cyan');
    log('  --timeout=N               Set test timeout in milliseconds', 'cyan');
    log('  --retries=N               Number of retries for failed tests', 'cyan');

    log('\nReporting Options:', 'yellow');
    log('  --reporter=html           Generate HTML report', 'cyan');
    log('  --reporter=allure         Generate Allure report', 'cyan');
    log('  --reporter=json           Generate JSON report', 'cyan');
    log('  --reporter=multiple       Generate multiple report formats', 'cyan');
    log('  --output=path             Set output directory for reports', 'cyan');

    log('\nEnvironment Options:', 'yellow');
    log('  --env=staging             Use staging environment', 'cyan');
    log('  --env=production          Use production environment', 'cyan');
    log('  --env=local               Use local environment (default)', 'cyan');

    log('\nExamples:', 'yellow');
    log('  node scripts/run-customer-list-active-status-tests.js --headed', 'cyan');
    log('  node scripts/run-customer-list-active-status-tests.js --reporter=html', 'cyan');
    log('  node scripts/run-customer-list-active-status-tests.js --debug --timeout=120000', 'cyan');
    log('  node scripts/run-customer-list-active-status-tests.js --env=staging --reporter=multiple', 'cyan');

    log('\nTest Description:', 'yellow');
    log('  This test verifies that the Customer List displays active customers in a proper table format.', 'cyan');
    log('  It checks for:', 'cyan');
    log('    - Customer list table visibility', 'cyan');
    log('    - Table structure and headers', 'cyan');
    log('    - Active customer data presence', 'cyan');
    log('    - Table formatting and layout', 'cyan');
}

function validateEnvironment() {
    const packageJsonPath = path.join(__dirname, '..', 'package.json');
    if (!fs.existsSync(packageJsonPath)) {
        log('❌ Error: package.json not found. Please run this script from the project root directory.', 'red');
        process.exit(1);
    }

    const testFile = path.join(__dirname, '..', 'tests', 'customer_list_active_status.spec.js');
    if (!fs.existsSync(testFile)) {
        log('❌ Error: customer_list_active_status.spec.js test file not found!', 'red');
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
        workers: 1,
        timeout: 60000,
        retries: 0,
        reporter: 'list',
        output: 'test-results',
        environment: 'local'
    };

    // Parse workers
    const workersArg = args.find(arg => arg.startsWith('--workers='));
    if (workersArg) {
        options.workers = parseInt(workersArg.split('=')[1]) || 1;
    }

    // Parse timeout
    const timeoutArg = args.find(arg => arg.startsWith('--timeout='));
    if (timeoutArg) {
        options.timeout = parseInt(timeoutArg.split('=')[1]) || 60000;
    }

    // Parse retries
    const retriesArg = args.find(arg => arg.startsWith('--retries='));
    if (retriesArg) {
        options.retries = parseInt(retriesArg.split('=')[1]) || 0;
    }

    // Parse reporter
    const reporterArg = args.find(arg => arg.startsWith('--reporter='));
    if (reporterArg) {
        options.reporter = reporterArg.split('=')[1];
    }

    // Parse output directory
    const outputArg = args.find(arg => arg.startsWith('--output='));
    if (outputArg) {
        options.output = outputArg.split('=')[1];
    }

    // Parse environment
    const envArg = args.find(arg => arg.startsWith('--env='));
    if (envArg) {
        options.environment = envArg.split('=')[1];
    }

    return { args, options };
}

function buildCommand(options) {
    let command = 'npx playwright test';
    const testFile = 'tests/customer_list_active_status.spec.js';

    // Add test file
    command += ` ${testFile}`;

    // Add execution options
    if (options.headed) {
        command += ' --headed';
    }

    if (options.debug) {
        command += ' --debug';
    }

    command += ` --workers=${options.workers}`;

    if (options.timeout) {
        command += ` --timeout=${options.timeout}`;
    }

    if (options.retries > 0) {
        command += ` --retries=${options.retries}`;
    }

    // Add reporter options
    if (options.reporter === 'multiple') {
        command += ' --reporter=html,allure-playwright,json';
    } else {
        command += ` --reporter=${options.reporter}`;
    }

    // Add output directory
    command += ` --output=${options.output}`;

    return command;
}

function ensureOutputDirectory(outputDir) {
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
        log(`📁 Created output directory: ${outputDir}`, 'green');
    }
}

function runTest(command, options) {
    log(`\n🔧 Running command: ${command}`, 'blue');
    log('='.repeat(60), 'blue');

    const startTime = Date.now();

    try {
        // Set environment variables
        const env = {
            ...process.env,
            FORCE_COLOR: '1',
            NODE_ENV: options.environment,
            PLAYWRIGHT_TIMEOUT: options.timeout.toString()
        };

        execSync(command, {
            stdio: 'inherit',
            env: env
        });

        const endTime = Date.now();
        const duration = ((endTime - startTime) / 1000).toFixed(2);

        log(`\n✅ Customer List Active Status test completed successfully in ${duration}s!`, 'green');
        log(`📊 Results available in: ${options.output}`, 'cyan');

        // Generate additional reports if needed
        if (options.reporter === 'multiple' || options.reporter === 'allure') {
            generateAllureReport();
        }

        return true;

    } catch (error) {
        const endTime = Date.now();
        const duration = ((endTime - startTime) / 1000).toFixed(2);

        log(`\n❌ Customer List Active Status test failed after ${duration}s!`, 'red');
        log('💡 Tips for debugging:', 'yellow');
        log('   - Run with --headed to see the browser', 'cyan');
        log('   - Run with --debug to pause on failures', 'cyan');
        log('   - Check test-results/ for screenshots and traces', 'cyan');
        log('   - Verify your environment variables are set correctly', 'cyan');
        log('   - Ensure there are existing clients and customers in the system', 'cyan');
        log('   - Check if the customer list table is properly loaded', 'cyan');

        return false;
    }
}

function generateAllureReport() {
    log('\n📈 Generating Allure report...', 'blue');
    try {
        if (fs.existsSync('allure-results')) {
            execSync('npx allure generate allure-results --clean', {
                stdio: 'inherit'
            });
            log('✅ Allure report generated successfully!', 'green');
            log('🌐 To view the report, run: npx allure open', 'cyan');
        } else {
            log('⚠️  No allure-results directory found, skipping Allure report generation', 'yellow');
        }
    } catch (error) {
        log('⚠️  Could not generate Allure report:', 'yellow');
        log(`   ${error.message}`, 'red');
    }
}

function showTestSummary(options) {
    log('\n📋 Test Configuration Summary', 'bright');
    log('=============================\n', 'bright');

    log('🎯 Test: Customer List Active Status', 'cyan');
    log('📄 Test File: tests/customer_list_active_status.spec.js', 'cyan');
    log('🌍 Environment: ' + options.environment, 'cyan');
    log('⚡ Execution: Sequential', 'cyan');
    log('👥 Workers: ' + options.workers, 'cyan');
    log('⏱️  Timeout: ' + options.timeout + 'ms', 'cyan');
    log('🔄 Retries: ' + options.retries, 'cyan');
    log('📊 Reporter: ' + options.reporter, 'cyan');
    log('📁 Output: ' + options.output, 'cyan');
    log('🖥️  Browser: ' + (options.headed ? 'Headed' : 'Headless'), 'cyan');
    log('🐛 Debug: ' + (options.debug ? 'Enabled' : 'Disabled'), 'cyan');
}

function showTestDetails() {
    log('\n📊 Test Details', 'bright');
    log('===============\n', 'bright');

    log('🎯 Test Objective:', 'yellow');
    log('   Verify that active customers are displayed as a table in the Customer List', 'cyan');

    log('\n🔍 Test Steps:', 'yellow');
    log('   1. Navigate to Aliquot QA and login', 'cyan');
    log('   2. Navigate to Site Management', 'cyan');
    log('   3. Select an existing client', 'cyan');
    log('   4. Navigate to Customers section', 'cyan');
    log('   5. Click on Customer Lists', 'cyan');
    log('   6. Verify Customer List table is displayed', 'cyan');
    log('   7. Verify table structure and headers', 'cyan');
    log('   8. Check for active customers in the table', 'cyan');
    log('   9. Verify active status indicators', 'cyan');
    log('   10. Verify table data structure', 'cyan');
    log('   11. Verify table formatting', 'cyan');

    log('\n✅ Expected Results:', 'yellow');
    log('   - Customer List table is visible', 'cyan');
    log('   - Table has proper structure with headers', 'cyan');
    log('   - Active customers are displayed in table format', 'cyan');
    log('   - Table is properly formatted', 'cyan');
}

function main() {
    showBanner();

    const { args, options } = parseArguments();

    if (args.includes('--help') || args.length === 0) {
        showHelp();
        showTestDetails();
        return;
    }

    validateEnvironment();
    showTestSummary(options);
    ensureOutputDirectory(options.output);

    const command = buildCommand(options);
    const success = runTest(command, options);

    if (!success) {
        process.exit(1);
    }

    log('\n🎉 Customer List Active Status test execution completed!', 'bright');
    log('📚 For more information, run: node scripts/run-customer-list-active-status-tests.js --help', 'cyan');
}

// Run the script
main();

