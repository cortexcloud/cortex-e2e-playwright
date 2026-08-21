/**
 * Visit Module Locators Dictionary (Cortex HIS)
 * Contains pure selector strings for the "Create Visit" flow — reachable via 2 entry channels.
 *
 * Confirmed from live DOM inspection (2026-08-19):
 * - The "จัดการ Visit" / "แก้ไข Visit" form that opens from EITHER channel always renders at
 *   the TOP-LEVEL document — never inside an iframe, even though Channel 2's entry button
 *   lives inside the reception embedded iframe.
 * - Channel 2 requires navigating through /cortex/reception/search-patient first — a direct
 *   page.goto() to the patient URL never shows the "+ Visit ใหม่" button (unlike create-patient,
 *   which does support a direct goto — don't assume the same rule applies here).
 * - Both entry points ("จัดการ Visit" menu item, "+ Visit ใหม่" button) are dynamic: they
 *   disappear/stop working once the patient already has an active/checked-in visit.
 */
export const visitLocators = {
  reception: {
    iframe: 'iframe[src*="/reception/embedded/"]',
  },
  navbarSearch: {
    // Top-level, NOT inside the iframe. Matches Thai Citizen ID or Name only — HN does not work here.
    input: 'input[placeholder="ค้นหาผู้ป่วย"]',
  },
  patientPage: {
    rightMenu: 'nav[aria-label="patient-right-menu"]',
  },
  searchPage: {
    input: {
      hn: '[data-testid="hn"]',
    },
    button: {
      search: '[data-testid="search-button"]',
    },
    // NOTE: Mislabeled/reused testid from an unrelated "select lab" component — text match is primary.
    newVisitButton: '[data-testid="select-lab-button"]',
  },
  form: {
    // Ant Design searchable <Select> — has a real, confirmed data-testid.
    clinicSelect: '[data-testid="create-visit-clinic-select"]',
    clinicOption: '.ant-select-item-option',
    coveragePlaceholder: 'สิทธิการรักษา',
  },
  enHistory: {
    row: 'tr',
    checkedInStatus: 'text=เช็คอิน',
  },
  toast: {
    printError: 'text=พิมพ์ใบนำทางไม่สำเร็จ',
  },
  path: {
    searchPatient: '/cortex/reception/search-patient',
    patientInfoPattern: /\/cortex\/next\/patients\/\d+/,
  },
};
