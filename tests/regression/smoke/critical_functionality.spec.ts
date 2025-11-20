import { test, expect } from '@playwright/test';
import { randomUUID } from 'crypto';

import {
    verifyShowAllTabVisible,
    clickShowAllTab,
    clickUserManagementTab,
    clickGlobalUserCheckbox,
    clickSelectClientIfVisible,
    fillClientSearchInput,
    clickClientDropdownOption,
    clickManageTypesButton,
    clickTestTypesItem,
    verifyClientNameVisible
} from '../../../pages/home/home.steps';

// Import video helpers
import { 
    attachVideoToReport, 
    getVideoConfigSummary, 
    isVideoEnabled 
} from '../../../utils/videoHelpers';

test.describe('Critical Functionality Regression Tests', () => {
    let testData: any;

    test.beforeEach(async ({ page }) => {
        // Setup test data
        testData = {
            uniqueId: randomUUID(),
            timestamp: new Date().toISOString()
        };

        // Navigate to the application
        await page.goto(process.env.BASE_URL || 'http://localhost:3000');
        
        // Wait for page to load
        await page.waitForLoadState('networkidle');
    });

    test.afterEach(async ({ page }) => {
        // Cleanup after each test
        await page.close();
    });

    test('User can access main navigation elements', async ({ page }) => {
        // Test basic navigation functionality
        await verifyShowAllTabVisible(page);
        await clickShowAllTab(page);
        
        // Verify the tab was clicked successfully
        await expect(page.locator('[data-testid="show-all-content"]')).toBeVisible();
    });

    test('User management functionality is accessible', async ({ page }) => {
        // Test user management access
        await clickUserManagementTab(page);
        
        // Verify user management section is visible
        await expect(page.locator('[data-testid="user-management-section"]')).toBeVisible();
    });

    test('Client selection functionality works', async ({ page }) => {
        // Test client selection
        await clickSelectClientIfVisible(page);
        
        // Verify client selection dialog is visible
        await expect(page.locator('[data-testid="client-selection-dialog"]')).toBeVisible();
    });

    test('Search functionality is responsive', async ({ page }) => {
        // Test search functionality
        const searchTerm = `test-search-${testData.uniqueId}`;
        await fillClientSearchInput(page, searchTerm);
        
        // Verify search input contains the search term
        await expect(page.locator('[data-testid="client-search-input"]')).toHaveValue(searchTerm);
    });

    test('Application responds to user interactions', async ({ page }) => {
        // Test basic responsiveness
        await clickManageTypesButton(page);
        
        // Verify types management section is visible
        await expect(page.locator('[data-testid="types-management-section"]')).toBeVisible();
    });

    test('Data loading and display works correctly', async ({ page }) => {
        // Test data loading
        await clickTestTypesItem(page);
        
        // Verify test types are loaded and displayed
        await expect(page.locator('[data-testid="test-types-list"]')).toBeVisible();
    });
});
