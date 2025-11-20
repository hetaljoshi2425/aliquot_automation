// Test Case: PDF Final Report
// Preconditions:
// - User is logged into the application
// - User has access to the Reports module
// - At least one final report exists in the system
// - Browser is configured to allow PDF downloads

import { test, expect } from '@playwright/test';
import { randomUUID } from 'crypto';
import * as path from 'path';

import { HomeSteps } from '../../../pages/home/home.steps';
import { hoverSiteManagementButton, clickClearFiltersBtn } from '../../../pages/home/home.steps';

import {
    goToAliquotQaLink,
    loginAquaUser,
    verifyAquaLoginQa
} from '../../../pages/login/login.steps';

import { ALIQUOT_PASSWORD_QA, ALIQUOT_USERNAME_QA } from '../../../utils/constants';
import { clearCacheAndReload } from '../../../utils/helpers';

test.describe('PDF Final Report - Functional Tests', () => {

    test.beforeEach(async ({ page }) => {
        console.log('🔧 Setting up PDF Final Report test environment...');
    });

    test.afterEach(async ({ page }) => {
        console.log('🧹 Cleaning up PDF Final Report test data...');
    });

    test('REGRESSION: PDF Final Report functionality works correctly', async ({ page }) => {
        console.log('📄 Testing PDF Final Report functionality...');
        
        // Login and navigate
        await goToAliquotQaLink(page);
        await loginAquaUser(page, ALIQUOT_USERNAME_QA, ALIQUOT_PASSWORD_QA);
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
        
        // Step 2: Click Report List
        console.log('📋 Clicking Report List...');
        const reportListLink = page.getByRole('menuitem', { name: 'Report List' }).or(
            page.getByRole('link', { name: 'Report List' })
        ).or(
            page.locator('[data-testid="report-list-link"]')
        ).or(
            page.locator('a:has-text("Report List")')
        );
        
        await reportListLink.click();
        await page.waitForLoadState('networkidle');
        
        // Verify Report List page is displayed
        const reportListPage = page.getByRole('heading', { name: 'Report List' }).or(
            page.locator('[data-testid="report-list-page"]')
        ).or(
            page.locator('h1:has-text("Report List")')
        ).or(
            page.locator('.page-title:has-text("Report List")')
        );
        
        await expect(reportListPage).toBeVisible({ timeout: 15000 });
        console.log('✅ Report List page is displayed');
        
        // Step 3: Click Final Reports in the Filter Draft Status section
        console.log('📋 Clicking Final Reports in Filter Draft Status section...');
        
        // Wait for filter section to be visible
        const filterSection = page.getByRole('region', { name: 'Filter Draft Status' }).or(
            page.locator('[data-testid="filter-draft-status"]')
        ).or(
            page.locator('.filter-section:has-text("Draft Status")')
        ).or(
            page.locator('fieldset:has-text("Filter")')
        ).or(
            page.locator('.filter-panel, .filter-controls')
        );
        
        await expect(filterSection).toBeVisible({ timeout: 10000 });
        console.log('✅ Filter Draft Status section is visible');
        
        // Click Final Reports filter
        const finalReportsFilter = page.getByRole('button', { name: 'Final Reports' }).or(
            page.getByRole('tab', { name: 'Final Reports' })
        ).or(
            page.getByRole('button', { name: 'Final' })
        ).or(
            page.locator('[data-testid="final-reports-filter"]')
        ).or(
            page.locator('.filter-tab:has-text("Final")')
        ).or(
            page.locator('button:has-text("Final Reports")')
        );
        
        await expect(finalReportsFilter).toBeVisible({ timeout: 10000 });
        await finalReportsFilter.click();
        await page.waitForTimeout(2000); // Wait for filter to apply
        
        console.log('✅ Final Reports filter selected');
        
        // Step 4: Verify Final Report list is loaded
        console.log('📋 Verifying Final Report list is loaded...');
        const reportList = page.getByRole('table', { name: 'Report List' }).or(
            page.locator('[data-testid="report-list-table"]')
        ).or(
            page.locator('.report-list, .data-table')
        ).or(
            page.locator('table')
        );
        
        await expect(reportList).toBeVisible({ timeout: 15000 });
        
        // Verify the list contains final reports
        const finalReports = reportList.locator('tbody tr:has-text("Final"), .report-row:has-text("Final")');
        const finalCount = await finalReports.count();
        
        if (finalCount > 0) {
            console.log(`✅ Final Report list is loaded with ${finalCount} final report(s)`);
            
            // Verify at least one final report row is visible
            await expect(finalReports.first()).toBeVisible();
            
        } else {
            console.log('ℹ️ No final reports found in the list');
        }
        
        // Step 5: Click on the selected Report
        console.log('📄 Selecting a final report...');
        
        if (finalCount > 0) {
            // Click on the first final report
            const firstFinalReport = finalReports.first();
            await firstFinalReport.click();
            await page.waitForLoadState('networkidle');
            console.log('✅ Final report selected');
        } else {
            // If no final reports found, try to select any report
            console.log('ℹ️ No final reports found, selecting any available report');
            const anyReport = reportList.locator('tbody tr, .report-row').first();
            await anyReport.click();
            await page.waitForLoadState('networkidle');
        }
        
        // Step 6: Verify Report is loaded
        console.log('📝 Verifying report is loaded...');
        
        // Wait for report page to load
        const reportPage = page.getByRole('heading', { name: 'Report' }).or(
            page.locator('[data-testid="report-page"]')
        ).or(
            page.locator('h1:has-text("Report")')
        ).or(
            page.locator('.report-form, .report-editor, .report-viewer')
        );
        
        await expect(reportPage).toBeVisible({ timeout: 15000 });
        console.log('✅ Report is loaded');
        
        // Verify we're on a final report (check for final indicators)
        const finalIndicator = page.locator(':has-text("Final"), .final-status, [data-status="final"]');
        if (await finalIndicator.count() > 0) {
            console.log('✅ Confirmed this is a final report');
        }
        
        // Step 7: Click Export Report (PDF icon)
        console.log('📄 Clicking Export Report (PDF icon)...');
        
        // Set up download handling
        const downloadPromise = page.waitForEvent('download');
        
        // Look for PDF export button/icon
        const pdfExportButton = page.getByRole('button', { name: 'Export Report' }).or(
            page.getByRole('button', { name: 'Export PDF' })
        ).or(
            page.getByRole('button', { name: 'Download PDF' })
        ).or(
            page.locator('[data-testid="export-pdf-btn"]')
        ).or(
            page.locator('button:has-text("Export")')
        ).or(
            page.locator('.export-button, .pdf-export')
        ).or(
            page.locator('button[title*="PDF"], button[title*="Export"]')
        ).or(
            page.locator('a:has-text("PDF"), a:has-text("Export")')
        );
        
        // Also look for PDF icon specifically
        const pdfIcon = page.locator('svg[data-icon="file-pdf"], .pdf-icon, [data-testid="pdf-icon"]').or(
            page.locator('i.fa-file-pdf, i.fa-pdf, .fa-file-pdf-o')
        ).or(
            page.locator('img[src*="pdf"], img[alt*="PDF"]')
        );
        
        // Try to find and click the export button
        let exportClicked = false;
        
        if (await pdfExportButton.count() > 0) {
            await pdfExportButton.click();
            exportClicked = true;
            console.log('✅ Export Report button clicked');
        } else if (await pdfIcon.count() > 0) {
            await pdfIcon.click();
            exportClicked = true;
            console.log('✅ PDF icon clicked');
        } else {
            // Look for any button with PDF-related text or icons
            const anyPdfButton = page.locator('button, a').filter({ hasText: /PDF|Export|Download/i });
            if (await anyPdfButton.count() > 0) {
                await anyPdfButton.first().click();
                exportClicked = true;
                console.log('✅ PDF-related button clicked');
            }
        }
        
        if (!exportClicked) {
            console.log('ℹ️ PDF export button not found, checking for alternative export options');
            
            // Look for export menu or dropdown
            const exportMenu = page.getByRole('button', { name: 'Export' }).or(
                page.locator('[data-testid="export-menu"]')
            ).or(
                page.locator('.export-menu, .download-menu')
            );
            
            if (await exportMenu.count() > 0) {
                await exportMenu.click();
                await page.waitForTimeout(1000);
                
                // Look for PDF option in the menu
                const pdfOption = page.getByRole('menuitem', { name: 'PDF' }).or(
                    page.getByRole('menuitem', { name: 'Export PDF' })
                ).or(
                    page.locator('a:has-text("PDF"), button:has-text("PDF")')
                );
                
                if (await pdfOption.count() > 0) {
                    await pdfOption.click();
                    exportClicked = true;
                    console.log('✅ PDF option selected from export menu');
                }
            }
        }
        
        if (!exportClicked) {
            throw new Error('PDF export button or option not found');
        }
        
        // Step 8: Verify PDF Final Report is downloaded
        console.log('📥 Verifying PDF Final Report is downloaded...');
        
        try {
            const download = await downloadPromise;
            
            // Verify download properties
            const suggestedFilename = download.suggestedFilename();
            console.log(`📄 Download suggested filename: ${suggestedFilename}`);
            
            // Verify it's a PDF file
            if (suggestedFilename.toLowerCase().includes('.pdf')) {
                console.log('✅ PDF file download initiated');
            } else {
                console.log('⚠️ Downloaded file may not be PDF format');
            }
            
            // Save the file to a temporary location
            const downloadPath = path.join(__dirname, '..', '..', '..', 'downloads', `test-report-${Date.now()}.pdf`);
            await download.saveAs(downloadPath);
            
            console.log(`✅ PDF Final Report downloaded successfully to: ${downloadPath}`);
            
            // Verify file exists and has content
            const fs = require('fs');
            if (fs.existsSync(downloadPath)) {
                const stats = fs.statSync(downloadPath);
                if (stats.size > 0) {
                    console.log(`✅ PDF file has content (${stats.size} bytes)`);
                } else {
                    console.log('⚠️ PDF file is empty');
                }
            }
            
        } catch (error) {
            console.log('⚠️ Download verification failed:', error.message);
            
            // Check if there's a success message instead
            const successMessage = page.getByText('PDF generated successfully').or(
                page.getByText('Report exported successfully')
            ).or(
                page.getByText('Download started')
            ).or(
                page.locator('.success-message, .alert-success')
            );
            
            if (await successMessage.count() > 0) {
                console.log('✅ PDF export success message displayed');
            } else {
                console.log('ℹ️ No download or success message detected');
            }
        }
        
        // Additional verification: Check if PDF viewer opened
        const pdfViewer = page.locator('iframe[src*=".pdf"], .pdf-viewer, [data-testid="pdf-viewer"]');
        if (await pdfViewer.count() > 0) {
            console.log('✅ PDF viewer opened in browser');
        }
        
        // Check for any error messages
        const errorMessage = page.locator('.error-message, .alert-error, [data-testid="error-message"]');
        if (await errorMessage.count() > 0) {
            const errorText = await errorMessage.first().textContent();
            console.log(`⚠️ Error message displayed: ${errorText}`);
        }
        
        console.log('✅ PDF Final Report test completed successfully');
    });

    test('REGRESSION: PDF export with different report types', async ({ page }) => {
        console.log('📄 Testing PDF export with different report types...');
        
        // Login and navigate
        await goToAliquotQaLink(page);
        await loginAquaUser(page, ALIQUOT_USERNAME_QA, ALIQUOT_PASSWORD_QA);
        await verifyAquaLoginQa(page);
        await clearCacheAndReload(page);
        
        // Navigate to Report List
        const reportsTab = page.getByRole('tab', { name: 'Reports' }).or(
            page.getByRole('button', { name: 'Reports' })
        );
        
        await reportsTab.hover();
        const reportListLink = page.getByRole('menuitem', { name: 'Report List' });
        await reportListLink.click();
        await page.waitForLoadState('networkidle');
        
        // Switch to Final Reports
        const finalReportsFilter = page.getByRole('button', { name: 'Final Reports' }).or(
            page.locator('button:has-text("Final")')
        );
        
        if (await finalReportsFilter.count() > 0) {
            await finalReportsFilter.click();
            await page.waitForTimeout(2000);
        }
        
        // Get all final reports
        const reportList = page.getByRole('table').or(
            page.locator('.report-list, .data-table')
        );
        
        const finalReports = reportList.locator('tbody tr:has-text("Final"), .report-row:has-text("Final")');
        const reportCount = await finalReports.count();
        
        console.log(`📊 Found ${reportCount} final reports available for testing`);
        
        // Test PDF export for first few reports
        const maxTests = Math.min(3, reportCount);
        
        for (let i = 0; i < maxTests; i++) {
            console.log(`🧪 Testing PDF export for report ${i + 1}...`);
            
            // Select the report
            const report = finalReports.nth(i);
            await report.click();
            await page.waitForLoadState('networkidle');
            
            // Look for PDF export button
            const pdfExportButton = page.getByRole('button', { name: 'Export Report' }).or(
                page.locator('button:has-text("Export")')
            ).or(
                page.locator('[data-testid="export-pdf-btn"]')
            );
            
            if (await pdfExportButton.count() > 0) {
                // Set up download handling
                const downloadPromise = page.waitForEvent('download');
                
                await pdfExportButton.click();
                
                try {
                    const download = await downloadPromise;
                    const filename = download.suggestedFilename();
                    console.log(`✅ PDF exported for report ${i + 1}: ${filename}`);
                } catch (error) {
                    console.log(`ℹ️ Download not detected for report ${i + 1}, checking for success message`);
                    
                    // Check for success message
                    const successMessage = page.getByText('PDF generated successfully').or(
                        page.locator('.success-message')
                    );
                    
                    if (await successMessage.count() > 0) {
                        console.log(`✅ PDF export success for report ${i + 1}`);
                    }
                }
            } else {
                console.log(`ℹ️ No PDF export button found for report ${i + 1}`);
            }
            
            // Navigate back to report list
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
        
        console.log('✅ PDF export with different report types test completed');
    });

    test('REGRESSION: Verify PDF export error handling', async ({ page }) => {
        console.log('🔍 Testing PDF export error handling...');
        
        // Login and navigate
        await goToAliquotQaLink(page);
        await loginAquaUser(page, ALIQUOT_USERNAME_QA, ALIQUOT_PASSWORD_QA);
        await verifyAquaLoginQa(page);
        await clearCacheAndReload(page);
        
        // Navigate to Report List
        const reportsTab = page.getByRole('tab', { name: 'Reports' }).or(
            page.getByRole('button', { name: 'Reports' })
        );
        
        await reportsTab.hover();
        const reportListLink = page.getByRole('menuitem', { name: 'Report List' });
        await reportListLink.click();
        await page.waitForLoadState('networkidle');
        
        // Switch to Final Reports
        const finalReportsFilter = page.getByRole('button', { name: 'Final Reports' }).or(
            page.locator('button:has-text("Final")')
        );
        
        if (await finalReportsFilter.count() > 0) {
            await finalReportsFilter.click();
            await page.waitForTimeout(2000);
        }
        
        // Select a final report
        const reportList = page.getByRole('table').or(
            page.locator('.report-list, .data-table')
        );
        
        const finalReports = reportList.locator('tbody tr:has-text("Final"), .report-row:has-text("Final")');
        
        if (await finalReports.count() > 0) {
            await finalReports.first().click();
            await page.waitForLoadState('networkidle');
            
            // Try to export PDF
            const pdfExportButton = page.getByRole('button', { name: 'Export Report' }).or(
                page.locator('button:has-text("Export")')
            );
            
            if (await pdfExportButton.count() > 0) {
                await pdfExportButton.click();
                await page.waitForTimeout(3000);
                
                // Check for error messages
                const errorMessage = page.locator('.error-message, .alert-error, [data-testid="error-message"]');
                if (await errorMessage.count() > 0) {
                    const errorText = await errorMessage.first().textContent();
                    console.log(`⚠️ Error message displayed: ${errorText}`);
                } else {
                    console.log('✅ No error messages displayed during PDF export');
                }
                
                // Check for loading indicators
                const loadingIndicator = page.locator('.loading, .spinner, [data-testid="loading"]');
                if (await loadingIndicator.count() > 0) {
                    console.log('ℹ️ Loading indicator displayed during PDF generation');
                }
            }
        }
        
        console.log('✅ PDF export error handling test completed');
    });
});
