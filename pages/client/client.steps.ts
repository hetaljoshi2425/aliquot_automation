import { test, expect, Page } from '@playwright/test';
import { allure } from 'allure-playwright';

export const clickMyOrganization = (page: Page) =>
  test.step("Click My Organization", async () => {
    await allure.step("Click My Organization span", async () => {
      const myOrgSpan = page.locator('//span[contains(text(), "My Organization")]').first();
      await myOrgSpan.waitFor({ state: 'visible', timeout: 30000 });
      await expect(myOrgSpan).toBeEnabled();
      console.log("✅ Found My Organization span");
      await myOrgSpan.click();
      await page.waitForLoadState('networkidle', { timeout: 30000 });
    });
  });

export const clickDeleteClientIcon = async (page: Page, clientName: string) => {
  await allure.step(`Click delete icon for client: ${clientName}`, async () => {
    const deleteIcon = page.locator(`//td[contains(text(), "${clientName}")]/following-sibling::td//div[contains(@class, "list-delete-icon")]`);
    await deleteIcon.waitFor({ state: 'visible', timeout: 30000 });
    await deleteIcon.click();
  });
};

export const clickDeleteConfirmButton = async (page: Page) => {
  await allure.step("Click delete confirm button", async () => {
    const confirmBtn = page.locator('button:has-text("Delete")');
    await confirmBtn.waitFor({ state: 'visible', timeout: 30000 });
    await confirmBtn.click();
  });
};

export const clickDeleteCancelButton = async (page: Page) => {
  await allure.step("Click delete cancel button", async () => {
    const cancelBtn = page.locator('button:has-text("Cancel")');
    await cancelBtn.waitFor({ state: 'visible', timeout: 30000 });
    await cancelBtn.click();
  });
};
