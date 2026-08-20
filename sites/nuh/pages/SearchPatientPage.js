const { SearchPatientPage: BaseSearchPatientPage } = require('../../../pages/reception/SearchPatientPage.js');
const { getNuhBaseUrl } = require('../utils/baseUrl.js');

/**
 * NUH Site Specific Search Patient Page Object Model
 * Extends BaseSearchPatientPage for NUH reception site customization.
 */
export class SearchPatientPage extends BaseSearchPatientPage {
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
