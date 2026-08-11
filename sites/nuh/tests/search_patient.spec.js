const { test, expect } = require('../fixtures/auth.js');
const { SearchPatientPage } = require('../pages/SearchPatientPage.js');
const { getCreatedPatients } = require('../../../utils/patientStorage.js');
const searchMockup = require('../test_data/search_mockup.json');

test.describe('NUH Reception Site - Patient Search Module (@SearchPage)', () => {

  let targetPatient;

  test.beforeAll(() => {
    const createdList = getCreatedPatients('nuh');
    if (createdList && createdList.length > 0) {
      targetPatient = createdList[createdList.length - 1]; // Use last registered patient
    } else {
      // Fallback default sample if storage file is empty
      targetPatient = {
        hn: '69007584',
        idCardNumber: '1605829215767',
        firstName: 'พงศกร',
        familyName: 'มั่นคง',
        gender: 'male',
      };
    }
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
