import { Page, expect, test } from '@playwright/test';
import { HomePage, HomePageActions } from './home.page';

/**
 * Class for step definitions related to Home Page
 */
export class HomeSteps {
  private actions: HomePageActions;

  constructor(private page: Page) {
    this.actions = new HomePageActions(page);
  }

  /**
   * Step: Click on 'Manage Types' button
   */
  async clickManageTypesButton() {
    await this.actions.clickManageTypesButton();
  }

  /**
   * Step: Verify 'Manage Types' button is visible
   */
  async verifyManageTypesButtonVisible() {
    await this.actions.verifyManageTypesButtonVisible();
  }

  /**
   * Step: Click on 'Utilities' tab
   */
  async clickUtilitiesTab() {
    await this.actions.clickUtilitiesTab();
  }

  /**
   * Step: Hover over the Dashboard tab to show 'My Dashboards'
   */
  async hoverOverDashboardTab() {
    await this.actions.hoverDashboardTab();
  }

  /**
   * Step: Verify specific client name is visible
   * @param clientName - The client name to verify
   */
  async verifyClientNameVisible(clientName: string) {
    await this.actions.verifyClientNameVisible(clientName);
  }

  /**
   * Step: Search for a Test Type in the search input
   * @param searchTerm - The term to search
   */
  async searchTestType(searchTerm: string) {
    await this.page.fill(`input[placeholder="${HomePage.textLocators.searchInput}"]`, searchTerm);
    await this.page.keyboard.press('Enter');
    await this.page.waitForTimeout(1000); // Adjust wait for search results if needed
  }

  /**
   * Step: Verify that Test Type list is visible
   */
  async verifyTestTypeListVisible() {
    await this.page.waitForSelector(`text=${HomePage.textLocators.testTypesLi}`);
  }
}

// Standalone functions for site management navigation
export const hoverSiteManagementButton = async (page: Page) => {
  const siteManagementButton = page.locator('button[role="primarylight"]:has-text("Site Management")');
  
  // Wait for the button to be attached to the DOM and then check if it's visible
  await test.step('Wait for Site Management button to be visible and hover over it', async () => {
    console.log('🏢 Waiting for Site Management button to be attached and visible...');
    
    // Wait for the button to be attached to the DOM and visible with an extended timeout
    await siteManagementButton.waitFor({ state: 'visible', timeout: 15000 }); // Increase timeout to 15 seconds

    // Ensure the button is in view before hovering
    await siteManagementButton.scrollIntoViewIfNeeded();

    // Check if the button is visible before hovering
    if (await siteManagementButton.isVisible()) {
      await siteManagementButton.hover(); // Hover over the button
      console.log('🏢 Hovered over Site Management button successfully');
    } else {
      console.log('⚠️ Site Management button is not visible.');
    }
  });
};

export const clickClearFiltersBtn = async (page: Page) => {
  await test.step('Click Clear Filters button', async () => {
    console.log('🧹 Clicking Clear Filters button');
    const clearFiltersBtn = page.locator('button:has-text("Clear Filters"), .clear-filters, [data-testid="clear-filters"]');
    await clearFiltersBtn.waitFor({ state: 'visible', timeout: 30000 });
    await clearFiltersBtn.click();
    await page.waitForTimeout(1000);
  });
};

export const clickManageBuildings = async (page: Page) => {
  await test.step('Click Manage Buildings', async () => {
    console.log('🏗️ Clicking Manage Buildings');
    const manageBuildingsBtn = page.locator('a:has-text("Manage Buildings"), [data-testid="manage-buildings"]');
    await manageBuildingsBtn.waitFor({ state: 'visible', timeout: 30000 });
    await manageBuildingsBtn.click();
    await page.waitForTimeout(2000);
  });
};

// Site Management Customer Functions
export const clickSelectCustomerOnSiteManagement = async (page: Page) => {
  await test.step('Click Select Customer on Site Management', async () => {
    console.log('👤 Clicking Select Customer on Site Management');
    const selectCustomerBtn = page.locator('button:has-text("Select Customer"), [data-testid="select-customer"], .select-customer');
    await selectCustomerBtn.waitFor({ state: 'visible', timeout: 30000 });
    await selectCustomerBtn.click();
    await page.waitForTimeout(1000);
  });
};

