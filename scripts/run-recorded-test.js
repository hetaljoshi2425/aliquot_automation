const { execSync } = require('child_process');
const path = require('path');

console.log('🚀 Running Recorded Client Creation Test...\n');

try {
    // Run the simple recorded test (focuses on client creation)
    const testCommand = 'npx playwright test tests/client_creation_simple.spec.js --headed';
    
    console.log(`Executing: ${testCommand}\n`);
    
    execSync(testCommand, { 
        stdio: 'inherit',
        cwd: process.cwd()
    });
    
    console.log('\n✅ Recorded test completed successfully!');
    
} catch (error) {
    console.error('\n❌ Test execution failed:', error.message);
    process.exit(1);
}
