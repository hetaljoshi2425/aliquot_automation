/**
 * Home Page Selectors
 * Uses Playwright's recommended methods: getByRole, getByTestId, getByLabel
 */

import { PageSelectors, SelectorConfig, createSelectorConfig, createSelectorSet } from './types';

export const HomeSelectors: PageSelectors = {
  pageTitle: createSelectorSet(
    { role: 'heading', name: 'Dashboard' },
    undefined,
    'home-page-title',
    'Dashboard',
    undefined,
    'Home Page Title'
  ),

  navigation: {
    dashboardTab: createSelectorSet(
      { role: 'tab', name: 'Dashboard' },
      'Dashboard Tab',
      'dashboard-tab',
      'Dashboard',
      undefined,
      'Dashboard Navigation Tab'
    ),
    myDashboardsMenu: createSelectorSet(
      { role: 'menu', name: 'My Dashboards' },
      'My Dashboards Menu',
      'my-dashboards-menu',
      'My Dashboards',
      undefined,
      'My Dashboards Dropdown Menu'
    ),
    trendsChartingLink: createSelectorSet(
      { role: 'link', name: 'Trends Charting' },
      'Trends Charting Link',
      'trends-charting-link',
      'Trends Charting',
      undefined,
      'Trends Charting Navigation Link'
    ),
    utilitiesTab: createSelectorSet(
      { role: 'tab', name: 'Utilities' },
      'Utilities Tab',
      'utilities-tab',
      'Utilities',
      undefined,
      'Utilities Navigation Tab'
    ),
    siteManagementMenu: createSelectorSet(
      { role: 'menu', name: 'Site Management' },
      'Site Management Menu',
      'site-management-menu',
      'Site Management',
      undefined,
      'Site Management Menu'
    )
  },

  forms: {
    searchForm: createSelectorSet(
      { role: 'search' },
      'Search Form',
      'search-form',
      undefined,
      undefined,
      'Search Form'
    )
  },

  buttons: {
    manageTypesButton: createSelectorSet(
      { role: 'button', name: 'Manage Types' },
      'Manage Types Button',
      'manage-types-button',
      'Manage Types',
      undefined,
      'Manage Types Button'
    ),
    clearFiltersButton: createSelectorSet(
      { role: 'button', name: 'Clear Filters' },
      'Clear Filters Button',
      'clear-filters-button',
      'Clear Filters',
      undefined,
      'Clear Filters Button'
    ),
    manageBuildingsButton: createSelectorSet(
      { role: 'button', name: 'Manage Buildings' },
      'Manage Buildings Button',
      'manage-buildings-button',
      'Manage Buildings',
      undefined,
      'Manage Buildings Button'
    ),
    selectCustomerButton: createSelectorSet(
      { role: 'button', name: 'Select Customer' },
      'Select Customer Button',
      'select-customer-button',
      'Select Customer',
      undefined,
      'Select Customer Button'
    ),
    selectFacilityButton: createSelectorSet(
      { role: 'button', name: 'Select Facility' },
      'Select Facility Button',
      'select-facility-button',
      'Select Facility',
      undefined,
      'Select Facility Button'
    ),
    selectBuildingButton: createSelectorSet(
      { role: 'button', name: 'Select Building' },
      'Select Building Button',
      'select-building-button',
      'Select Building',
      undefined,
      'Select Building Button'
    ),
    showAllTab: createSelectorSet(
      { role: 'tab', name: 'Show All' },
      'Show All Tab',
      'show-all-tab',
      'Show All',
      undefined,
      'Show All Tab'
    ),
    userManagementTab: createSelectorSet(
      { role: 'tab', name: 'User Management' },
      'User Management Tab',
      'user-management-tab',
      'User Management',
      undefined,
      'User Management Tab'
    )
  },

  inputs: {
    searchInput: createSelectorSet(
      { role: 'searchbox', name: 'Search for test types' },
      'Search Input',
      'search-input',
      undefined,
      'Search for test types...',
      'Main Search Input'
    ),
    clientSearchInput: createSelectorSet(
      { role: 'searchbox', name: 'Search for clients' },
      'Client Search Input',
      'client-search-input',
      undefined,
      'Search for clients',
      'Client Search Input'
    ),
    customerSearchInput: createSelectorSet(
      { role: 'searchbox', name: 'Search for customers' },
      'Customer Search Input',
      'customer-search-input',
      undefined,
      'Search for customers',
      'Customer Search Input'
    ),
    facilitySearchInput: createSelectorSet(
      { role: 'searchbox', name: 'Search for facilities' },
      'Facility Search Input',
      'facility-search-input',
      undefined,
      'Search for facilities',
      'Facility Search Input'
    ),
    buildingSearchInput: createSelectorSet(
      { role: 'searchbox', name: 'Search for buildings' },
      'Building Search Input',
      'building-search-input',
      undefined,
      'Search for buildings',
      'Building Search Input'
    )
  },

  dropdowns: {
    clientDropdown: createSelectorSet(
      { role: 'combobox', name: 'Select Client' },
      'Client Dropdown',
      'client-dropdown',
      undefined,
      undefined,
      'Client Selection Dropdown'
    ),
    customerDropdown: createSelectorSet(
      { role: 'combobox', name: 'Select Customer' },
      'Customer Dropdown',
      'customer-dropdown',
      undefined,
      undefined,
      'Customer Selection Dropdown'
    ),
    facilityDropdown: createSelectorSet(
      { role: 'combobox', name: 'Select Facility' },
      'Facility Dropdown',
      'facility-dropdown',
      undefined,
      undefined,
      'Facility Selection Dropdown'
    ),
    buildingDropdown: createSelectorSet(
      { role: 'combobox', name: 'Select Building' },
      'Building Dropdown',
      'building-dropdown',
      undefined,
      undefined,
      'Building Selection Dropdown'
    ),
    systemDropdown: createSelectorSet(
      { role: 'combobox', name: 'Select System' },
      'System Dropdown',
      'system-dropdown',
      undefined,
      undefined,
      'System Selection Dropdown'
    )
  },

  tables: {
    testTypesList: createSelectorSet(
      { role: 'list', name: 'Test Types' },
      'Test Types List',
      'test-types-list',
      'Test Types',
      undefined,
      'Test Types List'
    ),
    clientList: createSelectorSet(
      { role: 'table', name: 'Client List' },
      'Client List Table',
      'client-list',
      'Client List',
      undefined,
      'Client List Table'
    ),
    customerList: createSelectorSet(
      { role: 'table', name: 'Customer List' },
      'Customer List Table',
      'customer-list',
      'Customer List',
      undefined,
      'Customer List Table'
    )
  },

  modals: {
    // No modals on home page by default
  },

  messages: {
    clientNameDisplay: createSelectorSet(
      { role: 'status', name: 'Current Client' },
      'Client Name Display',
      'client-name-display',
      undefined,
      undefined,
      'Displayed Client Name'
    ),
    successMessage: createSelectorSet(
      { role: 'status', name: 'Success' },
      'Success Message',
      'success-message',
      'Success',
      undefined,
      'Success Message Display'
    ),
    errorMessage: createSelectorSet(
      { role: 'alert', name: 'Error' },
      'Error Message',
      'error-message',
      'Error',
      undefined,
      'Error Message Display'
    )
  },

  loading: {
    pageLoadingSpinner: createSelectorSet(
      { role: 'status', name: 'Loading' },
      'Page Loading Spinner',
      'page-loading-spinner',
      'Loading',
      undefined,
      'Page Loading Spinner'
    )
  }
};

