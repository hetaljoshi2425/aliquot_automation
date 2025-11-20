import { Page, expect } from '@playwright/test';
import { allure } from 'allure-playwright';

// ========================================
// CLIENT OPERATIONS
// ========================================

export async function createClient(page: Page, clientName: string, clientAddress: string) {
    await allure.step(`Create client: ${clientName}`, async () => {
        console.log(`📝 Creating client: ${clientName}`);
        
        // Click Create Client button
        await page.click('[data-testid="create-client-btn"]');
        await page.waitForTimeout(1000);
        
        // Fill client details
        await page.fill('[data-testid="client-name-input"]', clientName);
        await page.fill('[data-testid="client-address-input"]', clientAddress);
        
        // Save client
        await page.click('[data-testid="save-client-btn"]');
        await page.waitForTimeout(2000);
    });
}

export async function editClient(page: Page, originalName: string, newName: string, newAddress: string) {
    await allure.step(`Edit client from ${originalName} to ${newName}`, async () => {
        console.log(`✏️ Editing client: ${originalName} -> ${newName}`);
        
        // Search for the client
        await page.fill('[data-testid="client-search-input"]', originalName);
        await page.waitForTimeout(1000);
        
        // Click edit button
        await page.click(`[data-testid="edit-client-${originalName}"]`);
        await page.waitForTimeout(1000);
        
        // Update client details
        await page.fill('[data-testid="client-name-input"]', newName);
        await page.fill('[data-testid="client-address-input"]', newAddress);
        
        // Save changes
        await page.click('[data-testid="save-client-btn"]');
        await page.waitForTimeout(2000);
    });
}

export async function deleteClient(page: Page, clientName: string) {
    await allure.step(`Delete client: ${clientName}`, async () => {
        console.log(`🗑️ Deleting client: ${clientName}`);
        
        // Search for the client
        await page.fill('[data-testid="client-search-input"]', clientName);
        await page.waitForTimeout(1000);
        
        // Click delete button
        await page.click(`[data-testid="delete-client-${clientName}"]`);
        await page.waitForTimeout(1000);
        
        // Confirm deletion
        await page.click('[data-testid="confirm-delete-btn"]');
        await page.waitForTimeout(2000);
    });
}

export async function verifyClientList(page: Page) {
    await allure.step('Verify client list is displayed', async () => {
        console.log('📋 Verifying client list');
        
        await expect(page.locator('[data-testid="client-list-table"]')).toBeVisible();
        await expect(page.locator('[data-testid="client-list-header"]')).toContainText('Client List');
    });
}

export async function verifyClientSaved(page: Page, clientName: string) {
    await allure.step(`Verify client ${clientName} is saved`, async () => {
        console.log(`✅ Verifying client saved: ${clientName}`);
        
        await expect(page.locator('[data-testid="success-message"]')).toContainText('Client saved successfully');
        await expect(page.locator(`[data-testid="client-row-${clientName}"]`)).toBeVisible();
    });
}

export async function verifyClientDeleted(page: Page, clientName: string) {
    await allure.step(`Verify client ${clientName} is deleted`, async () => {
        console.log(`✅ Verifying client deleted: ${clientName}`);
        
        await expect(page.locator('[data-testid="success-message"]')).toContainText('Client deleted successfully');
        await expect(page.locator(`[data-testid="client-row-${clientName}"]`)).not.toBeVisible();
    });
}

export async function verifyClientEdited(page: Page, clientName: string) {
    await allure.step(`Verify client ${clientName} is edited`, async () => {
        console.log(`✅ Verifying client edited: ${clientName}`);
        
        await expect(page.locator('[data-testid="success-message"]')).toContainText('Client updated successfully');
        await expect(page.locator(`[data-testid="client-row-${clientName}"]`)).toBeVisible();
    });
}

// ========================================
// CUSTOMER OPERATIONS
// ========================================

