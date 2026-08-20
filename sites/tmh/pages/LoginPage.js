const { LoginPage: SharedLoginPage } = require('../../../pages/login/LoginPage.js');
const tmhConfig = require('../test_data/config.json');
const { getTmhBaseUrl } = require('../utils/baseUrl.js');

/**
 * TMH Site-specific Login Page Object Model
 * Extends the shared Base LoginPage to inherit reusable actions and categorized locators.
 */
export class LoginPage extends SharedLoginPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    super(page, {
      path: {
        welcome: tmhConfig.welcomePath,
        apps: tmhConfig.appsPath,
        keycloakHost: tmhConfig.keycloakHost,
      },
    });
  }

  /**
   * Overrides base getBaseUrl to prioritize TMH_URL
   * @returns {string}
   */
  getBaseUrl() {
    return getTmhBaseUrl();
  }
}
