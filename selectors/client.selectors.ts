/**
 * Client Page Selectors
 * Uses Playwright's recommended methods: getByRole, getByTestId, getByLabel
 */

import { PageSelectors, SelectorConfig, createSelectorConfig, createSelectorSet } from './types';

export const ClientSelectors: PageSelectors = {
  pageTitle: createSelectorSet(
    { role: 'heading', name: 'Client Management' },
    undefined,
    'client-page-title',
    'Client Management',
    undefined,
    'Client Management Page Title'
  ),

  navigation: {
    // No navigation elements on client page
  },

  forms: {
    clientForm: createSelectorSet(
      { role: 'form', name: 'Client Form' },
      'Client Form',
      'client-form',
      undefined,
      undefined,
      'Client Form Container'
    ),
    searchForm: createSelectorSet(
      { role: 'search', name: 'Client Search' },
      'Client Search Form',
      'client-search-form',
      undefined,
      undefined,
      'Client Search Form'
    )
  },

  buttons: {
    createClientButton: createSelectorSet(
      { role: 'button', name: 'Create Client' },
      'Create Client Button',
      'create-client-button',
      'Create Client',
      undefined,
      'Create Client Button'
    ),
    saveClientButton: createSelectorSet(
      { role: 'button', name: 'Save Client' },
      'Save Client Button',
      'save-client-button',
      'Save Client',
      undefined,
      'Save Client Button'
    ),
    updateClientButton: createSelectorSet(
      { role: 'button', name: 'Update Client' },
      'Update Client Button',
      'update-client-button',
      'Update Client',
      undefined,
      'Update Client Button'
    ),
    editClientButton: createSelectorSet(
      { role: 'button', name: 'Edit Client' },
      'Edit Client Button',
      'edit-client-button',
      'Edit Client',
      undefined,
      'Edit Client Button'
    ),
    deleteClientButton: createSelectorSet(
      { role: 'button', name: 'Delete Client' },
      'Delete Client Button',
      'delete-client-button',
      'Delete Client',
      undefined,
      'Delete Client Button'
    ),
    searchButton: createSelectorSet(
      { role: 'button', name: 'Search' },
      'Search Button',
      'client-search-button',
      'Search',
      undefined,
      'Client Search Button'
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
    clientNameInput: createSelectorSet(
      { role: 'textbox', name: 'Client Name' },
      'Client Name Input',
      'client-name-input',
      undefined,
      'Enter client name',
      'Client Name Input Field'
    ),
    addressInput: createSelectorSet(
      { role: 'textbox', name: 'Address' },
      'Address Input',
      'address-input',
      undefined,
      'Enter address',
      'Address Input Field'
    ),
    phoneInput: createSelectorSet(
      { role: 'textbox', name: 'Phone Number' },
      'Phone Input',
      'phone-input',
      undefined,
      'Enter phone number',
      'Phone Number Input Field'
    ),
    emailInput: createSelectorSet(
      { role: 'textbox', name: 'Email' },
      'Email Input',
      'email-input',
      undefined,
      'Enter email address',
      'Email Input Field'
    ),
    maxDraftsInput: createSelectorSet(
      { role: 'spinbutton', name: 'Max Drafts' },
      'Max Drafts Input',
      'max-drafts-input',
      undefined,
      'Enter max drafts',
      'Max Drafts Input Field'
    ),
    legalStatementInput: createSelectorSet(
      { role: 'textbox', name: 'Legal Statement' },
      'Legal Statement Input',
      'legal-statement-input',
      undefined,
      'Enter legal statement',
      'Legal Statement Input Field'
    ),
    clientSearchInput: createSelectorSet(
      { role: 'searchbox', name: 'Search Clients' },
      'Client Search Input',
      'client-search-input',
      undefined,
      'Search for clients',
      'Client Search Input Field'
    )
  },

  dropdowns: {
    timezoneDropdown: createSelectorSet(
      { role: 'combobox', name: 'Select Timezone' },
      'Timezone Dropdown',
      'timezone-dropdown',
      undefined,
      undefined,
      'Timezone Selection Dropdown'
    )
  },

  tables: {
    clientListTable: createSelectorSet(
      { role: 'table', name: 'Client List' },
      'Client List Table',
      'client-list-table',
      'Client List',
      undefined,
      'Client List Table'
    ),
    clientTableRow: createSelectorSet(
      { role: 'row' },
      'Client Table Row',
      'client-table-row',
      undefined,
      undefined,
      'Client Table Row'
    )
  },

  modals: {
    deleteConfirmationModal: createSelectorSet(
      { role: 'dialog', name: 'Delete Confirmation' },
      'Delete Confirmation Modal',
      'delete-confirmation-modal',
      undefined,
      undefined,
      'Delete Confirmation Modal'
    ),
    clientModal: createSelectorSet(
      { role: 'dialog', name: 'Client Details' },
      'Client Modal',
      'client-modal',
      undefined,
      undefined,
      'Client Details Modal'
    )
  },

  messages: {
    clientCreatedSuccessMessage: createSelectorSet(
      { role: 'status', name: 'Client created successfully' },
      'Client Created Success Message',
      'client-created-success-message',
      'Client has been created successfully.',
      undefined,
      'Client Created Success Message'
    ),
    clientUpdatedSuccessMessage: createSelectorSet(
      { role: 'status', name: 'Client updated successfully' },
      'Client Updated Success Message',
      'client-updated-success-message',
      'Client has been saved successfully.',
      undefined,
      'Client Updated Success Message'
    ),
    clientDeletedSuccessMessage: createSelectorSet(
      { role: 'status', name: 'Client deleted successfully' },
      'Client Deleted Success Message',
      'client-deleted-success-message',
      'Client has been deleted successfully.',
      undefined,
      'Client Deleted Success Message'
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
    clientLoadingSpinner: createSelectorSet(
      { role: 'status', name: 'Loading clients' },
      'Client Loading Spinner',
      'client-loading-spinner',
      'Loading clients',
      undefined,
      'Client Loading Spinner'
    )
  }
};

/**
 * Client page specific selector configurations
 */
export const ClientSelectorConfigs = {
  // Critical elements for client management
  createClientButton: createSelectorConfig(
    'Create Client button - critical for client creation',
    'getByRole',
    ['getByText', 'getByTestId', 'locator'],
    true,
    10000
  ),
  
  clientNameInput: createSelectorConfig(
    'Client Name input - critical for client creation',
    'getByRole',
    ['getByLabel', 'getByPlaceholder', 'getByTestId', 'locator'],
    true,
    10000
  ),
  
  saveClientButton: createSelectorConfig(
    'Save Client button - critical for saving client',
    'getByRole',
    ['getByText', 'getByTestId', 'locator'],
    true,
    10000
  ),
  
  // Form inputs
  addressInput: createSelectorConfig(
    'Address input - important for client details',
    'getByRole',
    ['getByLabel', 'getByPlaceholder', 'getByTestId', 'locator'],
    false,
    5000
  ),
  
  phoneInput: createSelectorConfig(
    'Phone input - important for client details',
    'getByRole',
    ['getByLabel', 'getByPlaceholder', 'getByTestId', 'locator'],
    false,
    5000
  ),
  
  emailInput: createSelectorConfig(
    'Email input - important for client details',
    'getByRole',
    ['getByLabel', 'getByPlaceholder', 'getByTestId', 'locator'],
    false,
    5000
  ),
  
  timezoneDropdown: createSelectorConfig(
    'Timezone dropdown - important for client details',
    'getByRole',
    ['getByLabel', 'getByTestId', 'locator'],
    false,
    5000
  ),
  
  maxDraftsInput: createSelectorConfig(
    'Max Drafts input - important for client details',
    'getByRole',
    ['getByLabel', 'getByPlaceholder', 'getByTestId', 'locator'],
    false,
    5000
  ),
  
  legalStatementInput: createSelectorConfig(
    'Legal Statement input - important for client details',
    'getByRole',
    ['getByLabel', 'getByPlaceholder', 'getByTestId', 'locator'],
    false,
    5000
  ),
  
  // Search functionality
  clientSearchInput: createSelectorConfig(
    'Client search input - important for searching',
    'getByRole',
    ['getByLabel', 'getByPlaceholder', 'getByTestId', 'locator'],
    false,
    5000
  ),
  
  // Table elements
  clientListTable: createSelectorConfig(
    'Client list table - important for displaying clients',
    'getByRole',
    ['getByTestId', 'locator'],
    false,
    5000
  ),
  
  // Action buttons
  editClientButton: createSelectorConfig(
    'Edit Client button - important for editing',
    'getByRole',
    ['getByText', 'getByTestId', 'locator'],
    false,
    5000
  ),
  
  deleteClientButton: createSelectorConfig(
    'Delete Client button - important for deletion',
    'getByRole',
    ['getByText', 'getByTestId', 'locator'],
    false,
    5000
  ),
  
  // Messages
  clientCreatedSuccessMessage: createSelectorConfig(
    'Client created success message - important for verification',
    'getByRole',
    ['getByText', 'getByTestId', 'locator'],
    false,
    5000
  ),
  
  clientUpdatedSuccessMessage: createSelectorConfig(
    'Client updated success message - important for verification',
    'getByRole',
    ['getByText', 'getByTestId', 'locator'],
    false,
    5000
  ),
  
  clientDeletedSuccessMessage: createSelectorConfig(
    'Client deleted success message - important for verification',
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
 * Client page selector helper functions
 */
export class ClientSelectorHelpers {
  constructor(private page: any) {}

  /**
   * Get create client button locator with fallbacks (best practice order)
   */
  getCreateClientButton() {
    const selectors = [
      this.page.getByRole('button', { name: 'Create Client' }),
      this.page.getByText('Create Client'),
      this.page.getByTestId(ClientSelectors.buttons.createClientButton.testId!),
      this.page.locator('button:has-text("Create Client")')
    ];
    return selectors;
  }

  /**
   * Get save client button locator with fallbacks (best practice order)
   */
  getSaveClientButton() {
    const selectors = [
      this.page.getByRole('button', { name: 'Save Client' }),
      this.page.getByText('Save Client'),
      this.page.getByTestId(ClientSelectors.buttons.saveClientButton.testId!),
      this.page.locator('button:has-text("Save Client")')
    ];
    return selectors;
  }

  /**
   * Get update client button locator with fallbacks (best practice order)
   */
  getUpdateClientButton() {
    const selectors = [
      this.page.getByRole('button', { name: 'Update Client' }),
      this.page.getByText('Update Client'),
      this.page.getByTestId(ClientSelectors.buttons.updateClientButton.testId!),
      this.page.locator('button:has-text("Update Client")')
    ];
    return selectors;
  }

  /**
   * Get client name input locator with fallbacks (best practice order)
   */
  getClientNameInput() {
    const selectors = [
      this.page.getByRole('textbox', { name: 'Client Name' }),
      this.page.getByLabel('Client Name Input'),
      this.page.getByPlaceholder('Enter client name'),
      this.page.getByTestId(ClientSelectors.inputs.clientNameInput.testId!),
      this.page.locator('input[name="clientName"]')
    ];
    return selectors;
  }

  /**
   * Get address input locator with fallbacks (best practice order)
   */
  getAddressInput() {
    const selectors = [
      this.page.getByRole('textbox', { name: 'Address' }),
      this.page.getByLabel('Address Input'),
      this.page.getByPlaceholder('Enter address'),
      this.page.getByTestId(ClientSelectors.inputs.addressInput.testId!),
      this.page.locator('input[name="address"]')
    ];
    return selectors;
  }

  /**
   * Get phone input locator with fallbacks
   */
  getPhoneInput() {
    const selectors = [
      this.page.getByTestId(ClientSelectors.inputs.phoneInput.testId!),
      this.page.getByRole('textbox', { name: 'Phone Number' }),
      this.page.getByLabel('Phone Input'),
      this.page.getByPlaceholder('Enter phone number'),
      this.page.locator('input[name="phoneNumber"]')
    ];
    return selectors;
  }

  /**
   * Get email input locator with fallbacks
   */
  getEmailInput() {
    const selectors = [
      this.page.getByTestId(ClientSelectors.inputs.emailInput.testId!),
      this.page.getByRole('textbox', { name: 'Email' }),
      this.page.getByLabel('Email Input'),
      this.page.getByPlaceholder('Enter email address'),
      this.page.locator('input[name="email"]')
    ];
    return selectors;
  }

  /**
   * Get timezone dropdown locator with fallbacks
   */
  getTimezoneDropdown() {
    const selectors = [
      this.page.getByTestId(ClientSelectors.dropdowns.timezoneDropdown.testId!),
      this.page.getByRole('combobox', { name: 'Select Timezone' }),
      this.page.getByLabel('Timezone Dropdown'),
      this.page.locator('select[name="timezone"]'),
      this.page.locator('div[data-placeholder="true"]')
    ];
    return selectors;
  }

  /**
   * Get max drafts input locator with fallbacks
   */
  getMaxDraftsInput() {
    const selectors = [
      this.page.getByTestId(ClientSelectors.inputs.maxDraftsInput.testId!),
      this.page.getByRole('spinbutton', { name: 'Max Drafts' }),
      this.page.getByLabel('Max Drafts Input'),
      this.page.getByPlaceholder('Enter max drafts'),
      this.page.locator('input[name="maxDrafts"]')
    ];
    return selectors;
  }

  /**
   * Get legal statement input locator with fallbacks
   */
  getLegalStatementInput() {
    const selectors = [
      this.page.getByTestId(ClientSelectors.inputs.legalStatementInput.testId!),
      this.page.getByRole('textbox', { name: 'Legal Statement' }),
      this.page.getByLabel('Legal Statement Input'),
      this.page.getByPlaceholder('Enter legal statement'),
      this.page.locator('textarea[name="legalStatement"]')
    ];
    return selectors;
  }

  /**
   * Get client search input locator with fallbacks
   */
  getClientSearchInput() {
    const selectors = [
      this.page.getByTestId(ClientSelectors.inputs.clientSearchInput.testId!),
      this.page.getByRole('searchbox', { name: 'Search Clients' }),
      this.page.getByLabel('Client Search Input'),
      this.page.getByPlaceholder('Search for clients'),
      this.page.locator('input[placeholder*="Search"]')
    ];
    return selectors;
  }

  /**
   * Get client list table locator with fallbacks
   */
  getClientListTable() {
    const selectors = [
      this.page.getByTestId(ClientSelectors.tables.clientListTable.testId!),
      this.page.getByRole('table', { name: 'Client List' }),
      this.page.locator('table'),
      this.page.locator('.client-list')
    ];
    return selectors;
  }

  /**
   * Get edit client button locator with fallbacks
   */
  getEditClientButton(clientName?: string) {
    const baseSelectors = [
      this.page.getByTestId(ClientSelectors.buttons.editClientButton.testId!),
      this.page.getByRole('button', { name: 'Edit Client' }),
      this.page.getByText('Edit Client'),
      this.page.locator('button:has-text("Edit Client")')
    ];
    
    if (clientName) {
      return [
        ...baseSelectors,
        this.page.locator(`tr:has-text("${clientName}") button:has-text("Edit")`),
        this.page.locator(`.list-edit-icon:near(text="${clientName}")`)
      ];
    }
    
    return baseSelectors;
  }

  /**
   * Get delete client button locator with fallbacks
   */
  getDeleteClientButton(clientName?: string) {
    const baseSelectors = [
      this.page.getByTestId(ClientSelectors.buttons.deleteClientButton.testId!),
      this.page.getByRole('button', { name: 'Delete Client' }),
      this.page.getByText('Delete Client'),
      this.page.locator('button:has-text("Delete Client")')
    ];
    
    if (clientName) {
      return [
        ...baseSelectors,
        this.page.locator(`tr:has-text("${clientName}") button:has-text("Delete")`),
        this.page.locator(`.list-delete-icon:near(text="${clientName}")`)
      ];
    }
    
    return baseSelectors;
  }

  /**
   * Get client created success message locator with fallbacks
   */
  getClientCreatedSuccessMessage() {
    const selectors = [
      this.page.getByTestId(ClientSelectors.messages.clientCreatedSuccessMessage.testId!),
      this.page.getByRole('status', { name: 'Client created successfully' }),
      this.page.getByText('Client has been created successfully.'),
      this.page.locator('text="Client has been created successfully."')
    ];
    return selectors;
  }

  /**
   * Get client updated success message locator with fallbacks
   */
  getClientUpdatedSuccessMessage() {
    const selectors = [
      this.page.getByTestId(ClientSelectors.messages.clientUpdatedSuccessMessage.testId!),
      this.page.getByRole('status', { name: 'Client updated successfully' }),
      this.page.getByText('Client has been saved successfully.'),
      this.page.locator('text="Client has been saved successfully."')
    ];
    return selectors;
  }

  /**
   * Get client deleted success message locator with fallbacks
   */
  getClientDeletedSuccessMessage() {
    const selectors = [
      this.page.getByTestId(ClientSelectors.messages.clientDeletedSuccessMessage.testId!),
      this.page.getByRole('status', { name: 'Client deleted successfully' }),
      this.page.getByText('Client has been deleted successfully.'),
      this.page.locator('text="Client has been deleted successfully."')
    ];
    return selectors;
  }

  /**
   * Get validation error message locator with fallbacks
   */
  getValidationErrorMessage() {
    const selectors = [
      this.page.getByTestId(ClientSelectors.messages.validationErrorMessage.testId!),
      this.page.getByRole('alert'),
      this.page.getByText('This field is required'),
      this.page.locator('.error-message'),
      this.page.locator('.alert-error')
    ];
    return selectors;
  }

  /**
   * Get delete confirmation modal locator with fallbacks
   */
  getDeleteConfirmationModal() {
    const selectors = [
      this.page.getByTestId(ClientSelectors.modals.deleteConfirmationModal.testId!),
      this.page.getByRole('dialog', { name: 'Delete Confirmation' }),
      this.page.getByText('Are you sure you want to delete this client?'),
      this.page.locator('text="Are you sure you want to delete this client?"')
    ];
    return selectors;
  }
}
