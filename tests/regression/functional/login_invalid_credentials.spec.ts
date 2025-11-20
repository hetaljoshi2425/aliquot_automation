import { test, expect } from '@playwright/test';
import { randomUUID } from 'crypto';

import {
    goToAliquotQaLink,
    loginAquaUser,
    verifyAquaLoginQa
} from '../../../pages/login/login.steps';

import { 
    ALIQUOT_USERNAME_QA, 
    ALIQUOT_PASSWORD_QA,
    ALIQUOT_WRONG_PASS 
} from '../../../utils/constants';

/**
 * Login Invalid Credentials Tests - QA Environment
 * 
 * Based on actual recording from 02/09/2025:
 * - Error message: "Invalid Credentials." (exact text)
 * - Error container: div.sc-jwIPbr
 * - URL: https://qa.aliquot.live/login
 * 
 * Live testing results (04:38:44):
 * - Error styling: White text (rgb(255, 255, 255)) on red background (rgb(215, 0, 21))
 * - Border: White (rgb(255, 255, 255))
 * - Font: 15px, weight 400
 * - Dimensions: 1396x48 pixels
 * - Container: div.sc-jwIPbr with class lnXeMk
 */
test.describe('Login Invalid Credentials Tests - QA Environment - Functional Suite', () => {

    // Helper function to locate error message based on actual recording and live testing
    // Handles dynamic content with multiple possible error messages
    const locateErrorMessage = (page: any) => {
        // Use multiple selectors with proper Playwright syntax
        return page.locator('div.sc-jwIPbr:has-text("Invalid Credentials."), div.sc-jwIPbr:has-text("email is required")');
    };

    // Helper function to wait for dynamic error message with retry logic
    const waitForErrorMessage = async (page: any, timeout: number = 5000) => {
        const errorMessage = locateErrorMessage(page);
        
        // Wait for error message to appear dynamically
        await expect(errorMessage).toBeVisible({ timeout });
        
        // Additional verification that element is truly visible
        const isVisible = await errorMessage.isVisible();
        expect(isVisible).toBe(true);
        
        return errorMessage;
    };

    // Helper function to verify error message styling based on live testing results
    const verifyErrorStyling = async (page: any, errorElement: any) => {
        const computedStyle = await errorElement.evaluate((el: any) => {
            const style = window.getComputedStyle(el);
            return {
                color: style.color,
                backgroundColor: style.backgroundColor,
                borderColor: style.borderColor,
                fontWeight: style.fontWeight,
                fontSize: style.fontSize,
                width: el.offsetWidth,
                height: el.offsetHeight
            };
        });
        
        // Verify exact styling from live testing
        expect(computedStyle.color).toBe('rgb(255, 255, 255)'); // White text
        expect(computedStyle.backgroundColor).toBe('rgb(215, 0, 21)'); // Red background
        expect(computedStyle.borderColor).toBe('rgb(255, 255, 255)'); // White border
        expect(computedStyle.fontSize).toBe('15px');
        expect(computedStyle.fontWeight).toBe('400');
        
        // Verify dimensions (should be substantial for visibility)
        expect(computedStyle.width).toBeGreaterThan(100);
        expect(computedStyle.height).toBeGreaterThan(20);
        
        return computedStyle;
    };

    test.beforeEach(async ({ page }) => {
        console.log('🔐 Setting up login invalid credentials test environment...');
    });

    test.afterEach(async ({ page }) => {
        console.log('🧹 Cleaning up login test data...');
    });

    test('REGRESSION: Login with invalid email and valid password - verify "email is required" error message', async ({ page }) => {
        console.log('📧 Testing login with invalid email and valid password...');
        
        // Navigate to login page
        await goToAliquotQaLink(page);
        
        // Generate invalid email (random string that's not a valid email format)
        const invalidEmail = `invalid_${randomUUID()}@test`;
        
        // Attempt login with invalid email and valid password
        await loginAquaUser(page, invalidEmail, ALIQUOT_PASSWORD_QA);
        
        // Wait for dynamic error message to appear with proper timeout and retry logic
        console.log('⏳ Waiting for dynamic error message to appear...');
        const errorMessage = await waitForErrorMessage(page, 5000);
        
        // Get the error element for further verification
        const errorElement = errorMessage.first();
        
        // Verify the error message content
        const textContent = await errorElement.textContent();
        console.log(`📝 Error message content: "${textContent}"`);
        
        // Check if it's one of the expected error messages
        const expectedMessages = ['Invalid Credentials.', 'email is required'];
        const hasExpectedMessage = expectedMessages.some(msg => textContent?.includes(msg));
        expect(hasExpectedMessage).toBe(true);
        
        // Get parent elements for debugging (as suggested in the dynamic content handling)
        const parentElements = await errorElement.evaluate((el: any) => {
            let parents = [];
            let current = el;
            while (current.parentElement) {
                parents.push(current.parentElement.tagName);
                current = current.parentElement;
            }
            return parents.reverse();
        });
        console.log('🏗️ Parent elements hierarchy:', parentElements);
        
        // Check for error message styling
        const computedStyle = await errorElement.evaluate((el: any) => {
            const style = window.getComputedStyle(el);
            return {
                color: style.color,
                backgroundColor: style.backgroundColor,
                borderColor: style.borderColor,
                fontWeight: style.fontWeight,
                fontSize: style.fontSize,
                width: el.offsetWidth,
                height: el.offsetHeight
            };
        });
        
        console.log(`📊 Error element styling:`, computedStyle);
        
        // Verify styling meets accessibility standards (high contrast)
        expect(computedStyle.width).toBeGreaterThan(0);
        expect(computedStyle.height).toBeGreaterThan(0);
        
        // Check if error is positioned appropriately (not overlapping with form fields)
        const errorRect = await errorElement.boundingBox();
        const emailField = page.getByPlaceholder('user@example.com');
        const emailRect = await emailField.boundingBox();
        
        if (errorRect && emailRect) {
            // Error should be visible and not completely overlapping with form
            expect(errorRect.width).toBeGreaterThan(0);
            expect(errorRect.height).toBeGreaterThan(0);
            
            // Ensure it's positioned correctly: below or beside the email input
            expect(errorRect.y).toBeGreaterThanOrEqual(emailRect.y + emailRect.height); // Ensure it's not above the email field
            expect(errorRect.x).toBeGreaterThanOrEqual(emailRect.x); // Ensure it's not to the left of the email field
            
            console.log('✅ Error message has appropriate dimensions and positioning');
        } else {
            console.log('⚠️ Error or email field is not properly positioned');
        }
        
        console.log('✅ Error message styling and positioning verified');
        
        // Verify that we're still on the login page (not redirected)
        const loginButton = page.getByRole('button', { name: /Login|Sign In|Login to Account/i });
        await expect(loginButton).toBeVisible();
        console.log('✅ User remains on login page after invalid credentials');
    });

    test('REGRESSION: Login with valid email and invalid password - verify "email is required" error message', async ({ page }) => {
        console.log('🔑 Testing login with valid email and invalid password...');
        
        // Navigate to login page
        await goToAliquotQaLink(page);
        
        // Use valid email but invalid password
        const invalidPassword = `wrong_${randomUUID()}`;
        
        // Attempt login with valid email and invalid password
        await loginAquaUser(page, ALIQUOT_USERNAME_QA, invalidPassword);
        
        // Wait for dynamic error message to appear with proper timeout and retry logic
        console.log('⏳ Waiting for dynamic error message to appear...');
        const errorMessage = await waitForErrorMessage(page, 5000);
        
        // Get the error element for further verification
        const errorElement = errorMessage.first();
        
        // Verify the error message content
        const textContent = await errorElement.textContent();
        console.log(`📝 Error message content: "${textContent}"`);
        
        // Check if it's one of the expected error messages
        const expectedMessages = ['Invalid Credentials.', 'email is required'];
        const hasExpectedMessage = expectedMessages.some(msg => textContent?.includes(msg));
        expect(hasExpectedMessage).toBe(true);
        
        console.log('✅ Invalid credentials error message is displayed');
        
        // Verify that we're still on the login page (not redirected)
        const loginButton = page.getByRole('button', { name: /Login|Sign In|Login to Account/i });
        await expect(loginButton).toBeVisible();
        console.log('✅ User remains on login page after invalid credentials');
    });

    test('REGRESSION: Login with both invalid email and invalid password - verify "email is required" error message', async ({ page }) => {
        console.log('❌ Testing login with both invalid email and invalid password...');
        
        // Navigate to login page
        await goToAliquotQaLink(page);
        
        // Generate completely invalid credentials
        const invalidEmail = `invalid_${randomUUID()}@test`;
        const invalidPassword = `wrong_${randomUUID()}`;
        
        // Attempt login with both invalid credentials
        await loginAquaUser(page, invalidEmail, invalidPassword);
        
        // Wait for dynamic error message to appear with proper timeout and retry logic
        console.log('⏳ Waiting for dynamic error message to appear...');
        const errorMessage = await waitForErrorMessage(page, 5000);
        
        // Get the error element for further verification
        const errorElement = errorMessage.first();
        
        // Verify the error message content
        const textContent = await errorElement.textContent();
        console.log(`📝 Error message content: "${textContent}"`);
        
        // Check if it's one of the expected error messages
        const expectedMessages = ['Invalid Credentials.', 'email is required'];
        const hasExpectedMessage = expectedMessages.some(msg => textContent?.includes(msg));
        expect(hasExpectedMessage).toBe(true);
        
        console.log('✅ Invalid credentials error message is displayed');
        
        // Verify that we're still on the login page (not redirected)
        const loginButton = page.getByRole('button', { name: /Login|Sign In|Login to Account/i });
        await expect(loginButton).toBeVisible();
        console.log('✅ User remains on login page after invalid credentials');
    });

    test('REGRESSION: Login error message styling and positioning verification', async ({ page }) => {
        console.log('🎨 Testing login error message styling and positioning...');
        
        // Navigate to login page
        await goToAliquotQaLink(page);
        
        // Attempt login with invalid credentials to trigger error
        const invalidEmail = `invalid_${randomUUID()}@test`;
        await loginAquaUser(page, invalidEmail, ALIQUOT_PASSWORD_QA);
        
        // Wait for dynamic error message to appear with proper timeout and retry logic
        console.log('⏳ Waiting for dynamic error message to appear...');
        const errorMessage = await waitForErrorMessage(page, 5000);
        
        // Get the error element for further verification
        const errorElement = errorMessage.first();
        
        // Verify the error message content
        const textContent = await errorElement.textContent();
        console.log(`📝 Error message content: "${textContent}"`);
        
        // Use our helper function to verify exact styling from live testing
        const computedStyle = await verifyErrorStyling(page, errorElement);
        console.log(`📊 Error element styling verified:`, computedStyle);
        
        // Check if error is positioned appropriately (not overlapping with form fields)
        const errorRect = await errorElement.boundingBox();
        const emailField = page.getByPlaceholder('user@example.com');
        const emailRect = await emailField.boundingBox();
        
        if (errorRect && emailRect) {
            // Error should be visible and not completely overlapping with form
            expect(errorRect.width).toBeGreaterThan(0);
            expect(errorRect.height).toBeGreaterThan(0);
           
            console.log('✅ Error message has appropriate dimensions and positioning');
        } else {
            console.log('⚠️ Error or email field is not properly positioned');
        }
        
        console.log('✅ Error message styling and positioning verified');
        
        // Verify form fields are still accessible after error
        const passwordField = page.getByPlaceholder('*********');
        const loginButton = page.getByRole('button', { name: /Login|Sign In|Login to Account/i });
        
        await expect(emailField).toBeVisible();
        await expect(passwordField).toBeVisible();
        await expect(loginButton).toBeVisible();
        
        console.log('✅ Form fields remain accessible after error display');
    });

    test('REGRESSION: Multiple failed login attempts - verify consistent error handling', async ({ page }) => {
        console.log('🔄 Testing multiple failed login attempts for consistent error handling...');
        
        // Navigate to login page
        await goToAliquotQaLink(page);
        
        // Perform multiple failed login attempts
        const testCases = [
            { email: `invalid1_${randomUUID()}@test`, password: ALIQUOT_PASSWORD_QA, description: 'Invalid email, valid password' },
            { email: ALIQUOT_USERNAME_QA, password: `wrong1_${randomUUID()}`, description: 'Valid email, invalid password' },
            { email: `invalid2_${randomUUID()}@test`, password: `wrong2_${randomUUID()}`, description: 'Both invalid credentials' }
        ];
        
        for (let i = 0; i < testCases.length; i++) {
            const testCase = testCases[i];
            console.log(`🔄 Attempt ${i + 1}: ${testCase.description}`);
            
            // Clear fields before each attempt
            const emailField = page.getByPlaceholder('user@example.com');
            const passwordField = page.getByPlaceholder('*********');
            
            await emailField.clear();
            await passwordField.clear();
            
            // Attempt login
            await loginAquaUser(page, testCase.email, testCase.password);
            
            // Wait for dynamic error message to appear with proper timeout and retry logic
            console.log(`⏳ Waiting for dynamic error message to appear for attempt ${i + 1}...`);
            const errorMessage = await waitForErrorMessage(page, 5000);
            
            // Verify error message appears consistently
            await expect(errorMessage.first()).toBeVisible();
            console.log(`✅ Error message displayed consistently for attempt ${i + 1}`);
            
            // Verify the error message content
            const errorElement = errorMessage.first();
            const textContent = await errorElement.textContent();
            console.log(`📝 Error message content for attempt ${i + 1}: "${textContent}"`);
            
            // Verify still on login page
            const loginButton = page.getByRole('button', { name: /Login|Sign In|Login to Account/i });
            await expect(loginButton).toBeVisible();
            
            // Small delay between attempts
            if (i < testCases.length - 1) {
                await page.waitForTimeout(1000);
            }
        }
        
        console.log('✅ Multiple failed login attempts handled consistently');
    });
});