export async function createCustomer(page: Page, customerName: string, customerAddress: string) {
    await allure.step(`Create customer: ${customerName}`, async () => {
        console.log(`📝 Creating customer: ${customerName}`);
        
        // Click Create Customer button
        await page.click('[data-testid="create-customer-btn"]');
        await page.waitForTimeout(1000);
        
        // Fill customer details
        await page.fill('[data-testid="customer-name-input"]', customerName);
        await page.fill('[data-testid="customer-address-input"]', customerAddress);
        
        // Save customer
        await page.click('[data-testid="save-customer-btn"]');
        await page.waitForTimeout(2000);
    });
}

export async function editCustomer(page: Page, originalName: string, newName: string, newAddress: string) {
    await allure.step(`Edit customer from ${originalName} to ${newName}`, async () => {
        console.log(`✏️ Editing customer: ${originalName} -> ${newName}`);
        
        // Search for the customer
        await page.fill('[data-testid="customer-search-input"]', originalName);
        await page.waitForTimeout(1000);
        
        // Click edit button
        await page.click(`[data-testid="edit-customer-${originalName}"]`);
        await page.waitForTimeout(1000);
        
        // Update customer details
        await page.fill('[data-testid="customer-name-input"]', newName);
        await page.fill('[data-testid="customer-address-input"]', newAddress);
        
        // Save changes
        await page.click('[data-testid="save-customer-btn"]');
        await page.waitForTimeout(2000);
    });
}

export async function deleteCustomer(page: Page, customerName: string) {
    await allure.step(`Delete customer: ${customerName}`, async () => {
        console.log(`🗑️ Deleting customer: ${customerName}`);
        
        // Search for the customer
        await page.fill('[data-testid="customer-search-input"]', customerName);
        await page.waitForTimeout(1000);
        
        // Click delete button
        await page.click(`[data-testid="delete-customer-${customerName}"]`);
        await page.waitForTimeout(1000);
        
        // Confirm deletion
        await page.click('[data-testid="confirm-delete-btn"]');
        await page.waitForTimeout(2000);
    });
}

export async function verifyCustomerList(page: Page) {
    await allure.step('Verify customer list is displayed', async () => {
        console.log('📋 Verifying customer list');
        
        await expect(page.locator('[data-testid="customer-list-table"]')).toBeVisible();
        await expect(page.locator('[data-testid="customer-list-header"]')).toContainText('Customer List');
    });
}

export async function verifyCustomerSaved(page: Page, customerName: string) {
    await allure.step(`Verify customer ${customerName} is saved`, async () => {
        console.log(`✅ Verifying customer saved: ${customerName}`);
        
        await expect(page.locator('[data-testid="success-message"]')).toContainText('Customer saved successfully');
        await expect(page.locator(`[data-testid="customer-row-${customerName}"]`)).toBeVisible();
    });
}

export async function verifyCustomerDeleted(page: Page, customerName: string) {
    await allure.step(`Verify customer ${customerName} is deleted`, async () => {
        console.log(`✅ Verifying customer deleted: ${customerName}`);
        
        await expect(page.locator('[data-testid="success-message"]')).toContainText('Customer deleted successfully');
        await expect(page.locator(`[data-testid="customer-row-${customerName}"]`)).not.toBeVisible();
    });
}

export async function verifyCustomerEdited(page: Page, customerName: string) {
    await allure.step(`Verify customer ${customerName} is edited`, async () => {
        console.log(`✅ Verifying customer edited: ${customerName}`);
        
        await expect(page.locator('[data-testid="success-message"]')).toContainText('Customer updated successfully');
        await expect(page.locator(`[data-testid="customer-row-${customerName}"]`)).toBeVisible();
    });
}

// ========================================
// FACILITY OPERATIONS
// ========================================

export async function createFacility(page: Page, facilityName: string, facilityAddress: string) {
    await allure.step(`Create facility: ${facilityName}`, async () => {
        console.log(`📝 Creating facility: ${facilityName}`);
        
        // Click Create Facility button
        await page.click('[data-testid="create-facility-btn"]');
        await page.waitForTimeout(1000);
        
        // Fill facility details
        await page.fill('[data-testid="facility-name-input"]', facilityName);
        await page.fill('[data-testid="facility-address-input"]', facilityAddress);
        
        // Save facility
        await page.click('[data-testid="save-facility-btn"]');
        await page.waitForTimeout(2000);
    });
}

