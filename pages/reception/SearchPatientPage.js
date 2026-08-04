const { expect } = require('@playwright/test');
const { receptionLocators } = require('./receptionLocators.js');

/**
 * Shared Base Search Patient Page Object Model (Reception Module)
 * Manages search form fields inside embedded iframe on /cortex/reception/search-patient and profile page assertions.
 */
export class SearchPatientPage {
  /**
   * @param {import('@playwright/test').Page} page
   * @param {Object} [customSelectors]
   */
  constructor(page, customSelectors = {}) {
    this.page = page;

    const selectors = {
      iframe: receptionLocators.iframe,
      searchPage: { ...receptionLocators.searchPage, ...(customSelectors.searchPage || {}) },
      patientProfile: { ...receptionLocators.patientProfile, ...(customSelectors.patientProfile || {}) },
      path: { ...receptionLocators.path, ...(customSelectors.path || {}) },
    };

    this.selectors = selectors;
  }

  /**
   * Gets frameLocator for the embedded iframe
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
   * Opens Search Patient Landing Page (/cortex/reception/search-patient) and waits for iframe and inputs to render
   */
  async openSearchPatientPage() {
    const targetUrl = `${this.getBaseUrl()}${this.selectors.searchPage.path}`;
    await this.page.goto(targetUrl, { waitUntil: 'domcontentloaded' });

    // 1. Wait for iframe element attached in parent DOM
    await this.page.waitForSelector(this.selectors.iframe, { state: 'attached', timeout: 30000 });

    // 2. Wait for iframe body document to attach
    const frame = this.getFrame();
    await frame.locator('body').waitFor({ state: 'attached', timeout: 30000 });

    // 3. Wait for main HN search input inside iframe to be visible
    const hnInput = frame.locator(this.selectors.searchPage.input.hn).first();
    await hnInput.waitFor({ state: 'visible', timeout: 30000 });
  }

  /**
   * Fills HN input field inside iframe
   * @param {string} hn
   */
  async fillHN(hn) {
    const input = this.getFrame().locator(this.selectors.searchPage.input.hn).first();
    await input.waitFor({ state: 'visible', timeout: 15000 });
    await input.fill(hn);
  }

  /**
   * Fills Name input field (First - Last Name) inside iframe
   * @param {string} name
   */
  async fillName(name) {
    const input = this.getFrame().locator(this.selectors.searchPage.input.name).first();
    await input.waitFor({ state: 'visible', timeout: 15000 });
    await input.fill(name);
  }

  /**
   * Fills Thai Citizen ID input field inside iframe
   * @param {string} citizenId
   */
  async fillCitizenId(citizenId) {
    const input = this.getFrame().locator(this.selectors.searchPage.input.citizenId).first();
    await input.waitFor({ state: 'visible', timeout: 15000 });
    await input.fill(citizenId);
  }

  /**
   * Fills Phone Number input field inside iframe
   * @param {string} phone
   */
  async fillPhone(phone) {
    const input = this.getFrame().locator(this.selectors.searchPage.input.phone).first();
    await input.waitFor({ state: 'visible', timeout: 15000 });
    await input.fill(phone);
  }

  /**
   * Fills Visit Number (VN) input field inside iframe
   * @param {string} vn
   */
  async fillVN(vn) {
    const input = this.getFrame().locator(this.selectors.searchPage.input.vn).first();
    await input.waitFor({ state: 'visible', timeout: 15000 });
    await input.fill(vn);
  }

  /**
   * Fills Admission Number (AN) input field inside iframe
   * @param {string} an
   */
  async fillAN(an) {
    const input = this.getFrame().locator(this.selectors.searchPage.input.an).first();
    await input.waitFor({ state: 'visible', timeout: 15000 });
    await input.fill(an);
  }

  /**
   * Fills Postal Code input field inside iframe
   * @param {string} postalCode
   */
  async fillPostalCode(postalCode) {
    const input = this.getFrame().locator(this.selectors.searchPage.input.postalCode).first();
    await input.waitFor({ state: 'visible', timeout: 15000 });
    await input.fill(postalCode);
  }

  /**
   * Clicks Search [Enter] button inside iframe or presses Enter to submit search criteria
   */
  async clickSearchButton() {
    const searchBtn = this.getFrame().locator(this.selectors.searchPage.button.search).first();
    const isBtnVisible = await searchBtn.isVisible({ timeout: 5000 }).catch(() => false);

    if (isBtnVisible) {
      await searchBtn.click({ force: true });
    } else {
      await this.page.keyboard.press('Enter');
    }
    await this.page.waitForTimeout(1500);
  }

