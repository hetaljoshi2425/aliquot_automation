/**
 * Customer Page Selectors
 * Uses Playwright's recommended methods: getByRole, getByTestId, getByLabel
 */

import { PageSelectors, SelectorConfig, createSelectorConfig, createSelectorSet } from './types';

export const CustomerSelectors: PageSelectors = {
  pageTitle: createSelectorSet(
    { role: 'heading', name: 'Customer Management' },
    undefined,
    'customer-page-title',
    'Customer Management',
    undefined,
    'Customer Management Page Title'
  ),

  navigation: {
    // No navigation elements on customer page
  },

  forms: {
    customerForm: createSelectorSet(
      { role: 'form', name: 'Customer Form' },
      'Customer Form',
      'customer-form',
      undefined,
      undefined,
      'Customer Form Container'
    ),
    searchForm: createSelectorSet(
      { role: 'search', name: 'Customer Search' },
      'Customer Search Form',
      'customer-search-form',
      undefined,
      undefined,
      'Customer Search Form'
    )
  },

  buttons: {
    customersButton: createSelectorSet(
      { role: 'button', name: 'Customers' },
      'Customers Button',
      'customers-button',
      'Customers',
      undefined,
      'Customers Button'
    ),
    customerListButton: createSelectorSet(
      { role: 'button', name: 'Customer List' },
      'Customer List Button',
      'customer-list-button',
      'Customer List',
      undefined,
      'Customer List Button'
    ),
    clearFiltersButton: createSelectorSet(
      { role: 'button', name: 'Clear Filters' },
      'Clear Filters Button',
      'clear-filters-button',
      'Clear Filters',
      undefined,
      'Clear Filters Button'
    ),
    createCustomerButton: createSelectorSet(
      { role: 'button', name: 'Create Customer' },
      'Create Customer Button',
      'create-customer-button',
      'Create Customer',
      undefined,
      'Create Customer Button'
    ),
    cloneCustomerButton: createSelectorSet(
      { role: 'button', name: 'Clone Customer' },
      'Clone Customer Button',
      'clone-customer-button',
      'Clone Customer',
      undefined,
      'Clone Customer Button'
    ),
    filterCustomersButton: createSelectorSet(
      { role: 'button', name: 'Filter Customers' },
      'Filter Customers Button',
      'filter-customers-button',
      'Filter Customers',
      undefined,
      'Filter Customers Button'
    ),
    filterByLocationButton: createSelectorSet(
      { role: 'button', name: 'Filter by Location' },
      'Filter by Location Button',
      'filter-by-location-button',
      'Filter by Location',
      undefined,
      'Filter by Location Button'
    ),
    searchButton: createSelectorSet(
      { role: 'button', name: 'Search' },
      'Search Button',
      'customer-search-button',
      'Search',
      undefined,
      'Customer Search Button'
    ),
    previousButton: createSelectorSet(
      { role: 'button', name: 'Previous' },
      'Previous Button',
      'previous-button',
      'Previous',
      undefined,
      'Previous Page Button'
    ),
    nextButton: createSelectorSet(
      { role: 'button', name: 'Next' },
      'Next Button',
      'next-button',
      'Next',
      undefined,
      'Next Page Button'
    )
  },

  inputs: {
    customerSearchBox: createSelectorSet(
      { role: 'searchbox', name: 'Search for customers' },
      'Customer Search Box',
      'customer-search-box',
      undefined,
      'Search for customers in',
      'Customer Search Box'
    ),
    customerSearchInput: createSelectorSet(
      { role: 'searchbox', name: 'Search' },
      'Customer Search Input',
      'customer-search-input',
      undefined,
      'Search...',
      'Customer Search Input Field'
    )
  },

  dropdowns: {
    // No dropdowns on customer page by default
  },

  tables: {
    customerTable: createSelectorSet(
      { role: 'table', name: 'Customer List' },
      'Customer Table',
      'customer-table',
      'Customer List',
      undefined,
      'Customer List Table'
    ),
    customerRow: createSelectorSet(
      { role: 'row' },
      'Customer Row',
      'customer-row',
      undefined,
      undefined,
      'Customer Table Row'
    )
  },

  modals: {
    // No modals on customer page by default
  },

  messages: {
    customerCreatedSuccessMessage: createSelectorSet(
      { role: 'status', name: 'Customer created successfully' },
      'Customer Created Success Message',
      'customer-created-success-message',
      'Customer has been created successfully.',
      undefined,
      'Customer Created Success Message'
    ),
    customerUpdatedSuccessMessage: createSelectorSet(
      { role: 'status', name: 'Customer updated successfully' },
      'Customer Updated Success Message',
      'customer-updated-success-message',
      'Customer has been updated successfully.',
      undefined,
      'Customer Updated Success Message'
    ),
    customerDeletedSuccessMessage: createSelectorSet(
      { role: 'status', name: 'Customer deleted successfully' },
      'Customer Deleted Success Message',
      'customer-deleted-success-message',
      'Customer has been deleted successfully.',
      undefined,
      'Customer Deleted Success Message'
    ),
    validationErrorMessage: createSelectorSet(
      { role: 'alert', name: 'Validation error' },
      'Validation Error Message',
      'validation-error-message',
      'This field is required',
      undefined,
      'Validation Error Message'
    )
  },

  loading: {
    customerLoadingSpinner: createSelectorSet(
      { role: 'status', name: 'Loading customers' },
      'Customer Loading Spinner',
      'customer-loading-spinner',
      'Loading customers',
      undefined,
      'Customer Loading Spinner'
    )
  }
};