export async function editFacility(page: Page, originalName: string, newName: string, newAddress: string) {
    await allure.step(`Edit facility from ${originalName} to ${newName}`, async () => {
        console.log(`✏️ Editing facility: ${originalName} -> ${newName}`);
        
        // Search for the facility
        await page.fill('[data-testid="facility-search-input"]', originalName);
        await page.waitForTimeout(1000);
        
        // Click edit button
        await page.click(`[data-testid="edit-facility-${originalName}"]`);
        await page.waitForTimeout(1000);
        
        // Update facility details
        await page.fill('[data-testid="facility-name-input"]', newName);
        await page.fill('[data-testid="facility-address-input"]', newAddress);
        
        // Save changes
        await page.click('[data-testid="save-facility-btn"]');
        await page.waitForTimeout(2000);
    });
}

export async function deleteFacility(page: Page, facilityName: string) {
    await allure.step(`Delete facility: ${facilityName}`, async () => {
        console.log(`🗑️ Deleting facility: ${facilityName}`);
        
        // Search for the facility
        await page.fill('[data-testid="facility-search-input"]', facilityName);
        await page.waitForTimeout(1000);
        
        // Click delete button
        await page.click(`[data-testid="delete-facility-${facilityName}"]`);
        await page.waitForTimeout(1000);
        
        // Confirm deletion
        await page.click('[data-testid="confirm-delete-btn"]');
        await page.waitForTimeout(2000);
    });
}

export async function verifyFacilityList(page: Page) {
    await allure.step('Verify facility list is displayed', async () => {
        console.log('📋 Verifying facility list');
        
        await expect(page.locator('[data-testid="facility-list-table"]')).toBeVisible();
        await expect(page.locator('[data-testid="facility-list-header"]')).toContainText('Facility List');
    });
}

export async function verifyFacilitySaved(page: Page, facilityName: string) {
    await allure.step(`Verify facility ${facilityName} is saved`, async () => {
        console.log(`✅ Verifying facility saved: ${facilityName}`);
        
        await expect(page.locator('[data-testid="success-message"]')).toContainText('Facility saved successfully');
        await expect(page.locator(`[data-testid="facility-row-${facilityName}"]`)).toBeVisible();
    });
}

export async function verifyFacilityDeleted(page: Page, facilityName: string) {
    await allure.step(`Verify facility ${facilityName} is deleted`, async () => {
        console.log(`✅ Verifying facility deleted: ${facilityName}`);
        
        await expect(page.locator('[data-testid="success-message"]')).toContainText('Facility deleted successfully');
        await expect(page.locator(`[data-testid="facility-row-${facilityName}"]`)).not.toBeVisible();
    });
}

export async function verifyFacilityEdited(page: Page, facilityName: string) {
    await allure.step(`Verify facility ${facilityName} is edited`, async () => {
        console.log(`✅ Verifying facility edited: ${facilityName}`);
        
        await expect(page.locator('[data-testid="success-message"]')).toContainText('Facility updated successfully');
        await expect(page.locator(`[data-testid="facility-row-${facilityName}"]`)).toBeVisible();
    });
}

// ========================================
// BUILDING OPERATIONS
// ========================================

export async function createBuilding(page: Page, buildingName: string, buildingAddress: string) {
    await allure.step(`Create building: ${buildingName}`, async () => {
        console.log(`📝 Creating building: ${buildingName}`);
        
        // Click Create Building button
        await page.click('[data-testid="create-building-btn"]');
        await page.waitForTimeout(1000);
        
        // Fill building details
        await page.fill('[data-testid="building-name-input"]', buildingName);
        await page.fill('[data-testid="building-address-input"]', buildingAddress);
        
        // Save building
        await page.click('[data-testid="save-building-btn"]');
        await page.waitForTimeout(2000);
    });
}

