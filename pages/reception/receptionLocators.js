/**
 * Reception Module Locators Dictionary
 * Contains pure selector strings for Patient Registration form, Search, and entry points.
 */
export const receptionLocators = {
  iframe: 'iframe[src*="create-patient"], iframe[src*="search-patient"], iframe[src*="reception"], iframe',
  heading: '[data-testid="patient-container-title"]',
  entry: {
    radixButtonSpan: '#radix-theme > div.rt-Box.rt-r-w-100\\% > div.rt-Box._container_19nl4_1 > div.rt-Flex._content-wrapper_19nl4_6.rt-r-display-flex.rt-r-jc-start.rt-r-position-relative > div.rt-Box._layout-content-root_19nl4_12.rt-r-w-100\\% > div > div._tabs-root_1ad9o_8 > div._tabs-list_1ad9o_15 > div > div.rt-Box.rt-r-mr-2 > div > button > span',
    buttonLabelSpan: 'span.button-label-overflow',
  },
  headerSearch: {
    input: 'input[aria-label="ค้นหาผู้ป่วย"], input[placeholder*="ค้นหาผู้ป่วย"], [role="combobox"][aria-label*="ค้นหา"]',
    optionItem: 'div[role="option"], ul.search-results > li',
  },
  searchPage: {
    path: '/cortex/reception/search-patient',
    heading: 'h1:has-text("ค้นหาผู้ป่วย"), h2:has-text("ค้นหาผู้ป่วย")',
    input: {
      hn: 'input[placeholder="HN"], input[name="hn"], [data-testid="search-hn"]',
      name: 'input[placeholder="ชื่อ - นามสกุล"], input[placeholder*="ชื่อ"], input[name="name"]',
      citizenId: 'input[placeholder="หมายเลขยืนยันตัวตน"], input[placeholder*="ยืนยันตัวตน"], input[name="citizenId"]',
      phone: 'input[placeholder="เบอร์โทรศัพท์"], input[placeholder*="โทรศัพท์"], input[name="phone"]',
      vn: 'input[placeholder="VN"], input[name="vn"]',
      an: 'input[placeholder="AN"], input[name="an"]',
      postalCode: 'input[placeholder="รหัสไปรษณีย์"], input[name="postalCode"]',
    },
    select: {
      ward: 'select[name="ward"], [data-testid="ward-select"], div:has-text("วอร์ด") + select, div:has-text("วอร์ด") [role="combobox"]',
      doctor: 'select[name="doctor"], [data-testid="doctor-select"], div:has-text("แพทย์") + select, div:has-text("แพทย์") [role="combobox"]',
    },
    button: {
      search: 'button:has-text("ค้นหา"), button[type="submit"]',
      clear: 'button:has-text("Clear")',
      readCard: 'button:has-text("อ่านบัตร")',
    },
    emptyStateContainer: 'div:has-text("ไม่พบข้อมูล"), div:has-text("ค้นหาผู้ป่วยเพื่อดำเนินการต่อ"), .empty-result-container',
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
    birthDate: '[data-testid="birthDate"]',
    age: '[data-testid="age"]',
  },
  select: {
    gender: 'select[name="gender"]',
    verificationMode: 'select[name="identifyVerification.verificationMode"]',
    primaryLanguage: 'select[name="primaryLanguage"]',
  },
  searchbox: {
    triggerPrefix: '[data-testid="searchbox-trigger-prefixName-searchbox"]',
    triggerByName: (fieldName) => `[data-testid="searchbox-trigger-${fieldName}-searchbox"]`,
    searchInput: 'input[cmdk-input]',
    optionItem: 'div[role="option"]',
  },
  path: {
    createPatient: '/cortex/reception/create-patient',
    searchPatient: '/cortex/reception/search-patient',
    patientInfoPattern: /\/cortex\/next\/patients\/\d+/,
  },
};
