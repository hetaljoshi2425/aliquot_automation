/**
 * Login Page Selectors
 * Uses Playwright's recommended methods: getByRole, getByTestId, getByLabel
 */

import { PageSelectors, SelectorConfig, createSelectorConfig, createSelectorSet } from './types';

export const LoginSelectors: PageSelectors = {
  pageTitle: createSelectorSet(
    { role: 'heading', name: 'Login' },
    undefined,
    'login-page-title',
    'Login',
    undefined,
    'Login Page'
  ),

  navigation: {
    // No navigation elements on login page
  },

  forms: {
    loginForm: createSelectorSet(
      { role: 'form' },
      'Login Form',
      'login-form',
      undefined,
      undefined,
      'Login Form'
    )
  },

  buttons: {
    loginButton: createSelectorSet(
      { role: 'button', name: 'Login to Account' },
      undefined,
      'login-button',
      'Login to Account',
      undefined,
      'Login Button'
    ),
    signInButton: createSelectorSet(
      { role: 'button', name: 'Sign In' },
      undefined,
      'sign-in-button',
      'Sign In',
      undefined,
      'Sign In Button'
    ),
    forgotPasswordButton: createSelectorSet(
      { role: 'button', name: 'Forgot Password' },
      'Forgot Password',
      'forgot-password-button',
      'Forgot Password',
      undefined,
      'Forgot Password Button'
    )
  },

  inputs: {
    usernameInput: createSelectorSet(
      { role: 'textbox', name: 'Username or Email' },
      'Username or Email',
      'username-input',
      undefined,
      'user@example.com',
      'Username Input'
    ),
    emailInput: createSelectorSet(
      { role: 'textbox', name: 'Email Address' },
      'Email Address',
      'email-input',
      undefined,
      'user@example.com',
      'Email Input'
    ),
    passwordInput: createSelectorSet(
      { role: 'textbox', name: 'Password' },
      'Password',
      'password-input',
      undefined,
      'Enter your password',
      'Password Input'
    )
  },

  dropdowns: {
    // No dropdowns on login page
  },

  tables: {
    // No tables on login page
  },

  modals: {
    // No modals on login page
  },

  messages: {
    loginSuccessMessage: createSelectorSet(
      { role: 'status', name: 'Login successful' },
      undefined,
      'login-success-message',
      'Login successful',
      undefined,
      'Login Success Message'
    ),
    loginErrorMessage: createSelectorSet(
      { role: 'alert', name: 'Login error' },
      undefined,
      'login-error-message',
      'Invalid credentials',
      undefined,
      'Login Error Message'
    ),
    validationErrorMessage: createSelectorSet(
      { role: 'alert', name: 'Validation error' },
      undefined,
      'validation-error-message',
      'This field is required',
      undefined,
      'Validation Error Message'
    )
  },

  loading: {
    loginLoadingSpinner: createSelectorSet(
      { role: 'status', name: 'Loading' },
      undefined,
      'login-loading-spinner',
      'Loading',
      undefined,
      'Login Loading Spinner'
    )
  }
};

/**
 * Login page specific selector configurations
 */
export const LoginSelectorConfigs = {
  // Critical elements for login functionality
  usernameInput: createSelectorConfig(
    'Username input field - critical for login',
    'getByRole',
    ['getByLabel', 'getByPlaceholder', 'getByTestId', 'locator'],
    true,
    10000
  ),
  
  passwordInput: createSelectorConfig(
    'Password input field - critical for login',
    'getByRole',
    ['getByLabel', 'getByPlaceholder', 'getByTestId', 'locator'],
    true,
    10000
  ),
  
  loginButton: createSelectorConfig(
    'Login button - critical for form submission',
    'getByRole',
    ['getByText', 'getByTestId', 'locator'],
    true,
    10000
  ),
  
  // Error handling elements
  errorMessage: createSelectorConfig(
    'Error message display',
    'getByRole',
    ['getByText', 'getByTestId', 'locator'],
    false,
    5000
  ),
  
  successMessage: createSelectorConfig(
    'Success message display',
    'getByRole',
    ['getByText', 'getByTestId', 'locator'],
    false,
    5000
  ),
  
  // Loading elements
  loadingSpinner: createSelectorConfig(
    'Loading spinner during login process',
    'getByRole',
    ['getByTestId', 'locator'],
    false,
    3000
  )
} as const;

/**
 * Login page selector helper functions
 */
export class LoginSelectorHelpers {
  constructor(private page: any) {}

  /**
   * Get username input locator with fallbacks (best practice order)
   */
  getUsernameInput() {
    const selectors = [
      this.page.getByRole('textbox', { name: 'Username or Email' }),
      this.page.getByLabel('Username or Email'),
      this.page.getByPlaceholder('user@example.com'),
      this.page.getByTestId(LoginSelectors.inputs.usernameInput.testId!),
      this.page.locator('input[name="username"]'),
      this.page.locator('input[type="email"]')
    ];
    return selectors;
  }

  /**
   * Get password input locator with fallbacks (best practice order)
   */
  getPasswordInput() {
    const selectors = [
      this.page.getByRole('textbox', { name: 'Password' }),
      this.page.getByLabel('Password'),
      this.page.getByPlaceholder('Enter your password'),
      this.page.getByTestId(LoginSelectors.inputs.passwordInput.testId!),
      this.page.locator('input[type="password"]'),
      this.page.locator('input[name="password"]')
    ];
    return selectors;
  }

  /**
   * Get login button locator with fallbacks (best practice order)
   */
  getLoginButton() {
    const selectors = [
      this.page.getByRole('button', { name: 'Login to Account' }),
      this.page.getByRole('button', { name: 'Login' }),
      this.page.getByText('Login to Account'),
      this.page.getByText('Login'),
      this.page.getByTestId(LoginSelectors.buttons.loginButton.testId!),
      this.page.locator('button[type="submit"]')
    ];
    return selectors;
  }

  /**
   * Get error message locator with fallbacks (best practice order)
   */
  getErrorMessage() {
    const selectors = [
      this.page.getByRole('alert'),
      this.page.getByText('Invalid credentials'),
      this.page.getByText('Error'),
      this.page.getByTestId(LoginSelectors.messages.loginErrorMessage.testId!),
      this.page.locator('.error-message'),
      this.page.locator('.alert-error')
    ];
    return selectors;
  }

  /**
   * Get success message locator with fallbacks (best practice order)
   */
  getSuccessMessage() {
    const selectors = [
      this.page.getByRole('status'),
      this.page.getByText('Login successful'),
      this.page.getByText('Success'),
      this.page.getByTestId(LoginSelectors.messages.loginSuccessMessage.testId!),
      this.page.locator('.success-message'),
      this.page.locator('.alert-success')
    ];
    return selectors;
  }

  /**
   * Get loading spinner locator with fallbacks (best practice order)
   */
  getLoadingSpinner() {
    const selectors = [
      this.page.getByRole('status', { name: 'Loading' }),
      this.page.getByTestId(LoginSelectors.loading.loginLoadingSpinner.testId!),
      this.page.locator('[data-loading="true"]'),
      this.page.locator('.loading-spinner'),
      this.page.locator('.spinner')
    ];
    return selectors;
  }
}
