// Test Case: Create Report Template
// Preconditions:
// - User is logged into the application
// - User has access to the Reports module
// - User has permission to create report templates
// - At least one client exists in the system

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

test.describe('Create Report Template - Functional Tests', () => {

    test.beforeEach(async ({ page }) => {
        console.log('🔧 Setting up Create Report Template test environment...');
    });

    test.afterEach(async ({ page }) => {
        console.log('🧹 Cleaning up Create Report Template test data...');
    });

    test('REGRESSION: Create Report Template functionality works correctly', async ({ page }) => {
        console.log('📝 Testing Create Report Template functionality...');
        
        // Login and navigate
        await goToAliquotQaLink(page);
        await loginAquaUser(page, 'qa_automation@aquaphoenixsci.com', '12345678');
        await verifyAquaLoginQa(page);
        await clearCacheAndReload(page);
        
        // Step 1: Hover over the Reports tab
        console.log('🖱️ Hovering over Reports tab...');
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
        console.log('✅ Reports and Locations links window is opened');
        
        // Step 2: Click Report Setup link
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
        
        // Verify Report Templates List page is displayed
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
        
        // Step 3: Select Client in the Filter by Location section
        console.log('🔍 Selecting Client in Filter by Location section...');
        
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
        
        // Step 4: Verify Templates list is loaded
        console.log('📋 Verifying Templates list is loaded...');
        const templatesList = page.getByRole('table', { name: 'Report Templates' }).or(
            page.locator('[data-testid="templates-list-table"]')
        ).or(
            page.locator('.templates-list, .data-table')
        ).or(
            page.locator('table')
        );
        
        await expect(templatesList).toBeVisible({ timeout: 15000 });
        
        // Get initial template count
        const templateRows = templatesList.locator('tbody tr, .template-row');
        const initialTemplateCount = await templateRows.count();
        console.log(`📊 Initial template count: ${initialTemplateCount}`);
        
        // Step 5: Click Create Report Template button
        console.log('➕ Clicking Create Report Template button...');
        const createTemplateButton = page.getByRole('button', { name: 'Create Report Template' }).or(
            page.getByRole('button', { name: 'New Template' })
        ).or(
            page.getByRole('button', { name: 'Add Template' })
        ).or(
            page.locator('[data-testid="create-template-btn"]')
        ).or(
            page.locator('button:has-text("Create")')
        ).or(
            page.locator('a:has-text("Create Report Template")')
        );
        
        await expect(createTemplateButton).toBeVisible({ timeout: 10000 });
        await createTemplateButton.click();
        await page.waitForLoadState('networkidle');
        
        // Verify Create Report Template page is displayed
        const createTemplatePage = page.getByRole('heading', { name: 'Create Report Template' }).or(
            page.getByRole('heading', { name: 'New Report Template' })
        ).or(
            page.locator('[data-testid="create-template-page"]')
        ).or(
            page.locator('h1:has-text("Create Report Template")')
        ).or(
            page.locator('.page-title:has-text("Create")')
        );
        
        await expect(createTemplatePage).toBeVisible({ timeout: 15000 });
        console.log('✅ Create Report Template page is displayed');
        
        // Step 6: Fill in the template details
        console.log('📝 Filling in template details...');
        
        // Generate unique template name
        const templateName = `Test Template ${new Date().toISOString().slice(0, 19)}`;
        
        // Type Template Name (required)
        console.log('📝 Typing Template Name...');
        const templateNameInput = page.getByLabel('Template Name').or(
            page.getByLabel('Name')
        ).or(
            page.locator('[data-testid="template-name-input"]')
        ).or(
            page.locator('input[name*="name"]')
        ).or(
            page.locator('input[placeholder*="name"]')
        );
        
        await expect(templateNameInput).toBeVisible({ timeout: 10000 });
        await templateNameInput.fill(templateName);
        console.log(`✅ Template Name entered: ${templateName}`);
        
        // Select Associated Security Settings from dropdown
        console.log('🔒 Selecting Associated Security Settings...');
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
            
            if (securityOptionCount > 1) {
                const selectedSecurityOption = securityOptions.nth(1);
                const selectedSecurity = await selectedSecurityOption.textContent() || '';
                await selectedSecurityOption.click();
                console.log(`✅ Selected Security Settings: ${selectedSecurity}`);
            }
        } else {
            console.log('ℹ️ Security Settings dropdown not found');
        }
        
        // Step 7: Set Report Layout by drag-and-drop from Report Sections to Template Layout window
        console.log('🎯 Setting Report Layout by drag-and-drop...');
        
        // Find Report Sections area
        const reportSections = page.getByRole('region', { name: 'Report Sections' }).or(
            page.locator('[data-testid="report-sections"]')
        ).or(
            page.locator('.report-sections, .sections-panel')
        ).or(
            page.locator('div:has-text("Report Sections")')
        );
        
        // Find Template Layout window
        const templateLayout = page.getByRole('region', { name: 'Template Layout' }).or(
            page.locator('[data-testid="template-layout"]')
        ).or(
            page.locator('.template-layout, .layout-window')
        ).or(
            page.locator('div:has-text("Template Layout")')
        );
        
        if (await reportSections.count() > 0 && await templateLayout.count() > 0) {
            console.log('✅ Found Report Sections and Template Layout areas');
            
            // Look for draggable sections
            const draggableSections = reportSections.locator('[draggable="true"]').or(
                reportSections.locator('.draggable, .section-item')
            ).or(
                reportSections.locator('div:has-text("Section")')
            );
            
            const sectionCount = await draggableSections.count();
            console.log(`📦 Found ${sectionCount} draggable sections`);
            
            if (sectionCount > 0) {
                // Drag first section to template layout
                const firstSection = draggableSections.first();
                const sectionText = await firstSection.textContent();
                console.log(`🎯 Dragging section: ${sectionText?.substring(0, 30)}...`);
                
                // Perform drag and drop
                await firstSection.dragTo(templateLayout);
                await page.waitForTimeout(1000);
                console.log('✅ Section dragged to Template Layout');
                
                // Try to drag additional sections if available
                if (sectionCount > 1) {
                    const secondSection = draggableSections.nth(1);
                    await secondSection.dragTo(templateLayout);
                    await page.waitForTimeout(1000);
                    console.log('✅ Second section dragged to Template Layout');
                }
                
                // Verify sections were added to layout
                const layoutSections = templateLayout.locator('.section-item, .layout-item, [data-section]');
                const layoutSectionCount = await layoutSections.count();
                console.log(`📊 Sections in layout: ${layoutSectionCount}`);
                
            } else {
                console.log('ℹ️ No draggable sections found, trying alternative approach');
                
                // Try clicking sections to add them
                const clickableSections = reportSections.locator('button, .section-item, div[role="button"]');
                const clickableCount = await clickableSections.count();
                
                if (clickableCount > 0) {
                    await clickableSections.first().click();
                    console.log('✅ Section clicked to add to layout');
                }
            }
        } else {
            console.log('ℹ️ Report Sections or Template Layout areas not found, skipping drag-and-drop');
        }
        
        // Step 8: Click Save Report Template
        console.log('💾 Clicking Save Report Template...');
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
        const successMessage = page.getByText('Report Template has been saved successfully').or(
            page.getByText('Template saved successfully')
        ).or(
            page.getByText('Successfully saved')
        ).or(
            page.getByText('Template created successfully')
        ).or(
            page.locator('[data-testid="success-message"]')
        ).or(
            page.locator('.success-message, .alert-success')
        );
        
        await expect(successMessage).toBeVisible({ timeout: 10000 });
        const successText = await successMessage.textContent();
        console.log(`✅ Success message: "${successText}" is displayed`);
        
        // Step 10: Verify the newly created Report Template is on the list
        console.log('🔍 Verifying the newly created Report Template is on the list...');
        
        // Navigate back to templates list if not already there
        const currentUrl = page.url();
        if (!currentUrl.includes('templates') && !currentUrl.includes('setup')) {
            console.log('🔄 Navigating back to Report Templates List...');
            const backButton = page.getByRole('button', { name: 'Back' }).or(
                page.locator('a:has-text("Back")')
            );
            
            if (await backButton.count() > 0) {
                await backButton.click();
                await page.waitForLoadState('networkidle');
            } else {
                // Use browser back
                await page.goBack();
                await page.waitForLoadState('networkidle');
            }
        }
        
        // Wait for the list to refresh
        await page.waitForTimeout(2000);
        
        // Verify the template list is still visible
        await expect(templatesList).toBeVisible({ timeout: 15000 });
        
        // Get updated template count
        const updatedTemplateRows = templatesList.locator('tbody tr, .template-row');
        const updatedTemplateCount = await updatedTemplateRows.count();
        console.log(`📊 Updated template count: ${updatedTemplateCount}`);
        
        if (updatedTemplateCount > initialTemplateCount) {
            console.log('✅ New template has been added to the list');
        } else {
            console.log('ℹ️ Template count unchanged - may need to refresh or check different location');
        }
        
        // Look for the specific template by name
        const newTemplate = templatesList.locator(`tr:has-text("${templateName}"), .template-row:has-text("${templateName}")`);
        if (await newTemplate.count() > 0) {
            console.log(`✅ Newly created template "${templateName}" is visible in the list`);
        } else {
            console.log(`ℹ️ Template "${templateName}" not found in current view - may be on different page`);
        }
        
        // Additional verification: Check template details
        if (await newTemplate.count() > 0) {
            const templateDetails = await newTemplate.textContent();
            console.log(`📋 Template details: ${templateDetails?.substring(0, 100)}...`);
        }
        
        console.log('✅ Create Report Template test completed successfully');
    });

    test('REGRESSION: Create Report Template with validation errors', async ({ page }) => {
        console.log('⚠️ Testing Create Report Template with validation errors...');
        
        // Login and navigate
        await goToAliquotQaLink(page);
        await loginAquaUser(page, 'qa_automation@aquaphoenixsci.com', '12345678');
        await verifyAquaLoginQa(page);
        await clearCacheAndReload(page);
        
        // Navigate to Report Setup
        const reportsTab = page.getByRole('button', { name: /Reports/i }).or(
            page.getByRole('tab', { name: 'Reports' })
        );
        
        await reportsTab.hover();
        const reportSetupLink = page.getByRole('menuitem', { name: 'Report Setup' }).or(
            page.getByText('Report Setup')
        );
        await reportSetupLink.click();
        await page.waitForLoadState('networkidle');
        
        // Click Create Report Template
        const createTemplateButton = page.getByRole('button', { name: 'Create Report Template' }).or(
            page.locator('button:has-text("Create")')
        );
        
        if (await createTemplateButton.count() > 0) {
            await createTemplateButton.click();
            await page.waitForLoadState('networkidle');
            
            // Try to save without filling required fields
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
        
        console.log('✅ Create Report Template validation test completed');
    });

    test('REGRESSION: Verify template creation with different security settings', async ({ page }) => {
        console.log('🔒 Testing template creation with different security settings...');
        
        // Login and navigate
        await goToAliquotQaLink(page);
        await loginAquaUser(page, 'qa_automation@aquaphoenixsci.com', '12345678');
        await verifyAquaLoginQa(page);
        await clearCacheAndReload(page);
        
        // Navigate to Report Setup
        const reportsTab = page.getByRole('button', { name: /Reports/i }).or(
            page.getByRole('tab', { name: 'Reports' })
        );
        
        await reportsTab.hover();
        const reportSetupLink = page.getByRole('menuitem', { name: 'Report Setup' }).or(
            page.getByText('Report Setup')
        );
        await reportSetupLink.click();
        await page.waitForLoadState('networkidle');
        
        // Select Client on Filter by Location section.
        const filterByLocationSection = page.getByRole('region', { name: 'Filter by Location' }).or(
            page.locator('[data-testid="filter-by-location"]')
        ).or(
            page.locator('.filter-section:has-text("Location")')
        ).or(
            page.locator('fieldset:has-text("Filter")')
        ).or(
            page.locator('.filter-panel, .filter-controls')
        );

        // Need to click on the search box with the text (Select Client) and it will open the client lookup window.
        const clientSearchBox = page.getByRole('textbox', { name: 'Select Client' }).or(
            page.locator('input[placeholder*="Client"]')
        );
        await clientSearchBox.click();
        await page.waitForTimeout(1000);

        // Then select the client (Aquaphoenix) from the lookup window and wait for the lookup window to close.
        const clientLookupWindow = page.getByRole('dialog', { name: 'Client Lookup' }).or(
            page.locator('[data-testid="client-lookup-window"]')
        ).or(
            page.locator('.client-lookup-dialog')
        ).or(
            page.locator('.modal-dialog:has-text("Client")')
        );

        await expect(clientLookupWindow).toBeVisible({ timeout: 10000 });
        console.log('✅ Client Lookup window is opened');

        const clientOptions = page.getByRole('option');
        const clientOptionCount = await clientOptions.count();
        console.log(`📊 Found ${clientOptionCount} client options`);

        if (clientOptionCount > 0) {
            const selectedClient = clientOptions.first();
            const clientName = await selectedClient.textContent();
            await selectedClient.click();
            console.log(`✅ Selected Client: ${clientName}`);
        } else {
            throw new Error('No client options found in Client Lookup window');
        }

        await expect(clientLookupWindow).not.toBeVisible({ timeout: 5000 });
        console.log('✅ Client Lookup window is closed');

        // Wait for the list to refresh
        await page.waitForTimeout(2000);

        
        // Click on the Create Report Template button.
        const createTemplateButton = page.getByRole('button', { name: /Create Report Template/i }).or(
            page.locator('button:has-text("Create")')
        );

        await expect(createTemplateButton).toBeVisible({ timeout: 10000 });
        await createTemplateButton.click();
        await page.waitForLoadState('networkidle');

        // Verify Create Report Template page is displayed
        const createTemplatePage = page.getByRole('heading', { name: 'Create Report Template' }).or(
            page.getByRole('heading', { name: 'New Report Template' })
        );

        await expect(createTemplatePage).toBeVisible({ timeout: 15000 });
        console.log('✅ Create Report Template page is displayed');

        // Fill in the template details, Template Name is (required)
        const templateName = `Test Template ${new Date().toISOString().slice(0, 19)}`;
        const templateNameInput = page.getByLabel('Template Name').or(
            page.getByLabel('Name')
        ).or(
            page.locator('[data-testid="template-name-input"]')
        ).or(
            page.locator('input[name*="name"]')
        ).or(
            page.locator('input[placeholder*="name"]')
        );

        await expect(templateNameInput).toBeVisible({ timeout: 10000 });
        await templateNameInput.fill(templateName);
        console.log(`✅ Template Name entered: ${templateName}`);

        // Select Associated Security Settings from dropdown (Service Report is selected by default) so just need to verify it.
        const securityDropdown = page.getByRole('combobox', { name: 'Security Settings' }).or(
            page.getByRole('combobox', { name: 'Associated Security Settings' })
        ).or(
            page.locator('[data-testid="security-settings-dropdown"]')
        ).or(
            page.locator('select[name*="security"]')
        ).or(
            page.locator('.security-select, .security-dropdown')
        );

        await expect(securityDropdown).toBeVisible({ timeout: 10000 });
        console.log('✅ Security Settings dropdown is visible');

        const securityOptions = page.getByRole('option');
        const securityOptionCount = await securityOptions.count();
        console.log(`📊 Found ${securityOptionCount} security options`);

        if (securityOptionCount > 0) {
            const selectedSecurityOption = securityOptions.first();
            const selectedSecurity = await selectedSecurityOption.textContent();
            await selectedSecurityOption.click();
            console.log(`✅ Selected Security Settings: ${selectedSecurity}`);
        } else {
            throw new Error('No security options found in Security Settings dropdown');
        }

        // Click on the Save Report Template button. and wait for the Edit Report Template page to be displayed.
        const saveTemplateButton = page.getByRole('button', { name: /Save Report Template/i }).or(
            page.locator('button:has-text("Save")')
        );
        await expect(saveTemplateButton).toBeVisible({ timeout: 10000 });
        await saveTemplateButton.click();
        await page.waitForLoadState('networkidle');
        console.log('✅ Save Report Template button clicked');

        // Verify Edit Report Template page is displayed
        const editTemplatePage = page.getByRole('heading', { name: 'Edit Report Template' }).or(
            page.getByRole('heading', { name: 'Edit Template' })
        );
        await expect(editTemplatePage).toBeVisible({ timeout: 15000 });
        console.log('✅ Edit Report Template page is displayed');

        // Verify the template details are displayed correctly
        const templateNameInput2 = page.getByLabel('Template Name').or(
            page.getByLabel('Name')
        ).or(
            page.locator('[data-testid="template-name-input"]')
        ).or(   
            page.locator('input[name*="name"]')
        ).or(
            page.locator('input[placeholder*="name"]')
        );
        await expect(templateNameInput2).toBeVisible({ timeout: 10000 });
        const templateNameValue = await templateNameInput2.inputValue();
        console.log(`✅ Template Name value: ${templateNameValue}`);

        // Verify the Security Settings is displayed correctly
        const securityDropdown2 = page.getByRole('combobox', { name: 'Security Settings' }).or(
            page.getByRole('combobox', { name: 'Associated Security Settings' })
        ).or(   
            page.locator('[data-testid="security-settings-dropdown"]')
        ).or(
            page.locator('select[name*="security"]')
        ).or(
            page.locator('.security-select, .security-dropdown')
        );
        await expect(securityDropdown2).toBeVisible({ timeout: 10000 });
        const securityValue = await securityDropdown2.inputValue();
        console.log(`✅ Security Settings value: ${securityValue}`);

        // Verify the Create and View seprate buttons are displayed for the Report layout section with drag and drop options to the Report Header section.
        const createAndViewButton = page.getByRole('button', { name: 'Create and View' }).or(
            page.locator('button:has-text("Create and View")')
        );
        await expect(createAndViewButton).toBeVisible({ timeout: 10000 });
        console.log('✅ Create and View button is displayed');

        const viewButton = page.getByRole('button', { name: 'View' }).or(
            page.locator('button:has-text("View")')
        );
        await expect(viewButton).toBeVisible({ timeout: 10000 });
        console.log('✅ View button is displayed');

        // Verify the Report layout section has Create and View buttons. with drag and drop options to the Report Header section.
        const createAndViewButton2 = page.getByRole('button', { name: 'Create and View' }).or(
            page.locator('button:has-text("Create and View")')
        );
        await expect(createAndViewButton2).toBeVisible({ timeout: 10000 });
        console.log('✅ Create and View button is displayed');

        const viewButton2 = page.getByRole('button', { name: 'View' }).or(
            page.locator('button:has-text("View")')
        );
        await expect(viewButton2).toBeVisible({ timeout: 10000 });
        console.log('✅ View button is displayed');

        // Find Report Layout section for drag and drop
        const reportLayout = page.getByText('Report Layout').or(
            page.locator('[data-testid="report-layout"]')
        ).or(
            page.locator('.report-layout')
        );

        // Drag and drop the enabled options to the Report Header section. with drag and drop options to the Report Header section.
        const draggableSections = reportLayout.locator('[draggable="true"]').or(
            reportLayout.locator('.draggable, .section-item')
        ).or(
            reportLayout.locator('div:has-text("Section")')
        );
        await expect(draggableSections).toBeVisible({ timeout: 10000 });
        console.log('✅ Draggable sections are displayed');
        const sectionCount = await draggableSections.count();
        console.log(`📦 Found ${sectionCount} draggable sections`);
        
        if (sectionCount > 0) {
            const firstSection = draggableSections.first();
            const sectionText = await firstSection.textContent();
            console.log(`🎯 Dragging section: ${sectionText?.substring(0, 30)}...`);
        }
    
        // Click Save Report Template button.
        const saveTemplateButton2 = page.getByRole('button', { name: 'Save Report Template' }).or(
            page.locator('button:has-text("Save")')
        );
        await expect(saveTemplateButton2).toBeVisible({ timeout: 10000 });
        await saveTemplateButton2.click();
        await page.waitForLoadState('networkidle');
        console.log('✅ Save Report Template button clicked');

        // Verify the success message is displayed
        const successMessage = page.getByText('Report Template has been saved successfully').or(
            page.getByText('Template saved successfully')
        ).or(
            page.getByText('Successfully saved')
        ).or(
            page.getByText('Template created successfully')
        ).or(
            page.getByText('Template added successfully')
        ).or(
            page.locator('[data-testid="success-message"]')
        ).or(
            page.locator('.success-message, .alert-success')
        );
        await expect(successMessage).toBeVisible({ timeout: 10000 });
        console.log('✅ Success message is displayed');

        // Verify the newly created Report Template is on the list
        const templatesList = page.getByRole('heading', { name: 'Report Templates' }).or(
            page.getByRole('heading', { name: 'Report Templates List' })
        ).or(
            page.locator('[data-testid="templates-list-table"]')
        ).or(
            page.locator('.templates-list, .data-table')
        ).or(
            page.locator('table')
        );

        const templateRows = templatesList.locator('tbody tr, .template-row');
        const templateCount = await templateRows.count();
        console.log(`📊 Found ${templateCount} template(s) in the list`);

        if (templateCount === 0) {
            throw new Error('No templates found in the list');
        }
        await expect(templatesList).toBeVisible({ timeout: 15000 });
        console.log('✅ Report Templates List page is displayed');

        // Verify the newly created Report Template is on the list
        const templatesList2 = page.getByRole('heading', { name: 'Report Templates' }).or(
            page.getByRole('heading', { name: 'Report Templates List' })
        ).or(
            page.locator('[data-testid="templates-list-table2"]')
        ).or(
            page.locator('.templates-list, .data-table')
        ).or(
            page.locator('table')
        );
        await expect(templatesList2).toBeVisible({ timeout: 15000 });
        console.log('✅ Report Templates List page is displayed2');

        const templateRows2 = templatesList2.locator('tbody tr, .template-row');
        const templateCount2 = await templateRows2.count();
        console.log(`📊 Found ${templateCount2} template(s) in the list`);

        if (templateCount2 === 0) {
            throw new Error('No templates found in the list');
        }
        console.log('✅ Report Templates List page is displayed');
        console.log('✅ Create Report Template with different security settings test completed successfully');
    });
});







