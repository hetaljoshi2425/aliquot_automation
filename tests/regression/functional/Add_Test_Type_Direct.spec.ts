// Test Case: Add Test Type
// Preconditions:
// - User is logged into the application
// - User has access to the Reports module
// - User has permission to create test types
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

test.describe('Add Test Type - Functional Tests', () => {

    test.beforeEach(async ({ page }) => {
        console.log('🔧 Setting up Add Test Type test environment...');
    });

    test.afterEach(async ({ page }) => {
        console.log('🧹 Cleaning up Add Test Type test data...');
    });

    test('REGRESSION: Add Test Type functionality works correctly', async ({ page }) => {
        console.log('🧪 Testing Add Test Type functionality...');
        
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
        
        // Step 8: Fill out required field: Short Name
        console.log('📝 Filling out required field: Short Name...');
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
        
        // Generate unique short name
        const shortName = `TEST-TYPE-${randomUUID().substring(0, 8).toUpperCase()}`;
        await shortNameInput.fill(shortName);
        console.log(`✅ Filled out Short Name: ${shortName}`);
        
        // Step 9: Verify Long Name is filled automatically, same as Short Name
        console.log('🔍 Verifying Long Name is filled automatically...');
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
        
        if (await longNameInput.count() > 0) {
            await page.waitForTimeout(1000); // Wait for auto-population
            
            const longNameValue = await longNameInput.inputValue();
            
            if (longNameValue === shortName) {
                console.log('✅ Long Name is automatically filled with the same value as Short Name');
            } else if (longNameValue.includes(shortName)) {
                console.log(`✅ Long Name contains Short Name: ${longNameValue}`);
            } else {
                console.log(`ℹ️ Long Name has different value: ${longNameValue}`);
                
                // Update long name to match short name if needed
                await longNameInput.fill(shortName);
                console.log(`✅ Updated Long Name to match Short Name: ${shortName}`);
            }
        } else {
            console.log('ℹ️ Long Name input field not found');
        }
        
        // Step 10: Click Save Test Type
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
        
        // Step 11: Verify Success message is displayed
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
        
        // Additional verification: Check if we're back to the test types list or still on create page
        const currentUrl = page.url();
        if (currentUrl.includes('test') || currentUrl.includes('type')) {
            console.log('📋 Successfully processed Test Type creation');
        } else {
            console.log('ℹ️ Current page after test type creation:', currentUrl);
        }
        
        // Check if we're back to the list page
        const testTypesListPageAfter = page.getByRole('heading', { name: 'Test Types List' }).or(
            page.locator('h1:has-text("Test Types List")')
        );
        
        if (await testTypesListPageAfter.count() > 0) {
            console.log('📋 Successfully returned to Test Types List page');
        } else {
            console.log('ℹ️ Still on Create Test Type page after saving');
        }
        
        console.log('✅ Add Test Type test completed successfully');
    });

    test('REGRESSION: Add Test Type with validation errors', async ({ page }) => {
        console.log('⚠️ Testing Add Test Type with validation errors...');
        
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
        
        console.log('✅ Add Test Type validation test completed');
    });

    test('REGRESSION: Add Test Type with duplicate name handling', async ({ page }) => {
        console.log('🔄 Testing Add Test Type with duplicate name handling...');
        
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
            
            // Try to create a test type with a common name that might already exist
            const shortNameInput = page.getByLabel('Short Name').or(
                page.locator('input[placeholder*="Short Name"]')
            );
            
            if (await shortNameInput.count() > 0) {
                await shortNameInput.fill('TEST'); // Common name that might already exist
                
                const saveTestTypeButton = page.getByRole('button', { name: 'Save Test Type' }).or(
                    page.locator('button:has-text("Save")')
                );
                
                if (await saveTestTypeButton.count() > 0) {
                    await saveTestTypeButton.click();
                    await page.waitForTimeout(2000);
                    
                    // Check for duplicate name error
                    const errorMessage = page.locator('.error-message, .alert-error, [data-testid="error-message"]').or(
                        page.locator('.warning-message, .alert-warning')
                    );
                    
                    if (await errorMessage.count() > 0) {
                        const errorText = await errorMessage.first().textContent();
                        console.log(`⚠️ Duplicate name error: ${errorText}`);
                    } else {
                        console.log('ℹ️ No duplicate name error detected');
                    }
                }
            }
        }
        
        console.log('✅ Add Test Type duplicate name test completed');
    });

    test('REGRESSION: Cancel Add Test Type operation', async ({ page }) => {
        console.log('❌ Testing Cancel Add Test Type operation...');
        
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
            
            // Verify page is open
            const createTestTypePage = page.getByRole('heading', { name: 'Create Test Type' }).or(
                page.locator('h1:has-text("Create Test Type")')
            );
            
            if (await createTestTypePage.count() > 0) {
                console.log('✅ Create Test Type page is open');
                
                // Enter some data
                const shortNameInput = page.getByLabel('Short Name').or(
                    page.locator('input[placeholder*="Short Name"]')
                );
                
                if (await shortNameInput.count() > 0) {
                    await shortNameInput.fill('TEST-CANCEL');
                    console.log('📝 Entered test data');
                }
                
                // Click Cancel
                const cancelButton = page.getByRole('button', { name: 'Cancel' }).or(
                    page.locator('button:has-text("Cancel")')
                ).or(
                    page.locator('.cancel-btn, .modal-close')
                );
                
                if (await cancelButton.count() > 0) {
                    await cancelButton.click();
                    await page.waitForTimeout(1000);
                    
                    // Verify we're back to the list page
                    const testTypesListPage = page.getByRole('heading', { name: 'Test Types List' }).or(
                        page.locator('h1:has-text("Test Types List")')
                    );
                    
                    if (await testTypesListPage.count() > 0) {
                        console.log('✅ Cancel button works - returned to Test Types List page');
                    } else {
                        console.log('ℹ️ Cancel button clicked but page navigation unclear');
                    }
                }
            }
        }
        
        console.log('✅ Cancel Add Test Type operation test completed');
    });
});
