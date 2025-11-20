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
    log('\n🚀 Comprehensive Test Suite Runner v2.0', 'bright');
    log('===========================================\n', 'bright');
    log('📅 Updated: August 16, 2024', 'cyan');
    log('🔧 Covers all 21 test cases from qa.aliquot.live spreadsheet\n', 'cyan');
}

function showHelp() {
    log('\nComprehensive Test Suite Runner', 'bright');
    log('================================\n', 'bright');
    
    log('Usage:', 'yellow');
    log('  node scripts/run-comprehensive-tests-enhanced.js [options]\n', 'cyan');
    
    log('Test Categories:', 'yellow');
    log('  --client                  Run all client tests (Tests 1-4)', 'cyan');
    log('  --customer                Run all customer tests (Tests 5-8)', 'cyan');
    log('  --facility                Run all facility tests (Tests 9-12)', 'cyan');
    log('  --building                Run all building tests (Tests 13-16)', 'cyan');
    log('  --system                  Run all system tests (Tests 17-20)', 'cyan');
    log('  --general                 Run general tests (Test 21)', 'cyan');
    log('  --smoke                   Run smoke tests (quick validation)', 'cyan');
    log('  --regression              Run regression tests (full lifecycle)', 'cyan');
    log('  --all                     Run all 21 test cases', 'cyan');
    
    log('\nSpecific Test Options:', 'yellow');
    log('  --test=1                  Run Test 1: Client Lists', 'cyan');
    log('  --test=2                  Run Test 2: Create Client', 'cyan');
    log('  --test=3                  Run Test 3: Delete Client', 'cyan');
    log('  --test=4                  Run Test 4: Edit Client', 'cyan');
    log('  --test=5                  Run Test 5: Customer Lists', 'cyan');
    log('  --test=6                  Run Test 6: Create Customer', 'cyan');
    log('  --test=7                  Run Test 7: Delete Customer', 'cyan');
    log('  --test=8                  Run Test 8: Edit Customer', 'cyan');
    log('  --test=9                  Run Test 9: Facility Lists', 'cyan');
    log('  --test=10                 Run Test 10: Create Facility', 'cyan');
    log('  --test=11                 Run Test 11: Delete Facility', 'cyan');
    log('  --test=12                 Run Test 12: Edit Facility', 'cyan');
    log('  --test=13                 Run Test 13: Building Lists', 'cyan');
    log('  --test=14                 Run Test 14: Create Building', 'cyan');
    log('  --test=15                 Run Test 15: Delete Building', 'cyan');
    log('  --test=16                 Run Test 16: Edit Building', 'cyan');
    log('  --test=17                 Run Test 17: System Lists', 'cyan');
    log('  --test=18                 Run Test 18: Create System', 'cyan');
    log('  --test=19                 Run Test 19: Delete System', 'cyan');
    log('  --test=20                 Run Test 20: Edit System', 'cyan');
    log('  --test=21                 Run Test 21: Clear Filters', 'cyan');
    
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
    
    log('\nExamples:', 'yellow');
    log('  node scripts/run-comprehensive-tests-enhanced.js --all --headed', 'cyan');
    log('  node scripts/run-comprehensive-tests-enhanced.js --client --reporter=html', 'cyan');
    log('  node scripts/run-comprehensive-tests-enhanced.js --test=1 --test=2 --headed', 'cyan');
    log('  node scripts/run-comprehensive-tests-enhanced.js --smoke --parallel --workers=3', 'cyan');
    log('  node scripts/run-comprehensive-tests-enhanced.js --all --env=staging --reporter=multiple', 'cyan');
    
    log('\nTest Descriptions:', 'yellow');
    log('  Tests 1-4:    Client operations (Lists, Create, Delete, Edit)', 'cyan');
    log('  Tests 5-8:    Customer operations (Lists, Create, Delete, Edit)', 'cyan');
    log('  Tests 9-12:   Facility operations (Lists, Create, Delete, Edit)', 'cyan');
    log('  Tests 13-16:  Building operations (Lists, Create, Delete, Edit)', 'cyan');
    log('  Tests 17-20:  System operations (Lists, Create, Delete, Edit)', 'cyan');
    log('  Test 21:      Clear Filters operation', 'cyan');
}

