import { test, expect } from '../../../setup';
import { LoginPage } from '../../../pages/login/login.page';


  test.describe('Aliquot Login and Clone Customer Flow', () => {
  test('should login, navigate to customer list, clone customer, and fill form', async ({ page }) => {
    const loginPage = new LoginPage(page);

    // Step 1: Perform Login
    await loginPage.navigate();
    await loginPage.login('qa_automation@aquaphoenixsci.com', '12345678');
    await expect(page).toHaveURL(/.*dashboard/);
    console.log('✅ Logged in successfully');

    // Step 2: Hover on the Customers button and click on "Customer List"
    const customersButton = page.locator('button:has-text("Customers")').first();
    await customersButton.hover();
    await page.waitForTimeout(1000);
    const customersListOption = page.locator('.aps-row.aps-click:has-text("Customer List")').first();
    await customersListOption.click();
    await page.waitForLoadState('networkidle');

    // Step 3: Wait for the Clone Customer button and click it
    const cloneCustomerButton = page.locator('button:has-text("Clone Customer")');
    await cloneCustomerButton.waitFor({ state: 'visible', timeout: 5000 });
    await cloneCustomerButton.click();
    console.log('✅ Clone Customer button clicked');

    // Step 4: Click on the Select Client first
    await page.getByText('SourceClientRequired').click();
  await page.locator('.sc-eWPXlR.kHIsam.aps-row.sc-jmqcPp > .sc-jIyAiq.bnqhBv > .sc-ixGGxD > .aps-icon-svg > .aps-icon-foreground').first().click();
  await page.getByRole('searchbox', { name: 'Search for clients...' }).click();
  await page.getByRole('searchbox', { name: 'Search for clients...' }).fill('Aquaph');
  await page.getByRole('cell', { name: 'Aquaphoenix_automation' }).click();
    console.log('✅ Select Client button clicked');


  // Step 5:
  await page.locator('div').filter({ hasText: /^Select Customer$/ }).first().click();
  await page.getByRole('searchbox', { name: 'Search for customers...' }).nth(1).click();
  await page.getByRole('searchbox', { name: 'Search for customers...' }).nth(1).fill('Aqua_auto');
  await page.getByRole('cell', { name: 'Aqua_auto_client_1' }).nth(1).click();

  // Step 6:

  await page.locator('.location-selected .select-quick-client-name').click();
  await page.getByRole('searchbox', { name: 'Search for clients...' }).click();
  await page.getByRole('searchbox', { name: 'Search for clients...' }).fill('aqua');
  await page.getByRole('cell', { name: 'Aquaphoenix_automation' }).click();
  await page.getByRole('textbox').click();
  await page.getByRole('textbox').fill('Testing');

  // await page.locator('.aps-button.btn-loaded').click();

      await page.locator('button:has-text("Clone")').first();

  });
})

