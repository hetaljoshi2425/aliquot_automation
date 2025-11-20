/**
 * Selectors Index
 * Central export point for all page selectors and helper functions
 */

// Base types and utilities
export * from './types';

// Page selectors
export * from './login.selectors';
export * from './home.selectors';
export * from './trends.selectors';
export * from './client.selectors';
export * from './customer.selectors';

// Re-export selector helpers for convenience
export {
  LoginSelectorHelpers,
  LoginSelectorConfigs
} from './login.selectors';

export {
  HomeSelectorHelpers,
  HomeSelectorConfigs
} from './home.selectors';

export {
  TrendsSelectorHelpers,
  TrendsSelectorConfigs
} from './trends.selectors';

export {
  ClientSelectorHelpers,
  ClientSelectorConfigs
} from './client.selectors';

export {
  CustomerSelectorHelpers,
  CustomerSelectorConfigs
} from './customer.selectors';
