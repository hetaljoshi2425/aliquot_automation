import { test, Page, expect } from '@playwright/test';
import { LoginPage } from '../login/login.page';
import { HomePageActions } from '../home/home.page';
import { ALIQUOT_BASE_URL_QA, ALIQUOT_USERNAME_QA, ALIQUOT_PASSWORD_QA } from '../../utils/constants';

export class TrendsChartingPage {
  constructor(private page: Page) {}

  private trendsPageTitle = "//h1[contains(text(),'Trends Charting')]";
  private clientFilterDropdown = "//select[@name='client']";
  private dataSourceDropdown = "//select[@name='dataSource']";
  private generateGraphButton = "//button[contains(text(),'Generate Graph')]";
  private graphContainer = "//div[contains(@class,'graph-container')]";
  private defaultSettingsSection = "//div[contains(@class,'default-settings')]";

  async verifyTrendsPageLoaded() {
    await this.page.waitForSelector(this.trendsPageTitle, { state: 'visible' });
    await expect(this.page.locator(this.trendsPageTitle)).toBeVisible();
  }

  async selectFiltersAndGenerateGraph(clientName: string) {
    // Select client from dropdown
    await this.page.selectOption(this.clientFilterDropdown, { label: clientName });
    
    // Click generate graph button
    await this.page.click(this.generateGraphButton);
    
    // Wait for graph to load
    await this.page.waitForSelector(this.graphContainer, { state: 'visible' });
  }

  async verifyGraphDefaultSettings() {
    await this.page.waitForSelector(this.defaultSettingsSection, { state: 'visible' });
    await expect(this.page.locator(this.defaultSettingsSection)).toBeVisible();
  }

  async selectDataSourceAndGenerate() {
    // Select a data source (assuming first option for now)
    await this.page.selectOption(this.dataSourceDropdown, { index: 0 });
    
    // Generate the trends graph
    await this.page.click(this.generateGraphButton);
    
    // Wait for graph to update
    await this.page.waitForSelector(this.graphContainer, { state: 'visible' });
  }
}

test.describe('Trends Charting Page Tests', () => {
  test('Should navigate to trends charting and verify elements', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const homePage = new HomePageActions(page);
    const trendsPage = new TrendsChartingPage(page);

    await test.step('Login with valid credentials', async () => {
      await loginPage.goToLogin(ALIQUOT_BASE_URL_QA);
      await loginPage.login(ALIQUOT_USERNAME_QA, ALIQUOT_PASSWORD_QA);
      await loginPage.verifyLoginSuccess(ALIQUOT_BASE_URL_QA);
    });

    await test.step('Navigate to Trends Charting page', async () => {
      await homePage.hoverDashboardTab();
      await homePage.goToTrendsCharting();
    });

    await test.step('Verify Trends Charting page elements', async () => {
      await trendsPage.verifyTrendsPageLoaded();
    });

    await test.step('Select filters and generate graph', async () => {
      await trendsPage.selectFiltersAndGenerateGraph('Expected client name');
    });

    await test.step('Verify Graph default settings', async () => {
      await trendsPage.verifyGraphDefaultSettings();
    });

    await test.step('Select data source and generate trends graph', async () => {
      await trendsPage.selectDataSourceAndGenerate();
    });
  });
});