export const searchCustomerOnSiteManagement = async (page: Page, searchTerm: string) => {
  await test.step(`Search Customer: ${searchTerm}`, async () => {
    console.log(`🔍 Searching for customer: ${searchTerm}`);
    const searchInput = page.locator('input[placeholder*="customer"], input[placeholder*="Customer"], [data-testid="customer-search"]');
    await searchInput.waitFor({ state: 'visible', timeout: 30000 });
    await searchInput.fill(searchTerm);
    await page.waitForTimeout(1000);
  });
};

export const selectCustomerInSearchListOnSiteManagement = async (page: Page, customerName: string) => {
  await test.step(`Select Customer: ${customerName}`, async () => {
    console.log(`✅ Selecting customer: ${customerName}`);
    const customerOption = page.locator(`li:has-text("${customerName}"), .customer-option:has-text("${customerName}")`);
    await customerOption.waitFor({ state: 'visible', timeout: 30000 });
    await customerOption.click();
    await page.waitForTimeout(1000);
  });
};

// Site Management Facility Functions
export const clickSelectFacilityOnSiteManagement = async (page: Page) => {
  await test.step('Click Select Facility on Site Management', async () => {
    console.log('🏢 Clicking Select Facility on Site Management');
    const selectFacilityBtn = page.locator('button:has-text("Select Facility"), [data-testid="select-facility"], .select-facility');
    await selectFacilityBtn.waitFor({ state: 'visible', timeout: 30000 });
    await selectFacilityBtn.click();
    await page.waitForTimeout(1000);
  });
};

export const searchFacilityOnSiteManagement = async (page: Page, searchTerm: string) => {
  await test.step(`Search Facility: ${searchTerm}`, async () => {
    console.log(`🔍 Searching for facility: ${searchTerm}`);
    const searchInput = page.locator('input[placeholder*="facility"], input[placeholder*="Facility"], [data-testid="facility-search"]');
    await searchInput.waitFor({ state: 'visible', timeout: 30000 });
    await searchInput.fill(searchTerm);
    await page.waitForTimeout(1000);
  });
};

export const selectFacilityInSearchListOnSiteManagement = async (page: Page, facilityName: string) => {
  await test.step(`Select Facility: ${facilityName}`, async () => {
    console.log(`✅ Selecting facility: ${facilityName}`);
    const facilityOption = page.locator(`li:has-text("${facilityName}"), .facility-option:has-text("${facilityName}")`);
    await facilityOption.waitFor({ state: 'visible', timeout: 30000 });
    await facilityOption.click();
    await page.waitForTimeout(1000);
  });
};

// Site Management Building Functions
export const clickSelectBuildingOnSiteManagement = async (page: Page) => {
  await test.step('Click Select Building on Site Management', async () => {
    console.log('🏗️ Clicking Select Building on Site Management');
    const selectBuildingBtn = page.locator('button:has-text("Select Building"), [data-testid="select-building"], .select-building');
    await selectBuildingBtn.waitFor({ state: 'visible', timeout: 30000 });
    await selectBuildingBtn.click();
    await page.waitForTimeout(1000);
  });
};

export const searchBuildingOnSiteManagement = async (page: Page, searchTerm: string) => {
  await test.step(`Search Building: ${searchTerm}`, async () => {
    console.log(`🔍 Searching for building: ${searchTerm}`);
    const searchInput = page.locator('input[placeholder*="building"], input[placeholder*="Building"], [data-testid="building-search"]');
    await searchInput.waitFor({ state: 'visible', timeout: 30000 });
    await searchInput.fill(searchTerm);
    await page.waitForTimeout(1000);
  });
};

export const selectBuildingInSearchListOnSiteManagement = async (page: Page, buildingName: string) => {
  await test.step(`Select Building: ${buildingName}`, async () => {
    console.log(`✅ Selecting building: ${buildingName}`);
    const buildingOption = page.locator(`li:has-text("${buildingName}"), .building-option:has-text("${buildingName}")`);
    await buildingOption.waitFor({ state: 'visible', timeout: 30000 });
    await buildingOption.click();
    await page.waitForTimeout(1000);
  });
};

// Critical functionality test functions
export const verifyShowAllTabVisible = async (page: Page) => {
  await test.step('Verify Show All tab is visible', async () => {
    console.log('👁️ Verifying Show All tab is visible');
    const showAllTab = page.locator('[data-testid="show-all-tab"], .show-all-tab, button:has-text("Show All")');
    await showAllTab.waitFor({ state: 'visible', timeout: 30000 });
    await expect(showAllTab).toBeVisible();
  });
};

