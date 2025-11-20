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
    log('\n🚀 Enhanced Test Suite Runner v2.0', 'bright');
    log('===================================\n', 'bright');
    log('📅 Updated: August 16, 2024', 'cyan');
    log('🔧 Comprehensive test suite with enhanced reporting and execution options\n', 'cyan');
}

function showHelp() {
    log('\nEnhanced Test Suite Runner', 'bright');
    log('==========================\n', 'bright');
    
    log('Usage:', 'yellow');
    log('  node scripts/run-test-suite-enhanced.js [options]\n', 'cyan');
    
    log('Test Categories:', 'yellow');
    log('  --client                  Run all client-related tests (create, edit, delete)', 'cyan');
    log('  --client:create           Run client creation tests only', 'cyan');
    log('  --client:edit             Run client edit tests only', 'cyan');
    log('  --client:delete           Run client delete tests only', 'cyan');
    log('  --customer                Run all customer-related tests', 'cyan');
    log('  --facility                Run all facility-related tests', 'cyan');
    log('  --building                Run all building-related tests', 'cyan');
    log('  --system                  Run all system-related tests', 'cyan');
    log('  --validation              Run all validation tests', 'cyan');
    log('  --performance             Run performance tests', 'cyan');
    log('  --smoke                   Run smoke tests (quick validation)', 'cyan');
    log('  --regression              Run regression tests', 'cyan');
    log('  --all                     Run all tests', 'cyan');
    
    log('\nExecution Options:', 'yellow');
    log('  --headed                  Run tests with headed browser', 'cyan');
    log('  --debug                   Run tests in debug mode', 'cyan');
    log('  --parallel                Run tests in parallel', 'cyan');
    log('  --workers=N               Set number of workers (default: 1)', 'cyan');
    log('  --timeout=N               Set test timeout in milliseconds', 'cyan');
    log('  --retries=N               Number of retries for failed tests', 'cyan');
    log('  --continue-on-failure     Continue running tests even if some fail', 'cyan');
    log('  --stop-on-failure         Stop execution on first failure', 'cyan');
    
    log('\nReporting Options:', 'yellow');
    log('  --reporter=html           Generate HTML report', 'cyan');
    log('  --reporter=allure         Generate Allure report', 'cyan');
    log('  --reporter=json           Generate JSON report', 'cyan');
    log('  --reporter=multiple       Generate multiple report formats', 'cyan');
    log('  --output=path             Set output directory for reports', 'cyan');
    log('  --merge-reports           Merge reports from multiple test runs', 'cyan');
    
    log('\nEnvironment Options:', 'yellow');
    log('  --env=staging             Use staging environment', 'cyan');
    log('  --env=production          Use production environment', 'cyan');
    log('  --env=local               Use local environment (default)', 'cyan');
    
    log('\nFiltering Options:', 'yellow');
    log('  --grep="pattern"          Run tests matching specific pattern', 'cyan');
    log('  --grep-invert="pattern"   Run tests NOT matching pattern', 'cyan');
    log('  --file="filename"         Run specific test file', 'cyan');
    log('  --test-name="name"        Run specific test by name', 'cyan');
    
    log('\nExamples:', 'yellow');
    log('  node scripts/run-test-suite-enhanced.js --client --headed', 'cyan');
    log('  node scripts/run-test-suite-enhanced.js --client:create --reporter=html', 'cyan');
    log('  node scripts/run-test-suite-enhanced.js --smoke --parallel --workers=3', 'cyan');
    log('  node scripts/run-test-suite-enhanced.js --all --env=staging --reporter=multiple', 'cyan');
    log('  node scripts/run-test-suite-enhanced.js --grep="client" --headed --debug', 'cyan');
}

