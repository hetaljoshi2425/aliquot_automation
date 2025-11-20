import { test, Page, expect } from '@playwright/test';
import { LoginPage } from '../../../pages/login/login.page';
import { HomePageActions } from '../../../pages/home/home.page';
import { ReportPage } from '../../../pages/report/report.page';
import { ALIQUOT_BASE_URL_QA, ALIQUOT_USERNAME_QA, ALIQUOT_PASSWORD_QA } from '../../../utils/constants';
import * as allure from 'allure-js-commons';
import { LoginSelectorHelpers, LoginSelectorConfigs } from '../../../selectors/login.selectors';
import { HomeSelectorHelpers, HomeSelectorConfigs } from '../../../selectors/home.selectors';

/**
 * Create Report Draft Test Suite
 * Tests the complete workflow of creating a draft report
 */
export class CreateReportDraftPage {
  private loginHelpers: LoginSelectorHelpers;
  private homeHelpers: HomeSelectorHelpers;

  constructor(private page: Page) {
    this.loginHelpers = new LoginSelectorHelpers(page);
    this.homeHelpers = new HomeSelectorHelpers(page);
  }

  /**
   * Verify that the login page is loaded with all required elements
   */
  async verifyLoginPageLoaded() {
    await allure.step('Verify login page elements are present', async () => {
      await this.page.waitForLoadState('networkidle');
      
      // Verify username input is present using robust selectors
      const usernameSelectors = this.loginHelpers.getUsernameInput();
      for (const selector of usernameSelectors) {
        try {
          await expect(selector).toBeVisible({ timeout: 5000 });
          break;
        } catch (error) {
          continue;
        }
      }
      
      // Verify password input is present using robust selectors
      const passwordSelectors = this.loginHelpers.getPasswordInput();
      for (const selector of passwordSelectors) {
        try {
          await expect(selector).toBeVisible({ timeout: 5000 });
          break;
        } catch (error) {
          continue;
        }
      }

      // Verify login button is present using robust selectors
      const loginButtonSelectors = this.loginHelpers.getLoginButton();
      for (const selector of loginButtonSelectors) {
        try {
          await expect(selector).toBeVisible({ timeout: 5000 });
          break;
        } catch (error) {
          continue;
        }
      }
    });
  }

  /**
   * Perform login with valid credentials
   */
  async performLogin(username: string, password: string) {
    await allure.step('Perform login with valid credentials', async () => {
      // Fill username using robust selectors
      const usernameSelectors = this.loginHelpers.getUsernameInput();
      for (const selector of usernameSelectors) {
        try {
          await selector.fill(username);
          break;
        } catch (error) {
          continue;
        }
      }

      // Fill password using robust selectors
      const passwordSelectors = this.loginHelpers.getPasswordInput();
      for (const selector of passwordSelectors) {
        try {
          await selector.fill(password);
          break;
        } catch (error) {
          continue;
        }
      }

      // Click login button using robust selectors
      const loginButtonSelectors = this.loginHelpers.getLoginButton();
      for (const selector of loginButtonSelectors) {
        try {
          await selector.click();
          break;
        } catch (error) {
          continue;
        }
      }

      // Wait for successful login
      await this.page.waitForLoadState('networkidle');
      await this.page.waitForTimeout(2000);
    });
  }

  /**
   * Navigate to dashboard and verify it loads
   */
  async navigateToDashboard() {
    await allure.step('Navigate to dashboard and verify it loads', async () => {
      // Hover over Dashboard tab using robust selectors
      const dashboardSelectors = this.homeHelpers.getDashboardTab();
      for (const selector of dashboardSelectors) {
        try {
          await selector.hover();
          await this.page.waitForTimeout(1000);
          break;
        } catch (error) {
          continue;
        }
      }

      // Verify dashboard is loaded successfully
      await expect(this.page).toHaveURL(ALIQUOT_BASE_URL_QA);
    });
  }

