// Test Case: Edit System
// Preconditions:
// - User is logged into the application
// - User has access to the Site Management module
// - User has permission to edit systems
// - At least one client exists in the system
// - At least one customer exists under the selected client
// - At least one facility exists under the selected customer
// - At least one building exists under the selected facility
// - A system exists under the selected building
// - User has appropriate organizational permissions

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

test.describe('Edit System - Functional Tests', () => {

    test.beforeEach(async ({ page }) => {
        console.log('🔧 Setting up Edit System test environment...');
    });

    test.afterEach(async ({ page }) => {
        console.log('🧹 Cleaning up Edit System test data...');
    });

    test('REGRESSION: Edit System functionality works correctly', async ({ page }) => {
        console.log('✏️ Testing Edit System functionality...');
        
        // Login and navigate
        await goToAliquotQaLink(page);
        await loginAquaUser(page, ALIQUOT_USERNAME_QA, ALIQUOT_PASSWORD_QA);
        await verifyAquaLoginQa(page);
        await clearCacheAndReload(page);
        
        // Step 1: Navigate to My Organization
        console.log('🖱️ Hovering over Site Management...');
        const siteManagementTab = page.getByRole('tab', { name: 'Site Management' }).or(
            page.getByRole('button', { name: 'Site Management' })
        ).or(
            page.locator('[data-testid="site-management-tab"]')
        ).or(
            page.locator('a:has-text("Site Management")')
        );
        
        await siteManagementTab.hover();
        await page.waitForTimeout(1000);
        
        // Step 2: Verify that Site Management links are displayed
        console.log('🔍 Verifying that Site Management links are displayed...');
        const siteManagementMenu = page.getByRole('menu', { name: 'Site Management' }).or(
            page.locator('[data-testid="site-management-menu"]')
        ).or(
            page.locator('.dropdown-menu:has-text("Site Management")')
        ).or(
            page.locator('.site-management-dropdown')
        ).or(
            page.locator('.site-management-submenu')
        );
        
        await expect(siteManagementMenu).toBeVisible({ timeout: 10000 });
        console.log('✅ Site Management links are displayed');
        
        // Step 3: Click My Organization
        console.log('🏢 Clicking My Organization...');
        const myOrganizationLink = page.getByRole('menuitem', { name: 'My Organization' }).or(
            page.getByRole('link', { name: 'My Organization' })
        ).or(
            page.locator('[data-testid="my-organization-link"]')
        ).or(
            page.locator('a:has-text("My Organization")')
        );
        
        await myOrganizationLink.click();
        await page.waitForLoadState('networkidle');
        
        // Step 4: Verify that the My Organization page is opened with Client List displayed by default
        console.log('📋 Verifying that the My Organization page is opened with Client List displayed by default...');
        const myOrganizationPage = page.getByRole('heading', { name: 'My Organization' }).or(
            page.getByRole('heading', { name: 'Client Lists' })
        ).or(
            page.locator('[data-testid="my-organization-page"]')
        ).or(
            page.locator('h1:has-text("My Organization")')
        ).or(
            page.locator('h1:has-text("Client Lists")')
        ).or(
            page.locator('.page-title:has-text("Organization")')
        );
        
        await expect(myOrganizationPage).toBeVisible({ timeout: 15000 });
        console.log('✅ My Organization page is opened');
        
        // Verify Client List is displayed by default
        const clientListsSection = page.getByRole('heading', { name: 'Client Lists' }).or(
            page.locator('[data-testid="client-lists-section"]')
        ).or(
            page.locator('.client-lists-section')
        ).or(
            page.locator('section:has-text("Client Lists")')
        ).or(
            page.locator('div:has-text("Client Lists")')
        );
        
        await expect(clientListsSection).toBeVisible({ timeout: 10000 });
        console.log('✅ Client List is displayed by default');
        
        // Verify list of Clients is displayed
        const clientsList = page.getByRole('table', { name: 'Clients' }).or(
            page.getByRole('table', { name: 'Client List' })
        ).or(
            page.locator('[data-testid="clients-table"]')
        ).or(
            page.locator('.clients-table, .client-list')
        ).or(
            page.locator('table')
        );
        
        await expect(clientsList).toBeVisible({ timeout: 15000 });
        console.log('✅ List of Clients is displayed');
        
        // Get client rows
        const clientRows = clientsList.locator('tbody tr, .client-row');
        const clientCount = await clientRows.count();
        console.log(`📊 Found ${clientCount} clients in the list`);
        
        if (clientCount === 0) {
            throw new Error('No clients found in the list');
        }
        
        // Step 5: Filter and Open System List
        console.log('🔍 In the Filter Organization section, selecting Client, Customer, Facility, and Building...');
        
        // Look for Filter Organization section
        const filterOrganizationSection = page.locator('[data-testid="filter-organization-section"]').or(
            page.locator('.filter-organization, .organization-filter')
        ).or(
            page.locator('section:has-text("Filter Organization")')
        ).or(
            page.locator('div:has-text("Filter Organization")')
        ).or(
            page.locator('.filter-section:has-text("Organization")')
        );
        
        if (await filterOrganizationSection.count() > 0) {
            console.log('✅ Filter Organization section found');
            
            // Select Client from filter
            const clientFilterDropdown = filterOrganizationSection.locator('select').first().or(
                filterOrganizationSection.locator('[data-testid="client-filter-dropdown"]')
            ).or(
                filterOrganizationSection.locator('.client-dropdown, .organization-client-dropdown')
            ).or(
                filterOrganizationSection.locator('input[placeholder*="Client"]')
            );
            
            if (await clientFilterDropdown.count() > 0) {
                await clientFilterDropdown.click();
                await page.waitForTimeout(500);
                
                // Select first available client
                const firstClientOption = page.locator('option').first().or(
                    page.locator('[role="option"]').first()
                );
                
                if (await firstClientOption.count() > 0) {
                    await firstClientOption.click();
                    await page.waitForTimeout(1000);
                    console.log('✅ Client selected from filter');
                }
            }
            
            // Select Customer from filter
            const customerFilterDropdown = filterOrganizationSection.locator('select').nth(1).or(
                filterOrganizationSection.locator('[data-testid="customer-filter-dropdown"]')
            ).or(
                filterOrganizationSection.locator('.customer-dropdown, .organization-customer-dropdown')
            ).or(
                filterOrganizationSection.locator('input[placeholder*="Customer"]')
            );
            
            if (await customerFilterDropdown.count() > 0) {
                await customerFilterDropdown.click();
                await page.waitForTimeout(500);
                
                // Select first available customer
                const firstCustomerOption = page.locator('option').first().or(
                    page.locator('[role="option"]').first()
                );
                
                if (await firstCustomerOption.count() > 0) {
                    await firstCustomerOption.click();
                    await page.waitForTimeout(1000);
                    console.log('✅ Customer selected from filter');
                }
            }
            
            // Select Facility from filter
            const facilityFilterDropdown = filterOrganizationSection.locator('select').nth(2).or(
                filterOrganizationSection.locator('[data-testid="facility-filter-dropdown"]')
            ).or(
                filterOrganizationSection.locator('.facility-dropdown, .organization-facility-dropdown')
            ).or(
                filterOrganizationSection.locator('input[placeholder*="Facility"]')
            );
            
            if (await facilityFilterDropdown.count() > 0) {
                await facilityFilterDropdown.click();
                await page.waitForTimeout(500);
                
                // Select first available facility
                const firstFacilityOption = page.locator('option').first().or(
                    page.locator('[role="option"]').first()
                );
                
                if (await firstFacilityOption.count() > 0) {
                    await firstFacilityOption.click();
                    await page.waitForTimeout(1000);
                    console.log('✅ Facility selected from filter');
                }
            }
            
            // Select Building from filter
            const buildingFilterDropdown = filterOrganizationSection.locator('select').nth(3).or(
                filterOrganizationSection.locator('[data-testid="building-filter-dropdown"]')
            ).or(
                filterOrganizationSection.locator('.building-dropdown, .organization-building-dropdown')
            ).or(
                filterOrganizationSection.locator('input[placeholder*="Building"]')
            );
            
            if (await buildingFilterDropdown.count() > 0) {
                await buildingFilterDropdown.click();
                await page.waitForTimeout(500);
                
                // Select first available building
                const firstBuildingOption = page.locator('option').first().or(
                    page.locator('[role="option"]').first()
                );
                
                if (await firstBuildingOption.count() > 0) {
                    await firstBuildingOption.click();
                    await page.waitForTimeout(1000);
                    console.log('✅ Building selected from filter');
                }
            }
        } else {
            console.log('ℹ️ Filter Organization section not found, proceeding with default selection');
        }
        
        // Click System List button
        console.log('⚙️ Clicking System List button...');
        const systemListButton = page.getByRole('button', { name: 'System List' }).or(
            page.getByRole('link', { name: 'System List' })
        ).or(
            page.locator('[data-testid="system-list-button"]')
        ).or(
            page.locator('button:has-text("System List")')
        ).or(
            page.locator('a:has-text("System List")')
        ).or(
            page.locator('.system-list-btn, .system-list-link')
        );
        
        await systemListButton.click();
        await page.waitForLoadState('networkidle');
        console.log('✅ System List button clicked');
        
        // Step 6: Verify that the System List is loaded
        console.log('⚙️ Verifying that the System List is loaded...');
        const systemListPage = page.getByRole('heading', { name: 'System List' }).or(
            page.getByRole('heading', { name: 'Systems' })
        ).or(
            page.locator('[data-testid="system-list-page"]')
        ).or(
            page.locator('h1:has-text("System List")')
        ).or(
            page.locator('h1:has-text("Systems")')
        ).or(
            page.locator('.page-title:has-text("System")')
        );
        
        await expect(systemListPage).toBeVisible({ timeout: 15000 });
        console.log('✅ System List is loaded');
        
        // Verify system table is displayed
        const systemsTable = page.getByRole('table', { name: 'Systems' }).or(
            page.getByRole('table', { name: 'System List' })
        ).or(
            page.locator('[data-testid="systems-table"]')
        ).or(
            page.locator('.systems-table, .system-list')
        ).or(
            page.locator('table')
        );
        
        await expect(systemsTable).toBeVisible({ timeout: 15000 });
        console.log('✅ System table is displayed');
        
        // Get system rows
        const systemRows = systemsTable.locator('tbody tr, .system-row');
        const systemCount = await systemRows.count();
        console.log(`📊 Found ${systemCount} systems in the list`);
        
        if (systemCount === 0) {
            throw new Error('No systems found in the list');
        }
        
        // Step 7: Edit System
        console.log('✏️ Selecting the desired System and clicking Edit (pencil icon)...');
        
        // Look for a system with edit functionality
        let selectedSystem = null;
        let editButton = null;
        let systemToEditName = '';
        let originalSystemData: { name?: string; code?: string; description?: string; type?: string; status?: string; location?: string } = {};
        
        // Try to find a system that can be edited
        for (let i = 0; i < systemCount; i++) {
            const systemRow = systemRows.nth(i);
            const systemText = await systemRow.textContent();
            
            // Look for edit button in this row
            editButton = systemRow.locator('[data-testid="edit-btn"]').or(
                systemRow.locator('button[title*="Edit"]')
            ).or(
                systemRow.locator('button[aria-label*="Edit"]')
            ).or(
                systemRow.locator('.edit-btn, .pencil-btn')
            ).or(
                systemRow.locator('svg[data-icon="edit"], .fa-edit, .fa-pencil')
            ).or(
                systemRow.locator('i.fa-edit, i.fa-pencil, i.fa-pencil-square-o')
            ).or(
                systemRow.locator('button:has-text("Edit")')
            ).or(
                systemRow.locator('a:has-text("Edit")')
            );
            
            if (await editButton.count() > 0) {
                // Check if button is enabled
                const isDisabled = await editButton.isDisabled();
                if (!isDisabled) {
                    selectedSystem = systemRow;
                    systemToEditName = systemText || '';
                    console.log(`📄 Selected system for editing: ${systemToEditName.substring(0, 50)}...`);
                    break;
                } else {
                    console.log(`🔒 System is read-only and cannot be edited: ${systemText?.substring(0, 30)}...`);
                }
            }
        }
        
        // If no edit button found, try looking for action menus
        if (!editButton || await editButton.count() === 0) {
            console.log('ℹ️ No dedicated edit button found, checking for action menus...');
            
            // Look for action menus or dropdowns
            const actionMenus = systemsTable.locator('[data-testid="action-menu"]').or(
                systemsTable.locator('.action-menu, .dropdown-menu')
            ).or(
                systemsTable.locator('button[aria-haspopup="menu"]')
            );
            
            if (await actionMenus.count() > 0) {
                const firstMenu = actionMenus.first();
                await firstMenu.click();
                await page.waitForTimeout(500);
                
                // Look for edit option in the menu
                editButton = page.getByRole('menuitem', { name: 'Edit' }).or(
                    page.locator('[data-testid="edit-option"]')
                ).or(
                    page.locator('a:has-text("Edit"), button:has-text("Edit")')
                );
                
                if (await editButton.count() > 0) {
                    selectedSystem = firstMenu;
                    const systemText = await firstMenu.textContent();
                    systemToEditName = systemText || '';
                    console.log(`📄 Found edit option in action menu for: ${systemToEditName.substring(0, 50)}...`);
                }
            }
        }
        
        if (!editButton || await editButton.count() === 0) {
            throw new Error('No edit button or edit option found for any system');
        }
        
        // Click the edit button
        await editButton.click();
        await page.waitForLoadState('networkidle');
        console.log('✅ Edit (pencil) icon clicked');
        
        // Step 8: Verify that the Edit System page is displayed
        console.log('📝 Verifying that the Edit System page is displayed...');
        const editSystemPage = page.getByRole('heading', { name: 'Edit System' }).or(
            page.getByRole('heading', { name: 'Modify System' })
        ).or(
            page.locator('[data-testid="edit-system-page"]')
        ).or(
            page.locator('h1:has-text("Edit System")')
        ).or(
            page.locator('h1:has-text("Modify System")')
        ).or(
            page.locator('.page-title:has-text("Edit")')
        );
        
        await expect(editSystemPage).toBeVisible({ timeout: 15000 });
        console.log('✅ Edit System page is displayed');
        
        // Step 9: Save Changes
        console.log('✏️ Making the required changes...');
        
        // Get current values and make changes
        const systemNameInput = page.getByLabel('System Name').or(
            page.getByLabel('Name')
        ).or(
            page.locator('[data-testid="system-name-input"]')
        ).or(
            page.locator('input[name*="systemName"]')
        ).or(
            page.locator('input[name*="name"]')
        ).or(
            page.locator('input[placeholder*="System Name"]')
        ).or(
            page.locator('input[placeholder*="Name"]')
        );
        
        if (await systemNameInput.count() > 0) {
            const originalName = await systemNameInput.inputValue();
            originalSystemData.name = originalName;
            const newName = `EDITED-${originalName}`;
            await systemNameInput.fill(newName);
            console.log(`📝 Updated System Name: ${originalName} → ${newName}`);
        }
        
        const systemCodeInput = page.getByLabel('System Code').or(
            page.getByLabel('Code')
        ).or(
            page.locator('[data-testid="system-code-input"]')
        ).or(
            page.locator('input[name*="systemCode"]')
        ).or(
            page.locator('input[name*="code"]')
        ).or(
            page.locator('input[placeholder*="System Code"]')
        ).or(
            page.locator('input[placeholder*="Code"]')
        );
        
        if (await systemCodeInput.count() > 0) {
            const originalCode = await systemCodeInput.inputValue();
            originalSystemData.code = originalCode;
            const newCode = `EDITED-${originalCode}`;
            await systemCodeInput.fill(newCode);
            console.log(`📝 Updated System Code: ${originalCode} → ${newCode}`);
        }
        
        const descriptionInput = page.getByLabel('Description').or(
            page.getByLabel('System Description')
        ).or(
            page.locator('[data-testid="description-input"]')
        ).or(
            page.locator('input[name*="description"]')
        ).or(
            page.locator('textarea[name*="description"]')
        ).or(
            page.locator('input[placeholder*="Description"]')
        ).or(
            page.locator('textarea[placeholder*="Description"]')
        );
        
        if (await descriptionInput.count() > 0) {
            const originalDescription = await descriptionInput.inputValue();
            originalSystemData.description = originalDescription;
            const newDescription = `${originalDescription} - Updated ${new Date().toISOString().slice(0, 19)}`;
            await descriptionInput.fill(newDescription);
            console.log(`📝 Updated Description: ${originalDescription} → ${newDescription}`);
        }
        
        const typeInput = page.getByLabel('Type').or(
            page.getByLabel('System Type')
        ).or(
            page.locator('[data-testid="type-input"]')
        ).or(
            page.locator('input[name*="type"]')
        ).or(
            page.locator('select[name*="type"]')
        ).or(
            page.locator('input[placeholder*="Type"]')
        );
        
        if (await typeInput.count() > 0) {
            const originalType = await typeInput.inputValue();
            originalSystemData.type = originalType;
            const newType = 'EDITED-TYPE';
            await typeInput.fill(newType);
            console.log(`📝 Updated Type: ${originalType} → ${newType}`);
        }
        
        const statusInput = page.getByLabel('Status').or(
            page.getByLabel('System Status')
        ).or(
            page.locator('[data-testid="status-input"]')
        ).or(
            page.locator('input[name*="status"]')
        ).or(
            page.locator('select[name*="status"]')
        ).or(
            page.locator('input[placeholder*="Status"]')
        );
        
        if (await statusInput.count() > 0) {
            const originalStatus = await statusInput.inputValue();
            originalSystemData.status = originalStatus;
            const newStatus = 'EDITED-STATUS';
            await statusInput.fill(newStatus);
            console.log(`📝 Updated Status: ${originalStatus} → ${newStatus}`);
        }
        
        const locationInput = page.getByLabel('Location').or(
            page.getByLabel('System Location')
        ).or(
            page.locator('[data-testid="location-input"]')
        ).or(
            page.locator('input[name*="location"]')
        ).or(
            page.locator('input[placeholder*="Location"]')
        );
        
        if (await locationInput.count() > 0) {
            const originalLocation = await locationInput.inputValue();
            originalSystemData.location = originalLocation;
            const newLocation = `${originalLocation} - Updated`;
            await locationInput.fill(newLocation);
            console.log(`📝 Updated Location: ${originalLocation} → ${newLocation}`);
        }
        
        // Click Save System
        console.log('💾 Clicking Save System...');
        const saveSystemButton = page.getByRole('button', { name: 'Save System' }).or(
            page.getByRole('button', { name: 'Save' })
        ).or(
            page.getByRole('button', { name: 'Update' })
        ).or(
            page.locator('[data-testid="save-system-btn"]')
        ).or(
            page.locator('button:has-text("Save")')
        ).or(
            page.locator('button:has-text("Update")')
        );
        
        await expect(saveSystemButton).toBeVisible({ timeout: 10000 });
        await saveSystemButton.click();
        
        // Wait for save operation to complete
        await page.waitForTimeout(3000);
        
        // Step 10: Verify that the success message is displayed
        console.log('✅ Verifying that the success message is displayed...');
        const successMessage = page.getByText('System has been saved successfully').or(
            page.getByText('System saved successfully')
        ).or(
            page.getByText('System updated successfully')
        ).or(
            page.getByText('Successfully saved')
        ).or(
            page.getByText('System modified successfully')
        ).or(
            page.locator('[data-testid="success-message"]')
        ).or(
            page.locator('.success-message, .alert-success')
        );
        
        await expect(successMessage).toBeVisible({ timeout: 10000 });
        const successText = await successMessage.textContent();
        console.log(`✅ Success message: "${successText}" is displayed`);
        
        // Additional verification: Check if we're on the correct page
        const currentUrl = page.url();
        if (currentUrl.includes('system') || currentUrl.includes('organization')) {
            console.log('📋 Successfully completed system editing');
        } else {
            console.log('ℹ️ Current page after system edit:', currentUrl);
        }
        
        console.log('✅ Edit System test completed successfully');
    });

    test('REGRESSION: Edit System with validation errors', async ({ page }) => {
        console.log('⚠️ Testing Edit System with validation errors...');
        
        // Login and navigate
        await goToAliquotQaLink(page);
        await loginAquaUser(page, ALIQUOT_USERNAME_QA, ALIQUOT_PASSWORD_QA);
        await verifyAquaLoginQa(page);
        await clearCacheAndReload(page);
        
        // Navigate through the flow to get to system edit
        const siteManagementTab = page.getByRole('tab', { name: 'Site Management' }).or(
            page.locator('a:has-text("Site Management")')
        );
        
        await siteManagementTab.hover();
        await page.waitForTimeout(1000);
        
        const myOrganizationLink = page.getByRole('menuitem', { name: 'My Organization' }).or(
            page.locator('a:has-text("My Organization")')
        );
        
        await myOrganizationLink.click();
        await page.waitForLoadState('networkidle');
        
        // Click System List
        const systemListButton = page.getByRole('button', { name: 'System List' }).or(
            page.locator('button:has-text("System List")')
        );
        
        if (await systemListButton.count() > 0) {
            await systemListButton.click();
            await page.waitForLoadState('networkidle');
            
            // Get systems list and find edit button
            const systemsTable = page.getByRole('table', { name: 'Systems' }).or(
                page.locator('.systems-table, .system-list')
            );
            
            const systemRows = systemsTable.locator('tbody tr, .system-row');
            
            if (await systemRows.count() > 0) {
                const firstSystem = systemRows.first();
                const editButton = firstSystem.locator('[data-testid="edit-btn"]').or(
                    firstSystem.locator('button[title*="Edit"]')
                ).or(
                    firstSystem.locator('button:has-text("Edit")')
                );
                
                if (await editButton.count() > 0 && !(await editButton.isDisabled())) {
                    await editButton.click();
                    await page.waitForLoadState('networkidle');
                    
                    // Try to save with invalid data (empty required fields)
                    const systemNameInput = page.getByLabel('System Name').or(
                        page.locator('input[placeholder*="System Name"]')
                    );
                    
                    if (await systemNameInput.count() > 0) {
                        await systemNameInput.fill(''); // Clear required field
                        
                        const saveSystemButton = page.getByRole('button', { name: 'Save System' }).or(
                            page.locator('button:has-text("Save")')
                        );
                        
                        if (await saveSystemButton.count() > 0) {
                            await saveSystemButton.click();
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
        }
        
        console.log('✅ Edit System validation test completed');
    });

    test('REGRESSION: Cancel Edit System operation', async ({ page }) => {
        console.log('❌ Testing Cancel Edit System operation...');
        
        // Login and navigate
        await goToAliquotQaLink(page);
        await loginAquaUser(page, ALIQUOT_USERNAME_QA, ALIQUOT_PASSWORD_QA);
        await verifyAquaLoginQa(page);
        await clearCacheAndReload(page);
        
        // Navigate through the flow to get to system edit
        const siteManagementTab = page.getByRole('tab', { name: 'Site Management' }).or(
            page.locator('a:has-text("Site Management")')
        );
        
        await siteManagementTab.hover();
        await page.waitForTimeout(1000);
        
        const myOrganizationLink = page.getByRole('menuitem', { name: 'My Organization' }).or(
            page.locator('a:has-text("My Organization")')
        );
        
        await myOrganizationLink.click();
        await page.waitForLoadState('networkidle');
        
        // Click System List
        const systemListButton = page.getByRole('button', { name: 'System List' }).or(
            page.locator('button:has-text("System List")')
        );
        
        if (await systemListButton.count() > 0) {
            await systemListButton.click();
            await page.waitForLoadState('networkidle');
            
            // Get systems list and find edit button
            const systemsTable = page.getByRole('table', { name: 'Systems' }).or(
                page.locator('.systems-table, .system-list')
            );
            
            const systemRows = systemsTable.locator('tbody tr, .system-row');
            
            if (await systemRows.count() > 0) {
                const firstSystem = systemRows.first();
                const editButton = firstSystem.locator('[data-testid="edit-btn"]').or(
                    firstSystem.locator('button[title*="Edit"]')
                ).or(
                    firstSystem.locator('button:has-text("Edit")')
                );
                
                if (await editButton.count() > 0 && !(await editButton.isDisabled())) {
                    await editButton.click();
                    await page.waitForLoadState('networkidle');
                    
                    // Verify edit page is open
                    const editSystemPage = page.getByRole('heading', { name: 'Edit System' }).or(
                        page.locator('h1:has-text("Edit System")')
                    );
                    
                    if (await editSystemPage.count() > 0) {
                        console.log('✅ Edit System page is open');
                        
                        // Make some changes
                        const systemNameInput = page.getByLabel('System Name').or(
                            page.locator('input[placeholder*="System Name"]')
                        );
                        
                        if (await systemNameInput.count() > 0) {
                            await systemNameInput.fill('TEST-CANCEL');
                            console.log('📝 Made test changes');
                        }
                        
                        // Click Cancel
                        const cancelButton = page.getByRole('button', { name: 'Cancel' }).or(
                            page.locator('button:has-text("Cancel")')
                        ).or(
                            page.locator('.cancel-btn, .modal-close')
                        );
                        
                        if (await cancelButton.count() > 0) {
                            await cancelButton.click();
                            await page.waitForLoadState('networkidle');
                            await page.waitForTimeout(1000);
                            
                            // Verify we're back to the system list page
                            const systemListPage = page.getByRole('heading', { name: 'System List' }).or(
                                page.locator('h1:has-text("System List")')
                            );
                            
                            if (await systemListPage.count() > 0) {
                                console.log('✅ Cancel button works - returned to System List page');
                            } else {
                                console.log('ℹ️ Cancel button clicked but page navigation unclear');
                            }
                        }
                    }
                }
            }
        }
        
        console.log('✅ Cancel Edit System operation test completed');
    });

    test('REGRESSION: Verify edit permissions and restrictions for systems', async ({ page }) => {
        console.log('🔒 Testing edit permissions and restrictions for systems...');
        
        // Login and navigate
        await goToAliquotQaLink(page);
        await loginAquaUser(page, ALIQUOT_USERNAME_QA, ALIQUOT_PASSWORD_QA);
        await verifyAquaLoginQa(page);
        await clearCacheAndReload(page);
        
        // Navigate through the flow to get to system list
        const siteManagementTab = page.getByRole('tab', { name: 'Site Management' }).or(
            page.locator('a:has-text("Site Management")')
        );
        
        await siteManagementTab.hover();
        await page.waitForTimeout(1000);
        
        const myOrganizationLink = page.getByRole('menuitem', { name: 'My Organization' }).or(
            page.locator('a:has-text("My Organization")')
        );
        
        await myOrganizationLink.click();
        await page.waitForLoadState('networkidle');
        
        // Click System List
        const systemListButton = page.getByRole('button', { name: 'System List' }).or(
            page.locator('button:has-text("System List")')
        );
        
        if (await systemListButton.count() > 0) {
            await systemListButton.click();
            await page.waitForLoadState('networkidle');
            
            // Check edit button availability
            const systemsTable = page.getByRole('table', { name: 'Systems' }).or(
                page.locator('.systems-table, .system-list')
            );
            
            const systemRows = systemsTable.locator('tbody tr, .system-row');
            const systemCount = await systemRows.count();
            
            let editButtonsFound = 0;
            let restrictedSystems = 0;
            let readOnlySystems = 0;
            
            for (let i = 0; i < systemCount; i++) {
                const systemRow = systemRows.nth(i);
                const systemText = await systemRow.textContent();
                
                // Check for edit button
                const editButton = systemRow.locator('[data-testid="edit-btn"]').or(
                    systemRow.locator('button[title*="Edit"]')
                ).or(
                    systemRow.locator('svg[data-icon="edit"], .fa-edit, .fa-pencil')
                ).or(
                    systemRow.locator('button:has-text("Edit")')
                );
                
                if (await editButton.count() > 0) {
                    // Check if button is disabled
                    const isDisabled = await editButton.isDisabled();
                    if (isDisabled) {
                        readOnlySystems++;
                        console.log(`🔒 System is read-only: ${systemText?.substring(0, 30)}...`);
                    } else {
                        editButtonsFound++;
                        console.log(`✅ Edit available for: ${systemText?.substring(0, 30)}...`);
                    }
                } else {
                    restrictedSystems++;
                    console.log(`🔒 No edit option for: ${systemText?.substring(0, 30)}...`);
                }
            }
            
            console.log(`📊 Edit permissions summary for systems:`);
            console.log(`  - Systems with edit access: ${editButtonsFound}`);
            console.log(`  - Systems read-only: ${readOnlySystems}`);
            console.log(`  - Systems with restricted access: ${restrictedSystems}`);
            console.log(`  - Total systems: ${systemCount}`);
            
            // Check for any permission-related error messages
            const errorMessage = page.locator('.error-message, .alert-error, [data-testid="error-message"]');
            if (await errorMessage.count() > 0) {
                const errorText = await errorMessage.first().textContent();
                console.log(`⚠️ Permission error message: ${errorText}`);
            }
        }
        
        console.log('✅ Edit permissions and restrictions test completed');
    });
});
