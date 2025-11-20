#!/usr/bin/env node

/**
 * Regression Test Runner Script
 * 
 * This script provides a comprehensive way to run different categories of regression tests
 * for the Aqua application. It supports running specific test suites, generating reports,
 * and managing test execution.
 * 
 * Usage:
 *   node scripts/run-regression-tests.js [options]
 * 
 * Options:
 *   --smoke           Run smoke tests only
 *   --functional     Run functional tests only
 *   --integration    Run integration tests only
 *   --ui             Run UI tests only
 *   --performance    Run performance tests only
 *   --security       Run security tests only
 *   --all            Run all regression tests
 *   --headed         Run tests in headed mode (browser visible)
 *   --workers <n>    Set number of test workers (default: 1)
 *   --reporter <r>   Set reporter (default: list,html,allure)
 *   --help           Show this help message
 */

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// Configuration
const TEST_DIR = 'tests/regression';
const DEFAULT_WORKERS = 1;
const DEFAULT_REPORTER = 'list,html,allure';

// Test categories and their descriptions
const TEST_CATEGORIES = {
    smoke: {
        path: `${TEST_DIR}/smoke`,
        description: 'Critical functionality tests (5-10 min)',
        priority: 'HIGH'
    },
    functional: {
        path: `${TEST_DIR}/functional`,
        description: 'Core features tests (15-30 min)',
        priority: 'HIGH'
    },
    integration: {
        path: `${TEST_DIR}/integration`,
        description: 'End-to-end workflow tests (30-60 min)',
        priority: 'MEDIUM'
    },
    ui: {
        path: `${TEST_DIR}/ui`,
        description: 'User interface tests (20-40 min)',
        priority: 'MEDIUM'
    },
    performance: {
        path: `${TEST_DIR}/performance`,
        description: 'Performance and load tests (10-20 min)',
        priority: 'MEDIUM'
    },
    security: {
        path: `${TEST_DIR}/security`,
        description: 'Security and access control tests (15-25 min)',
        priority: 'HIGH'
    }
};

// Parse command line arguments
function parseArguments() {
    const args = process.argv.slice(2);
    const options = {
        smoke: false,
        functional: false,
        integration: false,
        ui: false,
        performance: false,
        security: false,
        all: false,
        headed: false,
        workers: DEFAULT_WORKERS,
        reporter: DEFAULT_REPORTER,
        help: false
    };

    for (let i = 0; i < args.length; i++) {
        const arg = args[i];
        
        switch (arg) {
            case '--smoke':
                options.smoke = true;
                break;
            case '--functional':
                options.functional = true;
                break;
            case '--integration':
                options.integration = true;
                break;
            case '--ui':
                options.ui = true;
                break;
            case '--performance':
                options.performance = true;
                break;
            case '--security':
                options.security = true;
                break;
            case '--all':
                options.all = true;
                break;
            case '--headed':
                options.headed = true;
                break;
            case '--workers':
                options.workers = parseInt(args[++i]) || DEFAULT_WORKERS;
                break;
            case '--reporter':
                options.reporter = args[++i] || DEFAULT_REPORTER;
                break;
            case '--help':
                options.help = true;
                break;
            default:
                console.log(`⚠️  Unknown option: ${arg}`);
                break;
        }
    }

    return options;
}

// Display help information
function showHelp() {
    console.log(`
🔍 Aqua Regression Test Runner

This script provides a comprehensive way to run different categories of regression tests
for the Aqua application.

📋 Usage:
  node scripts/run-regression-tests.js [options]

🎯 Test Categories:
  --smoke           Run smoke tests only
                    ${TEST_CATEGORIES.smoke.description}
                    Priority: ${TEST_CATEGORIES.smoke.priority}

  --functional     Run functional tests only
                    ${TEST_CATEGORIES.functional.description}
                    Priority: ${TEST_CATEGORIES.functional.priority}

  --integration    Run integration tests only
                    ${TEST_CATEGORIES.integration.description}
                    Priority: ${TEST_CATEGORIES.integration.priority}

  --ui             Run UI tests only
                    ${TEST_CATEGORIES.ui.description}
                    Priority: ${TEST_CATEGORIES.ui.priority}

  --performance    Run performance tests only
                    ${TEST_CATEGORIES.performance.description}
                    Priority: ${TEST_CATEGORIES.performance.priority}

  --security       Run security tests only
                    ${TEST_CATEGORIES.security.description}
                    Priority: ${TEST_CATEGORIES.security.priority}

  --all            Run all regression tests

⚙️  Execution Options:
  --headed         Run tests in headed mode (browser visible)
  --workers <n>    Set number of test workers (default: ${DEFAULT_WORKERS})
  --reporter <r>   Set reporter (default: ${DEFAULT_REPORTER})

📊 Reporters Available:
  list             Console output
  html             HTML report in playwright-report/
  allure           Allure report in allure-results/
  json             JSON report
  junit            JUnit XML report

🚀 Examples:
  # Run all regression tests
  node scripts/run-regression-tests.js --all

  # Run only smoke tests in headed mode
  node scripts/run-regression-tests.js --smoke --headed

  # Run functional and UI tests with 2 workers
  node scripts/run-regression-tests.js --functional --ui --workers 2

  # Run performance tests with custom reporter
  node scripts/run-regression-tests.js --performance --reporter list,html

📁 Test Structure:
  ${TEST_DIR}/
  ├── smoke/           # Critical path tests
  ├── functional/      # Core functionality tests
  ├── integration/     # End-to-end workflows
  ├── ui/             # User interface tests
  ├── performance/    # Performance tests
  └── security/       # Security tests

⏱️  Estimated Execution Times:
  Smoke: 5-10 minutes
  Functional: 15-30 minutes
  Integration: 30-60 minutes
  UI: 20-40 minutes
  Performance: 10-20 minutes
  Security: 15-25 minutes
  All: 2-3 hours

🔧 Prerequisites:
  - Node.js installed
  - Dependencies installed (npm install)
  - Playwright browsers installed (npx playwright install)
  - Environment variables configured (.env file)
`);
}