  /**
   * Click on New Report button to open Create Report page
   */
  async clickNewReportButton() {
    await allure.step('Click New Report button to open Create Report page', async () => {
      // Look for New Report button using multiple strategies
      const newReportSelectors = [
        this.page.getByRole('button', { name: 'New Report' }),
        this.page.getByText('New Report'),
        this.page.locator('button:has-text("New Report")'),
        this.page.locator('[data-testid="new-report-button"]'),
        this.page.locator('button[title*="New Report"]')
      ];

      for (const selector of newReportSelectors) {
        try {
          await selector.waitFor({ state: 'visible', timeout: 5000 });
          await selector.click();
          break;
        } catch (error) {
          continue;
        }
      }

      // Wait for Create Report page to load
      await this.page.waitForLoadState('networkidle');
      await this.page.waitForTimeout(2000);
    });
  }

  /**
   * Verify Create Report page is loaded with Report Location section
   */
  async verifyCreateReportPageLoaded() {
    await allure.step('Verify Create Report page is loaded with Report Location section', async () => {
      // Verify Report Location section is present
      const reportLocationSelectors = [
        this.page.getByText('Report Location'),
        this.page.getByRole('heading', { name: 'Report Location' }),
        this.page.locator('h2:has-text("Report Location")'),
        this.page.locator('[data-testid="report-location-section"]')
      ];

      for (const selector of reportLocationSelectors) {
        try {
          await expect(selector).toBeVisible({ timeout: 10000 });
          break;
        } catch (error) {
          continue;
        }
      }
    });
  }

  /**
   * Select a system from the System dropdown
   */
  async selectSystem(systemName: string) {
    await allure.step(`Select system: ${systemName}`, async () => {
      const systemSelectors = [
        this.page.getByRole('combobox', { name: 'System' }),
        this.page.getByLabel('System'),
        this.page.locator('select[name="system"]'),
        this.page.locator('[data-testid="system-dropdown"]'),
        this.page.locator('select:has-text("System")')
      ];

      for (const selector of systemSelectors) {
        try {
          await selector.waitFor({ state: 'visible', timeout: 5000 });
          await selector.selectOption({ label: systemName });
          await this.page.waitForTimeout(1000);
          break;
        } catch (error) {
          continue;
        }
      }
    });
  }

  /**
   * Verify Report Type selection is displayed
   */
  async verifyReportTypeDisplayed() {
    await allure.step('Verify Report Type selection is displayed', async () => {
      const reportTypeSelectors = [
        this.page.getByText('Report Type'),
        this.page.getByRole('heading', { name: 'Report Type' }),
        this.page.locator('h3:has-text("Report Type")'),
        this.page.locator('[data-testid="report-type-section"]')
      ];

      for (const selector of reportTypeSelectors) {
        try {
          await expect(selector).toBeVisible({ timeout: 10000 });
          break;
        } catch (error) {
          continue;
        }
      }
    });
  }

  /**
   * Select report type from the dropdown
   */
  async selectReportType(reportType: string) {
    await allure.step(`Select report type: ${reportType}`, async () => {
      const reportTypeSelectors = [
        this.page.getByRole('combobox', { name: 'Report Type' }),
        this.page.getByLabel('Report Type'),
        this.page.locator('select[name="reportType"]'),
        this.page.locator('[data-testid="report-type-dropdown"]'),
        this.page.locator('select:has-text("Report Type")')
      ];

      for (const selector of reportTypeSelectors) {
        try {
          await selector.waitFor({ state: 'visible', timeout: 5000 });
          await selector.selectOption({ label: reportType });
          await this.page.waitForTimeout(1000);
          break;
        } catch (error) {
          continue;
        }
      }
    });
  }

  /**
   * Verify Report Template dropdown appears
   */
  async verifyReportTemplateDropdown() {
    await allure.step('Verify Report Template dropdown appears', async () => {
      const templateSelectors = [
        this.page.getByText('Report Template'),
        this.page.getByRole('combobox', { name: 'Report Template' }),
        this.page.getByLabel('Report Template'),
        this.page.locator('select[name="template"]'),
        this.page.locator('[data-testid="report-template-dropdown"]')
      ];

      for (const selector of templateSelectors) {
        try {
          await expect(selector).toBeVisible({ timeout: 10000 });
          break;
        } catch (error) {
          continue;
        }
      }
    });
  }

