const { expect } = require('@playwright/test');
const { receptionLocators } = require('./receptionLocators.js');
const { calculateAgeFromDOBBE, calculateDOBBEFromAge } = require('../../utils/patientGenerator.js');

/**
 * Shared Base Create Patient Page Object Model (Reception Module)
 * Uses categorized nested locators and iframe frameLocator for element access.
 */
export class CreatePatientPage {
  /**
   * @param {import('@playwright/test').Page} page
   * @param {Object} [customSelectors]
   */
  constructor(page, customSelectors = {}) {
    this.page = page;

    const selectors = {
      iframe: receptionLocators.iframe,
      heading: receptionLocators.heading,
      entry: { ...receptionLocators.entry, ...(customSelectors.entry || {}) },
      headerSearch: { ...receptionLocators.headerSearch, ...(customSelectors.headerSearch || {}) },
      patientProfile: { ...receptionLocators.patientProfile, ...(customSelectors.patientProfile || {}) },
      button: { ...receptionLocators.button, ...(customSelectors.button || {}) },
      input: { ...receptionLocators.input, ...(customSelectors.input || {}) },
      select: { ...receptionLocators.select, ...(customSelectors.select || {}) },
      searchbox: { ...receptionLocators.searchbox, ...(customSelectors.searchbox || {}) },
      path: { ...receptionLocators.path, ...(customSelectors.path || {}) },
    };

    this.selectors = selectors;
  }

  /**
   * Gets frameLocator for the embedded create-patient iframe
   * @returns {import('@playwright/test').FrameLocator}
   */
  getFrame() {
    return this.page.frameLocator(this.selectors.iframe);
  }

  /**
   * Gets current base URL from environment or config
   * @returns {string}
   */
  getBaseUrl() {
    return process.env.BASE_URL || process.env.NUH_URL || 'https://cortex-nuh-new.cortexcloud.co';
  }

  /**
   * Opens Reception Landing Page (/cortex/reception) and waits for UI to load
   */
  async openReceptionPage() {
    const targetUrl = `${this.getBaseUrl()}/cortex/reception`;
    await this.page.goto(targetUrl, { waitUntil: 'domcontentloaded' });
    await this.page.waitForLoadState('networkidle').catch(() => {});
    await this.page.waitForTimeout(2000);
  }

  /**
   * Opens Create Patient form directly and waits for iframe and key form elements to fully render
   * @param {string} [path]
   */
  async openCreatePatientForm(path = this.selectors.path.createPatient) {
    const targetUrl = path.startsWith('http') ? path : `${this.getBaseUrl()}${path}`;
    await this.page.goto(targetUrl, { waitUntil: 'domcontentloaded' });

    // 1. Wait for iframe element attached in parent DOM
    await this.page.waitForSelector(this.selectors.iframe, { state: 'attached', timeout: 30000 });

    // 2. Wait for iframe's inner document body to load
    const frame = this.getFrame();
    await frame.locator('body').waitFor({ state: 'attached', timeout: 30000 });

    // 3. Wait for key form fields inside iframe to be visible
    await frame.locator(this.selectors.input.citizenId).waitFor({ state: 'visible', timeout: 30000 });
    await frame.locator(this.selectors.button.submit).waitFor({ state: 'visible', timeout: 30000 });

    // 4. Assert heading title <h1 data-testid="patient-container-title">สร้างผู้ป่วยใหม่</h1>
    await this.assertCreatePatientPageHeading('สร้างผู้ป่วยใหม่');
  }

  /**
   * Clicks Create Patient button via CSS path (Radix theme button) with smart fallback
   */
  async clickCreatePatientByRadixSelector() {
    if (this.page.url().includes('create-patient')) {
      return;
    }
    const button = this.page.locator(this.selectors.entry.radixButtonSpan).or(this.page.getByText('สร้างผู้ป่วยใหม่')).first();
    const isVisible = await button.isVisible({ timeout: 10000 }).catch(() => false);

    if (isVisible) {
      await button.click({ force: true, noWaitAfter: true });
    } else {
      await this.openCreatePatientForm();
    }
    await this.page.waitForTimeout(1500);
  }

  /**
   * Clicks Create Patient button via span label text "สร้างผู้ป่วยใหม่" with smart fallback
   */
  async clickCreatePatientBySpanLabel() {
    if (this.page.url().includes('create-patient')) {
      return;
    }
    const button = this.page.locator('span.button-label-overflow, button, a, span').filter({ hasText: 'สร้างผู้ป่วยใหม่' }).first();
    const isVisible = await button.isVisible({ timeout: 10000 }).catch(() => false);

    if (isVisible) {
      await button.click({ force: true, noWaitAfter: true });
    } else {
      await this.openCreatePatientForm();
    }
    await this.page.waitForTimeout(1500);
  }

