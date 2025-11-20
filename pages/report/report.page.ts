import { Page, expect, Locator } from '@playwright/test';

export class ReportPage {
  constructor(private page: Page) {}

  // ----- Helper Methods -----
  private async clickElement(locator: Locator, timeout = 10000) {
    await locator.waitFor({ state: 'visible', timeout });
    await locator.click();
  }

  private async fillElement(locator: Locator, value: string | number, timeout = 10000) {
    await locator.waitFor({ state: 'visible', timeout });
    await locator.fill(`${value}`);
  }

  private async waitForVisible(locator: Locator, timeout = 10000) {
    await locator.waitFor({ state: 'visible', timeout });
    return locator;
  }

  // ----- Page Actions -----
  async selectSystem(systemName: string) {
    await this.page.selectOption('select[name="system"], [data-testid="system-dropdown"]', { label: systemName });
  }

  async selectReportType(type: string) {
    await this.page.selectOption('select[name="reportType"], [data-testid="report-type-dropdown"]', { label: type });
  }

  async selectReportTemplate(template: string) {
    await this.page.selectOption('select[name="template"], [data-testid="template-dropdown"]', { label: template });
  }

  async fillReportHeader(title: string, showDriveTime = false, showReportNumber = false, showInventory = false) {
    await this.fillElement(this.page.getByLabel('Report Title'), title);
    if (showDriveTime) await this.clickElement(this.page.getByRole('switch', { name: 'Drive/On-site time' }));
    if (showReportNumber) await this.clickElement(this.page.getByRole('switch', { name: 'Report Number' }));
    if (showInventory) await this.clickElement(this.page.getByRole('switch', { name: 'Inventory' }));
  }

  async clickCreateReport() {
    await this.clickElement(this.page.getByRole('button', { name: 'Create Report' }));
    await this.waitForVisible(this.page.locator('form:has-text("Report Form")'), 15000);
  }

  async enterTestResult(testName: string, value: string | number) {
    const input = this.page.locator(`tr:has-text("${testName}") >> input`);
    await this.fillElement(input, value);
  }

  async addTestComment(testName: string, comment: string) {
    const commentBtn = this.page.getByRole('button', { name: `Add Comment for ${testName}` });
    await this.clickElement(commentBtn);
    const commentWindow = this.page.getByRole('dialog', { name: `Comments for ${testName}` });
    await this.fillElement(commentWindow.getByLabel('Comments'), comment);
    await this.clickElement(commentWindow.getByRole('button', { name: 'Close' }));
  }

  async verifyLastThreeResults() {
    const region = this.page.getByRole('region', { name: 'Last Three Results' });
    await this.waitForVisible(region, 10000);
    await expect(region).toBeVisible();
  }

  async addReportPhrase(phrase: string) {
    const phraseBtn = this.page.getByRole('button', { name: 'Report Phrases' });
    await this.clickElement(phraseBtn);
    const option = this.page.getByRole('option', { name: phrase });
    await this.clickElement(option);
    await this.clickElement(this.page.getByRole('button', { name: 'Add to Report' }));
  }

  async enterInventory(value: number) {
    const input = this.page.getByLabel('Inventory');
    await this.fillElement(input, value);
  }

  async saveAsDraft() {
    const draftBtn = this.page.getByRole('button', { name: 'Save as Draft' });
    await this.clickElement(draftBtn);
    const reportList = this.page.getByRole('region', { name: 'Report List' });
    await this.waitForVisible(reportList, 15000);
    await expect(reportList).toContainText('Draft');
  }
}
