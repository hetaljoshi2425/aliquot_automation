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
    log('\n🚀 Enhanced Client Edit Test Runner v2.0', 'bright');
    log('==========================================\n', 'bright');
    log('📅 Updated: August 16, 2024', 'cyan');
    log('🔧 Enhanced with better reporting, validation, and error handling\n', 'cyan');
}

function showHelp() {
    log('\nEnhanced Client Edit Test Runner', 'bright');
    log('================================\n', 'bright');
    
    log('Usage:', 'yellow');
    log('  node scripts/run-client-edit-tests-enhanced.js [options]\n', 'cyan');
    
    log('Test Options:', 'yellow');
    log('  --all                    Run all client edit tests', 'cyan');
    log('  --full                   Run full client edit test only', 'cyan');
    log('  --minimal                Run minimal client edit test only', 'cyan');
    log('  --validation             Run form validation test only', 'cyan');
    log('  --persistence            Run data persistence test only', 'cyan');
    log('  --grep="pattern"         Run tests matching specific pattern', 'cyan');
    
    log('\nExecution Options:', 'yellow');
    log('  --headed                 Run tests with headed browser', 'cyan');
    log('  --debug                  Run tests in debug mode', 'cyan');
    log('  --workers=N              Set number of workers (default: 1)', 'cyan');
    log('  --timeout=N              Set test timeout in milliseconds', 'cyan');
    log('  --retries=N              Number of retries for failed tests', 'cyan');
    
    log('\nReporting Options:', 'yellow');
    log('  --reporter=html          Generate HTML report', 'cyan');
    log('  --reporter=allure        Generate Allure report', 'cyan');
    log('  --reporter=json          Generate JSON report', 'cyan');
    log('  --reporter=multiple      Generate multiple report formats', 'cyan');
    log('  --output=path            Set output directory for reports', 'cyan');
    
    log('\nEnvironment Options:', 'yellow');
    log('  --env=staging            Use staging environment', 'cyan');
    log('  --env=production         Use production environment', 'cyan');
    log('  --env=local              Use local environment (default)', 'cyan');
    
    log('\nExamples:', 'yellow');
    log('  node scripts/run-client-edit-tests-enhanced.js --all --headed', 'cyan');
    log('  node scripts/run-client-edit-tests-enhanced.js --full --reporter=html', 'cyan');
    log('  node scripts/run-client-edit-tests-enhanced.js --validation --debug', 'cyan');
    log('  node scripts/run-client-edit-tests-enhanced.js -g "Edit client with all fields"', 'cyan');
    log('  node scripts/run-client-edit-tests-enhanced.js --all --env=staging --reporter=multiple', 'cyan');
    
    log('\nTest Descriptions:', 'yellow');
    log('  full:        Tests complete client editing with all fields', 'cyan');
    log('  minimal:     Tests client editing with minimal fields only', 'cyan');
    log('  validation:  Tests form validation for required fields', 'cyan');
    log('  persistence: Tests that edited client data persists', 'cyan');
}

function validateEnvironment() {
    const packageJsonPath = path.join(__dirname, '..', 'package.json');
    if (!fs.existsSync(packageJsonPath)) {
        log('❌ Error: package.json not found. Please run this script from the project root directory.', 'red');
        process.exit(1);
    }
    
    const testFile = path.join(__dirname, '..', 'tests', 'client_edit.spec.js');
    if (!fs.existsSync(testFile)) {
        log('❌ Error: client_edit.spec.js test file not found!', 'red');
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
        headed: args.includes('--headed') || args.includes('-h'),
        debug: args.includes('--debug') || args.includes('-d'),
        workers: 1,
        timeout: 60000,
        retries: 0,
        reporter: 'list',
        output: 'test-results',
        environment: 'local',
        testType: null,
        grep: null
    };
    
    // Parse workers
    const workersArg = args.find(arg => arg.startsWith('--workers=') || arg.startsWith('-w='));
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
    const reporterArg = args.find(arg => arg.startsWith('--reporter=') || arg.startsWith('-r='));
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
    
    // Parse grep filter
    const grepArg = args.find(arg => arg.startsWith('--grep=') || arg.startsWith('-g='));
    if (grepArg) {
        options.grep = grepArg.split('=')[1];
    }
    
    // Determine test type
    const testMap = {
        '--full': 'Edit client with all fields',
        '--minimal': 'Edit client with minimal fields only',
        '--validation': 'Edit client validation - required fields',
        '--persistence': 'Edit client and verify data persistence'
    };
    
    for (const [flag, testName] of Object.entries(testMap)) {
        if (args.includes(flag)) {
            options.testType = testName;
            break;
        }
    }
    
    if (args.includes('--all')) {
        options.testType = 'all';
    }
    
    return { args, options };
}

