// scratch/test-otp-and-documents.js
// Exhaustive test suite for Cryptographic OTP Verification & File Upload Magic Byte / Tamper Validation

import assert from 'assert';
import crypto from 'crypto';
import { db } from '../server/db.js';

console.log('=== RUNNING TESTS: CRYPTOGRAPHIC OTP & DOCUMENT VALIDATION ===\n');

let passCount = 0;
function test(name, fn) {
  try {
    fn();
    console.log(`✓ PASS: ${name}`);
    passCount++;
  } catch (err) {
    console.error(`❌ FAIL: ${name}`);
    console.error(err);
    process.exit(1);
  }
}

async function runAsyncTest(name, fn) {
  try {
    await fn();
    console.log(`✓ PASS: ${name}`);
    passCount++;
  } catch (err) {
    console.error(`❌ FAIL: ${name}`);
    console.error(err);
    process.exit(1);
  }
}

// ─── 1. OTP GENERATION & STORAGE TESTS ───

test('sendOtp generates a 6-digit random code and SHA-256 hash', () => {
  const contact = '0821112233';
  const result = db.sendOtp(contact, 'sms');

  assert.strictEqual(result.success, true, 'sendOtp returns success: true');
  assert.ok(result.code, 'returns code in dev mode');
  assert.strictEqual(result.code.length, 6, 'code is 6 digits long');
  assert.match(result.code, /^\d{6}$/, 'code consists only of digits');
  assert.strictEqual(result.expiresInMinutes, 5, 'indicates 5 minute expiry');

  // Verify internal DB challenge representation
  const challenge = db.data.otpChallenges[contact];
  assert.ok(challenge, 'challenge is stored in DB');
  assert.strictEqual(challenge.attempts, 0, 'attempts initialized to 0');
  assert.ok(!challenge.code, 'plain code is NOT stored in DB challenge object');
  assert.ok(challenge.hash, 'SHA-256 hash is stored');

  // Verify hash matches plainCode
  const expectedHash = crypto.createHash('sha256').update(result.code).digest('hex');
  assert.strictEqual(challenge.hash, expectedHash, 'stored hash matches SHA-256 of plain code');

  // Expiry should be ~5 minutes from now
  const expiresMs = new Date(challenge.expiresAt).getTime();
  const diffMinutes = (expiresMs - Date.now()) / (60 * 1000);
  assert.ok(diffMinutes > 4.8 && diffMinutes <= 5.1, 'expiresAt set to 5 minutes');
});

test('sendOtp generates different random codes across invocations (cryptographically random)', () => {
  const codes = new Set();
  for (let i = 0; i < 20; i++) {
    const res = db.sendOtp(`082000000${i}`, 'sms');
    codes.add(res.code);
  }
  assert.ok(codes.size >= 19, 'codes are randomly distributed');
});

test('sendOtp rejects empty contact', () => {
  const res = db.sendOtp('', 'sms');
  assert.strictEqual(res.success, false);
});

// ─── 2. OTP VERIFICATION & RATE-LIMITING TESTS ───

test('verifyOtp succeeds with correct PIN and deletes active challenge', () => {
  const contact = '0834445566';
  const sendRes = db.sendOtp(contact, 'sms');
  const code = sendRes.code;

  const verifyRes = db.verifyOtp(contact, code);
  assert.strictEqual(verifyRes.success, true);
  assert.strictEqual(verifyRes.verified, true);

  // Challenge should be purged
  assert.strictEqual(db.data.otpChallenges[contact], undefined, 'challenge removed after successful verification');
});

test('verifyOtp rejects legacy static bypass PIN 784210 when challenge code differs', () => {
  const contact = '0845556677';
  const sendRes = db.sendOtp(contact, 'sms');
  if (sendRes.code === '784210') {
    // Highly improbable, but regenerate if clashed
    db.sendOtp(contact, 'sms');
  }

  const bypassRes = db.verifyOtp(contact, '784210');
  assert.strictEqual(bypassRes.success, false, 'hardcoded 784210 bypass blocked');
  assert.ok(bypassRes.error.includes('attempt(s) remaining'), 'increments attempt count');
});

