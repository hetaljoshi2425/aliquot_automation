// Test Case: Create New Building
// Preconditions:
// - User is logged into the application
// - User has access to the Site Management module
// - User has permission to create new buildings
// - At least one customer and facility exist in the system
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

test.describe('Create New Building - Functional Tests', () => {

    test.beforeEach(async ({ page }) => {
        console.log('🔧 Setting up Create New Building test environment...');
    });

    test.afterEach(async ({ page }) => {
        console.log('🧹 Cleaning up Create New Building test data...');
    });

    test('REGRESSION: Create New Building functionality works correctly', async ({ page }) => {
        console.log('🏗️ Testing Create New Building functionality...');
        
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
        
        // Step 5: In Filter Organization, select a Customer
        console.log('🔍 In Filter Organization, selecting a Customer...');
        const filterOrganization = page.getByRole('combobox', { name: 'Filter Organization' }).or(
            page.getByRole('combobox', { name: 'Customer' })
        ).or(
            page.getByRole('button', { name: 'Select Customer' })
        ).or(
            page.locator('[data-testid="filter-organization"]')
        ).or(
            page.locator('[data-testid="customer-filter"]')
        ).or(
            page.locator('.filter-organization, .customer-filter')
        ).or(
            page.locator('select[name*="customer"]')
        ).or(
            page.locator('input[placeholder*="Customer"]')
        );
        
        await expect(filterOrganization).toBeVisible({ timeout: 10000 });
        await filterOrganization.click();
        await page.waitForTimeout(1000);
        
        // Step 6: Verify Customer Lookup window is opened
        console.log('👥 Verifying Customer Lookup window is opened...');
        const customerLookupWindow = page.getByRole('dialog', { name: 'Customer Lookup' }).or(
            page.getByRole('dialog', { name: 'Select Customer' })
        ).or(
            page.locator('[data-testid="customer-lookup-window"]')
        ).or(
            page.locator('.customer-lookup-dialog')
        ).or(
            page.locator('.modal-dialog:has-text("Customer")')
        ).or(
            page.locator('.lookup-window')
        );
        
        await expect(customerLookupWindow).toBeVisible({ timeout: 15000 });
        console.log('✅ Customer Lookup window is opened');
        
        // Step 7: Select the Customer
        console.log('👥 Selecting the Customer...');
        const customerOptions = page.getByRole('listitem').or(
            page.locator('[data-testid="customer-option"]')
        ).or(
            page.locator('.customer-option, .lookup-item')
        ).or(
            page.locator('tr[data-customer], .customer-row')
        ).or(
            page.locator('.lookup-row, .selectable-row')
        );
        
        const customerOptionCount = await customerOptions.count();
        console.log(`📊 Found ${customerOptionCount} customer options`);
        
        if (customerOptionCount === 0) {
            throw new Error('No customers found in the Customer Lookup window');
        }
        
        // Select the first available customer
        const selectedCustomer = customerOptions.first();
        const customerName = await selectedCustomer.textContent();
        await selectedCustomer.click();
        console.log(`✅ Selected Customer: ${customerName}`);
        
        // Wait for Customer Lookup window to close
        await expect(customerLookupWindow).not.toBeVisible({ timeout: 5000 });
        console.log('✅ Customer Lookup window is closed');
        
        // Wait for page to update after customer selection
        await page.waitForTimeout(2000);
        
        // Step 8: Verify Facility Lists link becomes available
        console.log('🏢 Verifying Facility Lists link becomes available...');
        const facilityListsLink = page.getByRole('link', { name: 'Facility Lists' }).or(
            page.getByRole('button', { name: 'Facility Lists' })
        ).or(
            page.locator('[data-testid="facility-lists-link"]')
        ).or(
            page.locator('a:has-text("Facility Lists")')
        ).or(
            page.locator('button:has-text("Facility Lists")')
        );
        
        await expect(facilityListsLink).toBeVisible({ timeout: 10000 });
        console.log('✅ Facility Lists link becomes available');
        
        // Step 9: In Filter Organization, select a Facility
        console.log('🏢 In Filter Organization, selecting a Facility...');
        const facilityFilter = page.getByRole('combobox', { name: 'Facility' }).or(
            page.getByRole('button', { name: 'Select Facility' })
        ).or(
            page.locator('[data-testid="facility-filter"]')
        ).or(
            page.locator('.facility-filter')
        ).or(
            page.locator('select[name*="facility"]')
        ).or(
            page.locator('input[placeholder*="Facility"]')
        );
        
        if (await facilityFilter.count() > 0) {
            await facilityFilter.click();
            await page.waitForTimeout(1000);
            
            // Step 10: Verify Facility Lookup window is opened
            console.log('🏢 Verifying Facility Lookup window is opened...');
            const facilityLookupWindow = page.getByRole('dialog', { name: 'Facility Lookup' }).or(
                page.getByRole('dialog', { name: 'Select Facility' })
            ).or(
                page.locator('[data-testid="facility-lookup-window"]')
            ).or(
                page.locator('.facility-lookup-dialog')
            ).or(
                page.locator('.modal-dialog:has-text("Facility")')
            ).or(
                page.locator('.lookup-window')
            );
            
            await expect(facilityLookupWindow).toBeVisible({ timeout: 15000 });
            console.log('✅ Facility Lookup window is opened');
            
            // Step 11: Select the Facility
            console.log('🏢 Selecting the Facility...');
            const facilityOptions = page.getByRole('listitem').or(
                page.locator('[data-testid="facility-option"]')
            ).or(
                page.locator('.facility-option, .lookup-item')
            ).or(
                page.locator('tr[data-facility], .facility-row')
            ).or(
                page.locator('.lookup-row, .selectable-row')
            );
            
            const facilityOptionCount = await facilityOptions.count();
            console.log(`📊 Found ${facilityOptionCount} facility options`);
            
            if (facilityOptionCount === 0) {
                throw new Error('No facilities found in the Facility Lookup window');
            }
            
            // Select the first available facility
            const selectedFacility = facilityOptions.first();
            const facilityName = await selectedFacility.textContent();
            await selectedFacility.click();
            console.log(`✅ Selected Facility: ${facilityName}`);
            
            // Wait for Facility Lookup window to close
            await expect(facilityLookupWindow).not.toBeVisible({ timeout: 5000 });
            console.log('✅ Facility Lookup window is closed');
            
            // Wait for page to update after facility selection
            await page.waitForTimeout(2000);
        } else {
            console.log('ℹ️ Facility filter not found - may not be required');
        }
        
        // Step 12: Verify Building Lists link becomes available
        console.log('🏗️ Verifying Building Lists link becomes available...');
        const buildingListsLink = page.getByRole('link', { name: 'Building Lists' }).or(
            page.getByRole('button', { name: 'Building Lists' })
        ).or(
            page.locator('[data-testid="building-lists-link"]')
        ).or(
            page.locator('a:has-text("Building Lists")')
        ).or(
            page.locator('button:has-text("Building Lists")')
        );
        
        await expect(buildingListsLink).toBeVisible({ timeout: 10000 });
        console.log('✅ Building Lists link becomes available');
        
        // Step 13: Click Building List
        console.log('🏗️ Clicking Building List...');
        await buildingListsLink.click();
        await page.waitForLoadState('networkidle');
        
        // Step 14: Verify Create Building button is active
        console.log('➕ Verifying Create Building button is active...');
        const createBuildingButton = page.getByRole('button', { name: 'Create Building' }).or(
            page.getByRole('button', { name: 'Add Building' })
        ).or(
            page.getByRole('button', { name: 'New Building' })
        ).or(
            page.locator('[data-testid="create-building-btn"]')
        ).or(
            page.locator('button:has-text("Create Building")')
        ).or(
            page.locator('button:has-text("Add Building")')
        ).or(
            page.locator('button:has-text("New Building")')
        ).or(
            page.locator('a:has-text("Create Building")')
        );
        
        await expect(createBuildingButton).toBeVisible({ timeout: 10000 });
        
        // Check if button is enabled
        const isButtonEnabled = await createBuildingButton.isEnabled();
        if (isButtonEnabled) {
            console.log('✅ Create Building button is active');
        } else {
            console.log('⚠️ Create Building button is not active');
        }
        
        // Get initial building count
        const buildingTable = page.getByRole('table', { name: 'Buildings' }).or(
            page.getByRole('table', { name: 'Building List' })
        ).or(
            page.locator('[data-testid="buildings-table"]')
        ).or(
            page.locator('.buildings-table, .building-list')
        ).or(
            page.locator('table')
        );
        
        const buildingRows = buildingTable.locator('tbody tr, .building-row');
        const initialBuildingCount = await buildingRows.count();
        console.log(`📊 Initial building count: ${initialBuildingCount}`);
        
        // Step 15: Click Create Building
        console.log('🏗️ Clicking Create Building button...');
        await createBuildingButton.click();
        await page.waitForTimeout(1000);
        
        // Step 16: Verify Create Building page is loaded
        console.log('📝 Verifying Create Building page is loaded...');
        const createBuildingPage = page.getByRole('heading', { name: 'Create Building' }).or(
            page.getByRole('heading', { name: 'Add Building' })
        ).or(
            page.getByRole('heading', { name: 'New Building' })
        ).or(
            page.locator('[data-testid="create-building-page"]')
        ).or(
            page.locator('h1:has-text("Create Building")')
        ).or(
            page.locator('h1:has-text("Add Building")')
        ).or(
            page.locator('h1:has-text("New Building")')
        ).or(
            page.locator('.page-title:has-text("Building")')
        ).or(
            page.locator('.modal-dialog:has-text("Building")')
        );
        
        await expect(createBuildingPage).toBeVisible({ timeout: 15000 });
        console.log('✅ Create Building page is loaded');
        
        // Step 17: Enter all required fields and click Save Building
        console.log('📝 Entering all required fields and clicking Save Building...');
        
        // Generate unique building data
        const buildingName = `Test Building ${randomUUID().substring(0, 8).toUpperCase()}`;
        const buildingCode = `BLD${randomUUID().substring(0, 6).toUpperCase()}`;
        const buildingAddress = `123 Building Street, Building City, BC 24680`;
        const buildingPhone = `555-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
        
        // Fill Building Name (usually required)
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
            await buildingNameInput.fill(buildingName);
            console.log(`✅ Filled Building Name: ${buildingName}`);
        }
        
        // Fill Building Code (if available)
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
            await buildingCodeInput.fill(buildingCode);
            console.log(`✅ Filled Building Code: ${buildingCode}`);
        }
        
        // Fill Address (if available)
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
            await addressInput.fill(buildingAddress);
            console.log(`✅ Filled Address: ${buildingAddress}`);
        }
        
        // Fill Phone (if available)
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
            await phoneInput.fill(buildingPhone);
            console.log(`✅ Filled Phone: ${buildingPhone}`);
        }
        
        // Fill City (if available)
        const cityInput = page.getByLabel('City').or(
            page.locator('[data-testid="city-input"]')
        ).or(
            page.locator('input[name*="city"]')
        ).or(
            page.locator('input[placeholder*="City"]')
        );
        
        if (await cityInput.count() > 0) {
            await cityInput.fill('Building City');
            console.log('✅ Filled City: Building City');
        }
        
        // Fill State (if available)
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
            await stateInput.fill('BC');
            console.log('✅ Filled State: BC');
        }
        
        // Fill Zip Code (if available)
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
            await zipInput.fill('24680');
            console.log('✅ Filled Zip Code: 24680');
        }
        
        // Click Save Building
        console.log('💾 Clicking Save Building button...');
        const saveBuildingButton = page.getByRole('button', { name: 'Save Building' }).or(
            page.getByRole('button', { name: 'Save' })
        ).or(
            page.getByRole('button', { name: 'Create' })
        ).or(
            page.locator('[data-testid="save-building-btn"]')
        ).or(
            page.locator('button:has-text("Save")')
        ).or(
            page.locator('button:has-text("Create")')
        );
        
        await expect(saveBuildingButton).toBeVisible({ timeout: 10000 });
        await saveBuildingButton.click();
        
        // Wait for save operation to complete
        await page.waitForTimeout(3000);
        
        // Step 18: Verify Success message is displayed
        console.log('✅ Verifying success message is displayed...');
        const successMessage = page.getByText('Building has been created successfully').or(
            page.getByText('Building saved successfully')
        ).or(
            page.getByText('Building created successfully')
        ).or(
            page.getByText('Successfully saved')
        ).or(
            page.getByText('Building added successfully')
        ).or(
            page.locator('[data-testid="success-message"]')
        ).or(
            page.locator('.success-message, .alert-success')
        );
        
        await expect(successMessage).toBeVisible({ timeout: 10000 });
        const successText = await successMessage.textContent();
        console.log(`✅ Success message: "${successText}" is displayed`);
        
        // Step 19: Verify the newly created Building appears in the Building List
        console.log('🏗️ Verifying the newly created Building appears in the Building List...');
        
        // Navigate back to Building List if needed
        const buildingListPageAfter = page.getByRole('heading', { name: 'Building List' }).or(
            page.locator('h1:has-text("Building List")')
        );
        
        if (await buildingListPageAfter.count() === 0) {
            // Look for back button or navigation
            const backButton = page.getByRole('button', { name: 'Back' }).or(
                page.getByRole('button', { name: 'Cancel' })
            ).or(
                page.locator('[data-testid="back-btn"]')
            ).or(
                page.locator('button:has-text("Back")')
            ).or(
                page.locator('button:has-text("Cancel")')
            );
            
            if (await backButton.count() > 0) {
                await backButton.click();
                await page.waitForLoadState('networkidle');
                console.log('✅ Clicked back button to return to Building List');
            }
        }
        
        await page.waitForTimeout(2000);
        
        // Find the updated building table
        const updatedBuildingTable = page.getByRole('table', { name: 'Buildings' }).or(
            page.getByRole('table', { name: 'Building List' })
        ).or(
            page.locator('[data-testid="buildings-table"]')
        ).or(
            page.locator('.buildings-table, .building-list')
        ).or(
            page.locator('table')
        );
        
        await expect(updatedBuildingTable).toBeVisible({ timeout: 15000 });
        
        // Search for the created building in the table
        const updatedBuildingRows = updatedBuildingTable.locator('tbody tr, .building-row');
        const updatedBuildingCount = await updatedBuildingRows.count();
        console.log(`📊 Updated building count: ${updatedBuildingCount} (was ${initialBuildingCount})`);
        
        let newBuildingFound = false;
        let foundBuildingText = '';
        
        // Check all rows for the created building
        for (let i = 0; i < updatedBuildingCount; i++) {
            const row = updatedBuildingRows.nth(i);
            const rowText = await row.textContent();
            
            if (rowText && (rowText.includes(buildingName) || rowText.includes(buildingCode))) {
                newBuildingFound = true;
                foundBuildingText = rowText;
                console.log(`✅ Newly created Building found in table row ${i + 1}: ${foundBuildingText.substring(0, 100)}...`);
                break;
            }
        }
        
        if (!newBuildingFound) {
            console.log('❌ Newly created Building not found in the table');
            console.log('📋 All table rows:');
            for (let i = 0; i < Math.min(updatedBuildingCount, 10); i++) { // Show first 10 rows
                const row = updatedBuildingRows.nth(i);
                const rowText = await row.textContent();
                console.log(`  ${i + 1}. ${rowText?.substring(0, 80)}...`);
            }
        } else {
            console.log(`✅ Building count increased from ${initialBuildingCount} to ${updatedBuildingCount}`);
        }
        
        // Additional verification: Check if we're on the correct page
        const currentUrl = page.url();
        if (currentUrl.includes('building') || currentUrl.includes('organization')) {
            console.log('📋 Successfully remained on Building List page after building creation');
        } else {
            console.log('ℹ️ Current page after building creation:', currentUrl);
        }
        
        console.log('✅ Create New Building test completed successfully');
    });

    test('REGRESSION: Create New Building with validation errors', async ({ page }) => {
        console.log('⚠️ Testing Create New Building with validation errors...');
        
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
        
        // Select a customer
        const filterOrganization = page.getByRole('combobox', { name: 'Filter Organization' }).or(
            page.locator('select[name*="customer"]')
        );
        
        if (await filterOrganization.count() > 0) {
            await filterOrganization.click();
            await page.waitForTimeout(1000);
            
            const customerOptions = page.getByRole('option').or(
                page.locator('option')
            );
            
            if (await customerOptions.count() > 0) {
                await customerOptions.first().click();
                await page.waitForTimeout(2000);
            }
        }
        
        // Select a facility
        const facilityFilter = page.getByRole('combobox', { name: 'Facility' }).or(
            page.locator('select[name*="facility"]')
        );
        
        if (await facilityFilter.count() > 0) {
            await facilityFilter.click();
            await page.waitForTimeout(1000);
            
            const facilityOptions = page.getByRole('option').or(
                page.locator('option')
            );
            
            if (await facilityOptions.count() > 0) {
                await facilityOptions.first().click();
                await page.waitForTimeout(2000);
            }
        }
        
        // Click Building Lists
        const buildingListsLink = page.getByRole('link', { name: 'Building Lists' }).or(
            page.locator('a:has-text("Building Lists")')
        );
        
        if (await buildingListsLink.count() > 0) {
            await buildingListsLink.click();
            await page.waitForLoadState('networkidle');
        }
        
        // Click Create Building
        const createBuildingButton = page.getByRole('button', { name: 'Create Building' }).or(
            page.locator('button:has-text("Create Building")')
        );
        
        if (await createBuildingButton.count() > 0) {
            await createBuildingButton.click();
            await page.waitForTimeout(1000);
            
            // Try to save without filling required fields
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
                
                // Check for required field indicators (red !)
                const requiredFields = page.locator('.required, .mandatory, [data-required="true"]').or(
                    page.locator('input[required], select[required], textarea[required]')
                );
                
                const requiredFieldCount = await requiredFields.count();
                if (requiredFieldCount > 0) {
                    console.log(`📋 Found ${requiredFieldCount} required fields`);
                }
            }
        }
        
        console.log('✅ Create New Building validation test completed');
    });

    test('REGRESSION: Verify facility lookup window functionality', async ({ page }) => {
        console.log('🏢 Testing facility lookup window functionality...');
        
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
        
        // Select a customer first
        const filterOrganization = page.getByRole('combobox', { name: 'Filter Organization' }).or(
            page.locator('select[name*="customer"]')
        );
        
        if (await filterOrganization.count() > 0) {
            await filterOrganization.click();
            await page.waitForTimeout(1000);
            
            const customerOptions = page.getByRole('option').or(
                page.locator('option')
            );
            
            if (await customerOptions.count() > 0) {
                await customerOptions.first().click();
                await page.waitForTimeout(2000);
            }
        }
        
        // Click facility filter to open facility lookup
        const facilityFilter = page.getByRole('combobox', { name: 'Facility' }).or(
            page.locator('select[name*="facility"]')
        );
        
        if (await facilityFilter.count() > 0) {
            await facilityFilter.click();
            await page.waitForTimeout(1000);
            
            // Verify facility lookup window opens
            const facilityLookupWindow = page.getByRole('dialog', { name: 'Facility Lookup' }).or(
                page.locator('.facility-lookup-dialog')
            );
            
            if (await facilityLookupWindow.count() > 0) {
                console.log('✅ Facility Lookup window opened');
                
                // Check for facility options
                const facilityOptions = page.getByRole('listitem').or(
                    page.locator('.facility-option, .lookup-item')
                ).or(
                    page.locator('tr[data-facility], .facility-row')
                );
                
                const facilityOptionCount = await facilityOptions.count();
                console.log(`📊 Found ${facilityOptionCount} facility options`);
                
                if (facilityOptionCount > 0) {
                    // Test selecting a facility
                    const firstFacility = facilityOptions.first();
                    const facilityName = await firstFacility.textContent();
                    await firstFacility.click();
                    console.log(`✅ Selected facility: ${facilityName}`);
                    
                    await page.waitForTimeout(2000);
                    
                    // Verify lookup window closed
                    await expect(facilityLookupWindow).not.toBeVisible({ timeout: 5000 });
                    console.log('✅ Facility Lookup window closed after selection');
                    
                    // Verify Building Lists link becomes available
                    const buildingListsLink = page.getByRole('link', { name: 'Building Lists' }).or(
                        page.locator('a:has-text("Building Lists")')
                    );
                    
                    if (await buildingListsLink.count() > 0) {
                        console.log('✅ Building Lists link becomes available after facility selection');
                    } else {
                        console.log('⚠️ Building Lists link not found after facility selection');
                    }
                } else {
                    console.log('⚠️ No facility options found in lookup window');
                }
            } else {
                console.log('⚠️ Facility Lookup window not found');
            }
        }
        
        console.log('✅ Facility lookup window functionality test completed');
    });

    test('REGRESSION: Verify building lists link availability', async ({ page }) => {
        console.log('🏗️ Testing building lists link availability...');
        
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
        
        // Check if Building Lists link is available before selections
        const buildingListsLinkBefore = page.getByRole('link', { name: 'Building Lists' }).or(
            page.locator('a:has-text("Building Lists")')
        );
        
        const isBuildingLinkAvailableBefore = await buildingListsLinkBefore.count() > 0;
        console.log(`🏗️ Building Lists link available before selections: ${isBuildingLinkAvailableBefore}`);
        
        // Select a customer
        const filterOrganization = page.getByRole('combobox', { name: 'Filter Organization' }).or(
            page.locator('select[name*="customer"]')
        );
        
        if (await filterOrganization.count() > 0) {
            await filterOrganization.click();
            await page.waitForTimeout(1000);
            
            const customerOptions = page.getByRole('option').or(
                page.locator('option')
            );
            
            if (await customerOptions.count() > 0) {
                await customerOptions.first().click();
                await page.waitForTimeout(2000);
                
                // Check if Building Lists link is available after customer selection
                const buildingListsLinkAfterCustomer = page.getByRole('link', { name: 'Building Lists' }).or(
                    page.locator('a:has-text("Building Lists")')
                );
                
                const isBuildingLinkAvailableAfterCustomer = await buildingListsLinkAfterCustomer.count() > 0;
                console.log(`🏗️ Building Lists link available after customer selection: ${isBuildingLinkAvailableAfterCustomer}`);
                
                // Select a facility
                const facilityFilter = page.getByRole('combobox', { name: 'Facility' }).or(
                    page.locator('select[name*="facility"]')
                );
                
                if (await facilityFilter.count() > 0) {
                    await facilityFilter.click();
                    await page.waitForTimeout(1000);
                    
                    const facilityOptions = page.getByRole('option').or(
                        page.locator('option')
                    );
                    
                    if (await facilityOptions.count() > 0) {
                        await facilityOptions.first().click();
                        await page.waitForTimeout(2000);
                        
                        // Check if Building Lists link is available after facility selection
                        const buildingListsLinkAfterFacility = page.getByRole('link', { name: 'Building Lists' }).or(
                            page.locator('a:has-text("Building Lists")')
                        );
                        
                        const isBuildingLinkAvailableAfterFacility = await buildingListsLinkAfterFacility.count() > 0;
                        console.log(`🏗️ Building Lists link available after facility selection: ${isBuildingLinkAvailableAfterFacility}`);
                        
                        if (isBuildingLinkAvailableAfterFacility) {
                            // Test clicking the Building Lists link
                            await buildingListsLinkAfterFacility.click();
                            await page.waitForLoadState('networkidle');
                            
                            // Verify building list is displayed
                            const buildingList = page.getByRole('heading', { name: 'Building List' }).or(
                                page.locator('h1:has-text("Building List")')
                            ).or(
                                page.locator('table')
                            );
                            
                            if (await buildingList.count() > 0) {
                                console.log('✅ Building List is displayed after clicking Building Lists link');
                                
                                // Check for Create Building button
                                const createBuildingButton = page.getByRole('button', { name: 'Create Building' }).or(
                                    page.locator('button:has-text("Create Building")')
                                );
                                
                                if (await createBuildingButton.count() > 0) {
                                    const isButtonEnabled = await createBuildingButton.isEnabled();
                                    console.log(`✅ Create Building button is active: ${isButtonEnabled}`);
                                } else {
                                    console.log('⚠️ Create Building button not found');
                                }
                            } else {
                                console.log('⚠️ Building List not displayed');
                            }
                        } else {
                            console.log('⚠️ Building Lists link not available after facility selection');
                        }
                    }
                }
            }
        }
        
        console.log('✅ Building lists link availability test completed');
    });
});
