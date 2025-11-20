import { Page, test, expect } from '@playwright/test';
import { goToAliquotQaLink, loginAquaUser } from '../../../pages/login/login.steps';
import { ALIQUOT_USERNAME_QA, ALIQUOT_PASSWORD_QA } from '../../../utils/constants';

test.describe('Login with valid credentials', () => {

  test('Edit profile updates and signature removal', async ({ page }: { page: Page }) => {

    // Step 1: Navigate to login page
    await goToAliquotQaLink(page);
    await page.waitForTimeout(2000); // Wait for page data

    // Step 2: Login
    await loginAquaUser(page, ALIQUOT_USERNAME_QA, ALIQUOT_PASSWORD_QA);
    await page.waitForTimeout(3000); // Wait for user dashboard to load

    // Step 3: Open Edit My Profile
    const headerIcon = page.locator('.header-icon svg').nth(4);
    await headerIcon.click();
    await page.waitForTimeout(2000);

    const editButton = page.getByRole('button', { name: 'Edit My Profile' });
    await editButton.click();
    await page.waitForTimeout(3000); // Wait for modal data to load

    // Step 4: Fill profile fields
    await page.locator('input[name="firstName"]').fill('DEMO Edits');
    await page.locator('input[name="mi"]').fill('DEMO Middle');
    await page.locator('input[name="lastName"]').fill('Admin Updated');
    await page.waitForTimeout(2000); // Wait for data processing

    // Step 5: Remove signature if present
    const signatureRemove = page.getByText('Signature Remove');
    if (await signatureRemove.isVisible()) {
      await signatureRemove.click();
      await page.waitForTimeout(2000); // Wait for signature removal
    }

    // Step 6: Save profile
    const saveButton = page.getByRole('button', { name: 'Save Profile' });
    await saveButton.click();
    await page.waitForTimeout(3000); // Wait for save processing

    // // Step 7: Close Edit Profile modal
    // const closeButton = page.getByRole('button', { name: 'Close Window' });
    // await expect(closeButton).toBeVisible();
    // await closeButton.click();

    // Wait for modal overlay to disappear
    await page.locator('div.sc-jtQUzJ.jDDdUI').waitFor({ state: 'detached' });
    await page.waitForTimeout(3000); // Wait for page to stabilize

    // Step 8: Verify profile update success
    // await expect(page.getByText('Profile has been updated'));
    // await page.waitForTimeout(2000); // Extra wait for page data

    // // Step 9: Navigate to Reports
    // const reportsButton = page.getByRole('button', { name: 'Reports' });
    // await reportsButton.click();
    // await page.waitForTimeout(3000); // Wait for reports page data

// await test.step('Close side profile window', async () => {

//     // wait for panel to fully load before closing
//     await page.waitForSelector('.ePSJRI', { state: 'visible' });

//     // click outside (overlay)
//     await page.click('.sc-jtQUzJ.jDDdUI');

//     // wait for the panel to close
//     await page.locator('.ePSJRI').waitFor({ state: 'detached' });

//     console.log('Side panel closed successfully');
// });

await test.step('Navigate to Create Reports Page', async () => {
    await page.goto('https://qa.aliquot.live/reports/create', {
        waitUntil: 'networkidle'   // waits for all calls to finish
    });

    // Optional: wait for a key element on the page
    await page.waitForSelector('text=Create Report');
});


    // === Step 3: Search for the system ===
    await test.step('Search for the system by ID', async () => {
      const searchIcon = page.getByRole('img').nth(2); 
      await searchIcon.click();

      const searchBox = page.getByRole('searchbox', { name: 'Search for systems by id...' });
      await searchBox.fill('75448');

      const cell = page.getByRole('cell', { name: 'Beverly Hardy' });
      await expect(cell).toBeVisible();
      await cell.click();

      await page.waitForLoadState('networkidle');
    });

    // Step 10: Create a new Service Report
    const newReportButton = page.getByRole('button', { name: 'New Report' });
    await newReportButton.click();
    await page.waitForTimeout(2000);

    const templateDropdown = page.getByText('Select a Report Template...');
    await templateDropdown.click();
    await page.waitForTimeout(2000);

    const serviceReportOption = page.getByText('Service Report', { exact: true });
    await serviceReportOption.click();
    await page.waitForTimeout(2000);

    const reportTitle = page.getByRole('textbox', { name: 'Enter the report title.' });
    await reportTitle.fill('Service Report 0411');
    await page.waitForTimeout(1000);

    const createReportButton = page.getByRole('button', { name: 'Create Report' }).first();
    await createReportButton.click();
    await page.waitForTimeout(3000); // Wait for report creation

await test.step('Validate no signature image is present', async () => {

    // Scroll to Signature section
    await page.getByText('Signature', { exact: true }).scrollIntoViewIfNeeded();
    await page.waitForTimeout(1500);  // Let UI settle

    // Validate image NOT present inside Signature
    const signatureSection = page.locator('.aps-cell', { hasText: 'Signature' });
    const images = signatureSection.locator('img');

    await expect(images).toHaveCount(0);
});




});



});

