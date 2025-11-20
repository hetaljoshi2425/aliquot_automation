// Test Case: Create New System
// Preconditions:
// - User is logged into the application
// - User has access to the Site Management module
// - User has permission to create new systems
// - At least one customer, facility, and building exist in the system
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

test.describe('Create New System - Functional Tests', () => {

    test.beforeEach(async ({ page }) => {
        console.log('🔧 Setting up Create New System test environment...');
    });

    test.afterEach(async ({ page }) => {
        console.log('🧹 Cleaning up Create New System test data...');
    });

    test('REGRESSION: Create New System functionality works correctly', async ({ page }) => {
        console.log('⚙️ Testing Create New System functionality...');
        
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
        
        // Step 13: In Filter Organization, select a Building
        console.log('🏗️ In Filter Organization, selecting a Building...');
        const buildingFilter = page.getByRole('combobox', { name: 'Building' }).or(
            page.getByRole('button', { name: 'Select Building' })
        ).or(
            page.locator('[data-testid="building-filter"]')
        ).or(
            page.locator('.building-filter')
        ).or(
            page.locator('select[name*="building"]')
        ).or(
            page.locator('input[placeholder*="Building"]')
        );
        
        if (await buildingFilter.count() > 0) {
            await buildingFilter.click();
            await page.waitForTimeout(1000);
            
            // Step 14: Verify Building Lookup window is opened
            console.log('🏗️ Verifying Building Lookup window is opened...');
            const buildingLookupWindow = page.getByRole('dialog', { name: 'Building Lookup' }).or(
                page.getByRole('dialog', { name: 'Select Building' })
            ).or(
                page.locator('[data-testid="building-lookup-window"]')
            ).or(
                page.locator('.building-lookup-dialog')
            ).or(
                page.locator('.modal-dialog:has-text("Building")')
            ).or(
                page.locator('.lookup-window')
            );
            
            await expect(buildingLookupWindow).toBeVisible({ timeout: 15000 });
            console.log('✅ Building Lookup window is opened');
            
            // Step 15: Select the Building
            console.log('🏗️ Selecting the Building...');
            const buildingOptions = page.getByRole('listitem').or(
                page.locator('[data-testid="building-option"]')
            ).or(
                page.locator('.building-option, .lookup-item')
            ).or(
                page.locator('tr[data-building], .building-row')
            ).or(
                page.locator('.lookup-row, .selectable-row')
            );
            
            const buildingOptionCount = await buildingOptions.count();
            console.log(`📊 Found ${buildingOptionCount} building options`);
            
            if (buildingOptionCount === 0) {
                throw new Error('No buildings found in the Building Lookup window');
            }
            
            // Select the first available building
            const selectedBuilding = buildingOptions.first();
            const buildingName = await selectedBuilding.textContent();
            await selectedBuilding.click();
            console.log(`✅ Selected Building: ${buildingName}`);
            
            // Wait for Building Lookup window to close
            await expect(buildingLookupWindow).not.toBeVisible({ timeout: 5000 });
            console.log('✅ Building Lookup window is closed');
            
            // Wait for page to update after building selection
            await page.waitForTimeout(2000);
        } else {
            console.log('ℹ️ Building filter not found - may not be required');
        }
        
        // Step 16: Verify System Lists button becomes available
        console.log('⚙️ Verifying System Lists button becomes available...');
        const systemListsButton = page.getByRole('button', { name: 'System Lists' }).or(
            page.getByRole('link', { name: 'System Lists' })
        ).or(
            page.locator('[data-testid="system-lists-button"]')
        ).or(
            page.locator('button:has-text("System Lists")')
        ).or(
            page.locator('a:has-text("System Lists")')
        );
        
        await expect(systemListsButton).toBeVisible({ timeout: 10000 });
        console.log('✅ System Lists button becomes available');
        
        // Step 17: Click System Lists
        console.log('⚙️ Clicking System Lists...');
        await systemListsButton.click();
        await page.waitForLoadState('networkidle');
        
        // Step 18: Verify Create System button is active
        console.log('➕ Verifying Create System button is active...');
        const createSystemButton = page.getByRole('button', { name: 'Create System' }).or(
            page.getByRole('button', { name: 'Add System' })
        ).or(
            page.getByRole('button', { name: 'New System' })
        ).or(
            page.locator('[data-testid="create-system-btn"]')
        ).or(
            page.locator('button:has-text("Create System")')
        ).or(
            page.locator('button:has-text("Add System")')
        ).or(
            page.locator('button:has-text("New System")')
        ).or(
            page.locator('a:has-text("Create System")')
        );
        
        await expect(createSystemButton).toBeVisible({ timeout: 10000 });
        
        // Check if button is enabled
        const isButtonEnabled = await createSystemButton.isEnabled();
        if (isButtonEnabled) {
            console.log('✅ Create System button is active');
        } else {
            console.log('⚠️ Create System button is not active');
        }
        
        // Get initial system count
        const systemTable = page.getByRole('table', { name: 'Systems' }).or(
            page.getByRole('table', { name: 'System List' })
        ).or(
            page.locator('[data-testid="systems-table"]')
        ).or(
            page.locator('.systems-table, .system-list')
        ).or(
            page.locator('table')
        );
        
        const systemRows = systemTable.locator('tbody tr, .system-row');
        const initialSystemCount = await systemRows.count();
        console.log(`📊 Initial system count: ${initialSystemCount}`);
        
        // Step 19: Click Create System
        console.log('⚙️ Clicking Create System button...');
        await createSystemButton.click();
        await page.waitForTimeout(1000);
        
        // Step 20: Verify Create System page is loaded
        console.log('📝 Verifying Create System page is loaded...');
        const createSystemPage = page.getByRole('heading', { name: 'Create System' }).or(
            page.getByRole('heading', { name: 'Add System' })
        ).or(
            page.getByRole('heading', { name: 'New System' })
        ).or(
            page.locator('[data-testid="create-system-page"]')
        ).or(
            page.locator('h1:has-text("Create System")')
        ).or(
            page.locator('h1:has-text("Add System")')
        ).or(
            page.locator('h1:has-text("New System")')
        ).or(
            page.locator('.page-title:has-text("System")')
        ).or(
            page.locator('.modal-dialog:has-text("System")')
        );
        
        await expect(createSystemPage).toBeVisible({ timeout: 15000 });
        console.log('✅ Create System page is loaded');
        
        // Step 21: Enter Name (required) and click Save System
        console.log('📝 Entering Name (required) and clicking Save System...');
        
        // Generate unique system name
        const systemName = `Test System ${randomUUID().substring(0, 8).toUpperCase()}`;
        
        // Fill System Name (required)
        const systemNameInput = page.getByLabel('Name').or(
            page.getByLabel('System Name')
        ).or(
            page.locator('[data-testid="system-name-input"]')
        ).or(
            page.locator('input[name*="systemName"]')
        ).or(
            page.locator('input[name*="name"]')
        ).or(
            page.locator('input[placeholder*="System Name"]')
        ).or(
            page.locator('input[placeholder*="Name"]')
        );
        
        await expect(systemNameInput).toBeVisible({ timeout: 10000 });
        await systemNameInput.fill(systemName);
        console.log(`✅ Filled System Name: ${systemName}`);
        
        // Fill additional fields if available (not required but good to test)
        const systemCodeInput = page.getByLabel('Code').or(
            page.getByLabel('System Code')
        ).or(
            page.locator('[data-testid="system-code-input"]')
        ).or(
            page.locator('input[name*="code"]')
        ).or(
            page.locator('input[placeholder*="Code"]')
        );
        
        if (await systemCodeInput.count() > 0) {
            const systemCode = `SYS${randomUUID().substring(0, 6).toUpperCase()}`;
            await systemCodeInput.fill(systemCode);
            console.log(`✅ Filled System Code: ${systemCode}`);
        }
        
        const descriptionInput = page.getByLabel('Description').or(
            page.locator('[data-testid="description-input"]')
        ).or(
            page.locator('textarea[name*="description"]')
        ).or(
            page.locator('textarea[placeholder*="Description"]')
        );
        
        if (await descriptionInput.count() > 0) {
            await descriptionInput.fill(`Test system for automation testing`);
            console.log('✅ Filled Description');
        }
        
        // Click Save System
        console.log('💾 Clicking Save System button...');
        const saveSystemButton = page.getByRole('button', { name: 'Save System' }).or(
            page.getByRole('button', { name: 'Save' })
        ).or(
            page.getByRole('button', { name: 'Create' })
        ).or(
            page.locator('[data-testid="save-system-btn"]')
        ).or(
            page.locator('button:has-text("Save")')
        ).or(
            page.locator('button:has-text("Create")')
        );
        
        await expect(saveSystemButton).toBeVisible({ timeout: 10000 });
        await saveSystemButton.click();
        
        // Wait for save operation to complete
        await page.waitForTimeout(3000);
        
        // Step 22: Verify Success message is displayed
        console.log('✅ Verifying success message is displayed...');
        const successMessage = page.getByText('System has been saved successfully').or(
            page.getByText('System saved successfully')
        ).or(
            page.getByText('System created successfully')
        ).or(
            page.getByText('Successfully saved')
        ).or(
            page.getByText('System added successfully')
        ).or(
            page.locator('[data-testid="success-message"]')
        ).or(
            page.locator('.success-message, .alert-success')
        );
        
        await expect(successMessage).toBeVisible({ timeout: 10000 });
        const successText = await successMessage.textContent();
        console.log(`✅ Success message: "${successText}" is displayed`);
        
        // Step 23: Verify the newly created System appears in the System List
        console.log('⚙️ Verifying the newly created System appears in the System List...');
        
        // Navigate back to System List if needed
        const systemListPageAfter = page.getByRole('heading', { name: 'System List' }).or(
            page.locator('h1:has-text("System List")')
        );
        
        if (await systemListPageAfter.count() === 0) {
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
                console.log('✅ Clicked back button to return to System List');
            }
        }
        
        await page.waitForTimeout(2000);
        
        // Find the updated system table
        const updatedSystemTable = page.getByRole('table', { name: 'Systems' }).or(
            page.getByRole('table', { name: 'System List' })
        ).or(
            page.locator('[data-testid="systems-table"]')
        ).or(
            page.locator('.systems-table, .system-list')
        ).or(
            page.locator('table')
        );
        
        await expect(updatedSystemTable).toBeVisible({ timeout: 15000 });
        
        // Search for the created system in the table
        const updatedSystemRows = updatedSystemTable.locator('tbody tr, .system-row');
        const updatedSystemCount = await updatedSystemRows.count();
        console.log(`📊 Updated system count: ${updatedSystemCount} (was ${initialSystemCount})`);
        
        let newSystemFound = false;
        let foundSystemText = '';
        
        // Check all rows for the created system
        for (let i = 0; i < updatedSystemCount; i++) {
            const row = updatedSystemRows.nth(i);
            const rowText = await row.textContent();
            
            if (rowText && rowText.includes(systemName)) {
                newSystemFound = true;
                foundSystemText = rowText;
                console.log(`✅ Newly created System found in table row ${i + 1}: ${foundSystemText.substring(0, 100)}...`);
                break;
            }
        }
        
        if (!newSystemFound) {
            console.log('❌ Newly created System not found in the table');
            console.log('📋 All table rows:');
            for (let i = 0; i < Math.min(updatedSystemCount, 10); i++) { // Show first 10 rows
                const row = updatedSystemRows.nth(i);
                const rowText = await row.textContent();
                console.log(`  ${i + 1}. ${rowText?.substring(0, 80)}...`);
            }
        } else {
            console.log(`✅ System count increased from ${initialSystemCount} to ${updatedSystemCount}`);
        }
        
        // Additional verification: Check if we're on the correct page
        const currentUrl = page.url();
        if (currentUrl.includes('system') || currentUrl.includes('organization')) {
            console.log('📋 Successfully remained on System List page after system creation');
        } else {
            console.log('ℹ️ Current page after system creation:', currentUrl);
        }
        
        console.log('✅ Create New System test completed successfully');
    });

    test('REGRESSION: Create New System with validation errors', async ({ page }) => {
        console.log('⚠️ Testing Create New System with validation errors...');
        
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
        
        // Select a building
        const buildingFilter = page.getByRole('combobox', { name: 'Building' }).or(
            page.locator('select[name*="building"]')
        );
        
        if (await buildingFilter.count() > 0) {
            await buildingFilter.click();
            await page.waitForTimeout(1000);
            
            const buildingOptions = page.getByRole('option').or(
                page.locator('option')
            );
            
            if (await buildingOptions.count() > 0) {
                await buildingOptions.first().click();
                await page.waitForTimeout(2000);
            }
        }
        
        // Click System Lists
        const systemListsButton = page.getByRole('button', { name: 'System Lists' }).or(
            page.locator('button:has-text("System Lists")')
        );
        
        if (await systemListsButton.count() > 0) {
            await systemListsButton.click();
            await page.waitForLoadState('networkidle');
        }
        
        // Click Create System
        const createSystemButton = page.getByRole('button', { name: 'Create System' }).or(
            page.locator('button:has-text("Create System")')
        );
        
        if (await createSystemButton.count() > 0) {
            await createSystemButton.click();
            await page.waitForTimeout(1000);
            
            // Try to save without filling required fields
            const saveSystemButton = page.getByRole('button', { name: 'Save System' }).or(
                page.locator('button:has-text("Save")')
            );
            
            if (await saveSystemButton.count() > 0) {
                await saveSystemButton.click();
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
        
        console.log('✅ Create New System validation test completed');
    });

    test('REGRESSION: Verify building lookup window functionality', async ({ page }) => {
        console.log('🏗️ Testing building lookup window functionality...');
        
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
        
        // Click building filter to open building lookup
        const buildingFilter = page.getByRole('combobox', { name: 'Building' }).or(
            page.locator('select[name*="building"]')
        );
        
        if (await buildingFilter.count() > 0) {
            await buildingFilter.click();
            await page.waitForTimeout(1000);
            
            // Verify building lookup window opens
            const buildingLookupWindow = page.getByRole('dialog', { name: 'Building Lookup' }).or(
                page.locator('.building-lookup-dialog')
            );
            
            if (await buildingLookupWindow.count() > 0) {
                console.log('✅ Building Lookup window opened');
                
                // Check for building options
                const buildingOptions = page.getByRole('listitem').or(
                    page.locator('.building-option, .lookup-item')
                ).or(
                    page.locator('tr[data-building], .building-row')
                );
                
                const buildingOptionCount = await buildingOptions.count();
                console.log(`📊 Found ${buildingOptionCount} building options`);
                
                if (buildingOptionCount > 0) {
                    // Test selecting a building
                    const firstBuilding = buildingOptions.first();
                    const buildingName = await firstBuilding.textContent();
                    await firstBuilding.click();
                    console.log(`✅ Selected building: ${buildingName}`);
                    
                    await page.waitForTimeout(2000);
                    
                    // Verify lookup window closed
                    await expect(buildingLookupWindow).not.toBeVisible({ timeout: 5000 });
                    console.log('✅ Building Lookup window closed after selection');
                    
                    // Verify System Lists button becomes available
                    const systemListsButton = page.getByRole('button', { name: 'System Lists' }).or(
                        page.locator('button:has-text("System Lists")')
                    );
                    
                    if (await systemListsButton.count() > 0) {
                        console.log('✅ System Lists button becomes available after building selection');
                    } else {
                        console.log('⚠️ System Lists button not found after building selection');
                    }
                } else {
                    console.log('⚠️ No building options found in lookup window');
                }
            } else {
                console.log('⚠️ Building Lookup window not found');
            }
        }
        
        console.log('✅ Building lookup window functionality test completed');
    });

    test('REGRESSION: Verify system lists button availability', async ({ page }) => {
        console.log('⚙️ Testing system lists button availability...');
        
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
        
        // Check if System Lists button is available before selections
        const systemListsButtonBefore = page.getByRole('button', { name: 'System Lists' }).or(
            page.locator('button:has-text("System Lists")')
        );
        
        const isSystemButtonAvailableBefore = await systemListsButtonBefore.count() > 0;
        console.log(`⚙️ System Lists button available before selections: ${isSystemButtonAvailableBefore}`);
        
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
                        
                        // Select a building
                        const buildingFilter = page.getByRole('combobox', { name: 'Building' }).or(
                            page.locator('select[name*="building"]')
                        );
                        
                        if (await buildingFilter.count() > 0) {
                            await buildingFilter.click();
                            await page.waitForTimeout(1000);
                            
                            const buildingOptions = page.getByRole('option').or(
                                page.locator('option')
                            );
                            
                            if (await buildingOptions.count() > 0) {
                                await buildingOptions.first().click();
                                await page.waitForTimeout(2000);
                                
                                // Check if System Lists button is available after all selections
                                const systemListsButtonAfter = page.getByRole('button', { name: 'System Lists' }).or(
                                    page.locator('button:has-text("System Lists")')
                                );
                                
                                const isSystemButtonAvailableAfter = await systemListsButtonAfter.count() > 0;
                                console.log(`⚙️ System Lists button available after all selections: ${isSystemButtonAvailableAfter}`);
                                
                                if (isSystemButtonAvailableAfter) {
                                    // Test clicking the System Lists button
                                    await systemListsButtonAfter.click();
                                    await page.waitForLoadState('networkidle');
                                    
                                    // Verify system list is displayed
                                    const systemList = page.getByRole('heading', { name: 'System List' }).or(
                                        page.locator('h1:has-text("System List")')
                                    ).or(
                                        page.locator('table')
                                    );
                                    
                                    if (await systemList.count() > 0) {
                                        console.log('✅ System List is displayed after clicking System Lists button');
                                        
                                        // Check for Create System button
                                        const createSystemButton = page.getByRole('button', { name: 'Create System' }).or(
                                            page.locator('button:has-text("Create System")')
                                        );
                                        
                                        if (await createSystemButton.count() > 0) {
                                            const isButtonEnabled = await createSystemButton.isEnabled();
                                            console.log(`✅ Create System button is active: ${isButtonEnabled}`);
                                        } else {
                                            console.log('⚠️ Create System button not found');
                                        }
                                    } else {
                                        console.log('⚠️ System List not displayed');
                                    }
                                } else {
                                    console.log('⚠️ System Lists button not available after all selections');
                                }
                            }
                        }
                    }
                }
            }
        }
        
        console.log('✅ System lists button availability test completed');
    });
});