test('verifyOtp tracks attempts and invalidates challenge after 3 failed attempts', () => {
  const contact = '0856667788';
  db.sendOtp(contact, 'sms');

  // Attempt 1: wrong PIN
  const res1 = db.verifyOtp(contact, '000000');
  assert.strictEqual(res1.success, false);
  assert.strictEqual(db.data.otpChallenges[contact].attempts, 1);
  assert.ok(res1.error.includes('2 attempt(s) remaining'));

  // Attempt 2: wrong PIN
  const res2 = db.verifyOtp(contact, '111111');
  assert.strictEqual(res2.success, false);
  assert.strictEqual(db.data.otpChallenges[contact].attempts, 2);
  assert.ok(res2.error.includes('1 attempt(s) remaining'));

  // Attempt 3: wrong PIN - should lock & invalidate
  const res3 = db.verifyOtp(contact, '222222');
  assert.strictEqual(res3.success, false);
  assert.ok(res3.error.includes('Maximum verification attempts (3) exceeded'));
  assert.strictEqual(db.data.otpChallenges[contact], undefined, 'challenge deleted after 3 failed attempts');

  // Subsequent attempt should report no active challenge
  const res4 = db.verifyOtp(contact, '333333');
  assert.strictEqual(res4.success, false);
  assert.ok(res4.error.includes('No active OTP verification challenge found'));
});

test('verifyOtp rejects expired OTP codes', () => {
  const contact = '0867778899';
  const sendRes = db.sendOtp(contact, 'sms');
  const code = sendRes.code;

  // Manually backdate expiration to 10 seconds ago
  db.data.otpChallenges[contact].expiresAt = new Date(Date.now() - 10000).toISOString();

  const verifyRes = db.verifyOtp(contact, code);
  assert.strictEqual(verifyRes.success, false);
  assert.ok(verifyRes.error.includes('expired'));
  assert.strictEqual(db.data.otpChallenges[contact], undefined, 'expired challenge purged');
});

// ─── 3. FILE UPLOAD & MAGIC BYTE VALIDATION TESTS ───

test('validateDocument rejects payloads exceeding 5MB limit', () => {
  // 5MB + 10 bytes
  const largeBuffer = Buffer.alloc(5 * 1024 * 1024 + 10, 0);
  // Give it PDF magic bytes
  largeBuffer[0] = 0x25; largeBuffer[1] = 0x50; largeBuffer[2] = 0x44; largeBuffer[3] = 0x46;

  const res = db.validateDocument({
    fileName: 'large_document.pdf',
    fileBuffer: largeBuffer,
    mimeType: 'application/pdf'
  });

  assert.strictEqual(res.success, false);
  assert.strictEqual(res.status, 'rejected');
  assert.ok(res.message.includes('5MB'), 'reports 5MB limit rejection');
});

test('validateDocument rejects payloads with missing or empty buffer', () => {
  const res = db.validateDocument({
    fileName: 'empty.pdf',
    mimeType: 'application/pdf'
  });

  assert.strictEqual(res.success, false);
  assert.strictEqual(res.status, 'rejected');
  assert.ok(res.message.includes('buffer is missing or empty'));
});

test('validateDocument validates valid PDF magic bytes (%PDF-)', () => {
  const validPdfHeader = Buffer.from('%PDF-1.4\n%âãÏÓ\n1 0 obj\n<< /Title (Certified ID) >>\nendobj\n%%EOF');
  const res = db.validateDocument({
    fileName: 'student_id.pdf',
    fileBuffer: validPdfHeader,
    mimeType: 'application/pdf',
    applicationId: 'APP-TEST-001'
  });

  assert.strictEqual(res.success, true);
  assert.strictEqual(res.status, 'valid');
  assert.strictEqual(res.document.mimeType, 'application/pdf');
  assert.strictEqual(res.document.validationNotes.magic_bytes_verified, true);
  assert.strictEqual(res.document.validationNotes.tamper_risk, 'low');
  assert.strictEqual(res.document.tamperScore, 0.04);
});

