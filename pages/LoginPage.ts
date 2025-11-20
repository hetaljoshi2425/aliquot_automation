import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { config } from '../utils/config';

/**
 * LoginPage class containing locators and actions for the login page
 */
export class LoginPage extends BasePage {
  // Locators
  private readonly emailInput: Locator;
  private readonly passwordInput: Locator;
  private readonly loginButton: Locator;
  private readonly errorMessage: Locator;
  private readonly forgotPasswordLink: Locator;
  private readonly signupLink: Locator;
  private readonly rememberMeCheckbox: Locator;
  private readonly loginForm: Locator;

  constructor(page: Page) {
    super(page);
    
    // Initialize locators - flexible selectors for QA login page
    this.emailInput = page.locator('input[type="email"], input[name="email"], input[name="username"], input[placeholder*="email" i], input[placeholder*="username" i], input[placeholder*="user" i]');
    this.passwordInput = page.locator('input[type="password"], input[name="password"]');
    this.loginButton = page.locator('button[type="submit"], input[type="submit"], button:has-text("Login"), button:has-text("Sign In"), button:has-text("Log In"), button:has-text("Submit")');
    this.errorMessage = page.locator('.error, .alert-danger, .alert, [data-testid="error-message"], .message, .notification');
    this.forgotPasswordLink = page.locator('a:has-text("Forgot"), a:has-text("Reset"), a:has-text("Forgot Password")');
    this.signupLink = page.locator('a:has-text("Sign Up"), a:has-text("Register"), a:has-text("Create Account")');
    this.rememberMeCheckbox = page.locator('input[type="checkbox"], input[name="remember"], input[name="remember_me"]');
    this.loginForm = page.locator('form, [data-testid="login-form"], .login-form, .auth-form, .signin-form');
  }

  /**
   * Navigate to the login page
   */
  async goto(): Promise<void> {
    await this.navigateTo('/login');
  }

  /**
   * Check if the login page is loaded
   */
  async isLoaded(): Promise<boolean> {
    // Check for login form or any of the input fields
    const formVisible = await this.isElementVisible(this.loginForm);
    const emailVisible = await this.isElementVisible(this.emailInput);
    const passwordVisible = await this.isElementVisible(this.passwordInput);
    
    return formVisible || (emailVisible && passwordVisible);
  }

  /**
   * Login with valid credentials
   */
  async loginWithValidCredentials(): Promise<void> {
    const email = config.testData.validUser.email;
    const password = config.testData.validUser.password;
    
    if (!email || !password) {
      throw new Error('Valid user credentials not configured. Please set ALIQUOT_USERNAME_QA and ALIQUOT_PASSWORD_QA environment variables.');
    }
    
    await this.fillEmail(email);
    await this.fillPassword(password);
    await this.clickLoginButton();
  }

  /**
   * Login with custom credentials
   */
  async loginWithCredentials(email: string, password: string): Promise<void> {
    await this.fillEmail(email);
    await this.fillPassword(password);
    await this.clickLoginButton();
  }

  /**
   * Fill email field
   */
  async fillEmail(email: string): Promise<void> {
    await this.fillField(this.emailInput, email);
  }

  /**
   * Fill password field
   */
  async fillPassword(password: string): Promise<void> {
    await this.fillField(this.passwordInput, password);
  }

  /**
   * Click login button
   */
  async clickLoginButton(): Promise<void> {
    await this.loginButton.click();
  }

  /**
   * Check if error message is visible
   */
  async hasErrorMessage(): Promise<boolean> {
    return await this.isElementVisible(this.errorMessage);
  }

  /**
   * Get error message text
   */
  async getErrorMessage(): Promise<string> {
    return await this.getElementText(this.errorMessage);
  }

  /**
   * Click forgot password link
   */
  async clickForgotPassword(): Promise<void> {
    await this.forgotPasswordLink.click();
  }

  /**
   * Click signup link
   */
  async clickSignupLink(): Promise<void> {
    await this.signupLink.click();
  }

  /**
   * Check remember me checkbox
   */
  async checkRememberMe(): Promise<void> {
    await this.rememberMeCheckbox.check();
  }

  /**
   * Uncheck remember me checkbox
   */
  async uncheckRememberMe(): Promise<void> {
    await this.rememberMeCheckbox.uncheck();
  }

  /**
   * Wait for login to complete (success or error)
   */
  async waitForLoginResult(): Promise<void> {
    // Wait for either success (redirect) or error message
    await Promise.race([
      this.page.waitForNavigation({ timeout: 10000 }),
      this.waitForElement(this.errorMessage, 5000)
    ]);
  }

  /**
   * Validate that we're on the login page
   */
  async validateLoginPage(): Promise<void> {
    await this.validateURL('/login');
    expect(await this.isLoaded()).toBeTruthy();
  }

  /**
   * Check if login form is visible
   */
  async isLoginFormVisible(): Promise<boolean> {
    return await this.isElementVisible(this.loginForm);
  }

  /**
   * Get page title
   */
  async getPageTitle(): Promise<string> {
    return await this.getTitle();
  }

  /**
   * Clear all form fields
   */
  async clearForm(): Promise<void> {
    await this.emailInput.clear();
    await this.passwordInput.clear();
  }

  /**
   * Check if login button is enabled
   */
  async isLoginButtonEnabled(): Promise<boolean> {
    return await this.loginButton.isEnabled();
  }

  /**
   * Get login button text
   */
  async getLoginButtonText(): Promise<string> {
    return await this.getElementText(this.loginButton);
  }
}
