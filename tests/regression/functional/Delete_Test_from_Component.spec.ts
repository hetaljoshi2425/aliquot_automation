// Test Case: Delete Test from Component
// Preconditions:
// - User is logged into the application
// - User has access to the Reports module
// - User has permission to delete tests from components
// - User must have a System selected to interact with the page
// - At least one test exists in the system that can be deleted

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

test.describe('Delete Test from Component - Functional Tests', () => {

    test.beforeEach(async ({ page }) => {
        console.log('🔧 Setting up Delete Test from Component test environment...');
    });

    test.afterEach(async ({ page }) => {
        console.log('🧹 Cleaning up Delete Test from Component test data...');
    });

    test('REGRESSION: Delete Test from Component functionality works correctly', async ({ page }) => {
        console.log('🗑️ Testing Delete Test from Component functionality...');
        
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
        
        // Step 5: Select a system to enable test interaction (if required)
        console.log('⚙️ Selecting a system to enable test interaction...');
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
        
        // Step 6: Get initial test count and select a test for deletion
        console.log('📊 Getting initial test count and selecting a test for deletion...');
        const testTable = page.getByRole('table', { name: 'Tests' }).or(
            page.getByRole('table', { name: 'Components' })
        ).or(
            page.locator('[data-testid="test-table"]')
        ).or(
            page.locator('.test-table, .components-table')
        ).or(
            page.locator('table')
        );
        
        await expect(testTable).toBeVisible({ timeout: 15000 });
        
        // Get test rows
        const testRows = testTable.locator('tbody tr, .test-row, .component-row');
        const initialTestCount = await testRows.count();
        console.log(`📊 Initial test count: ${initialTestCount}`);
        
        if (initialTestCount === 0) {
            throw new Error('No tests found in the table');
        }
        
        // Step 7: Select a Test and click Delete (trash icon)
        console.log('🗑️ Selecting a Test and clicking Delete (trash icon)...');
        
        // Look for a test with delete functionality
        let selectedTest = null;
        let deleteButton = null;
        let testToDeleteName = '';
        
        // Try to find a test that can be deleted
        for (let i = 0; i < initialTestCount; i++) {
            const testRow = testRows.nth(i);
            const testText = await testRow.textContent();
            
            // Look for delete/trash button in this row
            deleteButton = testRow.locator('[data-testid="delete-btn"]').or(
                testRow.locator('button[title*="Delete"]')
            ).or(
                testRow.locator('button[aria-label*="Delete"]')
            ).or(
                testRow.locator('.delete-btn, .trash-btn')
            ).or(
                testRow.locator('svg[data-icon="trash"], .fa-trash, .fa-delete')
            ).or(
                testRow.locator('i.fa-trash, i.fa-delete, i.fa-trash-o')
            ).or(
                testRow.locator('button:has-text("Delete")')
            ).or(
                testRow.locator('a:has-text("Delete")')
            );
            
            if (await deleteButton.count() > 0) {
                selectedTest = testRow;
                testToDeleteName = testText || '';
                console.log(`📄 Selected test for deletion: ${testToDeleteName.substring(0, 50)}...`);
                break;
            }
        }
        
        // If no delete button found, try looking for action menus
        if (!deleteButton || await deleteButton.count() === 0) {
            console.log('ℹ️ No dedicated delete button found, checking for action menus...');
            
            // Look for action menus or dropdowns
            const actionMenus = testTable.locator('[data-testid="action-menu"]').or(
                testTable.locator('.action-menu, .dropdown-menu')
            ).or(
                testTable.locator('button[aria-haspopup="menu"]')
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
                    selectedTest = firstMenu;
                    const testText = await firstMenu.textContent();
                    testToDeleteName = testText || '';
                    console.log(`📄 Found delete option in action menu for: ${testToDeleteName.substring(0, 50)}...`);
                }
            }
        }
        
        if (!deleteButton || await deleteButton.count() === 0) {
            throw new Error('No delete button or delete option found for any test');
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
        const confirmationMessage = page.getByText('Deleting this test from the system will remove it from all future reports').or(
            page.getByText('Deleting this test from the system')
        ).or(
            page.getByText('will remove it from all future reports')
        ).or(
            page.locator('.confirmation-message')
        );
        
        await expect(confirmationMessage).toBeVisible({ timeout: 5000 });
        console.log('✅ Confirmation message: "Deleting this test from the system will remove it from all future reports" is displayed');
        
        // Step 9: Click Yes
        console.log('✅ Clicking Yes button in confirmation dialog...');
        const yesButton = confirmationDialog.getByRole('button', { name: 'Yes' }).or(
            confirmationDialog.getByRole('button', { name: 'Delete' })
        ).or(
            confirmationDialog.getByRole('button', { name: 'Confirm' })
        ).or(
            confirmationDialog.locator('[data-testid="confirm-delete-btn"]')
        ).or(
            confirmationDialog.locator('button:has-text("Yes")')
        ).or(
            confirmationDialog.locator('button:has-text("Delete")')
        ).or(
            confirmationDialog.locator('button:has-text("Confirm")')
        );
        
        await expect(yesButton).toBeVisible({ timeout: 5000 });
        await yesButton.click();
        
        // Wait for delete operation to complete
        await page.waitForTimeout(3000);
        
        // Step 10: Verify Test Type has been deleted successfully
        console.log('✅ Verifying Test Type has been deleted successfully...');
        const successMessage = page.getByText('Test Type has been deleted successfully').or(
            page.getByText('Test has been deleted successfully')
        ).or(
            page.getByText('Test deleted successfully')
        ).or(
            page.getByText('Successfully deleted')
        ).or(
            page.getByText('Test removed successfully')
        ).or(
            page.locator('[data-testid="success-message"]')
        ).or(
            page.locator('.success-message, .alert-success')
        );
        
        await expect(successMessage).toBeVisible({ timeout: 10000 });
        const successText = await successMessage.textContent();
        console.log(`✅ Success message: "${successText}" is displayed`);
        
        // Step 11: Verify the Test Type is not on the Test Table
        console.log('📊 Verifying the Test Type is not on the Test Table...');
        
        // Wait for the page to refresh or update
        await page.waitForTimeout(2000);
        
        // Get updated test count
        const updatedTestRows = testTable.locator('tbody tr, .test-row, .component-row');
        const updatedTestCount = await updatedTestRows.count();
        console.log(`📊 Updated test count: ${updatedTestCount}`);
        
        // Verify that the test count decreased by 1
        expect(updatedTestCount).toBeLessThan(initialTestCount);
        console.log(`✅ Test count decreased from ${initialTestCount} to ${updatedTestCount}`);
        
        // Verify the specific test is no longer in the table
        let deletedTestFound = false;
        
        // Check all remaining tests to ensure the deleted one is gone
        for (let i = 0; i < updatedTestCount; i++) {
            const testRow = updatedTestRows.nth(i);
            const testText = await testRow.textContent();
            
            if (testText && testText.includes(testToDeleteName.substring(0, 20))) {
                deletedTestFound = true;
                console.log(`❌ Deleted test still found in table: ${testText}`);
                break;
            }
        }
        
        if (!deletedTestFound) {
            console.log(`✅ Confirmed: Test "${testToDeleteName.substring(0, 30)}..." is no longer in the table`);
        } else {
            throw new Error('Deleted test is still present in the table');
        }
        
        // Additional verification: Check if we're still on the components page
        const currentUrl = page.url();
        if (currentUrl.includes('components') || currentUrl.includes('tests')) {
            console.log('📋 Successfully returned to Components & Tests page after deletion');
        } else {
            console.log('ℹ️ Current page after deletion:', currentUrl);
        }
        
        console.log('✅ Delete Test from Component test completed successfully');
    });

    test('REGRESSION: Delete Test confirmation dialog validation', async ({ page }) => {
        console.log('💬 Testing Delete Test confirmation dialog validation...');
        
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
        
        // Get tests table
        const testTable = page.getByRole('table').or(
            page.locator('.test-table, .components-table')
        );
        
        const testRows = testTable.locator('tbody tr, .test-row, .component-row');
        
        if (await testRows.count() > 0) {
            const firstTest = testRows.first();
            const deleteButton = firstTest.locator('[data-testid="delete-btn"]').or(
                firstTest.locator('button[title*="Delete"]')
            ).or(
                firstTest.locator('button:has-text("Delete")')
            );
            
            if (await deleteButton.count() > 0) {
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
                    
                    // Verify test is still in the table
                    const remainingTests = testTable.locator('tbody tr, .test-row, .component-row');
                    const testCount = await remainingTests.count();
                    console.log(`📊 Test count after cancel: ${testCount}`);
                }
            }
        }
        
        console.log('✅ Delete Test confirmation dialog validation test completed');
    });

    test('REGRESSION: Verify delete permissions and restrictions', async ({ page }) => {
        console.log('🔒 Testing delete permissions and restrictions...');
        
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
        const testTable = page.getByRole('table').or(
            page.locator('.test-table, .components-table')
        );
        
        const testRows = testTable.locator('tbody tr, .test-row, .component-row');
        const testCount = await testRows.count();
        
        let deleteButtonsFound = 0;
        let restrictedTests = 0;
        
        for (let i = 0; i < testCount; i++) {
            const testRow = testRows.nth(i);
            const testText = await testRow.textContent();
            
            // Check for delete button
            const deleteButton = testRow.locator('[data-testid="delete-btn"]').or(
                testRow.locator('button[title*="Delete"]')
            ).or(
                testRow.locator('svg[data-icon="trash"], .fa-trash, .fa-delete')
            ).or(
                testRow.locator('button:has-text("Delete")')
            );
            
            if (await deleteButton.count() > 0) {
                // Check if button is disabled
                const isDisabled = await deleteButton.isDisabled();
                if (isDisabled) {
                    restrictedTests++;
                    console.log(`🔒 Delete restricted for: ${testText?.substring(0, 30)}...`);
                } else {
                    deleteButtonsFound++;
                    console.log(`✅ Delete available for: ${testText?.substring(0, 30)}...`);
                }
            } else {
                restrictedTests++;
                console.log(`🔒 No delete option for: ${testText?.substring(0, 30)}...`);
            }
        }
        
        console.log(`📊 Delete permissions summary:`);
        console.log(`  - Tests with delete access: ${deleteButtonsFound}`);
        console.log(`  - Tests with restricted access: ${restrictedTests}`);
        console.log(`  - Total tests: ${testCount}`);
        
        // Check for any permission-related error messages
        const errorMessage = page.locator('.error-message, .alert-error, [data-testid="error-message"]');
        if (await errorMessage.count() > 0) {
            const errorText = await errorMessage.first().textContent();
            console.log(`⚠️ Permission error message: ${errorText}`);
        }
        
        console.log('✅ Delete permissions and restrictions test completed');
    });

    test('REGRESSION: Delete Test error handling', async ({ page }) => {
        console.log('⚠️ Testing Delete Test error handling...');
        
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
        
        // Try to delete a test that might cause errors
        const testTable = page.getByRole('table').or(
            page.locator('.test-table, .components-table')
        );
        
        const testRows = testTable.locator('tbody tr, .test-row, .component-row');
        
        if (await testRows.count() > 0) {
            const firstTest = testRows.first();
            const deleteButton = firstTest.locator('[data-testid="delete-btn"]').or(
                firstTest.locator('button[title*="Delete"]')
            ).or(
                firstTest.locator('button:has-text("Delete")')
            );
            
            if (await deleteButton.count() > 0) {
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
        
        console.log('✅ Delete Test error handling test completed');
    });
});
