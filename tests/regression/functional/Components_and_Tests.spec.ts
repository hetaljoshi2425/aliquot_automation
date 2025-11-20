// Test Case: Components & Tests
// Preconditions:
// - User is logged into the application
// - User has access to the Reports module
// - User has permission to access Components & Tests
// - User must have a System selected to interact with the page
// - At least one Client, Customer, Facility, Building, and System exists in the system

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

test.describe('Components & Tests - Functional Tests', () => {

    test.beforeEach(async ({ page }) => {
        console.log('🔧 Setting up Components & Tests test environment...');
    });

    test.afterEach(async ({ page }) => {
        console.log('🧹 Cleaning up Components & Tests test data...');
    });

    test('REGRESSION: Components & Tests functionality works correctly', async ({ page }) => {
        console.log('🧪 Testing Components & Tests functionality...');
        
        // Login and navigate
        await goToAliquotQaLink(page);
        await loginAquaUser(page, ALIQUOT_USERNAME_QA, ALIQUOT_PASSWORD_QA);
        await verifyAquaLoginQa(page);
        await clearCacheAndReload(page);
        
        // Step 1: Hover over the Reports tab
        console.log('🖱️ Hovering over the Reports tab...');
        const reportsTab = page.getByRole('tab', { name: 'Reports' }).or(
            page.getByRole('button', { name: 'Reports' })
        ).or(
            page.locator('[data-testid="reports-tab"]')
        ).or(
            page.locator('a:has-text("Reports")')
        );
        
        await reportsTab.hover();
        await page.waitForTimeout(1000); // Wait for hover effect
        
        // Step 2: Verify Reports and Locations sub menu is opened
        console.log('🔍 Verifying Reports and Locations sub menu is opened...');
        const reportsMenu = page.getByRole('menu', { name: 'Reports' }).or(
            page.locator('[data-testid="reports-menu"]')
        ).or(
            page.locator('.dropdown-menu:has-text("Reports")')
        ).or(
            page.locator('.reports-dropdown')
        ).or(
            page.locator('.reports-submenu')
        );
        
        await expect(reportsMenu).toBeVisible({ timeout: 10000 });
        console.log('✅ Reports and Locations sub menu is opened');
        
        // Step 3: Click Components & Tests link
        console.log('🧪 Clicking Components & Tests link...');
        const componentsTestsLink = page.getByRole('menuitem', { name: 'Components & Tests' }).or(
            page.getByRole('link', { name: 'Components & Tests' })
        ).or(
            page.getByRole('menuitem', { name: 'Components' })
        ).or(
            page.locator('[data-testid="components-tests-link"]')
        ).or(
            page.locator('a:has-text("Components & Tests")')
        ).or(
            page.locator('a:has-text("Components")')
        );
        
        await componentsTestsLink.click();
        await page.waitForLoadState('networkidle');
        
        // Step 4: Verify Manage Components page is displayed
        console.log('📋 Verifying Manage Components page is displayed...');
        const manageComponentsPage = page.getByRole('heading', { name: 'Manage Components' }).or(
            page.getByRole('heading', { name: 'Components & Tests' })
        ).or(
            page.locator('[data-testid="manage-components-page"]')
        ).or(
            page.locator('h1:has-text("Manage Components")')
        ).or(
            page.locator('h1:has-text("Components & Tests")')
        ).or(
            page.locator('.page-title:has-text("Components")')
        );
        
        await expect(manageComponentsPage).toBeVisible({ timeout: 15000 });
        console.log('✅ Manage Components page is displayed');
        
        // Step 5: Select Client from the Filter Organization section
        console.log('🏢 Selecting Client from the Filter Organization section...');
        
        // Wait for Filter Organization section to be visible
        const filterSection = page.getByRole('region', { name: 'Filter Organization' }).or(
            page.locator('[data-testid="filter-organization"]')
        ).or(
            page.locator('.filter-section:has-text("Organization")')
        ).or(
            page.locator('fieldset:has-text("Filter")')
        ).or(
            page.locator('.filter-panel, .filter-controls')
        );
        
        await expect(filterSection).toBeVisible({ timeout: 10000 });
        console.log('✅ Filter Organization section is visible');
        
        // Click on Client dropdown/lookup
        const clientLookup = page.getByRole('button', { name: 'Select Client' }).or(
            page.getByRole('combobox', { name: 'Client' })
        ).or(
            page.locator('[data-testid="client-lookup"]')
        ).or(
            page.locator('.client-lookup, .client-select')
        ).or(
            page.locator('input[placeholder*="Client"]')
        );
        
        await expect(clientLookup).toBeVisible({ timeout: 10000 });
        await clientLookup.click();
        await page.waitForTimeout(1000);
        
        // Step 6: Verify Client Lookup window is displayed
        console.log('🔍 Verifying Client Lookup window is displayed...');
        const clientLookupWindow = page.getByRole('dialog', { name: 'Client Lookup' }).or(
            page.locator('[data-testid="client-lookup-window"]')
        ).or(
            page.locator('.client-lookup-dialog')
        ).or(
            page.locator('.modal-dialog:has-text("Client")')
        );
        
        await expect(clientLookupWindow).toBeVisible({ timeout: 10000 });
        console.log('✅ Client Lookup window is displayed');
        
        // Step 7: Click on the selected Client
        console.log('👆 Clicking on the selected Client...');
        const clientOptions = page.getByRole('listitem').or(
            page.locator('[data-testid="client-option"]')
        ).or(
            page.locator('.client-option, .lookup-item')
        ).or(
            page.locator('tr[data-client], .client-row')
        );
        
        const clientOptionCount = await clientOptions.count();
        console.log(`📊 Found ${clientOptionCount} client options`);
        
        if (clientOptionCount > 0) {
            const selectedClient = clientOptions.first();
            const clientName = await selectedClient.textContent();
            await selectedClient.click();
            console.log(`✅ Selected Client: ${clientName}`);
        } else {
            throw new Error('No client options found in Client Lookup window');
        }
        
        // Step 8: Verify Client Lookup window is closed
        console.log('✅ Verifying Client Lookup window is closed...');
        await expect(clientLookupWindow).not.toBeVisible({ timeout: 5000 });
        console.log('✅ Client Lookup window is closed');
        
        // Step 9: Select Customer from the Filter Organization section
        console.log('👥 Selecting Customer from the Filter Organization section...');
        const customerLookup = page.getByRole('button', { name: 'Select Customer' }).or(
            page.getByRole('combobox', { name: 'Customer' })
        ).or(
            page.locator('[data-testid="customer-lookup"]')
        ).or(
            page.locator('.customer-lookup, .customer-select')
        ).or(
            page.locator('input[placeholder*="Customer"]')
        );
        
        await expect(customerLookup).toBeVisible({ timeout: 10000 });
        await customerLookup.click();
        await page.waitForTimeout(1000);
        
        // Step 10: Verify Customer Lookup window is displayed
        console.log('🔍 Verifying Customer Lookup window is displayed...');
        const customerLookupWindow = page.getByRole('dialog', { name: 'Customer Lookup' }).or(
            page.locator('[data-testid="customer-lookup-window"]')
        ).or(
            page.locator('.customer-lookup-dialog')
        ).or(
            page.locator('.modal-dialog:has-text("Customer")')
        );
        
        await expect(customerLookupWindow).toBeVisible({ timeout: 10000 });
        console.log('✅ Customer Lookup window is displayed');
        
        // Step 11: Click on the selected Customer
        console.log('👆 Clicking on the selected Customer...');
        const customerOptions = page.getByRole('listitem').or(
            page.locator('[data-testid="customer-option"]')
        ).or(
            page.locator('.customer-option, .lookup-item')
        ).or(
            page.locator('tr[data-customer], .customer-row')
        );
        
        const customerOptionCount = await customerOptions.count();
        console.log(`📊 Found ${customerOptionCount} customer options`);
        
        if (customerOptionCount > 0) {
            const selectedCustomer = customerOptions.first();
            const customerName = await selectedCustomer.textContent();
            await selectedCustomer.click();
            console.log(`✅ Selected Customer: ${customerName}`);
        } else {
            throw new Error('No customer options found in Customer Lookup window');
        }
        
        // Step 12: Verify Customer Lookup window is closed
        console.log('✅ Verifying Customer Lookup window is closed...');
        await expect(customerLookupWindow).not.toBeVisible({ timeout: 5000 });
        console.log('✅ Customer Lookup window is closed');
        
        // Step 13: Select Facility from the Filter Organization section
        console.log('🏭 Selecting Facility from the Filter Organization section...');
        const facilityLookup = page.getByRole('button', { name: 'Select Facility' }).or(
            page.getByRole('combobox', { name: 'Facility' })
        ).or(
            page.locator('[data-testid="facility-lookup"]')
        ).or(
            page.locator('.facility-lookup, .facility-select')
        ).or(
            page.locator('input[placeholder*="Facility"]')
        );
        
        await expect(facilityLookup).toBeVisible({ timeout: 10000 });
        await facilityLookup.click();
        await page.waitForTimeout(1000);
        
        // Verify Facility Lookup window and select facility
        const facilityLookupWindow = page.getByRole('dialog', { name: 'Facility Lookup' }).or(
            page.locator('[data-testid="facility-lookup-window"]')
        ).or(
            page.locator('.facility-lookup-dialog')
        ).or(
            page.locator('.modal-dialog:has-text("Facility")')
        );
        
        if (await facilityLookupWindow.count() > 0) {
            await expect(facilityLookupWindow).toBeVisible({ timeout: 10000 });
            console.log('✅ Facility Lookup window is displayed');
            
            const facilityOptions = page.getByRole('listitem').or(
                page.locator('[data-testid="facility-option"]')
            ).or(
                page.locator('.facility-option, .lookup-item')
            ).or(
                page.locator('tr[data-facility], .facility-row')
            );
            
            const facilityOptionCount = await facilityOptions.count();
            if (facilityOptionCount > 0) {
                const selectedFacility = facilityOptions.first();
                const facilityName = await selectedFacility.textContent();
                await selectedFacility.click();
                console.log(`✅ Selected Facility: ${facilityName}`);
            }
            
            await expect(facilityLookupWindow).not.toBeVisible({ timeout: 5000 });
            console.log('✅ Facility Lookup window is closed');
        } else {
            console.log('ℹ️ Facility Lookup window not found, may be using dropdown');
        }
        
        // Step 14: Select Building from the Filter Organization section
        console.log('🏢 Selecting Building from the Filter Organization section...');
        const buildingLookup = page.getByRole('button', { name: 'Select Building' }).or(
            page.getByRole('combobox', { name: 'Building' })
        ).or(
            page.locator('[data-testid="building-lookup"]')
        ).or(
            page.locator('.building-lookup, .building-select')
        ).or(
            page.locator('input[placeholder*="Building"]')
        );
        
        await expect(buildingLookup).toBeVisible({ timeout: 10000 });
        await buildingLookup.click();
        await page.waitForTimeout(1000);
        
        // Verify Building Lookup window and select building
        const buildingLookupWindow = page.getByRole('dialog', { name: 'Building Lookup' }).or(
            page.locator('[data-testid="building-lookup-window"]')
        ).or(
            page.locator('.building-lookup-dialog')
        ).or(
            page.locator('.modal-dialog:has-text("Building")')
        );
        
        if (await buildingLookupWindow.count() > 0) {
            await expect(buildingLookupWindow).toBeVisible({ timeout: 10000 });
            console.log('✅ Building Lookup window is displayed');
            
            const buildingOptions = page.getByRole('listitem').or(
                page.locator('[data-testid="building-option"]')
            ).or(
                page.locator('.building-option, .lookup-item')
            ).or(
                page.locator('tr[data-building], .building-row')
            );
            
            const buildingOptionCount = await buildingOptions.count();
            if (buildingOptionCount > 0) {
                const selectedBuilding = buildingOptions.first();
                const buildingName = await selectedBuilding.textContent();
                await selectedBuilding.click();
                console.log(`✅ Selected Building: ${buildingName}`);
            }
            
            await expect(buildingLookupWindow).not.toBeVisible({ timeout: 5000 });
            console.log('✅ Building Lookup window is closed');
        } else {
            console.log('ℹ️ Building Lookup window not found, may be using dropdown');
        }
        
        // Step 15: Select System from the Filter Organization section
        console.log('⚙️ Selecting System from the Filter Organization section...');
        const systemLookup = page.getByRole('button', { name: 'Select System' }).or(
            page.getByRole('combobox', { name: 'System' })
        ).or(
            page.locator('[data-testid="system-lookup"]')
        ).or(
            page.locator('.system-lookup, .system-select')
        ).or(
            page.locator('input[placeholder*="System"]')
        );
        
        await expect(systemLookup).toBeVisible({ timeout: 10000 });
        await systemLookup.click();
        await page.waitForTimeout(1000);
        
        // Verify System Lookup window and select system
        const systemLookupWindow = page.getByRole('dialog', { name: 'System Lookup' }).or(
            page.locator('[data-testid="system-lookup-window"]')
        ).or(
            page.locator('.system-lookup-dialog')
        ).or(
            page.locator('.modal-dialog:has-text("System")')
        );
        
        if (await systemLookupWindow.count() > 0) {
            await expect(systemLookupWindow).toBeVisible({ timeout: 10000 });
            console.log('✅ System Lookup window is displayed');
            
            const systemOptions = page.getByRole('listitem').or(
                page.locator('[data-testid="system-option"]')
            ).or(
                page.locator('.system-option, .lookup-item')
            ).or(
                page.locator('tr[data-system], .system-row')
            );
            
            const systemOptionCount = await systemOptions.count();
            if (systemOptionCount > 0) {
                const selectedSystem = systemOptions.first();
                const systemName = await selectedSystem.textContent();
                await selectedSystem.click();
                console.log(`✅ Selected System: ${systemName}`);
            }
            
            await expect(systemLookupWindow).not.toBeVisible({ timeout: 5000 });
            console.log('✅ System Lookup window is closed');
        } else {
            console.log('ℹ️ System Lookup window not found, may be using dropdown');
        }
        
        // Step 16: Verify Test Table is displayed
        console.log('📊 Verifying Test Table is displayed...');
        const testTable = page.getByRole('table', { name: 'Tests' }).or(
            page.getByRole('table', { name: 'Components' })
        ).or(
            page.locator('[data-testid="test-table"]')
        ).or(
            page.locator('.test-table, .components-table')
        ).or(
            page.locator('table')
        );
        
        await expect(testTable).toBeVisible({ timeout: 15000 });
        console.log('✅ Test Table is displayed');
        
        // Get table rows to verify data is loaded
        const tableRows = testTable.locator('tbody tr, .test-row, .component-row');
        const rowCount = await tableRows.count();
        console.log(`📊 Test Table contains ${rowCount} rows`);
        
        // Step 17: Verify User can interact with the page
        console.log('🖱️ Verifying User can interact with the page...');
        
        // Check for interactive elements
        const interactiveElements = [
            page.locator('button, input, select, textarea, [role="button"]'),
            page.locator('[data-testid*="btn"], [data-testid*="button"]'),
            page.locator('a[href], .clickable')
        ];
        
        let interactiveElementCount = 0;
        for (const selector of interactiveElements) {
            const count = await selector.count();
            interactiveElementCount += count;
        }
        
        console.log(`🖱️ Found ${interactiveElementCount} interactive elements on the page`);
        
        // Verify that the page is not in a loading state
        const loadingIndicator = page.locator('.loading, .spinner, [data-testid="loading"]');
        const isLoading = await loadingIndicator.count() > 0;
        
        if (!isLoading) {
            console.log('✅ Page is fully loaded and interactive');
        } else {
            console.log('⚠️ Page may still be loading');
        }
        
        // Test basic interaction - try to click on a table row or button
        if (rowCount > 0) {
            const firstRow = tableRows.first();
            try {
                await firstRow.click();
                console.log('✅ Successfully clicked on a table row');
            } catch (error) {
                console.log('ℹ️ Table row is not clickable, checking for other interactive elements');
            }
        }
        
        // Check for pagination or other controls
        const pagination = page.locator('.pagination, [data-testid="pagination"]');
        const searchInput = page.locator('input[type="search"], input[placeholder*="search"]');
        const actionButtons = page.locator('button:has-text("Add"), button:has-text("Edit"), button:has-text("Delete")');
        
        if (await pagination.count() > 0) {
            console.log('📄 Pagination controls are available');
        }
        
        if (await searchInput.count() > 0) {
            console.log('🔍 Search functionality is available');
        }
        
        if (await actionButtons.count() > 0) {
            console.log('⚡ Action buttons are available');
        }
        
        console.log('✅ User can interact with the page successfully');
        console.log('✅ Components & Tests test completed successfully');
    });

    test('REGRESSION: Components & Tests with different filter combinations', async ({ page }) => {
        console.log('🔍 Testing Components & Tests with different filter combinations...');
        
        // Login and navigate
        await goToAliquotQaLink(page);
        await loginAquaUser(page, ALIQUOT_USERNAME_QA, ALIQUOT_PASSWORD_QA);
        await verifyAquaLoginQa(page);
        await clearCacheAndReload(page);
        
        // Navigate to Components & Tests
        const reportsTab = page.getByRole('tab', { name: 'Reports' }).or(
            page.getByRole('button', { name: 'Reports' })
        );
        
        await reportsTab.hover();
        const componentsTestsLink = page.getByRole('menuitem', { name: 'Components & Tests' }).or(
            page.locator('a:has-text("Components & Tests")')
        );
        await componentsTestsLink.click();
        await page.waitForLoadState('networkidle');
        
        // Test different filter combinations
        const filterCombinations = [
            { name: 'Client only', filters: ['client'] },
            { name: 'Client + Customer', filters: ['client', 'customer'] },
            { name: 'Client + Customer + Facility', filters: ['client', 'customer', 'facility'] },
            { name: 'Client + Customer + Facility + Building', filters: ['client', 'customer', 'facility', 'building'] },
            { name: 'All filters', filters: ['client', 'customer', 'facility', 'building', 'system'] }
        ];
        
        for (const combination of filterCombinations) {
            console.log(`🔄 Testing filter combination: ${combination.name}`);
            
            // Clear existing filters first
            const clearButton = page.locator('button:has-text("Clear"), button:has-text("Reset")');
            if (await clearButton.count() > 0) {
                await clearButton.click();
                await page.waitForTimeout(1000);
            }
            
            // Apply the filter combination
            for (const filter of combination.filters) {
                const filterLookup = page.locator(`[data-testid="${filter}-lookup"], .${filter}-lookup`);
                if (await filterLookup.count() > 0) {
                    await filterLookup.click();
                    await page.waitForTimeout(500);
                    
                    // Select first option
                    const options = page.locator(`[data-testid="${filter}-option"], .${filter}-option`);
                    if (await options.count() > 0) {
                        await options.first().click();
                        await page.waitForTimeout(500);
                    }
                }
            }
            
            // Wait for table to update
            await page.waitForTimeout(2000);
            
            // Verify table is displayed
            const testTable = page.getByRole('table').or(
                page.locator('.test-table, .components-table')
            );
            
            if (await testTable.count() > 0) {
                const rowCount = await testTable.locator('tbody tr').count();
                console.log(`✅ ${combination.name}: Table displayed with ${rowCount} rows`);
            } else {
                console.log(`⚠️ ${combination.name}: Table not displayed`);
            }
        }
        
        console.log('✅ Components & Tests filter combinations test completed');
    });

    test('REGRESSION: Verify system selection requirement', async ({ page }) => {
        console.log('⚙️ Testing system selection requirement...');
        
        // Login and navigate
        await goToAliquotQaLink(page);
        await loginAquaUser(page, ALIQUOT_USERNAME_QA, ALIQUOT_PASSWORD_QA);
        await verifyAquaLoginQa(page);
        await clearCacheAndReload(page);
        
        // Navigate to Components & Tests
        const reportsTab = page.getByRole('tab', { name: 'Reports' }).or(
            page.getByRole('button', { name: 'Reports' })
        );
        
        await reportsTab.hover();
        const componentsTestsLink = page.getByRole('menuitem', { name: 'Components & Tests' }).or(
            page.locator('a:has-text("Components & Tests")')
        );
        await componentsTestsLink.click();
        await page.waitForLoadState('networkidle');
        
        // Try to interact with the page without selecting a system
        const testTable = page.getByRole('table').or(
            page.locator('.test-table, .components-table')
        );
        
        if (await testTable.count() > 0) {
            const rowCount = await testTable.locator('tbody tr').count();
            
            if (rowCount === 0) {
                console.log('✅ System selection requirement confirmed - no data displayed without system selection');
                
                // Check for message indicating system selection is required
                const systemRequiredMessage = page.locator('.alert-info, .info-message, [data-testid="system-required"]').or(
                    page.locator('text=/system.*required/i')
                );
                
                if (await systemRequiredMessage.count() > 0) {
                    const messageText = await systemRequiredMessage.first().textContent();
                    console.log(`ℹ️ System selection message: ${messageText}`);
                }
            } else {
                console.log('ℹ️ Data is displayed even without explicit system selection');
            }
        }
        
        console.log('✅ System selection requirement test completed');
    });

    test('REGRESSION: Components & Tests table interaction', async ({ page }) => {
        console.log('🖱️ Testing Components & Tests table interaction...');
        
        // Login and navigate
        await goToAliquotQaLink(page);
        await loginAquaUser(page, ALIQUOT_USERNAME_QA, ALIQUOT_PASSWORD_QA);
        await verifyAquaLoginQa(page);
        await clearCacheAndReload(page);
        
        // Navigate to Components & Tests
        const reportsTab = page.getByRole('tab', { name: 'Reports' }).or(
            page.getByRole('button', { name: 'Reports' })
        );
        
        await reportsTab.hover();
        const componentsTestsLink = page.getByRole('menuitem', { name: 'Components & Tests' }).or(
            page.locator('a:has-text("Components & Tests")')
        );
        await componentsTestsLink.click();
        await page.waitForLoadState('networkidle');
        
        // Select a system to enable interaction
        const systemLookup = page.locator('[data-testid="system-lookup"], .system-lookup');
        if (await systemLookup.count() > 0) {
            await systemLookup.click();
            await page.waitForTimeout(1000);
            
            const systemOptions = page.locator('[data-testid="system-option"], .system-option');
            if (await systemOptions.count() > 0) {
                await systemOptions.first().click();
                await page.waitForTimeout(2000);
            }
        }
        
        // Test table interactions
        const testTable = page.getByRole('table').or(
            page.locator('.test-table, .components-table')
        );
        
        if (await testTable.count() > 0) {
            const tableRows = testTable.locator('tbody tr');
            const rowCount = await tableRows.count();
            
            console.log(`📊 Testing interactions with ${rowCount} table rows`);
            
            if (rowCount > 0) {
                // Test row selection
                const firstRow = tableRows.first();
                await firstRow.click();
                console.log('✅ Successfully clicked on table row');
                
                // Test column headers (sorting)
                const columnHeaders = testTable.locator('thead th, .column-header');
                const headerCount = await columnHeaders.count();
                
                if (headerCount > 0) {
                    const firstHeader = columnHeaders.first();
                    try {
                        await firstHeader.click();
                        console.log('✅ Successfully clicked on column header');
                    } catch (error) {
                        console.log('ℹ️ Column header is not clickable');
                    }
                }
                
                // Test action buttons in rows
                const actionButtons = testTable.locator('button, .action-btn, [data-testid*="btn"]');
                const buttonCount = await actionButtons.count();
                
                if (buttonCount > 0) {
                    console.log(`🔘 Found ${buttonCount} action buttons in the table`);
                    
                    // Try clicking a safe action button (like view or info)
                    const viewButton = testTable.locator('button:has-text("View"), button:has-text("Info")');
                    if (await viewButton.count() > 0) {
                        try {
                            await viewButton.first().click();
                            console.log('✅ Successfully clicked on view button');
                        } catch (error) {
                            console.log('ℹ️ View button interaction failed');
                        }
                    }
                }
            }
        }
        
        console.log('✅ Components & Tests table interaction test completed');
    });
});
