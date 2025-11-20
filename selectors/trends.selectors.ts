/**
 * Trends Charting Page Selectors
 * Uses Playwright's recommended methods: getByRole, getByTestId, getByLabel
 */

import { PageSelectors, SelectorConfig, createSelectorConfig, createSelectorSet } from './types';

export const TrendsSelectors: PageSelectors = {
  pageTitle: createSelectorSet(
    { role: 'heading', name: 'Trends Charting' },
    undefined,
    'trends-page-title',
    'Trends Charting',
    undefined,
    'Trends Charting Page Title'
  ),

  navigation: {
    // No navigation elements on trends page
  },

  forms: {
    filterForm: createSelectorSet(
      { role: 'form', name: 'Filter Form' },
      'Filter Form',
      'filter-form',
      undefined,
      undefined,
      'Filter Form Container'
    ),
    templateForm: createSelectorSet(
      { role: 'form', name: 'Template Form' },
      'Template Form',
      'template-form',
      undefined,
      undefined,
      'Template Form Container'
    )
  },

  buttons: {
    manageTemplateButton: createSelectorSet(
      { role: 'button', name: 'Manage Template' },
      'Manage Template Button',
      'manage-template-button',
      'Manage Template',
      undefined,
      'Manage Template Button'
    ),
    saveAsTemplateButton: createSelectorSet(
      { role: 'button', name: 'Save as Template' },
      'Save as Template Button',
      'save-as-template-button',
      'Save as Template',
      undefined,
      'Save as Template Button'
    ),
    generateGraphButton: createSelectorSet(
      { role: 'button', name: 'Generate Graph' },
      'Generate Graph Button',
      'generate-graph-button',
      'Generate Graph',
      undefined,
      'Generate Graph Button'
    ),
    clearFiltersButton: createSelectorSet(
      { role: 'button', name: 'Clear Filters' },
      'Clear Filters Button',
      'clear-filters-button',
      'Clear Filters',
      undefined,
      'Clear Filters Button'
    )
  },

  inputs: {
    filterCustomerInput: createSelectorSet(
      { role: 'searchbox', name: 'Filter Customer' },
      'Filter Customer Input',
      'filter-customer-input',
      undefined,
      'Filter Customer',
      'Filter Customer Input Field'
    ),
    templateNameInput: createSelectorSet(
      { role: 'textbox', name: 'Template Name' },
      'Template Name Input',
      'template-name-input',
      undefined,
      'Enter template name',
      'Template Name Input Field'
    ),
    dateFromInput: createSelectorSet(
      { role: 'textbox', name: 'Date From' },
      'Date From Input',
      'date-from-input',
      undefined,
      'Select start date',
      'Date From Input Field'
    ),
    dateToInput: createSelectorSet(
      { role: 'textbox', name: 'Date To' },
      'Date To Input',
      'date-to-input',
      undefined,
      'Select end date',
      'Date To Input Field'
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
    ),
    sourceDropdown: createSelectorSet(
      { role: 'combobox', name: 'Select Data Source' },
      'Source Dropdown',
      'source-dropdown',
      undefined,
      undefined,
      'Data Source Selection Dropdown'
    ),
    componentDropdown: createSelectorSet(
      { role: 'combobox', name: 'Select Component' },
      'Component Dropdown',
      'component-dropdown',
      undefined,
      undefined,
      'Component Selection Dropdown'
    ),
    testDropdown: createSelectorSet(
      { role: 'combobox', name: 'Select Test' },
      'Test Dropdown',
      'test-dropdown',
      undefined,
      undefined,
      'Test Selection Dropdown'
    ),
    templateDropdown: createSelectorSet(
      { role: 'combobox', name: 'Select Template' },
      'Template Dropdown',
      'template-dropdown',
      undefined,
      undefined,
      'Template Selection Dropdown'
    )
  },

  tables: {
    // No tables on trends page
  },

  modals: {
    templateModal: createSelectorSet(
      { role: 'dialog', name: 'Template Management' },
      'Template Modal',
      'template-modal',
      undefined,
      undefined,
      'Template Management Modal'
    )
  },

  messages: {
    templateSuccessMessage: createSelectorSet(
      { role: 'status', name: 'Template added successfully' },
      'Template Success Message',
      'template-success-message',
      'Template added successfully',
      undefined,
      'Template Success Message'
    ),
    templateErrorMessage: createSelectorSet(
      { role: 'alert', name: 'Template error' },
      'Template Error Message',
      'template-error-message',
      'Failed to save template',
      undefined,
      'Template Error Message'
    ),
    graphErrorMessage: createSelectorSet(
      { role: 'alert', name: 'Graph error' },
      'Graph Error Message',
      'graph-error-message',
      'Failed to generate graph',
      undefined,
      'Graph Error Message'
    )
  },

  loading: {
    graphLoadingSpinner: createSelectorSet(
      { role: 'status', name: 'Generating graph' },
      'Graph Loading Spinner',
      'graph-loading-spinner',
      'Generating graph',
      undefined,
      'Graph Loading Spinner'
    ),
    templateLoadingSpinner: createSelectorSet(
      { role: 'status', name: 'Saving template' },
      'Template Loading Spinner',
      'template-loading-spinner',
      'Saving template',
      undefined,
      'Template Loading Spinner'
    )
  }
};

