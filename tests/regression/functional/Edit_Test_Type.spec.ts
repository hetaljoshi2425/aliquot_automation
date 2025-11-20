// Test Case: Edit Test Type
// Preconditions:
// - User is logged into the application
// - User has access to the Reports module
// - User has permission to edit test types
// - User must have a System selected to interact with the page
// - At least one test type exists in the system that can be edited

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

test.describe('Edit Test Type - Functional Tests', () => {

    test.beforeEach(async ({ page }) => {
        console.log('🔧 Setting up Edit Test Type test environment...');
    });

    test.afterEach(async ({ page }) => {
        console.log('🧹 Cleaning up Edit Test Type test data...');
    });

    test('REGRESSION: Edit Test Type functionality works correctly', async ({ page }) => {
        console.log('✏️ Testing Edit Test Type functionality...');
        
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
        const testTypesButton = page.locator('span.menu-item-label', { hasText: /^Test Types$/ });
        await expect(testTypesButton).toBeVisible({ timeout: 10000 });
        await testTypesButton.click();
        await page.waitForLoadState('networkidle');
        
        // Step 3: Verify Test Types List page is displayed
        console.log('📋 Verifying Test Types List page is displayed...');
        const testTypesListPage = page.getByText('Test Types List', { exact: true });
        await expect(testTypesListPage).toBeVisible({ timeout: 15000 });
        console.log('✅ Test Types List page is displayed');

        // Step 4: Click the edit (pencil) icon for a Test Type
        console.log('✏️ Clicking the edit (pencil) icon for a Test Type...');

        // Function to click the edit button for the first Test Type across all pages
        async function clickFirstEditButton(page) {
        const nextButton = page.locator('button.table-btn-next');
        while (true) {
            const editButton = page.locator('div.list-edit-icon').first();
            if (await editButton.count() > 0) {
            await editButton.click();
            console.log('✅ Clicked edit button for Test Type');
            return;
            }

            // Check if Next is disabled
            const isDisabled = await nextButton.getAttribute('disabled');
            if (isDisabled !== null) {
            throw new Error('No editable Test Type found in the list');
            }

            // Click Next
            await nextButton.click();
            await page.waitForLoadState('networkidle');
        }
        }

        // Call the helper
        await clickFirstEditButton(page);

        // Step 5: Verify Edit Test Type page is displayed
        console.log('📝 Verifying Edit Test Type page is displayed...');
        const editTestTypePage = page.getByRole('heading', { name: 'Edit Test Type' })
            .or(page.getByRole('heading', { name: 'Edit Test Type' }))
            .or(page.locator('h1:has-text("Edit Test Type")'))
            .or(page.locator('.page-title:has-text("Edit")'));
        await expect(editTestTypePage).toBeVisible({ timeout: 20000 });


        // Step 6: Update the Test Type details
        console.log('📝 Updating the Test Type details...');
        const testTypeNameInput = page.locator('input[name="name"]');
        await testTypeNameInput.clear();
        await testTypeNameInput.fill('EDITED-TEST-TYPE');
        await page.waitForTimeout(1000);
        console.log('✅ Updated Test Type name to: "EDITED-TEST-TYPE"');

        // Step 7: Click Save Test Type
        console.log('💾 Clicking Save Test Type button...');
        const saveTestTypeButton = page.getByRole('button', { name: 'Save Test Type' }).or(
            page.getByRole('button', { name: 'Save' })
        ).or(
            page.locator('[data-testid="save-test-type-btn"]')
        );

        await expect(saveTestTypeButton).toBeVisible({ timeout: 10000 });
        await saveTestTypeButton.click();

        // Step 8: Verify Success message is displayed
        console.log('✅ Verifying success message is displayed...');
        const successMessage = page.getByText('Test Type has been saved successfully').or(
            page.getByText('Test Type saved successfully')
        ).or(
            page.getByText('Successfully saved')
        );

        await expect(successMessage).toBeVisible({ timeout: 10000 });
        const successText = await successMessage.textContent();
        console.log(`✅ Success message: "${successText}" is displayed`);

        
        
    });
});
