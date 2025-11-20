
import { test, Page, expect } from '@playwright/test';
import { LoginPage } from '../../../pages/login/login.page';
import { HomePageActions } from '../../../pages/home/home.page';
import { ALIQUOT_BASE_URL_QA, ALIQUOT_USERNAME_QA, ALIQUOT_PASSWORD_QA } from '../../../utils/constants';

export class TrendsChartingPage {
  constructor(private page: Page) {}

  private filterCustomerInput = 'input[placeholder*="Filter Customer"]';
  private manageTemplateButton = 'button:has-text("Manage Template")';
  private saveAsTemplateButton = 'button:has-text("Save as Template")';
  private generateGraphButton = 'button:has-text("Generate Graph")';
  private seriesAndSettingsText = 'text=Series and Settings';
  private last30DaysText = 'text=last 30 days';
  private sourceDropdown = 'select[name="source"]';
  private componentDropdown = 'select[name="component"]';
  private testDropdown = 'select[name="test"]';
  private trendsGraphCanvas = '#trends-graph canvas, #trends-graph svg';

  async verifyTrendsPageLoaded() {
    await this.page.waitForLoadState('networkidle');

    await expect(this.page.getByRole('button', { name: 'Manage Template' })).toBeVisible();
    await expect(this.page.getByRole('button', { name: 'Save as Template' })).toBeVisible();
    await expect(this.page.getByRole('button', { name: 'Generate Graph' })).toBeVisible();
    await expect(this.page.getByText('Filter Customers')).toBeVisible();
  }

  async verifyGraphDefaultSettings() {
    await expect(this.page.locator(this.seriesAndSettingsText)).toBeVisible();
    await expect(this.page.locator(this.last30DaysText)).toBeVisible();
  }

  async selectDataSourceAndGenerate() {
    await this.page.locator(this.sourceDropdown).selectOption({ index: 1 });
    await this.page.locator(this.componentDropdown).selectOption({ index: 1 });
    await this.page.locator(this.testDropdown).selectOption({ index: 1 });
    await this.page.click(this.generateGraphButton);
    await expect(this.page.locator(this.trendsGraphCanvas)).toBeVisible();
  }
}

test.describe('Save Trend Report as a Template', () => {
  test('Should save trend report as a template', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const homePage = new HomePageActions(page);
    const trendsPage = new TrendsChartingPage(page);

    // 01 >> Login
    await test.step('Login with valid credentials', async () => {
      await loginPage.goToLogin(ALIQUOT_BASE_URL_QA);
      await page.waitForTimeout(3000);

      const username = ALIQUOT_USERNAME_QA || 'test@example.com';
      const password = ALIQUOT_PASSWORD_QA || 'testpassword';

      console.log(`Attempting login with username: ${username}`);
      await loginPage.login(username, password);
      await page.waitForTimeout(3000);
      await loginPage.verifyLoginSuccess(ALIQUOT_BASE_URL_QA);
    });

    // 03 >> Dashboard
    await test.step('Navigate to dashboard and verify it loads', async () => {
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(3000);
      await expect(page).toHaveURL(new RegExp(`${ALIQUOT_BASE_URL_QA}.*`));
    });

    // 04 >> Navigate to Trends
    await test.step('Navigate to Trends Charting page', async () => {
      await page.getByRole('button', { name: 'Dashboard' }).click();
      await page.getByText('Trends Charting').click();
      await page.locator('.sc-huXwEz').first().click();
      await page.getByText('Trends Report').click();
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(4000);
    });

    // 05 >> Verify elements
    await test.step('Verify trends charting page elements', async () => {
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(4000);
      await trendsPage.verifyTrendsPageLoaded();
    });

    // 06 >> Filter Customers panel
    await test.step('Filter Customers section', async () => {
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(4000);
      await expect(page.getByText('Filter Customers')).toBeVisible();
      await expect(page.getByText('Select Client')).toBeVisible();
      await expect(page.getByRole('button', { name: 'Clear Filters' })).toBeVisible();
    });

    // 08 >> Generate Graph - Select system filters
    await test.step('Generate Graph - Select system filters', async () => {
      // Wait for page to be fully loaded
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(4000);

      // --- Select Client ---
      await page.getByText('Select Client').click();
      await page.waitForTimeout(2000);
      await page.getByRole('cell', { name: 'Aquaphoenix' }).waitFor({ state: 'visible' });
      await page.getByRole('cell', { name: 'Aquaphoenix' }).click();
      await page.waitForTimeout(2000);

      // --- Select Customer ---
      await page.getByText('Select Customer').click();
      await page.waitForTimeout(2000);
      await page.getByRole('cell', { name: 'Customer Aps' }).waitFor({ state: 'visible' });
      await page.getByRole('cell', { name: 'Customer Aps' }).click();
      await page.waitForTimeout(2000);

      // --- Select Facility ---
      await page.getByText('Select Facility').click();
      await page.waitForTimeout(2000);
      await page.getByRole('cell', { name: 'Facility Aps' }).waitFor({ state: 'visible' });
      await page.getByRole('cell', { name: 'Facility Aps' }).click();
      await page.waitForTimeout(2000);

      // --- Select Building ---
      await page.getByText('Select Building').click();
      await page.waitForTimeout(2000);
      await page.getByRole('cell', { name: 'Building Aps' }).waitFor({ state: 'visible' });
      await page.getByRole('cell', { name: 'Building Aps' }).click();
      await page.waitForTimeout(2000);
      
      // --- Select System ---
      await page.getByText('Select System').click();
      await page.waitForTimeout(2000);
      await page.getByRole('cell', { name: 'System Aps' }).waitFor({ state: 'visible' });
      await page.getByRole('cell', { name: 'System Aps' }).click();
      await page.waitForTimeout(2000);
      
      // --- Select Data Source ---
      await page.getByText('Select Data Source').click();
      await page.waitForTimeout(2000);
      await page.getByText('Service Report', { exact: true }).waitFor({ state: 'visible' });
      await page.getByText('Service Report', { exact: true }).click();
      await page.waitForTimeout(1000);
      
      // --- Select Component ---
      await page.getByText('Select Component').click();
      await page.waitForTimeout(2000);
      await page.getByText('Raw').waitFor({ state: 'visible' });
      await page.getByText('Raw').click();
      await page.waitForTimeout(2000);

      // --- Select Test ---
      await page.getByText('Select Test').click();
      await page.waitForTimeout(2000);
      await page.getByText('Alkalinity, P (Ppm As Caco3)').waitFor({ state: 'visible' });
      await page.getByText('Alkalinity, P (Ppm As Caco3)').click();
      await page.waitForTimeout(2000);
      
      // Click on Save as Template button
      await page.getByRole('button', { name: 'Save as Template' }).click();
      await page.waitForTimeout(2000);
      await page.getByPlaceholder('Enter template name').fill('Test Template');
      await page.waitForTimeout(2000);
      await page.getByRole('button', { name: 'Save' }).click();
      await page.waitForTimeout(2000);

      // Verify the success message is displayed
      await page.getByText('Template added successfully').waitFor({ state: 'visible' });
      await expect(page.getByText('Template added successfully')).toBeVisible();
      await page.waitForTimeout(2000);

      // Click on Template dropdown (Select Template) from settings and select the saved template and verify it is saved correctly
      await page.getByRole('button', { name: 'Select Template' }).click();
      await page.waitForTimeout(2000);
      await page.getByText('Select Template').click();
      await page.waitForTimeout(2000);
      await page.getByText('Test Template').click();
      await page.waitForTimeout(2000);
      
    });
  });
});