export async function editBuilding(page: Page, originalName: string, newName: string, newAddress: string) {
    await allure.step(`Edit building from ${originalName} to ${newName}`, async () => {
        console.log(`✏️ Editing building: ${originalName} -> ${newName}`);
        
        // Search for the building
        await page.fill('[data-testid="building-search-input"]', originalName);
        await page.waitForTimeout(1000);
        
        // Click edit button
        await page.click(`[data-testid="edit-building-${originalName}"]`);
        await page.waitForTimeout(1000);
        
        // Update building details
        await page.fill('[data-testid="building-name-input"]', newName);
        await page.fill('[data-testid="building-address-input"]', newAddress);
        
        // Save changes
        await page.click('[data-testid="save-building-btn"]');
        await page.waitForTimeout(2000);
    });
}

export async function deleteBuilding(page: Page, buildingName: string) {
    await allure.step(`Delete building: ${buildingName}`, async () => {
        console.log(`🗑️ Deleting building: ${buildingName}`);
        
        // Search for the building
        await page.fill('[data-testid="building-search-input"]', buildingName);
        await page.waitForTimeout(1000);
        
        // Click delete button
        await page.click(`[data-testid="delete-building-${buildingName}"]`);
        await page.waitForTimeout(1000);
        
        // Confirm deletion
        await page.click('[data-testid="confirm-delete-btn"]');
        await page.waitForTimeout(2000);
    });
}

export async function verifyBuildingList(page: Page) {
    await allure.step('Verify building list is displayed', async () => {
        console.log('📋 Verifying building list');
        
        await expect(page.locator('[data-testid="building-list-table"]')).toBeVisible();
        await expect(page.locator('[data-testid="building-list-header"]')).toContainText('Building List');
    });
}

export async function verifyBuildingSaved(page: Page, buildingName: string) {
    await allure.step(`Verify building ${buildingName} is saved`, async () => {
        console.log(`✅ Verifying building saved: ${buildingName}`);
        
        await expect(page.locator('[data-testid="success-message"]')).toContainText('Building saved successfully');
        await expect(page.locator(`[data-testid="building-row-${buildingName}"]`)).toBeVisible();
    });
}

export async function verifyBuildingDeleted(page: Page, buildingName: string) {
    await allure.step(`Verify building ${buildingName} is deleted`, async () => {
        console.log(`✅ Verifying building deleted: ${buildingName}`);
        
        await expect(page.locator('[data-testid="success-message"]')).toContainText('Building deleted successfully');
        await expect(page.locator(`[data-testid="building-row-${buildingName}"]`)).not.toBeVisible();
    });
}

export async function verifyBuildingEdited(page: Page, buildingName: string) {
    await allure.step(`Verify building ${buildingName} is edited`, async () => {
        console.log(`✅ Verifying building edited: ${buildingName}`);
        
        await expect(page.locator('[data-testid="success-message"]')).toContainText('Building updated successfully');
        await expect(page.locator(`[data-testid="building-row-${buildingName}"]`)).toBeVisible();
    });
}

// ========================================
// SYSTEM OPERATIONS
// ========================================

export async function createSystem(page: Page, systemName: string, systemDescription: string) {
    await allure.step(`Create system: ${systemName}`, async () => {
        console.log(`📝 Creating system: ${systemName}`);
        
        // Click Create System button
        await page.click('[data-testid="create-system-btn"]');
        await page.waitForTimeout(1000);
        
        // Fill system details
        await page.fill('[data-testid="system-name-input"]', systemName);
        await page.fill('[data-testid="system-description-input"]', systemDescription);
        
        // Save system
        await page.click('[data-testid="save-system-btn"]');
        await page.waitForTimeout(2000);
    });
}

export async function editSystem(page: Page, originalName: string, newName: string, newDescription: string) {
    await allure.step(`Edit system from ${originalName} to ${newName}`, async () => {
        console.log(`✏️ Editing system: ${originalName} -> ${newName}`);
        
        // Search for the system
        await page.fill('[data-testid="system-search-input"]', originalName);
        await page.waitForTimeout(1000);
        
        // Click edit button
        await page.click(`[data-testid="edit-system-${originalName}"]`);
        await page.waitForTimeout(1000);
        
        // Update system details
        await page.fill('[data-testid="system-name-input"]', newName);
        await page.fill('[data-testid="system-description-input"]', newDescription);
        
        // Save changes
        await page.click('[data-testid="save-system-btn"]');
        await page.waitForTimeout(2000);
    });
}

