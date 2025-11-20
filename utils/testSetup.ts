import { Page } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { config, validateEnvironment } from './config';

/**
 * Test setup utilities for authentication and common test preparation
 */
export class TestSetup {
  private page: Page;
  private loginPage: LoginPage;

  constructor(page: Page) {
    this.page = page;
    this.loginPage = new LoginPage(page);
  }

  /**
   * Perform login with valid QA credentials
   * This should be called at the beginning of tests that require authentication
   */
  async loginWithValidCredentials(): Promise<void> {
    try {
      // Validate environment variables first
      validateEnvironment();
      
      // Navigate to login page
      await this.loginPage.goto();
      await this.loginPage.waitForPageLoad();

      // Wait a bit more for the page to fully load
      await this.page.waitForTimeout(3000);

      // Take a screenshot for debugging
      await this.page.screenshot({ path: 'screenshots/login-page-debug.png', fullPage: true });

      // Verify login page is loaded
      if (!(await this.loginPage.isLoaded())) {
        console.log('Login page elements not found. Taking screenshot for debugging...');
        throw new Error('Login page failed to load');
      }

      // Fill and submit login form
      await this.loginPage.fillEmail(config.testData.validUser.email!);
      await this.loginPage.fillPassword(config.testData.validUser.password!);
      
      // Take a screenshot before clicking login
      await this.page.screenshot({ path: 'screenshots/before-login-click.png', fullPage: true });
      
      // Click login button and wait for response
      await this.loginPage.clickLoginButton();
      
      // Wait for either success (redirect) or error message
      try {
        // Wait for navigation to dashboard
        await this.page.waitForURL('**/dashboard**', { timeout: 10000 });
        console.log('Successfully navigated to dashboard');
      } catch (error) {
        // If no navigation, wait for page to load and check for errors
        await this.page.waitForTimeout(3000);
        console.log('No navigation detected, checking for errors...');
        
        // Check if we're still on login page and wait for redirect
        const currentUrl = await this.page.url();
        if (currentUrl.includes('/login') || currentUrl.includes('/signin')) {
          console.log('Still on login page, waiting for redirect...');
          try {
            await this.page.waitForURL(url => !url.toString().includes('/login') && !url.toString().includes('/signin'), { timeout: 10000 });
            console.log('Successfully redirected away from login page');
          } catch (redirectError) {
            console.log('Redirect wait timed out, checking final URL...');
            const finalUrl = await this.page.url();
            console.log(`Final URL: ${finalUrl}`);
          }
        }
      }
      
      // Additional handling for login page flicker - wait for stable navigation
      await this.handleLoginPageFlicker();
      
      // Wait for stable authentication state
      await this.waitForStableAuthState();
      
      console.log('Login form submitted and response received');
      
      // Check for any error messages
      const hasError = await this.loginPage.hasErrorMessage();
      if (hasError) {
        const errorMessage = await this.loginPage.getErrorMessage();
        throw new Error(`Login failed with error: ${errorMessage}`);
      }
      
      // Wait a bit more for any additional redirects
      await this.page.waitForTimeout(2000);
      
      const currentUrl = await this.page.url();
      console.log(`Current URL after login: ${currentUrl}`);
      
      // If still on login page, there might be an issue
      if (currentUrl.includes('/login')) {
        throw new Error('Login failed - still on login page after navigation');
      }

      console.log('Successfully logged in with QA credentials');
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  }

  /**
   * Check if user is already logged in
   * This can be used to avoid unnecessary login attempts
   */
  async isLoggedIn(): Promise<boolean> {
    try {
      const currentUrl = await this.page.url();
      // Check if we're on a page that indicates successful login
      // If we're not on login page and not on signin page, assume we're logged in
      const isNotOnLoginPage = !currentUrl.includes('/login') && !currentUrl.includes('/signin');
      
      // Also check if we can find any elements that indicate we're logged in
      const hasLoggedInElements = await this.page.locator('body').isVisible();
      
      return isNotOnLoginPage && hasLoggedInElements;
    } catch {
      return false;
    }
  }

  /**
   * Wait for stable authentication state
   * This method waits for the application to reach a stable authenticated state
   * and handles any authentication-related redirects
   */
  async waitForStableAuthState(): Promise<void> {
    const maxWaitTime = 30000; // 30 seconds max
    const checkInterval = 1000; // Check every second
    let elapsedTime = 0;
    
    console.log('Waiting for stable authentication state...');
    
    while (elapsedTime < maxWaitTime) {
      const currentUrl = await this.page.url();
      
      // If we're on login page, wait for redirect
      if (currentUrl.includes('/login') || currentUrl.includes('/signin')) {
        console.log(`On login page, waiting for redirect... (${elapsedTime}ms elapsed)`);
        await this.page.waitForTimeout(checkInterval);
        elapsedTime += checkInterval;
        continue;
      }
      
      // If we're on dashboard or other authenticated pages, we're good
      if (currentUrl.includes('/dashboard') || currentUrl.includes('/clients') || 
          currentUrl.includes('/customers') || currentUrl.includes('/facilities') || 
          currentUrl.includes('/buildings')) {
        console.log(`Stable authentication state reached: ${currentUrl}`);
        return;
      }
      
      // Wait a bit more and check again
      await this.page.waitForTimeout(checkInterval);
      elapsedTime += checkInterval;
    }
    
    console.log('Authentication state check timed out, proceeding with current state');
  }

  /**
   * Ensure user is logged in before proceeding with tests
   * This is a convenience method that checks login status and logs in if needed
   */
  async ensureLoggedIn(): Promise<void> {
    const isLoggedIn = await this.isLoggedIn();
    if (!isLoggedIn) {
      await this.loginWithValidCredentials();
    }
  }

  /**
   * Logout from the application
   * This can be used in test cleanup
   */
  async logout(): Promise<void> {
    // No logout functionality needed for this test
    console.log('Logout skipped - not required for this test');
  }

  /**
   * Navigate to a specific page after ensuring login
   * This combines login and navigation in one step
   */
  async navigateToPageAfterLogin(path: string): Promise<void> {
    await this.ensureLoggedIn();
    const baseUrl = config.baseUrl;
    if (!baseUrl) {
      throw new Error('Base URL not configured. Please set ALIQUOT_BASE_URL_QA environment variable.');
    }
    await this.page.goto(`${baseUrl}${path}`);
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Setup test environment with authentication
   * This should be called in test beforeEach hooks
   */
  async setupAuthenticatedTest(): Promise<void> {
    await this.ensureLoggedIn();
  }

  /**
   * Cleanup after test - no action needed
   * This should be called in test afterEach hooks
   */
  async cleanupAfterTest(): Promise<void> {
    // No cleanup needed for this test
    console.log('Test cleanup completed - no action required');
  }

  /**
   * Handle login page flicker - wait for stable navigation away from login page
   * This method addresses the common issue where applications briefly redirect to login
   * before redirecting to the intended page
   */
  private async handleLoginPageFlicker(): Promise<void> {
    const maxAttempts = 3;
    let attempts = 0;
    
    while (attempts < maxAttempts) {
      const currentUrl = await this.page.url();
      console.log(`Login flicker check attempt ${attempts + 1}: ${currentUrl}`);
      
      // If we're on login page, wait for redirect
      if (currentUrl.includes('/login') || currentUrl.includes('/signin')) {
        console.log('Detected login page flicker, waiting for redirect...');
        
        try {
          // Wait for URL to change away from login page
          await this.page.waitForURL(url => !url.toString().includes('/login') && !url.toString().includes('/signin'), { timeout: 15000 });
          const finalUrl = await this.page.url();
          console.log(`Successfully redirected away from login page: ${finalUrl}`);
          break; // Exit the loop if redirect was successful
        } catch (error) {
          console.log(`Login flicker handling attempt ${attempts + 1} timed out`);
          attempts++;
          
          if (attempts < maxAttempts) {
            console.log('Waiting before retry...');
            await this.page.waitForTimeout(2000);
          } else {
            console.log('Max attempts reached for login flicker handling');
            // Don't throw error, just log the issue
            const finalUrl = await this.page.url();
            console.log(`Final URL after flicker handling: ${finalUrl}`);
          }
        }
      } else {
        // Not on login page, we're good
        console.log('Not on login page, flicker handling complete');
        break;
      }
    }
  }
}
