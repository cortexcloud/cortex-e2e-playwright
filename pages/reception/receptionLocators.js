/**
 * Reception Module Locators Dictionary
 * Contains pure selector strings for Patient Registration form, Search, and entry points.
 *
 * Confirmed from live DOM inspection (2026-08-19): the entire Reception module renders
 * inside an embedded iframe (src pattern `/reception/embedded/...`), separate from the
 * Keycloak SSO iframes (`keycloak-session-iframe`, `keycloak-silent-check-sso`) that are
 * also present on every page. All form/field locators below live INSIDE that iframe and
 * must be queried via `page.frameLocator(receptionLocators.iframe)`, never `page.locator()`.
 */
export const receptionLocators = {
  iframe: 'iframe[src*="/reception/embedded/"]',
  heading: '[data-testid="patient-container-title"]',
  entry: {
    // Main entry button on the Search Patient page (inside the iframe)
    createPatientButton: '[data-testid="create-patient-button"]',
    // Secondary "+ สร้างผู้ป่วยใหม่" call-to-action inside the idle/empty-state card.
    // No dedicated data-testid confirmed yet — disambiguated from createPatientButton by its "+" prefix text.
    createPatientIdleStateButton: String.raw`text=/\+\s*สร้างผู้ป่วยใหม่/`,
  },
  headerSearch: {
    // Lives on the parent shell page (NOT inside the iframe) — no data-testid, id is auto-generated/unstable.
    input: 'input[placeholder="ค้นหาผู้ป่วย"]',
    optionItem: 'div[role="option"], ul.search-results > li',
  },
  searchPage: {
    path: '/cortex/reception/search-patient',
    tab: {
      activated: '[data-testid="tab-trigger-activated"]',
      deactivated: '[data-testid="tab-trigger-deactivated"]',
    },
    input: {
      hn: '[data-testid="hn"]',
      name: '[data-testid="name"]',
      citizenId: '[data-testid="cid"]',
      phone: '[data-testid="phoneNumber"]',
      vn: '[data-testid="vn"]',
      an: '[data-testid="an"]',
      postalCode: '[data-testid="postalCode"]',
    },
    select: {
      // Not covered by DOM inspection yet — placeholder guesses, verify before relying on these.
      ward: 'select[name="ward"], [data-testid="ward-select"], div:has-text("วอร์ด") + select, div:has-text("วอร์ด") [role="combobox"]',
      doctor: 'select[name="doctor"], [data-testid="doctor-select"], div:has-text("แพทย์") + select, div:has-text("แพทย์") [role="combobox"]',
    },
    button: {
      search: '[data-testid="search-button"]',
      clear: '[data-testid="clear-button"]',
      readCard: 'button:has-text("อ่านบัตร")',
    },
    emptyStateContainer: '[data-testid="idle-state"]',
  },
  patientProfile: {
    hnSpan: 'span[class*="_patient-profile-hn_"]',
    hnText: 'span[class*="_patient-profile-hn_"] b, span[class*="_patient-profile-hn_"]',
    nameHeader: 'span[class*="_patient-profile-hn_"] ~ span, div:has-text("ข้อมูลผู้ป่วย")',
    citizenIdLabel: 'text=รหัสประจำตัวประชาชน',
    fullNameLabel: 'text=ชื่อ-นามสกุล',
  },
  button: {
    submit: '[data-testid="submit-button"]',
    cancel: '[data-testid="cancel-button"]',
  },
  input: {
    citizenId: '[data-testid="identifyVerification.identify"]',
    firstName: '[data-testid="firstName"]',
    middleName: '[data-testid="middleName"]',
    familyName: '[data-testid="familyName"]',
    firstNameEN: '[data-testid="firstNameEN"]',
    familyNameEN: '[data-testid="familyNameEN"]',
    birthDate: '[data-testid="birthDate"]',
    age: '[data-testid="age"]',
    // data-testid="mobile-phone-input" is reused on 4 fields (patient mobile/home,
    // emergency contact mobile/home) — the `name` attribute is required to disambiguate.
    mobilePhone: '[data-testid="mobile-phone-input"][name="mobilePhoneNumber"]',
    remark: '[data-testid="remark"]',
  },
  select: {
    gender: 'select[name="gender"]',
    verificationMode: 'select[name="identifyVerification.verificationMode"]',
    primaryLanguage: 'select[name="primaryLanguage"]',
  },
  searchbox: {
    triggerPrefix: '[data-testid="searchbox-trigger-prefixName-searchbox"]',
    triggerByName: (fieldName) => `[data-testid="searchbox-trigger-${fieldName}-searchbox"]`,
    searchInputByName: (fieldName) => `[data-testid="searchbox-search-${fieldName}-searchbox"]`,
    optionItem: 'div[role="option"]',
  },
  path: {
    createPatient: '/cortex/reception/create-patient',
    searchPatient: '/cortex/reception/search-patient',
    patientInfoPattern: /\/cortex\/next\/patients\/\d+/,
  },
};