/**
 * Customer page specific selector configurations
 */
export const CustomerSelectorConfigs = {
  // Critical elements for customer management
  customersButton: createSelectorConfig(
    'Customers button - critical for navigation',
    'getByRole',
    ['getByText', 'getByTestId', 'locator'],
    true,
    10000
  ),
  
  customerListButton: createSelectorConfig(
    'Customer List button - critical for navigation',
    'getByRole',
    ['getByText', 'getByTestId', 'locator'],
    true,
    10000
  ),
  
  createCustomerButton: createSelectorConfig(
    'Create Customer button - critical for customer creation',
    'getByRole',
    ['getByText', 'getByTestId', 'locator'],
    true,
    10000
  ),
  
  // Search functionality
  customerSearchBox: createSelectorConfig(
    'Customer search box - important for searching',
    'getByRole',
    ['getByLabel', 'getByPlaceholder', 'getByTestId', 'locator'],
    false,
    5000
  ),
  
  customerSearchInput: createSelectorConfig(
    'Customer search input - important for searching',
    'getByRole',
    ['getByLabel', 'getByPlaceholder', 'getByTestId', 'locator'],
    false,
    5000
  ),
  
  // Filter functionality
  clearFiltersButton: createSelectorConfig(
    'Clear Filters button - important for filtering',
    'getByRole',
    ['getByText', 'getByTestId', 'locator'],
    false,
    5000
  ),
  
  filterCustomersButton: createSelectorConfig(
    'Filter Customers button - important for filtering',
    'getByRole',
    ['getByText', 'getByTestId', 'locator'],
    false,
    5000
  ),
  
  filterByLocationButton: createSelectorConfig(
    'Filter by Location button - important for filtering',
    'getByRole',
    ['getByText', 'getByTestId', 'locator'],
    false,
    5000
  ),
  
  // Table elements
  customerTable: createSelectorConfig(
    'Customer table - important for displaying customers',
    'getByRole',
    ['getByTestId', 'locator'],
    false,
    5000
  ),
  
  // Pagination
  previousButton: createSelectorConfig(
    'Previous button - important for pagination',
    'getByRole',
    ['getByText', 'getByTestId', 'locator'],
    false,
    5000
  ),
  
  nextButton: createSelectorConfig(
    'Next button - important for pagination',
    'getByRole',
    ['getByText', 'getByTestId', 'locator'],
    false,
    5000
  ),
  
  // Action buttons
  cloneCustomerButton: createSelectorConfig(
    'Clone Customer button - important for cloning',
    'getByRole',
    ['getByText', 'getByTestId', 'locator'],
    false,
    5000
  ),
  
  // Messages
  customerCreatedSuccessMessage: createSelectorConfig(
    'Customer created success message - important for verification',
    'getByRole',
    ['getByText', 'getByTestId', 'locator'],
    false,
    5000
  ),
  
  customerUpdatedSuccessMessage: createSelectorConfig(
    'Customer updated success message - important for verification',
    'getByRole',
    ['getByText', 'getByTestId', 'locator'],
    false,
    5000
  ),
  
  customerDeletedSuccessMessage: createSelectorConfig(
    'Customer deleted success message - important for verification',
    'getByRole',
    ['getByText', 'getByTestId', 'locator'],
    false,
    5000
  ),
  
  validationErrorMessage: createSelectorConfig(
    'Validation error message - important for error handling',
    'getByRole',
    ['getByText', 'getByTestId', 'locator'],
    false,
    5000
  )
} as const;

