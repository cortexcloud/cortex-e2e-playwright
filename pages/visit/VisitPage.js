const { expect } = require('@playwright/test');
const { visitLocators } = require('./visitLocators.js');

/**
 * Shared Base Visit Page Object Model (Reception Module)
 * Covers the "Create Visit" flow, reachable via 2 entry channels:
 *   Channel 1: Top navbar search -> patient page right-hand menu -> "จัดการ Visit"
 *   Channel 2: Search Patient page (iframe) -> "+ Visit ใหม่" button
 * Both channels converge on the same "จัดการ Visit" form, which always renders top-level.
 */
export class VisitPage {
  /**
   * @param {import('@playwright/test').Page} page
   * @param {Object} [customSelectors]
   */
  constructor(page, customSelectors = {}) {
    this.page = page;

    const selectors = {
      reception: { ...visitLocators.reception, ...(customSelectors.reception || {}) },
      navbarSearch: { ...visitLocators.navbarSearch, ...(customSelectors.navbarSearch || {}) },
      patientPage: { ...visitLocators.patientPage, ...(customSelectors.patientPage || {}) },
      searchPage: { ...visitLocators.searchPage, ...(customSelectors.searchPage || {}) },
      form: { ...visitLocators.form, ...(customSelectors.form || {}) },
      enHistory: { ...visitLocators.enHistory, ...(customSelectors.enHistory || {}) },
      toast: { ...visitLocators.toast, ...(customSelectors.toast || {}) },
      path: { ...visitLocators.path, ...(customSelectors.path || {}) },
    };

    this.selectors = selectors;
  }

  /**
   * Gets frameLocator for the embedded reception iframe (used by Channel 2's search step only —
   * the Visit form itself is always top-level).
   * @returns {import('@playwright/test').FrameLocator}
   */
  getReceptionFrame() {
    return this.page.frameLocator(this.selectors.reception.iframe);
  }

  /**
   * Gets current base URL from environment or config
   * @returns {string}
   */
  getBaseUrl() {
    return process.env.BASE_URL || process.env.NUH_URL || '';
  }

  // ---------- Channel 1: Top navbar search -> "จัดการ Visit" menu ----------

  /**
   * Searches for a patient via the top navbar search box (top-level, not in iframe).
   * NOTE: This search box only matches Thai Citizen ID or Name — HN does NOT work here.
   * @param {string} query Citizen ID or patient name
   */
  async searchPatientByNavbar(query) {
    const input = this.page.locator(this.selectors.navbarSearch.input);
    await input.waitFor({ state: 'visible', timeout: 15000 });
    await input.fill(query);
    await this.page.keyboard.press('Enter');
    await this.page.waitForURL(this.selectors.path.patientInfoPattern, { timeout: 15000 });
  }

  /**
   * Opens the "จัดการ Visit" panel from the patient page's right-hand menu (Channel 1).
   * NOTE: This menu item disappears once the patient already has an active/checked-in visit —
   * only call this for a freshly created patient with no existing visit.
   */
  async openManageVisitFromRightMenu() {
    const rightMenu = this.page.locator(this.selectors.patientPage.rightMenu);
    const menuItem = rightMenu.getByRole('menuitem', { name: 'จัดการ Visit' });
    await menuItem.waitFor({ state: 'visible', timeout: 15000 });
    await menuItem.click();
  }

  // ---------- Channel 2: Search Patient page -> "+ Visit ใหม่" button ----------

  /**
   * Navigates to the Search Patient page and searches by HN, inside the reception iframe.
   * On an exact HN match, the app auto-navigates to the patient page — no need to click a result row.
   * NOTE: There is no direct-goto shortcut here — a page.goto() straight to the patient URL
   * never shows the "+ Visit ใหม่" button, unlike the create-patient form.
   * @param {string} hn
   */
  async searchPatientByHNInSearchPage(hn) {
    const targetUrl = `${this.getBaseUrl()}${this.selectors.path.searchPatient}`;
    await this.page.goto(targetUrl, { waitUntil: 'domcontentloaded' });
    await this.page.waitForLoadState('networkidle').catch(() => {});

    const frame = this.getReceptionFrame();
    const hnInput = frame.locator(this.selectors.searchPage.input.hn);
    await hnInput.waitFor({ state: 'visible', timeout: 30000 });
    await hnInput.fill(hn);
    await frame.locator(this.selectors.searchPage.button.search).click();

    await this.page.waitForURL(this.selectors.path.patientInfoPattern, { timeout: 15000 });
  }