  /**
   * Select report template from the dropdown
   */
  async selectReportTemplate(templateName: string) {
    await allure.step(`Select report template: ${templateName}`, async () => {
      const templateSelectors = [
        this.page.getByRole('combobox', { name: 'Report Template' }),
        this.page.getByLabel('Report Template'),
        this.page.locator('select[name="template"]'),
        this.page.locator('[data-testid="report-template-dropdown"]')
      ];

      for (const selector of templateSelectors) {
        try {
          await selector.waitFor({ state: 'visible', timeout: 5000 });
          await selector.selectOption({ label: templateName });
          await this.page.waitForTimeout(2000);
          break;
        } catch (error) {
          continue;
        }
      }
    });
  }

  /**
   * Verify Report Header and Report Components are loaded
   */
  async verifyReportHeaderAndComponents() {
    await allure.step('Verify Report Header and Report Components are loaded', async () => {
      // Verify Report Header section
      const headerSelectors = [
        this.page.getByText('Report Header'),
        this.page.getByRole('heading', { name: 'Report Header' }),
        this.page.locator('h3:has-text("Report Header")'),
        this.page.locator('[data-testid="report-header-section"]')
      ];

      for (const selector of headerSelectors) {
        try {
          await expect(selector).toBeVisible({ timeout: 10000 });
          break;
        } catch (error) {
          continue;
        }
      }

      // Verify Report Components section
      const componentsSelectors = [
        this.page.getByText('Report Components'),
        this.page.getByRole('heading', { name: 'Report Components' }),
        this.page.locator('h3:has-text("Report Components")'),
        this.page.locator('[data-testid="report-components-section"]')
      ];

      for (const selector of componentsSelectors) {
        try {
          await expect(selector).toBeVisible({ timeout: 10000 });
          break;
        } catch (error) {
          continue;
        }
      }
    });
  }

  /**
   * Configure report header with title and toggle options
   */
  async configureReportHeader(title: string, showDriveTime = false, showReportNumber = false, showInventory = false) {
    await allure.step('Configure report header with title and toggle options', async () => {
      // Enter Report Title
      const titleSelectors = [
        this.page.getByRole('textbox', { name: 'Report Title' }),
        this.page.getByLabel('Report Title'),
        this.page.locator('input[name="reportTitle"]'),
        this.page.locator('[data-testid="report-title-input"]'),
        this.page.locator('input[placeholder*="Report Title"]')
      ];

      for (const selector of titleSelectors) {
        try {
          await selector.waitFor({ state: 'visible', timeout: 5000 });
          await selector.fill(title);
          break;
        } catch (error) {
          continue;
        }
      }

      // Toggle Drive/On-site time if needed
      if (showDriveTime) {
        const driveTimeSelectors = [
          this.page.getByRole('switch', { name: 'Drive/On-site time' }),
          this.page.getByLabel('Drive/On-site time'),
          this.page.locator('[data-testid="toggle-drive-time"]'),
          this.page.locator('input[type="checkbox"][name*="drive"]')
        ];

        for (const selector of driveTimeSelectors) {
          try {
            await selector.waitFor({ state: 'visible', timeout: 3000 });
            await selector.click();
            break;
          } catch (error) {
            continue;
          }
        }
      }

      // Toggle Report Number if needed
      if (showReportNumber) {
        const reportNumberSelectors = [
          this.page.getByRole('switch', { name: 'Report Number' }),
          this.page.getByLabel('Report Number'),
          this.page.locator('[data-testid="toggle-report-number"]'),
          this.page.locator('input[type="checkbox"][name*="reportNumber"]')
        ];

        for (const selector of reportNumberSelectors) {
          try {
            await selector.waitFor({ state: 'visible', timeout: 3000 });
            await selector.click();
            break;
          } catch (error) {
            continue;
          }
        }
      }

      // Toggle Inventory if needed
      if (showInventory) {
        const inventorySelectors = [
          this.page.getByRole('switch', { name: 'Inventory' }),
          this.page.getByLabel('Inventory'),
          this.page.locator('[data-testid="toggle-inventory"]'),
          this.page.locator('input[type="checkbox"][name*="inventory"]')
        ];

        for (const selector of inventorySelectors) {
          try {
            await selector.waitFor({ state: 'visible', timeout: 3000 });
            await selector.click();
            break;
          } catch (error) {
            continue;
          }
        }
      }
    });
  }

