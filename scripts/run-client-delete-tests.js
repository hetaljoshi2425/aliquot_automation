const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('🚀 Starting Client Delete Tests...\n');

// Configuration
const testFile = 'tests/client_delete.spec.js';
const testResultsDir = 'test-results';

// Ensure test results directory exists
if (!fs.existsSync(testResultsDir)) {
    fs.mkdirSync(testResultsDir, { recursive: true });
    console.log(`📁 Created test results directory: ${testResultsDir}`);
}

try {
    console.log('🔧 Running Client Delete Tests...');
    console.log(`📄 Test file: ${testFile}`);
    console.log(`📊 Results directory: ${testResultsDir}\n`);

    // Run the tests with Playwright - using existing config
    const command = `npx playwright test ${testFile} --output=${testResultsDir} --headed --timeout=60000`;

    console.log(`⚡ Executing command: ${command}\n`);

    const result = execSync(command, {
        stdio: 'inherit',
        cwd: process.cwd(),
        env: { 
            ...process.env, 
            FORCE_COLOR: '1'
        }
    });

    console.log('\n✅ Client Delete Tests completed successfully!');
    console.log(`📊 Test results available in: ${testResultsDir}`);
    console.log(`📈 Allure results available in: allure-results/`);
    console.log(`📄 HTML report available in: playwright-report/`);

    // Generate Allure report if allure-results directory exists
    console.log('\n📈 Generating Allure report...');
    try {
        if (fs.existsSync('allure-results')) {
            execSync(`npx allure generate allure-results --clean`, {
                stdio: 'inherit',
                cwd: process.cwd()
            });
            console.log('✅ Allure report generated successfully!');
            console.log('🌐 To view the report, run: npx allure open');
        } else {
            console.log('⚠️ No allure-results directory found, skipping Allure report generation');
        }
    } catch (allureError) {
        console.log('⚠️ Could not generate Allure report:', allureError.message);
    }

} catch (error) {
    console.error('\n❌ Client Delete Tests failed!');
    console.error('Error details:', error.message);
    
    if (error.stdout) {
        console.error('STDOUT:', error.stdout.toString());
    }
    
    if (error.stderr) {
        console.error('STDERR:', error.stderr.toString());
    }
    
    process.exit(1);
}

console.log('\n🎉 Client Delete Tests execution completed!');
