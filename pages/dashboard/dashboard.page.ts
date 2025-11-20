export const DashboardPage = {
  // Role-based selectors for navigation buttons
  roleSelectors: {
    dashboardButton: 'getByRole("button", { name: /Dashboard/i })',
    reportsButton: 'getByRole("button", { name: /Reports/i })',
    inventoryButton: 'getByRole("button", { name: /Inventory/i })',
    customersButton: 'getByRole("button", { name: /Customers/i })',
    siteManagementButton: 'getByRole("button", { name: /SiteManagement/i })',
    utilitiesButton: 'getByRole("button", { name: /Utilities/i })',
    newReportButton: 'getByRole("button", { name: /New Report/i })',
  },
  
  // Text-based selectors for dashboard content
  textSelectors: {
    // Navigation elements
    dashboardText: 'Dashboard',
    reportsText: 'Reports',
    inventoryText: 'Inventory',
    customersText: 'Customers',
    siteManagementText: 'SiteManagement',
    utilitiesText: 'Utilities',
    newReportText: 'New Report',
    
    // Dashboard content
    welcomeMessage: 'Welcome back Hetal, below is a quick snapshot of your day.',
    finalReports: 'Final Reports',
    draftReports: 'Draft Reports',
    pastDueReports: 'Past Due Reports',
    reportBreakdown: 'Report Breakdownfor the past 6 months.',
    draftsLabel: 'Drafts',
    finalLabel: 'Final',
    
    // Month labels
    april: 'April',
    may: 'May',
    june: 'June',
    july: 'July',
    august: 'August',
    september: 'September',
  },
  
  // Legacy selectors for backward compatibility
  textLocators: {
    customerTab: 'Customer',
    searchBox: 'Search for accounts...',
  },
  cssLocators: {
    searchInput: 'input[placeholder*="Search for accounts"]',
  },
  xpathLocators: {
    customerTab: '//span[text()="Customer"]',
  },
  idLocators: {

  },
  titleLocator: {

  },
};
