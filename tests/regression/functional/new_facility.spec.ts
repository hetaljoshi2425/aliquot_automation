import { test, expect } from '@playwright/test';
import { randomUUID } from 'crypto';

import {
    goToAliquotQaLink,
    loginAquaUser,
    verifyAquaLoginQa
} from '../../../pages/login/login.steps';
import { ALIQUOT_PASSWORD_QA, ALIQUOT_USERNAME_QA } from '../../../utils/constants';
import { clearCacheAndReload } from '../../../utils/helpers';
import { hoverSiteManagementButton } from '../../../pages/home/home.steps';

test.describe('Create New Facility - Functional Tests', () => {

    test.beforeEach(async ({ page }) => {
        console.log('🔧 Setting up Create New Facility test environment...');
        await clearCacheAndReload(page);  // Reset cache before each test if needed
    });

    test('REGRESSION: Create New Facility functionality works correctly', async ({ page }) => {
        console.log('🏢 Testing Create New Facility functionality...');

        // Step 1: Login and navigate
        await goToAliquotQaLink(page);
        await loginAquaUser(page, ALIQUOT_USERNAME_QA, ALIQUOT_PASSWORD_QA);
        await verifyAquaLoginQa(page);
        

        await page.getByRole('button', { name: 'SiteManagement' }).click();

 


        // // Step 2: Hover over the Site Management button
        // await hoverSiteManagementButton(page);

        // // Step 3: Optional - Add assertion to confirm a dropdown or menu appears after hover
        // const dropdown = page.locator('selector-for-dropdown');  // Replace with actual dropdown selector
        // await expect(dropdown).toBeVisible();  // Example assertion to check if the dropdown appeared

        // Step 4: Continue with further actions in your test (clicking menu items, verifying content)
        // Example action:
        // await page.click('selector-for-menu-item');
        
        // Optional: Add assertions to verify that the "Create New Facility" functionality works as expected
        // Example: Verifying the existence of a facility creation button
        const createFacilityButton = page.locator('button:has-text("Create Facility")');
        await expect(createFacilityButton).toBeVisible();
        await createFacilityButton.click();
    });

});