/**
 * Customer page selector helper functions
 */
export class CustomerSelectorHelpers {
  constructor(private page: any) {}

  /**
   * Get customers button locator with fallbacks (best practice order)
   */
  getCustomersButton() {
    const selectors = [
      this.page.getByRole('button', { name: 'Customers' }),
      this.page.getByText('Customers'),
      this.page.getByTestId(CustomerSelectors.buttons.customersButton.testId!),
      this.page.locator('button:has-text("Customers")')
    ];
    return selectors;
  }

  /**
   * Get customer list button locator with fallbacks (best practice order)
   */
  getCustomerListButton() {
    const selectors = [
      this.page.getByRole('button', { name: 'Customer List' }),
      this.page.getByText('Customer List'),
      this.page.getByTestId(CustomerSelectors.buttons.customerListButton.testId!),
      this.page.locator('button:has-text("Customer List")')
    ];
    return selectors;
  }

  /**
   * Get create customer button locator with fallbacks (best practice order)
   */
  getCreateCustomerButton() {
    const selectors = [
      this.page.getByRole('button', { name: 'Create Customer' }),
      this.page.getByText('Create Customer'),
      this.page.getByTestId(CustomerSelectors.buttons.createCustomerButton.testId!),
      this.page.locator('button:has-text("Create Customer")')
    ];
    return selectors;
  }

  /**
   * Get clone customer button locator with fallbacks
   */
  getCloneCustomerButton() {
    const selectors = [
      this.page.getByTestId(CustomerSelectors.buttons.cloneCustomerButton.testId!),
      this.page.getByRole('button', { name: 'Clone Customer' }),
      this.page.getByText('Clone Customer'),
      this.page.locator('button:has-text("Clone Customer")')
    ];
    return selectors;
  }

  /**
   * Get clear filters button locator with fallbacks
   */
  getClearFiltersButton() {
    const selectors = [
      this.page.getByTestId(CustomerSelectors.buttons.clearFiltersButton.testId!),
      this.page.getByRole('button', { name: 'Clear Filters' }),
      this.page.getByText('Clear Filters'),
      this.page.locator('button:has-text("Clear Filters")')
    ];
    return selectors;
  }

  /**
   * Get filter customers button locator with fallbacks
   */
  getFilterCustomersButton() {
    const selectors = [
      this.page.getByTestId(CustomerSelectors.buttons.filterCustomersButton.testId!),
      this.page.getByRole('button', { name: 'Filter Customers' }),
      this.page.getByText('Filter Customers'),
      this.page.locator('button:has-text("Filter Customers")')
    ];
    return selectors;
  }

  /**
   * Get filter by location button locator with fallbacks
   */
  getFilterByLocationButton() {
    const selectors = [
      this.page.getByTestId(CustomerSelectors.buttons.filterByLocationButton.testId!),
      this.page.getByRole('button', { name: 'Filter by Location' }),
      this.page.getByText('Filter by Location'),
      this.page.locator('button:has-text("Filter by Location")')
    ];
    return selectors;
  }

  /**
   * Get customer search box locator with fallbacks
   */
  getCustomerSearchBox() {
    const selectors = [
      this.page.getByTestId(CustomerSelectors.inputs.customerSearchBox.testId!),
      this.page.getByRole('searchbox', { name: 'Search for customers' }),
      this.page.getByLabel('Customer Search Box'),
      this.page.getByPlaceholder('Search for customers in'),
      this.page.locator('input[placeholder*="Search for customers"]')
    ];
    return selectors;
  }