function buildCommand(options) {
    let command = 'npx playwright test';
    const testFile = 'tests/client_edit.spec.js';
    
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
    
    // Add test filter if specific test type
    if (options.testType && options.testType !== 'all') {
        command += ` --grep "${options.testType}"`;
    }
    
    // Add grep filter if specified
    if (options.grep) {
        command += ` --grep "${options.grep}"`;
    }
    
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
        
        log(`\n✅ Client edit tests completed successfully in ${duration}s!`, 'green');
        log(`📊 Results available in: ${options.output}`, 'cyan');
        log(`📸 Check the ${options.output}/ directory for screenshots`, 'cyan');
        
        // Generate additional reports if needed
        if (options.reporter === 'multiple' || options.reporter === 'allure') {
            generateAllureReport();
        }
        
        return true;
        
    } catch (error) {
        const endTime = Date.now();
        const duration = ((endTime - startTime) / 1000).toFixed(2);
        
        log(`\n❌ Client edit tests failed after ${duration}s!`, 'red');
        log('💡 Tips for debugging:', 'yellow');
        log('   - Run with --headed to see the browser', 'cyan');
        log('   - Run with --debug to pause on failures', 'cyan');
        log('   - Check test-results/ for screenshots and traces', 'cyan');
        log('   - Verify your environment variables are set correctly', 'cyan');
        log('   - Try running with --workers=1 for sequential execution', 'cyan');
        log('   - Check if client data exists for editing', 'cyan');
        
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
    
    log(`🔧 Test Type: ${options.testType || 'All tests'}`, 'cyan');
    log(`🌍 Environment: ${options.environment}`, 'cyan');
    log(`👥 Workers: ${options.workers}`, 'cyan');
    log(`⏱️  Timeout: ${options.timeout}ms`, 'cyan');
    log(`🔄 Retries: ${options.retries}`, 'cyan');
    log(`📊 Reporter: ${options.reporter}`, 'cyan');
    log(`📁 Output: ${options.output}`, 'cyan');
    log(`🖥️  Browser: ${options.headed ? 'Headed' : 'Headless'}`, 'cyan');
    log(`🐛 Debug: ${options.debug ? 'Enabled' : 'Disabled'}`, 'cyan');
    if (options.grep) {
        log(`🎯 Grep Filter: "${options.grep}"`, 'cyan');
    }
}

function showAvailableScenarios() {
    log('\n📚 Available test scenarios:', 'bright');
    log('============================\n', 'bright');
    log('   1. Edit client with all fields', 'cyan');
    log('   2. Edit client with minimal fields only', 'cyan');
    log('   3. Edit client and verify data persistence', 'cyan');
    log('   4. Edit client validation - required fields', 'cyan');
    log('   5. Edit client with specific data updates', 'cyan');
    log('   6. Edit client and verify UI updates', 'cyan');
}

function main() {
    showBanner();
    
    const { args, options } = parseArguments();
    
    if (args.includes('--help') || args.length === 0) {
        showHelp();
        showAvailableScenarios();
        return;
    }
    
    validateEnvironment();
    
    if (!options.testType && !options.grep) {
        log('\n❌ No valid test option specified!', 'red');
        showHelp();
        showAvailableScenarios();
        process.exit(1);
    }
    
    showTestSummary(options);
    ensureOutputDirectory(options.output);
    
    const command = buildCommand(options);
    const success = runTest(command, options);
    
    if (!success) {
        process.exit(1);
    }
    
    log('\n🎉 Enhanced client edit tests execution completed!', 'bright');
    log('📚 For more information, run: node scripts/run-client-edit-tests-enhanced.js --help', 'cyan');
}

// Run the script
main();