export const clickShowAllTab = async (page: Page) => {
  await test.step('Click Show All tab', async () => {
    console.log('🖱️ Clicking Show All tab');
    const showAllTab = page.locator('[data-testid="show-all-tab"], .show-all-tab, button:has-text("Show All")');
    await showAllTab.waitFor({ state: 'visible', timeout: 30000 });
    await showAllTab.click();
    await page.waitForTimeout(1000);
  });
};

export const clickUserManagementTab = async (page: Page) => {
  await test.step('Click User Management tab', async () => {
    console.log('👥 Clicking User Management tab');
    const userManagementTab = page.locator('[data-testid="user-management-tab"], .user-management-tab, button:has-text("User Management")');
    await userManagementTab.waitFor({ state: 'visible', timeout: 30000 });
    await userManagementTab.click();
    await page.waitForTimeout(1000);
  });
};

export const clickGlobalUserCheckbox = async (page: Page) => {
  await test.step('Click Global User checkbox', async () => {
    console.log('☑️ Clicking Global User checkbox');
    const globalUserCheckbox = page.locator('[data-testid="global-user-checkbox"], input[type="checkbox"]:near(text="Global User")');
    await globalUserCheckbox.waitFor({ state: 'visible', timeout: 30000 });
    await globalUserCheckbox.click();
    await page.waitForTimeout(1000);
  });
};

export const clickSelectClientIfVisible = async (page: Page) => {
  await test.step('Click Select Client if visible', async () => {
    console.log('🔍 Clicking Select Client if visible');
    const selectClientBtn = page.locator('[data-testid="select-client"], button:has-text("Select Client"), .select-client');
    if (await selectClientBtn.isVisible()) {
      await selectClientBtn.click();
      await page.waitForTimeout(1000);
    } else {
      console.log('Select Client button not visible, skipping');
    }
  });
};

export const fillClientSearchInput = async (page: Page, searchTerm: string) => {
  await test.step(`Fill client search input with: ${searchTerm}`, async () => {
    console.log(`🔍 Filling client search input with: ${searchTerm}`);
    const searchInput = page.locator('[data-testid="client-search-input"], input[placeholder*="client"], input[placeholder*="Client"]');
    await searchInput.waitFor({ state: 'visible', timeout: 30000 });
    await searchInput.fill(searchTerm);
    await page.waitForTimeout(1000);
  });
};

export const clickClientDropdownOption = async (page: Page, optionText: string) => {
  await test.step(`Click client dropdown option: ${optionText}`, async () => {
    console.log(`📋 Clicking client dropdown option: ${optionText}`);
    const option = page.locator(`[data-testid="client-dropdown-option"], .dropdown-option:has-text("${optionText}")`);
    await option.waitFor({ state: 'visible', timeout: 30000 });
    await option.click();
    await page.waitForTimeout(1000);
  });
};

export const clickManageTypesButton = async (page: Page) => {
  await test.step('Click Manage Types button', async () => {
    console.log('⚙️ Clicking Manage Types button');
    const manageTypesBtn = page.locator('[data-testid="manage-types-button"], button:has-text("Manage Types")');
    await manageTypesBtn.waitFor({ state: 'visible', timeout: 30000 });
    await manageTypesBtn.click();
    await page.waitForTimeout(1000);
  });
};

export const clickTestTypesItem = async (page: Page) => {
  await test.step('Click Test Types item', async () => {
    console.log('🧪 Clicking Test Types item');
    const testTypesItem = page.locator('[data-testid="test-types-item"], .test-types-item, a:has-text("Test Types")');
    await testTypesItem.waitFor({ state: 'visible', timeout: 30000 });
    await testTypesItem.click();
    await page.waitForTimeout(1000);
  });
};

export const verifyClientNameVisible = async (page: Page, clientName?: string) => {
  await test.step(`Verify client name is visible${clientName ? `: ${clientName}` : ''}`, async () => {
    console.log(`👤 Verifying client name is visible${clientName ? `: ${clientName}` : ''}`);
    const clientNameElement = clientName 
      ? page.locator(`[data-testid="client-name"], .client-name:has-text("${clientName}")`)
      : page.locator('[data-testid="client-name"], .client-name');
    await clientNameElement.waitFor({ state: 'visible', timeout: 30000 });
    await expect(clientNameElement).toBeVisible();
  });
};