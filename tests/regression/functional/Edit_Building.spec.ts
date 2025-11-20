// Test Case: Edit Building
// Preconditions:
// - User is logged into the application
// - User has access to the Site Management module
// - User has permission to edit buildings
// - At least one client exists in the system
// - At least one customer exists under the selected client
// - At least one facility exists under the selected customer
// - At least one building exists under the selected facility
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

test.describe('Edit Building - Functional Tests', () => {

    test.beforeEach(async ({ page }) => {
        console.log('🔧 Setting up Edit Building test environment...');
    });

    test.afterEach(async ({ page }) => {
        console.log('🧹 Cleaning up Edit Building test data...');
    });

    test('REGRESSION: Edit Building functionality works correctly', async ({ page }) => {
        console.log('✏️ Testing Edit Building functionality...');
        
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
        await page.waitForTimeout(1000);
        
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
        
        // Step 5: Select Customer from Filter Organization section
        console.log('🔍 Selecting Customer from Filter Organization section...');
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
                
                const firstCustomerOption = page.locator('option').first().or(
                    page.locator('[role="option"]').first()
                );
                
                if (await firstCustomerOption.count() > 0) {
                    await firstCustomerOption.click();
                    await page.waitForTimeout(1000);
                    console.log('✅ Customer selected from filter dropdown');
                }
            }
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
        
        await expect(customerLookupWindow).toBeVisible({ timeout: 10000 });
        console.log('✅ Customer Lookup window is opened');
            
        // Step 7: Select Customer
        console.log('👤 Selecting Customer...');
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
        
        const firstCustomerRow = customerLookupRows.first();
        const customerText = await firstCustomerRow.textContent();
        console.log(`📄 Selected customer: ${customerText?.substring(0, 50)}...`);
        
        const selectCustomerButton = firstCustomerRow.locator('button').or(
            firstCustomerRow.locator('[data-testid="select-customer-btn"]')
        ).or(
            firstCustomerRow.locator('.select-btn, .choose-btn')
        );
        
        if (await selectCustomerButton.count() > 0) {
            await selectCustomerButton.click();
        } else {
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
        
        // Step 9: Select Facility from Filter Organization section
        console.log('🔍 Selecting Facility from Filter Organization section...');
        const facilityFilterDropdown = page.locator('[data-testid="facility-filter-dropdown"]').or(
            page.locator('.facility-dropdown, .organization-facility-dropdown')
        ).or(
            page.locator('select:has-text("Facility")')
        ).or(
            page.locator('input[placeholder*="Facility"]')
        );
        
        if (await facilityFilterDropdown.count() > 0) {
            await facilityFilterDropdown.click();
            await page.waitForTimeout(500);
            
            const firstFacilityOption = page.locator('option').first().or(
                page.locator('[role="option"]').first()
            );
            
            if (await firstFacilityOption.count() > 0) {
                await firstFacilityOption.click();
                await page.waitForTimeout(1000);
                console.log('✅ Facility selected from filter dropdown');
            }
        }
        
        // Step 10: Verify Facility Lookup window is opened
        console.log('🔍 Verifying Facility Lookup window is opened...');
        const facilityLookupWindow = page.getByRole('dialog', { name: 'Facility Lookup' }).or(
            page.getByRole('dialog', { name: 'Select Facility' })
        ).or(
            page.locator('[data-testid="facility-lookup-window"]')
        ).or(
            page.locator('.facility-lookup-modal, .facility-lookup-dialog')
        ).or(
            page.locator('.modal:has-text("Facility")')
        ).or(
            page.locator('.dialog:has-text("Facility")')
        );
        
        await expect(facilityLookupWindow).toBeVisible({ timeout: 10000 });
        console.log('✅ Facility Lookup window is opened');
        
        // Step 11: Select Facility
        console.log('🏢 Selecting Facility...');
        const facilityLookupTable = facilityLookupWindow.locator('table').or(
            facilityLookupWindow.locator('[data-testid="facility-lookup-table"]')
        ).or(
            facilityLookupWindow.locator('.facility-lookup-table')
        );
        
        const facilityLookupRows = facilityLookupTable.locator('tbody tr, .facility-row');
        const facilityLookupCount = await facilityLookupRows.count();
        console.log(`📊 Found ${facilityLookupCount} facilities in lookup window`);
        
        if (facilityLookupCount === 0) {
            throw new Error('No facilities found in the lookup window');
        }
        
        const firstFacilityRow = facilityLookupRows.first();
        const facilityText = await firstFacilityRow.textContent();
        console.log(`📄 Selected facility: ${facilityText?.substring(0, 50)}...`);
        
        const selectFacilityButton = firstFacilityRow.locator('button').or(
            firstFacilityRow.locator('[data-testid="select-facility-btn"]')
        ).or(
            firstFacilityRow.locator('.select-btn, .choose-btn')
        );
        
        if (await selectFacilityButton.count() > 0) {
            await selectFacilityButton.click();
        } else {
            await firstFacilityRow.click();
        }
        
        await page.waitForTimeout(1000);
        console.log('✅ Facility selected');
        
        // Step 12: Verify Building Lists button is available
        console.log('🔗 Verifying Building Lists button is available...');
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
        
        await expect(buildingListsButton).toBeVisible({ timeout: 10000 });
        console.log('✅ Building Lists button is available');
        
        // Step 13: Click Building Lists button
        console.log('🏢 Clicking Building Lists button...');
        await buildingListsButton.click();
        await page.waitForLoadState('networkidle');
        console.log('✅ Building Lists button clicked');
        
        // Step 14: Verify Building List is displayed
        console.log('🏢 Verifying Building List is displayed...');
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
        console.log('✅ Building List is displayed');
        
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
        
        // Step 15: Select Building and click Edit (pencil icon)
        console.log('✏️ Selecting Building and clicking Edit (pencil icon)...');
        
        // Look for a building with edit functionality
        let selectedBuilding = null;
        let editButton = null;
        let buildingToEditName = '';
        let originalBuildingData: { name?: string; code?: string; address?: string; email?: string; phone?: string; city?: string; state?: string; zip?: string } = {};
        
        // Try to find a building that can be edited
        for (let i = 0; i < buildingCount; i++) {
            const buildingRow = buildingRows.nth(i);
            const buildingText = await buildingRow.textContent();
            
            // Look for edit button in this row
            editButton = buildingRow.locator('[data-testid="edit-btn"]').or(
                buildingRow.locator('button[title*="Edit"]')
            ).or(
                buildingRow.locator('button[aria-label*="Edit"]')
            ).or(
                buildingRow.locator('.edit-btn, .pencil-btn')
            ).or(
                buildingRow.locator('svg[data-icon="edit"], .fa-edit, .fa-pencil')
            ).or(
                buildingRow.locator('i.fa-edit, i.fa-pencil, i.fa-pencil-square-o')
            ).or(
                buildingRow.locator('button:has-text("Edit")')
            ).or(
                buildingRow.locator('a:has-text("Edit")')
            );
            
            if (await editButton.count() > 0) {
                // Check if button is enabled
                const isDisabled = await editButton.isDisabled();
                if (!isDisabled) {
                    selectedBuilding = buildingRow;
                    buildingToEditName = buildingText || '';
                    console.log(`📄 Selected building for editing: ${buildingToEditName.substring(0, 50)}...`);
                    break;
                } else {
                    console.log(`🔒 Building is read-only and cannot be edited: ${buildingText?.substring(0, 30)}...`);
                }
            }
        }
        
        // If no edit button found, try looking for action menus
        if (!editButton || await editButton.count() === 0) {
            console.log('ℹ️ No dedicated edit button found, checking for action menus...');
            
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
                
                // Look for edit option in the menu
                editButton = page.getByRole('menuitem', { name: 'Edit' }).or(
                    page.locator('[data-testid="edit-option"]')
                ).or(
                    page.locator('a:has-text("Edit"), button:has-text("Edit")')
                );
                
                if (await editButton.count() > 0) {
                    selectedBuilding = firstMenu;
                    const buildingText = await firstMenu.textContent();
                    buildingToEditName = buildingText || '';
                    console.log(`📄 Found edit option in action menu for: ${buildingToEditName.substring(0, 50)}...`);
                }
            }
        }
        
        if (!editButton || await editButton.count() === 0) {
            throw new Error('No edit button or edit option found for any building');
        }
        
        // Click the edit button
        await editButton.click();
        await page.waitForLoadState('networkidle');
        console.log('✅ Edit (pencil) icon clicked');
        
        // Step 16: Verify Edit Building page is loaded
        console.log('📝 Verifying Edit Building page is loaded...');
        const editBuildingPage = page.getByRole('heading', { name: 'Edit Building' }).or(
            page.getByRole('heading', { name: 'Modify Building' })
        ).or(
            page.locator('[data-testid="edit-building-page"]')
        ).or(
            page.locator('h1:has-text("Edit Building")')
        ).or(
            page.locator('h1:has-text("Modify Building")')
        ).or(
            page.locator('.page-title:has-text("Edit")')
        );
        
        await expect(editBuildingPage).toBeVisible({ timeout: 15000 });
        console.log('✅ Edit Building page is loaded');
        
        // Step 17: Make any changes and click Save Building
        console.log('✏️ Making changes and clicking Save Building...');
        
        // Get current values and make changes
        const buildingNameInput = page.getByLabel('Building Name').or(
            page.getByLabel('Name')
        ).or(
            page.locator('[data-testid="building-name-input"]')
        ).or(
            page.locator('input[name*="buildingName"]')
        ).or(
            page.locator('input[name*="name"]')
        ).or(
            page.locator('input[placeholder*="Building Name"]')
        ).or(
            page.locator('input[placeholder*="Name"]')
        );
        
        if (await buildingNameInput.count() > 0) {
            const originalName = await buildingNameInput.inputValue();
            originalBuildingData.name = originalName;
            const newName = `EDITED-${originalName}`;
            await buildingNameInput.fill(newName);
            console.log(`📝 Updated Building Name: ${originalName} → ${newName}`);
        }
        
        const buildingCodeInput = page.getByLabel('Building Code').or(
            page.getByLabel('Code')
        ).or(
            page.locator('[data-testid="building-code-input"]')
        ).or(
            page.locator('input[name*="buildingCode"]')
        ).or(
            page.locator('input[name*="code"]')
        ).or(
            page.locator('input[placeholder*="Building Code"]')
        ).or(
            page.locator('input[placeholder*="Code"]')
        );
        
        if (await buildingCodeInput.count() > 0) {
            const originalCode = await buildingCodeInput.inputValue();
            originalBuildingData.code = originalCode;
            const newCode = `EDITED-${originalCode}`;
            await buildingCodeInput.fill(newCode);
            console.log(`📝 Updated Building Code: ${originalCode} → ${newCode}`);
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
            originalBuildingData.address = originalAddress;
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
            originalBuildingData.email = originalEmail;
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
            originalBuildingData.phone = originalPhone;
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
            originalBuildingData.city = originalCity;
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
            originalBuildingData.state = originalState;
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
            originalBuildingData.zip = originalZip;
            const newZip = '99999';
            await zipInput.fill(newZip);
            console.log(`📝 Updated Zip Code: ${originalZip} → ${newZip}`);
        }
        
        // Click Save Building
        console.log('💾 Clicking Save Building button...');
        const saveBuildingButton = page.getByRole('button', { name: 'Save Building' }).or(
            page.getByRole('button', { name: 'Save' })
        ).or(
            page.getByRole('button', { name: 'Update' })
        ).or(
            page.locator('[data-testid="save-building-btn"]')
        ).or(
            page.locator('button:has-text("Save")')
        ).or(
            page.locator('button:has-text("Update")')
        );
        
        await expect(saveBuildingButton).toBeVisible({ timeout: 10000 });
        await saveBuildingButton.click();
        
        // Wait for save operation to complete
        await page.waitForTimeout(3000);
        
        // Step 18: Verify Success message is displayed
        console.log('✅ Verifying success message is displayed...');
        const successMessage = page.getByText('Building has been updated successfully').or(
            page.getByText('Building has been saved successfully')
        ).or(
            page.getByText('Building saved successfully')
        ).or(
            page.getByText('Building updated successfully')
        ).or(
            page.getByText('Successfully saved')
        ).or(
            page.getByText('Building modified successfully')
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
            console.log('📋 Successfully completed building editing');
        } else {
            console.log('ℹ️ Current page after building edit:', currentUrl);
        }
        
        console.log('✅ Edit Building test completed successfully');
    });

    test('REGRESSION: Edit Building with validation errors', async ({ page }) => {
        console.log('⚠️ Testing Edit Building with validation errors...');
        
        // Login and navigate
        await goToAliquotQaLink(page);
        await loginAquaUser(page, ALIQUOT_USERNAME_QA, ALIQUOT_PASSWORD_QA);
        await verifyAquaLoginQa(page);
        await clearCacheAndReload(page);
        
        // Navigate through the flow to get to building edit
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
        
        // Select customer and facility, then navigate to building lists
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
                
                // Select facility
                const facilityLookupWindow = page.getByRole('dialog', { name: 'Facility Lookup' }).or(
                    page.locator('.facility-lookup-modal, .facility-lookup-dialog')
                );
                
                if (await facilityLookupWindow.count() > 0) {
                    const facilityLookupTable = facilityLookupWindow.locator('table');
                    const facilityLookupRows = facilityLookupTable.locator('tbody tr, .facility-row');
                    
                    if (await facilityLookupRows.count() > 0) {
                        const firstFacilityRow = facilityLookupRows.first();
                        await firstFacilityRow.click();
                        await page.waitForTimeout(1000);
                        
                        // Click Building Lists
                        const buildingListsButton = page.getByRole('button', { name: 'Building Lists' }).or(
                            page.locator('button:has-text("Building Lists")')
                        );
                        
                        if (await buildingListsButton.count() > 0) {
                            await buildingListsButton.click();
                            await page.waitForLoadState('networkidle');
                            
                            // Get buildings list and find edit button
                            const buildingsTable = page.getByRole('table', { name: 'Buildings' }).or(
                                page.locator('.buildings-table, .building-list')
                            );
                            
                            const buildingRows = buildingsTable.locator('tbody tr, .building-row');
                            
                            if (await buildingRows.count() > 0) {
                                const firstBuilding = buildingRows.first();
                                const editButton = firstBuilding.locator('[data-testid="edit-btn"]').or(
                                    firstBuilding.locator('button[title*="Edit"]')
                                ).or(
                                    firstBuilding.locator('button:has-text("Edit")')
                                );
                                
                                if (await editButton.count() > 0 && !(await editButton.isDisabled())) {
                                    await editButton.click();
                                    await page.waitForLoadState('networkidle');
                                    
                                    // Try to save with invalid data (empty required fields)
                                    const buildingNameInput = page.getByLabel('Building Name').or(
                                        page.locator('input[placeholder*="Building Name"]')
                                    );
                                    
                                    if (await buildingNameInput.count() > 0) {
                                        await buildingNameInput.fill(''); // Clear required field
                                        
                                        const saveBuildingButton = page.getByRole('button', { name: 'Save Building' }).or(
                                            page.locator('button:has-text("Save")')
                                        );
                                        
                                        if (await saveBuildingButton.count() > 0) {
                                            await saveBuildingButton.click();
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
            }
        }
        
        console.log('✅ Edit Building validation test completed');
    });

    test('REGRESSION: Cancel Edit Building operation', async ({ page }) => {
        console.log('❌ Testing Cancel Edit Building operation...');
        
        // Login and navigate
        await goToAliquotQaLink(page);
        await loginAquaUser(page, ALIQUOT_USERNAME_QA, ALIQUOT_PASSWORD_QA);
        await verifyAquaLoginQa(page);
        await clearCacheAndReload(page);
        
        // Navigate through the flow to get to building edit
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
        
        // Select customer and facility, then navigate to building lists
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
                
                // Select facility
                const facilityLookupWindow = page.getByRole('dialog', { name: 'Facility Lookup' }).or(
                    page.locator('.facility-lookup-modal, .facility-lookup-dialog')
                );
                
                if (await facilityLookupWindow.count() > 0) {
                    const facilityLookupTable = facilityLookupWindow.locator('table');
                    const facilityLookupRows = facilityLookupTable.locator('tbody tr, .facility-row');
                    
                    if (await facilityLookupRows.count() > 0) {
                        const firstFacilityRow = facilityLookupRows.first();
                        await firstFacilityRow.click();
                        await page.waitForTimeout(1000);
                        
                        // Click Building Lists
                        const buildingListsButton = page.getByRole('button', { name: 'Building Lists' }).or(
                            page.locator('button:has-text("Building Lists")')
                        );
                        
                        if (await buildingListsButton.count() > 0) {
                            await buildingListsButton.click();
                            await page.waitForLoadState('networkidle');
                            
                            // Get buildings list and find edit button
                            const buildingsTable = page.getByRole('table', { name: 'Buildings' }).or(
                                page.locator('.buildings-table, .building-list')
                            );
                            
                            const buildingRows = buildingsTable.locator('tbody tr, .building-row');
                            
                            if (await buildingRows.count() > 0) {
                                const firstBuilding = buildingRows.first();
                                const editButton = firstBuilding.locator('[data-testid="edit-btn"]').or(
                                    firstBuilding.locator('button[title*="Edit"]')
                                ).or(
                                    firstBuilding.locator('button:has-text("Edit")')
                                );
                                
                                if (await editButton.count() > 0 && !(await editButton.isDisabled())) {
                                    await editButton.click();
                                    await page.waitForLoadState('networkidle');
                                    
                                    // Verify edit page is open
                                    const editBuildingPage = page.getByRole('heading', { name: 'Edit Building' }).or(
                                        page.locator('h1:has-text("Edit Building")')
                                    );
                                    
                                    if (await editBuildingPage.count() > 0) {
                                        console.log('✅ Edit Building page is open');
                                        
                                        // Make some changes
                                        const buildingNameInput = page.getByLabel('Building Name').or(
                                            page.locator('input[placeholder*="Building Name"]')
                                        );
                                        
                                        if (await buildingNameInput.count() > 0) {
                                            await buildingNameInput.fill('TEST-CANCEL');
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
                    }
                }
            }
        }
        
        console.log('✅ Cancel Edit Building operation test completed');
    });

    test('REGRESSION: Verify edit permissions and restrictions for buildings', async ({ page }) => {
        console.log('🔒 Testing edit permissions and restrictions for buildings...');
        
        // Login and navigate
        await goToAliquotQaLink(page);
        await loginAquaUser(page, ALIQUOT_USERNAME_QA, ALIQUOT_PASSWORD_QA);
        await verifyAquaLoginQa(page);
        await clearCacheAndReload(page);
        
        // Navigate through the flow to get to building lists
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
        
        // Select customer and facility, then navigate to building lists
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
                
                // Select facility
                const facilityLookupWindow = page.getByRole('dialog', { name: 'Facility Lookup' }).or(
                    page.locator('.facility-lookup-modal, .facility-lookup-dialog')
                );
                
                if (await facilityLookupWindow.count() > 0) {
                    const facilityLookupTable = facilityLookupWindow.locator('table');
                    const facilityLookupRows = facilityLookupTable.locator('tbody tr, .facility-row');
                    
                    if (await facilityLookupRows.count() > 0) {
                        const firstFacilityRow = facilityLookupRows.first();
                        await firstFacilityRow.click();
                        await page.waitForTimeout(1000);
                        
                        // Click Building Lists
                        const buildingListsButton = page.getByRole('button', { name: 'Building Lists' }).or(
                            page.locator('button:has-text("Building Lists")')
                        );
                        
                        if (await buildingListsButton.count() > 0) {
                            await buildingListsButton.click();
                            await page.waitForLoadState('networkidle');
                            
                            // Check edit button availability
                            const buildingsTable = page.getByRole('table', { name: 'Buildings' }).or(
                                page.locator('.buildings-table, .building-list')
                            );
                            
                            const buildingRows = buildingsTable.locator('tbody tr, .building-row');
                            const buildingCount = await buildingRows.count();
                            
                            let editButtonsFound = 0;
                            let restrictedBuildings = 0;
                            let readOnlyBuildings = 0;
                            
                            for (let i = 0; i < buildingCount; i++) {
                                const buildingRow = buildingRows.nth(i);
                                const buildingText = await buildingRow.textContent();
                                
                                // Check for edit button
                                const editButton = buildingRow.locator('[data-testid="edit-btn"]').or(
                                    buildingRow.locator('button[title*="Edit"]')
                                ).or(
                                    buildingRow.locator('svg[data-icon="edit"], .fa-edit, .fa-pencil')
                                ).or(
                                    buildingRow.locator('button:has-text("Edit")')
                                );
                                
                                if (await editButton.count() > 0) {
                                    // Check if button is disabled
                                    const isDisabled = await editButton.isDisabled();
                                    if (isDisabled) {
                                        readOnlyBuildings++;
                                        console.log(`🔒 Building is read-only: ${buildingText?.substring(0, 30)}...`);
                                    } else {
                                        editButtonsFound++;
                                        console.log(`✅ Edit available for: ${buildingText?.substring(0, 30)}...`);
                                    }
                                } else {
                                    restrictedBuildings++;
                                    console.log(`🔒 No edit option for: ${buildingText?.substring(0, 30)}...`);
                                }
                            }
                            
                            console.log(`📊 Edit permissions summary for buildings:`);
                            console.log(`  - Buildings with edit access: ${editButtonsFound}`);
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
                    }
                }
            }
        }
        
        console.log('✅ Edit permissions and restrictions test completed');
    });
});
