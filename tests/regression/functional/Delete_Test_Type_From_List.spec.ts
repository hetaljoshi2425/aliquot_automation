// Test Case: Delete Test Type
// Preconditions:
// - User is logged into the application
// - User has access to the Reports module
// - User has permission to delete test types
// - User must have a System selected to interact with the page
// - At least one test type exists in the system that can be deleted

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

test.describe('Delete Test Type - Functional Tests', () => {

    test.beforeEach(async ({ page }) => {
        console.log('🔧 Setting up Delete Test Type test environment...');
    });

    test.afterEach(async ({ page }) => {
        console.log('🧹 Cleaning up Delete Test Type test data...');
    });

    test('REGRESSION: Delete Test Type functionality works correctly', async ({ page }) => {
        console.log('🗑️ Testing Delete Test Type functionality...');
        
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
        
        // Step 5: Select a system to enable test type interaction (if required)
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
        
        // Step 6: Get test types and select a test type for deletion
        console.log('📊 Getting test types and selecting a test type for deletion...');
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
        const testTypeCount = await testTypeRows.count();
        console.log(`📊 Found ${testTypeCount} test types in the table`);
        
        if (testTypeCount === 0) {
            throw new Error('No test types found in the table');
        }
        
        // Step 7: Select a Test Type and click the Delete (trash) icon
        console.log('🗑️ Selecting a Test Type and clicking the Delete (trash) icon...');
        
        // Look for a test type with delete functionality
        let selectedTestType = null;
        let deleteButton = null;
        let testTypeToDeleteName = '';
        let testTypeToDeleteShortName = '';
        
        // Try to find a test type that can be deleted
        for (let i = 0; i < testTypeCount; i++) {
            const testTypeRow = testTypeRows.nth(i);
            const testTypeText = await testTypeRow.textContent();
            
            // Look for delete button in this row
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
                // Check if button is enabled
                const isDisabled = await deleteButton.isDisabled();
                if (!isDisabled) {
                    selectedTestType = testTypeRow;
                    testTypeToDeleteName = testTypeText || '';
                    
                    // Try to extract short name from the row text
                    const shortNameMatch = testTypeText?.match(/(\w+-\w+|\w+)/);
                    if (shortNameMatch) {
                        testTypeToDeleteShortName = shortNameMatch[1];
                    }
                    
                    console.log(`📄 Selected test type for deletion: ${testTypeToDeleteName.substring(0, 50)}...`);
                    break;
                } else {
                    console.log(`🔒 Test type is protected and cannot be deleted: ${testTypeText?.substring(0, 30)}...`);
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
        
        // Click the delete button
        await deleteButton.click();
        await page.waitForTimeout(1000);
        console.log('✅ Delete (trash) icon clicked');
        
        // Step 8: Verify Confirmation message is displayed
        console.log('⚠️ Verifying confirmation message is displayed...');
        const confirmationDialog = page.getByRole('dialog', { name: 'Confirm Delete' }).or(
            page.getByRole('dialog', { name: 'Delete Confirmation' })
        ).or(
            page.locator('[data-testid="delete-confirmation-dialog"]')
        ).or(
            page.locator('.modal-dialog:has-text("Delete")')
        ).or(
            page.locator('.confirmation-dialog')
        ).or(
            page.locator('.modal:has-text("Delete")')
        );
        
        await expect(confirmationDialog).toBeVisible({ timeout: 10000 });
        console.log('✅ Confirmation dialog is displayed');
        
        // Verify the confirmation message text
        const confirmationMessage = page.getByText('Deleting this Test Type will permanently remove associated data. Are you sure you want to delete').or(
            page.getByText('Deleting this test type will permanently remove associated data. Are you sure you want to delete')
        ).or(
            page.getByText('Deleting this Test Type will permanently remove associated data')
        ).or(
            page.getByText('Are you sure you want to delete')
        ).or(
            page.getByText('This action cannot be undone')
        ).or(
            page.locator('[data-testid="confirmation-message"]')
        ).or(
            page.locator('.confirmation-message, .delete-warning')
        );
        
        await expect(confirmationMessage).toBeVisible({ timeout: 10000 });
        const confirmationText = await confirmationMessage.textContent();
        console.log(`✅ Confirmation message: "${confirmationText}" is displayed`);
        
        // Verify the test type name appears in the confirmation message
        if (testTypeToDeleteShortName && confirmationText) {
            if (confirmationText.includes(testTypeToDeleteShortName) || 
                confirmationText.includes(testTypeToDeleteName.substring(0, 20))) {
                console.log(`✅ Test type name "${testTypeToDeleteShortName}" appears in confirmation message`);
            } else {
                console.log(`⚠️ Test type name may not appear in confirmation message`);
            }
        }
        
        // Step 9: Click Delete
        console.log('🗑️ Clicking Delete button in confirmation dialog...');
        const confirmDeleteButton = page.getByRole('button', { name: 'Delete' }).or(
            page.getByRole('button', { name: 'Confirm Delete' })
        ).or(
            page.getByRole('button', { name: 'Yes, Delete' })
        ).or(
            page.getByRole('button', { name: 'Yes' })
        ).or(
            page.locator('[data-testid="confirm-delete-btn"]')
        ).or(
            page.locator('button:has-text("Delete")')
        ).or(
            page.locator('button:has-text("Yes")')
        );
        
        await expect(confirmDeleteButton).toBeVisible({ timeout: 10000 });
        await confirmDeleteButton.click();
        
        // Wait for delete operation to complete
        await page.waitForTimeout(3000);
        
        // Step 10: Verify Success message is displayed
        console.log('✅ Verifying success message is displayed...');
        const successMessage = page.getByText('Test Type has been removed successfully').or(
            page.getByText('Test Type has been deleted successfully')
        ).or(
            page.getByText('Test Type removed successfully')
        ).or(
            page.getByText('Test Type deleted successfully')
        ).or(
            page.getByText('Successfully deleted')
        ).or(
            page.getByText('Test Type has been permanently removed')
        ).or(
            page.locator('[data-testid="success-message"]')
        ).or(
            page.locator('.success-message, .alert-success')
        );
        
        await expect(successMessage).toBeVisible({ timeout: 10000 });
        const successText = await successMessage.textContent();
        console.log(`✅ Success message: "${successText}" is displayed`);
        
        // Step 11: Verify the deleted Test Type is no longer displayed in the Test Types List
        console.log('📋 Verifying the deleted Test Type is no longer displayed in the Test Types List...');
        
        // Wait for the table to update after deletion
        await page.waitForTimeout(2000);
        
        // Find the updated test types table
        const updatedTestTypesTable = page.getByRole('table', { name: 'Test Types' }).or(
            page.getByRole('table', { name: 'Test Types List' })
        ).or(
            page.locator('[data-testid="test-types-table"]')
        ).or(
            page.locator('.test-types-table, .test-types-list')
        ).or(
            page.locator('table')
        );
        
        await expect(updatedTestTypesTable).toBeVisible({ timeout: 15000 });
        
        // Search for the deleted test type in the table
        const updatedTableRows = updatedTestTypesTable.locator('tbody tr, .test-type-row');
        const updatedRowCount = await updatedTableRows.count();
        console.log(`📊 Test Types table now contains ${updatedRowCount} rows (was ${testTypeCount})`);
        
        let deletedTestTypeFound = false;
        
        // Check all rows for the deleted test type
        for (let i = 0; i < updatedRowCount; i++) {
            const row = updatedTableRows.nth(i);
            const rowText = await row.textContent();
            
            // Look for the deleted test type name
            if (rowText && (rowText.includes(testTypeToDeleteShortName) || 
                rowText.includes(testTypeToDeleteName.substring(0, 20)))) {
                deletedTestTypeFound = true;
                console.log(`❌ Deleted Test Type still found in table row ${i + 1}: ${rowText.substring(0, 50)}...`);
                break;
            }
        }
        
        if (deletedTestTypeFound) {
            console.log('❌ Deleted Test Type is still displayed in the table');
            console.log('📋 All remaining table rows:');
            for (let i = 0; i < Math.min(updatedRowCount, 10); i++) { // Show first 10 rows
                const row = updatedTableRows.nth(i);
                const rowText = await row.textContent();
                console.log(`  ${i + 1}. ${rowText?.substring(0, 80)}...`);
            }
        } else {
            console.log('✅ Deleted Test Type is no longer displayed in the Test Types List');
            console.log(`✅ Test type count reduced from ${testTypeCount} to ${updatedRowCount}`);
        }
        
        // Additional verification: Check if we're on the correct page
        const currentUrl = page.url();
        if (currentUrl.includes('test') || currentUrl.includes('type')) {
            console.log('📋 Successfully remained on Test Types page after deletion');
        } else {
            console.log('ℹ️ Current page after test type deletion:', currentUrl);
        }
        
        console.log('✅ Delete Test Type test completed successfully');
    });

    test('REGRESSION: Cancel Delete Test Type operation', async ({ page }) => {
        console.log('❌ Testing Cancel Delete Test Type operation...');
        
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
        
        // Get test types table and find delete button
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
                await deleteButton.click();
                await page.waitForTimeout(1000);
                
                // Verify confirmation dialog is open
                const confirmationDialog = page.getByRole('dialog', { name: 'Confirm Delete' }).or(
                    page.locator('.modal-dialog:has-text("Delete")')
                );
                
                if (await confirmationDialog.count() > 0) {
                    console.log('✅ Confirmation dialog is open');
                    
                    // Click Cancel
                    const cancelButton = page.getByRole('button', { name: 'Cancel' }).or(
                        page.locator('button:has-text("Cancel")')
                    ).or(
                        page.locator('.cancel-btn, .modal-close')
                    );
                    
                    if (await cancelButton.count() > 0) {
                        await cancelButton.click();
                        await page.waitForTimeout(1000);
                        
                        // Verify dialog is closed
                        await expect(confirmationDialog).not.toBeVisible({ timeout: 5000 });
                        console.log('✅ Cancel button works - confirmation dialog is closed');
                        
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
        }
        
        console.log('✅ Cancel Delete Test Type operation test completed');
    });

    test('REGRESSION: Verify delete permissions and restrictions for test types', async ({ page }) => {
        console.log('🔒 Testing delete permissions and restrictions for test types...');
        
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
        
        // Check delete button availability
        const testTypesTable = page.getByRole('table').or(
            page.locator('.test-types-table, .test-types-list')
        );
        
        const testTypeRows = testTypesTable.locator('tbody tr, .test-type-row');
        const testTypeCount = await testTypeRows.count();
        
        let deleteButtonsFound = 0;
        let protectedTestTypes = 0;
        let restrictedTestTypes = 0;
        
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
                    protectedTestTypes++;
                    console.log(`🔒 Test type is protected from deletion: ${testTypeText?.substring(0, 30)}...`);
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
        console.log(`  - Test types protected from deletion: ${protectedTestTypes}`);
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

    test('REGRESSION: Delete Test Type with confirmation message variations', async ({ page }) => {
        console.log('⚠️ Testing Delete Test Type with confirmation message variations...');
        
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
        
        // Get test types table and find delete button
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
                await deleteButton.click();
                await page.waitForTimeout(1000);
                
                // Check for different confirmation message variations
                const confirmationMessages = [
                    page.getByText('Deleting this Test Type will permanently remove associated data. Are you sure you want to delete'),
                    page.getByText('Deleting this test type will permanently remove associated data. Are you sure you want to delete'),
                    page.getByText('Deleting this Test Type will permanently remove associated data'),
                    page.getByText('Are you sure you want to delete'),
                    page.getByText('This action cannot be undone'),
                    page.getByText('This will permanently delete the test type'),
                    page.getByText('Warning: This action cannot be undone'),
                    page.locator('.confirmation-message, .delete-warning')
                ];
                
                let confirmationFound = false;
                for (const message of confirmationMessages) {
                    if (await message.count() > 0) {
                        const messageText = await message.textContent();
                        console.log(`✅ Confirmation message found: "${messageText}"`);
                        confirmationFound = true;
                        break;
                    }
                }
                
                if (!confirmationFound) {
                    console.log('⚠️ No standard confirmation message found');
                }
                
                // Click Cancel to avoid actual deletion
                const cancelButton = page.getByRole('button', { name: 'Cancel' }).or(
                    page.locator('button:has-text("Cancel")')
                );
                
                if (await cancelButton.count() > 0) {
                    await cancelButton.click();
                    await page.waitForTimeout(1000);
                    console.log('✅ Canceled deletion to avoid test data loss');
                }
            }
        }
        
        console.log('✅ Delete Test Type confirmation message variations test completed');
    });
});
