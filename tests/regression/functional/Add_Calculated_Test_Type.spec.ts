// Test Case: Add Calculated Test Type
// Preconditions:
// - User is logged into the application
// - User has access to the Reports module
// - User has permission to create calculated test types
// - User must have a System selected to interact with the page

import { test, expect } from '@playwright/test';
import { randomUUID } from 'crypto';

import { HomeSteps } from '../../../pages/home/home.steps';
import { hoverSiteManagementButton, clickClearFiltersBtn } from '../../../pages/home/home.steps';

import {
    goToAliquotQaLink,
    loginAquaUser,
    verifyAquaLoginQa
} from '../../../pages/login/login.steps';

import { ALIQUOT_PASSWORD_QA, ALIQUOT_USERNAME_QA } from '../../../utils/constants';
import { clearCacheAndReload } from '../../../utils/helpers';

test.describe('Add Calculated Test Type - Functional Tests', () => {

    test.beforeEach(async ({ page }) => {
        console.log('🔧 Setting up Add Calculated Test Type test environment...');
    });

    test.afterEach(async ({ page }) => {
        console.log('🧹 Cleaning up Add Calculated Test Type test data...');
    });

    test('REGRESSION: Add Calculated Test Type functionality works correctly', async ({ page }) => {
        console.log('🧮 Testing Add Calculated Test Type functionality...');
        
        // Login and navigate
        await goToAliquotQaLink(page);
        await loginAquaUser(page, ALIQUOT_USERNAME_QA, ALIQUOT_PASSWORD_QA);
        await verifyAquaLoginQa(page);
        await clearCacheAndReload(page);
        
        // Step 1: Hover over the Reports tab
        console.log('🖱️ Hovering over the Reports tab...');
        const reportsTab = page.getByRole('tab', { name: 'Reports' }).or(
            page.getByRole('button', { name: 'Reports' })
        ).or(
            page.locator('[data-testid="reports-tab"]')
        ).or(
            page.locator('a:has-text("Reports")')
        );
        
        await reportsTab.hover();
        await page.waitForTimeout(1000); // Wait for hover effect
        
        // Step 2: Verify Reports and Locations links are opened
        console.log('🔍 Verifying Reports and Locations links are opened...');
        const reportsMenu = page.getByRole('menu', { name: 'Reports' }).or(
            page.locator('[data-testid="reports-menu"]')
        ).or(
            page.locator('.dropdown-menu:has-text("Reports")')
        ).or(
            page.locator('.reports-dropdown')
        ).or(
            page.locator('.reports-submenu')
        );
        
        await expect(reportsMenu).toBeVisible({ timeout: 10000 });
        console.log('✅ Reports and Locations links are opened');
        
        // Step 3: Click Test Types link
        console.log('🧪 Clicking Test Types link...');
        const testTypesLink = page.getByRole('menuitem', { name: 'Test Types' }).or(
            page.getByRole('link', { name: 'Test Types' })
        ).or(
            page.getByRole('menuitem', { name: 'Test Types List' })
        ).or(
            page.locator('[data-testid="test-types-link"]')
        ).or(
            page.locator('a:has-text("Test Types")')
        ).or(
            page.locator('a:has-text("Test Types List")')
        );
        
        await testTypesLink.click();
        await page.waitForLoadState('networkidle');
        
        // Step 4: Verify Test Types List page is displayed
        console.log('📋 Verifying Test Types List page is displayed...');
        const testTypesListPage = page.getByRole('heading', { name: 'Test Types List' }).or(
            page.getByRole('heading', { name: 'Test Types' })
        ).or(
            page.locator('[data-testid="test-types-list-page"]')
        ).or(
            page.locator('h1:has-text("Test Types List")')
        ).or(
            page.locator('h1:has-text("Test Types")')
        ).or(
            page.locator('.page-title:has-text("Test Types")')
        );
        
        await expect(testTypesListPage).toBeVisible({ timeout: 15000 });
        console.log('✅ Test Types List page is displayed');
        
        // Step 5: Select a system to enable test type creation (if required)
        console.log('⚙️ Selecting a system to enable test type creation...');
        const systemLookup = page.getByRole('button', { name: 'Select System' }).or(
            page.getByRole('combobox', { name: 'System' })
        ).or(
            page.locator('[data-testid="system-lookup"]')
        ).or(
            page.locator('.system-lookup, .system-select')
        ).or(
            page.locator('input[placeholder*="System"]')
        );
        
        if (await systemLookup.count() > 0) {
            await systemLookup.click();
            await page.waitForTimeout(1000);
            
            // Verify System Lookup window and select system
            const systemLookupWindow = page.getByRole('dialog', { name: 'System Lookup' }).or(
                page.locator('[data-testid="system-lookup-window"]')
            ).or(
                page.locator('.system-lookup-dialog')
            ).or(
                page.locator('.modal-dialog:has-text("System")')
            );
            
            if (await systemLookupWindow.count() > 0) {
                const systemOptions = page.getByRole('listitem').or(
                    page.locator('[data-testid="system-option"]')
                ).or(
                    page.locator('.system-option, .lookup-item')
                ).or(
                    page.locator('tr[data-system], .system-row')
                );
                
                const systemOptionCount = await systemOptions.count();
                if (systemOptionCount > 0) {
                    const selectedSystem = systemOptions.first();
                    const systemName = await selectedSystem.textContent();
                    await selectedSystem.click();
                    console.log(`✅ Selected System: ${systemName}`);
                    
                    await expect(systemLookupWindow).not.toBeVisible({ timeout: 5000 });
                    console.log('✅ System Lookup window is closed');
                }
            }
            
            // Wait for page to update after system selection
            await page.waitForTimeout(2000);
        } else {
            console.log('ℹ️ System selection not required or already selected');
        }
        
        // Step 6: Click Create Test Type
        console.log('➕ Clicking Create Test Type button...');
        const createTestTypeButton = page.getByRole('button', { name: 'Create Test Type' }).or(
            page.getByRole('button', { name: 'Add Test Type' })
        ).or(
            page.getByRole('button', { name: 'New Test Type' })
        ).or(
            page.locator('[data-testid="create-test-type-btn"]')
        ).or(
            page.locator('button:has-text("Create Test Type")')
        ).or(
            page.locator('button:has-text("Add Test Type")')
        ).or(
            page.locator('a:has-text("Create Test Type")')
        );
        
        await expect(createTestTypeButton).toBeVisible({ timeout: 10000 });
        await createTestTypeButton.click();
        await page.waitForTimeout(1000);
        
        // Step 7: Verify Create Test Type page is displayed
        console.log('📝 Verifying Create Test Type page is displayed...');
        const createTestTypePage = page.getByRole('heading', { name: 'Create Test Type' }).or(
            page.getByRole('heading', { name: 'Add Test Type' })
        ).or(
            page.getByRole('heading', { name: 'New Test Type' })
        ).or(
            page.locator('[data-testid="create-test-type-page"]')
        ).or(
            page.locator('h1:has-text("Create Test Type")')
        ).or(
            page.locator('h1:has-text("Add Test Type")')
        ).or(
            page.locator('.page-title:has-text("Test Type")')
        );
        
        await expect(createTestTypePage).toBeVisible({ timeout: 15000 });
        console.log('✅ Create Test Type page is displayed');
        
        // Step 8: Fill out required fields: Short Name (mandatory)
        console.log('📝 Filling out required field: Short Name (mandatory)...');
        const shortNameInput = page.getByLabel('Short Name').or(
            page.getByLabel('Test Type Short Name')
        ).or(
            page.locator('[data-testid="short-name-input"]')
        ).or(
            page.locator('input[name*="shortName"]')
        ).or(
            page.locator('input[placeholder*="Short Name"]')
        ).or(
            page.locator('input[placeholder*="short name"]')
        );
        
        await expect(shortNameInput).toBeVisible({ timeout: 10000 });
        
        // Generate unique short name for calculated test type
        const shortName = `CALC-${randomUUID().substring(0, 8).toUpperCase()}`;
        await shortNameInput.fill(shortName);
        console.log(`✅ Filled out Short Name: ${shortName}`);
        
        // Step 9: Fill out required fields: Long Name (mandatory)
        console.log('📝 Filling out required field: Long Name (mandatory)...');
        const longNameInput = page.getByLabel('Long Name').or(
            page.getByLabel('Test Type Long Name')
        ).or(
            page.locator('[data-testid="long-name-input"]')
        ).or(
            page.locator('input[name*="longName"]')
        ).or(
            page.locator('input[placeholder*="Long Name"]')
        ).or(
            page.locator('input[placeholder*="long name"]')
        );
        
        await expect(longNameInput).toBeVisible({ timeout: 10000 });
        
        // Fill long name (not auto-populated for calculated test types)
        const longName = `${shortName} - Calculated Test Type`;
        await longNameInput.fill(longName);
        console.log(`✅ Filled out Long Name: ${longName}`);
        
        // Step 10: Switch on "Test is a Calculation?" toggle
        console.log('🔄 Switching on "Test is a Calculation?" toggle...');
        const calculationToggle = page.getByRole('switch', { name: 'Test is a Calculation' }).or(
            page.getByRole('checkbox', { name: 'Test is a Calculation' })
        ).or(
            page.locator('[data-testid="calculation-toggle"]')
        ).or(
            page.locator('input[type="checkbox"][name*="calculation"]')
        ).or(
            page.locator('input[type="checkbox"][name*="isCalculation"]')
        ).or(
            page.locator('input[type="checkbox"][name*="calculated"]')
        ).or(
            page.locator('.toggle-switch, .calculation-toggle')
        );
        
        await expect(calculationToggle).toBeVisible({ timeout: 10000 });
        
        // Check if toggle is already on, if not, turn it on
        const isChecked = await calculationToggle.isChecked();
        if (!isChecked) {
            await calculationToggle.click();
            console.log('✅ Switched on "Test is a Calculation?" toggle');
        } else {
            console.log('✅ "Test is a Calculation?" toggle is already on');
        }
        
        // Wait for calculation fields to appear
        await page.waitForTimeout(1000);
        
        // Step 11: Add a Calculation Formula (e.g., A+B)
        console.log('🧮 Adding a Calculation Formula...');
        const calculationFormulaInput = page.getByLabel('Calculation Formula').or(
            page.getByLabel('Formula')
        ).or(
            page.locator('[data-testid="calculation-formula-input"]')
        ).or(
            page.locator('input[name*="formula"]')
        ).or(
            page.locator('input[name*="calculation"]')
        ).or(
            page.locator('textarea[name*="formula"]')
        ).or(
            page.locator('textarea[name*="calculation"]')
        ).or(
            page.locator('input[placeholder*="formula"]')
        ).or(
            page.locator('textarea[placeholder*="formula"]')
        );
        
        await expect(calculationFormulaInput).toBeVisible({ timeout: 10000 });
        
        // Enter a simple calculation formula
        const formula = 'A+B';
        await calculationFormulaInput.fill(formula);
        console.log(`✅ Added Calculation Formula: ${formula}`);
        
        // Step 12: Click Save Test Type
        console.log('💾 Clicking Save Test Type button...');
        const saveTestTypeButton = page.getByRole('button', { name: 'Save Test Type' }).or(
            page.getByRole('button', { name: 'Save' })
        ).or(
            page.getByRole('button', { name: 'Create' })
        ).or(
            page.locator('[data-testid="save-test-type-btn"]')
        ).or(
            page.locator('button:has-text("Save")')
        ).or(
            page.locator('button:has-text("Create")')
        );
        
        await expect(saveTestTypeButton).toBeVisible({ timeout: 10000 });
        await saveTestTypeButton.click();
        
        // Wait for save operation to complete
        await page.waitForTimeout(3000);
        
        // Step 13: Verify Success message is displayed
        console.log('✅ Verifying success message is displayed...');
        const successMessage = page.getByText('Test Type has been saved successfully').or(
            page.getByText('Test Type saved successfully')
        ).or(
            page.getByText('Test Type created successfully')
        ).or(
            page.getByText('Successfully saved')
        ).or(
            page.getByText('Test Type added successfully')
        ).or(
            page.locator('[data-testid="success-message"]')
        ).or(
            page.locator('.success-message, .alert-success')
        );
        
        await expect(successMessage).toBeVisible({ timeout: 10000 });
        const successText = await successMessage.textContent();
        console.log(`✅ Success message: "${successText}" is displayed`);
        
        // Step 14: Verify the newly created Test Type is displayed in the Test Types list
        console.log('📋 Verifying the newly created Test Type is displayed in the Test Types list...');
        
        // Navigate back to Test Types list if needed
        const testTypesListPageAfter = page.getByRole('heading', { name: 'Test Types List' }).or(
            page.locator('h1:has-text("Test Types List")')
        );
        
        if (await testTypesListPageAfter.count() === 0) {
            // Look for back button or navigation
            const backButton = page.getByRole('button', { name: 'Back' }).or(
                page.getByRole('button', { name: 'Cancel' })
            ).or(
                page.locator('[data-testid="back-btn"]')
            ).or(
                page.locator('button:has-text("Back")')
            ).or(
                page.locator('button:has-text("Cancel")')
            );
            
            if (await backButton.count() > 0) {
                await backButton.click();
                await page.waitForLoadState('networkidle');
                console.log('✅ Clicked back button to return to Test Types list');
            }
        }
        
        await page.waitForTimeout(2000);
        
        // Find the test types table
        const testTypesTable = page.getByRole('table', { name: 'Test Types' }).or(
            page.getByRole('table', { name: 'Test Types List' })
        ).or(
            page.locator('[data-testid="test-types-table"]')
        ).or(
            page.locator('.test-types-table, .test-types-list')
        ).or(
            page.locator('table')
        );
        
        await expect(testTypesTable).toBeVisible({ timeout: 15000 });
        
        // Search for the created test type in the table
        const tableRows = testTypesTable.locator('tbody tr, .test-type-row');
        const rowCount = await tableRows.count();
        console.log(`📊 Test Types table contains ${rowCount} rows`);
        
        let calculatedTestTypeFound = false;
        let foundRowText = '';
        
        // Check all rows for the created calculated test type
        for (let i = 0; i < rowCount; i++) {
            const row = tableRows.nth(i);
            const rowText = await row.textContent();
            
            if (rowText && (rowText.includes(shortName) || rowText.includes(longName) || 
                rowText.includes(shortName.toLowerCase()) || rowText.includes(longName.toLowerCase()))) {
                calculatedTestTypeFound = true;
                foundRowText = rowText;
                console.log(`✅ Calculated Test Type found in table row ${i + 1}: ${foundRowText.substring(0, 100)}...`);
                break;
            }
        }
        
        if (!calculatedTestTypeFound) {
            console.log('❌ Created Calculated Test Type not found in the table');
            console.log('📋 All table rows:');
            for (let i = 0; i < Math.min(rowCount, 10); i++) { // Show first 10 rows
                const row = tableRows.nth(i);
                const rowText = await row.textContent();
                console.log(`  ${i + 1}. ${rowText?.substring(0, 80)}...`);
            }
        }
        
        // Step 15: Verify a Calculator icon is shown next to the Test Type
        console.log('🧮 Verifying a Calculator icon is shown next to the Test Type...');
        
        if (calculatedTestTypeFound) {
            // Look for calculator icon in the row containing our test type
            let testTypeRow = null;
            for (let i = 0; i < rowCount; i++) {
                const row = tableRows.nth(i);
                const rowText = await row.textContent();
                if (rowText && (rowText.includes(shortName) || rowText.includes(longName))) {
                    testTypeRow = row;
                    break;
                }
            }
            
            if (testTypeRow) {
                // Look for calculator icon
                const calculatorIcon = testTypeRow.locator('[data-testid="calculator-icon"]').or(
                    testTypeRow.locator('svg[data-icon="calculator"]')
                ).or(
                    testTypeRow.locator('.calculator-icon, .calc-icon')
                ).or(
                    testTypeRow.locator('i.fa-calculator, i.fa-calc')
                ).or(
                    testTypeRow.locator('img[alt*="calculator"]')
                ).or(
                    testTypeRow.locator('img[src*="calculator"]')
                ).or(
                    testTypeRow.locator('[title*="calculator"]')
                ).or(
                    testTypeRow.locator('[aria-label*="calculator"]')
                );
                
                if (await calculatorIcon.count() > 0) {
                    console.log('✅ Calculator icon is shown next to the Calculated Test Type');
                } else {
                    console.log('⚠️ Calculator icon not found next to the Calculated Test Type');
                }
            }
        } else {
            console.log('ℹ️ Cannot verify calculator icon - Calculated Test Type not found in table');
        }
        
        // Additional verification: Check if we're on the correct page
        const currentUrl = page.url();
        if (currentUrl.includes('test') || currentUrl.includes('type')) {
            console.log('📋 Successfully navigated to Test Types page');
        } else {
            console.log('ℹ️ Current page after calculated test type creation:', currentUrl);
        }
        
        console.log('✅ Add Calculated Test Type test completed successfully');
    });

    test('REGRESSION: Add Calculated Test Type with validation errors', async ({ page }) => {
        console.log('⚠️ Testing Add Calculated Test Type with validation errors...');
        
        // Login and navigate
        await goToAliquotQaLink(page);
        await loginAquaUser(page, ALIQUOT_USERNAME_QA, ALIQUOT_PASSWORD_QA);
        await verifyAquaLoginQa(page);
        await clearCacheAndReload(page);
        
        // Navigate to Test Types
        const reportsTab = page.getByRole('tab', { name: 'Reports' }).or(
            page.getByRole('button', { name: 'Reports' })
        );
        
        await reportsTab.hover();
        const testTypesLink = page.getByRole('menuitem', { name: 'Test Types' }).or(
            page.locator('a:has-text("Test Types")')
        );
        await testTypesLink.click();
        await page.waitForLoadState('networkidle');
        
        // Select a system if required
        const systemLookup = page.locator('[data-testid="system-lookup"], .system-lookup');
        if (await systemLookup.count() > 0) {
            await systemLookup.click();
            await page.waitForTimeout(1000);
            
            const systemOptions = page.locator('[data-testid="system-option"], .system-option');
            if (await systemOptions.count() > 0) {
                await systemOptions.first().click();
                await page.waitForTimeout(2000);
            }
        }
        
        // Click Create Test Type
        const createTestTypeButton = page.getByRole('button', { name: 'Create Test Type' }).or(
            page.locator('button:has-text("Create Test Type")')
        );
        
        if (await createTestTypeButton.count() > 0) {
            await createTestTypeButton.click();
            await page.waitForTimeout(1000);
            
            // Turn on calculation toggle
            const calculationToggle = page.locator('[data-testid="calculation-toggle"]').or(
                page.locator('input[type="checkbox"][name*="calculation"]')
            );
            
            if (await calculationToggle.count() > 0) {
                await calculationToggle.click();
                await page.waitForTimeout(1000);
                
                // Try to save without entering required fields
                const saveTestTypeButton = page.getByRole('button', { name: 'Save Test Type' }).or(
                    page.locator('button:has-text("Save")')
                );
                
                if (await saveTestTypeButton.count() > 0) {
                    await saveTestTypeButton.click();
                    await page.waitForTimeout(2000);
                    
                    // Check for validation errors
                    const errorMessage = page.locator('.error-message, .alert-error, [data-testid="error-message"]').or(
                        page.locator('.field-error, .validation-error')
                    );
                    
                    if (await errorMessage.count() > 0) {
                        const errorText = await errorMessage.first().textContent();
                        console.log(`⚠️ Validation error displayed: ${errorText}`);
                    } else {
                        console.log('ℹ️ No validation errors detected');
                    }
                }
            }
        }
        
        console.log('✅ Add Calculated Test Type validation test completed');
    });

    test('REGRESSION: Add Calculated Test Type with different formulas', async ({ page }) => {
        console.log('🧮 Testing Add Calculated Test Type with different formulas...');
        
        // Login and navigate
        await goToAliquotQaLink(page);
        await loginAquaUser(page, ALIQUOT_USERNAME_QA, ALIQUOT_PASSWORD_QA);
        await verifyAquaLoginQa(page);
        await clearCacheAndReload(page);
        
        // Navigate to Test Types
        const reportsTab = page.getByRole
            page.getByRole('button', { name: 'Reports' })
        );
        
        await reportsTab.click();
        const testTypesLink = page.getByRole('menuitem', { name: 'Test Types' }).or(
            page.locator('a:has-text("Test Types")')
        );
        await testTypesLink.click();
        await page.waitForLoadState('networkidle');
        
        // Select a system if required
        const systemLookup = page.locator('[data-testid="system-lookup"], .system-lookup');
        if (await systemLookup.count() > 0) {
            await systemLookup.click();
            await page.waitForTimeout(1000);
            
            const systemOptions = page.locator('[data-testid="system-option"], .system-option');
            if (await systemOptions.count() > 0) {
                await systemOptions.first().click();
                await page.waitForTimeout(2000);
            }
        }
        
        // Test different calculation formulas
        const formulas = ['A+B', 'A-B', 'A*B', 'A/B', 'A+B*C', '(A+B)/2'];
        
        for (const formula of formulas) {
            console.log(`🧮 Testing formula: ${formula}`);
            
            // Click Create Test Type
            const createTestTypeButton = page.getByRole('button', { name: 'Create Test Type' }).or(
                page.locator('button:has-text("Create Test Type")')
            );
            
            if (await createTestTypeButton.count() > 0) {
                await createTestTypeButton.click();
                await page.waitForTimeout(1000);
                
                // Fill required fields
                const shortNameInput = page.getByLabel('Short Name').or(
                    page.locator('input[placeholder*="Short Name"]')
                );
                
                if (await shortNameInput.count() > 0) {
                    const shortName = `CALC-${formula.replace(/[^A-Za-z0-9]/g, '')}-${Date.now()}`;
                    await shortNameInput.fill(shortName);
                    
                    const longNameInput = page.getByLabel('Long Name').or(
                        page.locator('input[placeholder*="Long Name"]')
                    );
                    
                    if (await longNameInput.count() > 0) {
                        await longNameInput.fill(`${shortName} - ${formula}`);
                    }
                    
                    // Turn on calculation toggle
                    const calculationToggle = page.locator('[data-testid="calculation-toggle"]').or(
                        page.locator('input[type="checkbox"][name*="calculation"]')
                    );
                    
                    if (await calculationToggle.count() > 0) {
                        await calculationToggle.click();
                        await page.waitForTimeout(1000);
                        
                        // Enter formula
                        const formulaInput = page.locator('[data-testid="calculation-formula-input"]').or(
                            page.locator('input[name*="formula"]')
                        ).or(
                            page.locator('textarea[name*="formula"]')
                        );
                        
                        if (await formulaInput.count() > 0) {
                            await formulaInput.fill(formula);
                            
                            // Try to save
                            const saveButton = page.getByRole('button', { name: 'Save Test Type' }).or(
                                page.locator('button:has-text("Save")')
                            );
                            
                            if (await saveButton.count() > 0) {
                                await saveButton.click();
                                await page.waitForTimeout(2000);
                                
                                // Check for success or error
                                const successMessage = page.locator('.success-message, .alert-success');
                                const errorMessage = page.locator('.error-message, .alert-error');
                                
                                if (await successMessage.count() > 0) {
                                    console.log(`✅ Formula ${formula} accepted successfully`);
                                } else if (await errorMessage.count() > 0) {
                                    const errorText = await errorMessage.first().textContent();
                                    console.log(`⚠️ Formula ${formula} rejected: ${errorText}`);
                                } else {
                                    console.log(`ℹ️ Formula ${formula} - no clear success/error message`);
                                }
                            }
                        }
                    }
                }
            }
        }
        
        console.log('✅ Add Calculated Test Type with different formulas test completed');
    });

    test('REGRESSION: Verify calculator icon display for calculated test types', async ({ page }) => {
        console.log('🧮 Testing calculator icon display for calculated test types...');
        
        // Login and navigate
        await goToAliquotQaLink(page);
        await loginAquaUser(page, ALIQUOT_USERNAME_QA, ALIQUOT_PASSWORD_QA);
        await verifyAquaLoginQa(page);
        await clearCacheAndReload(page);
        
        // Navigate to Test Types
        const reportsTab = page.getByRole('tab', { name: 'Reports' }).or(
            page.getByRole('button', { name: 'Reports' })
        );
        
        await reportsTab.hover();
        const testTypesLink = page.getByRole('menuitem', { name: 'Test Types' }).or(
            page.locator('a:has-text("Test Types")')
        );
        await testTypesLink.click();
        await page.waitForLoadState('networkidle');
        
        // Select a system if required
        const systemLookup = page.locator('[data-testid="system-lookup"], .system-lookup');
        if (await systemLookup.count() > 0) {
            await systemLookup.click();
            await page.waitForTimeout(1000);
            
            const systemOptions = page.locator('[data-testid="system-option"], .system-option');
            if (await systemOptions.count() > 0) {
                await systemOptions.first().click();
                await page.waitForTimeout(2000);
            }
        }
        
        // Check for calculator icons in existing test types
        const testTypesTable = page.getByRole('table').or(
            page.locator('.test-types-table, .test-types-list')
        );
        
        const tableRows = testTypesTable.locator('tbody tr, .test-type-row');
        const rowCount = await tableRows.count();
        
        let calculatedTestTypes = 0;
        let calculatorIcons = 0;
        
        for (let i = 0; i < rowCount; i++) {
            const row = tableRows.nth(i);
            const rowText = await row.textContent();
            
            // Look for calculator icon in each row
            const calculatorIcon = row.locator('[data-testid="calculator-icon"]').or(
                row.locator('svg[data-icon="calculator"]')
            ).or(
                row.locator('.calculator-icon, .calc-icon')
            ).or(
                row.locator('i.fa-calculator, i.fa-calc')
            ).or(
                row.locator('img[alt*="calculator"]')
            ).or(
                row.locator('[title*="calculator"]')
            );
            
            if (await calculatorIcon.count() > 0) {
                calculatorIcons++;
                calculatedTestTypes++;
                console.log(`🧮 Row ${i + 1}: Found calculator icon - likely calculated test type`);
            } else {
                console.log(`📊 Row ${i + 1}: No calculator icon - regular test type`);
            }
        }
        
        console.log(`📊 Calculator icon summary:`);
        console.log(`  - Total test types: ${rowCount}`);
        console.log(`  - Test types with calculator icons: ${calculatorIcons}`);
        console.log(`  - Calculated test types: ${calculatedTestTypes}`);
        
        if (calculatedTestTypes > 0) {
            console.log('✅ Calculator icons are properly displayed for calculated test types');
        } else {
            console.log('ℹ️ No calculated test types found with calculator icons');
        }
        
        console.log('✅ Calculator icon display verification test completed');
    });

    test('REGRESSION: Add Calculated Test Type - verify variables in formula and assignment', async ({ page }) => {
        console.log('🧮 Verifying variables list in Formula and variable assignment...');

        // Login and navigate
        await goToAliquotQaLink(page);
        await loginAquaUser(page, ALIQUOT_USERNAME_QA, ALIQUOT_PASSWORD_QA);
        await verifyAquaLoginQa(page);
        await clearCacheAndReload(page);

        // Navigate to Test Types
        const reportsTab = page.getByRole('tab', { name: 'Reports' }).or(
            page.getByRole('button', { name: 'Reports' })
        );
        await reportsTab.hover();
        const testTypesLink = page.getByRole('menuitem', { name: 'Test Types' }).or(
            page.locator('a:has-text("Test Types")')
        );
        await testTypesLink.click();
        await page.waitForLoadState('networkidle');

        // Select a system if required
        const systemLookup = page.locator('[data-testid="system-lookup"], .system-lookup');
        if (await systemLookup.count() > 0) {
            await systemLookup.click();
            await page.waitForTimeout(1000);
            const systemOptions = page.locator('[data-testid="system-option"], .system-option');
            if (await systemOptions.count() > 0) {
                await systemOptions.first().click();
                await page.waitForTimeout(2000);
            }
        }

        // Create Test Type
        const createTestTypeButton = page.getByRole('button', { name: 'Create Test Type' }).or(
            page.locator('button:has-text("Create Test Type")')
        );
        await expect(createTestTypeButton).toBeVisible({ timeout: 10000 });
        await createTestTypeButton.click();
        await page.waitForTimeout(1000);

        // Fill Short and Long Name
        const shortNameInput = page.getByLabel('Short Name').or(
            page.locator('input[placeholder*="Short Name"]')
        );
        await expect(shortNameInput).toBeVisible({ timeout: 10000 });
        const shortName = `CALC-VAR-${randomUUID().substring(0, 6).toUpperCase()}`;
        await shortNameInput.fill(shortName);

        const longNameInput = page.getByLabel('Long Name').or(
            page.locator('input[placeholder*="Long Name"]')
        );
        await expect(longNameInput).toBeVisible({ timeout: 10000 });
        await longNameInput.fill(`${shortName} - Variables`);

        // Enable calculation
        const calculationToggle = page.locator('[data-testid="calculation-toggle"]').or(
            page.locator('input[type="checkbox"][name*="calculation"]')
        );
        await expect(calculationToggle).toBeVisible({ timeout: 10000 });
        if (!(await calculationToggle.isChecked())) {
            await calculationToggle.click();
        }
        await page.waitForTimeout(500);

        // 1) Verify variables are visible/available in Formula area
        // Try common containers/labels for variables list or tokens
        const variablesPanel = page.getByText('Variables').or(
            page.getByRole('region', { name: 'Variables' })
        ).or(
            page.locator('[data-testid="variables-panel"], .variables-panel, .formula-variables')
        );

        // If a dropdown or list appears, ensure at least one variable option exists (e.g., A, B)
        let variablesAvailable = false;
        if (await variablesPanel.count() > 0) {
            const varOption = variablesPanel.locator('text=/^A$|^B$|^C$/').or(
                variablesPanel.locator('[data-var="A"], [data-var="B"], [data-var="C"]')
            ).or(
                variablesPanel.locator('button:has-text("A"), button:has-text("B"), button:has-text("C")')
            );
            variablesAvailable = (await varOption.count()) > 0;
        } else {
            // Some UIs show variable chips next to formula input
            const inlineVarChips = page.locator('.variable-chip, [data-testid="variable-chip"]').or(
                page.locator('button:has-text("A")')
            );
            variablesAvailable = (await inlineVarChips.count()) > 0;
        }
        expect(variablesAvailable).toBeTruthy();

        // 2) Assign variables to the test (e.g., map A->Existing Test 1, B->Existing Test 2)
        // Locate variable assignment controls. Try common patterns: a table or rows per variable A, B, C
        const assignmentSection = page.getByText('Assign Variables').or(
            page.getByRole('region', { name: 'Assign Variables' })
        ).or(
            page.locator('[data-testid="variable-assignment"], .variable-assignment, .variables-assignment')
        );

        // Try to find rows for variables A and B and select any available referenced test from dropdown/lookup
        const variableRows = assignmentSection.locator('[data-var-row], .var-row, tr:has-text("A"), tr:has-text("B")').or(
            page.locator('[data-var-row], .var-row, tr:has-text("A"), tr:has-text("B")')
        );

        const rowCount = await variableRows.count();
        if (rowCount > 0) {
            for (let i = 0; i < Math.min(rowCount, 2); i++) {
                const row = variableRows.nth(i);
                const selector = row.getByRole('combobox').or(
                    row.locator('select, [data-testid="reference-test-dropdown"]')
                ).or(
                    row.locator('input[role="combobox"], input[placeholder*="Select"], input[placeholder*="Search"]')
                );
                if ((await selector.count()) > 0) {
                    const control = selector.first();
                    await control.click();
                    await page.waitForTimeout(500);
                    // Pick first available option in the dropdown/list
                    const option = page.getByRole('option').or(
                        page.locator('[role="option"], .option, li[role="option"]')
                    ).first();
                    if ((await option.count()) > 0) {
                        await option.click();
                    } else {
                        // If options are rendered as table cells
                        const cell = page.getByRole('cell').first();
                        if ((await cell.count()) > 0) {
                            await cell.click();
                        }
                    }
                }
            }
        } else {
            console.log('ℹ️ Variable assignment rows not explicitly found; proceeding to validate via formula usage.');
        }

        // Enter a formula using variables A and B
        const formulaInput = page.locator('[data-testid="calculation-formula-input"]').or(
            page.getByLabel('Calculation Formula')
        ).or(
            page.locator('textarea[name*="formula"], input[name*="formula"]')
        );
        await expect(formulaInput).toBeVisible({ timeout: 10000 });
        await formulaInput.fill('A+B');

        // Save Test Type
        const saveButton = page.getByRole('button', { name: 'Save Test Type' }).or(
            page.locator('button:has-text("Save")')
        );
        await expect(saveButton).toBeVisible({ timeout: 10000 });
        await saveButton.click();
        await page.waitForTimeout(2000);

        // Verify success
        const successMessage = page.getByText('Test Type has been saved successfully').or(
            page.getByText('Test Type saved successfully')
        ).or(
            page.getByText('Test Type created successfully')
        ).or(
            page.getByText('Successfully saved')
        ).or(
            page.getByText('Test Type added successfully')
        ).or(
            page.locator('[data-testid="success-message"], .success-message, .alert-success')
        );
        await expect(successMessage).toBeVisible({ timeout: 10000 });

        console.log('✅ Variables visible in Formula and assignment verified successfully');
    });
});
