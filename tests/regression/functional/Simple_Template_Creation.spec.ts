import { test, expect } from '@playwright/test';
import { goToAliquotQaLink, loginAquaUser } from '../../../pages/login/login.steps';

test.describe('Simple Template Creation Test', () => {
    test('Create Report Template - Simple Test', async ({ page }) => {
        console.log('📝 Testing Create Report Template functionality...');
        
        // Login
        await goToAliquotQaLink(page);
        await loginAquaUser(page, 'qa_automation@aquaphoenixsci.com', '12345678');
        await page.waitForTimeout(3000);
        
        // Navigate to Report Setup
        console.log('🖱️ Navigating to Report Setup...');
        const reportsTab = page.getByRole('button', { name: /Reports/i });
        await reportsTab.hover();
        await page.waitForTimeout(1000);
        
        const reportSetupLink = page.getByRole('menuitem', { name: 'Report Setup' }).or(
            page.getByText('Report Setup')
        );
        await reportSetupLink.click();
        await page.waitForLoadState('networkidle');
        
        // Step 1: Click on select client from the filter by location section once the page is fully loaded
        console.log('🔍 Step 1: Clicking on Select Client from Filter by Location...');
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(2000); // Wait for page to be fully loaded
        
        const clientSearchBox = page.locator('.location-item.aps-click').first();
        await expect(clientSearchBox).toBeVisible({ timeout: 10000 });
        await clientSearchBox.click();
        console.log('✅ Clicked on Select Client input');
        
        // Step 2: Client lookup window will open
        console.log('🔍 Step 2: Waiting for client lookup window to open...');
        await page.waitForTimeout(2000);
        
        // Step 3: Select the available client from the list
        console.log('🔍 Step 3: Selecting available client from the list...');
        // Look for the clickable table row containing the client name
        const clientOption = page.locator('tr.aps-table-row.aps-click:has-text("Aquaphoenix_automation")').first();
        
        await expect(clientOption).toBeVisible({ timeout: 10000 });
        await clientOption.click();
        console.log('✅ Client Aquaphoenix_automation selected from the list');
        
        // Step 4: The client lookup window will autoclose on client selection
        console.log('🔍 Step 4: Waiting for client lookup window to auto-close...');
        await page.waitForTimeout(2000);
        
        // Wait for the list to refresh after client selection
        console.log('🔄 Waiting for the list to refresh after client selection...');
        await page.waitForTimeout(3000);

        // Step 5: Then proceed on clicking the Create Report Template button
        console.log('➕ Step 5: Clicking Create Report Template button...');
        const createTemplateButton = page.getByRole('button', { name: /Create Report Template/i }).or(
            page.locator('button:has-text("Create")')
        );
        await expect(createTemplateButton).toBeVisible({ timeout: 10000 });
        await createTemplateButton.click();
        await page.waitForTimeout(2000);
        await page.waitForLoadState('networkidle');
        console.log('✅ Create Report Template button clicked');
        
        // Fill template name
        console.log('📝 Filling template name...');
        const templateName = `Test Template ${Date.now()}`;
        const templateNameInput = page.getByLabel('Template Name').or(
            page.locator('[data-testid="template-name"]')
        ).or(
            page.locator('.template-name, .template-input')
        ).or(
            page.locator('input[name*="name"]')
        );
        await templateNameInput.fill(templateName);
        
        // Save template
        console.log('💾 Saving template...');
        const saveTemplateButton = page.getByRole('button', { name: /Save Report Template/i }).or(
            page.locator('button:has-text("Save")')
        );
        await expect(saveTemplateButton).toBeVisible({ timeout: 10000 });
        await saveTemplateButton.click();
        await page.waitForTimeout(2000);
        await page.waitForLoadState('networkidle');
        
        // Verify success
        console.log('✅ Verifying success...');
        const successMessage = page.getByText('Report Template has been saved successfully').or(
            page.getByText('Template saved successfully').or(
                page.getByText('Successfully saved')
            ).or(
                page.getByText('Template created successfully')
            ).or(
                page.getByText('Template added successfully')
            ).or(
                page.getByText('Successfully saved')
            ).or(
                page.getByText('Template created successfully')
            ).or(
                page.getByText('Template added successfully')
            ).or(
                page.getByText('Template created successfully')
            ).or(
                page.getByText('Template added successfully')
            ).or(
                page.getByText('Template saved successfully')
            ).or(
                page.getByText('Successfully saved')
            ).or(
                page.getByText('Template created successfully')
            ).or(
                page.getByText('Template added successfully')
            )
        );
        await expect(successMessage).toBeVisible({ timeout: 10000 });
        console.log('✅ Template saved successfully');
    });
});
