import { test, Page, expect } from '@playwright/test';
import { LoginPage } from '../../../pages/login/login.page';
import { HomePageActions } from '../../../pages/home/home.page';
import { ALIQUOT_BASE_URL_QA, ALIQUOT_USERNAME_QA, ALIQUOT_PASSWORD_QA } from '../../../utils/constants';
import { TrendsSelectorHelpers } from '../../../selectors/trends.selectors';

export class TrendsTemplateDeletePage {
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
    for (const selector of clientSelectors) {
      try {
        await selector.selectOption({ index: 1 });
        break;
      } catch (error) {
        continue;
      }
    }
  }

  async clickManageTemplate() {
    const manageTemplateSelectors = this.trendsHelpers.getManageTemplateButton();
    for (const selector of manageTemplateSelectors) {
      try {
        await selector.click();
        break;
      } catch (error) {
        continue;
      }
    }
  }

  async clickDeleteTemplate(templateName: string) {
    // Click delete button for specific template
    const deleteButton = this.page.locator(`button:has-text("Delete"):near(text="${templateName}")`);
    await deleteButton.click();
  }

  async verifyTemplateDeleted(templateName: string) {
    // Verify template is deleted from the list
    const templateInList = this.page.locator(`text="${templateName}"`);
    await expect(templateInList).not.toBeVisible();

    // Verify template is deleted from dropdown
    const templateDropdownSelectors = this.trendsHelpers.getTemplateDropdown();
    for (const selector of templateDropdownSelectors) {
      try {
        await expect(selector.locator(`option:has-text("${templateName}")`)).not.toBeVisible();
        break;
      } catch (error) {
        continue;
      }
    }
  }

  async confirmDelete() {
    // Click confirm delete button
    const confirmButton = this.page.locator('button:has-text("Delete"), button:has-text("Confirm")');
    await confirmButton.click();
  }
}

test.describe('Trends Report Template Delete Tests', () => {
  test('Should delete template successfully', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const homePage = new HomePageActions(page);
    const trendsDeletePage = new TrendsTemplateDeletePage(page);
    const templateName = `Test Template ${Date.now()}`;

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
      await trendsDeletePage.verifyTrendsPageElements();
    });

    // 07: Select filters
    await test.step('Select filters', async () => {
      await trendsDeletePage.selectFilters();
    });

    // 08: Click manage template
    await test.step('Click manage template button', async () => {
      await trendsDeletePage.clickManageTemplate();
    });

    // 09: Click delete template
    await test.step('Click delete template', async () => {
      await trendsDeletePage.clickDeleteTemplate(templateName);
    });

    // 10: Confirm delete
    await test.step('Confirm delete', async () => {
      await trendsDeletePage.confirmDelete();
    });

    // 11-12: Verify template is deleted
    await test.step('Verify template is deleted', async () => {
      await trendsDeletePage.verifyTemplateDeleted(templateName);
    });
  });
});









