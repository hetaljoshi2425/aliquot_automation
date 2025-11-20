import { Page, Locator, expect } from '@playwright/test';
import { getBaseUrl, getTimeout } from '../utils/config';

/**
 * BasePage class containing common actions and utilities
 * All page objects should extend this class
 */
export class BasePage {
  protected page: Page;
  protected baseUrl: string;

  constructor(page: Page) {
    this.page = page;
    this.baseUrl = getBaseUrl();
  }

  /**
   * Navigate to a specific URL
   * @param path - The path to navigate to (e.g., '/about', '/contact')
   */
  async navigateTo(path: string = ''): Promise<void> {
    let url: string;
    
    if (path.startsWith('http')) {
      url = path;
    } else {
      // Ensure proper URL construction without double slashes
      const baseUrl = this.baseUrl.endsWith('/') ? this.baseUrl.slice(0, -1) : this.baseUrl;
      const cleanPath = path.startsWith('/') ? path : `/${path}`;
      url = `${baseUrl}${cleanPath}`;
    }
    
    await this.page.goto(url, { 
      waitUntil: 'networkidle',
      timeout: getTimeout('navigation')
    });
  }

  /**
   * Get the current page title
   * @returns Promise<string> - The page title
   */
  async getTitle(): Promise<string> {
    return await this.page.title();
  }

  /**
   * Validate the current URL
   * @param expectedUrl - The expected URL or URL pattern
   */
  async validateURL(expectedUrl: string | RegExp): Promise<void> {
    if (typeof expectedUrl === 'string') {
      expect(this.page.url()).toContain(expectedUrl);
    } else {
      expect(this.page.url()).toMatch(expectedUrl);
    }
  }

  /**
   * Wait for page to load completely
   */
  async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Take a screenshot
   * @param name - Screenshot name
   */
  async takeScreenshot(name: string): Promise<void> {
    await this.page.screenshot({ 
      path: `screenshots/${name}-${Date.now()}.png`,
      fullPage: true 
    });
  }

  /**
   * Wait for an element to be visible
   * @param locator - The element locator
   * @param timeout - Timeout in milliseconds
   */
  async waitForElement(locator: Locator, timeout: number = getTimeout()): Promise<void> {
    await locator.waitFor({ state: 'visible', timeout });
  }

  /**
   * Wait for an element to be hidden
   * @param locator - The element locator
   * @param timeout - Timeout in milliseconds
   */
  async waitForElementToBeHidden(locator: Locator, timeout: number = getTimeout()): Promise<void> {
    await locator.waitFor({ state: 'hidden', timeout });
  }

  /**
   * Click an element and wait for navigation
   * @param locator - The element locator
   */
  async clickAndWaitForNavigation(locator: Locator): Promise<void> {
    await Promise.all([
      this.page.waitForNavigation(),
      locator.click()
    ]);
  }

  /**
   * Fill a form field
   * @param locator - The input field locator
   * @param value - The value to fill
   */
  async fillField(locator: Locator, value: string): Promise<void> {
    await locator.clear();
    await locator.fill(value);
  }

  /**
   * Select an option from a dropdown
   * @param locator - The select element locator
   * @param value - The option value to select
   */
  async selectOption(locator: Locator, value: string): Promise<void> {
    await locator.selectOption(value);
  }

  /**
   * Check if an element is visible
   * @param locator - The element locator
   * @returns Promise<boolean> - True if element is visible
   */
  async isElementVisible(locator: Locator): Promise<boolean> {
    try {
      await locator.waitFor({ state: 'visible', timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get element text content
   * @param locator - The element locator
   * @returns Promise<string> - The text content
   */
  async getElementText(locator: Locator): Promise<string> {
    return await locator.textContent() || '';
  }

  /**
   * Scroll to an element
   * @param locator - The element locator
   */
  async scrollToElement(locator: Locator): Promise<void> {
    await locator.scrollIntoViewIfNeeded();
  }

  /**
   * Wait for a specific amount of time
   * @param milliseconds - Time to wait in milliseconds
   */
  async wait(milliseconds: number): Promise<void> {
    await this.page.waitForTimeout(milliseconds);
  }

  /**
   * Get current URL
   * @returns Promise<string> - The current URL
   */
  async getCurrentURL(): Promise<string> {
    return this.page.url();
  }

  /**
   * Refresh the page
   */
  async refresh(): Promise<void> {
    await this.page.reload({ waitUntil: 'networkidle' });
  }

  /**
   * Go back in browser history
   */
  async goBack(): Promise<void> {
    await this.page.goBack({ waitUntil: 'networkidle' });
  }

  /**
   * Go forward in browser history
   */
  async goForward(): Promise<void> {
    await this.page.goForward({ waitUntil: 'networkidle' });
  }
}
