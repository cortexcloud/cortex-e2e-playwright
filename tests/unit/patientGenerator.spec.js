const { test, expect } = require('@playwright/test');
const {
  calculateAgeFromDOBBE,
  calculateDOBBEFromAge,
  generateRandomPatient,
} = require('../../utils/patientGenerator.js');

test.describe('Patient Generator Utilities Unit Tests', () => {

  test('calculateAgeFromDOBBE should calculate age correctly for BE birth year', () => {
    // Birth year 2533 BE -> 1990 CE, in 2026 (2569 BE) age should be 36
    const age = calculateAgeFromDOBBE('15/05/2533', 2026);
    expect(age).toBe(36);
  });

  test('calculateDOBBEFromAge should calculate birthdate string 01/01/พ.ศ. from age', () => {
    // Age 49 in 2026 (2569 BE) -> Birth year 2520 BE
    const dobBE = calculateDOBBEFromAge(49, 2026);
    expect(dobBE).toBe('01/01/2520');
  });

  test('generateRandomPatient should generate valid male patient data', () => {
    const patient = generateRandomPatient({ gender: 'male', minAge: 20, maxAge: 80 });
    expect(patient.gender).toBe('male');
    expect(patient.prefixOptionText).toBe('003 - นาย');
    expect(patient.idCardNumber).toHaveLength(13);
    expect(patient.firstName).toBeTruthy();
    expect(patient.familyName).toBeTruthy();
    expect(patient.age).toBeGreaterThanOrEqual(20);
    expect(patient.age).toBeLessThanOrEqual(80);
  });

  test('generateRandomPatient should generate valid female patient data', () => {
    const patient = generateRandomPatient({ gender: 'female', minAge: 20, maxAge: 80 });
    expect(patient.gender).toBe('female');
    expect(['004 - นางสาว', '005 - นาง']).toContain(patient.prefixOptionText);
    expect(patient.idCardNumber).toHaveLength(13);
    expect(patient.firstName).toBeTruthy();
    expect(patient.familyName).toBeTruthy();
    expect(patient.age).toBeGreaterThanOrEqual(20);
    expect(patient.age).toBeLessThanOrEqual(80);
  });

});
