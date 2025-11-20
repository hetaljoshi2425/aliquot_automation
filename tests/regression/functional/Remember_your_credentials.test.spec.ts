// Remember your credentials test
import { test, expect, Browser } from '@playwright/test';
import { goToAliquotQaLink, verifyAquaLogin } from '../../../pages/login/login.steps';
import { ALIQUOT_BASE_URL_QA, ALIQUOT_PASSWORD_QA, ALIQUOT_USERNAME_QA } from '../../../utils/constants';

test.describe('Remember your credentials', () => {
  test('Should successfully login with remember me', async ({ browser }: { browser: Browser }) => {
    // -------- First session: login with remember me --------
    const context1 = await browser.newContext();
    const page1 = await context1.newPage();

    await goToAliquotQaLink(page1);

    await page1.fill('input[placeholder="user@example.com"]', ALIQUOT_USERNAME_QA); //fill email field with valid credentials   
    await page1.fill('input[placeholder="*********"]', ALIQUOT_PASSWORD_QA); //fill password field with valid credentials  
    await page1.check('input[type="checkbox"]'); // remember me checkbox
    await page1.click('button:has-text("Login to Account")'); //click login button  

    await page1.waitForURL(ALIQUOT_BASE_URL_QA);
    await verifyAquaLogin(page1); //verify aqua login  

    await context1.close(); // simulate browser close

    // -------- Second session: reopen site --------
    const context2 = await browser.newContext();
    const page2 = await context2.newPage(); //new page  

    await goToAliquotQaLink(page2);

    // Verify login form is prefilled
    await expect(page2.inputValue('input[placeholder="user@example.com"]')).resolves.toBe(ALIQUOT_USERNAME_QA); //verify email field is prefilled with valid credentials  
    await expect(page2.inputValue('input[placeholder="*********"]')).resolves.toBe(ALIQUOT_PASSWORD_QA); //verify password field is prefilled with valid credentials  
    await expect(page2.locator('input[type="checkbox"]')).toBeChecked(); //verify remember me checkbox is checked  
    await expect(page2.locator('button:has-text("Login to Account")')).toBeEnabled(); //verify login button is enabled  

    // Now log in again to confirm
    await page2.click('button:has-text("Login to Account")'); //click login button  
    await page2.waitForURL(ALIQUOT_BASE_URL_QA);
    await verifyAquaLogin(page2); //verify aqua login   

    await context2.close(); //close second session  
  });
});
