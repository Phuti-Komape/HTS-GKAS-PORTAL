/* ═══════════════════════════════════════════════════════════
   SOUTH AFRICAN NATIONAL ID VALIDATOR (JS MODULE)
   Format: YYMMDD SSSS C A Z (13 digits)
   - YYMMDD: Date of Birth
   - SSSS: Gender (0000 - 4999 Female, 5000 - 9999 Male)
   - C: Citizenship (0 = SA Citizen, 1 = Permanent Resident)
   - A: Usually 8
   - Z: Luhn Checksum Control Digit
═══════════════════════════════════════════════════════════ */

export function validateSouthAfricanId(id) {
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

  // Determine century based on 2027 academic baseline
  const currentYearLastTwo = 27;
  const fullYear = yy <= currentYearLastTwo ? 2000 + yy : 1900 + yy;

  // Day bounds check
  const daysInMonth = new Date(fullYear, mm, 0).getDate();
  if (dd < 1 || dd > daysInMonth) {
    return { isValid: false, error: `Invalid birth day: ${ddStr} for month ${mmStr} in year ${fullYear}.` };
  }

  const dob = new Date(fullYear, mm - 1, dd);

  // Age validation
  const today = new Date(2027, 1, 1);
  const age = today.getFullYear() - dob.getFullYear();
  if (age < 15 || age > 95) {
    return { isValid: false, error: `Calculated age (${age}) is outside expected student range.` };
  }

  // 2. Gender determination
  const genderCode = parseInt(cleanId.substring(6, 10), 10);
  const gender = genderCode >= 5000 ? 'Male' : 'Female';

  // 3. Citizenship determination
  const citizenshipDigit = parseInt(cleanId.charAt(10), 10);
  const isCitizen = citizenshipDigit === 0;
  const citizenshipStatus = isCitizen ? 'South African Citizen' : 'Permanent Resident';

  // 4. South African Luhn Checksum Algorithm
  let sumOdd = 0;
  for (let i = 0; i < 12; i += 2) {
    sumOdd += parseInt(cleanId.charAt(i), 10);
  }

  let evenStr = '';
  for (let i = 1; i < 12; i += 2) {
    evenStr += cleanId.charAt(i);
  }
  const evenNumTimesTwo = (parseInt(evenStr, 10) * 2).toString();

  let sumEvenDigits = 0;
  for (let i = 0; i < evenNumTimesTwo.length; i++) {
    sumEvenDigits += parseInt(evenNumTimesTwo.charAt(i), 10);
  }

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

export function validateSouthAfricanPhone(phone) {
  if (!phone) return { isValid: false, error: 'Phone number cannot be empty.' };
  
  const clean = phone.replace(/[\s\-\(\)]/g, '');
  const saPhoneRegex = /^(?:\+27|0)[6-8]\d{8}$/;
  
  if (!saPhoneRegex.test(clean)) {
    return {
      isValid: false,
      error: 'Must be a valid South African mobile number (e.g. 071 829 4012 or +27821234567).'
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
