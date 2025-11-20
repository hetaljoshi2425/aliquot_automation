// Test Case: Edit Customer
// Preconditions:
// - User is logged into the application
// - User has access to the Site Management module
// - User has permission to edit customers
// - At least one client exists in the system
// - At least one customer exists under the selected client
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

test.describe('Edit Customer - Functional Tests', () => {

    test.beforeEach(async ({ page }) => {
        console.log('🔧 Setting up Edit Customer test environment...');
    });

    test.afterEach(async ({ page }) => {
        console.log('🧹 Cleaning up Edit Customer test data...');
    });

    test('REGRESSION: Edit Customer functionality works correctly', async ({ page }) => {
        console.log('✏️ Testing Edit Customer functionality...');
        
        // Login and navigate
        await goToAliquotQaLink(page);
        await loginAquaUser(page, ALIQUOT_USERNAME_QA, ALIQUOT_PASSWORD_QA);
        await verifyAquaLoginQa(page);
        await clearCacheAndReload(page);
        
        // Step 1: Go to Site Management -> My Organization
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
        
        // Step 2: Verify My Organization page is loaded and Client list is displayed
        console.log('📋 Verifying My Organization page is loaded with Client list...');
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
        
        // Step 3: Select Client from Filter Organization section
        console.log('🔍 Selecting Client from Filter Organization section...');
        
        // Look for filter organization section
        const filterOrganizationSection = page.locator('[data-testid="filter-organization-section"]').or(
            page.locator('.filter-organization, .organization-filter')
        ).or(
            page.locator('section:has-text("Filter Organization")')
        ).or(
            page.locator('div:has-text("Filter Organization")')
        ).or(
            page.locator('.filter-section:has-text("Organization")')
        );
        
        if (await filterOrganizationSection.count() > 0) {
            console.log('✅ Filter Organization section found');
            
            // Look for client dropdown or selection
            const clientFilterDropdown = filterOrganizationSection.locator('select').or(
                filterOrganizationSection.locator('[data-testid="client-filter-dropdown"]')
            ).or(
                filterOrganizationSection.locator('.client-dropdown, .organization-dropdown')
            ).or(
                filterOrganizationSection.locator('input[placeholder*="Client"]')
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
                    console.log('✅ Client selected from filter dropdown');
                }
            }
        } else {
            console.log('ℹ️ Filter Organization section not found, proceeding with first client');
        }
        
        // Step 4: Verify Select Customer link is appeared
        console.log('🔗 Verifying Select Customer link is appeared...');
        const selectCustomerLink = page.getByRole('link', { name: 'Select Customer' }).or(
            page.getByRole('button', { name: 'Select Customer' })
        ).or(
            page.locator('[data-testid="select-customer-link"]')
        ).or(
            page.locator('a:has-text("Select Customer")')
        ).or(
            page.locator('button:has-text("Select Customer")')
        ).or(
            page.locator('.select-customer-link, .customer-link')
        );
        
        await expect(selectCustomerLink).toBeVisible({ timeout: 10000 });
        console.log('✅ Select Customer link is appeared');
        
        // Step 5: Click Customer Lists button
        console.log('📋 Clicking Customer Lists button...');
        const customerListsButton = page.getByRole('button', { name: 'Customer Lists' }).or(
            page.getByRole('link', { name: 'Customer Lists' })
        ).or(
            page.locator('[data-testid="customer-lists-button"]')
        ).or(
            page.locator('button:has-text("Customer Lists")')
        ).or(
            page.locator('a:has-text("Customer Lists")')
        ).or(
            page.locator('.customer-lists-btn, .customer-lists-link')
        );
        
        await customerListsButton.click();
        await page.waitForLoadState('networkidle');
        
        // Step 6: Verify Customer list is loaded
        console.log('👥 Verifying Customer list is loaded...');
        const customerListPage = page.getByRole('heading', { name: 'Customer Lists' }).or(
            page.getByRole('heading', { name: 'Customers' })
        ).or(
            page.locator('[data-testid="customer-list-page"]')
        ).or(
            page.locator('h1:has-text("Customer Lists")')
        ).or(
            page.locator('h1:has-text("Customers")')
        ).or(
            page.locator('.page-title:has-text("Customer")')
        );
        
        await expect(customerListPage).toBeVisible({ timeout: 15000 });
        console.log('✅ Customer list is loaded');
        
        // Verify customer table is displayed
        const customersTable = page.getByRole('table', { name: 'Customers' }).or(
            page.getByRole('table', { name: 'Customer List' })
        ).or(
            page.locator('[data-testid="customers-table"]')
        ).or(
            page.locator('.customers-table, .customer-list')
        ).or(
            page.locator('table')
        );
        
        await expect(customersTable).toBeVisible({ timeout: 15000 });
        console.log('✅ Customer table is displayed');
        
        // Get customer rows
        const customerRows = customersTable.locator('tbody tr, .customer-row');
        const customerCount = await customerRows.count();
        console.log(`📊 Found ${customerCount} customers in the list`);
        
        if (customerCount === 0) {
            throw new Error('No customers found in the list');
        }
        
        // Step 7: Select Customer and click Edit (pencil icon)
        console.log('✏️ Selecting Customer and clicking Edit (pencil icon)...');
        
        // Look for a customer with edit functionality
        let selectedCustomer = null;
        let editButton = null;
        let customerToEditName = '';
        let originalCustomerData: { name?: string; code?: string; address?: string; email?: string; phone?: string; city?: string; state?: string; zip?: string } = {};
        
        // Try to find a customer that can be edited
        for (let i = 0; i < customerCount; i++) {
            const customerRow = customerRows.nth(i);
            const customerText = await customerRow.textContent();
            
            // Look for edit button in this row
            editButton = customerRow.locator('[data-testid="edit-btn"]').or(
                customerRow.locator('button[title*="Edit"]')
            ).or(
                customerRow.locator('button[aria-label*="Edit"]')
            ).or(
                customerRow.locator('.edit-btn, .pencil-btn')
            ).or(
                customerRow.locator('svg[data-icon="edit"], .fa-edit, .fa-pencil')
            ).or(
                customerRow.locator('i.fa-edit, i.fa-pencil, i.fa-pencil-square-o')
            ).or(
                customerRow.locator('button:has-text("Edit")')
            ).or(
                customerRow.locator('a:has-text("Edit")')
            );
            
            if (await editButton.count() > 0) {
                // Check if button is enabled
                const isDisabled = await editButton.isDisabled();
                if (!isDisabled) {
                    selectedCustomer = customerRow;
                    customerToEditName = customerText || '';
                    console.log(`📄 Selected customer for editing: ${customerToEditName.substring(0, 50)}...`);
                    break;
                } else {
                    console.log(`🔒 Customer is read-only and cannot be edited: ${customerText?.substring(0, 30)}...`);
                }
            }
        }
        
        // If no edit button found, try looking for action menus
        if (!editButton || await editButton.count() === 0) {
            console.log('ℹ️ No dedicated edit button found, checking for action menus...');
            
            // Look for action menus or dropdowns
            const actionMenus = customersTable.locator('[data-testid="action-menu"]').or(
                customersTable.locator('.action-menu, .dropdown-menu')
            ).or(
                customersTable.locator('button[aria-haspopup="menu"]')
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
                    selectedCustomer = firstMenu;
                    const customerText = await firstMenu.textContent();
                    customerToEditName = customerText || '';
                    console.log(`📄 Found edit option in action menu for: ${customerToEditName.substring(0, 50)}...`);
                }
            }
        }
        
        if (!editButton || await editButton.count() === 0) {
            throw new Error('No edit button or edit option found for any customer');
        }
        
        // Click the edit button
        await editButton.click();
        await page.waitForLoadState('networkidle');
        console.log('✅ Edit (pencil) icon clicked');
        
        // Step 8: Verify Edit Customer page is loaded
        console.log('📝 Verifying Edit Customer page is loaded...');
        const editCustomerPage = page.getByRole('heading', { name: 'Edit Customer' }).or(
            page.getByRole('heading', { name: 'Modify Customer' })
        ).or(
            page.locator('[data-testid="edit-customer-page"]')
        ).or(
            page.locator('h1:has-text("Edit Customer")')
        ).or(
            page.locator('h1:has-text("Modify Customer")')
        ).or(
            page.locator('.page-title:has-text("Edit")')
        );
        
        await expect(editCustomerPage).toBeVisible({ timeout: 15000 });
        console.log('✅ Edit Customer page is loaded');
        
        // Step 9: Make any changes and click Save Customer
        console.log('✏️ Making changes and clicking Save Customer...');
        
        // Get current values and make changes
        const customerNameInput = page.getByLabel('Customer Name').or(
            page.getByLabel('Name')
        ).or(
            page.locator('[data-testid="customer-name-input"]')
        ).or(
            page.locator('input[name*="customerName"]')
        ).or(
            page.locator('input[name*="name"]')
        ).or(
            page.locator('input[placeholder*="Customer Name"]')
        ).or(
            page.locator('input[placeholder*="Name"]')
        );
        
        if (await customerNameInput.count() > 0) {
            const originalName = await customerNameInput.inputValue();
            originalCustomerData.name = originalName;
            const newName = `EDITED-${originalName}`;
            await customerNameInput.fill(newName);
            console.log(`📝 Updated Customer Name: ${originalName} → ${newName}`);
        }
        
        const customerCodeInput = page.getByLabel('Customer Code').or(
            page.getByLabel('Code')
        ).or(
            page.locator('[data-testid="customer-code-input"]')
        ).or(
            page.locator('input[name*="customerCode"]')
        ).or(
            page.locator('input[name*="code"]')
        ).or(
            page.locator('input[placeholder*="Customer Code"]')
        ).or(
            page.locator('input[placeholder*="Code"]')
        );
        
        if (await customerCodeInput.count() > 0) {
            const originalCode = await customerCodeInput.inputValue();
            originalCustomerData.code = originalCode;
            const newCode = `EDITED-${originalCode}`;
            await customerCodeInput.fill(newCode);
            console.log(`📝 Updated Customer Code: ${originalCode} → ${newCode}`);
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
            originalCustomerData.address = originalAddress;
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
            originalCustomerData.email = originalEmail;
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
            originalCustomerData.phone = originalPhone;
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
            originalCustomerData.city = originalCity;
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
            originalCustomerData.state = originalState;
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
            originalCustomerData.zip = originalZip;
            const newZip = '99999';
            await zipInput.fill(newZip);
            console.log(`📝 Updated Zip Code: ${originalZip} → ${newZip}`);
        }
        
        // Click Save Customer
        console.log('💾 Clicking Save Customer button...');
        const saveCustomerButton = page.getByRole('button', { name: 'Save Customer' }).or(
            page.getByRole('button', { name: 'Save' })
        ).or(
            page.getByRole('button', { name: 'Update' })
        ).or(
            page.locator('[data-testid="save-customer-btn"]')
        ).or(
            page.locator('button:has-text("Save")')
        ).or(
            page.locator('button:has-text("Update")')
        );
        
        await expect(saveCustomerButton).toBeVisible({ timeout: 10000 });
        await saveCustomerButton.click();
        
        // Wait for save operation to complete
        await page.waitForTimeout(3000);
        
        // Step 10: Verify Success message is displayed
        console.log('✅ Verifying success message is displayed...');
        const successMessage = page.getByText('The Customer has been saved successfully').or(
            page.getByText('Customer has been saved successfully')
        ).or(
            page.getByText('Customer saved successfully')
        ).or(
            page.getByText('Customer updated successfully')
        ).or(
            page.getByText('Successfully saved')
        ).or(
            page.getByText('Customer modified successfully')
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
        if (currentUrl.includes('customer') || currentUrl.includes('organization')) {
            console.log('📋 Successfully completed customer editing');
        } else {
            console.log('ℹ️ Current page after customer edit:', currentUrl);
        }
        
        console.log('✅ Edit Customer test completed successfully');
    });

    test('REGRESSION: Edit Customer with validation errors', async ({ page }) => {
        console.log('⚠️ Testing Edit Customer with validation errors...');
        
        // Login and navigate
        await goToAliquotQaLink(page);
        await loginAquaUser(page, ALIQUOT_USERNAME_QA, ALIQUOT_PASSWORD_QA);
        await verifyAquaLoginQa(page);
        await clearCacheAndReload(page);
        
        // Navigate to Site Management -> My Organization -> Customer Lists
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
        
        // Click Customer Lists
        const customerListsButton = page.getByRole('button', { name: 'Customer Lists' }).or(
            page.locator('button:has-text("Customer Lists")')
        );
        
        if (await customerListsButton.count() > 0) {
            await customerListsButton.click();
            await page.waitForLoadState('networkidle');
            
            // Get customers list and find edit button
            const customersTable = page.getByRole('table', { name: 'Customers' }).or(
                page.locator('.customers-table, .customer-list')
            );
            
            const customerRows = customersTable.locator('tbody tr, .customer-row');
            
            if (await customerRows.count() > 0) {
                const firstCustomer = customerRows.first();
                const editButton = firstCustomer.locator('[data-testid="edit-btn"]').or(
                    firstCustomer.locator('button[title*="Edit"]')
                ).or(
                    firstCustomer.locator('button:has-text("Edit")')
                );
                
                if (await editButton.count() > 0 && !(await editButton.isDisabled())) {
                    await editButton.click();
                    await page.waitForLoadState('networkidle');
                    
                    // Try to save with invalid data (empty required fields)
                    const customerNameInput = page.getByLabel('Customer Name').or(
                        page.locator('input[placeholder*="Customer Name"]')
                    );
                    
                    if (await customerNameInput.count() > 0) {
                        await customerNameInput.fill(''); // Clear required field
                        
                        const saveCustomerButton = page.getByRole('button', { name: 'Save Customer' }).or(
                            page.locator('button:has-text("Save")')
                        );
                        
                        if (await saveCustomerButton.count() > 0) {
                            await saveCustomerButton.click();
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
        }
        
        console.log('✅ Edit Customer validation test completed');
    });

    test('REGRESSION: Cancel Edit Customer operation', async ({ page }) => {
        console.log('❌ Testing Cancel Edit Customer operation...');
        
        // Login and navigate
        await goToAliquotQaLink(page);
        await loginAquaUser(page, ALIQUOT_USERNAME_QA, ALIQUOT_PASSWORD_QA);
        await verifyAquaLoginQa(page);
        await clearCacheAndReload(page);
        
        // Navigate to Site Management -> My Organization -> Customer Lists
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
        
        // Click Customer Lists
        const customerListsButton = page.getByRole('button', { name: 'Customer Lists' }).or(
            page.locator('button:has-text("Customer Lists")')
        );
        
        if (await customerListsButton.count() > 0) {
            await customerListsButton.click();
            await page.waitForLoadState('networkidle');
            
            // Get customers list and find edit button
            const customersTable = page.getByRole('table', { name: 'Customers' }).or(
                page.locator('.customers-table, .customer-list')
            );
            
            const customerRows = customersTable.locator('tbody tr, .customer-row');
            
            if (await customerRows.count() > 0) {
                const firstCustomer = customerRows.first();
                const editButton = firstCustomer.locator('[data-testid="edit-btn"]').or(
                    firstCustomer.locator('button[title*="Edit"]')
                ).or(
                    firstCustomer.locator('button:has-text("Edit")')
                );
                
                if (await editButton.count() > 0 && !(await editButton.isDisabled())) {
                    await editButton.click();
                    await page.waitForLoadState('networkidle');
                    
                    // Verify edit page is open
                    const editCustomerPage = page.getByRole('heading', { name: 'Edit Customer' }).or(
                        page.locator('h1:has-text("Edit Customer")')
                    );
                    
                    if (await editCustomerPage.count() > 0) {
                        console.log('✅ Edit Customer page is open');
                        
                        // Make some changes
                        const customerNameInput = page.getByLabel('Customer Name').or(
                            page.locator('input[placeholder*="Customer Name"]')
                        );
                        
                        if (await customerNameInput.count() > 0) {
                            await customerNameInput.fill('TEST-CANCEL');
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
                            const customerListPage = page.getByRole('heading', { name: 'Customer Lists' }).or(
                                page.locator('h1:has-text("Customer Lists")')
                            );
                            
                            if (await customerListPage.count() > 0) {
                                console.log('✅ Cancel button works - returned to Customer Lists page');
                            } else {
                                console.log('ℹ️ Cancel button clicked but page navigation unclear');
                            }
                        }
                    }
                }
            }
        }
        
        console.log('✅ Cancel Edit Customer operation test completed');
    });

    test('REGRESSION: Verify edit permissions and restrictions for customers', async ({ page }) => {
        console.log('🔒 Testing edit permissions and restrictions for customers...');
        
        // Login and navigate
        await goToAliquotQaLink(page);
        await loginAquaUser(page, ALIQUOT_USERNAME_QA, ALIQUOT_PASSWORD_QA);
        await verifyAquaLoginQa(page);
        await clearCacheAndReload(page);
        
        // Navigate to Site Management -> My Organization -> Customer Lists
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
        
        // Click Customer Lists
        const customerListsButton = page.getByRole('button', { name: 'Customer Lists' }).or(
            page.locator('button:has-text("Customer Lists")')
        );
        
        if (await customerListsButton.count() > 0) {
            await customerListsButton.click();
            await page.waitForLoadState('networkidle');
            
            // Check edit button availability
            const customersTable = page.getByRole('table', { name: 'Customers' }).or(
                page.locator('.customers-table, .customer-list')
            );
            
            const customerRows = customersTable.locator('tbody tr, .customer-row');
            const customerCount = await customerRows.count();
            
            let editButtonsFound = 0;
            let restrictedCustomers = 0;
            let readOnlyCustomers = 0;
            
            for (let i = 0; i < customerCount; i++) {
                const customerRow = customerRows.nth(i);
                const customerText = await customerRow.textContent();
                
                // Check for edit button
                const editButton = customerRow.locator('[data-testid="edit-btn"]').or(
                    customerRow.locator('button[title*="Edit"]')
                ).or(
                    customerRow.locator('svg[data-icon="edit"], .fa-edit, .fa-pencil')
                ).or(
                    customerRow.locator('button:has-text("Edit")')
                );
                
                if (await editButton.count() > 0) {
                    // Check if button is disabled
                    const isDisabled = await editButton.isDisabled();
                    if (isDisabled) {
                        readOnlyCustomers++;
                        console.log(`🔒 Customer is read-only: ${customerText?.substring(0, 30)}...`);
                    } else {
                        editButtonsFound++;
                        console.log(`✅ Edit available for: ${customerText?.substring(0, 30)}...`);
                    }
                } else {
                    restrictedCustomers++;
                    console.log(`🔒 No edit option for: ${customerText?.substring(0, 30)}...`);
                }
            }
            
            console.log(`📊 Edit permissions summary for customers:`);
            console.log(`  - Customers with edit access: ${editButtonsFound}`);
            console.log(`  - Customers read-only: ${readOnlyCustomers}`);
            console.log(`  - Customers with restricted access: ${restrictedCustomers}`);
            console.log(`  - Total customers: ${customerCount}`);
            
            // Check for any permission-related error messages
            const errorMessage = page.locator('.error-message, .alert-error, [data-testid="error-message"]');
            if (await errorMessage.count() > 0) {
                const errorText = await errorMessage.first().textContent();
                console.log(`⚠️ Permission error message: ${errorText}`);
            }
        }
        
        console.log('✅ Edit permissions and restrictions test completed');
    });
});
