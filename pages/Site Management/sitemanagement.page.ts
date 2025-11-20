import { Page } from '@playwright/test';

export class LoginPage {
  constructor(private page: Page) {}

  private get emailInput() {
    return this.page.getByRole('textbox', { name: 'user@example.com' });
  }

  private get passwordInput() {
    return this.page.getByRole('textbox', { name: '*********' });
  }

  private get loginButton() {
    return this.page.getByRole('button', { name: 'Login to Account' });
  }

  async login(email: string, password: string) {
    await this.emailInput.dblclick();
    await this.emailInput.fill(email);
    await this.passwordInput.click();
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async updateEmail(newEmail: string) {
    await this.emailInput.click();
    // Move to the left four times to position the cursor correctly
    for (let i = 0; i < 4; i++) {
      await this.emailInput.press('ArrowLeft');
    }
    await this.emailInput.fill(newEmail);
  }
}

export class DashboardPage {
  static navigateToSiteManagement: any;
  constructor(private page: Page) {}

  private get userProfileImage() {
    return this.page.getByRole('img');
  }

  private get siteManagementButton() {
    return this.page.getByRole('button', { name: 'SiteManagement' });
  }

  private get manageFacilitiesText() {
    return this.page.getByText('Manage Facilities');
  }

  async navigateToSiteManagement() {
    await this.siteManagementButton.click();
    await this.manageFacilitiesText.click();
  }
}
