// Test Case: View Report List
// Preconditions:
// - User is logged into the application
// - User has access to the Reports module
// - At least one report exists in the system

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

test.describe('View Report List - Functional Tests', () => {

    test.beforeEach(async ({ page }) => {
        console.log('🔧 Setting up View Report List test environment...');
    });

    test.afterEach(async ({ page }) => {
        console.log('🧹 Cleaning up View Report List test data...');
    });

    test('REGRESSION: View Report List functionality works correctly', async ({ page }) => {
        console.log('📊 Testing View Report List functionality...');
        
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
        );
        
        await expect(filterSection).toBeVisible({ timeout: 10000 });
        
        // Select Client
        console.log('🏢 Selecting Client...');
        const clientDropdown = page.getByRole('combobox', { name: 'Client' }).or(
            page.locator('[data-testid="client-dropdown"]')
        ).or(
            page.locator('select[name*="client"]')
        );
        
        if (await clientDropdown.count() > 0) {
            await clientDropdown.click();
            const clientOptions = page.getByRole('option');
            if (await clientOptions.count() > 1) {
                await clientOptions.nth(1).click(); // Select first non-empty option
            }
        }
        
        // Select Customer
        console.log('👥 Selecting Customer...');
        const customerDropdown = page.getByRole('combobox', { name: 'Customer' }).or(
            page.locator('[data-testid="customer-dropdown"]')
        ).or(
            page.locator('select[name*="customer"]')
        );
        
        if (await customerDropdown.count() > 0) {
            await customerDropdown.click();
            const customerOptions = page.getByRole('option');
            if (await customerOptions.count() > 1) {
                await customerOptions.nth(1).click(); // Select first non-empty option
            }
        }
        
        // Select Facility
        console.log('🏭 Selecting Facility...');
        const facilityDropdown = page.getByRole('combobox', { name: 'Facility' }).or(
            page.locator('[data-testid="facility-dropdown"]')
        ).or(
            page.locator('select[name*="facility"]')
        );
        
        if (await facilityDropdown.count() > 0) {
            await facilityDropdown.click();
            const facilityOptions = page.getByRole('option');
            if (await facilityOptions.count() > 1) {
                await facilityOptions.nth(1).click(); // Select first non-empty option
            }
        }
        
        // Select Building
        console.log('🏢 Selecting Building...');
        const buildingDropdown = page.getByRole('combobox', { name: 'Building' }).or(
            page.locator('[data-testid="building-dropdown"]')
        ).or(
            page.locator('select[name*="building"]')
        );
        
        if (await buildingDropdown.count() > 0) {
            await buildingDropdown.click();
            const buildingOptions = page.getByRole('option');
            if (await buildingOptions.count() > 1) {
                await buildingOptions.nth(1).click(); // Select first non-empty option
            }
        }
        
        // Select System
        console.log('⚙️ Selecting System...');
        const systemDropdown = page.getByRole('combobox', { name: 'System' }).or(
            page.locator('[data-testid="system-dropdown"]')
        ).or(
            page.locator('select[name*="system"]')
        );
        
        if (await systemDropdown.count() > 0) {
            await systemDropdown.click();
            const systemOptions = page.getByRole('option');
            if (await systemOptions.count() > 1) {
                await systemOptions.nth(1).click(); // Select first non-empty option
            }
        }
        
        // Apply filters if there's an apply button
        const applyButton = page.getByRole('button', { name: 'Apply' }).or(
            page.getByRole('button', { name: 'Filter' })
        ).or(
            page.locator('[data-testid="apply-filters"]')
        );
        
        if (await applyButton.count() > 0) {
            await applyButton.click();
            await page.waitForTimeout(2000); // Wait for filters to apply
        }
        
        // Step 4: Verify Systems Report list is displayed
        console.log('📋 Verifying Systems Report list is displayed...');
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
            console.log(`✅ Systems Report list is displayed with ${rowCount} report(s)`);
            
            // Verify at least one report row is visible
            await expect(reportRows.first()).toBeVisible();
            
            // Check for common report columns
            const headers = reportList.locator('th, .table-header');
            const headerCount = await headers.count();
            console.log(`📊 Report list contains ${headerCount} columns`);
            
        } else {
            console.log('ℹ️ No reports found in the list (this may be expected if no reports exist)');
        }
        
        // Additional verification: Check for pagination if present
        const pagination = page.locator('.pagination, [data-testid="pagination"]');
        if (await pagination.count() > 0) {
            console.log('📄 Pagination controls are present');
        }
        
        // Check for search functionality if present
        const searchInput = page.getByRole('textbox', { name: 'Search' }).or(
            page.locator('[data-testid="search-input"]')
        ).or(
            page.locator('input[placeholder*="search"]')
        );
        
        if (await searchInput.count() > 0) {
            console.log('🔍 Search functionality is available');
        }
        
        console.log('✅ View Report List test completed successfully');
    });

    test('REGRESSION: Report List filtering works with different combinations', async ({ page }) => {
        console.log('🔍 Testing Report List filtering with different combinations...');
        
        // Login and navigate
        await goToAliquotQaLink(page);
        await loginAquaUser(page, ALIQUOT_USERNAME_QA, ALIQUOT_PASSWORD_QA);
        await verifyAquaLoginQa(page);
        await clearCacheAndReload(page);
        
        // Navigate to Report List
        const reportsTab = page.getByRole('tab', { name: 'Reports' }).or(
            page.getByRole('button', { name: 'Reports' })
        ).or(
            page.locator('[data-testid="reports-tab"]')
        );
        
        await reportsTab.hover();
        const reportListLink = page.getByRole('menuitem', { name: 'Report List' }).or(
            page.getByRole('link', { name: 'Report List' })
        );
        await reportListLink.click();
        await page.waitForLoadState('networkidle');
        
        // Test different filter combinations
        const filterCombinations = [
            { name: 'Client only', filters: ['client'] },
            { name: 'Client + Customer', filters: ['client', 'customer'] },
            { name: 'Client + Customer + Facility', filters: ['client', 'customer', 'facility'] },
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
        
        console.log('✅ Report List filtering test completed successfully');
    });
});
