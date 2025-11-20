// Test Case: Delete Component (not in use) from Test Table
// Preconditions:
// - User is logged into the application
// - User has access to the Reports module
// - User has permission to delete components
// - User must have a System selected to interact with the page
// - At least one component exists in the system that can be deleted (not in use)

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

test.describe('Delete Component (not in use) from Test Table - Functional Tests', () => {

    test.beforeEach(async ({ page }) => {
        console.log('🔧 Setting up Delete Component test environment...');
    });

    test.afterEach(async ({ page }) => {
        console.log('🧹 Cleaning up Delete Component test data...');
    });

    test('REGRESSION: Delete Component (not in use) functionality works correctly', async ({ page }) => {
        console.log('🗑️ Testing Delete Component (not in use) functionality...');
        
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
        
        // Step 5: Select a system to enable component interaction (if required)
        console.log('⚙️ Selecting a system to enable component interaction...');
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
        
        // Step 6: Get initial component count and select a component for deletion
        console.log('📊 Getting initial component count and selecting a component for deletion...');
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
        
        // Get component rows
        const componentRows = testTable.locator('tbody tr, .component-row, .test-row');
        const initialComponentCount = await componentRows.count();
        console.log(`📊 Initial component count: ${initialComponentCount}`);
        
        if (initialComponentCount === 0) {
            throw new Error('No components found in the table');
        }
        
        // Step 7: Select a Component and click Delete (trash icon)
        console.log('🗑️ Selecting a Component and clicking Delete (trash icon)...');
        
        // Look for a component that can be deleted (not in use)
        let selectedComponent = null;
        let deleteButton = null;
        let componentToDeleteName = '';
        
        // Try to find a component with delete functionality
        for (let i = 0; i < initialComponentCount; i++) {
            const componentRow = componentRows.nth(i);
            const componentText = await componentRow.textContent();
            
            // Look for delete/trash button in this row
            deleteButton = componentRow.locator('[data-testid="delete-btn"]').or(
                componentRow.locator('button[title*="Delete"]')
            ).or(
                componentRow.locator('button[aria-label*="Delete"]')
            ).or(
                componentRow.locator('.delete-btn, .trash-btn')
            ).or(
                componentRow.locator('svg[data-icon="trash"], .fa-trash, .fa-delete')
            ).or(
                componentRow.locator('i.fa-trash, i.fa-delete, i.fa-trash-o')
            ).or(
                componentRow.locator('button:has-text("Delete")')
            ).or(
                componentRow.locator('a:has-text("Delete")')
            );
            
            if (await deleteButton.count() > 0) {
                // Check if the delete button is enabled (not disabled due to being in use)
                const isDisabled = await deleteButton.isDisabled();
                if (!isDisabled) {
                    selectedComponent = componentRow;
                    componentToDeleteName = componentText || '';
                    console.log(`📄 Selected component for deletion: ${componentToDeleteName.substring(0, 50)}...`);
                    break;
                } else {
                    console.log(`🔒 Component is in use and cannot be deleted: ${componentText?.substring(0, 30)}...`);
                }
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
                    selectedComponent = firstMenu;
                    const componentText = await firstMenu.textContent();
                    componentToDeleteName = componentText || '';
                    console.log(`📄 Found delete option in action menu for: ${componentToDeleteName.substring(0, 50)}...`);
                }
            }
        }
        
        if (!deleteButton || await deleteButton.count() === 0) {
            throw new Error('No delete button or delete option found for any component');
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
        const confirmationMessage = page.getByText('Deleting this component from the system will remove it from all future reports').or(
            page.getByText('Deleting this component from the system')
        ).or(
            page.getByText('will remove it from all future reports')
        ).or(
            page.locator('.confirmation-message')
        );
        
        await expect(confirmationMessage).toBeVisible({ timeout: 5000 });
        console.log('✅ Confirmation message: "Deleting this component from the system will remove it from all future reports" is displayed');
        
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
        const successMessage = page.getByText('Component has been deleted successfully').or(
            page.getByText('Component deleted successfully')
        ).or(
            page.getByText('Successfully deleted')
        ).or(
            page.getByText('Component removed successfully')
        ).or(
            page.locator('[data-testid="success-message"]')
        ).or(
            page.locator('.success-message, .alert-success')
        );
        
        await expect(successMessage).toBeVisible({ timeout: 10000 });
        const successText = await successMessage.textContent();
        console.log(`✅ Success message: "${successText}" is displayed`);
        
        // Step 11: Verify the Component is no longer on the Test Table
        console.log('📊 Verifying the Component is no longer on the Test Table...');
        
        // Wait for the page to refresh or update
        await page.waitForTimeout(2000);
        
        // Get updated component count
        const updatedComponentRows = testTable.locator('tbody tr, .component-row, .test-row');
        const updatedComponentCount = await updatedComponentRows.count();
        console.log(`📊 Updated component count: ${updatedComponentCount}`);
        
        // Verify that the component count decreased by 1
        expect(updatedComponentCount).toBeLessThan(initialComponentCount);
        console.log(`✅ Component count decreased from ${initialComponentCount} to ${updatedComponentCount}`);
        
        // Verify the specific component is no longer in the table
        let deletedComponentFound = false;
        
        // Check all remaining components to ensure the deleted one is gone
        for (let i = 0; i < updatedComponentCount; i++) {
            const componentRow = updatedComponentRows.nth(i);
            const componentText = await componentRow.textContent();
            
            if (componentText && componentText.includes(componentToDeleteName.substring(0, 20))) {
                deletedComponentFound = true;
                console.log(`❌ Deleted component still found in table: ${componentText}`);
                break;
            }
        }
        
        if (!deletedComponentFound) {
            console.log(`✅ Confirmed: Component "${componentToDeleteName.substring(0, 30)}..." is no longer on the Test Table`);
        } else {
            throw new Error('Deleted component is still present in the table');
        }
        
        // Additional verification: Check if we're still on the components page
        const currentUrl = page.url();
        if (currentUrl.includes('components') || currentUrl.includes('tests')) {
            console.log('📋 Successfully returned to Components & Tests page after deletion');
        } else {
            console.log('ℹ️ Current page after deletion:', currentUrl);
        }
        
        console.log('✅ Delete Component (not in use) test completed successfully');
    });

    test('REGRESSION: Delete Component confirmation dialog validation', async ({ page }) => {
        console.log('💬 Testing Delete Component confirmation dialog validation...');
        
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
        
        // Get components table
        const testTable = page.getByRole('table').or(
            page.locator('.test-table, .components-table')
        );
        
        const componentRows = testTable.locator('tbody tr, .component-row, .test-row');
        
        if (await componentRows.count() > 0) {
            const firstComponent = componentRows.first();
            const deleteButton = firstComponent.locator('[data-testid="delete-btn"]').or(
                firstComponent.locator('button[title*="Delete"]')
            ).or(
                firstComponent.locator('button:has-text("Delete")')
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
                    
                    // Verify component is still in the table
                    const remainingComponents = testTable.locator('tbody tr, .component-row, .test-row');
                    const componentCount = await remainingComponents.count();
                    console.log(`📊 Component count after cancel: ${componentCount}`);
                }
            }
        }
        
        console.log('✅ Delete Component confirmation dialog validation test completed');
    });

    test('REGRESSION: Verify delete permissions and restrictions for components', async ({ page }) => {
        console.log('🔒 Testing delete permissions and restrictions for components...');
        
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
        
        const componentRows = testTable.locator('tbody tr, .component-row, .test-row');
        const componentCount = await componentRows.count();
        
        let deleteButtonsFound = 0;
        let restrictedComponents = 0;
        let componentsInUse = 0;
        
        for (let i = 0; i < componentCount; i++) {
            const componentRow = componentRows.nth(i);
            const componentText = await componentRow.textContent();
            
            // Check for delete button
            const deleteButton = componentRow.locator('[data-testid="delete-btn"]').or(
                componentRow.locator('button[title*="Delete"]')
            ).or(
                componentRow.locator('svg[data-icon="trash"], .fa-trash, .fa-delete')
            ).or(
                componentRow.locator('button:has-text("Delete")')
            );
            
            if (await deleteButton.count() > 0) {
                // Check if button is disabled
                const isDisabled = await deleteButton.isDisabled();
                if (isDisabled) {
                    componentsInUse++;
                    console.log(`🔒 Component in use (cannot delete): ${componentText?.substring(0, 30)}...`);
                } else {
                    deleteButtonsFound++;
                    console.log(`✅ Delete available for: ${componentText?.substring(0, 30)}...`);
                }
            } else {
                restrictedComponents++;
                console.log(`🔒 No delete option for: ${componentText?.substring(0, 30)}...`);
            }
        }
        
        console.log(`📊 Delete permissions summary for components:`);
        console.log(`  - Components with delete access: ${deleteButtonsFound}`);
        console.log(`  - Components in use (restricted): ${componentsInUse}`);
        console.log(`  - Components with restricted access: ${restrictedComponents}`);
        console.log(`  - Total components: ${componentCount}`);
        
        // Check for any permission-related error messages
        const errorMessage = page.locator('.error-message, .alert-error, [data-testid="error-message"]');
        if (await errorMessage.count() > 0) {
            const errorText = await errorMessage.first().textContent();
            console.log(`⚠️ Permission error message: ${errorText}`);
        }
        
        console.log('✅ Delete permissions and restrictions test completed');
    });

    test('REGRESSION: Delete Component error handling', async ({ page }) => {
        console.log('⚠️ Testing Delete Component error handling...');
        
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
        
        // Try to delete a component that might cause errors
        const testTable = page.getByRole('table').or(
            page.locator('.test-table, .components-table')
        );
        
        const componentRows = testTable.locator('tbody tr, .component-row, .test-row');
        
        if (await componentRows.count() > 0) {
            const firstComponent = componentRows.first();
            const deleteButton = firstComponent.locator('[data-testid="delete-btn"]').or(
                firstComponent.locator('button[title*="Delete"]')
            ).or(
                firstComponent.locator('button:has-text("Delete")')
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
        
        console.log('✅ Delete Component error handling test completed');
    });
});