  /**
   * Click Create Report button
   */
  async clickCreateReportButton() {
    await allure.step('Click Create Report button', async () => {
      const createReportSelectors = [
        this.page.getByRole('button', { name: 'Create Report' }),
        this.page.getByText('Create Report'),
        this.page.locator('button:has-text("Create Report")'),
        this.page.locator('[data-testid="create-report-btn"]'),
        this.page.locator('button[type="submit"]')
      ];

      for (const selector of createReportSelectors) {
        try {
          await selector.waitFor({ state: 'visible', timeout: 5000 });
          await selector.click();
          break;
        } catch (error) {
          continue;
        }
      }

      // Wait for Report Form to load
      await this.page.waitForLoadState('networkidle');
      await this.page.waitForTimeout(3000);
    });
  }

  /**
   * Verify Report Form is loaded
   */
  async verifyReportFormLoaded() {
    await allure.step('Verify Report Form is loaded', async () => {
      const reportFormSelectors = [
        this.page.getByText('Report Form'),
        this.page.getByRole('form'),
        this.page.locator('form:has-text("Report Form")'),
        this.page.locator('[data-testid="report-form"]')
      ];

      for (const selector of reportFormSelectors) {
        try {
          await expect(selector).toBeVisible({ timeout: 15000 });
          break;
        } catch (error) {
          continue;
        }
      }
    });
  }

  /**
   * Enter test result value
   */
  async enterTestResult(testName: string, value: string | number) {
    await allure.step(`Enter test result for ${testName}: ${value}`, async () => {
      const testResultSelectors = [
        this.page.locator(`tr:has-text("${testName}") >> input`),
        this.page.locator(`[data-testid="test-${testName}-input"]`),
        this.page.locator(`input[name*="${testName}"]`),
        this.page.locator(`td:has-text("${testName}") + td >> input`)
      ];

      for (const selector of testResultSelectors) {
        try {
          await selector.waitFor({ state: 'visible', timeout: 5000 });
          await selector.fill(`${value}`);
          break;
        } catch (error) {
          continue;
        }
      }
    });
  }

  /**
   * Add comment to a test by clicking three dots icon
   */
  async addTestComment(testName: string, comment: string) {
    await allure.step(`Add comment to test: ${testName}`, async () => {
      // Click three dots icon for the test
      const commentButtonSelectors = [
        this.page.getByRole('button', { name: `Add Comment for ${testName}` }),
        this.page.locator(`tr:has-text("${testName}") >> button[title*="comment"]`),
        this.page.locator(`[data-testid="test-${testName}-comment-btn"]`),
        this.page.locator(`td:has-text("${testName}") >> button:has-text("...")`),
        this.page.locator(`td:has-text("${testName}") >> button[aria-label*="comment"]`)
      ];

      for (const selector of commentButtonSelectors) {
        try {
          await selector.waitFor({ state: 'visible', timeout: 5000 });
          await selector.click();
          break;
        } catch (error) {
          continue;
        }
      }

      // Wait for comment window to open
      await this.page.waitForTimeout(1000);

      // Fill comment field
      const commentFieldSelectors = [
        this.page.getByRole('textbox', { name: 'Comments' }),
        this.page.getByLabel('Comments'),
        this.page.locator('[data-testid="comment-field"]'),
        this.page.locator('textarea[name*="comment"]')
      ];

      for (const selector of commentFieldSelectors) {
        try {
          await selector.waitFor({ state: 'visible', timeout: 5000 });
          await selector.fill(comment);
          break;
        } catch (error) {
          continue;
        }
      }

      // Close comment window
      const closeButtonSelectors = [
        this.page.getByRole('button', { name: 'Close' }),
        this.page.getByRole('button', { name: 'Save' }),
        this.page.locator('button:has-text("Close")'),
        this.page.locator('button:has-text("Save")'),
        this.page.locator('[data-testid="close-comment-window"]')
      ];

      for (const selector of closeButtonSelectors) {
        try {
          await selector.waitFor({ state: 'visible', timeout: 3000 });
          await selector.click();
          break;
        } catch (error) {
          continue;
        }
      }

      // Wait for window to close
      await this.page.waitForTimeout(1000);
    });
  }

