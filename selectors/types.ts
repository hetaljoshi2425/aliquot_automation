/**
 * Base selector types and interfaces for the Aqua Regression Test Suite
 * Uses Playwright's recommended methods: getByRole, getByTestId, getByLabel
 */

import { Locator, Page } from '@playwright/test';

/**
 * Playwright selector methods in order of preference (best practice order)
 */
export type SelectorMethod = 'getByRole' | 'getByLabel' | 'getByTestId' | 'getByText' | 'getByPlaceholder' | 'getByTitle' | 'getByAltText' | 'locator';

/**
 * Selector configuration for each element
 */
export interface SelectorConfig {
  /** Primary selector method (most reliable) */
  primary: SelectorMethod;
  /** Fallback selector methods in order of preference */
  fallbacks: SelectorMethod[];
  /** Description of the element for documentation */
  description: string;
  /** Whether this element is required for page load */
  required: boolean;
  /** Timeout for element visibility (in milliseconds) */
  timeout?: number;
  /** Additional options for the selector method */
  options?: Record<string, any>;
}

/**
 * Selector set for each element with multiple methods (best practice order)
 */
export interface SelectorSet {
  /** ARIA role and accessible name (highest priority - most stable & accessible) */
  role?: { role: string; name?: string; options?: any };
  /** Label text or aria-label (for form fields) */
  label?: string;
  /** data-testid attribute (if available in app) */
  testId?: string;
  /** Visible text content (fallback for static text) */
  text?: string;
  /** Placeholder text */
  placeholder?: string;
  /** Title attribute */
  title?: string;
  /** Alt text for images */
  altText?: string;
  /** CSS selector as last resort */
  css?: string;
  /** XPath selector as last resort */
  xpath?: string;
}

/**
 * Page selector structure
 */
export interface PageSelectors {
  /** Page title or heading */
  pageTitle: SelectorSet;
  /** Navigation elements */
  navigation: {
    [key: string]: SelectorSet;
  };
  /** Form elements */
  forms: {
    [key: string]: SelectorSet;
  };
  /** Button elements */
  buttons: {
    [key: string]: SelectorSet;
  };
  /** Input elements */
  inputs: {
    [key: string]: SelectorSet;
  };
  /** Dropdown/select elements */
  dropdowns: {
    [key: string]: SelectorSet;
  };
  /** Table elements */
  tables: {
    [key: string]: SelectorSet;
  };
  /** Modal/dialog elements */
  modals: {
    [key: string]: SelectorSet;
  };
  /** Message/notification elements */
  messages: {
    [key: string]: SelectorSet;
  };
  /** Loading/spinner elements */
  loading: {
    [key: string]: SelectorSet;
  };
}

/**
 * Helper class for creating robust selectors using Playwright's recommended methods
 */
export class SelectorHelper {
  constructor(private page: Page) {}

  /**
   * Get a locator using the best available selector method
   */
  getLocator(selectorSet: SelectorSet, config: SelectorConfig): Locator {
    const methods = [config.primary, ...config.fallbacks];
    
    for (const method of methods) {
      try {
        const locator = this.getLocatorByMethod(selectorSet, method);
        if (locator) {
          return locator;
        }
      } catch (error) {
        // Continue to next method
        continue;
      }
    }
    
    throw new Error(`No valid selector found for element: ${config.description}`);
  }

  /**
   * Get locator by specific method (best practice order)
   */
  private getLocatorByMethod(selectorSet: SelectorSet, method: SelectorMethod): Locator | null {
    switch (method) {
      case 'getByRole':
        if (selectorSet.role) {
          return this.page.getByRole(selectorSet.role.role, {
            name: selectorSet.role.name,
            ...selectorSet.role.options
          });
        }
        break;
      
      case 'getByLabel':
        if (selectorSet.label) {
          return this.page.getByLabel(selectorSet.label);
        }
        break;
      
      case 'getByTestId':
        if (selectorSet.testId) {
          return this.page.getByTestId(selectorSet.testId);
        }
        break;
      
      case 'getByText':
        if (selectorSet.text) {
          return this.page.getByText(selectorSet.text);
        }
        break;
      
      case 'getByPlaceholder':
        if (selectorSet.placeholder) {
          return this.page.getByPlaceholder(selectorSet.placeholder);
        }
        break;
      
      case 'getByTitle':
        if (selectorSet.title) {
          return this.page.getByTitle(selectorSet.title);
        }
        break;
      
      case 'getByAltText':
        if (selectorSet.altText) {
          return this.page.getByAltText(selectorSet.altText);
        }
        break;
      
      case 'locator':
        if (selectorSet.css) {
          return this.page.locator(selectorSet.css);
        }
        if (selectorSet.xpath) {
          return this.page.locator(selectorSet.xpath);
        }
        break;
    }
    
    return null;
  }

  /**
   * Get multiple locators for the same element (for robust selection)
   */
  getMultipleLocators(selectorSet: SelectorSet, config: SelectorConfig): Locator[] {
    const locators: Locator[] = [];
    const methods = [config.primary, ...config.fallbacks];
    
    for (const method of methods) {
      try {
        const locator = this.getLocatorByMethod(selectorSet, method);
        if (locator) {
          locators.push(locator);
        }
      } catch (error) {
        // Continue to next method
        continue;
      }
    }
    
    return locators;
  }
}

/**
 * Common selector configurations
 */
export const CommonSelectorConfigs = {
  // Critical elements (required for page functionality)
  critical: {
    primary: 'getByRole' as SelectorMethod,
    fallbacks: ['getByLabel', 'getByTestId', 'getByText', 'locator'],
    required: true,
    timeout: 10000
  },
  
  // Navigation elements (buttons, menus, links)
  navigation: {
    primary: 'getByRole' as SelectorMethod,
    fallbacks: ['getByText', 'getByTestId', 'locator'],
    required: true,
    timeout: 10000
  },
  
  // Form elements (inputs, dropdowns, labels)
  form: {
    primary: 'getByLabel' as SelectorMethod,
    fallbacks: ['getByRole', 'getByPlaceholder', 'getByTestId', 'locator'],
    required: true,
    timeout: 10000
  },
  
  // Button elements
  button: {
    primary: 'getByRole' as SelectorMethod,
    fallbacks: ['getByText', 'getByTestId', 'locator'],
    required: false,
    timeout: 5000
  },
  
  // Message elements (alerts, status messages)
  message: {
    primary: 'getByRole' as SelectorMethod,
    fallbacks: ['getByText', 'getByTestId', 'locator'],
    required: false,
    timeout: 5000
  },
  
  // Loading elements
  loading: {
    primary: 'getByRole' as SelectorMethod,
    fallbacks: ['getByTestId', 'locator'],
    required: false,
    timeout: 3000
  }
} as const;

/**
 * Helper function to create a robust selector configuration
 */
export function createSelectorConfig(
  description: string,
  primary: SelectorMethod = 'getByRole',
  fallbacks: SelectorMethod[] = ['getByLabel', 'getByTestId', 'getByText', 'locator'],
  required: boolean = false,
  timeout: number = 5000
): SelectorConfig {
  return {
    primary,
    fallbacks,
    description,
    required,
    timeout
  };
}

/**
 * Helper function to create a selector set
 */
export function createSelectorSet(
  role?: { role: string; name?: string; options?: any },
  label?: string,
  testId?: string,
  text?: string,
  placeholder?: string,
  title?: string,
  altText?: string,
  css?: string,
  xpath?: string
): SelectorSet {
  return {
    role,
    label,
    testId,
    text,
    placeholder,
    title,
    altText,
    css,
    xpath
  };
}
