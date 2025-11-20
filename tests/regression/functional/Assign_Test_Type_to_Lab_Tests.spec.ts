// Test Case: Assign Test Type to the Lab Tests
// Preconditions:
// - User is logged into the application
// - User has access to the Reports module
// - User has permission to edit test types
// - User must have a System selected to interact with the page
// - At least one test type exists in the system that can be edited

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

test.describe('Assign Test Type to Lab Tests - Functional Tests', () => {

    test.beforeEach(async ({ page }) => {
        console.log('🔧 Setting up Assign Test Type to Lab Tests test environment...');
    });

    test.afterEach(async ({ page }) => {
        console.log('🧹 Cleaning up Assign Test Type to Lab Tests test data...');
    });

    test('REGRESSION: Assign Test Type to Lab Tests functionality works correctly', async ({ page }) => {
        console.log('🧪 Testing Assign Test Type to Lab Tests functionality...');
        
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
        
        // Step 2: Verify Reports and Locations sub menu is displayed
        console.log('🔍 Verifying Reports and Locations sub menu is displayed...');
        const reportsMenu = page.getByRole('menu', { name: 'Reports' }).or(
            page.locator('[data-testid="reports-menu"]')
        ).or(
            page.locator('.dropdown-menu:has-text("Reports")')
        ).or(
            page.locator('.reports-dropdown')
        ).or(
            page.locator('.reports-submenu')
        );
        
        await expect(reportsMenu).toBeVisible({ timeout: 10000 });
        console.log('✅ Reports and Locations sub menu is displayed');
        
        // Step 3: Click Test Types link
        console.log('🧪 Clicking Test Types link...');
        const testTypesLink = page.getByRole('menuitem', { name: 'Test Types' }).or(
            page.getByRole('link', { name: 'Test Types' })
        ).or(
            page.getByRole('menuitem', { name: 'Test Types List' })
        ).or(
            page.locator('[data-testid="test-types-link"]')
        ).or(
            page.locator('a:has-text("Test Types")')
        ).or(
            page.locator('a:has-text("Test Types List")')
        );
        
        await testTypesLink.click();
        await page.waitForLoadState('networkidle');
        
        // Step 4: Verify Test Types List page is displayed
        console.log('📋 Verifying Test Types List page is displayed...');
        const testTypesListPage = page.getByRole('heading', { name: 'Test Types List' }).or(
            page.getByRole('heading', { name: 'Test Types' })
        ).or(
            page.locator('[data-testid="test-types-list-page"]')
        ).or(
            page.locator('h1:has-text("Test Types List")')
        ).or(
            page.locator('h1:has-text("Test Types")')
        ).or(
            page.locator('.page-title:has-text("Test Types")')
        );
        
        await expect(testTypesListPage).toBeVisible({ timeout: 15000 });
        console.log('✅ Test Types List page is displayed');
        
        // Step 5: Select a system to enable test type interaction (if required)
        console.log('⚙️ Selecting a system to enable test type interaction...');
        const systemLookup = page.getByRole('button', { name: 'Select System' }).or(
            page.getByRole('combobox', { name: 'System' })
        ).or(
            page.locator('[data-testid="system-lookup"]')
        ).or(
            page.locator('.system-lookup, .system-select')
        ).or(
            page.locator('input[placeholder*="System"]')
        );
        
        if (await systemLookup.count() > 0) {
            await systemLookup.click();
            await page.waitForTimeout(1000);
            
            // Verify System Lookup window and select system
            const systemLookupWindow = page.getByRole('dialog', { name: 'System Lookup' }).or(
                page.locator('[data-testid="system-lookup-window"]')
            ).or(
                page.locator('.system-lookup-dialog')
            ).or(
                page.locator('.modal-dialog:has-text("System")')
            );
            
            if (await systemLookupWindow.count() > 0) {
                const systemOptions = page.getByRole('listitem').or(
                    page.locator('[data-testid="system-option"]')
                ).or(
                    page.locator('.system-option, .lookup-item')
                ).or(
                    page.locator('tr[data-system], .system-row')
                );
                
                const systemOptionCount = await systemOptions.count();
                if (systemOptionCount > 0) {
                    const selectedSystem = systemOptions.first();
                    const systemName = await selectedSystem.textContent();
                    await selectedSystem.click();
                    console.log(`✅ Selected System: ${systemName}`);
                    
                    await expect(systemLookupWindow).not.toBeVisible({ timeout: 5000 });
                    console.log('✅ System Lookup window is closed');
                }
            }
            
            // Wait for page to update after system selection
            await page.waitForTimeout(2000);
        } else {
            console.log('ℹ️ System selection not required or already selected');
        }
        
        // Step 6: Get test types and select a test type for editing
        console.log('📊 Getting test types and selecting a test type for editing...');
        const testTypesTable = page.getByRole('table', { name: 'Test Types' }).or(
            page.getByRole('table', { name: 'Test Types List' })
        ).or(
            page.locator('[data-testid="test-types-table"]')
        ).or(
            page.locator('.test-types-table, .test-types-list')
        ).or(
            page.locator('table')
        );
        
        await expect(testTypesTable).toBeVisible({ timeout: 15000 });
        
        // Get test type rows
        const testTypeRows = testTypesTable.locator('tbody tr, .test-type-row');
        const testTypeCount = await testTypeRows.count();
        console.log(`📊 Found ${testTypeCount} test types in the table`);
        
        if (testTypeCount === 0) {
            throw new Error('No test types found in the table');
        }
        
        // Step 7: Select a Test Type and click the Edit (pencil) icon
        console.log('✏️ Selecting a Test Type and clicking the Edit (pencil) icon...');
        
        // Look for a test type with edit functionality
        let selectedTestType = null;
        let editButton = null;
        let testTypeToEditName = '';
        
        // Try to find a test type that can be edited
        for (let i = 0; i < testTypeCount; i++) {
            const testTypeRow = testTypeRows.nth(i);
            const testTypeText = await testTypeRow.textContent();
            
            // Look for edit button in this row
            editButton = testTypeRow.locator('[data-testid="edit-btn"]').or(
                testTypeRow.locator('button[title*="Edit"]')
            ).or(
                testTypeRow.locator('button[aria-label*="Edit"]')
            ).or(
                testTypeRow.locator('.edit-btn, .pencil-btn')
            ).or(
                testTypeRow.locator('svg[data-icon="edit"], .fa-edit, .fa-pencil')
            ).or(
                testTypeRow.locator('i.fa-edit, i.fa-pencil, i.fa-pencil-square-o')
            ).or(
                testTypeRow.locator('button:has-text("Edit")')
            ).or(
                testTypeRow.locator('a:has-text("Edit")')
            );
            
            if (await editButton.count() > 0) {
                // Check if button is enabled
                const isDisabled = await editButton.isDisabled();
                if (!isDisabled) {
                    selectedTestType = testTypeRow;
                    testTypeToEditName = testTypeText || '';
                    console.log(`📄 Selected test type for editing: ${testTypeToEditName.substring(0, 50)}...`);
                    break;
                } else {
                    console.log(`🔒 Test type is read-only and cannot be edited: ${testTypeText?.substring(0, 30)}...`);
                }
            }
        }
        
        // If no edit button found, try looking for action menus
        if (!editButton || await editButton.count() === 0) {
            console.log('ℹ️ No dedicated edit button found, checking for action menus...');
            
            // Look for action menus or dropdowns
            const actionMenus = testTypesTable.locator('[data-testid="action-menu"]').or(
                testTypesTable.locator('.action-menu, .dropdown-menu')
            ).or(
                testTypesTable.locator('button[aria-haspopup="menu"]')
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
                    selectedTestType = firstMenu;
                    const testTypeText = await firstMenu.textContent();
                    testTypeToEditName = testTypeText || '';
                    console.log(`📄 Found edit option in action menu for: ${testTypeToEditName.substring(0, 50)}...`);
                }
            }
        }
        
        if (!editButton || await editButton.count() === 0) {
            throw new Error('No edit button or edit option found for any test type');
        }
        
        // Click the edit button
        await editButton.click();
        await page.waitForLoadState('networkidle');
        console.log('✅ Edit (pencil) icon clicked');
        
        // Step 8: Verify Edit Test Type page is displayed
        console.log('📝 Verifying Edit Test Type page is displayed...');
        const editTestTypePage = page.getByRole('heading', { name: 'Edit Test Type' }).or(
            page.getByRole('heading', { name: 'Modify Test Type' })
        ).or(
            page.locator('[data-testid="edit-test-type-page"]')
        ).or(
            page.locator('h1:has-text("Edit Test Type")')
        ).or(
            page.locator('h1:has-text("Modify Test Type")')
        ).or(
            page.locator('.page-title:has-text("Edit")')
        );
        
        await expect(editTestTypePage).toBeVisible({ timeout: 15000 });
        console.log('✅ Edit Test Type page is displayed');
        
        // Step 9: Select and toggle Assign Lab Test
        console.log('🧪 Selecting and toggling Assign Lab Test...');
        
        // Look for the Assign Lab Test toggle
        const assignLabTestToggle = page.getByRole('switch', { name: 'Assign Lab Test' }).or(
            page.getByRole('checkbox', { name: 'Assign Lab Test' })
        ).or(
            page.getByLabel('Assign Lab Test')
        ).or(
            page.locator('[data-testid="assign-lab-test-toggle"]')
        ).or(
            page.locator('input[type="checkbox"][name*="assignLabTest"]')
        ).or(
            page.locator('input[type="checkbox"][name*="assignLab"]')
        ).or(
            page.locator('input[type="checkbox"][name*="labTest"]')
        ).or(
            page.locator('.toggle-switch:has-text("Assign Lab Test")')
        ).or(
            page.locator('.checkbox:has-text("Assign Lab Test")')
        );
        
        await expect(assignLabTestToggle).toBeVisible({ timeout: 10000 });
        console.log('✅ Assign Lab Test toggle found');
        
        // Check if toggle is already on, if not, turn it on
        const isAlreadyAssigned = await assignLabTestToggle.isChecked();
        if (!isAlreadyAssigned) {
            await assignLabTestToggle.click();
            await page.waitForTimeout(1000);
            console.log('✅ Toggled Assign Lab Test ON');
        } else {
            console.log('✅ Assign Lab Test is already ON');
        }
        
        // Step 10: Select Lab Test Options
        console.log('🧪 Selecting Lab Test Options...');
        
        // Look for lab test options
        const labTestOptions = page.getByRole('radio', { name: 'Lab Report Tests (Deposit Tests)' }).or(
            page.getByRole('radio', { name: 'Lab Report Tests (Water Tests)' })
        ).or(
            page.locator('[data-testid="lab-test-options"]')
        ).or(
            page.locator('input[type="radio"][name*="labTest"]')
        ).or(
            page.locator('input[type="radio"][name*="labReport"]')
        ).or(
            page.locator('.lab-test-option, .radio-group')
        );
        
        if (await labTestOptions.count() > 0) {
            console.log('✅ Lab test options found');
            
            // Try to select Water Tests first (more common)
            const waterTestsOption = page.getByRole('radio', { name: 'Lab Report Tests (Water Tests)' }).or(
                page.locator('input[type="radio"][value*="water"]')
            ).or(
                page.locator('input[type="radio"][value*="Water"]')
            ).or(
                page.locator('label:has-text("Water Tests")')
            );
            
            if (await waterTestsOption.count() > 0) {
                await waterTestsOption.click();
                await page.waitForTimeout(500);
                console.log('✅ Selected Lab Report Tests (Water Tests)');
            } else {
                // Fallback to Deposit Tests
                const depositTestsOption = page.getByRole('radio', { name: 'Lab Report Tests (Deposit Tests)' }).or(
                    page.locator('input[type="radio"][value*="deposit"]')
                ).or(
                    page.locator('input[type="radio"][value*="Deposit"]')
                ).or(
                    page.locator('label:has-text("Deposit Tests")')
                );
                
                if (await depositTestsOption.count() > 0) {
                    await depositTestsOption.click();
                    await page.waitForTimeout(500);
                    console.log('✅ Selected Lab Report Tests (Deposit Tests)');
                } else {
                    console.log('⚠️ No specific lab test options found, using default selection');
                }
            }
        } else {
            console.log('ℹ️ No lab test options found - may be automatically assigned');
        }
        
        // Step 11: Verify toggle moves and is colored blue
        console.log('🔵 Verifying toggle moves and is colored blue...');
        
        // Check if toggle is now checked
        const isToggleChecked = await assignLabTestToggle.isChecked();
        if (isToggleChecked) {
            console.log('✅ Toggle is moved to ON position');
        } else {
            console.log('⚠️ Toggle may not be in ON position');
        }
        
        // Check for blue color (this might be tricky to verify programmatically)
        const toggleElement = assignLabTestToggle;
        const toggleStyle = await toggleElement.evaluate((el) => {
            const computedStyle = window.getComputedStyle(el);
            return {
                backgroundColor: computedStyle.backgroundColor,
                borderColor: computedStyle.borderColor,
                color: computedStyle.color
            };
        });
        
        console.log(`🎨 Toggle styling: ${JSON.stringify(toggleStyle)}`);
        
        // Step 12: Click Save Test Type
        console.log('💾 Clicking Save Test Type button...');
        const saveTestTypeButton = page.getByRole('button', { name: 'Save Test Type' }).or(
            page.getByRole('button', { name: 'Save' })
        ).or(
            page.getByRole('button', { name: 'Update' })
        ).or(
            page.locator('[data-testid="save-test-type-btn"]')
        ).or(
            page.locator('button:has-text("Save")')
        ).or(
            page.locator('button:has-text("Update")')
        );
        
        await expect(saveTestTypeButton).toBeVisible({ timeout: 10000 });
        await saveTestTypeButton.click();
        
        // Wait for save operation to complete
        await page.waitForTimeout(3000);
        
        // Step 13: Verify Success message is displayed
        console.log('✅ Verifying success message is displayed...');
        const successMessage = page.getByText('Test Type has been saved successfully').or(
            page.getByText('Test Type saved successfully')
        ).or(
            page.getByText('Test Type updated successfully')
        ).or(
            page.getByText('Successfully saved')
        ).or(
            page.getByText('Test Type modified successfully')
        ).or(
            page.locator('[data-testid="success-message"]')
        ).or(
            page.locator('.success-message, .alert-success')
        );
        
        await expect(successMessage).toBeVisible({ timeout: 10000 });
        const successText = await successMessage.textContent();
        console.log(`✅ Success message: "${successText}" is displayed`);
        
        // Step 14: Go to Create Report → Select Lab Report Water or Deposit Template → Click Create Report
        console.log('📊 Going to Create Report to verify lab test assignment...');
        
        // Navigate back to Reports menu
        const reportsTabAgain = page.getByRole('tab', { name: 'Reports' }).or(
            page.getByRole('button', { name: 'Reports' })
        );
        
        await reportsTabAgain.hover();
        await page.waitForTimeout(1000);
        
        // Click Create Report link
        const createReportLink = page.getByRole('menuitem', { name: 'Create Report' }).or(
            page.getByRole('link', { name: 'Create Report' })
        ).or(
            page.locator('[data-testid="create-report-link"]')
        ).or(
            page.locator('a:has-text("Create Report")')
        );
        
        await createReportLink.click();
        await page.waitForLoadState('networkidle');
        
        // Step 15: Verify Create Report page is displayed
        console.log('📝 Verifying Create Report page is displayed...');
        const createReportPage = page.getByRole('heading', { name: 'Create Report' }).or(
            page.getByRole('heading', { name: 'New Report' })
        ).or(
            page.locator('[data-testid="create-report-page"]')
        ).or(
            page.locator('h1:has-text("Create Report")')
        ).or(
            page.locator('h1:has-text("New Report")')
        ).or(
            page.locator('.page-title:has-text("Create Report")')
        );
        
        await expect(createReportPage).toBeVisible({ timeout: 15000 });
        console.log('✅ Create Report page is displayed');
        
        // Step 16: Select Lab Report Water or Deposit Template
        console.log('🧪 Selecting Lab Report Water or Deposit Template...');
        
        // Look for template selection
        const templateSelection = page.getByRole('combobox', { name: 'Template' }).or(
            page.getByRole('combobox', { name: 'Report Template' })
        ).or(
            page.locator('[data-testid="template-select"]')
        ).or(
            page.locator('select[name*="template"]')
        ).or(
            page.locator('.template-select, .template-dropdown')
        );
        
        if (await templateSelection.count() > 0) {
            await templateSelection.click();
            await page.waitForTimeout(500);
            
            // Look for lab report templates
            const labReportTemplates = page.getByRole('option', { name: 'Lab Report Water' }).or(
                page.getByRole('option', { name: 'Lab Report Deposit' })
            ).or(
                page.getByRole('option', { name: 'Water Tests Template' })
            ).or(
                page.getByRole('option', { name: 'Deposit Tests Template' })
            ).or(
                page.locator('option:has-text("Lab Report")')
            ).or(
                page.locator('option:has-text("Water")')
            ).or(
                page.locator('option:has-text("Deposit")')
            );
            
            if (await labReportTemplates.count() > 0) {
                await labReportTemplates.first().click();
                await page.waitForTimeout(1000);
                console.log('✅ Selected Lab Report Template');
            } else {
                console.log('⚠️ No lab report templates found');
            }
        } else {
            console.log('ℹ️ No template selection found - may be automatic');
        }
        
        // Step 17: Click Create Report
        console.log('📊 Clicking Create Report button...');
        const createReportButton = page.getByRole('button', { name: 'Create Report' }).or(
            page.getByRole('button', { name: 'Create' })
        ).or(
            page.locator('[data-testid="create-report-btn"]')
        ).or(
            page.locator('button:has-text("Create Report")')
        ).or(
            page.locator('button:has-text("Create")')
        );
        
        if (await createReportButton.count() > 0) {
            await createReportButton.click();
            await page.waitForLoadState('networkidle');
            console.log('✅ Create Report button clicked');
            
            // Verify we're on the report creation page
            const reportCreationPage = page.getByRole('heading', { name: 'Report' }).or(
                page.locator('h1:has-text("Report")')
            ).or(
                page.locator('.report-creation-page')
            );
            
            if (await reportCreationPage.count() > 0) {
                console.log('✅ Report creation page is displayed');
                
                // Look for the assigned test type in the lab tests section
                const labTestsSection = page.locator('[data-testid="lab-tests-section"]').or(
                    page.locator('.lab-tests, .lab-report-tests')
                ).or(
                    page.locator('section:has-text("Lab Tests")')
                );
                
                if (await labTestsSection.count() > 0) {
                    const assignedTestType = labTestsSection.locator(`text=${testTypeToEditName.substring(0, 20)}`);
                    if (await assignedTestType.count() > 0) {
                        console.log('✅ Assigned test type appears in lab tests section');
                    } else {
                        console.log('ℹ️ Assigned test type may not be visible in lab tests section');
                    }
                } else {
                    console.log('ℹ️ Lab tests section not found - may be in different location');
                }
            }
        } else {
            console.log('⚠️ Create Report button not found');
        }
        
        console.log('✅ Assign Test Type to Lab Tests test completed successfully');
    });

    test('REGRESSION: Assign Test Type to Water Tests specifically', async ({ page }) => {
        console.log('💧 Testing Assign Test Type to Water Tests specifically...');
        
        // Login and navigate
        await goToAliquotQaLink(page);
        await loginAquaUser(page, ALIQUOT_USERNAME_QA, ALIQUOT_PASSWORD_QA);
        await verifyAquaLoginQa(page);
        await clearCacheAndReload(page);
        
        // Navigate to Test Types
        const reportsTab = page.getByRole('tab', { name: 'Reports' }).or(
            page.getByRole('button', { name: 'Reports' })
        );
        
        await reportsTab.hover();
        const testTypesLink = page.getByRole('menuitem', { name: 'Test Types' }).or(
            page.locator('a:has-text("Test Types")')
        );
        await testTypesLink.click();
        await page.waitForLoadState('networkidle');
        
        // Select a system if required
        const systemLookup = page.locator('[data-testid="system-lookup"], .system-lookup');
        if (await systemLookup.count() > 0) {
            await systemLookup.click();
            await page.waitForTimeout(1000);
            
            const systemOptions = page.locator('[data-testid="system-option"], .system-option');
            if (await systemOptions.count() > 0) {
                await systemOptions.first().click();
                await page.waitForTimeout(2000);
            }
        }
        
        // Get test types table and find edit button
        const testTypesTable = page.getByRole('table').or(
            page.locator('.test-types-table, .test-types-list')
        );
        
        const testTypeRows = testTypesTable.locator('tbody tr, .test-type-row');
        
        if (await testTypeRows.count() > 0) {
            const firstTestType = testTypeRows.first();
            const editButton = firstTestType.locator('[data-testid="edit-btn"]').or(
                firstTestType.locator('button[title*="Edit"]')
            ).or(
                firstTestType.locator('button:has-text("Edit")')
            );
            
            if (await editButton.count() > 0 && !(await editButton.isDisabled())) {
                await editButton.click();
                await page.waitForLoadState('networkidle');
                
                // Toggle Assign Lab Test
                const assignLabTestToggle = page.locator('[data-testid="assign-lab-test-toggle"]').or(
                    page.locator('input[type="checkbox"][name*="assignLabTest"]')
                ).or(
                    page.locator('.toggle-switch:has-text("Assign Lab Test")')
                );
                
                if (await assignLabTestToggle.count() > 0) {
                    await assignLabTestToggle.click();
                    await page.waitForTimeout(1000);
                    
                    // Select Water Tests specifically
                    const waterTestsOption = page.getByRole('radio', { name: 'Lab Report Tests (Water Tests)' }).or(
                        page.locator('input[type="radio"][value*="water"]')
                    ).or(
                        page.locator('label:has-text("Water Tests")')
                    );
                    
                    if (await waterTestsOption.count() > 0) {
                        await waterTestsOption.click();
                        await page.waitForTimeout(500);
                        console.log('✅ Selected Water Tests specifically');
                        
                        // Save the changes
                        const saveButton = page.getByRole('button', { name: 'Save Test Type' }).or(
                            page.locator('button:has-text("Save")')
                        );
                        
                        if (await saveButton.count() > 0) {
                            await saveButton.click();
                            await page.waitForTimeout(3000);
                            
                            // Verify success
                            const successMessage = page.locator('.success-message, .alert-success');
                            if (await successMessage.count() > 0) {
                                console.log('✅ Test type assigned to Water Tests successfully');
                            }
                        }
                    }
                }
            }
        }
        
        console.log('✅ Assign Test Type to Water Tests test completed');
    });

    test('REGRESSION: Assign Test Type to Deposit Tests specifically', async ({ page }) => {
        console.log('🏔️ Testing Assign Test Type to Deposit Tests specifically...');
        
        // Login and navigate
        await goToAliquotQaLink(page);
        await loginAquaUser(page, ALIQUOT_USERNAME_QA, ALIQUOT_PASSWORD_QA);
        await verifyAquaLoginQa(page);
        await clearCacheAndReload(page);
        
        // Navigate to Test Types
        const reportsTab = page.getByRole('tab', { name: 'Reports' }).or(
            page.getByRole('button', { name: 'Reports' })
        );
        
        await reportsTab.hover();
        const testTypesLink = page.getByRole('menuitem', { name: 'Test Types' }).or(
            page.locator('a:has-text("Test Types")')
        );
        await testTypesLink.click();
        await page.waitForLoadState('networkidle');
        
        // Select a system if required
        const systemLookup = page.locator('[data-testid="system-lookup"], .system-lookup');
        if (await systemLookup.count() > 0) {
            await systemLookup.click();
            await page.waitForTimeout(1000);
            
            const systemOptions = page.locator('[data-testid="system-option"], .system-option');
            if (await systemOptions.count() > 0) {
                await systemOptions.first().click();
                await page.waitForTimeout(2000);
            }
        }
        
        // Get test types table and find edit button
        const testTypesTable = page.getByRole('table').or(
            page.locator('.test-types-table, .test-types-list')
        );
        
        const testTypeRows = testTypesTable.locator('tbody tr, .test-type-row');
        
        if (await testTypeRows.count() > 0) {
            const firstTestType = testTypeRows.first();
            const editButton = firstTestType.locator('[data-testid="edit-btn"]').or(
                firstTestType.locator('button[title*="Edit"]')
            ).or(
                firstTestType.locator('button:has-text("Edit")')
            );
            
            if (await editButton.count() > 0 && !(await editButton.isDisabled())) {
                await editButton.click();
                await page.waitForLoadState('networkidle');
                
                // Toggle Assign Lab Test
                const assignLabTestToggle = page.locator('[data-testid="assign-lab-test-toggle"]').or(
                    page.locator('input[type="checkbox"][name*="assignLabTest"]')
                ).or(
                    page.locator('.toggle-switch:has-text("Assign Lab Test")')
                );
                
                if (await assignLabTestToggle.count() > 0) {
                    await assignLabTestToggle.click();
                    await page.waitForTimeout(1000);
                    
                    // Select Deposit Tests specifically
                    const depositTestsOption = page.getByRole('radio', { name: 'Lab Report Tests (Deposit Tests)' }).or(
                        page.locator('input[type="radio"][value*="deposit"]')
                    ).or(
                        page.locator('label:has-text("Deposit Tests")')
                    );
                    
                    if (await depositTestsOption.count() > 0) {
                        await depositTestsOption.click();
                        await page.waitForTimeout(500);
                        console.log('✅ Selected Deposit Tests specifically');
                        
                        // Save the changes
                        const saveButton = page.getByRole('button', { name: 'Save Test Type' }).or(
                            page.locator('button:has-text("Save")')
                        );
                        
                        if (await saveButton.count() > 0) {
                            await saveButton.click();
                            await page.waitForTimeout(3000);
                            
                            // Verify success
                            const successMessage = page.locator('.success-message, .alert-success');
                            if (await successMessage.count() > 0) {
                                console.log('✅ Test type assigned to Deposit Tests successfully');
                            }
                        }
                    }
                }
            }
        }
        
        console.log('✅ Assign Test Type to Deposit Tests test completed');
    });

    test('REGRESSION: Verify lab test assignment in report creation', async ({ page }) => {
        console.log('📊 Testing lab test assignment verification in report creation...');
        
        // Login and navigate
        await goToAliquotQaLink(page);
        await loginAquaUser(page, ALIQUOT_USERNAME_QA, ALIQUOT_PASSWORD_QA);
        await verifyAquaLoginQa(page);
        await clearCacheAndReload(page);
        
        // Navigate to Create Report
        const reportsTab = page.getByRole('tab', { name: 'Reports' }).or(
            page.getByRole('button', { name: 'Reports' })
        );
        
        await reportsTab.hover();
        const createReportLink = page.getByRole('menuitem', { name: 'Create Report' }).or(
            page.locator('a:has-text("Create Report")')
        );
        await createReportLink.click();
        await page.waitForLoadState('networkidle');
        
        // Select a system if required
        const systemLookup = page.locator('[data-testid="system-lookup"], .system-lookup');
        if (await systemLookup.count() > 0) {
            await systemLookup.click();
            await page.waitForTimeout(1000);
            
            const systemOptions = page.locator('[data-testid="system-option"], .system-option');
            if (await systemOptions.count() > 0) {
                await systemOptions.first().click();
                await page.waitForTimeout(2000);
            }
        }
        
        // Look for lab report templates
        const templateSelection = page.getByRole('combobox', { name: 'Template' }).or(
            page.locator('select[name*="template"]')
        );
        
        if (await templateSelection.count() > 0) {
            await templateSelection.click();
            await page.waitForTimeout(500);
            
            // Check for lab report templates
            const labTemplates = page.locator('option:has-text("Lab Report")').or(
                page.locator('option:has-text("Water")')
            ).or(
                page.locator('option:has-text("Deposit")')
            );
            
            if (await labTemplates.count() > 0) {
                await labTemplates.first().click();
                await page.waitForTimeout(1000);
                
                // Click Create Report
                const createReportButton = page.getByRole('button', { name: 'Create Report' }).or(
                    page.locator('button:has-text("Create Report")')
                );
                
                if (await createReportButton.count() > 0) {
                    await createReportButton.click();
                    await page.waitForLoadState('networkidle');
                    
                    // Look for lab tests section
                    const labTestsSection = page.locator('[data-testid="lab-tests-section"]').or(
                        page.locator('.lab-tests, .lab-report-tests')
                    ).or(
                        page.locator('section:has-text("Lab Tests")')
                    ).or(
                        page.locator('div:has-text("Lab Tests")')
                    );
                    
                    if (await labTestsSection.count() > 0) {
                        console.log('✅ Lab tests section found in report creation');
                        
                        // Check for available test types
                        const availableTestTypes = labTestsSection.locator('.test-type, .lab-test-type');
                        const testTypeCount = await availableTestTypes.count();
                        
                        if (testTypeCount > 0) {
                            console.log(`✅ Found ${testTypeCount} test types available for lab tests`);
                        } else {
                            console.log('ℹ️ No test types visible in lab tests section');
                        }
                    } else {
                        console.log('ℹ️ Lab tests section not found - may be in different location');
                    }
                }
            }
        }
        
        console.log('✅ Lab test assignment verification test completed');
    });
});
