import { test, expect } from '@playwright/test';

test('Site Management Navigation Test', async ({ page }) => {
  // Go to the URL of the page
  await page.goto('https://qa.aliquot.live/customers');

  // Verify if the page title is correct (or any other verification)
  const pageTitle = await page.title();
  expect(pageTitle).toBe('Aliquot - Site Management');

  // Interacting with the "Manage Customers" button
  const manageCustomersButton = await page.locator('text=Manage Customers');
  await expect(manageCustomersButton).toBeVisible();
  await manageCustomersButton.click();

  // Check if the "Manage Customers" section is visible after clicking
  const manageCustomersSection = await page.locator('text=Manage your customers');
  await expect(manageCustomersSection).toBeVisible();

  // Optionally, verify other sections like "Manage Buildings"
  const manageBuildingsButton = await page.locator('text=Manage Buildings');
  await expect(manageBuildingsButton).toBeVisible();
  await manageBuildingsButton.click();

  // Check if the "Manage Buildings" section appears
  const manageBuildingsSection = await page.locator('text=Manage your buildings');
  await expect(manageBuildingsSection).toBeVisible();

  // You can also test clicking other buttons, interacting with the Smart Scan feature, etc.
  const smartScanButton = await page.locator('text=Smart Scan');
  await expect(smartScanButton).toBeVisible();
  await smartScanButton.click();

  // Final check after navigating through the options
  const smartScanSection = await page.locator('text=QR and AR Scanning for quick lookups');
  await expect(smartScanSection).toBeVisible();
});
