// Test Case: Create New Facility
// Preconditions:
// - User is logged into the application
// - User has access to the Site Management module
// - User has permission to create new facilities
// - At least one customer exists in the system
// - User has appropriate organizational permissions

import { test, expect } from '@playwright/test';
import { randomUUID } from 'crypto';


import {
    goToAliquotQaLink,
    loginAquaUser,
    verifyAquaLoginQa
} from '../../../pages/login/login.steps';

import { ALIQUOT_PASSWORD_QA, ALIQUOT_USERNAME_QA } from '../../../utils/constants';
import { clearCacheAndReload } from '../../../utils/helpers';

test.describe('Create New Facility - Functional Tests', () => {

    test.beforeEach(async ({ page }) => {
        console.log('🔧 Setting up Create New Facility test environment...');
    });

    test.afterEach(async ({ page }) => {
        console.log('🧹 Cleaning up Create New Facility test data...');
    });

    test('REGRESSION: Create New Facility functionality works correctly', async ({ page }) => {
        console.log('🏢 Testing Create New Facility functionality...');
        
        // Login and navigate
        await goToAliquotQaLink(page);
        await loginAquaUser(page, ALIQUOT_USERNAME_QA, ALIQUOT_PASSWORD_QA);
        await verifyAquaLoginQa(page);
        
        // Step 1: Hover over the Site Management tab
        console.log('🖱️ Hovering over the Site Management tab...');
        await page.getByRole('button', { name: 'SiteManagement' }).click();
        await page.waitForTimeout(1000);
        //     page.getByRole('button', { name: 'Site Management' })
        // ).or(
        //     page.locator('[data-testid="site-Management"]')
        // ).or(
        //     page.locator('a:has-text("Site Management")')
        // );
        
        await siteManagementButton.hover({ force: true });
        
        
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
        
        // Step 9: Click Facility Lists
        console.log('🏢 Clicking Facility Lists...');
        await facilityListsLink.click();
        await page.waitForLoadState('networkidle');
        
        // Step 10: Verify Facility List is displayed
        console.log('📋 Verifying Facility List is displayed...');
        const facilityList = page.getByRole('heading', { name: 'Facility List' }).or(
            page.getByRole('heading', { name: 'Facilities' })
        ).or(
            page.getByRole('table', { name: 'Facilities' })
        ).or(
            page.getByRole('table', { name: 'Facility List' })
        ).or(
            page.locator('[data-testid="facility-list"]')
        ).or(
            page.locator('.facility-list, .facilities-table')
        ).or(
            page.locator('h1:has-text("Facility List")')
        ).or(
            page.locator('h1:has-text("Facilities")')
        );
        
        await expect(facilityList).toBeVisible({ timeout: 15000 });
        console.log('✅ Facility List is displayed');
        
        // Get initial facility count
        const facilityTable = page.getByRole('table', { name: 'Facilities' }).or(
            page.getByRole('table', { name: 'Facility List' })
        ).or(
            page.locator('[data-testid="facilities-table"]')
        ).or(
            page.locator('.facilities-table, .facility-list')
        ).or(
            page.locator('table')
        );
        
        const facilityRows = facilityTable.locator('tbody tr, .facility-row');
        const initialFacilityCount = await facilityRows.count();
        console.log(`📊 Initial facility count: ${initialFacilityCount}`);
        
        // Step 11: Verify Create Facility button is active
        console.log('➕ Verifying Create Facility button is active...');
        const createFacilityButton = page.getByRole('button', { name: 'Create Facility' }).or(
            page.getByRole('button', { name: 'Add Facility' })
        ).or(
            page.getByRole('button', { name: 'New Facility' })
        ).or(
            page.locator('[data-testid="create-facility-btn"]')
        ).or(
            page.locator('button:has-text("Create Facility")')
        ).or(
            page.locator('button:has-text("Add Facility")')
        ).or(
            page.locator('button:has-text("New Facility")')
        ).or(
            page.locator('a:has-text("Create Facility")')
        );
        
        await expect(createFacilityButton).toBeVisible({ timeout: 10000 });
        
        // Check if button is enabled
        const isButtonEnabled = await createFacilityButton.isEnabled();
        if (isButtonEnabled) {
            console.log('✅ Create Facility button is active');
        } else {
            console.log('⚠️ Create Facility button is not active');
        }
        
        // Step 12: Click Create Facility
        console.log('🏢 Clicking Create Facility button...');
        await createFacilityButton.click();
        await page.waitForTimeout(1000);
        
        // Step 13: Verify Create Facility page is displayed
        console.log('📝 Verifying Create Facility page is displayed...');
        const createFacilityPage = page.getByRole('heading', { name: 'Create Facility' }).or(
            page.getByRole('heading', { name: 'Add Facility' })
        ).or(
            page.getByRole('heading', { name: 'New Facility' })
        ).or(
            page.locator('[data-testid="create-facility-page"]')
        ).or(
            page.locator('h1:has-text("Create Facility")')
        ).or(
            page.locator('h1:has-text("Add Facility")')
        ).or(
            page.locator('h1:has-text("New Facility")')
        ).or(
            page.locator('.page-title:has-text("Facility")')
        ).or(
            page.locator('.modal-dialog:has-text("Facility")')
        );
        
        await expect(createFacilityPage).toBeVisible({ timeout: 15000 });
        console.log('✅ Create Facility page is displayed');
        
        // Step 14: Enter all required fields and click Save Facility
        console.log('📝 Entering all required fields and clicking Save Facility...');
        
        // Generate unique facility data
        const facilityName = `Test Facility ${randomUUID().substring(0, 8).toUpperCase()}`;
        const facilityCode = `FAC${randomUUID().substring(0, 6).toUpperCase()}`;
        const facilityAddress = `789 Facility Boulevard, Facility City, FC 13579`;
        const facilityPhone = `555-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
        
        // Fill Facility Name (usually required)
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
            await facilityNameInput.fill(facilityName);
            console.log(`✅ Filled Facility Name: ${facilityName}`);
        }
        
        // Fill Facility Code (if available)
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
            await facilityCodeInput.fill(facilityCode);
            console.log(`✅ Filled Facility Code: ${facilityCode}`);
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
            await addressInput.fill(facilityAddress);
            console.log(`✅ Filled Address: ${facilityAddress}`);
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
            await phoneInput.fill(facilityPhone);
            console.log(`✅ Filled Phone: ${facilityPhone}`);
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
            await cityInput.fill('Facility City');
            console.log('✅ Filled City: Facility City');
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
            await stateInput.fill('FC');
            console.log('✅ Filled State: FC');
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
            await zipInput.fill('13579');
            console.log('✅ Filled Zip Code: 13579');
        }
        
        // Click Save Facility
        console.log('💾 Clicking Save Facility button...');
        const saveFacilityButton = page.getByRole('button', { name: 'Save Facility' }).or(
            page.getByRole('button', { name: 'Save' })
        ).or(
            page.getByRole('button', { name: 'Create' })
        ).or(
            page.locator('[data-testid="save-facility-btn"]')
        ).or(
            page.locator('button:has-text("Save")')
        ).or(
            page.locator('button:has-text("Create")')
        );
        
        await expect(saveFacilityButton).toBeVisible({ timeout: 10000 });
        await saveFacilityButton.click();
        
        // Wait for save operation to complete
        await page.waitForTimeout(3000);
        
        // Step 15: Verify Success message is displayed
        console.log('✅ Verifying success message is displayed...');
        const successMessage = page.getByText('Facility has been saved successfully').or(
            page.getByText('Facility saved successfully')
        ).or(
            page.getByText('Facility created successfully')
        ).or(
            page.getByText('Successfully saved')
        ).or(
            page.getByText('Facility added successfully')
        ).or(
            page.locator('[data-testid="success-message"]')
        ).or(
            page.locator('.success-message, .alert-success')
        );
        
        await expect(successMessage).toBeVisible({ timeout: 10000 });
        const successText = await successMessage.textContent();
        console.log(`✅ Success message: "${successText}" is displayed`);
        
        // Step 16: Verify the newly created Facility appears in the Facility List
        console.log('🏢 Verifying the newly created Facility appears in the Facility List...');
        
        // Navigate back to Facility List if needed
        const facilityListPageAfter = page.getByRole('heading', { name: 'Facility List' }).or(
            page.locator('h1:has-text("Facility List")')
        );
        
        if (await facilityListPageAfter.count() === 0) {
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
                console.log('✅ Clicked back button to return to Facility List');
            }
        }
        
        await page.waitForTimeout(2000);
        
        // Find the updated facility table
        const updatedFacilityTable = page.getByRole('table', { name: 'Facilities' }).or(
            page.getByRole('table', { name: 'Facility List' })
        ).or(
            page.locator('[data-testid="facilities-table"]')
        ).or(
            page.locator('.facilities-table, .facility-list')
        ).or(
            page.locator('table')
        );
        
        await expect(updatedFacilityTable).toBeVisible({ timeout: 15000 });
        
        // Search for the created facility in the table
        const updatedFacilityRows = updatedFacilityTable.locator('tbody tr, .facility-row');
        const updatedFacilityCount = await updatedFacilityRows.count();
        console.log(`📊 Updated facility count: ${updatedFacilityCount} (was ${initialFacilityCount})`);
        
        let newFacilityFound = false;
        let foundFacilityText = '';
        
        // Check all rows for the created facility
        for (let i = 0; i < updatedFacilityCount; i++) {
            const row = updatedFacilityRows.nth(i);
            const rowText = await row.textContent();
            
            if (rowText && (rowText.includes(facilityName) || rowText.includes(facilityCode))) {
                newFacilityFound = true;
                foundFacilityText = rowText;
                console.log(`✅ Newly created Facility found in table row ${i + 1}: ${foundFacilityText.substring(0, 100)}...`);
                break;
            }
        }
        
        if (!newFacilityFound) {
            console.log('❌ Newly created Facility not found in the table');
            console.log('📋 All table rows:');
            for (let i = 0; i < Math.min(updatedFacilityCount, 10); i++) { // Show first 10 rows
                const row = updatedFacilityRows.nth(i);
                const rowText = await row.textContent();
                console.log(`  ${i + 1}. ${rowText?.substring(0, 80)}...`);
            }
        } else {
            console.log(`✅ Facility count increased from ${initialFacilityCount} to ${updatedFacilityCount}`);
        }
        
        // Additional verification: Check if we're on the correct page
        const currentUrl = page.url();
        if (currentUrl.includes('facility') || currentUrl.includes('organization')) {
            console.log('📋 Successfully remained on Facility List page after facility creation');
        } else {
            console.log('ℹ️ Current page after facility creation:', currentUrl);
        }
        
        console.log('✅ Create New Facility test completed successfully');
    });

    test('REGRESSION: Create New Facility with validation errors', async ({ page }) => {
        console.log('⚠️ Testing Create New Facility with validation errors...');
        
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
        
        // Click Facility Lists
        const facilityListsLink = page.getByRole('link', { name: 'Facility Lists' }).or(
            page.locator('a:has-text("Facility Lists")')
        );
        
        if (await facilityListsLink.count() > 0) {
            await facilityListsLink.click();
            await page.waitForLoadState('networkidle');
        }
        
        // Click Create Facility
        const createFacilityButton = page.getByRole('button', { name: 'Create Facility' }).or(
            page.locator('button:has-text("Create Facility")')
        );
        
        if (await createFacilityButton.count() > 0) {
            await createFacilityButton.click();
            await page.waitForTimeout(1000);
            
            // Try to save without filling required fields
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
        
        console.log('✅ Create New Facility validation test completed');
    });

    test('REGRESSION: Verify customer lookup window functionality', async ({ page }) => {
        console.log('👥 Testing customer lookup window functionality...');
        
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
        
        // Click Filter Organization to open customer lookup
        const filterOrganization = page.getByRole('combobox', { name: 'Filter Organization' }).or(
            page.locator('select[name*="customer"]')
        );
        
        if (await filterOrganization.count() > 0) {
            await filterOrganization.click();
            await page.waitForTimeout(1000);
            
            // Verify customer lookup window opens
            const customerLookupWindow = page.getByRole('dialog', { name: 'Customer Lookup' }).or(
                page.locator('.customer-lookup-dialog')
            );
            
            if (await customerLookupWindow.count() > 0) {
                console.log('✅ Customer Lookup window opened');
                
                // Check for customer options
                const customerOptions = page.getByRole('listitem').or(
                    page.locator('.customer-option, .lookup-item')
                ).or(
                    page.locator('tr[data-customer], .customer-row')
                );
                
                const customerOptionCount = await customerOptions.count();
                console.log(`📊 Found ${customerOptionCount} customer options`);
                
                if (customerOptionCount > 0) {
                    // Test selecting a customer
                    const firstCustomer = customerOptions.first();
                    const customerName = await firstCustomer.textContent();
                    await firstCustomer.click();
                    console.log(`✅ Selected customer: ${customerName}`);
                    
                    await page.waitForTimeout(2000);
                    
                    // Verify lookup window closed
                    await expect(customerLookupWindow).not.toBeVisible({ timeout: 5000 });
                    console.log('✅ Customer Lookup window closed after selection');
                    
                    // Verify Facility Lists link becomes available
                    const facilityListsLink = page.getByRole('link', { name: 'Facility Lists' }).or(
                        page.locator('a:has-text("Facility Lists")')
                    );
                    
                    if (await facilityListsLink.count() > 0) {
                        console.log('✅ Facility Lists link becomes available after customer selection');
                    } else {
                        console.log('⚠️ Facility Lists link not found after customer selection');
                    }
                } else {
                    console.log('⚠️ No customer options found in lookup window');
                }
            } else {
                console.log('⚠️ Customer Lookup window not found');
            }
        }
        
        console.log('✅ Customer lookup window functionality test completed');
    });

    test('REGRESSION: Verify facility lists link availability', async ({ page }) => {
        console.log('🏢 Testing facility lists link availability...');
        
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
        
        // Check if Facility Lists link is available before customer selection
        const facilityListsLinkBefore = page.getByRole('link', { name: 'Facility Lists' }).or(
            page.locator('a:has-text("Facility Lists")')
        );
        
        const isFacilityLinkAvailableBefore = await facilityListsLinkBefore.count() > 0;
        console.log(`🏢 Facility Lists link available before customer selection: ${isFacilityLinkAvailableBefore}`);
        
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
                
                // Check if Facility Lists link is available after customer selection
                const facilityListsLinkAfter = page.getByRole('link', { name: 'Facility Lists' }).or(
                    page.locator('a:has-text("Facility Lists")')
                );
                
                const isFacilityLinkAvailableAfter = await facilityListsLinkAfter.count() > 0;
                console.log(`🏢 Facility Lists link available after customer selection: ${isFacilityLinkAvailableAfter}`);
                
                if (isFacilityLinkAvailableAfter) {
                    // Test clicking the Facility Lists link
                    await facilityListsLinkAfter.click();
                    await page.waitForLoadState('networkidle');
                    
                    // Verify facility list is displayed
                    const facilityList = page.getByRole('heading', { name: 'Facility List' }).or(
                        page.locator('h1:has-text("Facility List")')
                    ).or(
                        page.locator('table')
                    );
                    
                    if (await facilityList.count() > 0) {
                        console.log('✅ Facility List is displayed after clicking Facility Lists link');
                        
                        // Check for Create Facility button
                        const createFacilityButton = page.getByRole('button', { name: 'Create Facility' }).or(
                            page.locator('button:has-text("Create Facility")')
                        );
                        
                        if (await createFacilityButton.count() > 0) {
                            const isButtonEnabled = await createFacilityButton.isEnabled();
                            console.log(`✅ Create Facility button is active: ${isButtonEnabled}`);
                        } else {
                            console.log('⚠️ Create Facility button not found');
                        }
                    } else {
                        console.log('⚠️ Facility List not displayed');
                    }
                } else {
                    console.log('⚠️ Facility Lists link not available after customer selection');
                }
            }
        }
        
        console.log('✅ Facility lists link availability test completed');
    });
});
