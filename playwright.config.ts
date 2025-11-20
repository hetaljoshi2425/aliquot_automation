import { defineConfig, devices } from '@playwright/test';
<<<<<<< HEAD
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const isHeaded = process.argv.includes('--headed');
const isCI = !!process.env.CI;

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 1 : 0,

  // Timeout per test: 5 minutes
  timeout: 5 * 60 * 1000,

  // Only 1 worker (sequential execution)
  workers: 1,

  reporter: [
    ['html'],
    ['allure-playwright', {
      detail: true,
      outputFolder: 'allure-results',
      suiteTitle: false,
      attachments: true,
      environmentInfo: {
        framework: 'Playwright',
        language: 'TypeScript',
        runtime: 'Node.js',
        version: process.version
      },
      categories: [
        { name: 'Product defects', matchedStatuses: ['failed'], messageRegex: '.*Assertion failed.*' },
        { name: 'Test defects', matchedStatuses: ['failed'], messageRegex: '.*Element not found.*' },
        { name: 'Broken tests', matchedStatuses: ['broken'] },
        { name: 'Ignored tests', matchedStatuses: ['skipped'] },
        { name: 'Flaky tests', matchedStatuses: ['failed'], messageRegex: '.*Timeout.*' }
      ]
    }]
  ],

  use: {
    baseURL: process.env.ALIQUOT_BASE_URL_QA || 'https://qa.aliquot.live/',
    channel : 'chrome',
    headless: true,
    screenshot: 'on',     // disable auto screenshots
    video: 'on',           // record all runs (we’ll keep only on pass)
    trace: 'on',
    launchOptions: {
      args: ['--start-maximized', '--no-sandbox', '--disable-dev-shm-usage'],
    },
    viewport: null,           // collect trace, attach only on pass
  },

  // Only Chromium
// projects: [
//   {
//     name: 'chrome',
//     use: { 
//       ...devices['Desktop Chrome'],
//       channel: 'chrome',
//       launchOptions: {
//         headless: !isHeaded, // only headless in CI
//         args: [
//           '--no-sandbox',
//           '--disable-dev-shm-usage',
//           '--disable-web-security',
//           '--start-maximized',
//         ],
//         executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
//       },
//       // viewport: { width: 1920, height: 1080 },
//     },
//   },
// ],


  outputDir: 'test-results/',

//   // Optional dev server
//   webServer: process.env.NODE_ENV === 'development' ? {
//     command: 'npm run dev',
//     port: 3000,
//     reuseExistingServer: !isCI,
//     timeout: 120 * 1000,
//   } : undefined,
 });
=======
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
>>>>>>> 793dd5bda6d5bbdff37b5f769d7e462abdbb036b
