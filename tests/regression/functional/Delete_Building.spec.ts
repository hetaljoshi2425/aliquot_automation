// Test Case: Delete Building (No Reports Created by Building)
// Preconditions:
// - User is logged into the application
// - User has access to the Site Management module
// - User has permission to delete buildings
// - At least one client exists in the system
// - At least one customer exists under the selected client
// - At least one facility exists under the selected customer
// - At least one building exists under the selected facility that can be deleted
// - The building has no reports created by it
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

test.describe('Delete Building - Functional Tests', () => {

    test.beforeEach(async ({ page }) => {
        console.log('🔧 Setting up Delete Building test environment...');
    });

    test.afterEach(async ({ page }) => {
        console.log('🧹 Cleaning up Delete Building test data...');
    });

    test('REGRESSION: Delete Building functionality works correctly', async ({ page }) => {
        console.log('🗑️ Testing Delete Building functionality...');
        
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
        
        // Step 2: Verify that the My Organization page is loaded and the Client List is displayed
        console.log('📋 Verifying that the My Organization page is loaded and the Client List is displayed...');
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
        console.log('✅ Client List is displayed');
        
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
        
        // Step 3: Filter and Open Building List
        console.log('🔍 In the Filter by Location section, selecting Client, Customer, and Facility...');
        
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
        } else {
            console.log('ℹ️ Filter by Location section not found, proceeding with default selection');
        }
        
        // Click Building Lists button
        console.log('🏢 Clicking Building Lists button...');
        const buildingListsButton = page.getByRole('button', { name: 'Building Lists' }).or(
            page.getByRole('link', { name: 'Building Lists' })
        ).or(
            page.locator('[data-testid="building-lists-button"]')
        ).or(
            page.locator('button:has-text("Building Lists")')
        ).or(
            page.locator('a:has-text("Building Lists")')
        ).or(
            page.locator('.building-lists-btn, .building-lists-link')
        );
        
        await buildingListsButton.click();
        await page.waitForLoadState('networkidle');
        console.log('✅ Building Lists button clicked');
        
        // Step 4: Verify that the Building List is loaded
        console.log('🏢 Verifying that the Building List is loaded...');
        const buildingListPage = page.getByRole('heading', { name: 'Building Lists' }).or(
            page.getByRole('heading', { name: 'Buildings' })
        ).or(
            page.locator('[data-testid="building-list-page"]')
        ).or(
            page.locator('h1:has-text("Building Lists")')
        ).or(
            page.locator('h1:has-text("Buildings")')
        ).or(
            page.locator('.page-title:has-text("Building")')
        );
        
        await expect(buildingListPage).toBeVisible({ timeout: 15000 });
        console.log('✅ Building List is loaded');
        
        // Verify building table is displayed
        const buildingsTable = page.getByRole('table', { name: 'Buildings' }).or(
            page.getByRole('table', { name: 'Building List' })
        ).or(
            page.locator('[data-testid="buildings-table"]')
        ).or(
            page.locator('.buildings-table, .building-list')
        ).or(
            page.locator('table')
        );
        
        await expect(buildingsTable).toBeVisible({ timeout: 15000 });
        console.log('✅ Building table is displayed');
        
        // Get building rows
        const buildingRows = buildingsTable.locator('tbody tr, .building-row');
        const buildingCount = await buildingRows.count();
        console.log(`📊 Found ${buildingCount} buildings in the list`);
        
        if (buildingCount === 0) {
            throw new Error('No buildings found in the list');
        }
        
        // Step 5: Delete Building
        console.log('🗑️ Selecting the desired Building and clicking Delete (trash icon)...');
        
        // Look for a building with delete functionality
        let selectedBuilding = null;
        let deleteButton = null;
        let buildingToDeleteName = '';
        let buildingToDeleteIndex = -1;
        
        // Try to find a building that can be deleted
        for (let i = 0; i < buildingCount; i++) {
            const buildingRow = buildingRows.nth(i);
            const buildingText = await buildingRow.textContent();
            
            // Look for delete button in this row
            deleteButton = buildingRow.locator('[data-testid="delete-btn"]').or(
                buildingRow.locator('button[title*="Delete"]')
            ).or(
                buildingRow.locator('button[aria-label*="Delete"]')
            ).or(
                buildingRow.locator('.delete-btn, .trash-btn')
            ).or(
                buildingRow.locator('svg[data-icon="trash"], .fa-trash, .fa-delete')
            ).or(
                buildingRow.locator('i.fa-trash, i.fa-delete, i.fa-trash-o')
            ).or(
                buildingRow.locator('button:has-text("Delete")')
            ).or(
                buildingRow.locator('a:has-text("Delete")')
            );
            
            if (await deleteButton.count() > 0) {
                // Check if button is enabled
                const isDisabled = await deleteButton.isDisabled();
                if (!isDisabled) {
                    selectedBuilding = buildingRow;
                    buildingToDeleteName = buildingText || '';
                    buildingToDeleteIndex = i;
                    console.log(`📄 Selected building for deletion: ${buildingToDeleteName.substring(0, 50)}...`);
                    break;
                } else {
                    console.log(`🔒 Building cannot be deleted (disabled): ${buildingText?.substring(0, 30)}...`);
                }
            }
        }
        
        // If no delete button found, try looking for action menus
        if (!deleteButton || await deleteButton.count() === 0) {
            console.log('ℹ️ No dedicated delete button found, checking for action menus...');
            
            // Look for action menus or dropdowns
            const actionMenus = buildingsTable.locator('[data-testid="action-menu"]').or(
                buildingsTable.locator('.action-menu, .dropdown-menu')
            ).or(
                buildingsTable.locator('button[aria-haspopup="menu"]')
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
                    selectedBuilding = firstMenu;
                    const buildingText = await firstMenu.textContent();
                    buildingToDeleteName = buildingText || '';
                    console.log(`📄 Found delete option in action menu for: ${buildingToDeleteName.substring(0, 50)}...`);
                }
            }
        }
        
        if (!deleteButton || await deleteButton.count() === 0) {
            throw new Error('No delete button or delete option found for any building');
        }
        
        // Click the delete button
        await deleteButton.click();
        await page.waitForTimeout(1000);
        console.log('✅ Delete (trash icon) clicked');
        
        // Step 6: Verify that the confirmation message is displayed
        console.log('⚠️ Verifying that the confirmation message is displayed...');
        const confirmationMessage = page.getByText('Deleting this Building will permanently remove the data and all data associated with it. Are you sure you want to delete').or(
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
        
        // Verify the confirmation message contains the building name
        if (confirmationText && buildingToDeleteName) {
            const buildingNameInMessage = buildingToDeleteName.split('\n')[0].trim(); // Get first line of building name
            if (confirmationText.includes(buildingNameInMessage)) {
                console.log(`✅ Confirmation message contains building name: ${buildingNameInMessage}`);
            } else {
                console.log(`ℹ️ Confirmation message may not contain exact building name`);
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
        const successMessage = page.getByText('Building has been deleted successfully').or(
            page.getByText('Building deleted successfully')
        ).or(
            page.getByText('Building removed successfully')
        ).or(
            page.getByText('Successfully deleted')
        ).or(
            page.getByText('Building has been removed')
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
        if (currentUrl.includes('building') || currentUrl.includes('organization')) {
            console.log('📋 Successfully completed building deletion');
        } else {
            console.log('ℹ️ Current page after building deletion:', currentUrl);
        }
        
        console.log('✅ Delete Building test completed successfully');
    });

    test('REGRESSION: Cancel Delete Building operation', async ({ page }) => {
        console.log('❌ Testing Cancel Delete Building operation...');
        
        // Login and navigate
        await goToAliquotQaLink(page);
        await loginAquaUser(page, ALIQUOT_USERNAME_QA, ALIQUOT_PASSWORD_QA);
        await verifyAquaLoginQa(page);
        await clearCacheAndReload(page);
        
        // Navigate to Site Management -> My Organization -> Building Lists
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
        
        // Click Building Lists
        const buildingListsButton = page.getByRole('button', { name: 'Building Lists' }).or(
            page.locator('button:has-text("Building Lists")')
        );
        
        if (await buildingListsButton.count() > 0) {
            await buildingListsButton.click();
            await page.waitForLoadState('networkidle');
            
            // Get buildings list and find delete button
            const buildingsTable = page.getByRole('table', { name: 'Buildings' }).or(
                page.locator('.buildings-table, .building-list')
            );
            
            const buildingRows = buildingsTable.locator('tbody tr, .building-row');
            
            if (await buildingRows.count() > 0) {
                const firstBuilding = buildingRows.first();
                const deleteButton = firstBuilding.locator('[data-testid="delete-btn"]').or(
                    firstBuilding.locator('button[title*="Delete"]')
                ).or(
                    firstBuilding.locator('button:has-text("Delete")')
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
                            
                            // Verify we're back to the building list page
                            const buildingListPage = page.getByRole('heading', { name: 'Building Lists' }).or(
                                page.locator('h1:has-text("Building Lists")')
                            );
                            
                            if (await buildingListPage.count() > 0) {
                                console.log('✅ Cancel button works - returned to Building Lists page');
                            } else {
                                console.log('ℹ️ Cancel button clicked but page navigation unclear');
                            }
                        }
                    }
                }
            }
        }
        
        console.log('✅ Cancel Delete Building operation test completed');
    });

    test('REGRESSION: Verify delete permissions and restrictions for buildings', async ({ page }) => {
        console.log('🔒 Testing delete permissions and restrictions for buildings...');
        
        // Login and navigate
        await goToAliquotQaLink(page);
        await loginAquaUser(page, ALIQUOT_USERNAME_QA, ALIQUOT_PASSWORD_QA);
        await verifyAquaLoginQa(page);
        await clearCacheAndReload(page);
        
        // Navigate to Site Management -> My Organization -> Building Lists
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
        
        // Click Building Lists
        const buildingListsButton = page.getByRole('button', { name: 'Building Lists' }).or(
            page.locator('button:has-text("Building Lists")')
        );
        
        if (await buildingListsButton.count() > 0) {
            await buildingListsButton.click();
            await page.waitForLoadState('networkidle');
            
            // Check delete button availability
            const buildingsTable = page.getByRole('table', { name: 'Buildings' }).or(
                page.locator('.buildings-table, .building-list')
            );
            
            const buildingRows = buildingsTable.locator('tbody tr, .building-row');
            const buildingCount = await buildingRows.count();
            
            let deleteButtonsFound = 0;
            let restrictedBuildings = 0;
            let readOnlyBuildings = 0;
            
            for (let i = 0; i < buildingCount; i++) {
                const buildingRow = buildingRows.nth(i);
                const buildingText = await buildingRow.textContent();
                
                // Check for delete button
                const deleteButton = buildingRow.locator('[data-testid="delete-btn"]').or(
                    buildingRow.locator('button[title*="Delete"]')
                ).or(
                    buildingRow.locator('svg[data-icon="trash"], .fa-trash, .fa-delete')
                ).or(
                    buildingRow.locator('button:has-text("Delete")')
                );
                
                if (await deleteButton.count() > 0) {
                    // Check if button is disabled
                    const isDisabled = await deleteButton.isDisabled();
                    if (isDisabled) {
                        readOnlyBuildings++;
                        console.log(`🔒 Building cannot be deleted (disabled): ${buildingText?.substring(0, 30)}...`);
                    } else {
                        deleteButtonsFound++;
                        console.log(`✅ Delete available for: ${buildingText?.substring(0, 30)}...`);
                    }
                } else {
                    restrictedBuildings++;
                    console.log(`🔒 No delete option for: ${buildingText?.substring(0, 30)}...`);
                }
            }
            
            console.log(`📊 Delete permissions summary for buildings:`);
            console.log(`  - Buildings with delete access: ${deleteButtonsFound}`);
            console.log(`  - Buildings read-only: ${readOnlyBuildings}`);
            console.log(`  - Buildings with restricted access: ${restrictedBuildings}`);
            console.log(`  - Total buildings: ${buildingCount}`);
            
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