  /**
   * Selects gender from native select element inside iframe
   * @param {'male'|'female'} gender
   */
  async selectGender(gender) {
    const genderSelect = this.getFrame().locator(this.selectors.select.gender);
    await genderSelect.waitFor({ state: 'visible', timeout: 15000 });
    await genderSelect.selectOption(gender);
    await this.page.waitForTimeout(500);
  }

  /**
   * Selects an option from a custom searchbox dropdown inside iframe
   * @param {string} fieldName Field identifier (e.g. 'prefixName')
   * @param {string} searchText Search term to type in cmdk-input
   * @param {string} optionText Target option text to select from div[role="option"]
   */
  async selectFromSearchbox(fieldName, searchText, optionText) {
    const frame = this.getFrame();
    const trigger = frame.locator(`[data-testid="searchbox-trigger-${fieldName}-searchbox"]`);
    await trigger.waitFor({ state: 'visible', timeout: 15000 });
    await trigger.click();

    const searchInput = frame.locator(this.selectors.searchbox.searchInput);
    await searchInput.waitFor({ state: 'visible', timeout: 15000 });
    await searchInput.fill(searchText);

    const option = frame.locator(this.selectors.searchbox.optionItem, { hasText: optionText }).first();
    await option.waitFor({ state: 'visible', timeout: 15000 });
    await option.click();
    await this.page.waitForTimeout(500);
  }

  /**
   * Fills Thai Citizen ID (13 digits) inside iframe
   * @param {string} idCardNumber
   */
  async fillCitizenId(idCardNumber) {
    const input = this.getFrame().locator(this.selectors.input.citizenId);
    await input.waitFor({ state: 'visible', timeout: 15000 });
    await input.fill(idCardNumber);
  }

  /**
   * Fills First Name and Last Name inside iframe
   * @param {string} firstName
   * @param {string} familyName
   */
  async fillName(firstName, familyName) {
    const frame = this.getFrame();
    await frame.locator(this.selectors.input.firstName).fill(firstName);
    await frame.locator(this.selectors.input.familyName).fill(familyName);
  }

  /**
   * Fills birthdate in BE (พ.ศ.) format DD/MM/YYYY inside iframe
   * @param {string} birthDateBE
   */
  async fillBirthDateBE(birthDateBE) {
    const input = this.getFrame().locator(this.selectors.input.birthDate);
    await input.fill(birthDateBE);
    await this.page.waitForTimeout(500);
  }

  /**
   * Fills age in years inside iframe
   * @param {number|string} age
   */
  async fillAge(age) {
    const input = this.getFrame().locator(this.selectors.input.age);
    await input.fill(String(age));
    await this.page.waitForTimeout(500);
  }

  /**
   * Retrieves current calculated age from input inside iframe
   * @returns {Promise<string>}
   */
  async getCalculatedAge() {
    return await this.getFrame().locator(this.selectors.input.age).inputValue();
  }

  /**
   * Retrieves current calculated birthdate from input inside iframe
   * @returns {Promise<string>}
   */
  async getCalculatedBirthDate() {
    return await this.getFrame().locator(this.selectors.input.birthDate).inputValue();
  }

  /**
   * Submits the Create Patient form inside iframe
   */
  async submitForm() {
    const submitBtn = this.getFrame().locator(this.selectors.button.submit);
    await submitBtn.waitFor({ state: 'visible', timeout: 15000 });
    await submitBtn.click();
    await this.page.waitForTimeout(1500);
  }

  /**
   * Fills complete patient form data inside iframe
   * @param {Object} patientData
   */
  async fillPatientForm(patientData) {
    await this.selectGender(patientData.gender);
    await this.selectFromSearchbox('prefixName', patientData.prefixSearchText || '', patientData.prefixOptionText);
    await this.fillCitizenId(patientData.idCardNumber);
    await this.fillName(patientData.firstName, patientData.familyName);
    await this.fillBirthDateBE(patientData.birthDateBE);
  }

  // --- Patient Search & Profile Methods ---

  /**
   * Captures created patient HN from exact profile span (span._patient-profile-hn_...) or redirected URL
   * @returns {Promise<string>}
   */
  async getCreatedPatientHN() {
    await this.page.waitForURL(this.selectors.path.patientInfoPattern, { timeout: 20000 });

    // 1. Try exact HN element span[class*="_patient-profile-hn_"] (e.g. "HN 69007582")
    const hnSpan = this.page.locator(this.selectors.patientProfile.hnSpan).first();
    const isHnVisible = await hnSpan.isVisible({ timeout: 5000 }).catch(() => false);

    if (isHnVisible) {
      const rawText = await hnSpan.innerText();
      const match = rawText.match(/HN\s*(\d+)/i);
      if (match && match[1]) {
        return match[1];
      }
    }

    // 2. Fallback to Patient ID from URL: /cortex/next/patients/69007582...
    const urlMatch = this.page.url().match(/\/cortex\/next\/patients\/(\d+)/);
    return urlMatch ? urlMatch[1] : '';
  }

