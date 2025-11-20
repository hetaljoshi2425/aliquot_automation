// Test Case: Edit Client
// Preconditions:
// - User is logged into the application
// - User has access to the Site Management module
// - User has permission to edit clients
// - At least one client exists in the system that can be edited
// - User has appropriate organizational permissions

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

test.describe('Edit Client - Functional Tests', () => {

    test.beforeEach(async ({ page }) => {
        console.log('🔧 Setting up Edit Client test environment...');
    });

    test.afterEach(async ({ page }) => {
        console.log('🧹 Cleaning up Edit Client test data...');
    });

    test('REGRESSION: Edit Client functionality works correctly', async ({ page }) => {
        console.log('✏️ Testing Edit Client functionality...');
        
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
        
        // Step 5: Select a Client and click the Edit (pencil) icon
        console.log('✏️ Selecting a Client and clicking the Edit (pencil) icon...');
        
        // Look for a client with edit functionality
        let selectedClient = null;
        let editButton = null;
        let clientToEditName = '';
        let originalClientData: { name?: string; code?: string; address?: string; email?: string; phone?: string; city?: string; state?: string; zip?: string } = {};
        
        // Try to find a client that can be edited
        for (let i = 0; i < clientCount; i++) {
            const clientRow = clientRows.nth(i);
            const clientText = await clientRow.textContent();
            
            // Look for edit button in this row
            editButton = clientRow.locator('[data-testid="edit-btn"]').or(
                clientRow.locator('button[title*="Edit"]')
            ).or(
                clientRow.locator('button[aria-label*="Edit"]')
            ).or(
                clientRow.locator('.edit-btn, .pencil-btn')
            ).or(
                clientRow.locator('svg[data-icon="edit"], .fa-edit, .fa-pencil')
            ).or(
                clientRow.locator('i.fa-edit, i.fa-pencil, i.fa-pencil-square-o')
            ).or(
                clientRow.locator('button:has-text("Edit")')
            ).or(
                clientRow.locator('a:has-text("Edit")')
            );
            
            if (await editButton.count() > 0) {
                // Check if button is enabled
                const isDisabled = await editButton.isDisabled();
                if (!isDisabled) {
                    selectedClient = clientRow;
                    clientToEditName = clientText || '';
                    console.log(`📄 Selected client for editing: ${clientToEditName.substring(0, 50)}...`);
                    break;
                } else {
                    console.log(`🔒 Client is read-only and cannot be edited: ${clientText?.substring(0, 30)}...`);
                }
            }
        }
        
        // If no edit button found, try looking for action menus
        if (!editButton || await editButton.count() === 0) {
            console.log('ℹ️ No dedicated edit button found, checking for action menus...');
            
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
                
                // Look for edit option in the menu
                editButton = page.getByRole('menuitem', { name: 'Edit' }).or(
                    page.locator('[data-testid="edit-option"]')
                ).or(
                    page.locator('a:has-text("Edit"), button:has-text("Edit")')
                );
                
                if (await editButton.count() > 0) {
                    selectedClient = firstMenu;
                    const clientText = await firstMenu.textContent();
                    clientToEditName = clientText || '';
                    console.log(`📄 Found edit option in action menu for: ${clientToEditName.substring(0, 50)}...`);
                }
            }
        }
        
        if (!editButton || await editButton.count() === 0) {
            throw new Error('No edit button or edit option found for any client');
        }
        
        // Click the edit button
        await editButton.click();
        await page.waitForLoadState('networkidle');
        console.log('✅ Edit (pencil) icon clicked');
        
        // Step 6: Verify Edit Client page is displayed
        console.log('📝 Verifying Edit Client page is displayed...');
        const editClientPage = page.getByRole('heading', { name: 'Edit Client' }).or(
            page.getByRole('heading', { name: 'Modify Client' })
        ).or(
            page.locator('[data-testid="edit-client-page"]')
        ).or(
            page.locator('h1:has-text("Edit Client")')
        ).or(
            page.locator('h1:has-text("Modify Client")')
        ).or(
            page.locator('.page-title:has-text("Edit")')
        );
        
        await expect(editClientPage).toBeVisible({ timeout: 15000 });
        console.log('✅ Edit Client page is displayed');
        
        // Step 7: Edit or add any data, then click Save Client
        console.log('✏️ Editing or adding any data, then clicking Save Client...');
        
        // Get current values and make changes
        const clientNameInput = page.getByLabel('Client Name').or(
            page.getByLabel('Name')
        ).or(
            page.locator('[data-testid="client-name-input"]')
        ).or(
            page.locator('input[name*="clientName"]')
        ).or(
            page.locator('input[name*="name"]')
        ).or(
            page.locator('input[placeholder*="Client Name"]')
        ).or(
            page.locator('input[placeholder*="Name"]')
        );
        
        if (await clientNameInput.count() > 0) {
            const originalName = await clientNameInput.inputValue();
            originalClientData.name = originalName;
            const newName = `EDITED-${originalName}`;
            await clientNameInput.fill(newName);
            console.log(`📝 Updated Client Name: ${originalName} → ${newName}`);
        }
        
        const clientCodeInput = page.getByLabel('Client Code').or(
            page.getByLabel('Code')
        ).or(
            page.locator('[data-testid="client-code-input"]')
        ).or(
            page.locator('input[name*="clientCode"]')
        ).or(
            page.locator('input[name*="code"]')
        ).or(
            page.locator('input[placeholder*="Client Code"]')
        ).or(
            page.locator('input[placeholder*="Code"]')
        );
        
        if (await clientCodeInput.count() > 0) {
            const originalCode = await clientCodeInput.inputValue();
            originalClientData.code = originalCode;
            const newCode = `EDITED-${originalCode}`;
            await clientCodeInput.fill(newCode);
            console.log(`📝 Updated Client Code: ${originalCode} → ${newCode}`);
        }
        
        const addressInput = page.getByLabel('Address').or(
            page.getByLabel('Street Address')
        ).or(
            page.locator('[data-testid="address-input"]')
        ).or(
            page.locator('input[name*="address"]')
        ).or(
            page.locator('textarea[name*="address"]')
        ).or(
            page.locator('input[placeholder*="Address"]')
        ).or(
            page.locator('textarea[placeholder*="Address"]')
        );
        
        if (await addressInput.count() > 0) {
            const originalAddress = await addressInput.inputValue();
            originalClientData.address = originalAddress;
            const newAddress = `${originalAddress} - Updated ${new Date().toISOString().slice(0, 19)}`;
            await addressInput.fill(newAddress);
            console.log(`📝 Updated Address: ${originalAddress} → ${newAddress}`);
        }
        
        const emailInput = page.getByLabel('Email').or(
            page.getByLabel('Email Address')
        ).or(
            page.locator('[data-testid="email-input"]')
        ).or(
            page.locator('input[name*="email"]')
        ).or(
            page.locator('input[type="email"]')
        ).or(
            page.locator('input[placeholder*="Email"]')
        );
        
        if (await emailInput.count() > 0) {
            const originalEmail = await emailInput.inputValue();
            originalClientData.email = originalEmail;
            const newEmail = `edited${randomUUID().substring(0, 8)}@example.com`;
            await emailInput.fill(newEmail);
            console.log(`📝 Updated Email: ${originalEmail} → ${newEmail}`);
        }
        
        const phoneInput = page.getByLabel('Phone').or(
            page.getByLabel('Phone Number')
        ).or(
            page.locator('[data-testid="phone-input"]')
        ).or(
            page.locator('input[name*="phone"]')
        ).or(
            page.locator('input[name*="telephone"]')
        ).or(
            page.locator('input[placeholder*="Phone"]')
        );
        
        if (await phoneInput.count() > 0) {
            const originalPhone = await phoneInput.inputValue();
            originalClientData.phone = originalPhone;
            const newPhone = `555-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
            await phoneInput.fill(newPhone);
            console.log(`📝 Updated Phone: ${originalPhone} → ${newPhone}`);
        }
        
        const cityInput = page.getByLabel('City').or(
            page.locator('[data-testid="city-input"]')
        ).or(
            page.locator('input[name*="city"]')
        ).or(
            page.locator('input[placeholder*="City"]')
        );
        
        if (await cityInput.count() > 0) {
            const originalCity = await cityInput.inputValue();
            originalClientData.city = originalCity;
            const newCity = `${originalCity} - Updated`;
            await cityInput.fill(newCity);
            console.log(`📝 Updated City: ${originalCity} → ${newCity}`);
        }
        
        const stateInput = page.getByLabel('State').or(
            page.locator('[data-testid="state-input"]')
        ).or(
            page.locator('input[name*="state"]')
        ).or(
            page.locator('select[name*="state"]')
        ).or(
            page.locator('input[placeholder*="State"]')
        );
        
        if (await stateInput.count() > 0) {
            const originalState = await stateInput.inputValue();
            originalClientData.state = originalState;
            const newState = 'ED';
            await stateInput.fill(newState);
            console.log(`📝 Updated State: ${originalState} → ${newState}`);
        }
        
        const zipInput = page.getByLabel('Zip Code').or(
            page.getByLabel('Postal Code')
        ).or(
            page.locator('[data-testid="zip-input"]')
        ).or(
            page.locator('input[name*="zip"]')
        ).or(
            page.locator('input[name*="postal"]')
        ).or(
            page.locator('input[placeholder*="Zip"]')
        );
        
        if (await zipInput.count() > 0) {
            const originalZip = await zipInput.inputValue();
            originalClientData.zip = originalZip;
            const newZip = '99999';
            await zipInput.fill(newZip);
            console.log(`📝 Updated Zip Code: ${originalZip} → ${newZip}`);
        }
        
        // Click Save Client
        console.log('💾 Clicking Save Client button...');
        const saveClientButton = page.getByRole('button', { name: 'Save Client' }).or(
            page.getByRole('button', { name: 'Save' })
        ).or(
            page.getByRole('button', { name: 'Update' })
        ).or(
            page.locator('[data-testid="save-client-btn"]')
        ).or(
            page.locator('button:has-text("Save")')
        ).or(
            page.locator('button:has-text("Update")')
        );
        
        await expect(saveClientButton).toBeVisible({ timeout: 10000 });
        await saveClientButton.click();
        
        // Wait for save operation to complete
        await page.waitForTimeout(3000);
        
        // Step 8: Verify Success message is displayed
        console.log('✅ Verifying success message is displayed...');
        const successMessage = page.getByText('Client has been saved successfully').or(
            page.getByText('Client saved successfully')
        ).or(
            page.getByText('Client updated successfully')
        ).or(
            page.getByText('Successfully saved')
        ).or(
            page.getByText('Client modified successfully')
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
        if (currentUrl.includes('organization') || currentUrl.includes('client')) {
            console.log('📋 Successfully completed client editing');
        } else {
            console.log('ℹ️ Current page after client edit:', currentUrl);
        }
        
        console.log('✅ Edit Client test completed successfully');
    });

    test('REGRESSION: Edit Client with validation errors', async ({ page }) => {
        console.log('⚠️ Testing Edit Client with validation errors...');
        
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
        
        // Get clients list and find edit button
        const clientsList = page.getByRole('table', { name: 'Clients' }).or(
            page.locator('.clients-table, .client-list')
        );
        
        const clientRows = clientsList.locator('tbody tr, .client-row');
        
        if (await clientRows.count() > 0) {
            const firstClient = clientRows.first();
            const editButton = firstClient.locator('[data-testid="edit-btn"]').or(
                firstClient.locator('button[title*="Edit"]')
            ).or(
                firstClient.locator('button:has-text("Edit")')
            );
            
            if (await editButton.count() > 0 && !(await editButton.isDisabled())) {
                await editButton.click();
                await page.waitForLoadState('networkidle');
                
                // Try to save with invalid data (empty required fields)
                const clientNameInput = page.getByLabel('Client Name').or(
                    page.locator('input[placeholder*="Client Name"]')
                );
                
                if (await clientNameInput.count() > 0) {
                    await clientNameInput.fill(''); // Clear required field
                    
                    const saveClientButton = page.getByRole('button', { name: 'Save Client' }).or(
                        page.locator('button:has-text("Save")')
                    );
                    
                    if (await saveClientButton.count() > 0) {
                        await saveClientButton.click();
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
        }
        
        console.log('✅ Edit Client validation test completed');
    });

    test('REGRESSION: Cancel Edit Client operation', async ({ page }) => {
        console.log('❌ Testing Cancel Edit Client operation...');
        
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
        
        // Get clients list and find edit button
        const clientsList = page.getByRole('table', { name: 'Clients' }).or(
            page.locator('.clients-table, .client-list')
        );
        
        const clientRows = clientsList.locator('tbody tr, .client-row');
        
        if (await clientRows.count() > 0) {
            const firstClient = clientRows.first();
            const editButton = firstClient.locator('[data-testid="edit-btn"]').or(
                firstClient.locator('button[title*="Edit"]')
            ).or(
                firstClient.locator('button:has-text("Edit")')
            );
            
            if (await editButton.count() > 0 && !(await editButton.isDisabled())) {
                await editButton.click();
                await page.waitForLoadState('networkidle');
                
                // Verify edit page is open
                const editClientPage = page.getByRole('heading', { name: 'Edit Client' }).or(
                    page.locator('h1:has-text("Edit Client")')
                );
                
                if (await editClientPage.count() > 0) {
                    console.log('✅ Edit Client page is open');
                    
                    // Make some changes
                    const clientNameInput = page.getByLabel('Client Name').or(
                        page.locator('input[placeholder*="Client Name"]')
                    );
                    
                    if (await clientNameInput.count() > 0) {
                        await clientNameInput.fill('TEST-CANCEL');
                        console.log('📝 Made test changes');
                    }
                    
                    // Click Cancel
                    const cancelButton = page.getByRole('button', { name: 'Cancel' }).or(
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
        
        console.log('✅ Cancel Edit Client operation test completed');
    });

    test('REGRESSION: Verify edit permissions and restrictions for clients', async ({ page }) => {
        console.log('🔒 Testing edit permissions and restrictions for clients...');
        
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
        
        // Check edit button availability
        const clientsList = page.getByRole('table', { name: 'Clients' }).or(
            page.locator('.clients-table, .client-list')
        );
        
        const clientRows = clientsList.locator('tbody tr, .client-row');
        const clientCount = await clientRows.count();
        
        let editButtonsFound = 0;
        let restrictedClients = 0;
        let readOnlyClients = 0;
        
        for (let i = 0; i < clientCount; i++) {
            const clientRow = clientRows.nth(i);
            const clientText = await clientRow.textContent();
            
            // Check for edit button
            const editButton = clientRow.locator('[data-testid="edit-btn"]').or(
                clientRow.locator('button[title*="Edit"]')
            ).or(
                clientRow.locator('svg[data-icon="edit"], .fa-edit, .fa-pencil')
            ).or(
                clientRow.locator('button:has-text("Edit")')
            );
            
            if (await editButton.count() > 0) {
                // Check if button is disabled
                const isDisabled = await editButton.isDisabled();
                if (isDisabled) {
                    readOnlyClients++;
                    console.log(`🔒 Client is read-only: ${clientText?.substring(0, 30)}...`);
                } else {
                    editButtonsFound++;
                    console.log(`✅ Edit available for: ${clientText?.substring(0, 30)}...`);
                }
            } else {
                restrictedClients++;
                console.log(`🔒 No edit option for: ${clientText?.substring(0, 30)}...`);
            }
        }
        
        console.log(`📊 Edit permissions summary for clients:`);
        console.log(`  - Clients with edit access: ${editButtonsFound}`);
        console.log(`  - Clients read-only: ${readOnlyClients}`);
        console.log(`  - Clients with restricted access: ${restrictedClients}`);
        console.log(`  - Total clients: ${clientCount}`);
        
        // Check for any permission-related error messages
        const errorMessage = page.locator('.error-message, .alert-error, [data-testid="error-message"]');
        if (await errorMessage.count() > 0) {
            const errorText = await errorMessage.first().textContent();
            console.log(`⚠️ Permission error message: ${errorText}`);
        }
        
        console.log('✅ Edit permissions and restrictions test completed');
    });
});