/**
 * Trends page specific selector configurations
 */
export const TrendsSelectorConfigs = {
  // Critical elements for trends functionality
  filterCustomerInput: createSelectorConfig(
    'Filter Customer input - critical for filtering',
    'getByRole',
    ['getByLabel', 'getByPlaceholder', 'getByTestId', 'locator'],
    true,
    10000
  ),
  
  generateGraphButton: createSelectorConfig(
    'Generate Graph button - critical for graph generation',
    'getByRole',
    ['getByText', 'getByTestId', 'locator'],
    true,
    10000
  ),
  
  saveAsTemplateButton: createSelectorConfig(
    'Save as Template button - critical for template functionality',
    'getByRole',
    ['getByText', 'getByTestId', 'locator'],
    true,
    10000
  ),
  
  // Filter dropdowns
  clientDropdown: createSelectorConfig(
    'Client dropdown - important for filtering',
    'getByRole',
    ['getByLabel', 'getByTestId', 'locator'],
    false,
    5000
  ),
  
  customerDropdown: createSelectorConfig(
    'Customer dropdown - important for filtering',
    'getByRole',
    ['getByLabel', 'getByTestId', 'locator'],
    false,
    5000
  ),
  
  facilityDropdown: createSelectorConfig(
    'Facility dropdown - important for filtering',
    'getByRole',
    ['getByLabel', 'getByTestId', 'locator'],
    false,
    5000
  ),
  
  buildingDropdown: createSelectorConfig(
    'Building dropdown - important for filtering',
    'getByRole',
    ['getByLabel', 'getByTestId', 'locator'],
    false,
    5000
  ),
  
  systemDropdown: createSelectorConfig(
    'System dropdown - important for filtering',
    'getByRole',
    ['getByLabel', 'getByTestId', 'locator'],
    false,
    5000
  ),
  
  // Data source dropdowns
  sourceDropdown: createSelectorConfig(
    'Source dropdown - important for data selection',
    'getByRole',
    ['getByLabel', 'getByTestId', 'locator'],
    false,
    5000
  ),
  
  componentDropdown: createSelectorConfig(
    'Component dropdown - important for data selection',
    'getByRole',
    ['getByLabel', 'getByTestId', 'locator'],
    false,
    5000
  ),
  
  testDropdown: createSelectorConfig(
    'Test dropdown - important for data selection',
    'getByRole',
    ['getByLabel', 'getByTestId', 'locator'],
    false,
    5000
  ),
  
  // Template functionality
  templateDropdown: createSelectorConfig(
    'Template dropdown - important for template management',
    'getByRole',
    ['getByLabel', 'getByTestId', 'locator'],
    false,
    5000
  ),
  
  templateNameInput: createSelectorConfig(
    'Template name input - important for template creation',
    'getByRole',
    ['getByLabel', 'getByPlaceholder', 'getByTestId', 'locator'],
    false,
    5000
  ),
  
  // Graph elements
  trendsGraphCanvas: createSelectorConfig(
    'Trends graph canvas - important for graph display',
    'getByTestId',
    ['locator'],
    false,
    10000
  ),
  
  // Messages
  templateSuccessMessage: createSelectorConfig(
    'Template success message - important for verification',
    'getByRole',
    ['getByText', 'getByTestId', 'locator'],
    false,
    5000
  ),
  
  templateErrorMessage: createSelectorConfig(
    'Template error message - important for error handling',
    'getByRole',
    ['getByText', 'getByTestId', 'locator'],
    false,
    5000
  )
} as const;

