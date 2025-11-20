const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('🔄 Creating Project Backup');
console.log('==========================');

// Configuration
const sourceDir = process.cwd(); // Current project directory
const backupDir = 'D:\\JY\\cursor\\Aqua_Backup_New\\23_08_2025';

// Create timestamp for backup
const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0];
const backupPath = path.join(backupDir, `aqua_playwright_backup_${timestamp}`);

console.log(`📁 Source Directory: ${sourceDir}`);
console.log(`📁 Backup Directory: ${backupPath}`);
console.log('');

// Function to create backup
function createBackup() {
    try {
        // Check if source directory exists
        if (!fs.existsSync(sourceDir)) {
            console.log('❌ Source directory does not exist!');
            process.exit(1);
        }

        // Create backup directory if it doesn't exist
        if (!fs.existsSync(backupDir)) {
            console.log('📁 Creating backup parent directory...');
            fs.mkdirSync(backupDir, { recursive: true });
        }

        // Create timestamped backup directory
        if (!fs.existsSync(backupPath)) {
            console.log('📁 Creating backup directory...');
            fs.mkdirSync(backupPath, { recursive: true });
        }

        console.log('🔄 Starting backup process...');
        console.log('⏳ This may take a few minutes depending on project size...');

        // Use PowerShell Copy-Item for Windows (more reliable)
        const copyCommand = `powershell -Command "Copy-Item -Path '${sourceDir}\\*' -Destination '${backupPath}' -Recurse -Force"`;

        console.log(`🚀 Executing: ${copyCommand}`);
        
        const result = execSync(copyCommand, { 
            stdio: 'inherit',
            encoding: 'utf8'
        });

        // Check if backup was successful
        if (fs.existsSync(backupPath)) {
            console.log('');
            console.log('✅ Backup completed successfully!');
            console.log(`📁 Backup location: ${backupPath}`);
            
            // Count files in backup
            const countFiles = (dir) => {
                let count = 0;
                const items = fs.readdirSync(dir);
                for (const item of items) {
                    const fullPath = path.join(dir, item);
                    if (fs.statSync(fullPath).isDirectory()) {
                        count += countFiles(fullPath);
                    } else {
                        count++;
                    }
                }
                return count;
            };

            const fileCount = countFiles(backupPath);
            console.log(`📊 Total files backed up: ${fileCount}`);
            
            // Create backup summary
            const summaryPath = path.join(backupPath, 'BACKUP_SUMMARY.txt');
            const summary = `Aqua Playwright Project Backup Summary
==========================================
Backup Date: ${new Date().toISOString()}
Source Directory: ${sourceDir}
Backup Directory: ${backupPath}
Total Files: ${fileCount}
Backup Command: ${copyCommand}

Backup Contents:
- All test files (*.spec.js)
- All script files (*.js)
- All page objects (pages/)
- All utilities (utils/)
- All documentation (docs/)
- All configuration files
- All screenshots and assets
- Package files and dependencies

Backup completed successfully!
`;

            fs.writeFileSync(summaryPath, summary);
            console.log(`📄 Backup summary created: ${summaryPath}`);
            
        } else {
            console.log('❌ Backup failed - backup directory not created');
            process.exit(1);
        }

    } catch (error) {
        console.log('❌ Backup failed with error:');
        console.log(error.message);
        process.exit(1);
    }
}

// Function to verify backup
function verifyBackup() {
    console.log('');
    console.log('🔍 Verifying backup...');
    
    try {
        // Check if key directories exist in backup
        const keyDirs = ['tests', 'scripts', 'pages', 'utils', 'docs'];
        const missingDirs = [];
        
        for (const dir of keyDirs) {
            const backupDirPath = path.join(backupPath, dir);
            if (!fs.existsSync(backupDirPath)) {
                missingDirs.push(dir);
            }
        }
        
        if (missingDirs.length > 0) {
            console.log(`⚠️ Warning: Missing directories in backup: ${missingDirs.join(', ')}`);
        } else {
            console.log('✅ All key directories found in backup');
        }
        
        // Check if key files exist
        const keyFiles = ['package.json', 'playwright.config.js', 'README.md'];
        const missingFiles = [];
        
        for (const file of keyFiles) {
            const backupFilePath = path.join(backupPath, file);
            if (!fs.existsSync(backupFilePath)) {
                missingFiles.push(file);
            }
        }
        
        if (missingFiles.length > 0) {
            console.log(`⚠️ Warning: Missing files in backup: ${missingFiles.join(', ')}`);
        } else {
            console.log('✅ All key files found in backup');
        }
        
        console.log('✅ Backup verification completed');
        
    } catch (error) {
        console.log('❌ Backup verification failed:', error.message);
    }
}

// Main execution
function main() {
    const args = process.argv.slice(2);
    
    if (args.includes('--help') || args.includes('-h')) {
        console.log('🔄 Aqua Playwright Project Backup Tool');
        console.log('=====================================');
        console.log('');
        console.log('Usage:');
        console.log('  node scripts/create-backup.js                    # Create backup');
        console.log('  node scripts/create-backup.js --verify           # Verify backup');
        console.log('  node scripts/create-backup.js --help             # Show this help');
        console.log('');
        console.log('Backup Location: D:\\JY\\cursor\\Aqua_Backup_New\\23_08_2025');
        console.log('');
        process.exit(0);
    }
    
    if (args.includes('--verify')) {
        verifyBackup();
    } else {
        createBackup();
        verifyBackup();
    }
}

// Error handling
process.on('uncaughtException', (error) => {
    console.log('❌ Uncaught Exception:', error.message);
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    console.log('❌ Unhandled Rejection at:', promise, 'reason:', reason);
    process.exit(1);
});

// Run the main function
main();
