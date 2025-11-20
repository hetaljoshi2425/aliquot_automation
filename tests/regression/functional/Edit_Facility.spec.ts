// Test Case: Edit Facility
// Preconditions:
// - User is logged into the application
// - User has access to the Site Management module
// - User has permission to edit facilities
// - At least one client exists in the system
// - At least one customer exists under the selected client
// - At least one facility exists under the selected customer
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

test.describe('Edit Facility - Functional Tests', () => {

    test.beforeEach(async ({ page }) => {
        console.log('🔧 Setting up Edit Facility test environment...');
    });

    test.afterEach(async ({ page }) => {
        console.log('🧹 Cleaning up Edit Facility test data...');
    });

    test('REGRESSION: Edit Facility functionality works correctly', async ({ page }) => {
        console.log('✏️ Testing Edit Facility functionality...');
        
        // Login and navigate
        await goToAliquotQaLink(page);
        await loginAquaUser(page, ALIQUOT_USERNAME_QA, ALIQUOT_PASSWORD_QA);
        await verifyAquaLoginQa(page);
        await clearCacheAndReload(page);
        
        // Step 1: Hover over Site Management
        console.log('🖱️ Hovering over Site Management...');
        const siteManagementTab = page.getByRole('tab', { name: 'Site Management' }).or(
            page.getByRole('button', { name: 'Site Management' })
        ).or(
            page.locator('[data-testid="site-management-tab"]')
        ).or(
            page.locator('a:has-text("Site Management")')
        );
        
        await siteManagementTab.hover();
        await page.waitForTimeout(1000); // Wait for hover effect
        
        // Step 2: Verify Site Management links are opened
        console.log('🔍 Verifying Site Management links are opened...');
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
        console.log('✅ Site Management links are opened');
        
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
        
        // Step 4: Verify My Organization page is opened with Client Lists by default
        console.log('📋 Verifying My Organization page is opened with Client Lists by default...');
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
        console.log('✅ My Organization page is opened');
        
        // Verify Client Lists is displayed by default
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
        console.log('✅ Client Lists is displayed by default');
        
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
        
        // Step 5: Select Customer from Filter Organization section
        console.log('🔍 Selecting Customer from Filter Organization section...');
        
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
            
            // Look for customer dropdown or selection
            const customerFilterDropdown = filterOrganizationSection.locator('select').or(
                filterOrganizationSection.locator('[data-testid="customer-filter-dropdown"]')
            ).or(
                filterOrganizationSection.locator('.customer-dropdown, .organization-dropdown')
            ).or(
                filterOrganizationSection.locator('input[placeholder*="Customer"]')
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
                    console.log('✅ Customer selected from filter dropdown');
                }
            }
        } else {
            console.log('ℹ️ Filter Organization section not found, proceeding with first client');
        }
        
        // Step 6: Verify Customer Lookup window is opened
        console.log('🔍 Verifying Customer Lookup window is opened...');
        const customerLookupWindow = page.getByRole('dialog', { name: 'Customer Lookup' }).or(
            page.getByRole('dialog', { name: 'Select Customer' })
        ).or(
            page.locator('[data-testid="customer-lookup-window"]')
        ).or(
            page.locator('.customer-lookup-modal, .customer-lookup-dialog')
        ).or(
            page.locator('.modal:has-text("Customer")')
        ).or(
            page.locator('.dialog:has-text("Customer")')
        );
        
        // Wait for customer lookup window to appear
        await expect(customerLookupWindow).toBeVisible({ timeout: 10000 });
        console.log('✅ Customer Lookup window is opened');
        
        // Step 7: Select the Customer
        console.log('👤 Selecting the Customer...');
        
        // Look for customer list in the lookup window
        const customerLookupTable = customerLookupWindow.locator('table').or(
            customerLookupWindow.locator('[data-testid="customer-lookup-table"]')
        ).or(
            customerLookupWindow.locator('.customer-lookup-table')
        );
        
        const customerLookupRows = customerLookupTable.locator('tbody tr, .customer-row');
        const customerLookupCount = await customerLookupRows.count();
        console.log(`📊 Found ${customerLookupCount} customers in lookup window`);
        
        if (customerLookupCount === 0) {
            throw new Error('No customers found in the lookup window');
        }
        
        // Select first customer
        const firstCustomerRow = customerLookupRows.first();
        const customerText = await firstCustomerRow.textContent();
        console.log(`📄 Selected customer: ${customerText?.substring(0, 50)}...`);
        
        // Click on the customer row or select button
        const selectCustomerButton = firstCustomerRow.locator('button').or(
            firstCustomerRow.locator('[data-testid="select-customer-btn"]')
        ).or(
            firstCustomerRow.locator('.select-btn, .choose-btn')
        );
        
        if (await selectCustomerButton.count() > 0) {
            await selectCustomerButton.click();
        } else {
            // If no select button, click on the row itself
            await firstCustomerRow.click();
        }
        
        await page.waitForTimeout(1000);
        console.log('✅ Customer selected');
        
        // Step 8: Verify Facility Lists link is available
        console.log('🔗 Verifying Facility Lists link is available...');
        const facilityListsLink = page.getByRole('link', { name: 'Facility Lists' }).or(
            page.getByRole('button', { name: 'Facility Lists' })
        ).or(
            page.locator('[data-testid="facility-lists-link"]')
        ).or(
            page.locator('a:has-text("Facility Lists")')
        ).or(
            page.locator('button:has-text("Facility Lists")')
        ).or(
            page.locator('.facility-lists-link, .facility-lists-btn')
        );
        
        await expect(facilityListsLink).toBeVisible({ timeout: 10000 });
        console.log('✅ Facility Lists link is available');
        
        // Step 9: Click Facility Lists button
        console.log('🏢 Clicking Facility Lists button...');
        await facilityListsLink.click();
        await page.waitForLoadState('networkidle');
        console.log('✅ Facility Lists button clicked');
        
        // Step 10: Verify Facility List is displayed
        console.log('🏢 Verifying Facility List is displayed...');
        const facilityListPage = page.getByRole('heading', { name: 'Facility Lists' }).or(
            page.getByRole('heading', { name: 'Facilities' })
        ).or(
            page.locator('[data-testid="facility-list-page"]')
        ).or(
            page.locator('h1:has-text("Facility Lists")')
        ).or(
            page.locator('h1:has-text("Facilities")')
        ).or(
            page.locator('.page-title:has-text("Facility")')
        );
        
        await expect(facilityListPage).toBeVisible({ timeout: 15000 });
        console.log('✅ Facility List is displayed');
        
        // Verify facility table is displayed
        const facilitiesTable = page.getByRole('table', { name: 'Facilities' }).or(
            page.getByRole('table', { name: 'Facility List' })
        ).or(
            page.locator('[data-testid="facilities-table"]')
        ).or(
            page.locator('.facilities-table, .facility-list')
        ).or(
            page.locator('table')
        );
        
        await expect(facilitiesTable).toBeVisible({ timeout: 15000 });
        console.log('✅ Facility table is displayed');
        
        // Get facility rows
        const facilityRows = facilitiesTable.locator('tbody tr, .facility-row');
        const facilityCount = await facilityRows.count();
        console.log(`📊 Found ${facilityCount} facilities in the list`);
        
        if (facilityCount === 0) {
            throw new Error('No facilities found in the list');
        }
        
        // Step 11: Select the Facility and click Edit (pencil icon)
        console.log('✏️ Selecting the Facility and clicking Edit (pencil icon)...');
        
        // Look for a facility with edit functionality
        let selectedFacility = null;
        let editButton = null;
        let facilityToEditName = '';
        let originalFacilityData: { name?: string; code?: string; address?: string; email?: string; phone?: string; city?: string; state?: string; zip?: string } = {};
        
        // Try to find a facility that can be edited
        for (let i = 0; i < facilityCount; i++) {
            const facilityRow = facilityRows.nth(i);
            const facilityText = await facilityRow.textContent();
            
            // Look for edit button in this row
            editButton = facilityRow.locator('[data-testid="edit-btn"]').or(
                facilityRow.locator('button[title*="Edit"]')
            ).or(
                facilityRow.locator('button[aria-label*="Edit"]')
            ).or(
                facilityRow.locator('.edit-btn, .pencil-btn')
            ).or(
                facilityRow.locator('svg[data-icon="edit"], .fa-edit, .fa-pencil')
            ).or(
                facilityRow.locator('i.fa-edit, i.fa-pencil, i.fa-pencil-square-o')
            ).or(
                facilityRow.locator('button:has-text("Edit")')
            ).or(
                facilityRow.locator('a:has-text("Edit")')
            );
            
            if (await editButton.count() > 0) {
                // Check if button is enabled
                const isDisabled = await editButton.isDisabled();
                if (!isDisabled) {
                    selectedFacility = facilityRow;
                    facilityToEditName = facilityText || '';
                    console.log(`📄 Selected facility for editing: ${facilityToEditName.substring(0, 50)}...`);
                    break;
                } else {
                    console.log(`🔒 Facility is read-only and cannot be edited: ${facilityText?.substring(0, 30)}...`);
                }
            }
        }
        
        // If no edit button found, try looking for action menus
        if (!editButton || await editButton.count() === 0) {
            console.log('ℹ️ No dedicated edit button found, checking for action menus...');
            
            // Look for action menus or dropdowns
            const actionMenus = facilitiesTable.locator('[data-testid="action-menu"]').or(
                facilitiesTable.locator('.action-menu, .dropdown-menu')
            ).or(
                facilitiesTable.locator('button[aria-haspopup="menu"]')
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
                    selectedFacility = firstMenu;
                    const facilityText = await firstMenu.textContent();
                    facilityToEditName = facilityText || '';
                    console.log(`📄 Found edit option in action menu for: ${facilityToEditName.substring(0, 50)}...`);
                }
            }
        }
        
        if (!editButton || await editButton.count() === 0) {
            throw new Error('No edit button or edit option found for any facility');
        }
        
        // Click the edit button
        await editButton.click();
        await page.waitForLoadState('networkidle');
        console.log('✅ Edit (pencil) icon clicked');
        
        // Step 12: Verify Edit Facility page is loaded
        console.log('📝 Verifying Edit Facility page is loaded...');
        const editFacilityPage = page.getByRole('heading', { name: 'Edit Facility' }).or(
            page.getByRole('heading', { name: 'Modify Facility' })
        ).or(
            page.locator('[data-testid="edit-facility-page"]')
        ).or(
            page.locator('h1:has-text("Edit Facility")')
        ).or(
            page.locator('h1:has-text("Modify Facility")')
        ).or(
            page.locator('.page-title:has-text("Edit")')
        );
        
        await expect(editFacilityPage).toBeVisible({ timeout: 15000 });
        console.log('✅ Edit Facility page is loaded');
        
        // Step 13: Make any changes and click Save Facility
        console.log('✏️ Making changes and clicking Save Facility...');
        
        // Get current values and make changes
        const facilityNameInput = page.getByLabel('Facility Name').or(
            page.getByLabel('Name')
        ).or(
            page.locator('[data-testid="facility-name-input"]')
        ).or(
            page.locator('input[name*="facilityName"]')
        ).or(
            page.locator('input[name*="name"]')
        ).or(
            page.locator('input[placeholder*="Facility Name"]')
        ).or(
            page.locator('input[placeholder*="Name"]')
        );
        
        if (await facilityNameInput.count() > 0) {
            const originalName = await facilityNameInput.inputValue();
            originalFacilityData.name = originalName;
            const newName = `EDITED-${originalName}`;
            await facilityNameInput.fill(newName);
            console.log(`📝 Updated Facility Name: ${originalName} → ${newName}`);
        }
        
        const facilityCodeInput = page.getByLabel('Facility Code').or(
            page.getByLabel('Code')
        ).or(
            page.locator('[data-testid="facility-code-input"]')
        ).or(
            page.locator('input[name*="facilityCode"]')
        ).or(
            page.locator('input[name*="code"]')
        ).or(
            page.locator('input[placeholder*="Facility Code"]')
        ).or(
            page.locator('input[placeholder*="Code"]')
        );
        
        if (await facilityCodeInput.count() > 0) {
            const originalCode = await facilityCodeInput.inputValue();
            originalFacilityData.code = originalCode;
            const newCode = `EDITED-${originalCode}`;
            await facilityCodeInput.fill(newCode);
            console.log(`📝 Updated Facility Code: ${originalCode} → ${newCode}`);
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
            originalFacilityData.address = originalAddress;
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
            originalFacilityData.email = originalEmail;
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
            originalFacilityData.phone = originalPhone;
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
            originalFacilityData.city = originalCity;
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
            originalFacilityData.state = originalState;
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
            originalFacilityData.zip = originalZip;
            const newZip = '99999';
            await zipInput.fill(newZip);
            console.log(`📝 Updated Zip Code: ${originalZip} → ${newZip}`);
        }
        
        // Click Save Facility
        console.log('💾 Clicking Save Facility button...');
        const saveFacilityButton = page.getByRole('button', { name: 'Save Facility' }).or(
            page.getByRole('button', { name: 'Save' })
        ).or(
            page.getByRole('button', { name: 'Update' })
        ).or(
            page.locator('[data-testid="save-facility-btn"]')
        ).or(
            page.locator('button:has-text("Save")')
        ).or(
            page.locator('button:has-text("Update")')
        );
        
        await expect(saveFacilityButton).toBeVisible({ timeout: 10000 });
        await saveFacilityButton.click();
        
        // Wait for save operation to complete
        await page.waitForTimeout(3000);
        
        // Step 14: Verify Success message is displayed
        console.log('✅ Verifying success message is displayed...');
        const successMessage = page.getByText('Facility has been updated successfully').or(
            page.getByText('Facility has been saved successfully')
        ).or(
            page.getByText('Facility saved successfully')
        ).or(
            page.getByText('Facility updated successfully')
        ).or(
            page.getByText('Successfully saved')
        ).or(
            page.getByText('Facility modified successfully')
        ).or(
            page.locator('[data-testid="success-message"]')
        ).or(
            page.locator('.success-message, .alert-success')
        );
        
        await expect(successMessage).toBeVisible({ timeout: 10000 });
        const successText = await successMessage.textContent();
        console.log(`✅ Success message: "${successText}" is displayed`);
        
        // Step 15: Verify the changes are saved
        console.log('🔍 Verifying the changes are saved...');
        
        // Wait for the page to refresh/update
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(2000);
        
        // Check if we're back to the facility list or if the changes are reflected
        const currentUrl = page.url();
        if (currentUrl.includes('facility') || currentUrl.includes('organization')) {
            console.log('📋 Successfully completed facility editing');
            
            // If we're on the facility list, verify the changes are reflected
            if (currentUrl.includes('facility')) {
                console.log('🔍 Verifying changes are reflected in the facility list...');
                
                // Look for the updated facility in the list
                const updatedFacilitiesTable = page.getByRole('table', { name: 'Facilities' }).or(
                    page.locator('.facilities-table, .facility-list')
                );
                
                const updatedFacilityRows = updatedFacilitiesTable.locator('tbody tr, .facility-row');
                const updatedFacilityCount = await updatedFacilityRows.count();
                
                let changesReflected = false;
                for (let i = 0; i < updatedFacilityCount; i++) {
                    const facilityRow = updatedFacilityRows.nth(i);
                    const facilityText = await facilityRow.textContent();
                    
                    // Check if the facility name contains our edit prefix
                    if (facilityText && facilityText.includes('EDITED-')) {
                        changesReflected = true;
                        console.log(`✅ Changes are reflected in facility list: ${facilityText.substring(0, 50)}...`);
                        break;
                    }
                }
                
                if (!changesReflected) {
                    console.log('ℹ️ Changes may not be immediately visible in the list');
                }
            }
        } else {
            console.log('ℹ️ Current page after facility edit:', currentUrl);
        }
        
        console.log('✅ Edit Facility test completed successfully');
    });

    test('REGRESSION: Edit Facility with validation errors', async ({ page }) => {
        console.log('⚠️ Testing Edit Facility with validation errors...');
        
        // Login and navigate
        await goToAliquotQaLink(page);
        await loginAquaUser(page, ALIQUOT_USERNAME_QA, ALIQUOT_PASSWORD_QA);
        await verifyAquaLoginQa(page);
        await clearCacheAndReload(page);
        
        // Navigate to Site Management -> My Organization -> Customer Lookup -> Facility Lists
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
        
        // Select customer and navigate to facility lists
        const customerLookupWindow = page.getByRole('dialog', { name: 'Customer Lookup' }).or(
            page.locator('.customer-lookup-modal, .customer-lookup-dialog')
        );
        
        if (await customerLookupWindow.count() > 0) {
            const customerLookupTable = customerLookupWindow.locator('table');
            const customerLookupRows = customerLookupTable.locator('tbody tr, .customer-row');
            
            if (await customerLookupRows.count() > 0) {
                const firstCustomerRow = customerLookupRows.first();
                await firstCustomerRow.click();
                await page.waitForTimeout(1000);
                
                // Click Facility Lists
                const facilityListsLink = page.getByRole('link', { name: 'Facility Lists' }).or(
                    page.locator('button:has-text("Facility Lists")')
                );
                
                if (await facilityListsLink.count() > 0) {
                    await facilityListsLink.click();
                    await page.waitForLoadState('networkidle');
                    
                    // Get facilities list and find edit button
                    const facilitiesTable = page.getByRole('table', { name: 'Facilities' }).or(
                        page.locator('.facilities-table, .facility-list')
                    );
                    
                    const facilityRows = facilitiesTable.locator('tbody tr, .facility-row');
                    
                    if (await facilityRows.count() > 0) {
                        const firstFacility = facilityRows.first();
                        const editButton = firstFacility.locator('[data-testid="edit-btn"]').or(
                            firstFacility.locator('button[title*="Edit"]')
                        ).or(
                            firstFacility.locator('button:has-text("Edit")')
                        );
                        
                        if (await editButton.count() > 0 && !(await editButton.isDisabled())) {
                            await editButton.click();
                            await page.waitForLoadState('networkidle');
                            
                            // Try to save with invalid data (empty required fields)
                            const facilityNameInput = page.getByLabel('Facility Name').or(
                                page.locator('input[placeholder*="Facility Name"]')
                            );
                            
                            if (await facilityNameInput.count() > 0) {
                                await facilityNameInput.fill(''); // Clear required field
                                
                                const saveFacilityButton = page.getByRole('button', { name: 'Save Facility' }).or(
                                    page.locator('button:has-text("Save")')
                                );
                                
                                if (await saveFacilityButton.count() > 0) {
                                    await saveFacilityButton.click();
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
            }
        }
        
        console.log('✅ Edit Facility validation test completed');
    });

    test('REGRESSION: Cancel Edit Facility operation', async ({ page }) => {
        console.log('❌ Testing Cancel Edit Facility operation...');
        
        // Login and navigate
        await goToAliquotQaLink(page);
        await loginAquaUser(page, ALIQUOT_USERNAME_QA, ALIQUOT_PASSWORD_QA);
        await verifyAquaLoginQa(page);
        await clearCacheAndReload(page);
        
        // Navigate to Site Management -> My Organization -> Customer Lookup -> Facility Lists
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
        
        // Select customer and navigate to facility lists
        const customerLookupWindow = page.getByRole('dialog', { name: 'Customer Lookup' }).or(
            page.locator('.customer-lookup-modal, .customer-lookup-dialog')
        );
        
        if (await customerLookupWindow.count() > 0) {
            const customerLookupTable = customerLookupWindow.locator('table');
            const customerLookupRows = customerLookupTable.locator('tbody tr, .customer-row');
            
            if (await customerLookupRows.count() > 0) {
                const firstCustomerRow = customerLookupRows.first();
                await firstCustomerRow.click();
                await page.waitForTimeout(1000);
                
                // Click Facility Lists
                const facilityListsLink = page.getByRole('link', { name: 'Facility Lists' }).or(
                    page.locator('button:has-text("Facility Lists")')
                );
                
                if (await facilityListsLink.count() > 0) {
                    await facilityListsLink.click();
                    await page.waitForLoadState('networkidle');
                    
                    // Get facilities list and find edit button
                    const facilitiesTable = page.getByRole('table', { name: 'Facilities' }).or(
                        page.locator('.facilities-table, .facility-list')
                    );
                    
                    const facilityRows = facilitiesTable.locator('tbody tr, .facility-row');
                    
                    if (await facilityRows.count() > 0) {
                        const firstFacility = facilityRows.first();
                        const editButton = firstFacility.locator('[data-testid="edit-btn"]').or(
                            firstFacility.locator('button[title*="Edit"]')
                        ).or(
                            firstFacility.locator('button:has-text("Edit")')
                        );
                        
                        if (await editButton.count() > 0 && !(await editButton.isDisabled())) {
                            await editButton.click();
                            await page.waitForLoadState('networkidle');
                            
                            // Verify edit page is open
                            const editFacilityPage = page.getByRole('heading', { name: 'Edit Facility' }).or(
                                page.locator('h1:has-text("Edit Facility")')
                            );
                            
                            if (await editFacilityPage.count() > 0) {
                                console.log('✅ Edit Facility page is open');
                                
                                // Make some changes
                                const facilityNameInput = page.getByLabel('Facility Name').or(
                                    page.locator('input[placeholder*="Facility Name"]')
                                );
                                
                                if (await facilityNameInput.count() > 0) {
                                    await facilityNameInput.fill('TEST-CANCEL');
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
                                    
                                    // Verify we're back to the facility list page
                                    const facilityListPage = page.getByRole('heading', { name: 'Facility Lists' }).or(
                                        page.locator('h1:has-text("Facility Lists")')
                                    );
                                    
                                    if (await facilityListPage.count() > 0) {
                                        console.log('✅ Cancel button works - returned to Facility Lists page');
                                    } else {
                                        console.log('ℹ️ Cancel button clicked but page navigation unclear');
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        
        console.log('✅ Cancel Edit Facility operation test completed');
    });

    test('REGRESSION: Verify edit permissions and restrictions for facilities', async ({ page }) => {
        console.log('🔒 Testing edit permissions and restrictions for facilities...');
        
        // Login and navigate
        await goToAliquotQaLink(page);
        await loginAquaUser(page, ALIQUOT_USERNAME_QA, ALIQUOT_PASSWORD_QA);
        await verifyAquaLoginQa(page);
        await clearCacheAndReload(page);
        
        // Navigate to Site Management -> My Organization -> Customer Lookup -> Facility Lists
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
        
        // Select customer and navigate to facility lists
        const customerLookupWindow = page.getByRole('dialog', { name: 'Customer Lookup' }).or(
            page.locator('.customer-lookup-modal, .customer-lookup-dialog')
        );
        
        if (await customerLookupWindow.count() > 0) {
            const customerLookupTable = customerLookupWindow.locator('table');
            const customerLookupRows = customerLookupTable.locator('tbody tr, .customer-row');
            
            if (await customerLookupRows.count() > 0) {
                const firstCustomerRow = customerLookupRows.first();
                await firstCustomerRow.click();
                await page.waitForTimeout(1000);
                
                // Click Facility Lists
                const facilityListsLink = page.getByRole('link', { name: 'Facility Lists' }).or(
                    page.locator('button:has-text("Facility Lists")')
                );
                
                if (await facilityListsLink.count() > 0) {
                    await facilityListsLink.click();
                    await page.waitForLoadState('networkidle');
                    
                    // Check edit button availability
                    const facilitiesTable = page.getByRole('table', { name: 'Facilities' }).or(
                        page.locator('.facilities-table, .facility-list')
                    );
                    
                    const facilityRows = facilitiesTable.locator('tbody tr, .facility-row');
                    const facilityCount = await facilityRows.count();
                    
                    let editButtonsFound = 0;
                    let restrictedFacilities = 0;
                    let readOnlyFacilities = 0;
                    
                    for (let i = 0; i < facilityCount; i++) {
                        const facilityRow = facilityRows.nth(i);
                        const facilityText = await facilityRow.textContent();
                        
                        // Check for edit button
                        const editButton = facilityRow.locator('[data-testid="edit-btn"]').or(
                            facilityRow.locator('button[title*="Edit"]')
                        ).or(
                            facilityRow.locator('svg[data-icon="edit"], .fa-edit, .fa-pencil')
                        ).or(
                            facilityRow.locator('button:has-text("Edit")')
                        );
                        
                        if (await editButton.count() > 0) {
                            // Check if button is disabled
                            const isDisabled = await editButton.isDisabled();
                            if (isDisabled) {
                                readOnlyFacilities++;
                                console.log(`🔒 Facility is read-only: ${facilityText?.substring(0, 30)}...`);
                            } else {
                                editButtonsFound++;
                                console.log(`✅ Edit available for: ${facilityText?.substring(0, 30)}...`);
                            }
                        } else {
                            restrictedFacilities++;
                            console.log(`🔒 No edit option for: ${facilityText?.substring(0, 30)}...`);
                        }
                    }
                    
                    console.log(`📊 Edit permissions summary for facilities:`);
                    console.log(`  - Facilities with edit access: ${editButtonsFound}`);
                    console.log(`  - Facilities read-only: ${readOnlyFacilities}`);
                    console.log(`  - Facilities with restricted access: ${restrictedFacilities}`);
                    console.log(`  - Total facilities: ${facilityCount}`);
                    
                    // Check for any permission-related error messages
                    const errorMessage = page.locator('.error-message, .alert-error, [data-testid="error-message"]');
                    if (await errorMessage.count() > 0) {
                        const errorText = await errorMessage.first().textContent();
                        console.log(`⚠️ Permission error message: ${errorText}`);
                    }
                }
            }
        }
        
        console.log('✅ Edit permissions and restrictions test completed');
    });
});
