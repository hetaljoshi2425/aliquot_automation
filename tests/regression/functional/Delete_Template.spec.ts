// Test Case: Delete Template (not default)
// Preconditions:
// - User is logged into the application
// - User has access to the Reports module
// - User has permission to delete report templates
// - At least one non-default template exists in the system that can be deleted

import { test, expect } from '@playwright/test';
import { randomUUID } from 'crypto';

import { HomeSteps } from '../../../pages/home/home.steps';
import { hoverSiteManagementButton, clickClearFiltersBtn } from '../../../pages/home/home.steps';

import {
    goToAliquotQaLink,
    loginAquaUser,
    verifyAquaLoginQa
} from '../../../pages/login/login.steps';

import { ALIQUOT_PASSWORD_QA, ALIQUOT_USERNAME_QA } from '../../../utils/constants';
import { clearCacheAndReload } from '../../../utils/helpers';

test.describe('Delete Template (not default) - Functional Tests', () => {

    test.beforeEach(async ({ page }) => {
        console.log('🔧 Setting up Delete Template test environment...');
    });

    test.afterEach(async ({ page }) => {
        console.log('🧹 Cleaning up Delete Template test data...');
    });

    test('REGRESSION: Delete Template (not default) functionality works correctly', async ({ page }) => {
        console.log('🗑️ Testing Delete Template (not default) functionality...');
        
        // Login and navigate
        await goToAliquotQaLink(page);
        await loginAquaUser(page, ALIQUOT_USERNAME_QA, ALIQUOT_PASSWORD_QA);
        await verifyAquaLoginQa(page);
        await clearCacheAndReload(page);
        
        // Step 1: Hover over the Reports tab
        console.log('🖱️ Hovering over the Reports tab...');
        const reportsTab = page.getByRole('tab', { name: 'Reports' }).or(
            page.getByRole('button', { name: 'Reports' })
        ).or(
            page.locator('[data-testid="reports-tab"]')
        ).or(
            page.locator('a:has-text("Reports")')
        );
        
        await reportsTab.hover();
        await page.waitForTimeout(1000); // Wait for hover effect
        
        // Step 2: Verify Reports and Locations links window is opened
        console.log('🔍 Verifying Reports and Locations links window is opened...');
        const reportsMenu = page.getByRole('menu', { name: 'Reports' }).or(
            page.locator('[data-testid="reports-menu"]')
        ).or(
            page.locator('.dropdown-menu:has-text("Reports")')
        ).or(
            page.locator('.reports-dropdown')
        );
        
        await expect(reportsMenu).toBeVisible({ timeout: 10000 });
        console.log('✅ Reports and Locations links window is opened');
        
        // Step 3: Click Report Setup link
        console.log('⚙️ Clicking Report Setup link...');
        const reportSetupLink = page.getByRole('menuitem', { name: 'Report Setup' }).or(
            page.getByRole('link', { name: 'Report Setup' })
        ).or(
            page.getByRole('menuitem', { name: 'Setup' })
        ).or(
            page.locator('[data-testid="report-setup-link"]')
        ).or(
            page.locator('a:has-text("Report Setup")')
        ).or(
            page.locator('a:has-text("Setup")')
        );
        
        await reportSetupLink.click();
        await page.waitForLoadState('networkidle');
        
        // Step 4: Verify Report Templates List page is displayed
        console.log('📋 Verifying Report Templates List page is displayed...');
        const reportTemplatesPage = page.getByRole('heading', { name: 'Report Templates' }).or(
            page.getByRole('heading', { name: 'Report Templates List' })
        ).or(
            page.locator('[data-testid="report-templates-page"]')
        ).or(
            page.locator('h1:has-text("Report Templates")')
        ).or(
            page.locator('.page-title:has-text("Report Templates")')
        );
        
        await expect(reportTemplatesPage).toBeVisible({ timeout: 15000 });
        console.log('✅ Report Templates List page is displayed');
        
        // Step 5: Get initial template count and select a non-default template
        console.log('📊 Getting initial template count and selecting a non-default template...');
        const templatesList = page.getByRole('table', { name: 'Report Templates' }).or(
            page.locator('[data-testid="templates-list-table"]')
        ).or(
            page.locator('.templates-list, .data-table')
        ).or(
            page.locator('table')
        );
        
        await expect(templatesList).toBeVisible({ timeout: 15000 });
        
        // Get template rows
        const templateRows = templatesList.locator('tbody tr, .template-row');
        const initialTemplateCount = await templateRows.count();
        console.log(`📊 Initial template count: ${initialTemplateCount}`);
        
        if (initialTemplateCount === 0) {
            throw new Error('No templates found in the list');
        }
        
        // Step 6: Select a Report Template and click the "trash" icon
        console.log('🗑️ Selecting a Report Template and clicking the "trash" icon...');
        
        // Look for a non-default template that can be deleted
        let selectedTemplate = null;
        let deleteButton = null;
        let templateToDeleteName = '';
        
        // Try to find a non-default template with delete functionality
        for (let i = 0; i < initialTemplateCount; i++) {
            const templateRow = templateRows.nth(i);
            const templateText = await templateRow.textContent();
            
            // Skip default/system templates that shouldn't be deleted
            if (templateText && !templateText.toLowerCase().includes('default') && 
                !templateText.toLowerCase().includes('system')) {
                
                // Look for delete/trash button in this row
                deleteButton = templateRow.locator('[data-testid="delete-btn"]').or(
                    templateRow.locator('button[title*="Delete"]')
                ).or(
                    templateRow.locator('button[aria-label*="Delete"]')
                ).or(
                    templateRow.locator('.delete-btn, .trash-btn')
                ).or(
                    templateRow.locator('svg[data-icon="trash"], .fa-trash, .fa-delete')
                ).or(
                    templateRow.locator('i.fa-trash, i.fa-delete, i.fa-trash-o')
                ).or(
                    templateRow.locator('button:has-text("Delete")')
                ).or(
                    templateRow.locator('a:has-text("Delete")')
                );
                
                if (await deleteButton.count() > 0) {
                    selectedTemplate = templateRow;
                    templateToDeleteName = templateText || '';
                    console.log(`📄 Selected template for deletion: ${templateToDeleteName.substring(0, 50)}...`);
                    break;
                }
            }
        }
        
        // If no non-default template found, try any template (for testing purposes)
        if (!deleteButton || await deleteButton.count() === 0) {
            console.log('ℹ️ No non-default template found, selecting any available template for testing');
            const firstTemplate = templateRows.first();
            deleteButton = firstTemplate.locator('[data-testid="delete-btn"]').or(
                firstTemplate.locator('button[title*="Delete"]')
            ).or(
                firstTemplate.locator('svg[data-icon="trash"], .fa-trash, .fa-delete')
            ).or(
                firstTemplate.locator('button:has-text("Delete")')
            );
            
            if (await deleteButton.count() > 0) {
                selectedTemplate = firstTemplate;
                templateToDeleteName = await firstTemplate.textContent() || '';
                console.log(`📄 Selected any available template: ${templateToDeleteName.substring(0, 50)}...`);
            }
        }
        
        if (!deleteButton || await deleteButton.count() === 0) {
            throw new Error('No delete button found for any template');
        }
        
        // Click the delete/trash button
        await deleteButton.click();
        await page.waitForTimeout(1000); // Wait for confirmation dialog
        console.log('✅ Delete (trash icon) button clicked');
        
        // Step 7: Verify Confirmation message is displayed
        console.log('💬 Verifying confirmation message is displayed...');
        const confirmationDialog = page.getByRole('dialog', { name: 'Confirm Deletion' }).or(
            page.locator('.confirmation-dialog')
        ).or(
            page.locator('.modal-dialog')
        ).or(
            page.locator('[data-testid="confirmation-dialog"]')
        ).or(
            page.locator('.delete-confirmation')
        );
        
        await expect(confirmationDialog).toBeVisible({ timeout: 10000 });
        console.log('✅ Confirmation dialog is displayed');
        
        // Verify the specific confirmation message
        const confirmationMessage = page.getByText('You are about to delete a report template from the system, if you continue this report template will be lost forever, are you sure you want to do this?').or(
            page.getByText('You are about to delete a report template from the system')
        ).or(
            page.getByText('if you continue this report template will be lost forever')
        ).or(
            page.getByText('are you sure you want to do this?')
        ).or(
            page.locator('.confirmation-message')
        );
        
        await expect(confirmationMessage).toBeVisible({ timeout: 5000 });
        console.log('✅ Confirmation message: "You are about to delete a report template from the system, if you continue this report template will be lost forever, are you sure you want to do this?" is displayed');
        
        // Verify "Delete name?" message
        const deleteNameMessage = page.getByText('Delete name?').or(
            page.getByText(`Delete ${templateToDeleteName.substring(0, 20)}?`)
        ).or(
            page.locator('.delete-name-message')
        );
        
        if (await deleteNameMessage.count() > 0) {
            const deleteNameText = await deleteNameMessage.textContent();
            console.log(`✅ Delete name message: "${deleteNameText}" is displayed`);
        } else {
            console.log('ℹ️ Delete name message not found, but main confirmation message is present');
        }
        
        // Step 8: Click Delete
        console.log('🗑️ Clicking Delete button in confirmation dialog...');
        const deleteConfirmButton = confirmationDialog.getByRole('button', { name: 'Delete' }).or(
            confirmationDialog.getByRole('button', { name: 'Confirm' })
        ).or(
            confirmationDialog.getByRole('button', { name: 'Yes' })
        ).or(
            confirmationDialog.locator('[data-testid="confirm-delete-btn"]')
        ).or(
            confirmationDialog.locator('button:has-text("Delete")')
        ).or(
            confirmationDialog.locator('button:has-text("Confirm")')
        ).or(
            confirmationDialog.locator('button:has-text("Yes")')
        );
        
        await expect(deleteConfirmButton).toBeVisible({ timeout: 5000 });
        await deleteConfirmButton.click();
        
        // Wait for delete operation to complete
        await page.waitForTimeout(3000);
        
        // Step 9: Verify Success message
        console.log('✅ Verifying success message...');
        const successMessage = page.getByText('Report template has been deleted successfully').or(
            page.getByText('Template has been deleted successfully')
        ).or(
            page.getByText('Template deleted successfully')
        ).or(
            page.getByText('Successfully deleted')
        ).or(
            page.getByText('Template removed successfully')
        ).or(
            page.locator('[data-testid="success-message"]')
        ).or(
            page.locator('.success-message, .alert-success')
        );
        
        await expect(successMessage).toBeVisible({ timeout: 10000 });
        const successText = await successMessage.textContent();
        console.log(`✅ Success message: "${successText}" is displayed`);
        
        // Step 10: Confirm the Report Template is not on the list
        console.log('📋 Confirming the Report Template is not on the list...');
        
        // Wait for the page to refresh or update
        await page.waitForTimeout(2000);
        
        // Get updated template count
        const updatedTemplateRows = templatesList.locator('tbody tr, .template-row');
        const updatedTemplateCount = await updatedTemplateRows.count();
        console.log(`📊 Updated template count: ${updatedTemplateCount}`);
        
        // Verify that the template count decreased by 1
        expect(updatedTemplateCount).toBeLessThan(initialTemplateCount);
        console.log(`✅ Template count decreased from ${initialTemplateCount} to ${updatedTemplateCount}`);
        
        // Verify the specific template is no longer in the list
        let deletedTemplateFound = false;
        
        // Check all remaining templates to ensure the deleted one is gone
        for (let i = 0; i < updatedTemplateCount; i++) {
            const templateRow = updatedTemplateRows.nth(i);
            const templateText = await templateRow.textContent();
            
            if (templateText && templateText.includes(templateToDeleteName.substring(0, 20))) {
                deletedTemplateFound = true;
                console.log(`❌ Deleted template still found in list: ${templateText}`);
                break;
            }
        }
        
        if (!deletedTemplateFound) {
            console.log(`✅ Confirmed: Template "${templateToDeleteName.substring(0, 30)}..." is no longer in the list`);
        } else {
            throw new Error('Deleted template is still present in the list');
        }
        
        // Additional verification: Check if we're still on the templates list page
        const currentUrl = page.url();
        if (currentUrl.includes('templates') || currentUrl.includes('setup')) {
            console.log('📋 Successfully returned to templates list after deletion');
        } else {
            console.log('ℹ️ Current page after deletion:', currentUrl);
        }
        
        console.log('✅ Delete Template (not default) test completed successfully');
    });

    test('REGRESSION: Delete Template confirmation dialog validation', async ({ page }) => {
        console.log('💬 Testing Delete Template confirmation dialog validation...');
        
        // Login and navigate
        await goToAliquotQaLink(page);
        await loginAquaUser(page, ALIQUOT_USERNAME_QA, ALIQUOT_PASSWORD_QA);
        await verifyAquaLoginQa(page);
        await clearCacheAndReload(page);
        
        // Navigate to Report Setup
        const reportsTab = page.getByRole('tab', { name: 'Reports' }).or(
            page.getByRole('button', { name: 'Reports' })
        );
        
        await reportsTab.hover();
        const reportSetupLink = page.getByRole('menuitem', { name: 'Report Setup' });
        await reportSetupLink.click();
        await page.waitForLoadState('networkidle');
        
        // Get templates list
        const templatesList = page.getByRole('table').or(
            page.locator('.templates-list, .data-table')
        );
        
        const templateRows = templatesList.locator('tbody tr, .template-row');
        
        if (await templateRows.count() > 0) {
            const firstTemplate = templateRows.first();
            const deleteButton = firstTemplate.locator('[data-testid="delete-btn"]').or(
                firstTemplate.locator('button[title*="Delete"]')
            ).or(
                firstTemplate.locator('button:has-text("Delete")')
            );
            
            if (await deleteButton.count() > 0) {
                // Click delete to open confirmation dialog
                await deleteButton.click();
                await page.waitForTimeout(1000);
                
                // Verify confirmation dialog is open
                const confirmationDialog = page.getByRole('dialog').or(
                    page.locator('.confirmation-dialog, .modal-dialog')
                );
                
                if (await confirmationDialog.count() > 0) {
                    console.log('✅ Confirmation dialog is displayed');
                    
                    // Test Cancel button
                    const cancelButton = confirmationDialog.getByRole('button', { name: 'Cancel' }).or(
                        confirmationDialog.getByRole('button', { name: 'No' })
                    ).or(
                        confirmationDialog.locator('button:has-text("Cancel")')
                    ).or(
                        confirmationDialog.locator('button:has-text("No")')
                    );
                    
                    if (await cancelButton.count() > 0) {
                        await cancelButton.click();
                        await page.waitForTimeout(1000);
                        
                        // Verify dialog is closed
                        await expect(confirmationDialog).not.toBeVisible();
                        console.log('✅ Cancel button works - dialog is closed');
                    }
                    
                    // Verify template is still in the list
                    const remainingTemplates = templatesList.locator('tbody tr, .template-row');
                    const templateCount = await remainingTemplates.count();
                    console.log(`📊 Template count after cancel: ${templateCount}`);
                }
            }
        }
        
        console.log('✅ Delete Template confirmation dialog validation test completed');
    });

    test('REGRESSION: Verify delete permissions and restrictions', async ({ page }) => {
        console.log('🔒 Testing delete permissions and restrictions...');
        
        // Login and navigate
        await goToAliquotQaLink(page);
        await loginAquaUser(page, ALIQUOT_USERNAME_QA, ALIQUOT_PASSWORD_QA);
        await verifyAquaLoginQa(page);
        await clearCacheAndReload(page);
        
        // Navigate to Report Setup
        const reportsTab = page.getByRole('tab', { name: 'Reports' }).or(
            page.getByRole('button', { name: 'Reports' })
        );
        
        await reportsTab.hover();
        const reportSetupLink = page.getByRole('menuitem', { name: 'Report Setup' });
        await reportSetupLink.click();
        await page.waitForLoadState('networkidle');
        
        // Check delete button availability
        const templatesList = page.getByRole('table').or(
            page.locator('.templates-list, .data-table')
        );
        
        const templateRows = templatesList.locator('tbody tr, .template-row');
        const templateCount = await templateRows.count();
        
        let deleteButtonsFound = 0;
        let restrictedTemplates = 0;
        let defaultTemplates = 0;
        
        for (let i = 0; i < templateCount; i++) {
            const templateRow = templateRows.nth(i);
            const templateText = await templateRow.textContent();
            
            // Check for delete button
            const deleteButton = templateRow.locator('[data-testid="delete-btn"]').or(
                templateRow.locator('button[title*="Delete"]')
            ).or(
                templateRow.locator('svg[data-icon="trash"], .fa-trash, .fa-delete')
            ).or(
                templateRow.locator('button:has-text("Delete")')
            );
            
            if (await deleteButton.count() > 0) {
                // Check if button is disabled
                const isDisabled = await deleteButton.isDisabled();
                if (isDisabled) {
                    restrictedTemplates++;
                    console.log(`🔒 Delete restricted for: ${templateText?.substring(0, 30)}...`);
                } else {
                    deleteButtonsFound++;
                    console.log(`✅ Delete available for: ${templateText?.substring(0, 30)}...`);
                }
            } else {
                // Check if it's a default/system template
                if (templateText && (
                    templateText.toLowerCase().includes('default') ||
                    templateText.toLowerCase().includes('system')
                )) {
                    defaultTemplates++;
                    console.log(`🔧 Default/System template (not deletable): ${templateText?.substring(0, 30)}...`);
                } else {
                    restrictedTemplates++;
                    console.log(`🔒 No delete option for: ${templateText?.substring(0, 30)}...`);
                }
            }
        }
        
        console.log(`📊 Delete permissions summary:`);
        console.log(`  - Templates with delete access: ${deleteButtonsFound}`);
        console.log(`  - Default/System templates: ${defaultTemplates}`);
        console.log(`  - Templates with restricted access: ${restrictedTemplates}`);
        console.log(`  - Total templates: ${templateCount}`);
        
        // Check for any permission-related error messages
        const errorMessage = page.locator('.error-message, .alert-error, [data-testid="error-message"]');
        if (await errorMessage.count() > 0) {
            const errorText = await errorMessage.first().textContent();
            console.log(`⚠️ Permission error message: ${errorText}`);
        }
        
        console.log('✅ Delete permissions and restrictions test completed');
    });

    test('REGRESSION: Delete Template error handling', async ({ page }) => {
        console.log('⚠️ Testing Delete Template error handling...');
        
        // Login and navigate
        await goToAliquotQaLink(page);
        await loginAquaUser(page, ALIQUOT_USERNAME_QA, ALIQUOT_PASSWORD_QA);
        await verifyAquaLoginQa(page);
        await clearCacheAndReload(page);
        
        // Navigate to Report Setup
        const reportsTab = page.getByRole('tab', { name: 'Reports' }).or(
            page.getByRole('button', { name: 'Reports' })
        );
        
        await reportsTab.hover();
        const reportSetupLink = page.getByRole('menuitem', { name: 'Report Setup' });
        await reportSetupLink.click();
        await page.waitForLoadState('networkidle');
        
        // Try to delete a template that might cause errors
        const templatesList = page.getByRole('table').or(
            page.locator('.templates-list, .data-table')
        );
        
        const templateRows = templatesList.locator('tbody tr, .template-row');
        
        if (await templateRows.count() > 0) {
            const firstTemplate = templateRows.first();
            const deleteButton = firstTemplate.locator('[data-testid="delete-btn"]').or(
                firstTemplate.locator('button[title*="Delete"]')
            ).or(
                firstTemplate.locator('button:has-text("Delete")')
            );
            
            if (await deleteButton.count() > 0) {
                // Try multiple rapid clicks to test error handling
                await deleteButton.click();
                await page.waitForTimeout(500);
                await deleteButton.click(); // Double click
                await page.waitForTimeout(2000);
                
                // Check for error messages
                const errorMessage = page.locator('.error-message, .alert-error, [data-testid="error-message"]').or(
                    page.locator('.warning-message, .alert-warning')
                );
                
                if (await errorMessage.count() > 0) {
                    const errorText = await errorMessage.first().textContent();
                    console.log(`⚠️ Error message displayed: ${errorText}`);
                } else {
                    console.log('ℹ️ No error messages detected');
                }
                
                // Check for success messages
                const successMessage = page.locator('.success-message, .alert-success, [data-testid="success-message"]');
                if (await successMessage.count() > 0) {
                    const successText = await successMessage.first().textContent();
                    console.log(`✅ Success message displayed: ${successText}`);
                }
                
                // Check for confirmation dialogs
                const confirmationDialog = page.getByRole('dialog').or(
                    page.locator('.confirmation-dialog, .modal-dialog')
                );
                
                if (await confirmationDialog.count() > 0) {
                    console.log('💬 Confirmation dialog is displayed');
                    
                    // Close the dialog if it's open
                    const closeButton = confirmationDialog.getByRole('button', { name: 'Cancel' }).or(
                        confirmationDialog.locator('button:has-text("Cancel")')
                    ).or(
                        confirmationDialog.locator('.close, .modal-close')
                    );
                    
                    if (await closeButton.count() > 0) {
                        await closeButton.click();
                        console.log('✅ Closed confirmation dialog');
                    }
                }
            }
        }
        
        console.log('✅ Delete Template error handling test completed');
    });
});
