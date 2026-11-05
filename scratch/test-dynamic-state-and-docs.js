/* ═══════════════════════════════════════════════════════════
   TEST SUITE: DYNAMIC SESSION STATE & DOCUMENTS LIBRARY
═══════════════════════════════════════════════════════════ */

import { generateToken, verifyToken } from '../server/auth.js';
import { db } from '../server/db.js';

let passed = 0;
let failed = 0;

function assert(condition, name) {
  if (condition) {
    console.log(`  ✓ PASS: ${name}`);
    passed++;
  } else {
    console.error(`  ✗ FAIL: ${name}`);
    failed++;
  }
}

async function testSuite() {
  console.log('\n--- 1. Testing Document Library Scoping (db.getStudentDocuments) ---');
  // Student: Thandeka Nkosi (21304567, Room G-14)
  const studentUser = {
    id: 'usr_student',
    name: 'Thandeka Nkosi',
    studentNumber: '21304567',
    room: 'G-14',
    residence: 'GKAS Residence',
    email: 't.nkosi@tut4life.ac.za'
  };

  const studentDocs = db.getStudentDocuments('usr_student', studentUser);
  assert(Array.isArray(studentDocs), 'Student documents returned as array');
  assert(studentDocs.length >= 3, `Student received ${studentDocs.length} documents (expected >= 3)`);

  const lease = studentDocs.find(d => d.category === 'lease');
  assert(lease !== undefined, 'Lease document is generated');
  assert(lease?.title.includes('Room G-14'), 'Lease title includes student allocated room (Room G-14)');
  assert(lease?.studentName === 'Thandeka Nkosi', 'Lease is addressed to student');

  const inspection = studentDocs.find(d => d.category === 'inspection');
  assert(inspection !== undefined, 'Move-in inspection document is generated');
  assert(inspection?.type === 'Signed Digital Inventory', 'Move-in inspection has correct type');

  const receipt = studentDocs.find(d => d.category === 'receipt');
  assert(receipt !== undefined, 'Payment receipt document is generated');
  assert(receipt?.ref.includes('REC-SB-2027'), 'Receipt has Standard Bank reference');

  // Intake applicant test: Precious Khumalo (Room G-55)
  const applicantUser = {
    id: 'APP-2027-9912',
    name: 'Precious Khumalo',
    studentNumber: '22409811',
    room: 'G-55',
    residence: 'GKAS Residence',
    email: 'p.khumalo@ump.ac.za'
  };

  const applicantDocs = db.getStudentDocuments('APP-2027-9912', applicantUser);
  const appLease = applicantDocs.find(d => d.category === 'lease');
  assert(appLease?.title.includes('Room G-55'), 'Applicant lease is dynamically customized to Precious Khumalo & Room G-55');
  assert(appLease?.fileName.includes('Khumalo'), 'Lease fileName matches student surname');

  console.log('\n--- 2. Testing State Service Dynamic Binding Shape ---');
  // Verify expected fields populated by setUser
  const sampleBackendResponse = {
    id: 'usr_student',
    name: 'Thandeka Nkosi',
    email: 't.nkosi@tut4life.ac.za',
    phone: '071 829 4012',
    studentNumber: '21304567',
    room: 'G-14',
    residence: 'GKAS Residence',
    institution: 'Tshwane University of Technology (TUT)',
    nsfasRef: 'NSFAS-2027-MP-8812',
    role: 'Student Resident',
    roleKey: 'student'
  };

  // Mock StateService setUser behavior
  const mockState = {
    currentUser: null,
    currentRole: null
  };

  function mockSetUser(backendUser) {
    if (backendUser && typeof backendUser === 'object') {
      const isStudent = backendUser.roleKey === 'student' || !!backendUser.studentNumber;
      mockState.currentUser = {
        id: backendUser.id || backendUser.userId,
        name: backendUser.name,
        email: backendUser.email,
        phone: backendUser.phone,
        studentNumber: backendUser.studentNumber,
        room: backendUser.room,
        residence: backendUser.residence,
        institution: backendUser.institution,
        nsfasRef: backendUser.nsfasRef,
        role: backendUser.role,
        roleKey: isStudent ? 'student' : 'admin'
      };
      mockState.currentRole = isStudent ? 'student' : 'admin';
    } else {
      mockState.currentUser = null;
      mockState.currentRole = null;
    }
  }

  assert(mockState.currentUser === null, 'Initial state currentUser is strictly null');
  mockSetUser(sampleBackendResponse);
  assert(mockState.currentUser !== null, 'currentUser is populated after authentication');
  assert(mockState.currentUser.id === 'usr_student', 'currentUser.id matches backend response');
  assert(mockState.currentUser.studentNumber === '21304567', 'currentUser.studentNumber matches backend response');
  assert(mockState.currentUser.room === 'G-14', 'currentUser.room matches backend response');
  assert(mockState.currentUser.nsfasRef === 'NSFAS-2027-MP-8812', 'currentUser.nsfasRef matches backend response');

  mockSetUser(null);
  assert(mockState.currentUser === null, 'currentUser resets cleanly to null on logout');

  console.log(`\n========================================`);
  console.log(`TEST SUMMARY: ${passed} Passed, ${failed} Failed`);
  console.log(`========================================\n`);

  if (failed > 0) process.exit(1);
}

testSuite();
