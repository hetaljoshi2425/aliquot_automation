import { Page, expect } from '@playwright/test';

export const HomePage = {
  textLocators: {
    searchInput: 'Search for test types...',
    testTypesLi: 'Test Types',
    manageTypes: 'Manage Types',
    utilities: 'Utilities',
    dashboard: 'Dashboard',
    myDashboards: 'My Dashboards',
    trendsCharting: 'Trends Charting'
  },
  cssLocators: {
    searchInput: 'input[placeholder*="Search for test types"]',
    manageTypesButton: 'button:has-text("Manage Types")',
    utilitiesTab: '[role="tab"]:has-text("Utilities")',
    dashboardTab: 'nav span:has-text("Dashboard")',
    myDashboardsMenu: 'div:has-text("My Dashboards")',
    trendsChartingLink: 'a:has-text("Trends Charting")'
  },
  xpathLocators: {
    searchInput: '//input[contains(@placeholder, "Search for test types")]',
    manageTypesButton: '//button[text()="Manage Types"]',
    utilitiesTab: '//div[@role="tab" and text()="Utilities"]',
    dashboardTab: '//nav//span[text()="Dashboard"]',
    myDashboardsMenu: '//div[contains(text(),"My Dashboards")]',
    trendsChartingLink: '//a[contains(text(),"Trends Charting")]'
  }
};

export class HomePageActions {
  constructor(private page: Page) {}

  private dashboardTab = "//nav//span[text()='Dashboard']";
  private myDashboardsMenu = "//div[contains(text(),'My Dashboards')]";
  private trendsChartingLink = "//a[contains(text(),'Trends Charting')]";

  async clickManageTypesButton() {
    await this.page.click(HomePage.cssLocators.manageTypesButton);
    await this.page.waitForLoadState('networkidle');
  }

  async verifyManageTypesButtonVisible() {
    await expect(this.page.locator(HomePage.cssLocators.manageTypesButton)).toBeVisible();
  }

  async clickUtilitiesTab() {
    await this.page.click(HomePage.cssLocators.utilitiesTab);
    await this.page.waitForLoadState('networkidle');
  }

  async hoverDashboardTab() {
    await this.page.hover(this.dashboardTab);
    await this.page.waitForSelector(this.myDashboardsMenu, { state: 'visible' });
  }

  async goToTrendsCharting() {
    await this.page.click(this.trendsChartingLink);
    await this.page.waitForLoadState('networkidle');
  }

  async siteManagementTab() {
    await this.page.click('button[role="primarylight"][type="button"]');
    await this.page.waitForLoadState('networkidle');
  }

  async verifyClientNameVisible(clientName: string) {
    const clientSelector = `//span[contains(text(),"${clientName}")]`;
    await this.page.waitForSelector(clientSelector);
    await expect(this.page.locator(clientSelector)).toBeVisible();
  }
}