export async function deleteSystem(page: Page, systemName: string) {
    await allure.step(`Delete system: ${systemName}`, async () => {
        console.log(`🗑️ Deleting system: ${systemName}`);
        
        // Search for the system
        await page.fill('[data-testid="system-search-input"]', systemName);
        await page.waitForTimeout(1000);
        
        // Click delete button
        await page.click(`[data-testid="delete-system-${systemName}"]`);
        await page.waitForTimeout(1000);
        
        // Confirm deletion
        await page.click('[data-testid="confirm-delete-btn"]');
        await page.waitForTimeout(2000);
    });
}

export async function verifySystemList(page: Page) {
    await allure.step('Verify system list is displayed', async () => {
        console.log('📋 Verifying system list');
        
        await expect(page.locator('[data-testid="system-list-table"]')).toBeVisible();
        await expect(page.locator('[data-testid="system-list-header"]')).toContainText('System List');
    });
}

export async function verifySystemSaved(page: Page, systemName: string) {
    await allure.step(`Verify system ${systemName} is saved`, async () => {
        console.log(`✅ Verifying system saved: ${systemName}`);
        
        await expect(page.locator('[data-testid="success-message"]')).toContainText('System saved successfully');
        await expect(page.locator(`[data-testid="system-row-${systemName}"]`)).toBeVisible();
    });
}

export async function verifySystemDeleted(page: Page, systemName: string) {
    await allure.step(`Verify system ${systemName} is deleted`, async () => {
        console.log(`✅ Verifying system deleted: ${systemName}`);
        
        await expect(page.locator('[data-testid="success-message"]')).toContainText('System deleted successfully');
        await expect(page.locator(`[data-testid="system-row-${systemName}"]`)).not.toBeVisible();
    });
}

export async function verifySystemEdited(page: Page, systemName: string) {
    await allure.step(`Verify system ${systemName} is edited`, async () => {
        console.log(`✅ Verifying system edited: ${systemName}`);
        
        await expect(page.locator('[data-testid="success-message"]')).toContainText('System updated successfully');
        await expect(page.locator(`[data-testid="system-row-${systemName}"]`)).toBeVisible();
    });
}

// ========================================
// COMMON OPERATIONS
// ========================================

export async function clearFilters(page: Page) {
    await allure.step('Clear filters', async () => {
        console.log('🧹 Clearing filters');
        
        await page.click('[data-testid="clear-filters-btn"]');
        await page.waitForTimeout(1000);
    });
}

export async function verifyClearFilters(page: Page) {
    await allure.step('Verify filters are cleared', async () => {
        console.log('✅ Verifying filters cleared');
        
        await expect(page.locator('[data-testid="success-message"]')).toContainText('Filter Organization cleared');
    });
}

export async function navigateToSiteManagement(page: Page) {
    await allure.step('Navigate to Site Management', async () => {
        console.log('🧭 Navigating to Site Management');
        
        await page.hover('[data-testid="site-management-menu"]');
        await page.waitForTimeout(500);
        await page.click('[data-testid="my-organization-link"]');
        await page.waitForTimeout(2000);
    });
}

export async function loginToSystem(page: Page, baseUrl: string, username: string, password: string) {
    await allure.step(`Login to system as ${username}`, async () => {
        console.log(`🔐 Logging in to system: ${baseUrl}`);
        
        await page.goto(baseUrl);
        await page.waitForTimeout(2000);
        
        await page.fill('[data-testid="username-input"]', username);
        await page.fill('[data-testid="password-input"]', password);
        await page.click('[data-testid="login-btn"]');
        await page.waitForTimeout(3000);
        
        // Verify login success
        await expect(page.locator('[data-testid="dashboard-header"]')).toBeVisible();
    });
}