  /**
   * Clicks the "+ Visit ใหม่" entry button on the patient page's "ทะเบียนผู้ป่วย" tab
   * (lives inside the reception iframe — only reachable via searchPatientByHNInSearchPage).
   * NOTE: data-testid="select-lab-button" is mislabeled/reused from an unrelated component;
   * text match is tried first, testid is a fallback only.
   */
  async clickNewVisitButton() {
    const frame = this.getReceptionFrame();
    const button = frame.getByRole('button', { name: 'Visit ใหม่' });
    const isVisible = await button.isVisible({ timeout: 10000 }).catch(() => false);

    if (isVisible) {
      await button.click();
    } else {
      await frame.locator(this.selectors.searchPage.newVisitButton).click();
    }
  }

  // ---------- Shared: "จัดการ Visit" form (always top-level, regardless of channel) ----------

  /**
   * Selects a clinic from the Ant Design searchable Select on the Visit form.
   * @param {string} searchText Text to type to filter the option list
   * @param {string} optionText Option text to match and click
   */
  async selectClinic(searchText, optionText) {
    const clinicSelect = this.page.locator(this.selectors.form.clinicSelect);
    await clinicSelect.waitFor({ state: 'visible', timeout: 15000 });
    await clinicSelect.click();
    await this.page.keyboard.type(searchText);

    const option = this.page.locator(this.selectors.form.clinicOption, { hasText: optionText }).first();
    await option.waitFor({ state: 'visible', timeout: 15000 });
    await option.click();
  }

  /**
   * Submits the Visit form ("สร้าง" for new, "บันทึก" for edit) and dismisses the transient
   * "พิมพ์ใบนำทางไม่สำเร็จ" toast if it appears. That error comes from a secondary auto-print
   * action and does NOT mean visit creation failed — never assert on it as a failure signal.
   * @param {string} [submitLabel='สร้าง']
   */
  async submitVisitForm(submitLabel = 'สร้าง') {
    await this.page.getByRole('button', { name: submitLabel, exact: true }).click();

    const printErrorToast = this.page.locator(this.selectors.toast.printError);
    const hasToast = await printErrorToast.isVisible({ timeout: 3000 }).catch(() => false);
    if (hasToast) {
      // Best-effort dismiss; do not fail the test if the close control isn't found.
      await printErrorToast.locator('..').getByRole('button').last().click().catch(() => {});
    }
  }

  /**
   * Selects a clinic and submits the Visit form in one call.
   * @param {Object} opts
   * @param {string} opts.clinicSearchText
   * @param {string} opts.clinicOptionText
   * @param {string} [opts.submitLabel='สร้าง']
   */
  async fillAndSubmitVisitForm({ clinicSearchText, clinicOptionText, submitLabel = 'สร้าง' }) {
    await this.selectClinic(clinicSearchText, clinicOptionText);
    await this.submitVisitForm(submitLabel);
  }

  // ---------- Verify ----------

  /**
   * Opens the "ประวัติ EN" tab on the patient page.
   */
  async openENHistoryTab() {
    await this.page.getByRole('menuitem', { name: 'ประวัติ EN' }).click();
  }

  /**
   * Verifies a visit was created by checking the "ประวัติ EN" table for a checked-in row
   * matching the given clinic name, and returns its VN.
   * @param {string} clinicNameContains
   * @returns {Promise<string>} The VN of the created visit
   */
  async assertVisitCreated(clinicNameContains) {
    await this.openENHistoryTab();

    const row = this.page.locator(this.selectors.enHistory.row, { hasText: clinicNameContains }).first();
    await expect(row).toBeVisible({ timeout: 10000 });
    await expect(row.locator(this.selectors.enHistory.checkedInStatus)).toBeVisible();

    const vnText = await row.locator('td').nth(1).textContent();
    return (vnText || '').trim();
  }
}