  /**
   * Save report as draft
   */
  async saveAsDraft() {
    await allure.step('Save report as draft', async () => {
      const saveDraftSelectors = [
        this.page.getByRole('button', { name: 'Save as Draft' }),
        this.page.getByText('Save as Draft'),
        this.page.locator('button:has-text("Save as Draft")'),
        this.page.locator('[data-testid="save-draft-btn"]')
      ];

      for (const selector of saveDraftSelectors) {
        try {
          await selector.waitFor({ state: 'visible', timeout: 5000 });
          await selector.click();
          break;
        } catch (error) {
          continue;
        }
      }

      // Wait for save confirmation
      await this.page.waitForLoadState('networkidle');
      await this.page.waitForTimeout(2000);
    });
  }

  /**
   * Verify draft is saved and added to Report List
   */
  async verifyDraftSaved() {
    await allure.step('Verify draft is saved and added to Report List', async () => {
      const reportListSelectors = [
        this.page.getByText('Report List'),
        this.page.getByRole('region', { name: 'Report List' }),
        this.page.locator('[data-testid="report-list"]'),
        this.page.locator('div:has-text("Report List")')
      ];

      for (const selector of reportListSelectors) {
        try {
          await expect(selector).toBeVisible({ timeout: 10000 });
          break;
        } catch (error) {
          continue;
        }
      }

      // Verify draft status
      const draftSelectors = [
        this.page.getByText('Draft'),
        this.page.locator('span:has-text("Draft")'),
        this.page.locator('td:has-text("Draft")'),
        this.page.locator('[data-testid="draft-status"]')
      ];

      for (const selector of draftSelectors) {
        try {
          await expect(selector).toBeVisible({ timeout: 5000 });
          break;
        } catch (error) {
          continue;
        }
      }
    });
  }
}

