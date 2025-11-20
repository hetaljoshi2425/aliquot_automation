import { Page, test, expect } from '@playwright/test';
import { goToAliquotQaLink, loginAquaUser } from '../../../pages/login/login.steps';
import { ALIQUOT_USERNAME_QA, ALIQUOT_PASSWORD_QA } from '../../../utils/constants';

const DEFAULT_WAIT = 10000;

// Helper: wait for permissions list to reload.
// If you know the backend endpoint that drives the list, pass urlSubstring (e.g. '/permissions').
// Otherwise it falls back to waiting for the table to be visible.
async function waitForPermissionsReload(page: Page, options?: { urlSubstring?: string; timeout?: number }) {
  const timeout = options?.timeout ?? DEFAULT_WAIT;
  if (options?.urlSubstring) {
    try {
      await page.waitForResponse(
        (resp) => resp.url().includes(options!.urlSubstring!) && resp.status() === 200,
        { timeout }
      );
      return;
    } catch {
      // fallback to DOM stabilization if response wait failed
    }
  }
  await page.locator('table').waitFor({ state: 'visible', timeout });
}

test.describe('Login with valid credentials', () => {
  // Perform navigation + login before each test
  test.beforeEach(async ({ page }: { page: Page }) => {
    await goToAliquotQaLink(page);
    await page.waitForLoadState('networkidle');
    await loginAquaUser(page, ALIQUOT_USERNAME_QA, ALIQUOT_PASSWORD_QA);
    await expect(page.getByRole('button', { name: 'Utilities' })).toBeVisible({ timeout: DEFAULT_WAIT });
  });

  test('Create Permission Template', async ({ page }: { page: Page }) => {
    await page.getByRole('button', { name: 'Utilities' }).click();
    await page.getByText('Permission Templates', { exact: true }).click();

    const createPermissionButton = page.getByRole('button', { name: 'Create Permission' });
    await expect(createPermissionButton).toBeVisible({ timeout: DEFAULT_WAIT });
    await createPermissionButton.click();

    const permissionTemplateTitle = page.getByRole('textbox', { name: 'Enter a name for this' });
    await expect(permissionTemplateTitle).toBeVisible({ timeout: DEFAULT_WAIT });
    await permissionTemplateTitle.fill('Test Permission');

    const permissionUpdate = page.getByRole('button', { name: 'Edit' }).nth(2);
    await permissionUpdate.click();

    const permissionUpdate1 = page.getByRole('button', { name: 'Edit' }).nth(4);
    await permissionUpdate1.click();

    const savePermissionButton = page.getByRole('button', { name: 'Save Permission' });
    await expect(savePermissionButton).toBeVisible({ timeout: DEFAULT_WAIT });
    await savePermissionButton.click();

    // wait for list to reload (adjust urlSubstring if you have a real endpoint)
    await waitForPermissionsReload(page, { urlSubstring: '/permissions', timeout: DEFAULT_WAIT });

    const searchInput = page.getByPlaceholder('Search for permission...');
    await expect(searchInput).toBeVisible({ timeout: DEFAULT_WAIT });
    await searchInput.fill('Test Permission');

    const cell = page.getByRole('cell', { name: 'Test Permission', exact: true });
    await expect(cell).toBeVisible({ timeout: DEFAULT_WAIT });
    await cell.click();

    // ensure permission title area exists before closing
    await page.locator('div').filter({ hasText: /^Test Permission$/ }).first().waitFor({ timeout: DEFAULT_WAIT });
    const closePermissionButton = page.getByRole('button', { name: 'Close Permission Window' });
    await expect(closePermissionButton).toBeVisible({ timeout: DEFAULT_WAIT });
    await closePermissionButton.click();
  });

  test('Clone Permission Template', async ({ page }: { page: Page }) => {
    await page.getByRole('button', { name: 'Utilities' }).click();
    await page.getByText('Permission Templates', { exact: true }).click();

    const table = page.locator('table');
    await expect(table).toBeVisible({ timeout: DEFAULT_WAIT });

    // find exact cell then derive row (avoids substring collisions with _clone_1)
    const nameCell = page.getByRole('cell', { name: 'Test Permission', exact: true });
    await expect(nameCell).toBeVisible({ timeout: DEFAULT_WAIT });
    const row = nameCell.locator('xpath=ancestor::tr');
    await expect(row).toBeVisible({ timeout: DEFAULT_WAIT });

    await row.hover();
    const cloneTemplateBtn = row.locator('.permissionsList-clone-row .aps-icon-svg').first();
    await expect(cloneTemplateBtn).toBeVisible({ timeout: DEFAULT_WAIT });
    await cloneTemplateBtn.click();

    // wait for list to reload after clone
    await waitForPermissionsReload(page, { urlSubstring: '/permissions', timeout: DEFAULT_WAIT });

    const searchInput = page.getByPlaceholder('Search for permission...');
    await expect(searchInput).toBeVisible({ timeout: DEFAULT_WAIT });
    await searchInput.fill('Test Permission_clone_1');

    const clonedCell = page.getByRole('cell', { name: 'Test Permission_clone_1', exact: true });
    await expect(clonedCell).toBeVisible({ timeout: DEFAULT_WAIT });
    await clonedCell.click();
  });

  test('Edit Permission Template', async ({ page }: { page: Page }) => {
    await page.getByRole('button', { name: 'Utilities' }).click();
    await page.getByText('Permission Templates', { exact: true }).click();

    const table = page.locator('table');
    await expect(table).toBeVisible({ timeout: DEFAULT_WAIT });

    const nameCell = page.getByRole('cell', { name: 'Test Permission', exact: true });
    await expect(nameCell).toBeVisible({ timeout: DEFAULT_WAIT });
    const row = nameCell.locator('xpath=ancestor::tr[1]');
    await expect(row).toBeVisible({ timeout: DEFAULT_WAIT });

    await row.click();

    await page.getByRole('button', { name: 'Edit Permission' }).click();
    // await page.getByText('Permission Templates', { exact: true }).click();

    const permissionTempName = page.getByRole('textbox', { name: 'Description' });
    await permissionTempName.fill("Test permission Updated");
    // await page.getByRole('textbox', { name: 'Enter a name for this' }).fill('Test Permission ');
    // await page.getByRole('textbox', { name: 'Enter a name for this' }).press('ControlOrMeta+a');
    // await page.getByRole('textbox', { name: 'Enter a name for this' }).fill('Test permission Updated');

    
    const savePermissionButton = page.getByRole('button', { name: 'Save Permission' });
    await expect(savePermissionButton).toBeVisible({ timeout: DEFAULT_WAIT });
  });
});
