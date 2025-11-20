#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

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

function showBanner() {
    log('\n🚀 Aqua Migration Playwright Setup', 'bright');
    log('===================================\n', 'bright');
}

function checkNodeVersion() {
    const nodeVersion = process.version;
    const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);
    
    if (majorVersion < 16) {
        log('❌ Node.js version 16 or higher is required!', 'red');
        log(`Current version: ${nodeVersion}`, 'yellow');
        process.exit(1);
    }
    
    log(`✅ Node.js version: ${nodeVersion}`, 'green');
}

function checkDependencies() {
    const packageJsonPath = path.join(__dirname, '..', 'package.json');
    
    if (!fs.existsSync(packageJsonPath)) {
        log('❌ package.json not found!', 'red');
        process.exit(1);
    }
    
    log('✅ package.json found', 'green');
}

function installDependencies() {
    log('\n📦 Installing dependencies...', 'blue');
    
    try {
        execSync('npm install', { stdio: 'inherit' });
        log('✅ Dependencies installed successfully!', 'green');
    } catch (error) {
        log('❌ Failed to install dependencies!', 'red');
        process.exit(1);
    }
}

function installPlaywrightBrowsers() {
    log('\n🌐 Installing Playwright browsers...', 'blue');
    
    try {
        execSync('npx playwright install', { stdio: 'inherit' });
        log('✅ Playwright browsers installed successfully!', 'green');
    } catch (error) {
        log('❌ Failed to install Playwright browsers!', 'red');
        process.exit(1);
    }
}

function setupEnvironmentFile() {
    const envExamplePath = path.join(__dirname, '..', 'env.example');
    const envPath = path.join(__dirname, '..', '.env');
    
    if (!fs.existsSync(envExamplePath)) {
        log('❌ env.example file not found!', 'red');
        process.exit(1);
    }
    
    if (fs.existsSync(envPath)) {
        log('⚠️  .env file already exists, skipping...', 'yellow');
        return;
    }
    
    try {
        fs.copyFileSync(envExamplePath, envPath);
        log('✅ .env file created from env.example', 'green');
        log('📝 Please edit .env file with your actual credentials', 'cyan');
    } catch (error) {
        log('❌ Failed to create .env file!', 'red');
        process.exit(1);
    }
}

function showNextSteps() {
    log('\n🎯 Next Steps:', 'bright');
    log('==============\n', 'bright');
    
    log('1. Edit .env file with your credentials:', 'yellow');
    log('   nano .env', 'cyan');
    
    log('\n2. Test the setup:', 'yellow');
    log('   npm run test:client:help', 'cyan');
    
    log('\n3. Run a simple test:', 'yellow');
    log('   npm run test:client:validation -- --headed', 'cyan');
    
    log('\n4. View available commands:', 'yellow');
    log('   npm run', 'cyan');
    
    log('\n📚 Documentation:', 'bright');
    log('================\n', 'bright');
    log('• README.md - Project overview and setup', 'cyan');
    log('• docs/client_creation_tests.md - Test documentation', 'cyan');
    log('• node scripts/run-client-tests.js --help - Test runner help', 'cyan');
}

function main() {
    showBanner();
    
    log('🔍 Checking prerequisites...', 'blue');
    checkNodeVersion();
    checkDependencies();
    
    log('\n🛠️  Setting up project...', 'blue');
    installDependencies();
    installPlaywrightBrowsers();
    setupEnvironmentFile();
    
    showNextSteps();
    
    log('\n✅ Setup completed successfully!', 'green');
    log('Happy testing! 🎉\n', 'bright');
}

// Run the setup
main();
