/* ═══════════════════════════════════════════════════════════
   SOUTH AFRICAN NATIONAL ID VALIDATOR
   Format: YYMMDD SSSS C A Z (13 digits)
   - YYMMDD: Date of Birth
   - SSSS: Gender (0000 - 4999 Female, 5000 - 9999 Male)
   - C: Citizenship (0 = SA Citizen, 1 = Permanent Resident)
   - A: Usually 8 (historically racial classification, now standard)
   - Z: Luhn Checksum Control Digit
═══════════════════════════════════════════════════════════ */

export interface SaIdValidationResult {
  isValid: boolean;
  idNumber?: string;
  dob?: Date;
  dobFormatted?: string;
  gender?: 'Male' | 'Female';
  isCitizen?: boolean;
  citizenshipStatus?: string;
  error?: string;
}

export function validateSouthAfricanId(id: string): SaIdValidationResult {
  if (!id) {
    return { isValid: false, error: 'ID number cannot be empty.' };
  }

  const cleanId = id.toString().trim().replace(/[\s-]/g, '');

  if (!/^\d{13}$/.test(cleanId)) {
    return {
      isValid: false,
      error: `ID number must contain exactly 13 numeric digits (received ${cleanId.length}).`
    };
  }

  // 1. Extract Date of Birth (YYMMDD)
  const yyStr = cleanId.substring(0, 2);
  const mmStr = cleanId.substring(2, 4);
  const ddStr = cleanId.substring(4, 6);

  const yy = parseInt(yyStr, 10);
  const mm = parseInt(mmStr, 10);
  const dd = parseInt(ddStr, 10);

  // Month bounds check
  if (mm < 1 || mm > 12) {
    return { isValid: false, error: `Invalid birth month: ${mmStr}.` };
  }

  // Determine century based on sensible cutoff (current year 2027)
  const currentYearLastTwo = 27; // 2027 academic year
  const fullYear = yy <= currentYearLastTwo ? 2000 + yy : 1900 + yy;

  // Day bounds check
  const daysInMonth = new Date(fullYear, mm, 0).getDate();
  if (dd < 1 || dd > daysInMonth) {
    return { isValid: false, error: `Invalid birth day: ${ddStr} for month ${mmStr} in year ${fullYear}.` };
  }

  const dob = new Date(fullYear, mm - 1, dd);

  // Age validation: Students typically between 16 and 100 years old
  const today = new Date(2027, 1, 1); // 2027 academic baseline
  const age = today.getFullYear() - dob.getFullYear();
  if (age < 15 || age > 95) {
    return { isValid: false, error: `Calculated age (${age}) is outside expected student range.` };
  }

  // 2. Gender determination
  const genderCode = parseInt(cleanId.substring(6, 10), 10);
  const gender: 'Male' | 'Female' = genderCode >= 5000 ? 'Male' : 'Female';

  // 3. Citizenship determination
  const citizenshipDigit = parseInt(cleanId.charAt(10), 10);
  const isCitizen = citizenshipDigit === 0;
  const citizenshipStatus = isCitizen ? 'South African Citizen' : 'Permanent Resident';

  // 4. South African Luhn Checksum Algorithm
  // Step A: Sum all digits in odd positions (indices 0, 2, 4, 6, 8, 10)
  let sumOdd = 0;
  for (let i = 0; i < 12; i += 2) {
    sumOdd += parseInt(cleanId.charAt(i), 10);
  }

  // Step B: Concatenate digits in even positions (indices 1, 3, 5, 7, 9, 11) and multiply by 2
  let evenStr = '';
  for (let i = 1; i < 12; i += 2) {
    evenStr += cleanId.charAt(i);
  }
  const evenNumTimesTwo = (parseInt(evenStr, 10) * 2).toString();

  // Step C: Sum the digits of the product
  let sumEvenDigits = 0;
  for (let i = 0; i < evenNumTimesTwo.length; i++) {
    sumEvenDigits += parseInt(evenNumTimesTwo.charAt(i), 10);
  }

  // Step D: Calculate checksum control digit
  const total = sumOdd + sumEvenDigits;
  const lastDigitOfTotal = total % 10;
  const checkDigit = (10 - lastDigitOfTotal) % 10;
  const actualCheckDigit = parseInt(cleanId.charAt(12), 10);

  if (checkDigit !== actualCheckDigit) {
    return {
      isValid: false,
      error: `Luhn checksum check failed: expected control digit ${checkDigit}, but got ${actualCheckDigit}.`
    };
  }

  const mmFormatted = mm < 10 ? `0${mm}` : mm;
  const ddFormatted = dd < 10 ? `0${dd}` : dd;

  return {
    isValid: true,
    idNumber: cleanId,
    dob,
    dobFormatted: `${fullYear}-${mmFormatted}-${ddFormatted}`,
    gender,
    isCitizen,
    citizenshipStatus
  };
}

/**
 * Validates South African phone numbers
 * Accepts formats: 0821234567, +27821234567, 071 829 4012
 */
export function validateSouthAfricanPhone(phone: string): { isValid: boolean; formatted?: string; error?: string } {
  if (!phone) return { isValid: false, error: 'Phone number cannot be empty.' };
  
  const clean = phone.replace(/[\s\-\(\)]/g, '');
  
  // Matches: 06X, 07X, 08X followed by 7 digits or +27 followed by 9 digits
  const saPhoneRegex = /^(?:\+27|0)[6-8]\d{8}$/;
  
  if (!saPhoneRegex.test(clean)) {
    return {
      isValid: false,
      error: 'Must be a valid South African mobile number (e.g., 071 829 4012 or +27821234567).'
    };
  }

  let formatted = clean;
  if (formatted.startsWith('+27')) {
    formatted = '0' + formatted.substring(3);
  }
  formatted = `${formatted.substring(0, 3)} ${formatted.substring(3, 6)} ${formatted.substring(6)}`;

  return {
    isValid: true,
    formatted
  };
}
