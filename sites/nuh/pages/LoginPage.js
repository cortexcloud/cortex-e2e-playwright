const { LoginPage: SharedLoginPage } = require('../../../pages/login/LoginPage.js');
const nuhConfig = require('../test_data/config.json');
const { getNuhBaseUrl } = require('../utils/baseUrl.js');

/**
 * NUH Site-specific Login Page Object Model
 * Extends the shared Base LoginPage to inherit reusable actions and categorized locators.
 */
export class LoginPage extends SharedLoginPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    super(page, {
      path: {
        welcome: nuhConfig.welcomePath,
        apps: nuhConfig.appsPath,
        keycloakHost: nuhConfig.keycloakHost,
      },
    });
  }

  /**
   * Overrides base getBaseUrl to prioritize NUH_URL
   * @returns {string}
   */
  getBaseUrl() {
    return getNuhBaseUrl();
  }
}
