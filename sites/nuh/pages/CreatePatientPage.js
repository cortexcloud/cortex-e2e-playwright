const { CreatePatientPage: SharedCreatePatientPage } = require('../../../pages/reception/CreatePatientPage.js');
const nuhConfig = require('../test_data/config.json');

/**
 * NUH Site-specific Create Patient Page Object Model
 * Extends shared CreatePatientPage to inherit reception actions and locators.
 */
export class CreatePatientPage extends SharedCreatePatientPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    super(page, {
      path: {
        createPatient: '/cortex/reception/create-patient',
        patientInfoPattern: /\/cortex\/next\/patients\/\d+/,
      },
    });
  }

  /**
   * Overrides base getBaseUrl to prioritize NUH_URL
   * @returns {string}
   */
  getBaseUrl() {
    return process.env.NUH_URL || nuhConfig.baseUrl;
  }
}