/**
 * Home page specific selector configurations
 */
export const HomeSelectorConfigs = {
  // Critical navigation elements
  dashboardTab: createSelectorConfig(
    'Dashboard tab - critical for navigation',
    'getByRole',
    ['getByText', 'getByTestId', 'locator'],
    true,
    10000
  ),
  
  trendsChartingLink: createSelectorConfig(
    'Trends Charting link - critical for navigation',
    'getByRole',
    ['getByText', 'getByTestId', 'locator'],
    true,
    10000
  ),
  
  // Search functionality
  searchInput: createSelectorConfig(
    'Search input field - critical for search functionality',
    'getByRole',
    ['getByLabel', 'getByPlaceholder', 'getByTestId', 'locator'],
    true,
    10000
  ),
  
  // Client management
  clientNameDisplay: createSelectorConfig(
    'Client name display - important for verification',
    'getByRole',
    ['getByTestId', 'locator'],
    false,
    5000
  ),
  
  // Buttons
  manageTypesButton: createSelectorConfig(
    'Manage Types button',
    'getByRole',
    ['getByText', 'getByTestId', 'locator'],
    false,
    5000
  ),
  
  clearFiltersButton: createSelectorConfig(
    'Clear Filters button',
    'getByRole',
    ['getByText', 'getByTestId', 'locator'],
    false,
    5000
  )
} as const;

