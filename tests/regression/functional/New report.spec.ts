import { Page, test, expect } from '@playwright/test';
import {
  goToAliquotQaLink,
  loginAquaUser,
} 

from '../../../pages/login/login.steps';
import { 
  ALIQUOT_USERNAME_QA, 
  ALIQUOT_PASSWORD_QA,
} from '../../../utils/constants';


test.describe('Login with valid credentials', () => {
  test('Should successfully login and reach dashboard', async ({ page }: { page: Page }) => {
    
    await test.step('Navigate to login page', async () => {
    await goToAliquotQaLink(page);
    });

    await test.step('Fill in credentials and login', async () => {
      await loginAquaUser(page, ALIQUOT_USERNAME_QA, ALIQUOT_PASSWORD_QA);
      await page.waitForLoadState('networkidle');
    });

    const searchIcon = await page.getByRole('img').nth(2);
    await searchIcon.click();
    await page.waitForTimeout(500);

    const searchBox = page.getByRole('searchbox', { name: 'Search for systems by id...' });
    await searchBox.fill('9867');
    await page.waitForTimeout(2000);

    const cell = page.getByRole('cell', { name: 'Demo System Aquaphoenix' });
    await expect(cell).toBeVisible();
    await cell.click();
    await page.waitForTimeout(3000);


    const reportsTab = page.getByRole('button', { name: 'New Report' })
    await reportsTab.click();
  
    const templateDropdown = page.getByText('Select a Report Template...');
    await templateDropdown.click();

    const serviceReportOption = page.getByText('Service Report', { exact: true });
    await serviceReportOption.click();

    const createReportButton = page.getByRole('button', { name: 'Create Report' }).first();
    await createReportButton.click();
 
  
    const input1 = page.locator('input[name="record_46760_344993_1"]');
    await input1.click();
    await input1.fill('20');



    const input2 = page.locator('input[name="record_46758_344978_2992"]');
    await input2.click();
    await input2.fill('10');

    const input3 = page.locator('input[name="full_46759_344988_2917"]');
    await input3.click();
    await input3.fill('30');

    const input4 = page.locator('input[name="full_46759_344984_2992"]');
    await input4.click();
    await input4.fill('50');

    const input5 = page.locator('input[name="record_46758_344976_2995"]');
    await input5.click();
    await input5.fill('50');

    await page.waitForTimeout(30000);

    // Optional: You can do other assertions or checks after the wait
    console.log('30 minutes have passed!');

    const saveAsDraftButton = page.locator('button[role="primary"]:has-text("Save as Draft")');
    await saveAsDraftButton.click();

    // Wait for the URL to be the reports page
    await page.waitForURL('https://code.aliquot.live/reports', { waitUntil: 'networkidle' });

    // Assert the page is on the correct URL
    expect(page.url()).toBe('https://code.aliquot.live/reports');

    // console.log('Waiting for 30 minutes...');
    
    //await page.waitForTimeout(30 * 60 * 1000); 
    


    });



});