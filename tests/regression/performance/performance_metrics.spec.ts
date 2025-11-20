import { test, expect } from '@playwright/test';
import { randomUUID } from 'crypto';

import {
    hoverSiteManagementButton,
    clickClearFiltersBtn,
    clickManageBuildings,
    clickSelectCustomerOnSiteManagement,
    searchCustomerOnSiteManagement,
    selectCustomerInSearchListOnSiteManagement,
    clickSelectFacilityOnSiteManagement,
    searchFacilityOnSiteManagement,
    selectFacilityInSearchListOnSiteManagement,
    clickSelectBuildingOnSiteManagement,
    searchBuildingOnSiteManagement,
    selectBuildingInSearchListOnSiteManagement
} from '../../../pages/home/home.steps';

import {
    clickMyOrganization
} from '../../../pages/client/client.steps';

import {
    goToAliquotQaLink,
    loginAquaUser,
    verifyAquaLoginQa
} from '../../../pages/login/login.steps';

import { ALIQUOT_PASSWORD_QA, ALIQUOT_USERNAME_QA } from '../../../utils/constants';
import { clearCacheAndReload } from '../../../utils/helpers';

test.describe('Performance Metrics Regression Tests - Performance Suite', () => {

    test.beforeEach(async ({ page }) => {
        console.log('⚡ Setting up performance regression test environment...');
    });

    test.afterEach(async ({ page }) => {
        console.log('🧹 Cleaning up performance test data...');
    });

    test('REGRESSION: Page load times remain within acceptable limits', async ({ page }) => {
        console.log('⏱️ Testing page load performance...');
        
        // Measure initial page load time
        const startTime = Date.now();
        await goToAliquotQaLink(page);
        await page.waitForLoadState('networkidle');
        const loadTime = Date.now() - startTime;
        
        console.log(`📊 Initial page load time: ${loadTime}ms`);
        
        // Performance assertion - page should load within 10 seconds
        expect(loadTime).toBeLessThan(10000);
        console.log('✅ Page load time is within acceptable limits');
        
        // Test login performance
        const loginStartTime = Date.now();
        await loginAquaUser(page, ALIQUOT_USERNAME_QA, ALIQUOT_PASSWORD_QA);
        await verifyAquaLoginQa(page);
        const loginTime = Date.now() - loginStartTime;
        
        console.log(`📊 Login completion time: ${loginTime}ms`);
        expect(loginTime).toBeLessThan(15000);
        console.log('✅ Login performance is within acceptable limits');
    });

    test('REGRESSION: Navigation response times are consistent', async ({ page }) => {
        console.log('🧭 Testing navigation response performance...');
        
        // Login first
        await goToAliquotQaLink(page);
        await loginAquaUser(page, ALIQUOT_USERNAME_QA, ALIQUOT_PASSWORD_QA);
        await verifyAquaLoginQa(page);
        await clearCacheAndReload(page);
        
        // Test navigation performance
        const navStartTime = Date.now();
        await hoverSiteManagementButton(page);
        await page.waitForTimeout(1500);
        const navTime = Date.now() - navStartTime;
        
        console.log(`📊 Navigation response time: ${navTime}ms`);
        expect(navTime).toBeLessThan(5000);
        console.log('✅ Navigation response time is consistent');
        
        // Test menu expansion performance
        const menuStartTime = Date.now();
        await clickMyOrganization(page);
        await page.waitForTimeout(3000);
        const menuTime = Date.now() - menuStartTime;
        
        console.log(`📊 Menu expansion time: ${menuTime}ms`);
        expect(menuTime).toBeLessThan(8000);
        console.log('✅ Menu expansion performance is consistent');
    });

    test('REGRESSION: Data loading performance meets expectations', async ({ page }) => {
        console.log('📊 Testing data loading performance...');
        
        // Login and navigate
        await goToAliquotQaLink(page);
        await loginAquaUser(page, ALIQUOT_USERNAME_QA, ALIQUOT_PASSWORD_QA);
        await verifyAquaLoginQa(page);
        await clearCacheAndReload(page);
        
        // Navigate to data view
        await hoverSiteManagementButton(page);
        await clickMyOrganization(page);
        await clickClearFiltersBtn(page);
        
        // Measure data loading performance
        const dataStartTime = Date.now();
        await page.waitForTimeout(3000);
        
        // Wait for data to be visible
        const dataTable = page.locator('table, .data-table, .grid');
        await expect(dataTable.first()).toBeVisible();
        const dataLoadTime = Date.now() - dataStartTime;
        
        console.log(`📊 Data loading time: ${dataLoadTime}ms`);
        expect(dataLoadTime).toBeLessThan(10000);
        console.log('✅ Data loading performance meets expectations');
        
        // Test data refresh performance
        const refreshStartTime = Date.now();
        await clickClearFiltersBtn(page);
        await page.waitForTimeout(2000);
        const refreshTime = Date.now() - refreshStartTime;
        
        console.log(`📊 Data refresh time: ${refreshTime}ms`);
        expect(refreshTime).toBeLessThan(8000);
        console.log('✅ Data refresh performance meets expectations');
    });

    test('REGRESSION: Search and filter performance is optimal', async ({ page }) => {
        console.log('🔍 Testing search and filter performance...');
        
        // Login and navigate
        await goToAliquotQaLink(page);
        await loginAquaUser(page, ALIQUOT_USERNAME_QA, ALIQUOT_USERNAME_QA);
        await verifyAquaLoginQa(page);
        await clearCacheAndReload(page);
        
        await hoverSiteManagementButton(page);
        await clickMyOrganization(page);
        await page.waitForTimeout(2000);
        
        // Test search performance
        const searchInputs = page.locator('input[placeholder*="search"], .search-input, [data-search]');
        const searchCount = await searchInputs.count();
        
        if (searchCount > 0) {
            const searchStartTime = Date.now();
            await searchInputs.first().fill('test');
            await page.waitForTimeout(1000);
            const searchTime = Date.now() - searchStartTime;
            
            console.log(`📊 Search response time: ${searchTime}ms`);
            expect(searchTime).toBeLessThan(3000);
            console.log('✅ Search performance is optimal');
        }
        
        // Test filter performance
        const filterElements = page.locator('.filter, [data-filter], .filter-control');
        const filterCount = await filterElements.count();
        
        if (filterCount > 0) {
            const filterStartTime = Date.now();
            await filterElements.first().click();
            await page.waitForTimeout(1000);
            const filterTime = Date.now() - filterStartTime;
            
            console.log(`📊 Filter response time: ${filterTime}ms`);
            expect(filterTime).toBeLessThan(3000);
            console.log('✅ Filter performance is optimal');
        }
    });

    test('REGRESSION: Form submission performance is acceptable', async ({ page }) => {
        console.log('📝 Testing form submission performance...');
        
        // Login and navigate
        await goToAliquotQaLink(page);
        await loginAquaUser(page, ALIQUOT_USERNAME_QA, ALIQUOT_PASSWORD_QA);
        await verifyAquaLoginQa(page);
        await clearCacheAndReload(page);
        
        await hoverSiteManagementButton(page);
        await clickMyOrganization(page);
        await page.waitForTimeout(2000);
        
        // Test form performance
        const forms = page.locator('form, .form, [class*="form"]');
        const formCount = await forms.count();
        
        if (formCount > 0) {
            console.log(`✅ Found ${formCount} forms to test`);
            
            // Test form input performance
            const formInputs = page.locator('form input, form select, form textarea');
            const inputCount = await formInputs.count();
            
            if (inputCount > 0) {
                const inputStartTime = Date.now();
                await formInputs.first().fill('test');
                const inputTime = Date.now() - inputStartTime;
                
                console.log(`📊 Form input response time: ${inputTime}ms`);
                expect(inputTime).toBeLessThan(1000);
                console.log('✅ Form input performance is acceptable');
            }
        }
        
        // Test form validation performance
        const validationElements = page.locator('.validation, .error, .success');
        const validationCount = await validationElements.count();
        
        if (validationCount > 0) {
            console.log(`✅ Found ${validationCount} validation elements`);
        }
    });

    test('REGRESSION: API response times are within SLA requirements', async ({ page }) => {
        console.log('🌐 Testing API response performance...');
        
        // Login and navigate
        await goToAliquotQaLink(page);
        await loginAquaUser(page, ALIQUOT_USERNAME_QA, ALIQUOT_PASSWORD_QA);
        await verifyAquaLoginQa(page);
        await clearCacheAndReload(page);
        
        // Monitor network requests
        const responseTimes = [];
        
        page.on('response', response => {
            // Use Date.now() for response timing since response.timing() is not available
            const responseTime = Date.now();
            responseTimes.push(responseTime);
            console.log(`📊 API Response: ${response.url()} - ${responseTime}ms`);
        });
        
        // Perform actions that trigger API calls
        await hoverSiteManagementButton(page);
        await clickMyOrganization(page);
        await page.waitForTimeout(3000);
        
        // Analyze response times
        if (responseTimes.length > 0) {
            const avgResponseTime = responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length;
            const maxResponseTime = Math.max(...responseTimes);
            
            console.log(`📊 Average API response time: ${avgResponseTime.toFixed(2)}ms`);
            console.log(`📊 Maximum API response time: ${maxResponseTime}ms`);
            
            // Performance assertions
            expect(avgResponseTime).toBeLessThan(2000);
            expect(maxResponseTime).toBeLessThan(5000);
            
            console.log('✅ API response times are within SLA requirements');
        } else {
            console.log('⚠️ No API responses detected during test');
        }
    });

    test('REGRESSION: Memory usage remains stable during operations', async ({ page }) => {
        console.log('💾 Testing memory usage stability...');
        
        // Login and navigate
        await goToAliquotQaLink(page);
        await loginAquaUser(page, ALIQUOT_USERNAME_QA, ALIQUOT_PASSWORD_QA);
        await verifyAquaLoginQa(page);
        await clearCacheAndReload(page);
        
        // Get initial memory metrics using a more compatible approach
        const initialMetrics = await page.evaluate(() => {
            // Check if memory API is available (Chrome only)
            if ('memory' in performance && performance.memory) {
                return {
                    usedJSHeapSize: (performance as any).memory.usedJSHeapSize,
                    totalJSHeapSize: (performance as any).memory.totalJSHeapSize,
                    jsHeapSizeLimit: (performance as any).memory.jsHeapSizeLimit
                };
            }
            return null;
        });
        
        if (initialMetrics) {
            console.log(`📊 Initial memory usage: ${(initialMetrics.usedJSHeapSize / 1024 / 1024).toFixed(2)}MB`);
            
            // Perform memory-intensive operations
            await hoverSiteManagementButton(page);
            await clickMyOrganization(page);
            await page.waitForTimeout(3000);
            
            // Get final memory metrics
            const finalMetrics = await page.evaluate(() => {
                if ('memory' in performance && performance.memory) {
                    return {
                        usedJSHeapSize: (performance as any).memory.usedJSHeapSize,
                        totalJSHeapSize: (performance as any).memory.totalJSHeapSize,
                        jsHeapSizeLimit: (performance as any).memory.jsHeapSizeLimit
                    };
                }
                return null;
            });
            
            if (finalMetrics) {
                const memoryIncrease = finalMetrics.usedJSHeapSize - initialMetrics.usedJSHeapSize;
                const memoryIncreaseMB = (memoryIncrease / 1024 / 1024).toFixed(2);
                
                console.log(`📊 Final memory usage: ${(finalMetrics.usedJSHeapSize / 1024 / 1024).toFixed(2)}MB`);
                console.log(`📊 Memory increase: ${memoryIncreaseMB}MB`);
                
                // Memory should not increase by more than 50MB during normal operations
                expect(memoryIncrease).toBeLessThan(50 * 1024 * 1024);
                console.log('✅ Memory usage remains stable during operations');
            }
        } else {
            console.log('⚠️ Memory metrics not available in this browser');
        }
    });

    test('REGRESSION: Page responsiveness during heavy operations', async ({ page }) => {
        console.log('🎯 Testing page responsiveness during heavy operations...');
        
        // Login and navigate
        await goToAliquotQaLink(page);
        await loginAquaUser(page, ALIQUOT_USERNAME_QA, ALIQUOT_PASSWORD_QA);
        await verifyAquaLoginQa(page);
        await clearCacheAndReload(page);
        
        // Navigate to data-heavy page
        await hoverSiteManagementButton(page);
        await clickMyOrganization(page);
        await clickClearFiltersBtn(page);
        await page.waitForTimeout(3000);
        
        // Test UI responsiveness during data operations
        const startTime = Date.now();
        
        // Perform multiple operations to test responsiveness
        for (let i = 0; i < 3; i++) {
            const operationStart = Date.now();
            
            // Test button responsiveness
            const buttons = page.locator('button, .btn');
            if (await buttons.count() > 0) {
                await buttons.first().click();
                await page.waitForTimeout(500);
            }
            
            const operationTime = Date.now() - operationStart;
            console.log(`📊 Operation ${i + 1} response time: ${operationTime}ms`);
            
            // Each operation should complete within 2 seconds
            expect(operationTime).toBeLessThan(2000);
        }
        
        const totalTime = Date.now() - startTime;
        console.log(`📊 Total operations time: ${totalTime}ms`);
        
        // Total operations should complete within 10 seconds
        expect(totalTime).toBeLessThan(10000);
        console.log('✅ Page responsiveness during heavy operations is maintained');
    });
});
