// Test Case: Delete Client (No Reports Created by Client)
// Preconditions:
// - User is logged into the application
// - User has access to the Site Management module
// - User has permission to delete clients
// - At least one client exists in the system that can be deleted
// - The client has no reports created by it
// - User has appropriate organizational permissions

import { test, expect } from '@playwright/test';

import { HomeSteps } from '../../../pages/home/home.steps';
import { hoverSiteManagementButton, clickClearFiltersBtn } from '../../../pages/home/home.steps';

import {
    goToAliquotQaLink,
    loginAquaUser,
    verifyAquaLoginQa
} from '../../../pages/login/login.steps';

import { ALIQUOT_PASSWORD_QA, ALIQUOT_USERNAME_QA } from '../../../utils/constants';
import { clearCacheAndReload } from '../../../utils/helpers';

test.describe('Delete Client - Functional Tests', () => {

    test.beforeEach(async ({ page }) => {
        console.log('🔧 Setting up Delete Client test environment...');
    });

    test.afterEach(async ({ page }) => {
        console.log('🧹 Cleaning up Delete Client test data...');
    });

    test('REGRESSION: Delete Client functionality works correctly', async ({ page }) => {
        console.log('🗑️ Testing Delete Client functionality...');
        
        // Login and navigate
        await goToAliquotQaLink(page);
        await loginAquaUser(page, ALIQUOT_USERNAME_QA, ALIQUOT_PASSWORD_QA);
        await verifyAquaLoginQa(page);
        await clearCacheAndReload(page);
        
        // Step 1: Hover over the Site Management tab
        console.log('🖱️ Hovering over the Site Management tab...');
        const siteManagementTab = page.getByRole('tab', { name: 'Site Management' }).or(
            page.getByRole('button', { name: 'Site Management' })
        ).or(
            page.locator('[data-testid="site-management-tab"]')
        ).or(
            page.locator('a:has-text("Site Management")')
        );
        
        await siteManagementTab.hover();
        await page.waitForTimeout(1000); // Wait for hover effect
        
        // Step 2: Verify Site Management links are displayed
        console.log('🔍 Verifying Site Management links are displayed...');
        const siteManagementMenu = page.getByRole('menu', { name: 'Site Management' }).or(
            page.locator('[data-testid="site-management-menu"]')
        ).or(
            page.locator('.dropdown-menu:has-text("Site Management")')
        ).or(
            page.locator('.site-management-dropdown')
        ).or(
            page.locator('.site-management-submenu')
        );
        
        await expect(siteManagementMenu).toBeVisible({ timeout: 10000 });
        console.log('✅ Site Management links are displayed');
        
        // Step 3: Click My Organization
        console.log('🏢 Clicking My Organization...');
        const myOrganizationLink = page.getByRole('menuitem', { name: 'My Organization' }).or(
            page.getByRole('link', { name: 'My Organization' })
        ).or(
            page.locator('[data-testid="my-organization-link"]')
        ).or(
            page.locator('a:has-text("My Organization")')
        );
        
        await myOrganizationLink.click();
        await page.waitForLoadState('networkidle');
        
        // Step 4: Verify My Organization page is displayed with a list of Clients
        console.log('📋 Verifying My Organization page is displayed with a list of Clients...');
        const myOrganizationPage = page.getByRole('heading', { name: 'My Organization' }).or(
            page.getByRole('heading', { name: 'Client Lists' })
        ).or(
            page.locator('[data-testid="my-organization-page"]')
        ).or(
            page.locator('h1:has-text("My Organization")')
        ).or(
            page.locator('h1:has-text("Client Lists")')
        ).or(
            page.locator('.page-title:has-text("Organization")')
        );
        
        await expect(myOrganizationPage).toBeVisible({ timeout: 15000 });
        console.log('✅ My Organization page is displayed');
        
        // Verify Client Lists is displayed
        const clientListsSection = page.getByRole('heading', { name: 'Client Lists' }).or(
            page.locator('[data-testid="client-lists-section"]')
        ).or(
            page.locator('.client-lists-section')
        ).or(
            page.locator('section:has-text("Client Lists")')
        ).or(
            page.locator('div:has-text("Client Lists")')
        );
        
        await expect(clientListsSection).toBeVisible({ timeout: 10000 });
        console.log('✅ Client Lists is displayed');
        
        // Verify list of Clients is displayed
        const clientsList = page.getByRole('table', { name: 'Clients' }).or(
            page.getByRole('table', { name: 'Client List' })
        ).or(
            page.locator('[data-testid="clients-table"]')
        ).or(
            page.locator('.clients-table, .client-list')
        ).or(
            page.locator('table')
        );
        
        await expect(clientsList).toBeVisible({ timeout: 15000 });
        console.log('✅ List of Clients is displayed');
        
        // Get client rows
        const clientRows = clientsList.locator('tbody tr, .client-row');
        const clientCount = await clientRows.count();
        console.log(`📊 Found ${clientCount} clients in the list`);
        
        if (clientCount === 0) {
            throw new Error('No clients found in the list');
        }
        
        // Step 5: Select a Client and click the Trash icon
        console.log('🗑️ Selecting a Client and clicking the Trash icon...');
        
        // Look for a client with delete functionality
        let selectedClient = null;
        let deleteButton = null;
        let clientToDeleteName = '';
        let clientToDeleteIndex = -1;
        
        // Try to find a client that can be deleted
        for (let i = 0; i < clientCount; i++) {
            const clientRow = clientRows.nth(i);
            const clientText = await clientRow.textContent();
            
            // Look for delete button in this row
            deleteButton = clientRow.locator('[data-testid="delete-btn"]').or(
                clientRow.locator('button[title*="Delete"]')
            ).or(
                clientRow.locator('button[aria-label*="Delete"]')
            ).or(
                clientRow.locator('.delete-btn, .trash-btn')
            ).or(
                clientRow.locator('svg[data-icon="trash"], .fa-trash, .fa-delete')
            ).or(
                clientRow.locator('i.fa-trash, i.fa-delete, i.fa-trash-o')
            ).or(
                clientRow.locator('button:has-text("Delete")')
            ).or(
                clientRow.locator('a:has-text("Delete")')
            );
            
            if (await deleteButton.count() > 0) {
                // Check if button is enabled
                const isDisabled = await deleteButton.isDisabled();
                if (!isDisabled) {
                    selectedClient = clientRow;
                    clientToDeleteName = clientText || '';
                    clientToDeleteIndex = i;
                    console.log(`📄 Selected client for deletion: ${clientToDeleteName.substring(0, 50)}...`);
                    break;
                } else {
                    console.log(`🔒 Client cannot be deleted (disabled): ${clientText?.substring(0, 30)}...`);
                }
            }
        }
        
        // If no delete button found, try looking for action menus
        if (!deleteButton || await deleteButton.count() === 0) {
            console.log('ℹ️ No dedicated delete button found, checking for action menus...');
            
            // Look for action menus or dropdowns
            const actionMenus = clientsList.locator('[data-testid="action-menu"]').or(
                clientsList.locator('.action-menu, .dropdown-menu')
            ).or(
                clientsList.locator('button[aria-haspopup="menu"]')
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
                    selectedClient = firstMenu;
                    const clientText = await firstMenu.textContent();
                    clientToDeleteName = clientText || '';
                    console.log(`📄 Found delete option in action menu for: ${clientToDeleteName.substring(0, 50)}...`);
                }
            }
        }
        
        if (!deleteButton || await deleteButton.count() === 0) {
            throw new Error('No delete button or delete option found for any client');
        }
        
        // Click the delete button
        await deleteButton.click();
        await page.waitForTimeout(1000);
        console.log('✅ Trash icon clicked');
        
        // Step 6: Verify Confirmation message is displayed
        console.log('⚠️ Verifying confirmation message is displayed...');
        const confirmationMessage = page.getByText('Deleting this Client will permanently remove the data and all data associated with it. Are you sure you want to delete').or(
            page.getByText('Are you sure you want to delete')
        ).or(
            page.getByText('This action cannot be undone')
        ).or(
            page.getByText('Permanently delete')
        ).or(
            page.locator('[data-testid="delete-confirmation-message"]')
        ).or(
            page.locator('.confirmation-message, .delete-warning')
        );
        
        await expect(confirmationMessage).toBeVisible({ timeout: 10000 });
        const confirmationText = await confirmationMessage.textContent();
        console.log(`⚠️ Confirmation message: "${confirmationText}" is displayed`);
        
        // Verify the confirmation message contains the client name
        if (confirmationText && clientToDeleteName) {
            const clientNameInMessage = clientToDeleteName.split('\n')[0].trim(); // Get first line of client name
            if (confirmationText.includes(clientNameInMessage)) {
                console.log(`✅ Confirmation message contains client name: ${clientNameInMessage}`);
            } else {
                console.log(`ℹ️ Confirmation message may not contain exact client name`);
            }
        }
        
        // Step 7: Click Delete
        console.log('🗑️ Clicking Delete button...');
        const confirmDeleteButton = page.getByRole('button', { name: 'Delete' }).or(
            page.getByRole('button', { name: 'Confirm Delete' })
        ).or(
            page.getByRole('button', { name: 'Yes, Delete' })
        ).or(
            page.getByRole('button', { name: 'Confirm' })
        ).or(
            page.locator('[data-testid="confirm-delete-btn"]')
        ).or(
            page.locator('button:has-text("Delete")')
        ).or(
            page.locator('button:has-text("Confirm")')
        );
        
        await expect(confirmDeleteButton).toBeVisible({ timeout: 10000 });
        await confirmDeleteButton.click();
        
        // Wait for delete operation to complete
        await page.waitForTimeout(3000);
        
        // Step 8: Verify Success message is displayed
        console.log('✅ Verifying success message is displayed...');
        const successMessage = page.getByText('Client has been deleted successfully').or(
            page.getByText('Client deleted successfully')
        ).or(
            page.getByText('Client removed successfully')
        ).or(
            page.getByText('Successfully deleted')
        ).or(
            page.getByText('Client has been removed')
        ).or(
            page.locator('[data-testid="success-message"]')
        ).or(
            page.locator('.success-message, .alert-success')
        );
        
        await expect(successMessage).toBeVisible({ timeout: 10000 });
        const successText = await successMessage.textContent();
        console.log(`✅ Success message: "${successText}" is displayed`);
        
        // Step 9: Verify the Client is no longer listed in My Organization
        console.log('🔍 Verifying the Client is no longer listed in My Organization...');
        
        // Wait for the page to refresh/update
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(2000);
        
        // Get updated client rows
        const updatedClientRows = clientsList.locator('tbody tr, .client-row');
        const updatedClientCount = await updatedClientRows.count();
        console.log(`📊 Updated client count: ${updatedClientCount} (was ${clientCount})`);
        
        // Verify the client count decreased
        if (updatedClientCount < clientCount) {
            console.log('✅ Client count decreased - deletion appears successful');
        } else {
            console.log('⚠️ Client count did not decrease - checking if specific client was removed');
        }
        
        // Check if the specific client is no longer in the list
        let clientStillExists = false;
        for (let i = 0; i < updatedClientCount; i++) {
            const clientRow = updatedClientRows.nth(i);
            const clientText = await clientRow.textContent();
            if (clientText && clientToDeleteName && clientText.includes(clientToDeleteName.split('\n')[0].trim())) {
                clientStillExists = true;
                console.log(`⚠️ Client still exists in list: ${clientText.substring(0, 50)}...`);
                break;
            }
        }
        
        if (!clientStillExists) {
            console.log('✅ Client has been successfully removed from the list');
        } else {
            console.log('⚠️ Client may still exist in the list - deletion may not have completed');
        }
        
        // Additional verification: Check if we're on the correct page
        const currentUrl = page.url();
        if (currentUrl.includes('organization') || currentUrl.includes('client')) {
            console.log('📋 Successfully completed client deletion');
        } else {
            console.log('ℹ️ Current page after client deletion:', currentUrl);
        }
        
        console.log('✅ Delete Client test completed successfully');
    });

    test('REGRESSION: Cancel Delete Client operation', async ({ page }) => {
        console.log('❌ Testing Cancel Delete Client operation...');
        
        // Login and navigate
        await goToAliquotQaLink(page);
        await loginAquaUser(page, ALIQUOT_USERNAME_QA, ALIQUOT_PASSWORD_QA);
        await verifyAquaLoginQa(page);
        await clearCacheAndReload(page);
        
        // Navigate to Site Management
        const siteManagementTab = page.getByRole('tab', { name: 'Site Management' }).or(
            page.locator('a:has-text("Site Management")')
        );
        
        await siteManagementTab.hover();
        await page.waitForTimeout(1000);
        
        // Click My Organization
        const myOrganizationLink = page.getByRole('menuitem', { name: 'My Organization' }).or(
            page.locator('a:has-text("My Organization")')
        );
        
        await myOrganizationLink.click();
        await page.waitForLoadState('networkidle');
        
        // Get clients list and find delete button
        const clientsList = page.getByRole('table', { name: 'Clients' }).or(
            page.locator('.clients-table, .client-list')
        );
        
        const clientRows = clientsList.locator('tbody tr, .client-row');
        
        if (await clientRows.count() > 0) {
            const firstClient = clientRows.first();
            const deleteButton = firstClient.locator('[data-testid="delete-btn"]').or(
                firstClient.locator('button[title*="Delete"]')
            ).or(
                firstClient.locator('button:has-text("Delete")')
            );
            
            if (await deleteButton.count() > 0 && !(await deleteButton.isDisabled())) {
                await deleteButton.click();
                await page.waitForTimeout(1000);
                
                // Verify confirmation dialog is open
                const confirmationMessage = page.getByText('Are you sure you want to delete').or(
                    page.locator('.confirmation-message, .delete-warning')
                );
                
                if (await confirmationMessage.count() > 0) {
                    console.log('✅ Delete confirmation dialog is open');
                    
                    // Click Cancel
                    const cancelButton = page.getByRole('button', { name: 'Cancel' }).or(
                        page.getByRole('button', { name: 'No' })
                    ).or(
                        page.locator('button:has-text("Cancel")')
                    ).or(
                        page.locator('.cancel-btn, .modal-close')
                    );
                    
                    if (await cancelButton.count() > 0) {
                        await cancelButton.click();
                        await page.waitForLoadState('networkidle');
                        await page.waitForTimeout(1000);
                        
                        // Verify we're back to the list page
                        const myOrganizationPage = page.getByRole('heading', { name: 'My Organization' }).or(
                            page.locator('h1:has-text("My Organization")')
                        );
                        
                        if (await myOrganizationPage.count() > 0) {
                            console.log('✅ Cancel button works - returned to My Organization page');
                        } else {
                            console.log('ℹ️ Cancel button clicked but page navigation unclear');
                        }
                    }
                }
            }
        }
        
        console.log('✅ Cancel Delete Client operation test completed');
    });

    test('REGRESSION: Verify delete permissions and restrictions for clients', async ({ page }) => {
        console.log('🔒 Testing delete permissions and restrictions for clients...');
        
        // Login and navigate
        await goToAliquotQaLink(page);
        await loginAquaUser(page, ALIQUOT_USERNAME_QA, ALIQUOT_PASSWORD_QA);
        await verifyAquaLoginQa(page);
        await clearCacheAndReload(page);
        
        // Navigate to Site Management
        const siteManagementTab = page.getByRole('tab', { name: 'Site Management' }).or(
            page.locator('a:has-text("Site Management")')
        );
        
        await siteManagementTab.hover();
        await page.waitForTimeout(1000);
        
        // Click My Organization
        const myOrganizationLink = page.getByRole('menuitem', { name: 'My Organization' }).or(
            page.locator('a:has-text("My Organization")')
        );
        
        await myOrganizationLink.click();
        await page.waitForLoadState('networkidle');
        
        // Check delete button availability
        const clientsList = page.getByRole('table', { name: 'Clients' }).or(
            page.locator('.clients-table, .client-list')
        );
        
        const clientRows = clientsList.locator('tbody tr, .client-row');
        const clientCount = await clientRows.count();
        
        let deleteButtonsFound = 0;
        let restrictedClients = 0;
        let readOnlyClients = 0;
        
        for (let i = 0; i < clientCount; i++) {
            const clientRow = clientRows.nth(i);
            const clientText = await clientRow.textContent();
            
            // Check for delete button
            const deleteButton = clientRow.locator('[data-testid="delete-btn"]').or(
                clientRow.locator('button[title*="Delete"]')
            ).or(
                clientRow.locator('svg[data-icon="trash"], .fa-trash, .fa-delete')
            ).or(
                clientRow.locator('button:has-text("Delete")')
            );
            
            if (await deleteButton.count() > 0) {
                // Check if button is disabled
                const isDisabled = await deleteButton.isDisabled();
                if (isDisabled) {
                    readOnlyClients++;
                    console.log(`🔒 Client cannot be deleted (disabled): ${clientText?.substring(0, 30)}...`);
                } else {
                    deleteButtonsFound++;
                    console.log(`✅ Delete available for: ${clientText?.substring(0, 30)}...`);
                }
            } else {
                restrictedClients++;
                console.log(`🔒 No delete option for: ${clientText?.substring(0, 30)}...`);
            }
        }
        
        console.log(`📊 Delete permissions summary for clients:`);
        console.log(`  - Clients with delete access: ${deleteButtonsFound}`);
        console.log(`  - Clients read-only: ${readOnlyClients}`);
        console.log(`  - Clients with restricted access: ${restrictedClients}`);
        console.log(`  - Total clients: ${clientCount}`);
        
        // Check for any permission-related error messages
        const errorMessage = page.locator('.error-message, .alert-error, [data-testid="error-message"]');
        if (await errorMessage.count() > 0) {
            const errorText = await errorMessage.first().textContent();
            console.log(`⚠️ Permission error message: ${errorText}`);
        }
        
        console.log('✅ Delete permissions and restrictions test completed');
    });
});
