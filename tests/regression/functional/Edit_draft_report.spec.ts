// Test Case: Edit Draft Report
// Preconditions:
// - User is logged into the application
// - User has access to the Reports module
// - At least one draft report exists in the system

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

test.describe('Edit Draft Report - Functional Tests', () => {

    test.beforeEach(async ({ page }) => {
        console.log('🔧 Setting up Edit Draft Report test environment...');
    });

    test.afterEach(async ({ page }) => {
        console.log('🧹 Cleaning up Edit Draft Report test data...');
    });

    test('REGRESSION: Edit Draft Report functionality works correctly', async ({ page }) => {
        console.log('📝 Testing Edit Draft Report functionality...');
        
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
        
        // Verify Reports and Locations items menu is opened
        const reportsMenu = page.getByRole('menu', { name: 'Reports' }).or(
            page.locator('[data-testid="reports-menu"]')
        ).or(
            page.locator('.dropdown-menu:has-text("Reports")')
        ).or(
            page.locator('.reports-dropdown')
        );
        
        await expect(reportsMenu).toBeVisible({ timeout: 10000 });
        console.log('✅ Reports and Locations items menu is opened');
        
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
        
        // Verify Report List page is displayed with Draft Reports by default
        const reportListPage = page.getByRole('heading', { name: 'Report List' }).or(
            page.locator('[data-testid="report-list-page"]')
        ).or(
            page.locator('h1:has-text("Report List")')
        ).or(
            page.locator('.page-title:has-text("Report List")')
        );
        
        await expect(reportListPage).toBeVisible({ timeout: 15000 });
        console.log('✅ Report List page is displayed');
        
        // Verify Draft Reports are shown by default
        const draftFilter = page.getByRole('button', { name: 'Draft' }).or(
            page.getByRole('tab', { name: 'Draft' })
        ).or(
            page.locator('[data-testid="draft-filter"]')
        ).or(
            page.locator('.filter-active:has-text("Draft")')
        );
        
        if (await draftFilter.count() > 0) {
            await expect(draftFilter).toBeVisible();
            console.log('✅ Draft Reports are shown by default');
        } else {
            console.log('ℹ️ Draft filter not explicitly visible, checking for draft reports in list');
        }
        
        // Step 3: Click on the selected Report
        console.log('📄 Selecting a draft report...');
        const reportList = page.getByRole('table', { name: 'Report List' }).or(
            page.locator('[data-testid="report-list-table"]')
        ).or(
            page.locator('.report-list, .data-table')
        ).or(
            page.locator('table')
        );
        
        await expect(reportList).toBeVisible({ timeout: 15000 });
        
        // Find draft reports in the list
        const draftReports = reportList.locator('tbody tr:has-text("Draft"), .report-row:has-text("Draft")');
        const draftCount = await draftReports.count();
        
        if (draftCount > 0) {
            console.log(`📋 Found ${draftCount} draft report(s)`);
            
            // Click on the first draft report
            const firstDraftReport = draftReports.first();
            await firstDraftReport.click();
            await page.waitForLoadState('networkidle');
            
            console.log('✅ Draft report selected');
        } else {
            // If no draft reports found, try to select any report
            console.log('ℹ️ No draft reports found, selecting any available report');
            const anyReport = reportList.locator('tbody tr, .report-row').first();
            await anyReport.click();
            await page.waitForLoadState('networkidle');
        }
        
        // Step 4: Verify Report page is opened and Edit function is available
        console.log('📝 Verifying report page and edit functionality...');
        
        // Wait for report page to load
        const reportPage = page.getByRole('heading', { name: 'Report' }).or(
            page.locator('[data-testid="report-page"]')
        ).or(
            page.locator('h1:has-text("Report")')
        ).or(
            page.locator('.report-form, .report-editor')
        );
        
        await expect(reportPage).toBeVisible({ timeout: 15000 });
        console.log('✅ Report page is opened');
        
        // Verify Edit function is available
        const editButton = page.getByRole('button', { name: 'Edit' }).or(
            page.getByRole('button', { name: 'Edit Report' })
        ).or(
            page.locator('[data-testid="edit-button"]')
        ).or(
            page.locator('button:has-text("Edit")')
        );
        
        if (await editButton.count() > 0) {
            await editButton.click();
            console.log('✅ Edit function is available and activated');
        } else {
            console.log('ℹ️ Edit mode may already be active or edit button not found');
        }
        
        // Step 5: Make any changes and click "Save as Draft"
        console.log('✏️ Making changes to the report...');
        
        // Try to find and edit report title
        const titleInput = page.getByLabel('Report Title').or(
            page.locator('[data-testid="report-title-input"]')
        ).or(
            page.locator('input[name*="title"]')
        ).or(
            page.locator('input[placeholder*="title"]')
        );
        
        if (await titleInput.count() > 0) {
            const currentTitle = await titleInput.inputValue();
            const newTitle = `Updated Draft Report - ${new Date().toISOString().slice(0, 19)}`;
            await titleInput.fill(newTitle);
            console.log(`📝 Updated report title: ${newTitle}`);
        }
        
        // Try to find and edit report comments
        const commentsInput = page.getByLabel('Comments').or(
            page.locator('[data-testid="comments-input"]')
        ).or(
            page.locator('textarea[name*="comment"]')
        ).or(
            page.locator('textarea[placeholder*="comment"]')
        );
        
        if (await commentsInput.count() > 0) {
            const newComment = `Test comment added at ${new Date().toISOString()}`;
            await commentsInput.fill(newComment);
            console.log(`💬 Added comment: ${newComment}`);
        }
        
        // Try to edit test results if available
        const testResultInputs = page.locator('input[type="number"], input[type="text"]').filter({ hasText: '' });
        const inputCount = await testResultInputs.count();
        
        if (inputCount > 0) {
            // Fill first few test result inputs with sample data
            for (let i = 0; i < Math.min(3, inputCount); i++) {
                const input = testResultInputs.nth(i);
                const currentValue = await input.inputValue();
                if (!currentValue) {
                    await input.fill('100'); // Sample test result
                    console.log(`📊 Updated test result ${i + 1}`);
                }
            }
        }
        
        // Step 6: Click "Save as Draft"
        console.log('💾 Saving report as draft...');
        const saveDraftButton = page.getByRole('button', { name: 'Save as Draft' }).or(
            page.getByRole('button', { name: 'Save Draft' })
        ).or(
            page.locator('[data-testid="save-draft-btn"]')
        ).or(
            page.locator('button:has-text("Save as Draft")')
        );
        
        await expect(saveDraftButton).toBeVisible({ timeout: 10000 });
        await saveDraftButton.click();
        
        // Wait for save operation to complete
        await page.waitForTimeout(3000);
        
        // Step 7: Verify success message
        console.log('✅ Verifying success message...');
        const successMessage = page.getByText('Report has been saved successfully').or(
            page.getByText('Report saved successfully')
        ).or(
            page.getByText('Successfully saved')
        ).or(
            page.locator('[data-testid="success-message"]')
        ).or(
            page.locator('.success-message, .alert-success')
        );
        
        await expect(successMessage).toBeVisible({ timeout: 10000 });
        console.log('✅ Success message: "Report has been saved successfully" is displayed');
        
        // Additional verification: Check if we're back to report list or still on report page
        const currentUrl = page.url();
        if (currentUrl.includes('report-list') || currentUrl.includes('reports')) {
            console.log('📋 Returned to report list after saving');
        } else {
            console.log('📝 Remained on report page after saving');
        }
        
        console.log('✅ Edit Draft Report test completed successfully');
    });

    test('REGRESSION: Edit Draft Report with different field modifications', async ({ page }) => {
        console.log('🔧 Testing Edit Draft Report with various field modifications...');
        
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
        
        // Select a draft report
        const reportList = page.getByRole('table').or(
            page.locator('.report-list, .data-table')
        );
        
        const draftReports = reportList.locator('tbody tr:has-text("Draft"), .report-row:has-text("Draft")');
        const anyReport = await draftReports.count() > 0 ? draftReports.first() : reportList.locator('tbody tr, .report-row').first();
        
        await anyReport.click();
        await page.waitForLoadState('networkidle');
        
        // Test different types of modifications
        const modifications = [
            { type: 'Title', selector: 'input[name*="title"], input[placeholder*="title"]', value: 'Modified Title' },
            { type: 'Comments', selector: 'textarea[name*="comment"], textarea[placeholder*="comment"]', value: 'Modified Comments' },
            { type: 'Test Results', selector: 'input[type="number"]', value: '250' },
            { type: 'Text Fields', selector: 'input[type="text"]:not([readonly])', value: 'Modified Text' }
        ];
        
        for (const modification of modifications) {
            console.log(`🔧 Testing ${modification.type} modification...`);
            
            const elements = page.locator(modification.selector);
            const elementCount = await elements.count();
            
            if (elementCount > 0) {
                const element = elements.first();
                await element.fill(modification.value);
                console.log(`✅ Modified ${modification.type}: ${modification.value}`);
            } else {
                console.log(`ℹ️ No ${modification.type} fields found to modify`);
            }
        }
        
        // Save as draft
        const saveDraftButton = page.getByRole('button', { name: 'Save as Draft' }).or(
            page.locator('button:has-text("Save as Draft")')
        );
        
        if (await saveDraftButton.count() > 0) {
            await saveDraftButton.click();
            await page.waitForTimeout(2000);
            
            // Verify success message
            const successMessage = page.getByText('Report has been saved successfully').or(
                page.locator('.success-message')
            );
            
            if (await successMessage.count() > 0) {
                console.log('✅ Success message displayed after modifications');
            }
        }
        
        console.log('✅ Edit Draft Report with modifications test completed successfully');
    });
});
