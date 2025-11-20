const { execSync } = require('child_process');
const path = require('path');

console.log('🔍 Debugging Create Client Page...\n');

try {
    // Run the debug test to check page elements
    const testCommand = 'npx playwright test tests/debug_client_page.spec.js --headed --timeout=60000';
    
    console.log(`Executing: ${testCommand}\n`);
    
    execSync(testCommand, { 
        stdio: 'inherit',
        cwd: process.cwd()
    });
    
    console.log('\n✅ Debug test completed!');
    
} catch (error) {
    console.error('\n❌ Debug test failed:', error.message);
    console.log('\n💡 Try running with --debug flag for more details:');
    console.log('npx playwright test tests/client_creation_recorded.spec.js --debug');
    process.exit(1);
}
