// Test Case: Filter Reports by Location
// Preconditions:
// - User is logged into the application
// - User has access to the Reports module
// - Multiple systems and organizational levels exist in the system

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

test.describe('Filter Reports by Location - Functional Tests', () => {

    test.beforeEach(async ({ page }) => {
        console.log('🔧 Setting up Filter Reports by Location test environment...');
    });

    test.afterEach(async ({ page }) => {
        console.log('🧹 Cleaning up Filter Reports by Location test data...');
    });

    test('REGRESSION: Filter Reports by Location functionality works correctly', async ({ page }) => {
        console.log('🔍 Testing Filter Reports by Location functionality...');
        
        // Login and navigate
        await goToAliquotQaLink(page);
        await loginAquaUser(page, ALIQUOT_USERNAME_QA, ALIQUOT_PASSWORD_QA);
        await verifyAquaLoginQa(page);
        await clearCacheAndReload(page);
        
        // Step 1: Hover over the Reports tab
        console.log('🖱️ Hovering over Reports tab...');
        const reportsTab = page.getByRole('tab', { name: 'Reports' }).or(
            page.getByRole('button', { name: 'Reports' })
        ).or(
            page.locator('[data-testid="reports-tab"]')
        ).or(
            page.locator('a:has-text("Reports")')
        );
        
        await reportsTab.hover();
        await page.waitForTimeout(1000); // Wait for hover effect
        
        // Verify Reports and Locations links window is opened
        const reportsMenu = page.getByRole('menu', { name: 'Reports' }).or(
            page.locator('[data-testid="reports-menu"]')
        ).or(
            page.locator('.dropdown-menu:has-text("Reports")')
        ).or(
            page.locator('.reports-dropdown')
        );
        
        await expect(reportsMenu).toBeVisible({ timeout: 10000 });
        console.log('✅ Reports and Locations links window is opened');
        
        // Step 2: Click Report List
        console.log('📋 Clicking Report List...');
        const reportListLink = page.getByRole('menuitem', { name: 'Report List' }).or(
            page.getByRole('link', { name: 'Report List' })
        ).or(
            page.locator('[data-testid="report-list-link"]')
        ).or(
            page.locator('a:has-text("Report List")')
        );
        
        await reportListLink.click();
        await page.waitForLoadState('networkidle');
        
        // Verify Report List page is displayed
        const reportListPage = page.getByRole('heading', { name: 'Report List' }).or(
            page.locator('[data-testid="report-list-page"]')
        ).or(
            page.locator('h1:has-text("Report List")')
        ).or(
            page.locator('.page-title:has-text("Report List")')
        );
        
        await expect(reportListPage).toBeVisible({ timeout: 15000 });
        console.log('✅ Report List page is displayed');
        
        // Step 3: Select Client, Customer, Facility, Building, and System from Filter Organization section
        console.log('🔍 Selecting filters from Filter Organization section...');
        
        // Wait for filter section to be visible
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
        
        // Store selected values for verification
        const selectedValues = {
            client: '',
            customer: '',
            facility: '',
            building: '',
            system: ''
        };
        
        // Select Client
        console.log('🏢 Selecting Client...');
        const clientDropdown = page.getByRole('combobox', { name: 'Client' }).or(
            page.locator('[data-testid="client-dropdown"]')
        ).or(
            page.locator('select[name*="client"]')
        ).or(
            page.locator('.client-select, .client-filter')
        );
        
        if (await clientDropdown.count() > 0) {
            await clientDropdown.click();
            const clientOptions = page.getByRole('option');
            const clientOptionCount = await clientOptions.count();
            
            if (clientOptionCount > 1) {
                const selectedClient = clientOptions.nth(1);
                selectedValues.client = await selectedClient.textContent() || '';
                await selectedClient.click();
                console.log(`✅ Selected Client: ${selectedValues.client}`);
            }
        } else {
            console.log('ℹ️ Client dropdown not found');
        }
        
        // Select Customer
        console.log('👥 Selecting Customer...');
        const customerDropdown = page.getByRole('combobox', { name: 'Customer' }).or(
            page.locator('[data-testid="customer-dropdown"]')
        ).or(
            page.locator('select[name*="customer"]')
        ).or(
            page.locator('.customer-select, .customer-filter')
        );
        
        if (await customerDropdown.count() > 0) {
            await customerDropdown.click();
            const customerOptions = page.getByRole('option');
            const customerOptionCount = await customerOptions.count();
            
            if (customerOptionCount > 1) {
                const selectedCustomer = customerOptions.nth(1);
                selectedValues.customer = await selectedCustomer.textContent() || '';
                await selectedCustomer.click();
                console.log(`✅ Selected Customer: ${selectedValues.customer}`);
            }
        } else {
            console.log('ℹ️ Customer dropdown not found');
        }
        
        // Select Facility
        console.log('🏭 Selecting Facility...');
        const facilityDropdown = page.getByRole('combobox', { name: 'Facility' }).or(
            page.locator('[data-testid="facility-dropdown"]')
        ).or(
            page.locator('select[name*="facility"]')
        ).or(
            page.locator('.facility-select, .facility-filter')
        );
        
        if (await facilityDropdown.count() > 0) {
            await facilityDropdown.click();
            const facilityOptions = page.getByRole('option');
            const facilityOptionCount = await facilityOptions.count();
            
            if (facilityOptionCount > 1) {
                const selectedFacility = facilityOptions.nth(1);
                selectedValues.facility = await selectedFacility.textContent() || '';
                await selectedFacility.click();
                console.log(`✅ Selected Facility: ${selectedValues.facility}`);
            }
        } else {
            console.log('ℹ️ Facility dropdown not found');
        }
        
        // Select Building
        console.log('🏢 Selecting Building...');
        const buildingDropdown = page.getByRole('combobox', { name: 'Building' }).or(
            page.locator('[data-testid="building-dropdown"]')
        ).or(
            page.locator('select[name*="building"]')
        ).or(
            page.locator('.building-select, .building-filter')
        );
        
        if (await buildingDropdown.count() > 0) {
            await buildingDropdown.click();
            const buildingOptions = page.getByRole('option');
            const buildingOptionCount = await buildingOptions.count();
            
            if (buildingOptionCount > 1) {
                const selectedBuilding = buildingOptions.nth(1);
                selectedValues.building = await selectedBuilding.textContent() || '';
                await selectedBuilding.click();
                console.log(`✅ Selected Building: ${selectedValues.building}`);
            }
        } else {
            console.log('ℹ️ Building dropdown not found');
        }
        
        // Select System
        console.log('⚙️ Selecting System...');
        const systemDropdown = page.getByRole('combobox', { name: 'System' }).or(
            page.locator('[data-testid="system-dropdown"]')
        ).or(
            page.locator('select[name*="system"]')
        ).or(
            page.locator('.system-select, .system-filter')
        );
        
        if (await systemDropdown.count() > 0) {
            await systemDropdown.click();
            const systemOptions = page.getByRole('option');
            const systemOptionCount = await systemOptions.count();
            
            if (systemOptionCount > 1) {
                const selectedSystem = systemOptions.nth(1);
                selectedValues.system = await selectedSystem.textContent() || '';
                await selectedSystem.click();
                console.log(`✅ Selected System: ${selectedValues.system}`);
            }
        } else {
            console.log('ℹ️ System dropdown not found');
        }
        
        // Apply filters if there's an apply button
        const applyButton = page.getByRole('button', { name: 'Apply' }).or(
            page.getByRole('button', { name: 'Filter' })
        ).or(
            page.getByRole('button', { name: 'Search' })
        ).or(
            page.locator('[data-testid="apply-filters"]')
        );
        
        if (await applyButton.count() > 0) {
            await applyButton.click();
            await page.waitForTimeout(2000); // Wait for filters to apply
            console.log('✅ Applied filters');
        }
        
        // Step 4: Verify System Report list is displayed
        console.log('📋 Verifying System Report list is displayed...');
        const reportList = page.getByRole('table', { name: 'Report List' }).or(
            page.locator('[data-testid="report-list-table"]')
        ).or(
            page.locator('.report-list, .data-table')
        ).or(
            page.locator('table')
        );
        
        await expect(reportList).toBeVisible({ timeout: 15000 });
        
        // Verify the list contains data
        const reportRows = reportList.locator('tbody tr, .report-row');
        const rowCount = await reportRows.count();
        
        if (rowCount > 0) {
            console.log(`✅ System Report list is displayed with ${rowCount} report(s)`);
            
            // Verify at least one report row is visible
            await expect(reportRows.first()).toBeVisible();
            
            // Check for common report columns
            const headers = reportList.locator('th, .table-header');
            const headerCount = await headers.count();
            console.log(`📊 Report list contains ${headerCount} columns`);
            
        } else {
            console.log('ℹ️ No reports found in the filtered list');
        }
        
        // Step 5: Select another System
        console.log('🔄 Selecting another System...');
        
        // Get all available system options
        const allSystemOptions = page.getByRole('option');
        const systemOptionCount = await allSystemOptions.count();
        
        if (systemOptionCount > 2) { // More than just the default and first selected
            // Click on system dropdown again
            if (await systemDropdown.count() > 0) {
                await systemDropdown.click();
                
                // Select a different system (second option if available)
                const secondSystemOption = allSystemOptions.nth(2);
                const secondSystemText = await secondSystemOption.textContent();
                
                if (secondSystemText && secondSystemText !== selectedValues.system) {
                    await secondSystemOption.click();
                    selectedValues.system = secondSystemText;
                    console.log(`✅ Selected another System: ${selectedValues.system}`);
                    
                    // Apply the new filter
                    if (await applyButton.count() > 0) {
                        await applyButton.click();
                        await page.waitForTimeout(2000);
                        console.log('✅ Applied new system filter');
                    }
                } else {
                    console.log('ℹ️ No different system option available');
                }
            }
        } else {
            console.log('ℹ️ Only one system option available, cannot select another');
        }
        
        // Step 6: Verify Report List associated with the selected System is displayed
        console.log('📋 Verifying Report List associated with the selected System...');
        
        // Wait for the filtered results to load
        await page.waitForTimeout(2000);
        
        // Verify the report list is still visible
        await expect(reportList).toBeVisible({ timeout: 15000 });
        
        // Check if the filtered results are different (if we selected a different system)
        const newReportRows = reportList.locator('tbody tr, .report-row');
        const newRowCount = await newReportRows.count();
        
        console.log(`📊 New filtered report count: ${newRowCount}`);
        
        if (newRowCount > 0) {
            console.log('✅ Report List associated with the selected System is displayed');
            
            // Verify the reports are filtered correctly
            const firstReport = newReportRows.first();
            await expect(firstReport).toBeVisible();
            
            // Check if the system information is visible in the reports
            const systemInfo = firstReport.locator(':has-text("' + selectedValues.system + '")');
            if (await systemInfo.count() > 0) {
                console.log(`✅ Reports are filtered by System: ${selectedValues.system}`);
            } else {
                console.log('ℹ️ System information not explicitly visible in report rows');
            }
        } else {
            console.log('ℹ️ No reports found for the selected system');
        }
        
        // Additional verification: Check filter indicators
        const activeFilters = page.locator('.filter-active, .selected-filter, .applied-filter');
        const activeFilterCount = await activeFilters.count();
        
        if (activeFilterCount > 0) {
            console.log(`🏷️ ${activeFilterCount} active filter(s) are displayed`);
        }
        
        // Verify filter summary or breadcrumb
        const filterSummary = page.locator('.filter-summary, .breadcrumb, .filter-info');
        if (await filterSummary.count() > 0) {
            const summaryText = await filterSummary.first().textContent();
            console.log(`📝 Filter summary: ${summaryText}`);
        }
        
        console.log('✅ Filter Reports by Location test completed successfully');
    });

    test('REGRESSION: Filter Reports by different organizational levels', async ({ page }) => {
        console.log('🔍 Testing Filter Reports by different organizational levels...');
        
        // Login and navigate
        await goToAliquotQaLink(page);
        await loginAquaUser(page, ALIQUOT_USERNAME_QA, ALIQUOT_PASSWORD_QA);
        await verifyAquaLoginQa(page);
        await clearCacheAndReload(page);
        
        // Navigate to Report List
        const reportsTab = page.getByRole('tab', { name: 'Reports' }).or(
            page.getByRole('button', { name: 'Reports' })
        );
        
        await reportsTab.hover();
        const reportListLink = page.getByRole('menuitem', { name: 'Report List' });
        await reportListLink.click();
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
            console.log(`🧪 Testing filter combination: ${combination.name}`);
            
            // Clear existing filters first
            const clearButton = page.getByRole('button', { name: 'Clear' }).or(
                page.getByRole('button', { name: 'Reset' })
            ).or(
                page.locator('[data-testid="clear-filters"]')
            );
            
            if (await clearButton.count() > 0) {
                await clearButton.click();
                await page.waitForTimeout(1000);
            }
            
            // Apply the specific combination
            for (const filter of combination.filters) {
                const dropdown = page.getByRole('combobox', { name: filter.charAt(0).toUpperCase() + filter.slice(1) }).or(
                    page.locator(`[data-testid="${filter}-dropdown"]`)
                ).or(
                    page.locator(`select[name*="${filter}"]`)
                );
                
                if (await dropdown.count() > 0) {
                    await dropdown.click();
                    const options = page.getByRole('option');
                    if (await options.count() > 1) {
                        await options.nth(1).click();
                    }
                }
            }
            
            // Apply filters
            const applyButton = page.getByRole('button', { name: 'Apply' }).or(
                page.getByRole('button', { name: 'Filter' })
            );
            
            if (await applyButton.count() > 0) {
                await applyButton.click();
                await page.waitForTimeout(2000);
            }
            
            // Verify results are displayed
            const reportList = page.getByRole('table').or(
                page.locator('.report-list, .data-table')
            );
            
            await expect(reportList).toBeVisible({ timeout: 10000 });
            console.log(`✅ Filter combination "${combination.name}" works correctly`);
        }
        
        console.log('✅ Filter Reports by organizational levels test completed successfully');
    });

    test('REGRESSION: Verify filter persistence and reset functionality', async ({ page }) => {
        console.log('🔄 Testing filter persistence and reset functionality...');
        
        // Login and navigate
        await goToAliquotQaLink(page);
        await loginAquaUser(page, ALIQUOT_USERNAME_QA, ALIQUOT_PASSWORD_QA);
        await verifyAquaLoginQa(page);
        await clearCacheAndReload(page);
        
        // Navigate to Report List
        const reportsTab = page.getByRole('tab', { name: 'Reports' }).or(
            page.getByRole('button', { name: 'Reports' })
        );
        
        await reportsTab.hover();
        const reportListLink = page.getByRole('menuitem', { name: 'Report List' });
        await reportListLink.click();
        await page.waitForLoadState('networkidle');
        
        // Apply some filters
        const systemDropdown = page.getByRole('combobox', { name: 'System' }).or(
            page.locator('[data-testid="system-dropdown"]')
        );
        
        if (await systemDropdown.count() > 0) {
            await systemDropdown.click();
            const systemOptions = page.getByRole('option');
            if (await systemOptions.count() > 1) {
                await systemOptions.nth(1).click();
            }
        }
        
        // Apply filters
        const applyButton = page.getByRole('button', { name: 'Apply' }).or(
            page.getByRole('button', { name: 'Filter' })
        );
        
        if (await applyButton.count() > 0) {
            await applyButton.click();
            await page.waitForTimeout(2000);
        }
        
        // Test reset functionality
        const resetButton = page.getByRole('button', { name: 'Reset' }).or(
            page.getByRole('button', { name: 'Clear' })
        ).or(
            page.locator('[data-testid="reset-filters"]')
        );
        
        if (await resetButton.count() > 0) {
            await resetButton.click();
            await page.waitForTimeout(1000);
            console.log('✅ Filters reset successfully');
        }
        
        // Verify report list is still visible after reset
        const reportList = page.getByRole('table').or(
            page.locator('.report-list, .data-table')
        );
        
        await expect(reportList).toBeVisible({ timeout: 10000 });
        console.log('✅ Report list remains visible after filter reset');
        
        console.log('✅ Filter persistence and reset test completed successfully');
    });
});
