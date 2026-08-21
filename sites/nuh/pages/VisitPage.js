const { VisitPage: SharedVisitPage } = require('../../../pages/visit/VisitPage.js');
const { getNuhBaseUrl } = require('../utils/baseUrl.js');

/**
 * NUH Site-specific Visit Page Object Model
 * Extends shared VisitPage to inherit Create Visit actions and locators.
 */
export class VisitPage extends SharedVisitPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    super(page);
  }

  /**
   * Overrides base getBaseUrl to prioritize NUH_URL
   * @returns {string}
   */
  getBaseUrl() {
    return getNuhBaseUrl();
  }
}