/**
 * Trends page selector helper functions
 */
export class TrendsSelectorHelpers {
  constructor(private page: any) {}

  /**
   * Get filter customer input locator with fallbacks (best practice order)
   */
  getFilterCustomerInput() {
    const selectors = [
      this.page.getByRole('searchbox', { name: 'Filter Customer' }),
      this.page.getByLabel('Filter Customer Input'),
      this.page.getByPlaceholder('Filter Customer'),
      this.page.getByTestId(TrendsSelectors.inputs.filterCustomerInput.testId!),
      this.page.locator('input[placeholder*="Filter Customer"]')
    ];
    return selectors;
  }

  /**
   * Get generate graph button locator with fallbacks (best practice order)
   */
  getGenerateGraphButton() {
    const selectors = [
      this.page.getByRole('button', { name: 'Generate Graph' }),
      this.page.getByText('Generate Graph'),
      this.page.getByTestId(TrendsSelectors.buttons.generateGraphButton.testId!),
      this.page.locator('button:has-text("Generate Graph")')
    ];
    return selectors;
  }

  /**
   * Get save as template button locator with fallbacks (best practice order)
   */
  getSaveAsTemplateButton() {
    const selectors = [
      this.page.getByRole('button', { name: 'Save as Template' }),
      this.page.getByText('Save as Template'),
      this.page.getByTestId(TrendsSelectors.buttons.saveAsTemplateButton.testId!),
      this.page.locator('button:has-text("Save as Template")')
    ];
    return selectors;
  }

  /**
   * Get manage template button locator with fallbacks (best practice order)
   */
  getManageTemplateButton() {
    const selectors = [
      this.page.getByRole('button', { name: 'Manage Template' }),
      this.page.getByText('Manage Template'),
      this.page.getByTestId(TrendsSelectors.buttons.manageTemplateButton.testId!),
      this.page.locator('button:has-text("Manage Template")')
    ];
    return selectors;
  }

  /**
   * Get client dropdown locator with fallbacks (best practice order)
   */
  getClientDropdown() {
    const selectors = [
      this.page.getByRole('combobox', { name: 'Select Client' }),
      this.page.getByLabel('Client Dropdown'),
      this.page.getByTestId(TrendsSelectors.dropdowns.clientDropdown.testId!),
      this.page.locator('select[name="client"]'),
      this.page.locator('[data-testid="client-dropdown"]')
    ];
    return selectors;
  }

  /**
   * Get customer dropdown locator with fallbacks (best practice order)
   */
  getCustomerDropdown() {
    const selectors = [
      this.page.getByRole('combobox', { name: 'Select Customer' }),
      this.page.getByLabel('Customer Dropdown'),
      this.page.getByTestId(TrendsSelectors.dropdowns.customerDropdown.testId!),
      this.page.locator('select[name="customer"]'),
      this.page.locator('[data-testid="customer-dropdown"]')
    ];
    return selectors;
  }

  /**
   * Get facility dropdown locator with fallbacks (best practice order)
   */
  getFacilityDropdown() {
    const selectors = [
      this.page.getByRole('combobox', { name: 'Select Facility' }),
      this.page.getByLabel('Facility Dropdown'),
      this.page.getByTestId(TrendsSelectors.dropdowns.facilityDropdown.testId!),
      this.page.locator('select[name="facility"]'),
      this.page.locator('[data-testid="facility-dropdown"]')
    ];
    return selectors;
  }

  /**
   * Get building dropdown locator with fallbacks (best practice order)
   */
  getBuildingDropdown() {
    const selectors = [
      this.page.getByRole('combobox', { name: 'Select Building' }),
      this.page.getByLabel('Building Dropdown'),
      this.page.getByTestId(TrendsSelectors.dropdowns.buildingDropdown.testId!),
      this.page.locator('select[name="building"]'),
      this.page.locator('[data-testid="building-dropdown"]')
    ];
    return selectors;
  }

  /**
   * Get system dropdown locator with fallbacks (best practice order)
   */
  getSystemDropdown() {
    const selectors = [
      this.page.getByRole('combobox', { name: 'Select System' }),
      this.page.getByLabel('System Dropdown'),
      this.page.getByTestId(TrendsSelectors.dropdowns.systemDropdown.testId!),
      this.page.locator('select[name="system"]'),
      this.page.locator('[data-testid="system-dropdown"]')
    ];
    return selectors;
  }