/**
 * Home page selector helper functions
 */
export class HomeSelectorHelpers {
  constructor(private page: any) {}

  /**
   * Get dashboard tab locator with fallbacks (best practice order)
   */
  getDashboardTab() {
    const selectors = [
      this.page.getByRole('tab', { name: 'Dashboard' }),
      this.page.getByText('Dashboard'),
      this.page.getByTestId(HomeSelectors.navigation.dashboardTab.testId!),
      this.page.locator('nav span:has-text("Dashboard")')
    ];
    return selectors;
  }

  /**
   * Get trends charting link locator with fallbacks (best practice order)
   */
  getTrendsChartingLink() {
    const selectors = [
      this.page.getByRole('link', { name: 'Trends Charting' }),
      this.page.getByText('Trends Charting'),
      this.page.getByTestId(HomeSelectors.navigation.trendsChartingLink.testId!),
      this.page.locator('a:has-text("Trends Charting")')
    ];
    return selectors;
  }

  /**
   * Get search input locator with fallbacks (best practice order)
   */
  getSearchInput() {
    const selectors = [
      this.page.getByRole('searchbox', { name: 'Search for test types' }),
      this.page.getByLabel('Search Input'),
      this.page.getByPlaceholder('Search for test types...'),
      this.page.getByTestId(HomeSelectors.inputs.searchInput.testId!),
      this.page.locator('input[placeholder*="Search for test types"]')
    ];
    return selectors;
  }

  /**
   * Get client name display locator with fallbacks (best practice order)
   */
  getClientNameDisplay(clientName?: string) {
    const baseSelectors = [
      this.page.getByRole('status', { name: 'Current Client' }),
      this.page.getByTestId(HomeSelectors.messages.clientNameDisplay.testId!),
      this.page.locator('.client-name')
    ];
    
    if (clientName) {
      return [
        ...baseSelectors,
        this.page.getByText(clientName),
        this.page.locator(`.client-name:has-text("${clientName}")`)
      ];
    }
    
    return baseSelectors;
  }

  /**
   * Get manage types button locator with fallbacks (best practice order)
   */
  getManageTypesButton() {
    const selectors = [
      this.page.getByRole('button', { name: 'Manage Types' }),
      this.page.getByText('Manage Types'),
      this.page.getByTestId(HomeSelectors.buttons.manageTypesButton.testId!),
      this.page.locator('button:has-text("Manage Types")')
    ];
    return selectors;
  }

  /**
   * Get clear filters button locator with fallbacks (best practice order)
   */
  getClearFiltersButton() {
    const selectors = [
      this.page.getByRole('button', { name: 'Clear Filters' }),
      this.page.getByText('Clear Filters'),
      this.page.getByTestId(HomeSelectors.buttons.clearFiltersButton.testId!),
      this.page.locator('button:has-text("Clear Filters")')
    ];
    return selectors;
  }

  /**
   * Get my dashboards menu locator with fallbacks (best practice order)
   */
  getMyDashboardsMenu() {
    const selectors = [
      this.page.getByRole('menu', { name: 'My Dashboards' }),
      this.page.getByText('My Dashboards'),
      this.page.getByTestId(HomeSelectors.navigation.myDashboardsMenu.testId!),
      this.page.locator('div:has-text("My Dashboards")')
    ];
    return selectors;
  }
}