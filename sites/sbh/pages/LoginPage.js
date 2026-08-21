const { LoginPage: SharedLoginPage } = require('../../../pages/login/LoginPage.js');
const sbhConfig = require('../test_data/config.json');
const { getSbhBaseUrl } = require('../utils/baseUrl.js');

/**
 * SBH Site-specific Login Page Object Model
 * Extends the shared Base LoginPage to inherit reusable actions and categorized locators.
 */
export class LoginPage extends SharedLoginPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    super(page, {
      path: {
        welcome: sbhConfig.welcomePath,
        apps: sbhConfig.appsPath,
        keycloakHost: sbhConfig.keycloakHost,
      },
    });
  }

  /**
   * Overrides base getBaseUrl to prioritize SBH_URL
   * @returns {string}
   */
  getBaseUrl() {
    return getSbhBaseUrl();
  }
}
