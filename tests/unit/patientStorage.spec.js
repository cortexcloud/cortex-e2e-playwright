import { test, expect } from '@playwright/test';
import fs from 'fs';
import { saveCreatedPatient, getCreatedPatients, getStorageFilePath } from '../../utils/patientStorage.js';

test.describe('Patient Storage Utilities Unit Tests', () => {
  const TEST_SITE = 'unit_test_dummy';

  test.afterAll(() => {
    const filePath = getStorageFilePath(TEST_SITE);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  });

  test('should append created patient records without overwriting existing entries', () => {
    const testRecord1 = {
      hn: '690000001',
      idCardNumber: '1100800123451',
      firstName: 'ทดสอบ1',
      familyName: 'นามสกุล1',
      gender: 'male',
      birthDateBE: '01/01/2530',
      age: 39,
    };

    const testRecord2 = {
      hn: '690000002',
      idCardNumber: '1100800123452',
      firstName: 'ทดสอบ2',
      familyName: 'นามสกุล2',
      gender: 'female',
      birthDateBE: '15/05/2535',
      age: 34,
    };

    const initialList = getCreatedPatients(TEST_SITE);
    const initialLength = initialList.length;

    // Save record 1
    const updatedList1 = saveCreatedPatient(testRecord1, TEST_SITE);
    expect(updatedList1.length).toBe(initialLength + 1);
    expect(updatedList1[updatedList1.length - 1].hn).toBe('690000001');

    // Save record 2 (should append, not overwrite record 1)
    const updatedList2 = saveCreatedPatient(testRecord2, TEST_SITE);
    expect(updatedList2.length).toBe(initialLength + 2);
    expect(updatedList2[updatedList2.length - 2].hn).toBe('690000001');
    expect(updatedList2[updatedList2.length - 1].hn).toBe('690000002');
  });

});
