// Test Case: Create New Customer
// Steps: Login → Select Client → Create Customer → Fill Details → Save → Verify

import { test, expect } from '@playwright/test';
import { hoverSiteManagementButton } from '../../../pages/home/home.steps';
import { goToAliquotQaLink, loginAquaUser, verifyAquaLoginQa } from '../../../pages/login/login.steps';
import { ALIQUOT_PASSWORD_QA, ALIQUOT_USERNAME_QA } from '../../../utils/constants';
import { clearCacheAndReload } from '../../../utils/helpers';
import { clickMyOrganization } from '../../../pages/client/client.steps';

test('Create New Customer - Customer saved successfully and appeared on the Customer List', async ({ page }) => {
  // Generate unique test data
  const uniqueId = Date.now().toString();
  const customerName = `Test Customer ${uniqueId}`;
  const customerAddress = `Test Street ${uniqueId}`;
  const customerZip = `${uniqueId.slice(-5)}`;
  
  // Step 1: Login and navigate to Site Management
  await goToAliquotQaLink(page);
  await loginAquaUser(page, ALIQUOT_USERNAME_QA, ALIQUOT_PASSWORD_QA);
  await verifyAquaLoginQa(page);
  await page.waitForTimeout(1000);
  
  // Step 2: Click on Site Management tab directly
  await page.getByRole('button', { name: 'SiteManagement' }).click();
  await page.waitForTimeout(1000);

  // Step 3: click on My Organization and Select Client
  await page.getByText('My Organization').click();
  await page.waitForTimeout(1000);
  
  // Click on Select Client to open the lookup window
  await page.getByText('Select Client').click();
  await page.waitForTimeout(900);
  
  // Select the client from the lookup window
  await page.getByRole('cell', { name: 'Aquaphoenix_automation' }).nth(1).click();
  await page.waitForTimeout(1000);
  
   // Step 4: Click on Customer Lists button and Click on Create Customer button.
  await page.getByRole('button', { name: 'Customer Lists' }).click();
  await page.getByRole('button', { name: 'Create Customer' }).click();
  await page.waitForTimeout(10000);

    // Step 5: Fill customer details with randomized data
   console.log('🔍 Filling customer name...');
   await page.getByRole('textbox', { name: 'Enter the customer\'s name' }).click();
   await page.waitForTimeout(1000);
   await page.getByRole('textbox', { name: 'Enter the customer\'s name' }).fill(customerName);
   console.log(`✅ Filled customer name: ${customerName}`);
   await page.waitForTimeout(1000);
   
   console.log('🔍 Skipping address format selection for now...');
   // Skip address format selection - it might be optional
   await page.waitForTimeout(1000);
   
   console.log('🔍 Filling street address...');
   // Fill street address with Google Places autocomplete
   await page.locator('input[name="address.street1"]').click();
   await page.waitForTimeout(1000);
   await page.locator('input[name="address.street1"]').fill('surat');
   console.log('✅ Filled street address');
   await page.waitForTimeout(3000); // Wait for Google Places suggestions to appear
   
   console.log('🔍 Selecting address from suggestions...');
   // Select address from Google Places dropdown suggestions
   try {
     await page.getByText('Surat - Kamrej Highway').click();
     console.log('✅ Selected address from suggestions');
   } catch (e) {
     console.log('Address suggestion not found, trying alternative...');
     // Try to select any available suggestion
     await page.locator('.pac-item').first().click();
     console.log('✅ Selected first available address suggestion');
   }
   await page.waitForTimeout(2000); // Wait for address to be populated
   
   console.log('🔍 Filling zip code...');
   // Fill zip code
   await page.locator('input[name="address.zipCode"]').click();
   await page.locator('input[name="address.zipCode"]').fill(customerZip);
   console.log('✅ Filled zip code');
   await page.waitForTimeout(1000);
   await page.locator('div').filter({ hasText: /^Select a timezone$/ }).nth(2).click();
   await page.getByText('Africa/Abidjan').click();
   await page.waitForTimeout(10000);
  
  // Step 6: Save customer (first time)
  await page.getByRole('button', { name: 'Save Customer' }).click();
  await page.waitForTimeout(10000);
  
  // Step 7: Handle popup and verify
  await page.getByRole('button', { name: 'No' }).click();
  await page.waitForTimeout(1000);
  
  // Step 8: Verify customer was created by checking the customer list
  await page.getByText(customerName).click();
  console.log(`✅ Customer "${customerName}" created successfully!`);
});



