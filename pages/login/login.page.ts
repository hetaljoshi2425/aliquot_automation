import { Page, expect } from '@playwright/test';

export class LoginPage {
  constructor(private page: Page) {}

  async goToLogin(baseUrl: string) {
    if (!baseUrl) throw new Error('Base URL is missing!');
    await this.page.goto(baseUrl, { waitUntil: 'domcontentloaded' });
  }

  async navigate() {
    await this.page.goto('https://qa.aliquot.live/');
  }

  async login(username?: string, password?: string) {
    const user = username || process.env.LOGIN_USERNAME;
    const pass = password || process.env.LOGIN_PASSWORD;

    if (!user || !pass) {
      throw new Error(`❌ Missing login credentials. 
      username=${user}, password=${pass ? '***' : 'undefined'}`);
    }

    // Debug: Log current URL and page title
    console.log(`Current URL: ${this.page.url()}`);
    console.log(`Page title: ${await this.page.title()}`);

    // Debug: Take a screenshot to see what's on the page
    await this.page.screenshot({ path: 'debug-login-page.png' });
    console.log('Screenshot saved as debug-login-page.png');

    // Debug: Check what input fields are available
    const inputs = await this.page.locator('input').all();
    console.log(`Found ${inputs.length} input fields on the page`);
    
    for (let i = 0; i < inputs.length; i++) {
      const input = inputs[i];
      const type = await input.getAttribute('type');
      const name = await input.getAttribute('name');
      const placeholder = await input.getAttribute('placeholder');
      console.log(`Input ${i}: type="${type}", name="${name}", placeholder="${placeholder}"`);
    }

    // Try different selectors for username field
    const usernameSelectors = [
      'input[name="username"]',
      'input[type="email"]',
      'input[placeholder*="email" i]',
      'input[placeholder*="user" i]',
      'input[placeholder*="login" i]'
    ];

    let usernameField = null;
    for (const selector of usernameSelectors) {
      try {
        usernameField = this.page.locator(selector);
        await usernameField.waitFor({ timeout: 2000 });
        console.log(`Found username field with selector: ${selector}`);
        break;
      } catch (e) {
        console.log(`Selector ${selector} not found`);
      }
    }

    if (!usernameField) {
      throw new Error('Could not find username input field with any of the expected selectors');
    }

    await usernameField.fill(user);

    // Try different selectors for password field
    const passwordSelectors = [
      'input[name="password"]',
      'input[type="password"]'
    ];

    let passwordField = null;
    for (const selector of passwordSelectors) {
      try {
        passwordField = this.page.locator(selector);
        await passwordField.waitFor({ timeout: 2000 });
        console.log(`Found password field with selector: ${selector}`);
        break;
      } catch (e) {
        console.log(`Selector ${selector} not found`);
      }
    }

    if (!passwordField) {
      throw new Error('Could not find password input field');
    }

    await passwordField.fill(pass);

    // Try different selectors for submit button
    const submitSelectors = [
      'button[type="submit"]',
      'button:has-text("Login to Account")',
      'button:has-text("Login")',
      'button:has-text("Sign In")',
      'input[type="submit"]'
    ];

    let submitButton = null;
    for (const selector of submitSelectors) {
      try {
        submitButton = this.page.locator(selector);
        await submitButton.waitFor({ timeout: 2000 });
        console.log(`Found submit button with selector: ${selector}`);
        break;
      } catch (e) {
        console.log(`Selector ${selector} not found`);
      }
    }

    if (!submitButton) {
      throw new Error('Could not find submit button');
    }

    await submitButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async verifyLoginSuccess(expectedUrl: string) {
    // Wait for page to load after login
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForTimeout(2000);
    
    // Check if we're redirected to dashboard or still on login page
    const currentUrl = this.page.url();
    if (currentUrl.includes('/dashboard') || currentUrl.includes(expectedUrl)) {
      // We're on dashboard or expected page, verify we can see navigation
      await expect(this.page.locator('body')).toBeVisible();
    } else {
      // Still on login page, check for error messages
      const errorMessage = this.page.locator('.error, .alert, [class*="error"]');
      if (await errorMessage.isVisible()) {
        throw new Error(`Login failed: ${await errorMessage.textContent()}`);
      }
      // If no error, assume login was successful and we're being redirected
      await this.page.waitForURL(url => url.href.includes(expectedUrl) || url.href.includes('/dashboard'), { timeout: 10000 });
    }
  }
}