function validateEnvironment() {
    const packageJsonPath = path.join(__dirname, '..', 'package.json');
    if (!fs.existsSync(packageJsonPath)) {
        log('❌ Error: package.json not found. Please run this script from the project root directory.', 'red');
        process.exit(1);
    }
    
    const testFile = path.join(__dirname, '..', 'tests', 'comprehensive_test_suite.spec.js');
    if (!fs.existsSync(testFile)) {
        log('❌ Error: comprehensive_test_suite.spec.js test file not found!', 'red');
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
        specificTests: [],
        grep: null,
        grepInvert: null
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
    
    // Parse specific tests
    const testArgs = args.filter(arg => arg.startsWith('--test='));
    for (const testArg of testArgs) {
        const testNumber = parseInt(testArg.split('=')[1]);
        if (testNumber >= 1 && testNumber <= 21) {
            options.specificTests.push(testNumber);
        }
    }
    
    // Parse test categories
    const categoryMap = {
        '--client': ['Client Tests'],
        '--customer': ['Customer Tests'],
        '--facility': ['Facility Tests'],
        '--building': ['Building Tests'],
        '--system': ['System Tests'],
        '--general': ['General Tests'],
        '--smoke': ['Smoke Tests'],
        '--regression': ['Regression Tests'],
        '--all': ['Client Tests', 'Customer Tests', 'Facility Tests', 'Building Tests', 'System Tests', 'General Tests', 'Smoke Tests', 'Regression Tests']
    };
    
    for (const [flag, categories] of Object.entries(categoryMap)) {
        if (args.includes(flag)) {
            options.testCategories.push(...categories);
        }
    }
    
    return { args, options };
}

function buildCommand(options) {
    let command = 'npx playwright test';
    const testFile = 'tests/comprehensive_test_suite.spec.js';
    
    // Add test file
    command += ` ${testFile}`;
    
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
    
    // Add test filters
    if (options.specificTests.length > 0) {
        const testFilters = options.specificTests.map(testNum => {
            const testMap = {
                1: 'Test 1: Client Lists',
                2: 'Test 2: Create Client',
                3: 'Test 3: Delete Client',
                4: 'Test 4: Edit Client',
                5: 'Test 5: Customer Lists',
                6: 'Test 6: Create Customer',
                7: 'Test 7: Delete Customer',
                8: 'Test 8: Edit Customer',
                9: 'Test 9: Facility Lists',
                10: 'Test 10: Create Facility',
                11: 'Test 11: Delete Facility',
                12: 'Test 12: Edit Facility',
                13: 'Test 13: Building Lists',
                14: 'Test 14: Create Building',
                15: 'Test 15: Delete Building',
                16: 'Test 16: Edit Building',
                17: 'Test 17: System Lists',
                18: 'Test 18: Create System',
                19: 'Test 19: Delete System',
                20: 'Test 20: Edit System',
                21: 'Test 21: Clear Filters'
            };
            return testMap[testNum];
        });
        
        for (const filter of testFilters) {
            command += ` --grep "${filter}"`;
        }
    } else if (options.testCategories.length > 0) {
        for (const category of options.testCategories) {
            command += ` --grep "${category}"`;
        }
    }
    
    // Add grep filters
    if (options.grep) {
        command += ` --grep "${options.grep}"`;
    }
    
    if (options.grepInvert) {
        command += ` --grep-invert "${options.grepInvert}"`;
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
        
        log(`\n✅ Comprehensive tests completed successfully in ${duration}s!`, 'green');
        log(`📊 Results available in: ${options.output}`, 'cyan');
        
        // Generate additional reports if needed
        if (options.reporter === 'multiple' || options.reporter === 'allure') {
            generateAllureReport();
        }
        
        return true;
        
    } catch (error) {
        const endTime = Date.now();
        const duration = ((endTime - startTime) / 1000).toFixed(2);
        
        log(`\n❌ Comprehensive tests failed after ${duration}s!`, 'red');
        log('💡 Tips for debugging:', 'yellow');
        log('   - Run with --headed to see the browser', 'cyan');
        log('   - Run with --debug to pause on failures', 'cyan');
        log('   - Check test-results/ for screenshots and traces', 'cyan');
        log('   - Verify your environment variables are set correctly', 'cyan');
        log('   - Try running with --workers=1 for sequential execution', 'cyan');
        log('   - Run specific tests with --test=N to isolate issues', 'cyan');
        
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
    
    if (options.specificTests.length > 0) {
        log(`🎯 Specific Tests: ${options.specificTests.join(', ')}`, 'cyan');
    } else if (options.testCategories.length > 0) {
        log(`📂 Test Categories: ${options.testCategories.join(', ')}`, 'cyan');
    } else {
        log('📂 Test Categories: All tests', 'cyan');
    }
    
    log(`🌍 Environment: ${options.environment}`, 'cyan');
    log(`⚡ Execution: ${options.parallel ? 'Parallel' : 'Sequential'}`, 'cyan');
    log(`👥 Workers: ${options.parallel ? options.workers : 1}`, 'cyan');
    log(`⏱️  Timeout: ${options.timeout}ms`, 'cyan');
    log(`🔄 Retries: ${options.retries}`, 'cyan');
    log(`📊 Reporter: ${options.reporter}`, 'cyan');
    log(`📁 Output: ${options.output}`, 'cyan');
    log(`🖥️  Browser: ${options.headed ? 'Headed' : 'Headless'}`, 'cyan');
    log(`🐛 Debug: ${options.debug ? 'Enabled' : 'Disabled'}`, 'cyan');
    
    if (options.grep) {
        log(`🎯 Grep Filter: "${options.grep}"`, 'cyan');
    }
    if (options.grepInvert) {
        log(`🎯 Grep Invert: "${options.grepInvert}"`, 'cyan');
    }
}

function showTestMatrix() {
    log('\n📊 Test Matrix (21 Test Cases)', 'bright');
    log('=============================\n', 'bright');
    
    const testMatrix = [
        { category: 'Client Tests', tests: ['Test 1: Client Lists', 'Test 2: Create Client', 'Test 3: Delete Client', 'Test 4: Edit Client'] },
        { category: 'Customer Tests', tests: ['Test 5: Customer Lists', 'Test 6: Create Customer', 'Test 7: Delete Customer', 'Test 8: Edit Customer'] },
        { category: 'Facility Tests', tests: ['Test 9: Facility Lists', 'Test 10: Create Facility', 'Test 11: Delete Facility', 'Test 12: Edit Facility'] },
        { category: 'Building Tests', tests: ['Test 13: Building Lists', 'Test 14: Create Building', 'Test 15: Delete Building', 'Test 16: Edit Building'] },
        { category: 'System Tests', tests: ['Test 17: System Lists', 'Test 18: Create System', 'Test 19: Delete System', 'Test 20: Edit System'] },
        { category: 'General Tests', tests: ['Test 21: Clear Filters'] }
    ];
    
    for (const category of testMatrix) {
        log(`${category.category}:`, 'yellow');
        for (const test of category.tests) {
            log(`  - ${test}`, 'cyan');
        }
        log('', 'reset');
    }
}

function main() {
    showBanner();
    
    const { args, options } = parseArguments();
    
    if (args.includes('--help') || args.length === 0) {
        showHelp();
        showTestMatrix();
        return;
    }
    
    validateEnvironment();
    
    if (options.specificTests.length === 0 && options.testCategories.length === 0) {
        log('\n❌ No valid test option specified!', 'red');
        showHelp();
        showTestMatrix();
        process.exit(1);
    }
    
    showTestSummary(options);
    ensureOutputDirectory(options.output);
    
    const command = buildCommand(options);
    const success = runTest(command, options);
    
    if (!success) {
        process.exit(1);
    }
    
    log('\n🎉 Comprehensive test suite execution completed!', 'bright');
    log('📚 For more information, run: node scripts/run-comprehensive-tests-enhanced.js --help', 'cyan');
}

// Run the script
main();