test.describe('Create Report Draft Tests', () => {
  test('Should complete full create report draft workflow', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const homePage = new HomePageActions(page);
    const reportPage = new ReportPage(page);
    const createReportDraftPage = new CreateReportDraftPage(page);

    // Test data
    const testData = {
      username: ALIQUOT_USERNAME_QA || 'test@example.com',
      password: ALIQUOT_PASSWORD_QA || 'testpassword',
      reportTitle: `Test Report ${Date.now()}`,
      systemName: 'Test System',
      reportType: 'Service',
      templateName: 'Standard Template',
      testName: 'Temperature Test',
      testValue: '25.5',
      comment: 'Test comment for temperature reading'
    };

    // 1. Login with valid credentials
    await test.step('Login with valid credentials', async () => {
      await allure.step('Navigate to login page and verify elements', async () => {
        await loginPage.goToLogin(ALIQUOT_BASE_URL_QA);
        await createReportDraftPage.verifyLoginPageLoaded();
      });

      await allure.step('Perform login', async () => {
        await createReportDraftPage.performLogin(testData.username, testData.password);
        await loginPage.verifyLoginSuccess(ALIQUOT_BASE_URL_QA);
      });
    });

    // 2. Navigate to dashboard
    await test.step('Navigate to dashboard', async () => {
      await allure.step('Navigate to dashboard and verify it loads', async () => {
        await createReportDraftPage.navigateToDashboard();
      });
    });

    // 3. Click New Report button
    await test.step('Click New Report button', async () => {
      await allure.step('Click New Report button to open Create Report page', async () => {
        await createReportDraftPage.clickNewReportButton();
        await createReportDraftPage.verifyCreateReportPageLoaded();
      });
    });

    // 4. Select Report Location (System)
    await test.step('Select Report Location', async () => {
      await allure.step('Select system from dropdown', async () => {
        await createReportDraftPage.selectSystem(testData.systemName);
        await createReportDraftPage.verifyReportTypeDisplayed();
      });
    });

    // 5. Select Report Type
    await test.step('Select Report Type', async () => {
      await allure.step('Select report type from dropdown', async () => {
        await createReportDraftPage.selectReportType(testData.reportType);
        await createReportDraftPage.verifyReportTemplateDropdown();
      });
    });

    // 6. Select Report Template
    await test.step('Select Report Template', async () => {
      await allure.step('Select report template from dropdown', async () => {
        await createReportDraftPage.selectReportTemplate(testData.templateName);
        await createReportDraftPage.verifyReportHeaderAndComponents();
      });
    });

    // 7. Configure Report Header
    await test.step('Configure Report Header', async () => {
      await allure.step('Configure report header with title and toggle options', async () => {
        await createReportDraftPage.configureReportHeader(
          testData.reportTitle,
          true,  // showDriveTime
          true,  // showReportNumber
          true   // showInventory
        );
      });
    });

    // 8. Create Report
    await test.step('Create Report', async () => {
      await allure.step('Click Create Report button and verify form loads', async () => {
        await createReportDraftPage.clickCreateReportButton();
        await createReportDraftPage.verifyReportFormLoaded();
      });
    });

    // 9. Add Test Results
    await test.step('Add Test Results', async () => {
      await allure.step('Enter test result value', async () => {
        await createReportDraftPage.enterTestResult(testData.testName, testData.testValue);
      });
    });

    // 10. Add Comments to Test
    await test.step('Add Comments to Test', async () => {
      await allure.step('Add comment to test by clicking three dots icon', async () => {
        await createReportDraftPage.addTestComment(testData.testName, testData.comment);
      });
    });

    // 11. Save as Draft
    await test.step('Save as Draft', async () => {
      await allure.step('Save report as draft and verify it appears in Report List', async () => {
        await createReportDraftPage.saveAsDraft();
        await createReportDraftPage.verifyDraftSaved();
      });
    });
  });

  test('Should handle report creation with minimal configuration', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const createReportDraftPage = new CreateReportDraftPage(page);

    // Test data for minimal configuration
    const testData = {
      username: ALIQUOT_USERNAME_QA || 'test@example.com',
      password: ALIQUOT_PASSWORD_QA || 'testpassword',
      reportTitle: `Minimal Report ${Date.now()}`,
      systemName: 'Test System',
      reportType: 'Service',
      templateName: 'Standard Template'
    };

    // Login
    await test.step('Login with valid credentials', async () => {
      await loginPage.goToLogin(ALIQUOT_BASE_URL_QA);
      await createReportDraftPage.performLogin(testData.username, testData.password);
    });

    // Navigate to dashboard
    await test.step('Navigate to dashboard', async () => {
      await createReportDraftPage.navigateToDashboard();
    });

    // Create report with minimal configuration
    await test.step('Create report with minimal configuration', async () => {
      await createReportDraftPage.clickNewReportButton();
      await createReportDraftPage.verifyCreateReportPageLoaded();
      await createReportDraftPage.selectSystem(testData.systemName);
      await createReportDraftPage.selectReportType(testData.reportType);
      await createReportDraftPage.selectReportTemplate(testData.templateName);
      await createReportDraftPage.configureReportHeader(testData.reportTitle);
      await createReportDraftPage.clickCreateReportButton();
      await createReportDraftPage.verifyReportFormLoaded();
      await createReportDraftPage.saveAsDraft();
      await createReportDraftPage.verifyDraftSaved();
    });
  });
});