  /**
   * Clicks Clear button inside iframe to reset form search criteria
   */
  async clickClearButton() {
    const clearBtn = this.getFrame().locator(this.selectors.searchPage.button.clear).first();
    await clearBtn.waitFor({ state: 'visible', timeout: 10000 });
    await clearBtn.click({ force: true });
    await this.page.waitForTimeout(1000);
  }

  /**
   * Searches patient by HN and submits
   * @param {string} hn
   */
  async searchByHN(hn) {
    await this.fillHN(hn);
    await this.clickSearchButton();
  }

  /**
   * Searches patient by Full Name and submits
   * @param {string} fullName
   */
  async searchByName(fullName) {
    await this.fillName(fullName);
    await this.clickSearchButton();
  }

  /**
   * Searches patient by Citizen ID and submits
   * @param {string} citizenId
   */
  async searchByCitizenId(citizenId) {
    await this.fillCitizenId(citizenId);
    await this.clickSearchButton();
  }

  /**
   * Searches patient by Phone Number and submits
   * @param {string} phone
   */
  async searchByPhone(phone) {
    await this.fillPhone(phone);
    await this.clickSearchButton();
  }

  /**
   * Searches patient by VN and submits
   * @param {string} vn
   */
  async searchByVN(vn) {
    await this.fillVN(vn);
    await this.clickSearchButton();
  }

  /**
   * Searches patient by AN and submits
   * @param {string} an
   */
  async searchByAN(an) {
    await this.fillAN(an);
    await this.clickSearchButton();
  }

  /**
   * Searches patient by Postal Code and submits
   * @param {string} postalCode
   */
  async searchByPostalCode(postalCode) {
    await this.fillPostalCode(postalCode);
    await this.clickSearchButton();
  }

  // --- Assertions ---

  /**
   * Asserts navigation to Patient Profile page and verifies patient details (HN, First Name, Last Name) with explicit hydration waits
   * @param {Object} expectedPatient Patient record containing hn, firstName, familyName
   */
  async assertPatientProfileLoaded(expectedPatient = {}) {
    // 1. Wait for URL redirect to patient profile: /cortex/next/patients/{hn}?views=patientInfo
    await this.page.waitForURL(this.selectors.path.patientInfoPattern, { timeout: 30000 });
    expect(this.page.url()).toMatch(/\/cortex\/next\/patients\/\d+/);

    // 2. Wait for profile HN span element to be visible
    const hnSpan = this.page.locator(this.selectors.patientProfile.hnSpan).first();
    await hnSpan.waitFor({ state: 'visible', timeout: 30000 });

    // 3. Assert HN matches expected HN
    if (expectedPatient.hn) {
      const rawText = await hnSpan.innerText();
      expect(rawText).toContain(expectedPatient.hn);
    }

    // 4. Assert First Name & Last Name visible on profile card
    if (expectedPatient.firstName) {
      await expect(this.page.getByText(expectedPatient.firstName, { exact: false }).first()).toBeVisible({ timeout: 10000 });
    }
    if (expectedPatient.familyName) {
      await expect(this.page.getByText(expectedPatient.familyName, { exact: false }).first()).toBeVisible({ timeout: 10000 });
    }
  }

  /**
   * Asserts negative path search result (No Data Found / ไม่พบข้อมูล)
   * Verifies URL remains on search page and does not navigate away to patient profile
   */
  async assertEmptySearchResult() {
    await this.page.waitForTimeout(2000);
    expect(this.page.url()).toContain('/cortex/reception/search-patient');

    const emptyContainer = this.getFrame().locator(this.selectors.searchPage.emptyStateContainer).first();
    const isVisible = await emptyContainer.isVisible({ timeout: 5000 }).catch(() => false);
    expect(isVisible).toBe(true);
  }

  /**
   * Asserts that all search input fields are cleared / empty
   */
  async assertSearchFormCleared() {
    const frame = this.getFrame();
    const hnVal = await frame.locator(this.selectors.searchPage.input.hn).first().inputValue();
    const nameVal = await frame.locator(this.selectors.searchPage.input.name).first().inputValue();
    const cidVal = await frame.locator(this.selectors.searchPage.input.citizenId).first().inputValue();

    expect(hnVal).toBe('');
    expect(nameVal).toBe('');
    expect(cidVal).toBe('');
  }
}
