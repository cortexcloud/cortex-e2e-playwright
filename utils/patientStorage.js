import fs from 'fs';
import path from 'path';

/**
 * Utility to save and retrieve created patient records persistently across test runs.
 */

/**
 * Resolves the target created_patients.json file path for a site
 * @param {string} site Site identifier (e.g. 'nuh', 'tmh')
 * @returns {string}
 */
export function getStorageFilePath(site = 'nuh') {
  const rootDir = process.cwd();
  return path.join(rootDir, 'sites', site.toLowerCase(), 'test_data', 'created_patients.json');
}

/**
 * Retrieves all previously created patient records for a site
 * @param {string} site Site identifier ('nuh', 'tmh')
 * @returns {Array<Object>}
 */
export function getCreatedPatients(site = 'nuh') {
  const filePath = getStorageFilePath(site);
  if (!fs.existsSync(filePath)) {
    return [];
  }
  try {
    const rawData = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(rawData);
  } catch (error) {
    return [];
  }
}

/**
 * Appends a newly created patient record to created_patients.json without overwriting existing entries
 * @param {Object} patientRecord Patient details (hn, idCardNumber, firstName, familyName, gender, birthDateBE, age, etc.)
 * @param {string} site Site identifier ('nuh', 'tmh')
 * @returns {Array<Object>} Updated list of created patients
 */
export function saveCreatedPatient(patientRecord, site = 'nuh') {
  const filePath = getStorageFilePath(site);

  // Ensure target directory exists
  const dirPath = path.dirname(filePath);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }

  const existingPatients = getCreatedPatients(site);

  const newRecord = {
    ...patientRecord,
    createdAt: patientRecord.createdAt || new Date().toISOString(),
  };

  existingPatients.push(newRecord);

  fs.writeFileSync(filePath, JSON.stringify(existingPatients, null, 2), 'utf8');
  return existingPatients;
}
