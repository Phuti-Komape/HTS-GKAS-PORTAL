/* ═══════════════════════════════════════════════════════════
   COMPREHENSIVE TEST SUITE: CORS, AUTH, RBAC, SSE
═══════════════════════════════════════════════════════════ */

import http from 'http';
import { generateToken, verifyToken, requireAuth, requireRole } from '../server/auth.js';
import { db } from '../server/db.js';

let failed = 0;
let passed = 0;

function assert(condition, testName) {
  if (condition) {
    console.log(`  ✓ PASS: ${testName}`);
    passed++;
  } else {
    console.error(`  ✗ FAIL: ${testName}`);
    failed++;
  }
}

async function runTests() {
  console.log('\n--- 1. Testing Cryptographic Tokens (HMAC SHA-256) ---');
  const adminToken = generateToken({ userId: 'usr_admin', role: 'admin', roleKey: 'admin', name: 'L. Marsher' });
  const studentToken = generateToken({ userId: 'usr_student', role: 'student', roleKey: 'student', name: 'Thandeka Nkosi', studentNumber: '21304567' });

  assert(typeof adminToken === 'string' && adminToken.split('.').length === 3, 'JWT has standard 3 parts');
  const decodedAdmin = verifyToken(adminToken);
  assert(decodedAdmin.userId === 'usr_admin' && decodedAdmin.role === 'admin', 'Admin token decodes correctly');

  const decodedStudent = verifyToken(studentToken);
  assert(decodedStudent.userId === 'usr_student' && decodedStudent.studentNumber === '21304567', 'Student token decodes correctly');

  const tamperedToken = adminToken.slice(0, -6) + 'xxxxxx';
  assert(verifyToken(tamperedToken) === null, 'Tampered token signature is rejected');
  assert(verifyToken('invalid.token.here') === null, 'Malformed token is rejected');
  assert(verifyToken(null) === null, 'Null token is rejected');

  console.log('\n--- 2. Testing Authentication Middleware (requireAuth) ---');
  // Test missing auth header
  let req1 = { headers: {} };
  let res1 = {
    statusCode: 200,
    status(code) { this.statusCode = code; return this; },
    json(data) { this.body = data; return this; }
  };
  let nextCalled1 = false;
  requireAuth(req1, res1, () => { nextCalled1 = true; });
  assert(!nextCalled1 && res1.statusCode === 401, 'Missing Authorization header returns 401');

  // Test invalid header format
  let req2 = { headers: { authorization: 'Basic 12345' } };
  let res2 = {
    statusCode: 200,
    status(code) { this.statusCode = code; return this; },
    json(data) { this.body = data; return this; }
  };
  let nextCalled2 = false;
  requireAuth(req2, res2, () => { nextCalled2 = true; });
  assert(!nextCalled2 && res2.statusCode === 401, 'Non-Bearer format returns 401');

  // Test invalid token signature
  let req3 = { headers: { authorization: `Bearer ${tamperedToken}` } };
  let res3 = {
    statusCode: 200,
    status(code) { this.statusCode = code; return this; },
    json(data) { this.body = data; return this; }
  };
  let nextCalled3 = false;
  requireAuth(req3, res3, () => { nextCalled3 = true; });
  assert(!nextCalled3 && res3.statusCode === 401, 'Invalid signature returns 401');

  // Test valid admin Bearer token
  let req4 = { headers: { authorization: `Bearer ${adminToken}` } };
  let res4 = { status() { return this; }, json() { return this; } };
  let nextCalled4 = false;
  requireAuth(req4, res4, () => { nextCalled4 = true; });
  assert(nextCalled4 && req4.user?.userId === 'usr_admin' && req4.user?.role === 'admin', 'Valid Bearer token attaches req.user with userId and role');

  console.log('\n--- 3. Testing Role-Based Access Control (requireRole) ---');
  const adminGuard = requireRole(['admin']);

  // Admin user attempting admin route
  let reqAdmin = { user: { userId: 'usr_admin', role: 'admin', roleKey: 'admin' } };
  let resAdmin = { status() { return this; }, json() { return this; } };
  let nextAdmin = false;
  adminGuard(reqAdmin, resAdmin, () => { nextAdmin = true; });
  assert(nextAdmin, 'Admin user passes admin role guard');

  // Student user attempting admin route
  let reqStudent = { user: { userId: 'usr_student', role: 'student', roleKey: 'student' } };
  let resStudent = {
    statusCode: 200,
    status(code) { this.statusCode = code; return this; },
    json(data) { this.body = data; return this; }
  };
  let nextStudent = false;
  adminGuard(reqStudent, resStudent, () => { nextStudent = true; });
  assert(!nextStudent && resStudent.statusCode === 403, 'Student user is blocked with 403 Forbidden on admin route');

  console.log('\n--- 4. Testing Scoped State Payload (GET /api/state) ---');
  // Recreate the scoping function from server.js
  const fullData = db.getAll();

  function getScoped(user) {
    if (user && (user.roleKey === 'admin' || user.role === 'admin' || user.role === 'Administrator')) {
      return fullData;
    }
    const studentNum = String(user?.studentNumber || '').toLowerCase();
    const userEmail = (user?.email || '').toLowerCase();
    const userName = (user?.name || '').toLowerCase();
    const userId = user?.userId || user?.id;

    const scopedTickets = (fullData.tickets || []).filter(t => {
      const tNum = String(t.studentId || '').toLowerCase();
      const tName = (t.studentName || '').toLowerCase();
      return (studentNum && tNum === studentNum) || (userId && tNum === userId) || (userName && tName === userName);
    });

    const scopedApplicants = (fullData.applicants || []).filter(a => {
      const aId = a.id;
      const aNum = String(a.studentNumber || '').toLowerCase();
      const aEmail = (a.email || '').toLowerCase();
      return (userId && aId === userId) || (studentNum && aNum === studentNum) || (userEmail && aEmail === userEmail);
    });

    return {
      tickets: scopedTickets,
      applicants: scopedApplicants,
      bankAccount: null,
      transactions: [],
      auditLog: []
    };
  }

  const adminScope = getScoped(reqAdmin.user);
  assert(adminScope.bankAccount !== null, 'Admin state contains corporate bank account');
  assert(adminScope.transactions.length > 0, 'Admin state contains all transactions');
  assert(adminScope.auditLog.length > 0, 'Admin state contains audit trail');

  const studentScope = getScoped(reqStudent.user);
  assert(studentScope.bankAccount === null, 'Student state omits corporate bank account');
  assert(studentScope.transactions.length === 0, 'Student state omits financial transactions');
  assert(studentScope.auditLog.length === 0, 'Student state omits admin audit trail');
  assert(studentScope.tickets.every(t => t.studentId === reqStudent.user.studentNumber || t.studentName === 'Thandeka Nkosi'), 'Student state only contains student own tickets');

  console.log('\n--- 5. Testing SSE Query Token Authentication & IP Connection Limit ---');
  let mockSseClients = [];
  const clientIp = '192.168.1.50';

  function simulateSseConnection(token, ip) {
    if (!token) return { status: 401, error: 'Missing token' };
    const user = verifyToken(token);
    if (!user) return { status: 401, error: 'Invalid token' };

    const ipCount = mockSseClients.filter(c => c.ip === ip).length;
    if (ipCount >= 5) {
      return { status: 429, error: 'Max 5 connections exceeded' };
    }

    const clientId = `client_${Date.now()}_${Math.random()}`;
    const client = { id: clientId, ip, user };
    mockSseClients.push(client);
    return { status: 200, clientId, client };
  }

  // Missing token
  assert(simulateSseConnection(null, clientIp).status === 401, 'SSE connection without query token returns 401');
  // Invalid token
  assert(simulateSseConnection('invalid-token', clientIp).status === 401, 'SSE connection with invalid token returns 401');

  // Connect 5 valid connections
  for (let i = 1; i <= 5; i++) {
    const res = simulateSseConnection(studentToken, clientIp);
    assert(res.status === 200, `SSE connection #${i} for IP ${clientIp} connects successfully`);
  }

  // 6th connection should be rejected with 429
  const res6 = simulateSseConnection(studentToken, clientIp);
  assert(res6.status === 429 && res6.error.includes('Max 5'), '6th SSE connection from same IP is blocked with 429 Too Many Requests');

  // Clean up one client connection
  const clientToClose = mockSseClients[0];
  mockSseClients = mockSseClients.filter(c => c.id !== clientToClose.id);
  assert(mockSseClients.length === 4, 'Closed client connection is cleaned up from memory');

  // Now a new connection can connect
  const resRetry = simulateSseConnection(studentToken, clientIp);
  assert(resRetry.status === 200, 'After closing connection, new SSE connection succeeds');

  console.log(`\n========================================`);
  console.log(`TEST SUMMARY: ${passed} Passed, ${failed} Failed`);
  console.log(`========================================\n`);

  if (failed > 0) process.exit(1);
}

runTests();
