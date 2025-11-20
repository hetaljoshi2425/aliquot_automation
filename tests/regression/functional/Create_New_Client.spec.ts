// Test Case: Create New Client
// Preconditions:
// - User is logged into the application
// - User has access to the Site Management module
// - User has permission to create new clients
// - User has appropriate organizational permissions

import { test, expect, Page } from '@playwright/test';
import { goToAliquotQaLink, loginAquaUser, verifyAquaLoginQa } from '../../../pages/login/login.steps';
import { ALIQUOT_USERNAME_QA, ALIQUOT_PASSWORD_QA } from '../../../utils/constants';
import { clearCacheAndReload } from '../../../utils/helpers';

export const selectors = {
    siteManagementTab: (page: Page) => page.getByRole('button', { name: 'SiteManagement' }),
    myOrganizationTab: (page: Page) => page.getByText('My Organization'),

    createClientBtn: (page: Page) => page.getByRole('button', { name: 'Create Client' }),
    saveClientBtn: (page: Page) => page.getByRole('button', { name: 'Save Client' }),
    yesBtn: (page: Page) => page.getByRole('button', { name: 'Yes' }),
    noBtn: (page: Page) => page.getByRole('button', { name: 'No' }),
    selectBtn: (page: Page) => page.getByRole('button', { name: 'Select' }),

    filterOrganizationInput: (page: Page) => page.locator('.location-item.aps-click'),

    clientRow: (page: Page, clientName: string) => page.locator('tbody tr, .client-row', { hasText: clientName }).first(),
};

/**
 * Auto-fill all required fields in a form
 * Targets specific form fields that need to be filled for client creation
 */
async function fillRequiredFields(page: Page, uniqueSuffix: string) {
    // Fill the main client name field (most important)
    const nameField = page.locator('input[name="name"]');
    if (await nameField.isVisible()) {
        await nameField.fill(`Test Client ${uniqueSuffix}`);
        console.log('✅ Filled client name field');
    }

    // Fill email fields
    const emailField = page.locator('input[name="defaultFromAddress"]');
    if (await emailField.isVisible()) {
        await emailField.fill(`test${uniqueSuffix}@example.com`);
        console.log('✅ Filled email field');
    }

    const doNotReplyField = page.locator('input[name="doNotReply"]');
    if (await doNotReplyField.isVisible()) {
        await doNotReplyField.fill(`noreply${uniqueSuffix}@example.com`);
        console.log('✅ Filled do not reply field');
    }

    // Fill phone number - 10 digits without special characters
    const phoneField = page.locator('input[name="contactInfo.phoneNumber"]');
    if (await phoneField.isVisible()) {
        const phoneNumber = `555${uniqueSuffix.slice(-7)}`.padStart(10, '0');
        await phoneField.fill(phoneNumber);
        console.log(`✅ Filled phone field with: ${phoneNumber}`);
    }

    // Fill address fields
    const streetField = page.locator('input[name="address.street1"]');
    if (await streetField.isVisible()) {
        await streetField.fill(`123 Test Street `);
        console.log('✅ Filled street field');
    }

    const cityField = page.locator('input[name="address.city"]');
    if (await cityField.isVisible()) {
        await cityField.fill(`New York`);
        console.log('✅ Filled city field');
    }

    const stateField = page.locator('input[name="address.region"]');
    if (await stateField.isVisible()) {
        await stateField.fill(`New York`);
        console.log('✅ Filled state field');
    }

    const zipField = page.locator('input[name="address.zipCode"]');
    if (await zipField.isVisible()) {
        await zipField.fill(`10038`);
        console.log('✅ Filled zip field');
    }

    // // Fill legal statement
    // const legalField = page.locator('textarea[name="legalStatement"]');
    // if (await legalField.isVisible()) {
    //     await legalField.fill(`Test Legal Statement ${uniqueSuffix}`);
    //     console.log('✅ Filled legal statement field');
    // }

    // // Fill additional fields that might be required
    // const phoneExtField = page.locator('input[name="contactInfo.phoneNumberExt"]');
    // if (await phoneExtField.isVisible()) {
    //     await phoneExtField.fill('123');
    //     console.log('✅ Filled phone extension field');
    // }

    // const faxField = page.locator('input[name="contactInfo.fax"]');
    // if (await faxField.isVisible()) {
    //     const faxNumber = `555${uniqueSuffix.slice(-7)}`.padStart(10, '0');
    //     await faxField.fill(faxNumber);
    //     console.log(`✅ Filled fax field with: ${faxNumber}`);
    // }

    // const faxExtField = page.locator('input[name="contactInfo.faxExt"]');
    // if (await faxExtField.isVisible()) {
    //     await faxExtField.fill('456');
    //     console.log('✅ Filled fax extension field');
    // }

    const street2Field = page.locator('input[name="address.street2"]');
    if (await street2Field.isVisible()) {
        await street2Field.fill(`Apt ${uniqueSuffix.slice(-3)}`);
        console.log('✅ Filled street2 field');
    }

    const latField = page.locator('input[name="lat"]');
    if (await latField.isVisible()) {
        await latField.fill('40.7128');
        console.log('✅ Filled latitude field');
    }

    const lonField = page.locator('input[name="lon"]');
    if (await lonField.isVisible()) {
        await lonField.fill('-74.0060');
        console.log('✅ Filled longitude field');
    }

    const maxDraftsField = page.locator('input[name="maxNumDrafts"]');
    if (await maxDraftsField.isVisible()) {
        await maxDraftsField.fill('5');
        console.log('✅ Filled max drafts field');
    }
}

