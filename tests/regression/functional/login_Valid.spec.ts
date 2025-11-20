// Login with valid credentials

import { Page, test, expect } from '@playwright/test';
import {
  goToAliquotQaLink,
  loginAquaUser,
  verifyAquaLoginQa
} 

from '../../../pages/login/login.steps';
import { 
  ALIQUOT_USERNAME_QA, 
  ALIQUOT_PASSWORD_QA,
  ALIQUOT_BASE_URL_QA
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

    // await test.step('Verify dashboard elements are present', async () => {
    // Verify we're on the dashboard by checking for common dashboard elements
    //   await expect(page.locator('body')).toBeVisible();
    });
  // });
});