  /**
   * Get source dropdown locator with fallbacks (best practice order)
   */
  getSourceDropdown() {
    const selectors = [
      this.page.getByRole('combobox', { name: 'Select Data Source' }),
      this.page.getByLabel('Source Dropdown'),
      this.page.getByTestId(TrendsSelectors.dropdowns.sourceDropdown.testId!),
      this.page.locator('select[name="source"]'),
      this.page.locator('[data-testid="source-dropdown"]')
    ];
    return selectors;
  }

  /**
   * Get component dropdown locator with fallbacks (best practice order)
   */
  getComponentDropdown() {
    const selectors = [
      this.page.getByRole('combobox', { name: 'Select Component' }),
      this.page.getByLabel('Component Dropdown'),
      this.page.getByTestId(TrendsSelectors.dropdowns.componentDropdown.testId!),
      this.page.locator('select[name="component"]'),
      this.page.locator('[data-testid="component-dropdown"]')
    ];
    return selectors;
  }

  /**
   * Get test dropdown locator with fallbacks (best practice order)
   */
  getTestDropdown() {
    const selectors = [
      this.page.getByRole('combobox', { name: 'Select Test' }),
      this.page.getByLabel('Test Dropdown'),
      this.page.getByTestId(TrendsSelectors.dropdowns.testDropdown.testId!),
      this.page.locator('select[name="test"]'),
      this.page.locator('[data-testid="test-dropdown"]')
    ];
    return selectors;
  }

  /**
   * Get template dropdown locator with fallbacks (best practice order)
   */
  getTemplateDropdown() {
    const selectors = [
      this.page.getByRole('combobox', { name: 'Select Template' }),
      this.page.getByLabel('Template Dropdown'),
      this.page.getByTestId(TrendsSelectors.dropdowns.templateDropdown.testId!),
      this.page.locator('select[name="template"]'),
      this.page.locator('[data-testid="template-dropdown"]')
    ];
    return selectors;
  }

  /**
   * Get template name input locator with fallbacks (best practice order)
   */
  getTemplateNameInput() {
    const selectors = [
      this.page.getByRole('textbox', { name: 'Template Name' }),
      this.page.getByLabel('Template Name Input'),
      this.page.getByPlaceholder('Enter template name'),
      this.page.getByTestId(TrendsSelectors.inputs.templateNameInput.testId!),
      this.page.locator('input[name="templateName"]'),
      this.page.locator('[data-testid="template-name-input"]')
    ];
    return selectors;
  }

  /**
   * Get trends graph canvas locator with fallbacks (best practice order)
   */
  getTrendsGraphCanvas() {
    const selectors = [
      this.page.getByTestId('trends-graph'),
      this.page.locator('canvas'),
      this.page.locator('svg'),
      this.page.locator('[data-testid="trends-graph"]')
    ];
    return selectors;
  }

  /**
   * Get template success message locator with fallbacks (best practice order)
   */
  getTemplateSuccessMessage() {
    const selectors = [
      this.page.getByRole('status', { name: 'Template added successfully' }),
      this.page.getByText('Template added successfully'),
      this.page.getByTestId(TrendsSelectors.messages.templateSuccessMessage.testId!),
      this.page.locator('text="Template added successfully"')
    ];
    return selectors;
  }

  /**
   * Get template error message locator with fallbacks (best practice order)
   */
  getTemplateErrorMessage() {
    const selectors = [
      this.page.getByRole('alert'),
      this.page.getByText('Failed to save template'),
      this.page.getByTestId(TrendsSelectors.messages.templateErrorMessage.testId!),
      this.page.locator('.error-message'),
      this.page.locator('.alert-error')
    ];
    return selectors;
  }

  /**
   * Get series and settings text locator with fallbacks
   */
  getSeriesAndSettingsText() {
    const selectors = [
      this.page.getByText('Series and Settings'),
      this.page.locator('text=Series and Settings')
    ];
    return selectors;
  }

  /**
   * Get last 30 days text locator with fallbacks
   */
  getLast30DaysText() {
    const selectors = [
      this.page.getByText('last 30 days'),
      this.page.locator('text=last 30 days')
    ];
    return selectors;
  }
}
