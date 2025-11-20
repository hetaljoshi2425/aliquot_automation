import { test, expect } from '@playwright/test';
import { LoginPage } from '../../../pages/login/login.page';
import { HomePageActions } from '../../../pages/home/home.page';
import { ALIQUOT_BASE_URL_QA, ALIQUOT_USERNAME_QA, ALIQUOT_PASSWORD_QA } from '../../../utils/constants';

test.describe('Report Setup (via New Report)', () => {
  test('REGRESSION: Report Setup via New Report saves successfully', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const homePage = new HomePageActions(page);

    // 1) Login
    await test.step('Login', async () => {
      await loginPage.goToLogin(ALIQUOT_BASE_URL_QA);
      await loginPage.login(ALIQUOT_USERNAME_QA || 'test@example.com', ALIQUOT_PASSWORD_QA || 'testpassword');
      await loginPage.verifyLoginSuccess(ALIQUOT_BASE_URL_QA);
    });

    // 2) Open New Report
    await test.step('Navigate to New Report', async () => {
      // Ensure dashboard is ready
      await page.waitForLoadState('networkidle');
      // Click New Report using robust selectors
      const newReport = page.getByRole('button', { name: 'New Report' })
        .or(page.getByText('New Report'))
        .or(page.locator('button:has-text("New Report")'))
        .or(page.locator('[data-testid="new-report-button"]'))
        .or(page.locator('button[title*="New Report"]'));
      await newReport.first().click();
      await page.waitForLoadState('networkidle');
    });

    // 3) Verify Report Setup page
    await test.step('Verify Report Setup page', async () => {
      const newReportHeading = page.getByRole('heading', { name: 'New Report' })
        .or(page.getByRole('heading', { name: 'Create Report' }))
        .or(page.locator('h1:has-text("New Report")'))
        .or(page.locator('h1:has-text("Create Report")'));
      await expect(newReportHeading).toBeVisible({ timeout: 15000 });
    });

    // 4) Fill Report Details: Name/Title
    const reportTitle = `Auto Report ${Date.now()}`;
    await test.step('Fill report name/title', async () => {
      const titleInput = page.getByRole('textbox', { name: 'Report Title' })
        .or(page.getByLabel('Report Title'))
        .or(page.locator('input[name="reportTitle"]'))
        .or(page.locator('[data-testid="report-title-input"]'))
        .or(page.locator('input[placeholder*="Report Title"]'))
        .or(page.locator('input[placeholder*="Title"]'));
      await titleInput.first().fill(reportTitle);
    });

    // 5) Select Report Type
    await test.step('Select report type', async () => {
      const typeDropdown = page.getByRole('combobox', { name: 'Report Type' })
        .or(page.getByLabel('Report Type'))
        .or(page.locator('select[name="reportType"]'))
        .or(page.locator('[data-testid="report-type-dropdown"]'))
        .or(page.locator('select:has-text("Report Type")'));
      if ((await typeDropdown.count()) > 0) {
        try {
          await typeDropdown.first().selectOption({ index: 1 });
        } catch {
          await typeDropdown.first().click();
          await page.getByRole('option').first().click();
        }
      }
    });

    // 6) Date Range (From/To)
    await test.step('Set date range', async () => {
      const fromInput = page.getByRole('textbox', { name: /Date From|From|Start Date/i })
        .or(page.getByLabel(/Date From|From|Start Date/i))
        .or(page.locator('input[name*="dateFrom"], input[name*="fromDate"], input[placeholder*="Date From"], input[placeholder*="Start"]'));
      const toInput = page.getByRole('textbox', { name: /Date To|To|End Date/i })
        .or(page.getByLabel(/Date To|To|End Date/i))
        .or(page.locator('input[name*="dateTo"], input[name*="toDate"], input[placeholder*="Date To"], input[placeholder*="End"]'));

      if ((await fromInput.count()) > 0) {
        await fromInput.first().fill('01/01/2024');
      }
      if ((await toInput.count()) > 0) {
        await toInput.first().fill('12/31/2024');
      }
    });

    // 7) Select Customers
    await test.step('Select customers', async () => {
      const customerDropdown = page.getByRole('combobox', { name: 'Select Customer' })
        .or(page.getByLabel('Customer'))
        .or(page.locator('[data-testid="customer-dropdown"]'))
        .or(page.locator('select[name="customer"]'))
        .or(page.locator('input[placeholder*="Select Customer"], input[placeholder*="Customer"]'));

      if ((await customerDropdown.count()) > 0) {
        const control = customerDropdown.first();
        try {
          await control.selectOption({ index: 1 });
        } catch {
          await control.click();
          const option = page.getByRole('option').first().or(page.getByRole('cell').first());
          if ((await option.count()) > 0) {
            await option.first().click();
          }
        }
      }
    });

    // 8) Set Parameters (example toggles)
    await test.step('Configure parameters', async () => {
      const driveToggle = page.getByRole('switch', { name: 'Drive/On-site time' })
        .or(page.getByLabel('Drive/On-site time'))
        .or(page.locator('[data-testid="toggle-drive-time"]'))
        .or(page.locator('input[type="checkbox"][name*="drive"]'));
      if ((await driveToggle.count()) > 0) {
        await driveToggle.first().click().catch(() => {});
      }

      const reportNumberToggle = page.getByRole('switch', { name: 'Report Number' })
        .or(page.getByLabel('Report Number'))
        .or(page.locator('[data-testid="toggle-report-number"]'))
        .or(page.locator('input[type="checkbox"][name*="reportNumber"]'));
      if ((await reportNumberToggle.count()) > 0) {
        await reportNumberToggle.first().click().catch(() => {});
      }
    });

    // 9) Save / Create Report
    await test.step('Save report', async () => {
      const saveBtn = page.getByRole('button', { name: 'Create Report' })
        .or(page.getByText('Create Report'))
        .or(page.locator('button:has-text("Create Report")'))
        .or(page.locator('[data-testid="create-report-btn"]'))
        .or(page.getByRole('button', { name: 'Save' }))
        .or(page.locator('button:has-text("Save")'));
      await saveBtn.first().click();
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(2000);
    });

    // 10) Verify success message
    await test.step('Verify success message', async () => {
      const success = page.getByText('Report created successfully')
        .or(page.getByText('Successfully saved'))
        .or(page.getByText('Report saved successfully'))
        .or(page.locator('.alert-success, .success-message, [data-testid="success-message"]'));
      await expect(success).toBeVisible({ timeout: 15000 });
    });
  });
});


