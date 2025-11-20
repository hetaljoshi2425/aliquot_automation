#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Colors for console output
const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
}

function checkFileExists(filePath, description) {
    if (fs.existsSync(filePath)) {
        log(`✅ ${description}`, 'green');
        return true;
    } else {
        log(`❌ ${description} - NOT FOUND`, 'red');
        return false;
    }
}

function checkEnvironmentVariables() {
    log('\n🔍 Checking environment variables...', 'blue');
    
    const envPath = path.join(__dirname, '..', '.env');
    if (!fs.existsSync(envPath)) {
        log('❌ .env file not found!', 'red');
        log('💡 Run: npm run setup', 'cyan');
        return false;
    }
    
    const envContent = fs.readFileSync(envPath, 'utf8');
    const requiredVars = [
            // 'ALIQUOT_BASE_URL_AWT', // DEPRECATED - AWT environment no longer available
    // 'ALIQUOT_USERNAME_AWT', // DEPRECATED - AWT environment no longer available
    // 'ALIQUOT_PASSWORD_AWT'  // DEPRECATED - AWT environment no longer available
    ];
    
    let allVarsPresent = true;
    
    for (const varName of requiredVars) {
        if (envContent.includes(varName)) {
            log(`✅ ${varName}`, 'green');
        } else {
            log(`❌ ${varName} - NOT FOUND`, 'red');
            allVarsPresent = false;
        }
    }
    
    return allVarsPresent;
}

function checkDependencies() {
    log('\n📦 Checking dependencies...', 'blue');
    
    const packageJsonPath = path.join(__dirname, '..', 'package.json');
    const packageLockPath = path.join(__dirname, '..', 'package-lock.json');
    const nodeModulesPath = path.join(__dirname, '..', 'node_modules');
    
    let allDepsPresent = true;
    
    allDepsPresent &= checkFileExists(packageJsonPath, 'package.json');
    allDepsPresent &= checkFileExists(packageLockPath, 'package-lock.json');
    allDepsPresent &= checkFileExists(nodeModulesPath, 'node_modules');
    
    return allDepsPresent;
}

function checkTestFiles() {
    log('\n🧪 Checking test files...', 'blue');
    
    const testFiles = [
        { path: 'tests/create_client.spec.js', desc: 'Client creation test file' },
        { path: 'pages/client/client.page.ts', desc: 'Client page object' },
        { path: 'pages/client/client.steps.ts', desc: 'Client step functions' },
        { path: 'scripts/run-client-tests.js', desc: 'Test runner script' }
    ];
    
    let allFilesPresent = true;
    
    for (const file of testFiles) {
        const fullPath = path.join(__dirname, '..', file.path);
        allFilesPresent &= checkFileExists(fullPath, file.desc);
    }
    
    return allFilesPresent;
}

function checkPlaywrightConfig() {
    log('\n⚙️  Checking Playwright configuration...', 'blue');
    
    const configPath = path.join(__dirname, '..', 'playwright.config.js');
    return checkFileExists(configPath, 'playwright.config.js');
}

function showSummary(passed, total) {
    log('\n📊 Validation Summary', 'bright');
    log('===================\n', 'bright');
    
    if (passed === total) {
        log(`✅ All ${total} checks passed!`, 'green');
        log('🚀 Your project is ready to run tests!', 'bright');
    } else {
        log(`❌ ${total - passed} of ${total} checks failed!`, 'red');
        log('🔧 Please fix the issues above before running tests.', 'yellow');
    }
    
    log('\n💡 Next steps:', 'bright');
    log('• Run: npm run test:client:help', 'cyan');
    log('• Run: npm run test:client:validation -- --headed', 'cyan');
}

function main() {
    log('\n🔍 Aqua Migration Project Validation', 'bright');
    log('====================================\n', 'bright');
    
    let passedChecks = 0;
    let totalChecks = 0;
    
    // Check dependencies
    if (checkDependencies()) passedChecks++;
    totalChecks++;
    
    // Check test files
    if (checkTestFiles()) passedChecks++;
    totalChecks++;
    
    // Check Playwright config
    if (checkPlaywrightConfig()) passedChecks++;
    totalChecks++;
    
    // Check environment variables
    if (checkEnvironmentVariables()) passedChecks++;
    totalChecks++;
    
    showSummary(passedChecks, totalChecks);
    
    if (passedChecks < totalChecks) {
        process.exit(1);
    }
}

// Run validation
main();
