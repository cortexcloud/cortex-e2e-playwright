const { generateThaiCitizenID } = require('./identityGenerator.js');

const MALE_NAMES = ['สมชาย', 'วิชัย', 'กิตติ', 'อนุชา', 'พงศกร', 'ธีรเดช', 'ณัฐวุฒิ', 'ศุภชัย'];
const FEMALE_NAMES = ['สมหญิง', 'สุดา', 'อรุณี', 'กนกวรรณ', 'นภา', 'พรทิพย์', 'จินตนา', 'ศิริพร'];
const LAST_NAMES = ['ใจดี', 'มั่นคง', 'ขยันดี', 'รักเรียน', 'แสงทอง', 'แจ่มใส', 'วงศ์สุวรรณ', 'รัตนกุล'];

/**
 * Calculates exact age in years from a Buddhist Era (BE/พ.ศ.) birthdate string (DD/MM/YYYY)
 * @param {string} dobBE Formatted date string DD/MM/YYYY in BE
 * @param {number} [currentYearCE=2026] Current CE year
 * @returns {number} Calculated age
 */
function calculateAgeFromDOBBE(dobBE, currentYearCE = 2026) {
  if (!dobBE || typeof dobBE !== 'string') return 0;
  const parts = dobBE.split('/');
  if (parts.length !== 3) return 0;

  const day = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10);
  const yearBE = parseInt(parts[2], 10);

  const yearCE = yearBE - 543;
  const currentYearBE = currentYearCE + 543;

  let age = currentYearBE - yearBE;
  return age >= 0 ? age : 0;
}

/**
 * Calculates Buddhist Era (BE/พ.ศ.) birthdate string in 01/01/YYYY format from age
 * @param {number|string} age Age in years
 * @param {number} [currentYearCE=2026] Current CE year
 * @returns {string} Formatted birthdate string "01/01/YYYY" in BE
 */
function calculateDOBBEFromAge(age, currentYearCE = 2026) {
  const numericAge = typeof age === 'number' ? age : parseInt(age, 10);
  if (isNaN(numericAge) || numericAge < 0) return '01/01/2569';

  const currentYearBE = currentYearCE + 543; // 2569 for 2026
  const birthYearBE = currentYearBE - numericAge;

  return `01/01/${birthYearBE}`;
}

/**
 * Generates randomized patient test data
 * @param {Object} [options]
 * @param {'male'|'female'|'any'} [options.gender='any']
 * @param {number} [options.minAge=20]
 * @param {number} [options.maxAge=80]
 * @returns {Object} Random patient dataset
 */
function generateRandomPatient(options = {}) {
  const { gender = 'any', minAge = 20, maxAge = 80 } = options;

  let selectedGender = gender;
  if (selectedGender === 'any') {
    selectedGender = Math.random() > 0.5 ? 'male' : 'female';
  }

  let firstName = '';
  let prefixOptionText = '';
  let prefixSearchText = '';

  if (selectedGender === 'male') {
    firstName = MALE_NAMES[Math.floor(Math.random() * MALE_NAMES.length)];
    prefixOptionText = '003 - นาย';
    prefixSearchText = '';
  } else {
    firstName = FEMALE_NAMES[Math.floor(Math.random() * FEMALE_NAMES.length)];
    const isSingle = Math.random() > 0.5;
    prefixOptionText = isSingle ? '004 - นางสาว' : '005 - นาง';
    prefixSearchText = 'นาง';
  }

  const familyName = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
  const age = Math.floor(Math.random() * (maxAge - minAge + 1)) + minAge;
  const birthDateBE = calculateDOBBEFromAge(age);
  const idCardNumber = generateThaiCitizenID();

  return {
    gender: selectedGender,
    prefixOptionText,
    prefixSearchText,
    idCardNumber,
    firstName,
    familyName,
    age,
    birthDateBE,
  };
}

module.exports = {
  calculateAgeFromDOBBE,
  calculateDOBBEFromAge,
  generateRandomPatient,
};
