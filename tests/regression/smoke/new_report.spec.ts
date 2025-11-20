import { Page, test, expect } from '@playwright/test';
import {
  goToAliquotQaLink,
  loginAquaUser,
} from '../../../pages/login/login.steps';
import { 
  ALIQUOT_USERNAME_QA, 
  ALIQUOT_PASSWORD_QA,
} from '../../../utils/constants';

test.describe('Login with valid credentials', () => {

  test('Should successfully login, create, and save a report as draft', async ({ page }: { page: Page }) => {
    
    // === Step 1: Navigate to login page ===
    await test.step('Navigate to login page', async () => {
      await goToAliquotQaLink(page);
    });

    // === Step 2: Login ===
    await test.step('Login with Aqua user', async () => {
      await loginAquaUser(page, ALIQUOT_USERNAME_QA, ALIQUOT_PASSWORD_QA);
      await page.waitForLoadState('networkidle');
    });

    // === Step 3: Search for the system ===
    await test.step('Search for the system by ID', async () => {
      const searchIcon = page.getByRole('img').nth(2); 
      await searchIcon.click();

      const searchBox = page.getByRole('searchbox', { name: 'Search for systems by id...' });
      await searchBox.fill('9867');

      const cell = page.getByRole('cell', { name: 'Demo System Aquaphoenix' });
      await expect(cell).toBeVisible();
      await cell.click();

      await page.waitForLoadState('networkidle');
    });

    // === Step 4: Create a new report ===
    await test.step('Create a new Service Report', async () => {
      const reportsTab = page.getByRole('button', { name: 'New Report' });
      await reportsTab.click();

      const templateDropdown = page.getByText('Select a Report Template...');
      await templateDropdown.click();

      const serviceReportOption = page.getByText('Service Report', { exact: true });
      await serviceReportOption.click();
      await page.waitForTimeout(2000);

      const reportTitle = page.getByRole('textbox', { name: 'Enter the report title.' });
      await reportTitle.fill('Service Report 0411');

      const createReportButton = page.getByRole('button', { name: 'Create Report' }).first();
      await createReportButton.click();
      await page.waitForTimeout(3000);
    //   await page.waitForLoadState('networkidle');
    });


    // === Step 5: Fill the report form ===
    await test.step('Fill report input fields with 30-min wait in between', async () => {
    // First 2 inputs
    const firstBatch = [
        { name: 'record_46760_344993_1', value: '20' },
        { name: 'record_46758_344978_2992', value: '10' },
    ];

    for (const input of firstBatch) {
        const field = page.locator(`input[name="${input.name}"]`);
        await field.fill(input.value);
    }

    // Wait for 30 minutes (30 * 60 * 1000 ms)
    console.log('Waiting for 30 minutes...');
    await page.waitForTimeout(30 * 60 * 1000);

    // Next 2 inputs
    const secondBatch = [
        { name: 'record_46758_344979_9', value: '100' },
        { name: 'full_46759_344985_9', value: '150' },
    ];

    for (const input of secondBatch) {
        const field = page.locator(`input[name="${input.name}"]`);
        await field.fill(input.value);
    }
    });

    // === Step 6: Save as Draft ===
    await test.step('Save the report as draft', async () => {
      const saveAsDraftButton = page.locator('button[role="primary"]:has-text("Save as Draft")');
      await saveAsDraftButton.click();

      // Wait for confirmation or network idle
      await page.waitForTimeout(3000);

      // Optional: assert success message if visible
      // const successMessage = page.getByText('Report as draft saved successfully');
      // await expect(successMessage).toBeVisible();
    });

    // === Step 7: Verify draft in search ===
    await test.step('Verify draft report exists', async () => {
        const searchBox = page.getByRole('searchbox', { name: 'Search for open or draft' });
        await searchBox.fill('Service Report 1411');

        // Wait for results to appear
        const draftCell = page.getByRole('cell', { name: 'Service Report 1411' }).first();
        await expect(draftCell).toBeVisible({ timeout: 5000 });
        await page.waitForTimeout(3000);

        await draftCell.click();
        await page.waitForTimeout(3000); // if clicking navigates

    
    });

  });

});