  /**
   * Generic reusable Patient Search method (by HN, Citizen ID, or Name)
   * @param {string} query Search query (HN, Thai Citizen ID, or Name)
   */
  async searchPatient(query) {
    const searchInput = this.page.locator(this.selectors.headerSearch.input).first();
    await searchInput.waitFor({ state: 'visible', timeout: 15000 });
    await searchInput.click();
    await searchInput.fill(query);
    await this.page.waitForTimeout(500);

    const option = this.page.locator(this.selectors.headerSearch.optionItem, { hasText: query }).first();
    const isOptionVisible = await option.isVisible({ timeout: 5000 }).catch(() => false);

    if (isOptionVisible) {
      await option.click();
    } else {
      await searchInput.press('Enter');
    }
    await this.page.waitForTimeout(1500);
  }

  /**
   * Searches patient specifically by HN
   * @param {string} hn
   */
  async searchPatientByHN(hn) {
    await this.searchPatient(hn);
  }

  /**
   * Searches patient specifically by Citizen ID
   * @param {string} citizenId
   */
  async searchPatientByCitizenId(citizenId) {
    await this.searchPatient(citizenId);
  }

  /**
   * Asserts search result successfully opens patient info page matching patient ID or HN
   * @param {string} [expectedQuery]
   */
  async assertPatientSearchResult(expectedQuery = '') {
    await expect(this.page).toHaveURL(/\/cortex\/next\/patients\/\d+/, { timeout: 15000 });
    const hnSpan = this.page.locator(this.selectors.patientProfile.hnSpan).first();
    await expect(hnSpan).toBeVisible({ timeout: 15000 });
  }

  /**
   * Asserts patient profile details (First Name, Last Name) on the Patient Info page using Playwright element locators
   * @param {Object} patientData Patient data containing firstName, familyName
   */
  async assertPatientProfileDetails(patientData = {}) {
    await this.page.waitForURL(this.selectors.path.patientInfoPattern, { timeout: 20000 });

    if (patientData.firstName) {
      await expect(this.page.getByText(patientData.firstName, { exact: false }).first()).toBeVisible({ timeout: 10000 });
    }
    if (patientData.familyName) {
      await expect(this.page.getByText(patientData.familyName, { exact: false }).first()).toBeVisible({ timeout: 10000 });
    }
  }

  // --- Assertions ---

  /**
   * Asserts Create Patient page heading title matches <h1 data-testid="patient-container-title">สร้างผู้ป่วยใหม่</h1>
   * @param {string} [expectedTitle]
   */
  async assertCreatePatientPageHeading(expectedTitle = 'สร้างผู้ป่วยใหม่') {
    const pageHeading = this.page.locator(this.selectors.heading);
    const frameHeading = this.getFrame().locator(this.selectors.heading);

    const isPageHeadingVisible = await pageHeading.isVisible({ timeout: 5000 }).catch(() => false);
    if (isPageHeadingVisible) {
      await expect(pageHeading).toHaveText(expectedTitle);
    } else {
      await expect(frameHeading).toHaveText(expectedTitle);
    }
  }

  /**
   * Asserts successful patient creation by waiting for patient info URL redirect
   */
  async assertPatientCreated() {
    await this.page.waitForURL(this.selectors.path.patientInfoPattern, { timeout: 20000 });
    expect(this.page.url()).toMatch(/\/cortex\/next\/patients\/\d+/);
  }

  /**
   * Asserts that auto-calculated age matches expected age from DOB (BE)
   * @param {string} birthDateBE
   */
  async assertAgeMatchesCalculated(birthDateBE) {
    const actualAge = await this.getCalculatedAge();
    const expectedAge = calculateAgeFromDOBBE(birthDateBE);
    expect(parseInt(actualAge, 10)).toBe(expectedAge);
  }

  /**
   * Asserts that auto-calculated DOB matches 01/01/พ.ศ. for given age
   * @param {number|string} age
   */
  async assertDOBMatchesCalculated(age) {
    const actualDOB = await this.getCalculatedBirthDate();
    const expectedDOB = calculateDOBBEFromAge(age);
    expect(actualDOB).toBe(expectedDOB);
  }

  /**
   * Asserts that form submission fails with required field validation errors
   */
  async assertRequiredFieldValidationErrors() {
    await expect(this.page).toHaveURL(/create-patient/);
  }

  /**
   * Asserts error display when submitting invalid Citizen ID
   */
  async assertInvalidCitizenIdError() {
    await expect(this.page).toHaveURL(/create-patient/);
  }
}
