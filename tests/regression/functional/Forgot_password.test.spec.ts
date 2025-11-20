// Forgot Password: verify user navigates to forgot password page
import { Page, test, expect } from '@playwright/test';

import {
  goToAliquotQaLink,
} from '../../../pages/login/login.steps';

import { 
  ALIQUOT_BASE_URL_QA
} from '../../../utils/constants';



// Build the forgot password URL from base + path
const forgotPasswordUrl = ALIQUOT_BASE_URL_QA + '/forgot-password';
const forgotPasswordText = 'Forgot Password';

test.describe('Forgot Password', () => {
  test('Should successfully navigate to forgot password page', async ({ page }: { page: Page }) => {
    await test.step('Navigate to login page', async () => {
      await goToAliquotQaLink(page);
    });

    await test.step('Click here to retrieve it', async () => {
      await page.getByText(forgotPasswordText).click();
        // OR (preferred if defined in Page Object)
      // await page.click(LoginPage.textLocators.forgotPasswordLink);
    });

    await test.step('Verify navigation and UI', async () => {
      await page.waitForURL(forgotPasswordUrl);
      await expect(page.getByText(forgotPasswordText)).toBeVisible();
    });
  });
});