function validateEnvironment() {
    const packageJsonPath = path.join(__dirname, '..', 'package.json');
    if (!fs.existsSync(packageJsonPath)) {
        log('❌ Error: package.json not found. Please run this script from the project root directory.', 'red');
        process.exit(1);
    }
    
    const testsDir = path.join(__dirname, '..', 'tests');
    if (!fs.existsSync(testsDir)) {
        log('❌ Error: tests directory not found!', 'red');
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
        continueOnFailure: args.includes('--continue-on-failure'),
        stopOnFailure: args.includes('--stop-on-failure'),
        mergeReports: args.includes('--merge-reports'),
        workers: 1,
        timeout: 60000,
        retries: 0,
        reporter: 'list',
        output: 'test-results',
        environment: 'local',
        testCategories: [],
        grep: null,
        grepInvert: null,
        file: null,
        testName: null
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
    
    // Parse grep filters
    const grepArg = args.find(arg => arg.startsWith('--grep='));
    if (grepArg) {
        options.grep = grepArg.split('=')[1];
    }
    
    const grepInvertArg = args.find(arg => arg.startsWith('--grep-invert='));
    if (grepInvertArg) {
        options.grepInvert = grepInvertArg.split('=')[1];
    }
    
    // Parse file filter
    const fileArg = args.find(arg => arg.startsWith('--file='));
    if (fileArg) {
        options.file = fileArg.split('=')[1];
    }
    
    // Parse test name filter
    const testNameArg = args.find(arg => arg.startsWith('--test-name='));
    if (testNameArg) {
        options.testName = testNameArg.split('=')[1];
    }
    
    // Parse test categories
    const categoryMap = {
        '--client': ['client_creation_simple.spec.js', 'client_edit.spec.js', 'client_delete.spec.js', 'client_edit_qa.spec.js'],
        '--client:create': ['client_creation_simple.spec.js'],
        '--client:edit': ['client_edit.spec.js', 'client_edit_qa.spec.js'],
        '--client:delete': ['client_delete.spec.js'],
        '--customer': ['create_customer.spec.js', 'edit_customer.spec.js', 'delete_customer.spec.js', 'customer_lists.spec.js'],
        '--facility': ['create_facility.spec.js', 'edit_facility.spec.js', 'delete_facility.spec.js', 'facility_lists.spec.js'],
        '--building': ['create_building.spec.js', 'edit_building.spec.js', 'delete_building.spec.js', 'building_lists.spec.js'],
        '--system': ['create_system.spec.js', 'edit_system.spec.js', 'delete_system.spec.js', 'system_lists.spec.js'],
        '--validation': ['validate_*.spec.js'],
        '--performance': ['performance.spec.js'],
        '--smoke': ['login.spec.js', 'client_creation_simple.spec.js'],
        '--regression': ['*_lists.spec.js', 'validate_*.spec.js'],
        '--all': ['*.spec.js']
    };
    
    for (const [flag, files] of Object.entries(categoryMap)) {
        if (args.includes(flag)) {
            options.testCategories.push(...files);
        }
    }
    
    return { args, options };
}

function getTestFiles(options) {
    const testsDir = path.join(__dirname, '..', 'tests');
    let testFiles = [];
    
    if (options.file) {
        // Run specific file
        const filePath = path.join(testsDir, options.file);
        if (fs.existsSync(filePath)) {
            testFiles.push(options.file);
        } else {
            log(`❌ Test file not found: ${options.file}`, 'red');
            process.exit(1);
        }
    } else if (options.testCategories.length > 0) {
        // Run based on categories
        const allFiles = fs.readdirSync(testsDir).filter(file => file.endsWith('.spec.js'));
        
        for (const category of options.testCategories) {
            if (category.includes('*')) {
                // Handle wildcard patterns
                const pattern = category.replace('*', '.*');
                const regex = new RegExp(pattern);
                const matchingFiles = allFiles.filter(file => regex.test(file));
                testFiles.push(...matchingFiles);
            } else {
                // Handle specific files
                if (allFiles.includes(category)) {
                    testFiles.push(category);
                } else {
                    log(`⚠️  Test file not found: ${category}`, 'yellow');
                }
            }
        }
    } else {
        // Run all tests
        testFiles = fs.readdirSync(testsDir).filter(file => file.endsWith('.spec.js'));
    }
    
    // Remove duplicates
    testFiles = [...new Set(testFiles)];
    
    return testFiles;
}

function buildCommand(testFile, options) {
    let command = 'npx playwright test';
    
    // Add test file
    command += ` tests/${testFile}`;
    
    // Add execution options
    if (options.headed) {
        command += ' --headed';
    }
    
    if (options.debug) {
        command += ' --debug';
    }
    
    if (options.parallel) {
        command += ` --workers=${options.workers}`;
    } else {
        command += ' --workers=1';
    }
    
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
    
    // Add grep filters
    if (options.grep) {
        command += ` --grep "${options.grep}"`;
    }
    
    if (options.grepInvert) {
        command += ` --grep-invert "${options.grepInvert}"`;
    }
    
    // Add test name filter
    if (options.testName) {
        command += ` --grep "${options.testName}"`;
    }
    
    return command;
}

function ensureOutputDirectory(outputDir) {
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
        log(`📁 Created output directory: ${outputDir}`, 'green');
    }
}