test('validateDocument validates valid PNG magic bytes', () => {
  // PNG signature: 89 50 4E 47 0D 0A 1A 0A
  const validPngHeader = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, 0x00, 0x00, 0x00, 0x0D, 0x49, 0x48, 0x44, 0x52]);
  const res = db.validateDocument({
    fileName: 'scan_id.png',
    fileBuffer: validPngHeader,
    mimeType: 'image/png'
  });

  assert.strictEqual(res.success, true);
  assert.strictEqual(res.status, 'valid');
  assert.strictEqual(res.document.mimeType, 'image/png');
});

test('validateDocument validates valid JPEG magic bytes', () => {
  // JPEG signature: FF D8 FF E0
  const validJpegHeader = Buffer.from([0xFF, 0xD8, 0xFF, 0xE0, 0x00, 0x10, 0x4A, 0x46, 0x49, 0x46, 0x00]);
  const res = db.validateDocument({
    fileName: 'scan_id.jpg',
    fileBuffer: validJpegHeader,
    mimeType: 'image/jpeg'
  });

  assert.strictEqual(res.success, true);
  assert.strictEqual(res.status, 'valid');
  assert.strictEqual(res.document.mimeType, 'image/jpeg');
});

test('validateDocument rejects corrupted / unknown binary formats (e.g. text/exe)', () => {
  const corruptedBuffer = Buffer.from('MZ This is an executable or random string, not a PDF');
  const res = db.validateDocument({
    fileName: 'fake.pdf',
    fileBuffer: corruptedBuffer,
    mimeType: 'application/pdf'
  });

  assert.strictEqual(res.success, false);
  assert.strictEqual(res.status, 'rejected');
  assert.ok(res.message.includes('Invalid file format or corrupted binary header'));
});

test('validateDocument rejects MIME type mismatch (declared PDF but magic bytes are PNG)', () => {
  const pngBuffer = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, 0x00, 0x00, 0x00, 0x0D]);
  const res = db.validateDocument({
    fileName: 'mismatch.pdf',
    fileBuffer: pngBuffer,
    mimeType: 'application/pdf' // Declared PDF, but actual binary is PNG
  });

  assert.strictEqual(res.success, false);
  assert.strictEqual(res.status, 'rejected');
  assert.ok(res.message.includes('MIME type mismatch'));
});

test('validateDocument accepts base64Data or fileBase64 string payloads', () => {
  // Valid PDF base64: %PDF-1.4 ...
  const pdfBase64 = Buffer.from('%PDF-1.4 clean scan document content').toString('base64');
  const res = db.validateDocument({
    fileName: 'uploaded_via_web.pdf',
    fileBase64: `data:application/pdf;base64,${pdfBase64}`,
    mimeType: 'application/pdf'
  });

  assert.strictEqual(res.success, true);
  assert.strictEqual(res.status, 'valid');
});

test('validateDocument detects manipulation metadata in buffer (Photoshop / Canva / 8BIM)', () => {
  // Valid PDF magic bytes with Photoshop / Canva metadata signature
  const tamperedBuffer = Buffer.from(
    '%PDF-1.4\n1 0 obj\n<< /Producer (Adobe Photoshop CC 2024 / Canva) /Creator (iLovePDF) >>\nendobj\n%%EOF'
  );

  const res = db.validateDocument({
    fileName: 'completely_innocent_name.pdf', // Notice: filename has NO 'photoshop' string
    fileBuffer: tamperedBuffer,
    mimeType: 'application/pdf'
  });

  assert.strictEqual(res.success, true);
  assert.strictEqual(res.status, 'tampered');
  assert.strictEqual(res.document.validationStatus, 'tampered');
  assert.strictEqual(res.document.validationNotes.tamper_risk, 'high');
  assert.strictEqual(res.document.tamperScore, 0.88);
  assert.ok(res.message.includes('High Tamper Risk'));
});

console.log(`\n======================================================`);
console.log(`✓ ALL ${passCount} OTP & DOCUMENT VALIDATION TESTS PASSED!`);
console.log(`======================================================\n`);
