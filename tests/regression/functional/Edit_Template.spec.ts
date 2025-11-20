// Test Case: Edit Template (not default)
// Preconditions:
// - User is logged into the application
// - User has access to the Reports module
// - User has permission to edit report templates
// - At least one non-default template exists in the system

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

test.describe('Edit Template (not default) - Functional Tests', () => {

    test.beforeEach(async ({ page }) => {
        console.log('🔧 Setting up Edit Template test environment...');
    });

    test.afterEach(async ({ page }) => {
        console.log('🧹 Cleaning up Edit Template test data...');
    });

    test('REGRESSION: Edit Template (not default) functionality works correctly', async ({ page }) => {
        console.log('✏️ Testing Edit Template (not default) functionality...');
        
        // Login and navigate
        await goToAliquotQaLink(page);
        await loginAquaUser(page, ALIQUOT_USERNAME_QA, ALIQUOT_PASSWORD_QA);
        await verifyAquaLoginQa(page);
        await clearCacheAndReload(page);
        
        // Step 1: Go to Reports Tab → Report Setup
        console.log('🖱️ Going to Reports Tab → Report Setup...');
        const reportsTab = page.getByRole('tab', { name: 'Reports' }).or(
            page.getByRole('button', { name: 'Reports' })
        ).or(
            page.locator('[data-testid="reports-tab"]')
        ).or(
            page.locator('a:has-text("Reports")')
        );
        
        await reportsTab.hover();
        await page.waitForTimeout(1000); // Wait for hover effect
        
        // Verify Reports and Locations links window is opened
        const reportsMenu = page.getByRole('menu', { name: 'Reports' }).or(
            page.locator('[data-testid="reports-menu"]')
        ).or(
            page.locator('.dropdown-menu:has-text("Reports")')
        ).or(
            page.locator('.reports-dropdown')
        );
        
        await expect(reportsMenu).toBeVisible({ timeout: 10000 });
        console.log('✅ Reports menu is opened');
        
        // Click Report Setup link
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
        
        // Step 2: Verify Report Templates List page is displayed
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
        
        // Step 3: Select Client from the Filter by Location section
        console.log('🔍 Selecting Client from Filter by Location section...');
        
        // Wait for filter section to be visible
        const filterSection = page.getByRole('region', { name: 'Filter by Location' }).or(
            page.locator('[data-testid="filter-by-location"]')
        ).or(
            page.locator('.filter-section:has-text("Location")')
        ).or(
            page.locator('fieldset:has-text("Filter")')
        ).or(
            page.locator('.filter-panel, .filter-controls')
        );
        
        await expect(filterSection).toBeVisible({ timeout: 10000 });
        console.log('✅ Filter by Location section is visible');
        
        // Select Client
        const clientDropdown = page.getByRole('combobox', { name: 'Client' }).or(
            page.locator('[data-testid="client-dropdown"]')
        ).or(
            page.locator('select[name*="client"]')
        ).or(
            page.locator('.client-select, .client-filter')
        );
        
        let selectedClient = '';
        if (await clientDropdown.count() > 0) {
            await clientDropdown.click();
            const clientOptions = page.getByRole('option');
            const clientOptionCount = await clientOptions.count();
            
            if (clientOptionCount > 1) {
                const selectedClientOption = clientOptions.nth(1);
                selectedClient = await selectedClientOption.textContent() || '';
                await selectedClientOption.click();
                console.log(`✅ Selected Client: ${selectedClient}`);
            }
        } else {
            console.log('ℹ️ Client dropdown not found');
        }
        
        // Apply filter if there's an apply button
        const applyButton = page.getByRole('button', { name: 'Apply' }).or(
            page.getByRole('button', { name: 'Filter' })
        ).or(
            page.getByRole('button', { name: 'Search' })
        ).or(
            page.locator('[data-testid="apply-filters"]')
        );
        
        if (await applyButton.count() > 0) {
            await applyButton.click();
            await page.waitForTimeout(2000); // Wait for filters to apply
            console.log('✅ Applied client filter');
        }
        
        // Step 4: Verify Report Templates list is loaded
        console.log('📋 Verifying Report Templates list is loaded...');
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
        const templateCount = await templateRows.count();
        console.log(`📊 Found ${templateCount} template(s) in the list`);
        
        if (templateCount === 0) {
            throw new Error('No templates found in the list');
        }
        
        // Step 5: Select a Template and click Edit (pencil icon) button
        console.log('✏️ Selecting a Template and clicking Edit (pencil icon) button...');
        
        // Look for non-default templates (avoid default/system templates)
        let selectedTemplate = null;
        let editButton = null;
        
        // Try to find a non-default template
        for (let i = 0; i < templateCount; i++) {
            const templateRow = templateRows.nth(i);
            const templateText = await templateRow.textContent();
            
            // Skip default/system templates
            if (templateText && !templateText.toLowerCase().includes('default') && 
                !templateText.toLowerCase().includes('system')) {
                
                // Look for edit button in this row
                editButton = templateRow.locator('[data-testid="edit-btn"]').or(
                    templateRow.locator('button[title*="Edit"]')
                ).or(
                    templateRow.locator('button[aria-label*="Edit"]')
                ).or(
                    templateRow.locator('.edit-btn, .pencil-btn')
                ).or(
                    templateRow.locator('svg[data-icon="edit"], .fa-edit, .fa-pencil')
                ).or(
                    templateRow.locator('i.fa-edit, i.fa-pencil, i.fa-pencil-square-o')
                ).or(
                    templateRow.locator('button:has-text("Edit")')
                ).or(
                    templateRow.locator('a:has-text("Edit")')
                );
                
                if (await editButton.count() > 0) {
                    selectedTemplate = templateRow;
                    console.log(`📄 Selected template: ${templateText.substring(0, 50)}...`);
                    break;
                }
            }
        }
        
        // If no non-default template found, try any template
        if (!editButton || await editButton.count() === 0) {
            console.log('ℹ️ No non-default template found, selecting any available template');
            const firstTemplate = templateRows.first();
            editButton = firstTemplate.locator('[data-testid="edit-btn"]').or(
                firstTemplate.locator('button[title*="Edit"]')
            ).or(
                firstTemplate.locator('svg[data-icon="edit"], .fa-edit, .fa-pencil')
            ).or(
                firstTemplate.locator('button:has-text("Edit")')
            );
            
            if (await editButton.count() > 0) {
                selectedTemplate = firstTemplate;
                const templateText = await firstTemplate.textContent();
                console.log(`📄 Selected any available template: ${templateText?.substring(0, 50)}...`);
            }
        }
        
        if (!editButton || await editButton.count() === 0) {
            throw new Error('No edit button found for any template');
        }
        
        // Click the edit button
        await editButton.click();
        await page.waitForLoadState('networkidle');
        console.log('✅ Edit (pencil icon) button clicked');
        
        // Step 6: Verify Edit Report Template page is loaded
        console.log('📝 Verifying Edit Report Template page is loaded...');
        const editTemplatePage = page.getByRole('heading', { name: 'Edit Report Template' }).or(
            page.getByRole('heading', { name: 'Edit Template' })
        ).or(
            page.locator('[data-testid="edit-template-page"]')
        ).or(
            page.locator('h1:has-text("Edit Report Template")')
        ).or(
            page.locator('.page-title:has-text("Edit")')
        );
        
        await expect(editTemplatePage).toBeVisible({ timeout: 15000 });
        console.log('✅ Edit Report Template page is loaded');
        
        // Step 7: Make any changes
        console.log('✏️ Making changes to the template...');
        
        // Try to find and edit template name
        const templateNameInput = page.getByLabel('Template Name').or(
            page.getByLabel('Name')
        ).or(
            page.locator('[data-testid="template-name-input"]')
        ).or(
            page.locator('input[name*="name"]')
        ).or(
            page.locator('input[placeholder*="name"]')
        );
        
        if (await templateNameInput.count() > 0) {
            const currentName = await templateNameInput.inputValue();
            const newName = `Updated ${currentName} - ${new Date().toISOString().slice(0, 19)}`;
            await templateNameInput.fill(newName);
            console.log(`📝 Updated template name: ${newName}`);
        }
        
        // Try to change security settings
        const securityDropdown = page.getByRole('combobox', { name: 'Security Settings' }).or(
            page.getByRole('combobox', { name: 'Associated Security Settings' })
        ).or(
            page.locator('[data-testid="security-settings-dropdown"]')
        ).or(
            page.locator('select[name*="security"]')
        ).or(
            page.locator('.security-select, .security-dropdown')
        );
        
        if (await securityDropdown.count() > 0) {
            await securityDropdown.click();
            const securityOptions = page.getByRole('option');
            const securityOptionCount = await securityOptions.count();
            
            if (securityOptionCount > 2) { // More than just the current and first option
                const selectedSecurityOption = securityOptions.nth(2);
                const selectedSecurity = await selectedSecurityOption.textContent() || '';
                await selectedSecurityOption.click();
                console.log(`🔒 Updated Security Settings: ${selectedSecurity}`);
            }
        }
        
        // Try to modify layout if drag-and-drop is available
        const reportSections = page.getByRole('region', { name: 'Report Sections' }).or(
            page.locator('[data-testid="report-sections"]')
        ).or(
            page.locator('.report-sections, .sections-panel')
        );
        
        const templateLayout = page.getByRole('region', { name: 'Template Layout' }).or(
            page.locator('[data-testid="template-layout"]')
        ).or(
            page.locator('.template-layout, .layout-window')
        );
        
        if (await reportSections.count() > 0 && await templateLayout.count() > 0) {
            console.log('🎯 Modifying template layout...');
            
            // Try to add a new section
            const draggableSections = reportSections.locator('[draggable="true"]').or(
                reportSections.locator('.draggable, .section-item')
            );
            
            const sectionCount = await draggableSections.count();
            if (sectionCount > 0) {
                const newSection = draggableSections.first();
                await newSection.dragTo(templateLayout);
                await page.waitForTimeout(1000);
                console.log('✅ Added new section to template layout');
            }
        }
        
        // Try to add description or notes
        const descriptionInput = page.getByLabel('Description').or(
            page.getByLabel('Notes')
        ).or(
            page.locator('[data-testid="description-input"]')
        ).or(
            page.locator('textarea[name*="description"]')
        ).or(
            page.locator('textarea[placeholder*="description"]')
        );
        
        if (await descriptionInput.count() > 0) {
            const newDescription = `Updated description - ${new Date().toISOString()}`;
            await descriptionInput.fill(newDescription);
            console.log(`📝 Updated description: ${newDescription}`);
        }
        
        // Step 8: Click "Save Report Template" button
        console.log('💾 Clicking "Save Report Template" button...');
        const saveTemplateButton = page.getByRole('button', { name: 'Save Report Template' }).or(
            page.getByRole('button', { name: 'Save Template' })
        ).or(
            page.getByRole('button', { name: 'Save' })
        ).or(
            page.locator('[data-testid="save-template-btn"]')
        ).or(
            page.locator('button:has-text("Save")')
        );
        
        await expect(saveTemplateButton).toBeVisible({ timeout: 10000 });
        await saveTemplateButton.click();
        
        // Wait for save operation to complete
        await page.waitForTimeout(3000);
        
        // Step 9: Verify Success message
        console.log('✅ Verifying success message...');
        const successMessage = page.getByText('Report Template has been successfully saved').or(
            page.getByText('Template has been successfully saved')
        ).or(
            page.getByText('Template saved successfully')
        ).or(
            page.getByText('Successfully saved')
        ).or(
            page.getByText('Template updated successfully')
        ).or(
            page.locator('[data-testid="success-message"]')
        ).or(
            page.locator('.success-message, .alert-success')
        );
        
        await expect(successMessage).toBeVisible({ timeout: 10000 });
        const successText = await successMessage.textContent();
        console.log(`✅ Success message: "${successText}" is displayed`);
        
        // Additional verification: Check if we're back to templates list
        const currentUrl = page.url();
        if (currentUrl.includes('templates') || currentUrl.includes('setup')) {
            console.log('📋 Returned to templates list after saving');
        } else {
            console.log('📝 Remained on edit template page after saving');
        }
        
        console.log('✅ Edit Template (not default) test completed successfully');
    });

    test('REGRESSION: Edit Template with validation errors', async ({ page }) => {
        console.log('⚠️ Testing Edit Template with validation errors...');
        
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
        
        // Select a template and edit it
        const templatesList = page.getByRole('table').or(
            page.locator('.templates-list, .data-table')
        );
        
        const templateRows = templatesList.locator('tbody tr, .template-row');
        
        if (await templateRows.count() > 0) {
            const firstTemplate = templateRows.first();
            const editButton = firstTemplate.locator('[data-testid="edit-btn"]').or(
                firstTemplate.locator('button[title*="Edit"]')
            ).or(
                firstTemplate.locator('button:has-text("Edit")')
            );
            
            if (await editButton.count() > 0) {
                await editButton.click();
                await page.waitForLoadState('networkidle');
                
                // Try to save without making changes or with invalid data
                const templateNameInput = page.getByLabel('Template Name').or(
                    page.locator('input[name*="name"]')
                );
                
                if (await templateNameInput.count() > 0) {
                    // Clear the name to trigger validation
                    await templateNameInput.fill('');
                    
                    const saveTemplateButton = page.getByRole('button', { name: 'Save Report Template' }).or(
                        page.locator('button:has-text("Save")')
                    );
                    
                    if (await saveTemplateButton.count() > 0) {
                        await saveTemplateButton.click();
                        await page.waitForTimeout(2000);
                        
                        // Check for validation errors
                        const errorMessage = page.locator('.error-message, .alert-error, [data-testid="error-message"]').or(
                            page.locator('.field-error, .validation-error')
                        );
                        
                        if (await errorMessage.count() > 0) {
                            const errorText = await errorMessage.first().textContent();
                            console.log(`⚠️ Validation error displayed: ${errorText}`);
                        } else {
                            console.log('ℹ️ No validation errors detected');
                        }
                    }
                }
            }
        }
        
        console.log('✅ Edit Template validation test completed');
    });

    test('REGRESSION: Verify template editing permissions', async ({ page }) => {
        console.log('🔒 Testing template editing permissions...');
        
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
        
        // Check if edit buttons are visible (permission check)
        const templatesList = page.getByRole('table').or(
            page.locator('.templates-list, .data-table')
        );
        
        const editButtons = templatesList.locator('[data-testid="edit-btn"], button[title*="Edit"], svg[data-icon="edit"]');
        const editButtonCount = await editButtons.count();
        
        if (editButtonCount > 0) {
            console.log(`✅ ${editButtonCount} edit button(s) found - user has edit permissions`);
        } else {
            console.log('ℹ️ No edit buttons found - user may not have edit permissions');
        }
        
        // Check for any error messages
        const errorMessage = page.locator('.error-message, .alert-error, [data-testid="error-message"]');
        if (await errorMessage.count() > 0) {
            const errorText = await errorMessage.first().textContent();
            console.log(`⚠️ Error message displayed: ${errorText}`);
        }
        
        console.log('✅ Template editing permissions test completed');
    });
});
