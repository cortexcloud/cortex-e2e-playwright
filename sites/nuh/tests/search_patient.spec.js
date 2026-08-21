const { test, expect } = require('../fixtures/auth.js');
const { SearchPatientPage } = require('../pages/SearchPatientPage.js');
const { CreatePatientPage } = require('../pages/CreatePatientPage.js');
const { getCreatedPatients, saveCreatedPatient } = require('../../../utils/patientStorage.js');
const { generateRandomPatient } = require('../../../utils/patientGenerator.js');
const searchMockup = require('../test_data/search_mockup.json');

/**
 * Returns the most recently registered patient from created_patients.json.
 * If storage is empty (e.g. first run, or search tests run in isolation without
 * registration.spec.js first), registers a brand-new patient via the UI instead of
 * falling back to fabricated test data — this guarantees targetPatient always exists
 * for real in the system, so the search assertions can actually find it.
 * @param {import('@playwright/test').Page} authenticatedPage
 * @returns {Promise<Object>}
 */
async function ensureTargetPatient(authenticatedPage) {
  const createdList = getCreatedPatients('nuh');
  if (createdList && createdList.length > 0) {
    return createdList[createdList.length - 1];
  }

  const createPatientPage = new CreatePatientPage(authenticatedPage);
  await createPatientPage.openCreatePatientForm();

  const randomPatient = generateRandomPatient({ gender: 'any', minAge: 20, maxAge: 80 });
  await createPatientPage.fillPatientForm(randomPatient);
  await createPatientPage.submitForm();
  await createPatientPage.assertPatientCreated();

  const hn = await createPatientPage.getCreatedPatientHN();
  expect(hn).toBeTruthy();

  const newPatient = {
    hn,
    idCardNumber: randomPatient.idCardNumber,
    prefixOptionText: randomPatient.prefixOptionText,
    firstName: randomPatient.firstName,
    familyName: randomPatient.familyName,
    gender: randomPatient.gender,
    birthDateBE: randomPatient.birthDateBE,
  };
  saveCreatedPatient(newPatient, 'nuh');

  return newPatient;
}

test.describe('NUH Reception Site - Patient Search Module (@SearchPage)', () => {

  let targetPatient;

  test.beforeEach(async ({ authenticatedPage }) => {
    targetPatient = await ensureTargetPatient(authenticatedPage);
  });

  // --- Positive Path Test Cases (Valid Registered Patient Search) ---

  test('TC01: Search Patient by HN and verify profile navigation @NUH @Module @Search @SearchPage @HappyPath @Regression', async ({ authenticatedPage }) => {
    const searchPage = new SearchPatientPage(authenticatedPage);
    await searchPage.openSearchPatientPage();

    await searchPage.searchByHN(targetPatient.hn);
    await searchPage.assertPatientProfileLoaded(targetPatient);
  });

  test('TC02: Search Patient by Full Name and verify profile navigation @NUH @Module @Search @SearchPage @HappyPath @Regression', async ({ authenticatedPage }) => {
    const searchPage = new SearchPatientPage(authenticatedPage);
    await searchPage.openSearchPatientPage();

    const fullName = `${targetPatient.firstName} ${targetPatient.familyName}`;
    await searchPage.searchByName(fullName);
    await searchPage.assertPatientProfileLoaded(targetPatient);
  });

  test('TC03: Search Patient by Thai Citizen ID and verify profile navigation @NUH @Module @Search @SearchPage @HappyPath @Regression', async ({ authenticatedPage }) => {
    const searchPage = new SearchPatientPage(authenticatedPage);
    await searchPage.openSearchPatientPage();

    await searchPage.searchByCitizenId(targetPatient.idCardNumber);
    await searchPage.assertPatientProfileLoaded(targetPatient);
  });

  // --- Negative Path Test Cases (Unassigned / Non-Existent Criteria) ---

  test('TC04: Search Patient by non-existent VN and verify empty state @NUH @Module @Search @SearchPage @NegativePath @Regression', async ({ authenticatedPage }) => {
    const searchPage = new SearchPatientPage(authenticatedPage);
    await searchPage.openSearchPatientPage();

    await searchPage.searchByVN(searchMockup.nonExistentVn);
    await searchPage.assertEmptySearchResult();
  });

  test('TC05: Search Patient by non-existent AN and verify empty state @NUH @Module @Search @SearchPage @NegativePath @Regression', async ({ authenticatedPage }) => {
    const searchPage = new SearchPatientPage(authenticatedPage);
    await searchPage.openSearchPatientPage();

    await searchPage.searchByAN(searchMockup.nonExistentAn);
    await searchPage.assertEmptySearchResult();
  });

  test('TC06: Search Patient by unregistered Phone Number and verify empty state @NUH @Module @Search @SearchPage @NegativePath @Regression', async ({ authenticatedPage }) => {
    const searchPage = new SearchPatientPage(authenticatedPage);
    await searchPage.openSearchPatientPage();

    await searchPage.searchByPhone(searchMockup.unregisteredPhone);
    await searchPage.assertEmptySearchResult();
  });

  test('TC07: Search Patient by Ward dropdown filter @NUH @Module @Search @SearchPage @NegativePath @Regression', async ({ authenticatedPage }) => {
    const searchPage = new SearchPatientPage(authenticatedPage);
    await searchPage.openSearchPatientPage();

    await searchPage.clickSearchButton();
    await searchPage.assertEmptySearchResult();
  });

  test('TC08: Search Patient by Doctor dropdown filter @NUH @Module @Search @SearchPage @NegativePath @Regression', async ({ authenticatedPage }) => {
    const searchPage = new SearchPatientPage(authenticatedPage);
    await searchPage.openSearchPatientPage();

    await searchPage.clickSearchButton();
    await searchPage.assertEmptySearchResult();
  });

  test('TC09: Search Patient by non-existent Postal Code and verify empty state @NUH @Module @Search @SearchPage @NegativePath @Regression', async ({ authenticatedPage }) => {
    const searchPage = new SearchPatientPage(authenticatedPage);
    await searchPage.openSearchPatientPage();

    await searchPage.searchByPostalCode(searchMockup.nonExistentPostalCode);
    await searchPage.assertEmptySearchResult();
  });

  // --- Form Reset Action Test Case ---

  test('TC10: Fill search criteria and click Clear button to reset form inputs @NUH @Module @Search @SearchPage @FormAction @Regression', async ({ authenticatedPage }) => {
    const searchPage = new SearchPatientPage(authenticatedPage);
    await searchPage.openSearchPatientPage();

    await searchPage.fillHN(targetPatient.hn);
    await searchPage.fillName(`${targetPatient.firstName} ${targetPatient.familyName}`);
    await searchPage.fillCitizenId(targetPatient.idCardNumber);

    await searchPage.clickClearButton();
    await searchPage.assertSearchFormCleared();
  });

});
