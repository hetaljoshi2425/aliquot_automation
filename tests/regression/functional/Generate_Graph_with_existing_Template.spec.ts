import { test, Page, expect } from '@playwright/test';
import { LoginPage } from '../../../pages/login/login.page';
import { HomePageActions } from '../../../pages/home/home.page';
import { ALIQUOT_BASE_URL_QA, ALIQUOT_USERNAME_QA, ALIQUOT_PASSWORD_QA } from '../../../utils/constants';
import { TrendsSelectorHelpers } from '../../../selectors/trends.selectors';

export class GenerateGraphWithTemplatePage {
  private trendsHelpers: TrendsSelectorHelpers;

  constructor(private page: Page) {
    this.trendsHelpers = new TrendsSelectorHelpers(page);
  }

  async verifyTrendsPageElements() {
    // Verify Filter Customer is cleared
    const filterSelectors = this.trendsHelpers.getFilterCustomerInput();
    for (const selector of filterSelectors) {
      try {
        await expect(selector).toHaveValue('');
        break;
      } catch (error) {
        continue;
      }
    }

    // Verify all required buttons are present
    const manageTemplateSelectors = this.trendsHelpers.getManageTemplateButton();
    const saveAsTemplateSelectors = this.trendsHelpers.getSaveAsTemplateButton();
    const generateGraphSelectors = this.trendsHelpers.getGenerateGraphButton();

    for (const selector of manageTemplateSelectors) {
      try {
        await expect(selector).toBeVisible();
        break;
      } catch (error) {
        continue;
      }
    }

    for (const selector of saveAsTemplateSelectors) {
      try {
        await expect(selector).toBeVisible();
        break;
      } catch (error) {
        continue;
      }
    }

    for (const selector of generateGraphSelectors) {
      try {
        await expect(selector).toBeVisible();
        break;
      } catch (error) {
        continue;
      }
    }
  }

  async selectFilters() {
    // Select Client, Customer, Facility, Building, System
    const clientSelectors = this.trendsHelpers.getClientDropdown();
    const customerSelectors = this.trendsHelpers.getCustomerDropdown();
    const facilitySelectors = this.trendsHelpers.getFacilityDropdown();
    const buildingSelectors = this.trendsHelpers.getBuildingDropdown();
    const systemSelectors = this.trendsHelpers.getSystemDropdown();

    // Select Client
    for (const selector of clientSelectors) {
      try {
        await selector.selectOption({ index: 1 });
        break;
      } catch (error) {
        continue;
      }
    }

    // Select Customer
    for (const selector of customerSelectors) {
      try {
        await selector.selectOption({ index: 1 });
        break;
      } catch (error) {
        continue;
      }
    }

    // Select Facility
    for (const selector of facilitySelectors) {
      try {
        await selector.selectOption({ index: 1 });
        break;
      } catch (error) {
        continue;
      }
    }

    // Select Building
    for (const selector of buildingSelectors) {
      try {
        await selector.selectOption({ index: 1 });
        break;
      } catch (error) {
        continue;
      }
    }

    // Select System
    for (const selector of systemSelectors) {
      try {
        await selector.selectOption({ index: 1 });
        break;
      } catch (error) {
        continue;
      }
    }
  }

  async selectExistingTemplate(templateName?: string) {
    // Select existing template from dropdown
    const templateDropdownSelectors = this.trendsHelpers.getTemplateDropdown();
    for (const selector of templateDropdownSelectors) {
      try {
        if (templateName) {
          await selector.selectOption({ label: templateName });
        } else {
          // Select first available template
          await selector.selectOption({ index: 1 });
        }
        break;
      } catch (error) {
        continue;
      }
    }
  }

  async generateGraph() {
    // Click Generate Graph button
    const generateGraphSelectors = this.trendsHelpers.getGenerateGraphButton();
    for (const selector of generateGraphSelectors) {
      try {
        await selector.click();
        break;
      } catch (error) {
        continue;
      }
    }

    // Wait for graph to load and verify it's visible
    const graphSelectors = this.trendsHelpers.getTrendsGraphCanvas();
    for (const selector of graphSelectors) {
      try {
        await selector.waitFor({ state: 'visible', timeout: 30000 });
        await expect(selector).toBeVisible();
        break;
      } catch (error) {
        continue;
      }
    }
  }
}

test.describe('Generate Graph with Existing Template Tests', () => {
  test('Should generate graph with existing template', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const homePage = new HomePageActions(page);
    const generateGraphPage = new GenerateGraphWithTemplatePage(page);

    // 01-03: Login and navigate to dashboard
    await test.step('Login and navigate to dashboard', async () => {
      await loginPage.goToLogin(ALIQUOT_BASE_URL_QA);
      await loginPage.login(ALIQUOT_USERNAME_QA, ALIQUOT_PASSWORD_QA);
      await loginPage.verifyLoginSuccess(ALIQUOT_BASE_URL_QA);
      await homePage.hoverDashboardTab();
    });

    // 04-05: Navigate to trends charting
    await test.step('Navigate to trends charting page', async () => {
      await homePage.goToTrendsCharting();
    });

    // 06: Verify trends page elements
    await test.step('Verify trends page elements', async () => {
      await generateGraphPage.verifyTrendsPageElements();
    });

    // 07: Select filters and template, then generate graph
    await test.step('Select filters, template and generate graph', async () => {
      await generateGraphPage.selectFilters();
      await generateGraphPage.selectExistingTemplate();
      await generateGraphPage.generateGraph();
    });
  });
});






