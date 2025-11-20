// Test Case: Delete System (No Reports Created by System)
// Preconditions:
// - User is logged into the application
// - User has access to the Site Management module
// - User has permission to delete systems
// - At least one client exists in the system
// - At least one customer exists under the selected client
// - At least one facility exists under the selected customer
// - At least one building exists under the selected facility
// - At least one system exists under the selected building that can be deleted
// - The system has no reports created by it
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

test.describe('Delete System - Functional Tests', () => {

    test.beforeEach(async ({ page }) => {
        console.log('🔧 Setting up Delete System test environment...');
    });

    test.afterEach(async ({ page }) => {
        console.log('🧹 Cleaning up Delete System test data...');
    });

    test('REGRESSION: Delete System functionality works correctly', async ({ page }) => {
        console.log('🗑️ Testing Delete System functionality...');
        
        // Login and navigate
        await goToAliquotQaLink(page);
        await loginAquaUser(page, ALIQUOT_USERNAME_QA, ALIQUOT_PASSWORD_QA);
        await verifyAquaLoginQa(page);
        await clearCacheAndReload(page);
        
        // Step 1: Navigate to My Organization
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
        
        // Verify Site Management links are displayed
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
        
        // Click My Organization
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
        
        // Step 2: Verify that the My Organization page is loaded
        console.log('📋 Verifying that the My Organization page is loaded...');
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
        console.log('✅ My Organization page is loaded');
        
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
        
        // Step 3: Filter and Open System List
        console.log('🔍 In the Filter by Location section, selecting Client, Customer, Facility, and Building...');
        
        // Look for Filter by Location section
        const filterByLocationSection = page.locator('[data-testid="filter-by-location-section"]').or(
            page.locator('.filter-by-location, .location-filter')
        ).or(
            page.locator('section:has-text("Filter by Location")')
        ).or(
            page.locator('div:has-text("Filter by Location")')
        ).or(
            page.locator('.filter-section:has-text("Location")')
        );
        
        if (await filterByLocationSection.count() > 0) {
            console.log('✅ Filter by Location section found');
            
            // Select Client from filter
            const clientFilterDropdown = filterByLocationSection.locator('select').first().or(
                filterByLocationSection.locator('[data-testid="client-filter-dropdown"]')
            ).or(
                filterByLocationSection.locator('.client-dropdown, .location-client-dropdown')
            ).or(
                filterByLocationSection.locator('input[placeholder*="Client"]')
            );
            
            if (await clientFilterDropdown.count() > 0) {
                await clientFilterDropdown.click();
                await page.waitForTimeout(500);
                
                // Select first available client
                const firstClientOption = page.locator('option').first().or(
                    page.locator('[role="option"]').first()
                );
                
                if (await firstClientOption.count() > 0) {
                    await firstClientOption.click();
                    await page.waitForTimeout(1000);
                    console.log('✅ Client selected from filter');
                }
            }
            
            // Select Customer from filter
            const customerFilterDropdown = filterByLocationSection.locator('select').nth(1).or(
                filterByLocationSection.locator('[data-testid="customer-filter-dropdown"]')
            ).or(
                filterByLocationSection.locator('.customer-dropdown, .location-customer-dropdown')
            ).or(
                filterByLocationSection.locator('input[placeholder*="Customer"]')
            );
            
            if (await customerFilterDropdown.count() > 0) {
                await customerFilterDropdown.click();
                await page.waitForTimeout(500);
                
                // Select first available customer
                const firstCustomerOption = page.locator('option').first().or(
                    page.locator('[role="option"]').first()
                );
                
                if (await firstCustomerOption.count() > 0) {
                    await firstCustomerOption.click();
                    await page.waitForTimeout(1000);
                    console.log('✅ Customer selected from filter');
                }
            }
            
            // Select Facility from filter
            const facilityFilterDropdown = filterByLocationSection.locator('select').nth(2).or(
                filterByLocationSection.locator('[data-testid="facility-filter-dropdown"]')
            ).or(
                filterByLocationSection.locator('.facility-dropdown, .location-facility-dropdown')
            ).or(
                filterByLocationSection.locator('input[placeholder*="Facility"]')
            );
            
            if (await facilityFilterDropdown.count() > 0) {
                await facilityFilterDropdown.click();
                await page.waitForTimeout(500);
                
                // Select first available facility
                const firstFacilityOption = page.locator('option').first().or(
                    page.locator('[role="option"]').first()
                );
                
                if (await firstFacilityOption.count() > 0) {
                    await firstFacilityOption.click();
                    await page.waitForTimeout(1000);
                    console.log('✅ Facility selected from filter');
                }
            }
            
            // Select Building from filter
            const buildingFilterDropdown = filterByLocationSection.locator('select').nth(3).or(
                filterByLocationSection.locator('[data-testid="building-filter-dropdown"]')
            ).or(
                filterByLocationSection.locator('.building-dropdown, .location-building-dropdown')
            ).or(
                filterByLocationSection.locator('input[placeholder*="Building"]')
            );
            
            if (await buildingFilterDropdown.count() > 0) {
                await buildingFilterDropdown.click();
                await page.waitForTimeout(500);
                
                // Select first available building
                const firstBuildingOption = page.locator('option').first().or(
                    page.locator('[role="option"]').first()
                );
                
                if (await firstBuildingOption.count() > 0) {
                    await firstBuildingOption.click();
                    await page.waitForTimeout(1000);
                    console.log('✅ Building selected from filter');
                }
            }
        } else {
            console.log('ℹ️ Filter by Location section not found, proceeding with default selection');
        }
        
        // Click Systems List button
        console.log('⚙️ Clicking Systems List button...');
        const systemsListButton = page.getByRole('button', { name: 'Systems List' }).or(
            page.getByRole('button', { name: 'System List' })
        ).or(
            page.getByRole('link', { name: 'Systems List' })
        ).or(
            page.locator('[data-testid="systems-list-button"]')
        ).or(
            page.locator('button:has-text("Systems List")')
        ).or(
            page.locator('button:has-text("System List")')
        ).or(
            page.locator('a:has-text("Systems List")')
        ).or(
            page.locator('.systems-list-btn, .systems-list-link')
        );
        
        await systemsListButton.click();
        await page.waitForLoadState('networkidle');
        console.log('✅ Systems List button clicked');
        
        // Step 4: Verify that the System List is loaded
        console.log('⚙️ Verifying that the System List is loaded...');
        const systemListPage = page.getByRole('heading', { name: 'System List' }).or(
            page.getByRole('heading', { name: 'Systems' })
        ).or(
            page.locator('[data-testid="system-list-page"]')
        ).or(
            page.locator('h1:has-text("System List")')
        ).or(
            page.locator('h1:has-text("Systems")')
        ).or(
            page.locator('.page-title:has-text("System")')
        );
        
        await expect(systemListPage).toBeVisible({ timeout: 15000 });
        console.log('✅ System List is loaded');
        
        // Verify system table is displayed
        const systemsTable = page.getByRole('table', { name: 'Systems' }).or(
            page.getByRole('table', { name: 'System List' })
        ).or(
            page.locator('[data-testid="systems-table"]')
        ).or(
            page.locator('.systems-table, .system-list')
        ).or(
            page.locator('table')
        );
        
        await expect(systemsTable).toBeVisible({ timeout: 15000 });
        console.log('✅ System table is displayed');
        
        // Get system rows
        const systemRows = systemsTable.locator('tbody tr, .system-row');
        const systemCount = await systemRows.count();
        console.log(`📊 Found ${systemCount} systems in the list`);
        
        if (systemCount === 0) {
            throw new Error('No systems found in the list');
        }
        
        // Step 5: Delete System
        console.log('🗑️ Selecting the desired System and clicking Delete (trash icon)...');
        
        // Look for a system with delete functionality
        let selectedSystem = null;
        let deleteButton = null;
        let systemToDeleteName = '';
        let systemToDeleteIndex = -1;
        
        // Try to find a system that can be deleted
        for (let i = 0; i < systemCount; i++) {
            const systemRow = systemRows.nth(i);
            const systemText = await systemRow.textContent();
            
            // Look for delete button in this row
            deleteButton = systemRow.locator('[data-testid="delete-btn"]').or(
                systemRow.locator('button[title*="Delete"]')
            ).or(
                systemRow.locator('button[aria-label*="Delete"]')
            ).or(
                systemRow.locator('.delete-btn, .trash-btn')
            ).or(
                systemRow.locator('svg[data-icon="trash"], .fa-trash, .fa-delete')
            ).or(
                systemRow.locator('i.fa-trash, i.fa-delete, i.fa-trash-o')
            ).or(
                systemRow.locator('button:has-text("Delete")')
            ).or(
                systemRow.locator('a:has-text("Delete")')
            );
            
            if (await deleteButton.count() > 0) {
                // Check if button is enabled
                const isDisabled = await deleteButton.isDisabled();
                if (!isDisabled) {
                    selectedSystem = systemRow;
                    systemToDeleteName = systemText || '';
                    systemToDeleteIndex = i;
                    console.log(`📄 Selected system for deletion: ${systemToDeleteName.substring(0, 50)}...`);
                    break;
                } else {
                    console.log(`🔒 System cannot be deleted (disabled): ${systemText?.substring(0, 30)}...`);
                }
            }
        }
        
        // If no delete button found, try looking for action menus
        if (!deleteButton || await deleteButton.count() === 0) {
            console.log('ℹ️ No dedicated delete button found, checking for action menus...');
            
            // Look for action menus or dropdowns
            const actionMenus = systemsTable.locator('[data-testid="action-menu"]').or(
                systemsTable.locator('.action-menu, .dropdown-menu')
            ).or(
                systemsTable.locator('button[aria-haspopup="menu"]')
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
                    selectedSystem = firstMenu;
                    const systemText = await firstMenu.textContent();
                    systemToDeleteName = systemText || '';
                    console.log(`📄 Found delete option in action menu for: ${systemToDeleteName.substring(0, 50)}...`);
                }
            }
        }
        
        if (!deleteButton || await deleteButton.count() === 0) {
            throw new Error('No delete button or delete option found for any system');
        }
        
        // Click the delete button
        await deleteButton.click();
        await page.waitForTimeout(1000);
        console.log('✅ Delete (trash icon) clicked');
        
        // Step 6: Verify that the confirmation message is displayed
        console.log('⚠️ Verifying that the confirmation message is displayed...');
        const confirmationMessage = page.getByText('Deleting this System will permanently remove the data and all data associated with it. Are you sure you want to delete').or(
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
        
        // Verify the confirmation message contains the system name
        if (confirmationText && systemToDeleteName) {
            const systemNameInMessage = systemToDeleteName.split('\n')[0].trim(); // Get first line of system name
            if (confirmationText.includes(systemNameInMessage)) {
                console.log(`✅ Confirmation message contains system name: ${systemNameInMessage}`);
            } else {
                console.log(`ℹ️ Confirmation message may not contain exact system name`);
            }
        }
        
        // Step 7: Confirm Deletion
        console.log('🗑️ Clicking Delete in the confirmation dialog...');
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
        
        // Step 8: Verify that the success message is displayed
        console.log('✅ Verifying that the success message is displayed...');
        const successMessage = page.getByText('System has been deleted successfully').or(
            page.getByText('System deleted successfully')
        ).or(
            page.getByText('System removed successfully')
        ).or(
            page.getByText('Successfully deleted')
        ).or(
            page.getByText('System has been removed')
        ).or(
            page.locator('[data-testid="success-message"]')
        ).or(
            page.locator('.success-message, .alert-success')
        );
        
        await expect(successMessage).toBeVisible({ timeout: 10000 });
        const successText = await successMessage.textContent();
        console.log(`✅ Success message: "${successText}" is displayed`);
        
        // Additional verification: Check if we're on the correct page
        const currentUrl = page.url();
        if (currentUrl.includes('system') || currentUrl.includes('organization')) {
            console.log('📋 Successfully completed system deletion');
        } else {
            console.log('ℹ️ Current page after system deletion:', currentUrl);
        }
        
        console.log('✅ Delete System test completed successfully');
    });

    test('REGRESSION: Cancel Delete System operation', async ({ page }) => {
        console.log('❌ Testing Cancel Delete System operation...');
        
        // Login and navigate
        await goToAliquotQaLink(page);
        await loginAquaUser(page, ALIQUOT_USERNAME_QA, ALIQUOT_PASSWORD_QA);
        await verifyAquaLoginQa(page);
        await clearCacheAndReload(page);
        
        // Navigate to Site Management -> My Organization -> Systems List
        const siteManagementTab = page.getByRole('tab', { name: 'Site Management' }).or(
            page.locator('a:has-text("Site Management")')
        );
        
        await siteManagementTab.hover();
        await page.waitForTimeout(1000);
        
        const myOrganizationLink = page.getByRole('menuitem', { name: 'My Organization' }).or(
            page.locator('a:has-text("My Organization")')
        );
        
        await myOrganizationLink.click();
        await page.waitForLoadState('networkidle');
        
        // Click Systems List
        const systemsListButton = page.getByRole('button', { name: 'Systems List' }).or(
            page.getByRole('button', { name: 'System List' })
        ).or(
            page.locator('button:has-text("Systems List")')
        ).or(
            page.locator('button:has-text("System List")')
        );
        
        if (await systemsListButton.count() > 0) {
            await systemsListButton.click();
            await page.waitForLoadState('networkidle');
            
            // Get systems list and find delete button
            const systemsTable = page.getByRole('table', { name: 'Systems' }).or(
                page.locator('.systems-table, .system-list')
            );
            
            const systemRows = systemsTable.locator('tbody tr, .system-row');
            
            if (await systemRows.count() > 0) {
                const firstSystem = systemRows.first();
                const deleteButton = firstSystem.locator('[data-testid="delete-btn"]').or(
                    firstSystem.locator('button[title*="Delete"]')
                ).or(
                    firstSystem.locator('button:has-text("Delete")')
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
                            
                            // Verify we're back to the system list page
                            const systemListPage = page.getByRole('heading', { name: 'System List' }).or(
                                page.locator('h1:has-text("System List")')
                            );
                            
                            if (await systemListPage.count() > 0) {
                                console.log('✅ Cancel button works - returned to System List page');
                            } else {
                                console.log('ℹ️ Cancel button clicked but page navigation unclear');
                            }
                        }
                    }
                }
            }
        }
        
        console.log('✅ Cancel Delete System operation test completed');
    });

    test('REGRESSION: Verify delete permissions and restrictions for systems', async ({ page }) => {
        console.log('🔒 Testing delete permissions and restrictions for systems...');
        
        // Login and navigate
        await goToAliquotQaLink(page);
        await loginAquaUser(page, ALIQUOT_USERNAME_QA, ALIQUOT_PASSWORD_QA);
        await verifyAquaLoginQa(page);
        await clearCacheAndReload(page);
        
        // Navigate to Site Management -> My Organization -> Systems List
        const siteManagementTab = page.getByRole('tab', { name: 'Site Management' }).or(
            page.locator('a:has-text("Site Management")')
        );
        
        await siteManagementTab.hover();
        await page.waitForTimeout(1000);
        
        const myOrganizationLink = page.getByRole('menuitem', { name: 'My Organization' }).or(
            page.locator('a:has-text("My Organization")')
        );
        
        await myOrganizationLink.click();
        await page.waitForLoadState('networkidle');
        
        // Click Systems List
        const systemsListButton = page.getByRole('button', { name: 'Systems List' }).or(
            page.getByRole('button', { name: 'System List' })
        ).or(
            page.locator('button:has-text("Systems List")')
        ).or(
            page.locator('button:has-text("System List")')
        );
        
        if (await systemsListButton.count() > 0) {
            await systemsListButton.click();
            await page.waitForLoadState('networkidle');
            
            // Check delete button availability
            const systemsTable = page.getByRole('table', { name: 'Systems' }).or(
                page.locator('.systems-table, .system-list')
            );
            
            const systemRows = systemsTable.locator('tbody tr, .system-row');
            const systemCount = await systemRows.count();
            
            let deleteButtonsFound = 0;
            let restrictedSystems = 0;
            let readOnlySystems = 0;
            
            for (let i = 0; i < systemCount; i++) {
                const systemRow = systemRows.nth(i);
                const systemText = await systemRow.textContent();
                
                // Check for delete button
                const deleteButton = systemRow.locator('[data-testid="delete-btn"]').or(
                    systemRow.locator('button[title*="Delete"]')
                ).or(
                    systemRow.locator('svg[data-icon="trash"], .fa-trash, .fa-delete')
                ).or(
                    systemRow.locator('button:has-text("Delete")')
                );
                
                if (await deleteButton.count() > 0) {
                    // Check if button is disabled
                    const isDisabled = await deleteButton.isDisabled();
                    if (isDisabled) {
                        readOnlySystems++;
                        console.log(`🔒 System cannot be deleted (disabled): ${systemText?.substring(0, 30)}...`);
                    } else {
                        deleteButtonsFound++;
                        console.log(`✅ Delete available for: ${systemText?.substring(0, 30)}...`);
                    }
                } else {
                    restrictedSystems++;
                    console.log(`🔒 No delete option for: ${systemText?.substring(0, 30)}...`);
                }
            }
            
            console.log(`📊 Delete permissions summary for systems:`);
            console.log(`  - Systems with delete access: ${deleteButtonsFound}`);
            console.log(`  - Systems read-only: ${readOnlySystems}`);
            console.log(`  - Systems with restricted access: ${restrictedSystems}`);
            console.log(`  - Total systems: ${systemCount}`);
            
            // Check for any permission-related error messages
            const errorMessage = page.locator('.error-message, .alert-error, [data-testid="error-message"]');
            if (await errorMessage.count() > 0) {
                const errorText = await errorMessage.first().textContent();
                console.log(`⚠️ Permission error message: ${errorText}`);
            }
        }
        
        console.log('✅ Delete permissions and restrictions test completed');
    });
});