// Validate test directories exist
function validateTestDirectories() {
    const missingDirs = [];
    
    Object.entries(TEST_CATEGORIES).forEach(([category, config]) => {
        if (!fs.existsSync(config.path)) {
            missingDirs.push(config.path);
        }
    });
    
    if (missingDirs.length > 0) {
        console.log('❌ Missing test directories:');
        missingDirs.forEach(dir => console.log(`   ${dir}`));
        console.log('\nPlease ensure all regression test directories are created.');
        return false;
    }
    
    return true;
}

// Build Playwright command
function buildPlaywrightCommand(options) {
    let command = 'npx playwright test';
    
    // Add test paths
    if (options.all) {
        command += ` ${TEST_DIR}`;
    } else {
        const selectedCategories = [];
        Object.entries(TEST_CATEGORIES).forEach(([category, config]) => {
            if (options[category]) {
                selectedCategories.push(config.path);
            }
        });
        
        if (selectedCategories.length === 0) {
            // Default to smoke tests if no category specified
            selectedCategories.push(TEST_CATEGORIES.smoke.path);
        }
        
        command += ` ${selectedCategories.join(' ')}`;
    }
    
    // Add execution options
    if (options.headed) {
        command += ' --headed';
    }
    
    command += ` --workers=${options.workers}`;
    command += ` --reporter=${options.reporter}`;
    
    return command;
}

// Display test execution summary
function displayExecutionSummary(options) {
    console.log('\n🚀 Regression Test Execution Summary');
    console.log('=====================================');
    
    if (options.all) {
        console.log('📋 Test Scope: ALL REGRESSION TESTS');
        console.log('⏱️  Estimated Time: 2-3 hours');
    } else {
        const selectedCategories = [];
        Object.entries(TEST_CATEGORIES).forEach(([category, config]) => {
            if (options[category]) {
                selectedCategories.push({
                    name: category.toUpperCase(),
                    description: config.description,
                    priority: config.priority
                });
            }
        });
        
        if (selectedCategories.length === 0) {
            selectedCategories.push({
                name: 'SMOKE',
                description: TEST_CATEGORIES.smoke.description,
                priority: TEST_CATEGORIES.smoke.priority
            });
        }
        
        console.log('📋 Test Scope:');
        selectedCategories.forEach(cat => {
            console.log(`   • ${cat.name}: ${cat.description} (Priority: ${cat.priority})`);
        });
        
        const totalTime = selectedCategories.length * 20; // Rough estimate
        console.log(`⏱️  Estimated Time: ${totalTime}-${totalTime + 10} minutes`);
    }
    
    console.log(`🔧 Workers: ${options.workers}`);
    console.log(`📊 Reporter: ${options.reporter}`);
    console.log(`👁️  Headed Mode: ${options.headed ? 'Yes' : 'No'}`);
    
    console.log('\n📁 Test Paths:');
    if (options.all) {
        console.log(`   ${TEST_DIR}/`);
    } else {
        Object.entries(TEST_CATEGORIES).forEach(([category, config]) => {
            if (options[category] || options.all) {
                console.log(`   ${config.path}/`);
            }
        });
    }
}

// Main execution function
function main() {
    console.log('🔍 Aqua Regression Test Runner');
    console.log('================================\n');
    
    const options = parseArguments();
    
    if (options.help) {
        showHelp();
        return;
    }
    
    // Validate test directories
    if (!validateTestDirectories()) {
        process.exit(1);
    }
    
    // Display execution summary
    displayExecutionSummary(options);
    
    // Build and execute command
    const command = buildPlaywrightCommand(options);
    
    console.log('\n🚀 Executing tests...');
    console.log(`📝 Command: ${command}`);
    console.log('\n' + '='.repeat(80));
    
    try {
        execSync(command, { stdio: 'inherit' });
        console.log('\n' + '='.repeat(80));
        console.log('✅ Regression tests completed successfully!');
        
        // Display report locations
        if (options.reporter.includes('html')) {
            console.log('📊 HTML Report: playwright-report/index.html');
        }
        if (options.reporter.includes('allure')) {
            console.log('📊 Allure Report: allure-results/');
            console.log('💡 Generate report: npm run allure:generate');
            console.log('🌐 Open report: npm run allure:open');
        }
        
    } catch (error) {
        console.log('\n' + '='.repeat(80));
        console.log('❌ Regression tests failed!');
        console.log('💡 Check the output above for details.');
        console.log('🔧 Common troubleshooting:');
        console.log('   - Verify environment variables are set');
        console.log('   - Check network connectivity');
        console.log('   - Ensure test data is available');
        console.log('   - Review test logs for specific errors');
        
        process.exit(1);
    }
}

// Run the script
if (require.main === module) {
    main();
}

module.exports = {
    parseArguments,
    buildPlaywrightCommand,
    validateTestDirectories,
    TEST_CATEGORIES
};