  /**
   * Get customer search input locator with fallbacks
   */
  getCustomerSearchInput() {
    const selectors = [
      this.page.getByTestId(CustomerSelectors.inputs.customerSearchInput.testId!),
      this.page.getByRole('searchbox', { name: 'Search' }),
      this.page.getByLabel('Customer Search Input'),
      this.page.getByPlaceholder('Search...'),
      this.page.locator('input[placeholder="Search..."]')
    ];
    return selectors;
  }

  /**
   * Get customer table locator with fallbacks
   */
  getCustomerTable() {
    const selectors = [
      this.page.getByTestId(CustomerSelectors.tables.customerTable.testId!),
      this.page.getByRole('table', { name: 'Customer List' }),
      this.page.locator('table'),
      this.page.locator('.customer-table')
    ];
    return selectors;
  }

  /**
   * Get customer row locator with fallbacks
   */
  getCustomerRow() {
    const selectors = [
      this.page.getByTestId(CustomerSelectors.tables.customerRow.testId!),
      this.page.getByRole('row'),
      this.page.locator('tr'),
      this.page.locator('.customer-row')
    ];
    return selectors;
  }

  /**
   * Get previous button locator with fallbacks
   */
  getPreviousButton() {
    const selectors = [
      this.page.getByTestId(CustomerSelectors.buttons.previousButton.testId!),
      this.page.getByRole('button', { name: 'Previous' }),
      this.page.getByText('Previous'),
      this.page.locator('button:has-text("Previous")')
    ];
    return selectors;
  }

  /**
   * Get next button locator with fallbacks
   */
  getNextButton() {
    const selectors = [
      this.page.getByTestId(CustomerSelectors.buttons.nextButton.testId!),
      this.page.getByRole('button', { name: 'Next' }),
      this.page.getByText('Next'),
      this.page.locator('button:has-text("Next")')
    ];
    return selectors;
  }

  /**
   * Get search button locator with fallbacks
   */
  getSearchButton() {
    const selectors = [
      this.page.getByTestId(CustomerSelectors.buttons.searchButton.testId!),
      this.page.getByRole('button', { name: 'Search' }),
      this.page.getByText('Search'),
      this.page.locator('button:has-text("Search")')
    ];
    return selectors;
  }

  /**
   * Get customer created success message locator with fallbacks
   */
  getCustomerCreatedSuccessMessage() {
    const selectors = [
      this.page.getByTestId(CustomerSelectors.messages.customerCreatedSuccessMessage.testId!),
      this.page.getByRole('status', { name: 'Customer created successfully' }),
      this.page.getByText('Customer has been created successfully.'),
      this.page.locator('text="Customer has been created successfully."')
    ];
    return selectors;
  }

  /**
   * Get customer updated success message locator with fallbacks
   */
  getCustomerUpdatedSuccessMessage() {
    const selectors = [
      this.page.getByTestId(CustomerSelectors.messages.customerUpdatedSuccessMessage.testId!),
      this.page.getByRole('status', { name: 'Customer updated successfully' }),
      this.page.getByText('Customer has been updated successfully.'),
      this.page.locator('text="Customer has been updated successfully."')
    ];
    return selectors;
  }

  /**
   * Get customer deleted success message locator with fallbacks
   */
  getCustomerDeletedSuccessMessage() {
    const selectors = [
      this.page.getByTestId(CustomerSelectors.messages.customerDeletedSuccessMessage.testId!),
      this.page.getByRole('status', { name: 'Customer deleted successfully' }),
      this.page.getByText('Customer has been deleted successfully.'),
      this.page.locator('text="Customer has been deleted successfully."')
    ];
    return selectors;
  }

  /**
   * Get validation error message locator with fallbacks
   */
  getValidationErrorMessage() {
    const selectors = [
      this.page.getByTestId(CustomerSelectors.messages.validationErrorMessage.testId!),
      this.page.getByRole('alert'),
      this.page.getByText('This field is required'),
      this.page.locator('.error-message'),
      this.page.locator('.alert-error')
    ];
    return selectors;
  }
}
