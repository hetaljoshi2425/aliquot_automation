/**
 * Test configuration and environment settings
 */
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

export const config = {
  // Base URL for QA environment
  baseUrl: process.env.ALIQUOT_BASE_URL_QA,
  
  // Test timeouts
  timeouts: {
    default: 30000,
    navigation: 60000,
    api: 10000
  },
  
  // Browser settings
  browser: {
    headless: process.env.CI === 'true' || process.env.HEADLESS === 'true',
    viewport: {
      width: 1280,
      height: 720
    }
  },
  
  // Test data
  testData: {
    validUser: {
      email: process.env.ALIQUOT_USERNAME_QA || undefined,
      password: process.env.ALIQUOT_PASSWORD_QA || undefined
    },
    invalidUser: {
      email: process.env.ALIQUOT_INVALID_EMAIL || 'invalid@example.com',
      password: process.env.ALIQUOT_INVALID_PASSWORD || 'wrongpassword'
    }
  },
  
  // API endpoints
  api: {
    baseUrl: process.env.API_BASE_URL || 'https://api.example.com',
    timeout: 10000
  },
  
  // Allure reporting
  allure: {
    resultsDir: 'allure-results',
    reportDir: 'allure-report'
  }
};

/**
 * Get the QA environment base URL
 */
export function getBaseUrl(): string {
  if (!config.baseUrl) {
    throw new Error('ALIQUOT_BASE_URL_QA environment variable is required. Please set it in your .env file.');
  }
  
  return config.baseUrl;
}

/**
 * Get test timeout based on type
 */
export function getTimeout(type: keyof typeof config.timeouts = 'default'): number {
  return config.timeouts[type];
}

/**
 * Validate that required environment variables are set
 */
export function validateEnvironment(): void {
  if (!config.baseUrl) {
    throw new Error('ALIQUOT_BASE_URL_QA environment variable is required. Please set it in your .env file.');
  }
  
  if (!config.testData.validUser.email || !config.testData.validUser.password) {
    throw new Error('ALIQUOT_USERNAME_QA and ALIQUOT_PASSWORD_QA environment variables are required. Please set them in your .env file.');
  }
}
