export const ESR_BASE_URL = process.env.ESR_BASE_URL;
export const ESR_USERNAME = process.env.ESR_USERNAME;
export const ESR_PASSWORD = process.env.ESR_PASSWORD;

export const ALIQUOT_BASE_URL = process.env.ALIQUOT_BASE_URL;
export const ALIQUOT_ENV = process.env.ALIQUOT_ENV;
export const ALIQUOT_USERNAME = process.env.ALIQUOT_USERNAME;
export const ALIQUOT_PASSWORD = process.env.ALIQUOT_PASSWORD;
export const ALIQUOT_WRONG_PASS = process.env.ALIQUOT_WRONG_PASS;

// AWT Environment (DEPRECATED - No longer available)
// export const ALIQUOT_BASE_URL_AWT = process.env.ALIQUOT_BASE_URL_AWT || 'https://awt.aliquot.live/';
// export const ALIQUOT_USERNAME_AWT = process.env.ALIQUOT_USERNAME_AWT;
// export const ALIQUOT_PASSWORD_AWT = process.env.ALIQUOT_PASSWORD_AWT;

// QA Environment (PRIMARY - All tests should use this environment)
export const ALIQUOT_BASE_URL_QA = process.env.ALIQUOT_BASE_URL_QA || 'https://qa.aliquot.live/';
export const ALIQUOT_USERNAME_QA = process.env.ALIQUOT_USERNAME_QA || 'qa_automation@aquaphoenixsci.com';
export const ALIQUOT_PASSWORD_QA = process.env.ALIQUOT_PASSWORD_QA || '12345678';

export const ESR_DB_PASSWORD = process.env.ESR_DB_PASSWORD;
export const esrDbHOST = process.env.ESR_DB_HOST;
export const esrDbUser = process.env.ESR_DB_USER;