function runTestSuite(testFiles, options) {
    const results = {
        total: testFiles.length,
        passed: 0,
        failed: 0,
        skipped: 0,
        duration: 0
    };
    
    const startTime = Date.now();
    
    log(`\n🚀 Running ${testFiles.length} test file(s)...`, 'bright');
    log('='.repeat(60), 'blue');
    
    for (let i = 0; i < testFiles.length; i++) {
        const testFile = testFiles[i];
        log(`\n📄 Running test file ${i + 1}/${testFiles.length}: ${testFile}`, 'blue');
        
        const command = buildCommand(testFile, options);
        log(`🔧 Command: ${command}`, 'cyan');
        
        try {
            const fileStartTime = Date.now();
            
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
            
            const fileEndTime = Date.now();
            const fileDuration = ((fileEndTime - fileStartTime) / 1000).toFixed(2);
            
            log(`✅ ${testFile} completed successfully in ${fileDuration}s`, 'green');
            results.passed++;
            
        } catch (error) {
            const fileEndTime = Date.now();
            const fileDuration = ((fileEndTime - startTime) / 1000).toFixed(2);
            
            log(`❌ ${testFile} failed after ${fileDuration}s`, 'red');
            results.failed++;
            
            if (options.stopOnFailure) {
                log('🛑 Stopping execution due to failure', 'red');
                break;
            }
            
            if (!options.continueOnFailure) {
                log('🛑 Stopping execution due to failure (use --continue-on-failure to continue)', 'red');
                break;
            }
        }
    }
    
    const endTime = Date.now();
    results.duration = ((endTime - startTime) / 1000).toFixed(2);
    
    return results;
}

function generateReports(options) {
    log('\n📈 Generating reports...', 'blue');
    
    try {
        if (options.reporter === 'multiple' || options.reporter === 'allure') {
            if (fs.existsSync('allure-results')) {
                execSync('npx allure generate allure-results --clean', {
                    stdio: 'inherit'
                });
                log('✅ Allure report generated successfully!', 'green');
                log('🌐 To view the report, run: npx allure open', 'cyan');
            }
        }
        
        if (options.mergeReports) {
            log('📊 Merging reports...', 'blue');
            // Add report merging logic here if needed
        }
        
    } catch (error) {
        log('⚠️  Could not generate reports:', 'yellow');
        log(`   ${error.message}`, 'red');
    }
}

function showTestSummary(options, results) {
    log('\n📊 Test Suite Summary', 'bright');
    log('====================\n', 'bright');
    
    log(`📁 Test Files: ${results.total}`, 'cyan');
    log(`✅ Passed: ${results.passed}`, 'green');
    log(`❌ Failed: ${results.failed}`, 'red');
    log(`⏭️  Skipped: ${results.skipped}`, 'yellow');
    log(`⏱️  Total Duration: ${results.duration}s`, 'cyan');
    
    log('\n🔧 Configuration:', 'bright');
    log(`🌍 Environment: ${options.environment}`, 'cyan');
    log(`⚡ Execution: ${options.parallel ? 'Parallel' : 'Sequential'}`, 'cyan');
    log(`👥 Workers: ${options.parallel ? options.workers : 1}`, 'cyan');
    log(`⏱️  Timeout: ${options.timeout}ms`, 'cyan');
    log(`🔄 Retries: ${options.retries}`, 'cyan');
    log(`📊 Reporter: ${options.reporter}`, 'cyan');
    log(`📁 Output: ${options.output}`, 'cyan');
    log(`🖥️  Browser: ${options.headed ? 'Headed' : 'Headless'}`, 'cyan');
    log(`🐛 Debug: ${options.debug ? 'Enabled' : 'Disabled'}`, 'cyan');
    
    if (results.failed > 0) {
        log('\n❌ Some tests failed!', 'red');
        log('💡 Check the test results for details', 'cyan');
        process.exit(1);
    } else {
        log('\n🎉 All tests passed successfully!', 'green');
    }
}

function main() {
    showBanner();
    
    const { args, options } = parseArguments();
    
    if (args.includes('--help') || args.length === 0) {
        showHelp();
        return;
    }
    
    validateEnvironment();
    
    const testFiles = getTestFiles(options);
    
    if (testFiles.length === 0) {
        log('\n❌ No test files found matching the specified criteria!', 'red');
        showHelp();
        process.exit(1);
    }
    
    log(`\n📋 Found ${testFiles.length} test file(s) to run:`, 'bright');
    testFiles.forEach((file, index) => {
        log(`   ${index + 1}. ${file}`, 'cyan');
    });
    
    ensureOutputDirectory(options.output);
    
    const results = runTestSuite(testFiles, options);
    generateReports(options);
    showTestSummary(options, results);
    
    log('\n🎉 Enhanced test suite execution completed!', 'bright');
    log('📚 For more information, run: node scripts/run-test-suite-enhanced.js --help', 'cyan');
}

// Run the script
main();
