const { test, expect } = require('../fixtures/auth.js');
const { CreatePatientPage } = require('../pages/CreatePatientPage.js');
const { VisitPage } = require('../pages/VisitPage.js');
const { generateRandomPatient } = require('../../../utils/patientGenerator.js');
const visitData = require('../test_data/visit.json');

const { searchText: CLINIC_SEARCH_TEXT, fullName: CLINIC_FULL_NAME } = visitData.defaultClinic;

/**
 * Registers a brand-new patient and returns its data plus the generated HN.
 *
 * Visit creation requires a patient with NO active/checked-in visit — both entry points
 * ("จัดการ Visit" menu and "+ Visit ใหม่" button) disappear/stop working once a patient
 * already has one. Every visit test therefore creates its own fresh patient rather than
 * reusing one across runs (see registration.spec.js TC07 for the same underlying flow).
 * @param {import('@playwright/test').Page} authenticatedPage
 * @returns {Promise<Object>} Random patient dataset plus `hn`
 */
async function createFreshPatient(authenticatedPage) {
  const createPatientPage = new CreatePatientPage(authenticatedPage);
  await createPatientPage.openCreatePatientForm();

  const randomPatient = generateRandomPatient({ gender: 'any', minAge: 20, maxAge: 80 });
  await createPatientPage.fillPatientForm(randomPatient);
  await createPatientPage.submitForm();
  await createPatientPage.assertPatientCreated();

  const hn = await createPatientPage.getCreatedPatientHN();
  expect(hn).toBeTruthy();

  return { ...randomPatient, hn };
}

test.describe('NUH Reception Site - Create Visit Module', () => {

  // TC01: Create visit via Channel 1 - top navbar search -> "จัดการ Visit" menu (top-level, no iframe)
  test('TC01: Create visit via top navbar search and "จัดการ Visit" menu @NUH @Module @Visit @Navigation @HappyPath @Regression', async ({ authenticatedPage }) => {
    const patient = await createFreshPatient(authenticatedPage);
    const visitPage = new VisitPage(authenticatedPage);

    // Navbar search only matches Citizen ID or Name — HN does not work here
    await visitPage.searchPatientByNavbar(patient.idCardNumber);
    await visitPage.openManageVisitFromRightMenu();

    await visitPage.fillAndSubmitVisitForm({
      clinicSearchText: CLINIC_SEARCH_TEXT,
      clinicOptionText: CLINIC_FULL_NAME,
      submitLabel: 'สร้าง',
    });

    const vn = await visitPage.assertVisitCreated(CLINIC_FULL_NAME);
    expect(vn).toBeTruthy();
  });

  // TC02: Create visit via Channel 2 - Search Patient page (iframe) -> "+ Visit ใหม่" button
  test('TC02: Create visit via Search Patient page and "+ Visit ใหม่" button @NUH @Module @Visit @Navigation @HappyPath @Regression', async ({ authenticatedPage }) => {
    const patient = await createFreshPatient(authenticatedPage);
    const visitPage = new VisitPage(authenticatedPage);

    // Must go through search-patient — a direct goto() to the patient URL never shows this button
    await visitPage.searchPatientByHNInSearchPage(patient.hn);
    await visitPage.clickNewVisitButton();

    await visitPage.fillAndSubmitVisitForm({
      clinicSearchText: CLINIC_SEARCH_TEXT,
      clinicOptionText: CLINIC_FULL_NAME,
      submitLabel: 'สร้าง',
    });

    const vn = await visitPage.assertVisitCreated(CLINIC_FULL_NAME);
    expect(vn).toBeTruthy();
  });

});
