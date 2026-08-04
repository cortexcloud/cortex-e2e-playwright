const { test, expect } = require('../fixtures/auth.js');
const { CreatePatientPage } = require('../pages/CreatePatientPage.js');
const patientData = require('../test_data/patient.json');
const {
  calculateAgeFromDOBBE,
  calculateDOBBEFromAge,
  generateRandomPatient,
} = require('../../../utils/patientGenerator.js');
const { saveCreatedPatient } = require('../../../utils/patientStorage.js');

test.describe('NUH Reception Site - Patient Registration Module', () => {

  // TC01: Create patient entry via Radix theme CSS selector button
  test('TC01: Open create patient form via Radix theme CSS path button @NUH @Module @Registration @Navigation @Regression', async ({ authenticatedPage }) => {
    const createPatientPage = new CreatePatientPage(authenticatedPage);
    await createPatientPage.openReceptionPage();

    // Verify entry button exists and is clickable
    await createPatientPage.clickCreatePatientByRadixSelector();
    await createPatientPage.assertCreatePatientPageHeading('สร้างผู้ป่วยใหม่');
    await expect(authenticatedPage).toHaveURL(/create-patient/);
  });

  // TC02: Create patient entry via span.button-label-overflow button
  test('TC02: Open create patient form via span.button-label-overflow button @NUH @Module @Registration @Navigation @Regression', async ({ authenticatedPage }) => {
    const createPatientPage = new CreatePatientPage(authenticatedPage);
    await createPatientPage.openReceptionPage();

    // Verify entry button exists and is clickable
    await createPatientPage.clickCreatePatientBySpanLabel();
    await createPatientPage.assertCreatePatientPageHeading('สร้างผู้ป่วยใหม่');
    await expect(authenticatedPage).toHaveURL(/create-patient/);
  });

  // TC03: Submit empty form and verify required field validation errors
  test('TC03: Submit empty form and verify required field errors @NUH @Module @Registration @NegativePath @Regression', async ({ authenticatedPage }) => {
    const createPatientPage = new CreatePatientPage(authenticatedPage);
    await createPatientPage.openCreatePatientForm();

    // Assert form heading title
    await createPatientPage.assertCreatePatientPageHeading('สร้างผู้ป่วยใหม่');

    // Click submit without filling required fields
    await createPatientPage.submitForm();

    // Assert form remains on create-patient page due to validation errors
    await createPatientPage.assertRequiredFieldValidationErrors();
  });

  // TC04: Submit Citizen ID with less than 13 digits and verify error
  test('TC04: Submit Citizen ID with less than 13 digits and verify error @NUH @Module @Registration @NegativePath @Regression', async ({ authenticatedPage }) => {
    const createPatientPage = new CreatePatientPage(authenticatedPage);
    await createPatientPage.openCreatePatientForm();

    // Assert form heading title
    await createPatientPage.assertCreatePatientPageHeading('สร้างผู้ป่วยใหม่');

    const sample = patientData.malePatient;
    const invalidShortId = patientData.invalidCitizenIdShort; // 11 digits

    await createPatientPage.selectGender(sample.gender);
    await createPatientPage.selectFromSearchbox('prefixName', sample.prefixSearchText, sample.prefixOptionText);
    await createPatientPage.fillCitizenId(invalidShortId);
    await createPatientPage.fillName(sample.firstName, sample.familyName);
    await createPatientPage.fillBirthDateBE(sample.birthDateBE);

    await createPatientPage.submitForm();

    // Assert form validation error prevents submission
    await createPatientPage.assertInvalidCitizenIdError();
  });

  // TC05: Fill DOB (BE) and verify age is automatically calculated correctly
  test('TC05: Verify automatic age calculation from DOB (BE) @NUH @Module @Registration @Calculation @Regression', async ({ authenticatedPage }) => {
    const createPatientPage = new CreatePatientPage(authenticatedPage);
    await createPatientPage.openCreatePatientForm();

    // Assert form heading title
    await createPatientPage.assertCreatePatientPageHeading('สร้างผู้ป่วยใหม่');

    const dobBE = '15/05/2533'; // 1990 CE
    await createPatientPage.fillBirthDateBE(dobBE);

    // Verify auto-calculated age matches calculateAgeFromDOBBE utility
    await createPatientPage.assertAgeMatchesCalculated(dobBE);
  });

  // TC06: Fill Age and verify DOB is automatically calculated as 01/01/พ.ศ.
  test('TC06: Verify automatic DOB calculation (01/01/พ.ศ.) from Age @NUH @Module @Registration @Calculation @Regression', async ({ authenticatedPage }) => {
    const createPatientPage = new CreatePatientPage(authenticatedPage);
    await createPatientPage.openCreatePatientForm();

    // Assert form heading title
    await createPatientPage.assertCreatePatientPageHeading('สร้างผู้ป่วยใหม่');

    const targetAge = 49;
    await createPatientPage.fillAge(targetAge);

    // Verify auto-calculated birthdate matches calculateDOBBEFromAge utility (e.g. 01/01/2520 for age 49)
    await createPatientPage.assertDOBMatchesCalculated(targetAge);
  });

  // TC07: Register new patient using randomized patient data (Age 20-80), capture HN, search by HN, and save to created_patients.json
  test('TC07: Complete registration with randomly generated patient (Age 20-80), capture HN, and search by HN @NUH @Module @Registration @HappyPath @DataDriven @Search @Regression', async ({ authenticatedPage }) => {
    const createPatientPage = new CreatePatientPage(authenticatedPage);
    await createPatientPage.openCreatePatientForm();

    // Assert form heading title
    await createPatientPage.assertCreatePatientPageHeading('สร้างผู้ป่วยใหม่');

    // Generate random patient data (Male or Female, Age 20-80, Valid Thai CID)
    const randomPatient = generateRandomPatient({ gender: 'any', minAge: 20, maxAge: 80 });

    await createPatientPage.fillPatientForm(randomPatient);

    // Sanity check calculated age
    const age = await createPatientPage.getCalculatedAge();
    expect(Number(age)).toBeGreaterThanOrEqual(20);
    expect(Number(age)).toBeLessThanOrEqual(80);

    // Submit form and assert patient creation redirect
    await createPatientPage.submitForm();
    await createPatientPage.assertPatientCreated();

    // Assert patient profile details (First Name, Last Name, Citizen ID) on patient info page
    await createPatientPage.assertPatientProfileDetails(randomPatient);

    // Capture generated HN / Patient ID (e.g. "69007582")
    const patientHN = await createPatientPage.getCreatedPatientHN();
    expect(patientHN).toBeTruthy();
    expect(patientHN.toUpperCase()).not.toBe('CORTEX');

    // Automatically append created patient record to created_patients.json without overwriting
    saveCreatedPatient({
      hn: patientHN,
      idCardNumber: randomPatient.idCardNumber,
      prefixOptionText: randomPatient.prefixOptionText,
      firstName: randomPatient.firstName,
      familyName: randomPatient.familyName,
      gender: randomPatient.gender,
      birthDateBE: randomPatient.birthDateBE,
      age: Number(age),
    }, 'nuh');

    // Perform patient search by captured HN
    await createPatientPage.searchPatientByHN(patientHN);

    // Assert search result opens the patient profile page matching HN
    await createPatientPage.assertPatientSearchResult(patientHN);
    await createPatientPage.assertPatientProfileDetails(randomPatient);
  });

});