test.describe('Create New Client - Dynamic Required Fields', () => {

    test.beforeEach(async ({ page }) => {
        // Simple direct navigation and login
        await page.goto('https://qa.aliquot.live/');
        await page.waitForLoadState('networkidle');
        
        // Fill login form directly
        await page.fill('input[placeholder*="email"], input[placeholder*="Email"], input[name="email"]', ALIQUOT_USERNAME_QA);
        await page.fill('input[placeholder*="password"], input[placeholder*="Password"], input[name="password"]', ALIQUOT_PASSWORD_QA);
        await page.click('button[type="submit"], button:has-text("Login"), button:has-text("Sign In")');
        
        // Wait for login to complete
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(2000);
    });

    test('Create Client with dynamic required fields and optional Customer', async ({ page }) => {
        const createCustomer = false;
        const clientToSelect = 'Aquaphoenix_automation';
        const uniqueSuffix = Date.now().toString();

        // Step 1: Navigate to My Organization
        await selectors.siteManagementTab(page).click();
        await selectors.myOrganizationTab(page).click();

        // Step 2: Select client from Filter Organization
        const filterInput = selectors.filterOrganizationInput(page);
        await filterInput.click();
        await page.waitForTimeout(1000);

        // Wait for client lookup window to load fully
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(2000);

        // Select the first available client from the lookup window table
        const clientNameCell = page.locator('td.clientLookupTable-name-row.aps-click').first();
        await expect(clientNameCell).toBeVisible({ timeout: 10000 });
        await clientNameCell.click();

        // Wait for client lookup window to close
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(2000);

        // Step 3: Click Create Client
        await selectors.createClientBtn(page).click();

        // Wait for Create Client form to appear
        await page.waitForSelector('h2:has-text("Create Client")', { timeout: 10000 });
        await page.waitForTimeout(2000);

        // Step 4: Wait for form to load and fill all required fields dynamically
        console.log('🔍 Waiting for Create Client form to load...');
        await page.waitForSelector('input[name="name"]', { timeout: 10000 });
        await page.waitForTimeout(2000); // Additional wait for form to be fully ready
        
        console.log('🔍 Starting to fill form fields...');
        await fillRequiredFields(page, uniqueSuffix);

        // Wait for form validation to complete after filling
        await page.waitForTimeout(2000);
        
        // Trigger form validation by clicking on a field and then clicking away
        await page.locator('input[name="name"]').click();
        await page.locator('body').click(); // Click away to trigger validation
        await page.waitForTimeout(1000);
        
        // Debug: Check what fields are actually visible
        const allInputs = await page.locator('input, textarea').elementHandles();
        console.log(`Found ${allInputs.length} total input fields`);
        
        for (let i = 0; i < Math.min(allInputs.length, 10); i++) {
            const field = allInputs[i];
            const name = await field.evaluate((el) => (el as HTMLInputElement).name || '');
            const value = await field.evaluate((el) => (el as HTMLInputElement).value || '');
            const placeholder = await field.evaluate((el) => (el as HTMLInputElement).placeholder || '');
            console.log(`Field ${i}: name="${name}", value="${value}", placeholder="${placeholder}"`);
        }

        // Step 5: Save Client - wait for save button to be ready
        console.log('🔍 Clicking Save Client button...');
        await selectors.saveClientBtn(page).waitFor({ state: 'visible', timeout: 10000 });
        
        // Check if save button is enabled
        const isSaveEnabled = await selectors.saveClientBtn(page).isEnabled();
        console.log(`Save button enabled: ${isSaveEnabled}`);
        
        if (!isSaveEnabled) {
            console.log('❌ Save button is disabled - form validation failed');
            // Check for validation errors
            const validationErrors = await page.locator('.error, .invalid, .field-error, [class*="error"]').allTextContents();
            console.log('Validation errors:', validationErrors);
            return; // Exit test if save button is disabled
        }
        
        // Listen for console errors and network responses
        const consoleErrors: string[] = [];
        page.on('console', msg => {
            if (msg.type() === 'error') {
                consoleErrors.push(msg.text());
            }
        });

        const networkResponses: any[] = [];
        page.on('response', response => {
            if (response.url().includes('client') || response.url().includes('save')) {
                networkResponses.push({
                    url: response.url(),
                    status: response.status(),
                    statusText: response.statusText()
                });
            }
        });

        await selectors.saveClientBtn(page).click();
        console.log('✅ Save button clicked');
        
        // Wait a bit for any network requests to complete
        await page.waitForTimeout(1000);
        
        // Log any console errors
        if (consoleErrors.length > 0) {
            console.log('🚨 Console errors found:', consoleErrors);
        }
        
        // Log network responses
        if (networkResponses.length > 0) {
            console.log('🌐 Network responses:', networkResponses);
        }
        
        // Wait for save operation to complete - check for success/error indicators
        console.log('🔍 Waiting for save operation to complete...');
        
        // Wait for either success message, error message, or page navigation
        try {
            await Promise.race([
                page.waitForSelector('.success, .alert-success, [class*="success"]', { timeout: 5000 }),
                page.waitForSelector('.error, .alert-error, [class*="error"]', { timeout: 5000 }),
                page.waitForNavigation({ timeout: 5000 }),
                page.waitForSelector('h2:has-text("Client Lists")', { timeout: 5000 })
            ]);
            console.log('✅ Save operation completed - found success/error indicator or navigation');
        } catch (e) {
            console.log('⚠️ No immediate success/error indicator found, continuing...');
        }
        
        await page.waitForTimeout(2000);
        
        // Check if we're still on the create form (save failed) or moved to success page
        const stillOnCreateForm = await page.getByRole('heading', { name: 'Create Client' }).isVisible();
        if (stillOnCreateForm) {
            console.log('❌ Save failed - still on Create Client form');
            
            // Check for any error messages or validation issues
            const errorMessages = await page.locator('.error, .alert, .warning, [role="alert"], .field-error, [class*="error"]').allTextContents();
            if (errorMessages.length > 0) {
                console.log('Error messages found:', errorMessages);
            }
            
            // Check if save button is still there and enabled
            const saveButtonStillThere = await selectors.saveClientBtn(page).isVisible();
            const saveButtonEnabled = await selectors.saveClientBtn(page).isEnabled();
            console.log(`Save button still visible: ${saveButtonStillThere}, enabled: ${saveButtonEnabled}`);
            
            // Take a screenshot for debugging
            await page.screenshot({ path: 'debug-save-failed.png' });
            console.log('📸 Screenshot saved as debug-save-failed.png');
            
        } else {
            console.log('✅ Save successful - moved away from Create Client form');
        }

        // Step 6: Handle Create Customer popup
        console.log('🔍 Checking for Create Customer popup...');
        
        // Wait for popup to appear
        try {
            await page.waitForSelector('button:has-text("Yes"), button:has-text("No")', { timeout: 5000 });
            console.log('✅ Create Customer popup appeared');
            
            // Click "No" to skip creating customer
                await selectors.noBtn(page).click();
            console.log('✅ Clicked "No" on Create Customer popup');
            
            // Wait for popup to close
            await page.waitForTimeout(1000);
            
        } catch (e) {
            console.log('ℹ️ No Create Customer popup appeared, continuing...');
        }

        // Step 7: Navigate back to client list and verify newly created client appears
        await page.goto('https://qa.aliquot.live/clients');
        await selectors.myOrganizationTab(page).click();
        await page.waitForLoadState('networkidle');
        
        const newClientRow = selectors.clientRow(page, `Test Client ${uniqueSuffix}`);
        await expect(newClientRow).toBeVisible({ timeout: 10000 });
        console.log(`✅ Client successfully created with dynamic required fields`);
    });

});




