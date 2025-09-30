import { defineConfig, devices } from '@playwright/test';
import { allure } from 'allure-playwright';
import * as dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

/**
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  retries: 0,
  timeout: 60000, // 60 seconds timeout
  reporter: [
    ['html'],
    ['allure-playwright', { 
      outputFolder: 'allure-results'
    }]
  ],
  use: {
    baseURL: process.env.ALIQUOT_BASE_URL_QA,
    screenshot: 'on',
    video: 'on',
  },

  projects: [
    {
      name: 'chromium-headless',
      use: { 
        ...devices['Desktop Chrome'],
        headless: true
      },
    },
    {
      name: 'chromium-headed',
      use: { 
        ...devices['Desktop Chrome'],
        headless: false
      },
    },
  ],
});
