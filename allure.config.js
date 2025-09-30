const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  reporter: [
    ['allure-playwright', {
      outputFolder: 'allure-results',
      detail: true,
      suiteTitle: false,
      environmentInfo: {
        NODE_VERSION: process.version,
        NPM_VERSION: process.env.npm_version || 'unknown',
        OS: process.platform,
        ARCHITECTURE: process.arch
      }
    }]
  ]
});
