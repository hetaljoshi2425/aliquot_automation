import { test, expect } from '@playwright/test';
import { allure } from 'allure-playwright';
import { TestSetup } from '../utils/testSetup';
import { LoginPage } from '../pages/LoginPage';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

test.describe('Login Functionality - Valid Credentials', () => {
  let testSetup: TestSetup;
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    // Initialize page objects
    testSetup = new TestSetup(page);
    loginPage = new LoginPage(page);
  });

  test.afterEach(async ({ page }) => {
    // No cleanup needed for this test
    console.log('Test completed - no cleanup required');
  });

  test('Should login with valid credentials', async ({ page }) => {
    await allure.step('Login with valid QA credentials', async () => {
      await testSetup.loginWithValidCredentials();
    });

    await allure.step('Wait for page to load fully after login', async () => {
      // Wait for network to be idle (no pending requests)
      await page.waitForLoadState('networkidle');

      // Wait for any dynamic content to load
      await page.waitForTimeout(1000);

      // Wait for any remaining elements to render
      await page.waitForLoadState('domcontentloaded');

      // Additional wait to ensure everything is fully rendered
      await page.waitForTimeout(1000);
    });

    await allure.step('Take screenshot after login', async () => {
      await page.screenshot({
        path: 'screenshots/after-login.png',
        fullPage: true
      });
    });

    await allure.step('Verify successful login', async () => {
      // Login verification - if we reach this point, login was successful
      console.log('Login verification completed - test passed');

      // Check current URL and handle potential redirects
      const currentUrl = await page.url();
      console.log(`Current URL after login: ${currentUrl}`);

      // If we're on login page, wait for the redirect to complete
      if (currentUrl.includes('/login') || currentUrl.includes('/signin')) {
        console.log('Detected login page flicker, waiting for redirect...');

        // Wait for the URL to change away from login page
        try {
          await page.waitForURL(url => !url.toString().includes('/login') && !url.toString().includes('/signin'), { timeout: 10000 });
          const finalUrl = await page.url();
          console.log(`Final URL after redirect: ${finalUrl}`);
        } catch (error) {
          // If waitForURL times out, wait a bit more and check again
          console.log('WaitForURL timed out, checking URL again...');
          await page.waitForTimeout(1000);
          const finalUrl = await page.url();
          console.log(`Final URL after additional wait: ${finalUrl}`);

          // If still on login page, there might be an issue
          if (finalUrl.includes('/login') || finalUrl.includes('/signin')) {
            throw new Error('Login failed - still on login page after waiting for redirect');
          }
        }
      }

      console.log('Successfully redirected away from login page - test passed');

      // Verify the search icon is visible and clickable
      const searchIcon = page.locator('.header-icon.aps-click').first();
      expect(searchIcon).toBeVisible();
      console.log('Search icon verification completed - test passed');

      // Click on the search icon
      await searchIcon.click();
      console.log('Search icon clicked - test passed');

      // Wait for the search page to load
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(1000);

      // Verify the search input is visible
      const searchInput = page.locator('input[placeholder*="systems by id" i], input[name="searchInput"]').first();
      expect(searchInput).toBeVisible();
      console.log('Search input verification completed - test passed');

      // Take a screenshot of the search page
      await page.screenshot({
        path: 'screenshots/search-page.png',
        fullPage: true
      });
      console.log('Search page screenshot captured - test passed');

      // Wait for search input to be visible and then enter the system id
      await searchInput.waitFor({ state: 'visible', timeout: 10000 });
      console.log('Search input is now visible');
      await searchInput.fill('74052');
      await page.waitForTimeout(1000);
      console.log('System id entered in search input - test passed');

      // Verify the search input has the correct value
      const inputValue = await searchInput.inputValue();
      expect(inputValue).toBe('74052');
      await page.waitForTimeout(1000);
      console.log('Search input value verification completed - test passed');

      // Take a screenshot after entering the search term
      await page.screenshot({
        path: 'screenshots/search-with-input.png',
        fullPage: true
      });
      console.log('Search input screenshot captured - test passed');

      // Select the result from table row and wait for the dashboard to load and take screenshot
      const resultRow = page.locator('tr:has-text("74052"), .table-row:has-text("74052")').first();
      await resultRow.click();
      await page.waitForTimeout(1000);
      await page.screenshot({
        path: 'screenshots/result-row-clicked.png',
        fullPage: true
      });
      console.log('Result row clicked - test passed');

      // Wait for the dashboard to load
      await page.waitForTimeout(1000);
      // Verify the dashboard is loaded and take screenshot
      const dashboard = page.locator('div:has-text("Dashboard"), .dashboard, div[data-testid="dashboard"]').first();
      expect(dashboard).toBeVisible();
      await page.screenshot({
        path: 'screenshots/dashboard.png',
        fullPage: true
      });
      console.log('Dashboard verification completed - test passed');

      // Verify the New Report button is visible
      const newReportButton = page.locator('button:has-text("New Report"), .btn-create-report, button[class*="btn-create-report"]');
      expect(newReportButton).toBeVisible();
      console.log('New Report button verification completed - test passed');

      // Step 1: Hover on the Reports button and select Surveys option, wait for the page to load and take screenshot
      const reportsButton = page.locator('button:has-text("Reports")').first();
      await reportsButton.hover();
      await page.waitForTimeout(1000);
      const surveysOption = page.locator('.aps-row.aps-click:has-text("Surveys")').first();
      await surveysOption.click();
      await page.waitForTimeout(1000);
      await page.screenshot({
        path: 'screenshots/surveys-option.png',
        fullPage: true
      });
      console.log('Surveys option clicked successfully');

      // Wait for page to load fully
      await page.waitForLoadState('networkidle');
      console.log('Network idle state reached');

      // Wait for additional time to ensure page is fully rendered
      await page.waitForTimeout(1000);
      console.log('Additional wait completed for Surveys page');    
      await page.screenshot({
        path: 'screenshots/surveys-option.png',
        fullPage: true
      });
      console.log('Surveys option clicked - test passed');
      
      const currentUrl2 = await page.url();
      console.log(`Current URL after Surveys option click: ${currentUrl2}`);
      expect(currentUrl2).toContain('/surveys');
      console.log('Surveys option click URL verification completed - test passed'); 
    });
  });
});
