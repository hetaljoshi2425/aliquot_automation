export const CustomersPage = {
  textLocators: {
    customersButton: 'Customers',
    customerList: 'Customer List',
    clearFilters: 'Clear Filters',
    createCustomer: 'Create Customer',
    cloneCustomer: 'Clone Customer',
    filterCustomers: 'Filter Customers',
    filterByLocation: 'Filter by Location',
    customerSearch: 'Search for customers in',
    customerSearchButton: 'Search',
    customerSearchText: 'Search...',
    previous: 'Previous',
    next: 'Next'
  },
  cssLocators: {
    customersButton: 'button[name="Customers"]',
    customerListLink: 'a:has-text("Customer List")',
    clearFiltersButton: 'button:has-text("Clear Filters")',
    createCustomerButton: 'button:has-text("Create Customer")',
    cloneCustomerButton: 'button:has-text("Clone Customer")',
    filterCustomersButton: 'button:has-text("Filter Customers")',
    filterByLocationButton: 'button:has-text("Filter by Location")',
    customerSearchBox: 'input[placeholder*="Search for customers"]',
    customerSearchButton: 'button[type="submit"]',
    customerSearchInput: 'input[placeholder="Search..."]',
    previousButton: 'button:has-text("Previous")',
    nextButton: 'button:has-text("Next")'
  },
  xpathLocators: {
    customersButton: '//button[text()="Customers"]',
    customerListLink: '//a[text()="Customer List"]',
    clearFiltersButton: '//button[text()="Clear Filters"]',
    createCustomerButton: '//button[text()="Create Customer"]',
    cloneCustomerButton: '//button[text()="Clone Customer"]',
    filterCustomersButton: '//button[text()="Filter Customers"]',
    filterByLocationButton: '//button[text()="Filter by Location"]',
    customerSearchBox: '//input[contains(@placeholder, "Search for customers")]',
    customerSearchButton: '//button[@type="submit"]',
    customerSearchInput: '//input[@placeholder="Search..."]',
    previousButton: '//button[text()="Previous"]',
    nextButton: '//button[text()="Next"]',
    customerTable: '//table[contains(@class, "customer")]',
    customerRow: '//tr[contains(@class, "customer-row")]',
    customerName: '//td[contains(@class, "customer-name")]',
    customerStatus: '//td[contains(@class, "customer-status")]',
    customerEditButton: '//button[contains(@class, "edit-button")]',
    customerDeleteButton: '//button[contains(@class, "delete-button")]'
  },
  idLocators: {
    customersButton: 'customers-button',
    customerListLink: 'customer-list-link',
    clearFiltersButton: 'clear-filters-button',
    createCustomerButton: 'create-customer-button',
    cloneCustomerButton: 'clone-customer-button',
    filterCustomersButton: 'filter-customers-button',
    filterByLocationButton: 'filter-by-location-button',
    customerSearchBox: 'customer-search-box',
    customerSearchButton: 'customer-search-button',
    previousButton: 'previous-button',
    nextButton: 'next-button'
  },
  titleLocator: {
    customersPage: 'Customer Management'
  }
};
