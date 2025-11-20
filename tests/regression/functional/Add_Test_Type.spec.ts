// Test Case: Add Test Type to the Test Types List
// Preconditions:
// - User is logged into the application
// - User has access to the Reports module
// - User has permission to create test types
// - User is on the Manage Components page

import { test, expect } from '@playwright/test';
import { randomUUID } from 'crypto';

import {
    goToAliquotQaLink,
    loginAquaUser,
    verifyAquaLoginQa
} from '../../../pages/login/login.steps';

import { ALIQUOT_PASSWORD_QA, ALIQUOT_USERNAME_QA } from '../../../utils/constants';
import { clearCacheAndReload } from '../../../utils/helpers';

test.describe('Add Test Type to the Test Types List - Functional Tests', () => {

    test.beforeEach(async ({ page }) => {
        console.log('🔧 Setting up Add Test Type test environment...');
    });

    test.afterEach(async ({ page }) => {
        console.log('🧹 Cleaning up Add Test Type test data...');
    });

    test('REGRESSION: Add Test Type functionality works correctly', async ({ page }) => {
        console.log('🧪 Testing Add Test Type functionality...');

        // Login and navigate
        await goToAliquotQaLink(page);
        await loginAquaUser(page, ALIQUOT_USERNAME_QA, ALIQUOT_PASSWORD_QA);
        await verifyAquaLoginQa(page);
        await clearCacheAndReload(page);

        // Step 1: Hover over the Reports tab
        console.log('🖱️ Hovering over the Reports tab...');
        const reportsTab = page.getByRole('tab', { name: 'Reports' })
            .or(page.getByRole('button', { name: 'Reports' }))
            .or(page.locator('[data-testid="reports-tab"]'))
            .or(page.locator('a:has-text("Reports")'));
        await reportsTab.hover();
        await page.waitForTimeout(1000);

        // Step 2: Click Test Types from the submenu
        console.log('🧪 Clicking Test Types...');

        // Locate only the first span with menu-item-label that has exact text "Test Types"
        const testTypesButton = page.locator('span.menu-item-label', { hasText: /^Test Types$/ });

        await expect(testTypesButton).toBeVisible({ timeout: 10000 });
        await testTypesButton.click();
        await page.waitForLoadState('networkidle');


        // Step 3: Click Create Test Type button
        console.log('📝 Clicking Create Test Type button...');
        const createButton = page.getByRole('button', { name: 'Create Test Type' });
        await expect(createButton).toBeVisible({ timeout: 15000 });
        await createButton.click();
        console.log('✅ Create/Add button clicked');
        await page.waitForLoadState('networkidle');

        // Step 4: Verify Create Test Type page is displayed
        console.log('📝 Verifying Create Test Type page is displayed...');
        const createTestTypePage = page.getByRole('heading', { name: 'Create Test Type' })
            .or(page.getByRole('heading', { name: 'Add Test Type' }))
            .or(page.getByRole('heading', { name: 'New Test Type' }));
        await expect(createTestTypePage).toBeVisible({ timeout: 15000 });
        console.log('✅ Create Test Type page is displayed');

        // Step 5: Fill out Short Name and validate Long Name auto-fills
        console.log('📝 Filling out Short Name...');
        const shortNameInput = page.locator('input[name="shortName"]');
        await expect(shortNameInput).toBeVisible({ timeout: 10000 });

        const shortNameValue = `TEST-${randomUUID().slice(0, 6)}`;
        await shortNameInput.fill(shortNameValue);
        console.log(`✅ Entered Short Name: ${shortNameValue}`);

        const longNameInput = page.locator('input[name="name"]');
        await expect(longNameInput).toBeVisible({ timeout: 10000 });

        // Check that Long Name auto-populates with the same value
        const longNameValue = await longNameInput.inputValue();
        await expect(longNameValue).toBe(shortNameValue);
        console.log(`✅ Long Name auto-filled correctly: ${longNameValue}`);

        // Step 6: Click Save Test Type
        console.log('💾 Clicking Save Test Type button...');
        const saveButton = page.getByRole('button', { name: 'Save' })
            .or(page.getByRole('button', { name: 'Save Test Type' }))
            .or(page.locator('[data-testid="save-test-type-btn"]'));
        await expect(saveButton).toBeVisible({ timeout: 20000 });
        await saveButton.click();

        // Step 7: Verify success message
        console.log('🔍 Verifying success message...');
        const successMessage = page.getByText(/saved successfully/i)
            .or(page.getByText(/success/i))
            .or(page.locator('.toast-success'))
            .or(page.locator('[role="alert"]'))
            .or(page.locator('.success-message'));
        await expect(successMessage).toBeVisible({ timeout: 15000 });
        console.log('✅ Success message displayed');

        // Step 8: Navigate to Test Types list to verify the new entry
        console.log('📋 Navigating to Test Types list...');
        await page.goto('https://qa.aliquot.live/test-types');
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(2000);

        // Step 9: Verify new Test Type is in the Test Types List (handle pagination)
        console.log('📋 Verifying new Test Type is listed...');
        
        let testTypeFound = false;
        let currentPage = 1;
        const maxPages = 10; // Safety limit to prevent infinite loop
        
        while (!testTypeFound && currentPage <= maxPages) {
            console.log(`🔍 Searching for test type on page ${currentPage}...`);
            
            // Check if the test type exists on current page
            const testTypeText = page.getByText(shortNameValue);
            const testTypeCount = await testTypeText.count();
            
            if (testTypeCount > 0) {
                console.log(`✅ Test Type "${shortNameValue}" found on page ${currentPage}`);
                testTypeFound = true;
                break;
            }
            
            // Check if Next button is enabled
            const nextButton = page.getByRole('button', { name: 'Next' });
            const isNextEnabled = await nextButton.isEnabled();
            
            if (!isNextEnabled) {
                console.log(`📄 Reached last page (${currentPage}). Test type not found.`);
                break;
            }
            
            // Click Next button to go to next page
            console.log(`➡️ Clicking Next button to go to page ${currentPage + 1}...`);
            await nextButton.click();
            await page.waitForLoadState('networkidle');
            await page.waitForTimeout(1000);
            currentPage++;
        }
        
        if (testTypeFound) {
            console.log(`✅ Test Type "${shortNameValue}" successfully found in the list!`);
        } else {
            throw new Error(`❌ Test Type "${shortNameValue}" not found in any page of the test types list`);
        }
    });

});
