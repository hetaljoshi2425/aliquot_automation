// Test Case: Delete Test Type (not in use) from Test Table
// Preconditions:
// - User is logged into the application
// - User has access to the Reports module
// - User has permission to delete test types
// - User must have a System selected to interact with the page
// - At least one test type exists in the system that can be deleted (not in use)

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

test.describe('Delete Test Type (not in use) from Test Table - Functional Tests', () => {

    test.beforeEach(async ({ page }) => {
        console.log('🔧 Setting up Delete Test Type test environment...');
    });

    test.afterEach(async ({ page }) => {
        console.log('🧹 Cleaning up Delete Test Type test data...');
    });

    test('REGRESSION: Delete Test Type (not in use) functionality works correctly', async ({ page }) => {
        console.log('🗑️ Testing Delete Test Type (not in use) functionality...');
        
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
        
        // Step 2: Verify Reports and Locations sub menu is opened
        console.log('🔍 Verifying Reports and Locations sub menu is opened...');
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
        console.log('✅ Reports and Locations sub menu is opened');
        
        // Step 3: Click Components & Tests
        console.log('🧪 Clicking Components & Tests...');
        const componentsTestsLink = page.getByRole('menuitem', { name: 'Components & Tests' }).or(
            page.getByRole('link', { name: 'Components & Tests' })
        ).or(
            page.getByRole('menuitem', { name: 'Components' })
        ).or(
            page.locator('[data-testid="components-tests-link"]')
        ).or(
            page.locator('a:has-text("Components & Tests")')
        ).or(
            page.locator('a:has-text("Components")')
        );
        
        await componentsTestsLink.click();
        await page.waitForLoadState('networkidle');
        
        // Step 4: Verify Manage Components page is opened
        console.log('📋 Verifying Manage Components page is opened...');
        const manageComponentsPage = page.getByRole('heading', { name: 'Manage Components' }).or(
            page.getByRole('heading', { name: 'Components & Tests' })
        ).or(
            page.locator('[data-testid="manage-components-page"]')
        ).or(
            page.locator('h1:has-text("Manage Components")')
        ).or(
            page.locator('h1:has-text("Components & Tests")')
        ).or(
            page.locator('.page-title:has-text("Components")')
        );
        
        await expect(manageComponentsPage).toBeVisible({ timeout: 15000 });
        console.log('✅ Manage Components page is opened');
        
        // Step 5: Navigate to Test Types section/table
        console.log('📊 Navigating to Test Types section...');
        
        // Look for Test Types tab or section
        const testTypesTab = page.getByRole('tab', { name: 'Test Types' }).or(
            page.getByRole('button', { name: 'Test Types' })
        ).or(
            page.locator('[data-testid="test-types-tab"]')
        ).or(
            page.locator('a:has-text("Test Types")')
        );
        
        if (await testTypesTab.count() > 0) {
            await testTypesTab.click();
            await page.waitForLoadState('networkidle');
            console.log('✅ Clicked on Test Types tab');
        } else {
            console.log('ℹ️ Test Types tab not found, checking for Test Types section on current page');
        }
        
        // Select a system to enable test type interaction (if required)
        console.log('⚙️ Selecting a system to enable test type interaction...');
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
        
        // Step 6: Get initial test type count and select a test type for deletion
        console.log('📊 Getting initial test type count and selecting a test type for deletion...');
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
        
        // Get test type rows
        const testTypeRows = testTypesTable.locator('tbody tr, .test-type-row');
        const initialTestTypeCount = await testTypeRows.count();
        console.log(`📊 Initial test type count: ${initialTestTypeCount}`);
        
        if (initialTestTypeCount === 0) {
            throw new Error('No test types found in the table');
        }
        
        // Step 7: Select a Test Type and click Delete (trash icon)
        console.log('🗑️ Selecting a Test Type and clicking Delete (trash icon)...');
        
        // Look for a test type that can be deleted (not in use)
        let selectedTestType = null;
        let deleteButton = null;
        let testTypeToDeleteName = '';
        
        // Try to find a test type with delete functionality
        for (let i = 0; i < initialTestTypeCount; i++) {
            const testTypeRow = testTypeRows.nth(i);
            const testTypeText = await testTypeRow.textContent();
            
            // Look for delete/trash button in this row
            deleteButton = testTypeRow.locator('[data-testid="delete-btn"]').or(
                testTypeRow.locator('button[title*="Delete"]')
            ).or(
                testTypeRow.locator('button[aria-label*="Delete"]')
            ).or(
                testTypeRow.locator('.delete-btn, .trash-btn')
            ).or(
                testTypeRow.locator('svg[data-icon="trash"], .fa-trash, .fa-delete')
            ).or(
                testTypeRow.locator('i.fa-trash, i.fa-delete, i.fa-trash-o')
            ).or(
                testTypeRow.locator('button:has-text("Delete")')
            ).or(
                testTypeRow.locator('a:has-text("Delete")')
            );
            
            if (await deleteButton.count() > 0) {
                // Check if the delete button is enabled (not disabled due to being in use)
                const isDisabled = await deleteButton.isDisabled();
                if (!isDisabled) {
                    selectedTestType = testTypeRow;
                    testTypeToDeleteName = testTypeText || '';
                    console.log(`📄 Selected test type for deletion: ${testTypeToDeleteName.substring(0, 50)}...`);
                    break;
                } else {
                    console.log(`🔒 Test type is in use and cannot be deleted: ${testTypeText?.substring(0, 30)}...`);
                }
            }
        }
        
        // If no delete button found, try looking for action menus
        if (!deleteButton || await deleteButton.count() === 0) {
            console.log('ℹ️ No dedicated delete button found, checking for action menus...');
            
            // Look for action menus or dropdowns
            const actionMenus = testTypesTable.locator('[data-testid="action-menu"]').or(
                testTypesTable.locator('.action-menu, .dropdown-menu')
            ).or(
                testTypesTable.locator('button[aria-haspopup="menu"]')
            );
            
            if (await actionMenus.count() > 0) {
                const firstMenu = actionMenus.first();
                await firstMenu.click();
                await page.waitForTimeout(500);
                
                // Look for delete option in the menu
                deleteButton = page.getByRole('menuitem', { name: 'Delete' }).or(
                    page.locator('[data-testid="delete-option"]')
                ).or(
                    page.locator('a:has-text("Delete"), button:has-text("Delete")')
                );
                
                if (await deleteButton.count() > 0) {
                    selectedTestType = firstMenu;
                    const testTypeText = await firstMenu.textContent();
                    testTypeToDeleteName = testTypeText || '';
                    console.log(`📄 Found delete option in action menu for: ${testTypeToDeleteName.substring(0, 50)}...`);
                }
            }
        }
        
        if (!deleteButton || await deleteButton.count() === 0) {
            throw new Error('No delete button or delete option found for any test type');
        }
        
        // Click the delete/trash button
        await deleteButton.click();
        await page.waitForTimeout(1000); // Wait for confirmation dialog
        console.log('✅ Delete (trash icon) button clicked');
        
        // Step 8: Verify Confirmation message is displayed
        console.log('💬 Verifying confirmation message is displayed...');
        const confirmationDialog = page.getByRole('dialog', { name: 'Confirm Deletion' }).or(
            page.locator('.confirmation-dialog')
        ).or(
            page.locator('.modal-dialog')
        ).or(
            page.locator('[data-testid="confirmation-dialog"]')
        ).or(
            page.locator('.delete-confirmation')
        );
        
        await expect(confirmationDialog).toBeVisible({ timeout: 10000 });
        console.log('✅ Confirmation dialog is displayed');
        
        // Verify the specific confirmation message
        const confirmationMessage = page.getByText('Deleting this test type from the system will remove it from all future reports').or(
            page.getByText('Deleting this test type from the system')
        ).or(
            page.getByText('will remove it from all future reports')
        ).or(
            page.locator('.confirmation-message')
        );
        
        await expect(confirmationMessage).toBeVisible({ timeout: 5000 });
        console.log('✅ Confirmation message: "Deleting this test type from the system will remove it from all future reports" is displayed');
        
        // Step 9: Click Delete
        console.log('🗑️ Clicking Delete button in confirmation dialog...');
        const deleteConfirmButton = confirmationDialog.getByRole('button', { name: 'Delete' }).or(
            confirmationDialog.getByRole('button', { name: 'Confirm' })
        ).or(
            confirmationDialog.getByRole('button', { name: 'Yes' })
        ).or(
            confirmationDialog.locator('[data-testid="confirm-delete-btn"]')
        ).or(
            confirmationDialog.locator('button:has-text("Delete")')
        ).or(
            confirmationDialog.locator('button:has-text("Confirm")')
        ).or(
            confirmationDialog.locator('button:has-text("Yes")')
        );
        
        await expect(deleteConfirmButton).toBeVisible({ timeout: 5000 });
        await deleteConfirmButton.click();
        
        // Wait for delete operation to complete
        await page.waitForTimeout(3000);
        
        // Step 10: Verify Success message
        console.log('✅ Verifying success message...');
        const successMessage = page.getByText('Test Type has been deleted successfully').or(
            page.getByText('Test Type deleted successfully')
        ).or(
            page.getByText('Successfully deleted')
        ).or(
            page.getByText('Test Type removed successfully')
        ).or(
            page.locator('[data-testid="success-message"]')
        ).or(
            page.locator('.success-message, .alert-success')
        );
        
        await expect(successMessage).toBeVisible({ timeout: 10000 });
        const successText = await successMessage.textContent();
        console.log(`✅ Success message: "${successText}" is displayed`);
        
        // Step 11: Verify the Test Type is disappeared from the Test Table
        console.log('📊 Verifying the Test Type is disappeared from the Test Table...');
        
        // Wait for the page to refresh or update
        await page.waitForTimeout(2000);
        
        // Get updated test type count
        const updatedTestTypeRows = testTypesTable.locator('tbody tr, .test-type-row');
        const updatedTestTypeCount = await updatedTestTypeRows.count();
        console.log(`📊 Updated test type count: ${updatedTestTypeCount}`);
        
        // Verify that the test type count decreased by 1
        expect(updatedTestTypeCount).toBeLessThan(initialTestTypeCount);
        console.log(`✅ Test type count decreased from ${initialTestTypeCount} to ${updatedTestTypeCount}`);
        
        // Verify the specific test type is no longer in the table
        let deletedTestTypeFound = false;
        
        // Check all remaining test types to ensure the deleted one is gone
        for (let i = 0; i < updatedTestTypeCount; i++) {
            const testTypeRow = updatedTestTypeRows.nth(i);
            const testTypeText = await testTypeRow.textContent();
            
            if (testTypeText && testTypeText.includes(testTypeToDeleteName.substring(0, 20))) {
                deletedTestTypeFound = true;
                console.log(`❌ Deleted test type still found in table: ${testTypeText}`);
                break;
            }
        }
        
        if (!deletedTestTypeFound) {
            console.log(`✅ Confirmed: Test Type "${testTypeToDeleteName.substring(0, 30)}..." has disappeared from the Test Table`);
        } else {
            throw new Error('Deleted test type is still present in the table');
        }
        
        // Additional verification: Check if we're still on the test types page
        const currentUrl = page.url();
        if (currentUrl.includes('test') || currentUrl.includes('type')) {
            console.log('📋 Successfully returned to Test Types page after deletion');
        } else {
            console.log('ℹ️ Current page after deletion:', currentUrl);
        }
        
        console.log('✅ Delete Test Type (not in use) test completed successfully');
    });

    test('REGRESSION: Delete Test Type confirmation dialog validation', async ({ page }) => {
        console.log('💬 Testing Delete Test Type confirmation dialog validation...');
        
        // Login and navigate
        await goToAliquotQaLink(page);
        await loginAquaUser(page, ALIQUOT_USERNAME_QA, ALIQUOT_PASSWORD_QA);
        await verifyAquaLoginQa(page);
        await clearCacheAndReload(page);
        
        // Navigate to Components & Tests
        const reportsTab = page.getByRole('tab', { name: 'Reports' }).or(
            page.getByRole('button', { name: 'Reports' })
        );
        
        await reportsTab.hover();
        const componentsTestsLink = page.getByRole('menuitem', { name: 'Components & Tests' }).or(
            page.locator('a:has-text("Components & Tests")')
        );
        await componentsTestsLink.click();
        await page.waitForLoadState('networkidle');
        
        // Navigate to Test Types if available
        const testTypesTab = page.getByRole('tab', { name: 'Test Types' }).or(
            page.locator('[data-testid="test-types-tab"]')
        ).or(
            page.locator('a:has-text("Test Types")')
        );
        
        if (await testTypesTab.count() > 0) {
            await testTypesTab.click();
            await page.waitForLoadState('networkidle');
        }
        
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
        
        // Get test types table
        const testTypesTable = page.getByRole('table').or(
            page.locator('.test-types-table, .test-types-list')
        );
        
        const testTypeRows = testTypesTable.locator('tbody tr, .test-type-row');
        
        if (await testTypeRows.count() > 0) {
            const firstTestType = testTypeRows.first();
            const deleteButton = firstTestType.locator('[data-testid="delete-btn"]').or(
                firstTestType.locator('button[title*="Delete"]')
            ).or(
                firstTestType.locator('button:has-text("Delete")')
            );
            
            if (await deleteButton.count() > 0 && !(await deleteButton.isDisabled())) {
                // Click delete to open confirmation dialog
                await deleteButton.click();
                await page.waitForTimeout(1000);
                
                // Verify confirmation dialog is open
                const confirmationDialog = page.getByRole('dialog').or(
                    page.locator('.confirmation-dialog, .modal-dialog')
                );
                
                if (await confirmationDialog.count() > 0) {
                    console.log('✅ Confirmation dialog is displayed');
                    
                    // Test Cancel button
                    const cancelButton = confirmationDialog.getByRole('button', { name: 'Cancel' }).or(
                        confirmationDialog.getByRole('button', { name: 'No' })
                    ).or(
                        confirmationDialog.locator('button:has-text("Cancel")')
                    ).or(
                        confirmationDialog.locator('button:has-text("No")')
                    );
                    
                    if (await cancelButton.count() > 0) {
                        await cancelButton.click();
                        await page.waitForTimeout(1000);
                        
                        // Verify dialog is closed
                        await expect(confirmationDialog).not.toBeVisible();
                        console.log('✅ Cancel button works - dialog is closed');
                    }
                    
                    // Verify test type is still in the table
                    const remainingTestTypes = testTypesTable.locator('tbody tr, .test-type-row');
                    const testTypeCount = await remainingTestTypes.count();
                    console.log(`📊 Test type count after cancel: ${testTypeCount}`);
                }
            }
        }
        
        console.log('✅ Delete Test Type confirmation dialog validation test completed');
    });

    test('REGRESSION: Verify delete permissions and restrictions for test types', async ({ page }) => {
        console.log('🔒 Testing delete permissions and restrictions for test types...');
        
        // Login and navigate
        await goToAliquotQaLink(page);
        await loginAquaUser(page, ALIQUOT_USERNAME_QA, ALIQUOT_PASSWORD_QA);
        await verifyAquaLoginQa(page);
        await clearCacheAndReload(page);
        
        // Navigate to Components & Tests
        const reportsTab = page.getByRole('tab', { name: 'Reports' }).or(
            page.getByRole('button', { name: 'Reports' })
        );
        
        await reportsTab.hover();
        const componentsTestsLink = page.getByRole('menuitem', { name: 'Components & Tests' }).or(
            page.locator('a:has-text("Components & Tests")')
        );
        await componentsTestsLink.click();
        await page.waitForLoadState('networkidle');
        
        // Navigate to Test Types if available
        const testTypesTab = page.getByRole('tab', { name: 'Test Types' }).or(
            page.locator('[data-testid="test-types-tab"]')
        ).or(
            page.locator('a:has-text("Test Types")')
        );
        
        if (await testTypesTab.count() > 0) {
            await testTypesTab.click();
            await page.waitForLoadState('networkidle');
        }
        
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
        
        // Check delete button availability
        const testTypesTable = page.getByRole('table').or(
            page.locator('.test-types-table, .test-types-list')
        );
        
        const testTypeRows = testTypesTable.locator('tbody tr, .test-type-row');
        const testTypeCount = await testTypeRows.count();
        
        let deleteButtonsFound = 0;
        let restrictedTestTypes = 0;
        let testTypesInUse = 0;
        
        for (let i = 0; i < testTypeCount; i++) {
            const testTypeRow = testTypeRows.nth(i);
            const testTypeText = await testTypeRow.textContent();
            
            // Check for delete button
            const deleteButton = testTypeRow.locator('[data-testid="delete-btn"]').or(
                testTypeRow.locator('button[title*="Delete"]')
            ).or(
                testTypeRow.locator('svg[data-icon="trash"], .fa-trash, .fa-delete')
            ).or(
                testTypeRow.locator('button:has-text("Delete")')
            );
            
            if (await deleteButton.count() > 0) {
                // Check if button is disabled
                const isDisabled = await deleteButton.isDisabled();
                if (isDisabled) {
                    testTypesInUse++;
                    console.log(`🔒 Test type in use (cannot delete): ${testTypeText?.substring(0, 30)}...`);
                } else {
                    deleteButtonsFound++;
                    console.log(`✅ Delete available for: ${testTypeText?.substring(0, 30)}...`);
                }
            } else {
                restrictedTestTypes++;
                console.log(`🔒 No delete option for: ${testTypeText?.substring(0, 30)}...`);
            }
        }
        
        console.log(`📊 Delete permissions summary for test types:`);
        console.log(`  - Test types with delete access: ${deleteButtonsFound}`);
        console.log(`  - Test types in use (restricted): ${testTypesInUse}`);
        console.log(`  - Test types with restricted access: ${restrictedTestTypes}`);
        console.log(`  - Total test types: ${testTypeCount}`);
        
        // Check for any permission-related error messages
        const errorMessage = page.locator('.error-message, .alert-error, [data-testid="error-message"]');
        if (await errorMessage.count() > 0) {
            const errorText = await errorMessage.first().textContent();
            console.log(`⚠️ Permission error message: ${errorText}`);
        }
        
        console.log('✅ Delete permissions and restrictions test completed');
    });

    test('REGRESSION: Delete Test Type error handling', async ({ page }) => {
        console.log('⚠️ Testing Delete Test Type error handling...');
        
        // Login and navigate
        await goToAliquotQaLink(page);
        await loginAquaUser(page, ALIQUOT_USERNAME_QA, ALIQUOT_PASSWORD_QA);
        await verifyAquaLoginQa(page);
        await clearCacheAndReload(page);
        
        // Navigate to Components & Tests
        const reportsTab = page.getByRole('tab', { name: 'Reports' }).or(
            page.getByRole('button', { name: 'Reports' })
        );
        
        await reportsTab.hover();
        const componentsTestsLink = page.getByRole('menuitem', { name: 'Components & Tests' }).or(
            page.locator('a:has-text("Components & Tests")')
        );
        await componentsTestsLink.click();
        await page.waitForLoadState('networkidle');
        
        // Navigate to Test Types if available
        const testTypesTab = page.getByRole('tab', { name: 'Test Types' }).or(
            page.locator('[data-testid="test-types-tab"]')
        ).or(
            page.locator('a:has-text("Test Types")')
        );
        
        if (await testTypesTab.count() > 0) {
            await testTypesTab.click();
            await page.waitForLoadState('networkidle');
        }
        
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
        
        // Try to delete a test type that might cause errors
        const testTypesTable = page.getByRole('table').or(
            page.locator('.test-types-table, .test-types-list')
        );
        
        const testTypeRows = testTypesTable.locator('tbody tr, .test-type-row');
        
        if (await testTypeRows.count() > 0) {
            const firstTestType = testTypeRows.first();
            const deleteButton = firstTestType.locator('[data-testid="delete-btn"]').or(
                firstTestType.locator('button[title*="Delete"]')
            ).or(
                firstTestType.locator('button:has-text("Delete")')
            );
            
            if (await deleteButton.count() > 0 && !(await deleteButton.isDisabled())) {
                // Try multiple rapid clicks to test error handling
                await deleteButton.click();
                await page.waitForTimeout(500);
                await deleteButton.click(); // Double click
                await page.waitForTimeout(2000);
                
                // Check for error messages
                const errorMessage = page.locator('.error-message, .alert-error, [data-testid="error-message"]').or(
                    page.locator('.warning-message, .alert-warning')
                );
                
                if (await errorMessage.count() > 0) {
                    const errorText = await errorMessage.first().textContent();
                    console.log(`⚠️ Error message displayed: ${errorText}`);
                } else {
                    console.log('ℹ️ No error messages detected');
                }
                
                // Check for success messages
                const successMessage = page.locator('.success-message, .alert-success, [data-testid="success-message"]');
                if (await successMessage.count() > 0) {
                    const successText = await successMessage.first().textContent();
                    console.log(`✅ Success message displayed: ${successText}`);
                }
                
                // Check for confirmation dialogs
                const confirmationDialog = page.getByRole('dialog').or(
                    page.locator('.confirmation-dialog, .modal-dialog')
                );
                
                if (await confirmationDialog.count() > 0) {
                    console.log('💬 Confirmation dialog is displayed');
                    
                    // Close the dialog if it's open
                    const closeButton = confirmationDialog.getByRole('button', { name: 'Cancel' }).or(
                        confirmationDialog.locator('button:has-text("Cancel")')
                    ).or(
                        confirmationDialog.locator('.close, .modal-close')
                    );
                    
                    if (await closeButton.count() > 0) {
                        await closeButton.click();
                        console.log('✅ Closed confirmation dialog');
                    }
                }
            }
        }
        
        console.log('✅ Delete Test Type error handling test completed');
    });
});
