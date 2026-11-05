/* ═══════════════════════════════════════════════════════════
   HTS & GKAS RESIDENCE API & REAL-TIME SERVER
   Express Server + Server-Sent Events (SSE) Live Broadcasts
   Hardened CORS, JWT Authentication & RBAC Middleware
═══════════════════════════════════════════════════════════ */

import express from 'express';
import cors from 'cors';
import { db } from './db.js';
import { requireAuth, requireRole, verifyToken } from './auth.js';

const app = express();
const PORT = 3001;

// ─── 1. CORS HARDENING ───
const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:5173'
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow non-browser requests without origin header (e.g., server health checks, curl)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
      return callback(null, true);
    }
    const isWhitelisted = allowedOrigins.some(allowed => {
      try {
        const u = new URL(origin);
        return allowed === `${u.protocol}//${u.host}` || allowed === u.origin;
      } catch (e) {
        return false;
      }
    });
    if (isWhitelisted) {
      return callback(null, true);
    }
    callback(new Error(`CORS policy violation: Origin ${origin} not permitted.`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

app.use(express.json());

// List of connected Server-Sent Events clients for real-time live sync
let sseClients = [];

/**
 * Scopes database state based on user role
 * - Administrators receive residence-wide operational metrics
 * - Regular students only receive their own applications, tickets, and lease documents
 */
function getScopedStateForUser(user) {
  const fullData = db.getAll();
  // Administrators receive full residence-wide operational metrics
  if (user && (user.roleKey === 'admin' || user.role === 'admin' || user.role === 'Administrator')) {
    return fullData;
  }

  // Regular students: scope to only their own applications, tickets, and lease documents
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

  const scopedBursaries = (fullData.bursaryApplications || []).filter(b => {
    const bNum = String(b.studentNumber || '').toLowerCase();
    const bName = (b.studentName || '').toLowerCase();
    return (studentNum && bNum === studentNum) || (userName && bName === userName);
  });

  const scopedBookings = (fullData.amenityBookings || []).filter(b => {
    const bName = (b.studentName || '').toLowerCase();
    return userName && bName === userName;
  });

  const scopedNotifications = (fullData.notifications || []).filter(n => {
    return n.user_id === userId || n.user_id === 'usr_student';
  });

  const scopedDocs = (fullData.applicationDocuments || []).filter(d => {
    return scopedApplicants.some(a => a.id === d.application_id);
  });

  // Filter residences: student only sees their own room allocation and basic residence info
  const scopedResidences = (fullData.residences || []).map(r => ({
    id: r.id,
    name: r.name,
    campus: r.campus,
    totalBeds: r.totalBeds,
    occupiedBeds: r.occupiedBeds,
    availableBeds: r.availableBeds,
    rateMonthly: r.rateMonthly,
    rooms: (r.rooms || [])
      .filter(rm => (rm.residents || []).some(res => userName && res.toLowerCase().includes(userName)))
      .map(rm => ({
        roomNumber: rm.roomNumber,
        type: rm.type,
        beds: rm.beds,
        status: rm.status
      }))
  }));

  return {
    residences: scopedResidences,
    tickets: scopedTickets,
    applicants: scopedApplicants,
    notices: fullData.notices || [],
    bursaryApplications: scopedBursaries,
    amenityBookings: scopedBookings,
    notifications: scopedNotifications,
    applicationDocuments: scopedDocs,
    institutions: fullData.institutions || [],
    // Omit sensitive financial metrics and audit log for students
    bankAccount: null,
    transactions: [],
    auditLog: []
  };
}

function broadcastRealtime(eventType, payload) {
  sseClients = sseClients.filter(client => {
    try {
      if (client.res.writableEnded || client.res.destroyed) {
        return false;
      }
      // If event is db_update, send user-scoped state payload
      const dataToSend = (eventType === 'db_update' && !payload)
        ? getScopedStateForUser(client.user)
        : (eventType === 'db_update' && payload)
          ? (client.user?.roleKey === 'admin' || client.user?.role === 'admin' ? payload : getScopedStateForUser(client.user))
          : payload;

      const message = `event: ${eventType}\ndata: ${JSON.stringify(dataToSend)}\n\n`;
      client.res.write(message);
      return true;
    } catch (err) {
      console.warn('Pruning broken SSE connection:', client.id, err.message);
      return false;
    }
  });
}

// ─── 4. SERVER-SENT EVENTS (SSE) ROUTE (AUTHENTICATED & RATE-LIMITED) ───
app.get('/api/realtime', (req, res) => {
  // 1. Authenticate incoming SSE connection via signed query token
  const token = req.query.token;
  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'Unauthorized: Missing required query token parameter for SSE stream.'
    });
  }

  const sseUser = verifyToken(token);
  if (!sseUser) {
    return res.status(401).json({
      success: false,
      error: 'Unauthorized: Invalid or expired query token for SSE stream.'
    });
  }

  // 2. Restrict each IP to a maximum of 5 concurrent SSE connections
  const rawIp = req.headers['x-forwarded-for']?.split(',')[0].trim() || req.socket.remoteAddress || '127.0.0.1';
  const clientIp = rawIp.replace(/^::ffff:/, ''); // Normalize IPv4-mapped IPv6

  const activeIpCount = sseClients.filter(c => c.ip === clientIp).length;
  if (activeIpCount >= 5) {
    return res.status(429).json({
      success: false,
      error: 'Too Many Requests: Maximum of 5 concurrent SSE connections per IP exceeded.'
    });
  }

  // 3. Setup SSE headers
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'X-Accel-Buffering': 'no'
  });

  const clientId = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  const newClient = { id: clientId, ip: clientIp, user: sseUser, res };
  sseClients.push(newClient);

  // Send initial ping
  res.write(`event: connected\ndata: ${JSON.stringify({ message: 'Live database connected', clientId, userId: sseUser.userId || sseUser.id })}\n\n`);

  // 4. Clean up closed client connections to prevent memory exhaustion
  const cleanup = () => {
    sseClients = sseClients.filter(c => c.id !== clientId);
  };

  req.on('close', cleanup);
  req.on('end', cleanup);
  res.on('close', cleanup);
  res.on('error', cleanup);
});

// ─── 2 & 3. AUTHENTICATION & RBAC MIDDLEWARE GATE ───
// Protect all /api/* endpoints except public authentication & onboarding routes
app.use('/api', (req, res, next) => {
  const publicPaths = [
    '/auth/login',
    '/auth/register',
    '/auth/forgot-password',
    '/applicants',         // Public student registration
    '/institutions',       // Public higher education institutions catalog
    '/send-otp',           // Public OTP dispatch
    '/verify-otp',         // Public OTP verification
    '/validate-document'   // Public upload document verification
  ];

  if (publicPaths.includes(req.path) || req.path.startsWith('/auth/otp/')) {
    return next();
  }

  // SSE route handles query token verification separately
  if (req.path === '/realtime') {
    return next();
  }

  return requireAuth(req, res, next);
});

// ─── REST ENDPOINTS ───

// 1. Get database state (scoped by user role)
app.get('/api/state', (req, res) => {
  const scopedData = getScopedStateForUser(req.user);
  res.json({ success: true, data: scopedData });
});

// 2. Submit maintenance ticket (authenticated student/admin)
app.post('/api/tickets', (req, res) => {
  const ticket = db.addTicket(req.body);
  broadcastRealtime('db_update');
  res.json({ success: true, ticket });
});

// 3. Student notifies management
app.post('/api/tickets/:id/notify', (req, res) => {
  const { id } = req.params;
  const { message } = req.body;
  const ticket = db.notifyManagement(id, message);
  if (ticket) {
    broadcastRealtime('db_update');
    res.json({ success: true, ticket });
  } else {
    res.status(404).json({ success: false, error: 'Ticket not found' });
  }
});

// 4. Admin resolves ticket (RBAC: admin only)
app.post('/api/tickets/:id/resolve', requireRole(['admin']), (req, res) => {
  const { id } = req.params;
  const { note } = req.body;
  const ticket = db.resolveTicket(id, note);
  if (ticket) {
    broadcastRealtime('db_update');
    res.json({ success: true, ticket });
  } else {
    res.status(404).json({ success: false, error: 'Ticket not found' });
  }
});

// 5. Register new applicant (Public onboarding intake flow)
app.post('/api/applicants', (req, res) => {
  const applicant = db.registerApplicant(req.body);
  broadcastRealtime('db_update');
  res.json({ success: true, applicant });
});

// 5-alias. Register new applicant alias
app.post('/api/auth/register', (req, res) => {
  const applicant = db.registerApplicant(req.body);
  broadcastRealtime('db_update');
  res.json({ success: true, applicant });
});

// 5b. Get all South African public universities & TVET colleges (Public catalog)
app.get('/api/institutions', (req, res) => {
  res.json({ success: true, institutions: db.getInstitutions() });
});

// 5c. OTP SMS & Email Dispatch and Verification (Public onboarding)
app.post('/api/send-otp', (req, res) => {
  const { contact, type } = req.body;
  const result = db.sendOtp(contact, type);
  res.json(result);
});

app.post('/api/auth/otp/send', (req, res) => {
  const { contact, type } = req.body;
  const result = db.sendOtp(contact, type);
  res.json(result);
});

app.post('/api/verify-otp', (req, res) => {
  const { contact, code } = req.body;
  const result = db.verifyOtp(contact, code);
  res.json(result);
});

app.post('/api/auth/otp/verify', (req, res) => {
  const { contact, code } = req.body;
  const result = db.verifyOtp(contact, code);
  res.json(result);
});

// 5d. Automated Document Validation Engine (Public onboarding)
app.post('/api/validate-document', (req, res) => {
  const result = db.validateDocument(req.body);
  res.json(result);
});

// 5e. Funding verification update (RBAC: admin only)
app.post('/api/applicants/:id/funding', requireRole(['admin']), (req, res) => {
  const { id } = req.params;
  const { status, reason, adminName } = req.body;
  const applicant = db.updateFundingStatus(id, status, reason, adminName || req.user.name);
  if (applicant) {
    broadcastRealtime('db_update');
    res.json({ success: true, applicant });
  } else {
    res.status(404).json({ success: false, error: 'Applicant not found' });
  }
});

// 5f. In-App Student & Admin Notifications
app.get('/api/notifications', (req, res) => {
  const userId = req.user.roleKey === 'admin' ? (req.query.userId || req.user.userId) : req.user.userId;
  res.json({ success: true, notifications: db.getNotifications(userId) });
});

app.post('/api/notifications/:id/read', (req, res) => {
  const { id } = req.params;
  const success = db.markNotificationRead(id);
  res.json({ success });
});

app.post('/api/notifications/read-all', (req, res) => {
  const userId = req.user.roleKey === 'admin' ? (req.body.userId || req.user.userId) : req.user.userId;
  db.markAllNotificationsRead(userId);
  res.json({ success: true });
});

// 6. Admin accepts or declines applicant (RBAC: admin only)
app.post('/api/applicants/:id/decision', requireRole(['admin']), (req, res) => {
  const { id } = req.params;
  const { decision, reason } = req.body;
  const app = db.decideApplicant(id, decision, reason);
  if (app) {
    broadcastRealtime('db_update');
    res.json({ success: true, applicant: app });
  } else {
    res.status(404).json({ success: false, error: 'Applicant not found' });
  }
});

// 7. Student bursary application
app.post('/api/bursaries', (req, res) => {
  const bursary = db.addBursary(req.body);
  broadcastRealtime('db_update');
  res.json({ success: true, bursary });
});

// 8. Admin posts announcement (RBAC: admin only)
app.post('/api/notices', requireRole(['admin']), (req, res) => {
  const notice = db.addNotice(req.body);
  broadcastRealtime('db_update');
  res.json({ success: true, notice });
});

// 9. Book amenity
app.post('/api/amenities/book', (req, res) => {
  const booking = db.addBooking(req.body);
  broadcastRealtime('db_update');
  res.json({ success: true, booking });
});

// 10-13. Bank Account & Reconciliation (RBAC: admin only)
app.use('/api/bank', requireRole(['admin']));

app.get('/api/bank/account', (req, res) => {
  res.json({ success: true, account: db.getAll().bankAccount });
});

app.post('/api/bank/connect', (req, res) => {
  const updatedAccount = db.updateBankAccount(req.body);
  broadcastRealtime('db_update');
  res.json({ success: true, account: updatedAccount });
});

app.post('/api/bank/sync', (req, res) => {
  const result = db.syncBankFeed();
  broadcastRealtime('db_update');
  res.json({ success: true, ...result });
});

app.post('/api/bank/reconcile', (req, res) => {
  const { txnId, matchedRoom, studentName } = req.body;
  const txn = db.reconcileTransaction(txnId, matchedRoom, studentName);
  if (txn) {
    broadcastRealtime('db_update');
    res.json({ success: true, transaction: txn });
  } else {
    res.status(404).json({ success: false, error: 'Transaction not found' });
  }
});

// 14. Authentication - Login (Public)
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ success: false, error: 'Email or Student Number and password are required.' });
  }
  const result = db.authenticateUser(email, password);
  if (result.success) {
    broadcastRealtime('db_update');
    res.json(result);
  } else {
    res.status(401).json(result);
  }
});

// 15. Authentication - Forgot Password (Public)
app.post('/api/auth/forgot-password', (req, res) => {
  const { identifier } = req.body;
  if (!identifier) {
    return res.status(400).json({ success: false, error: 'Please enter your registered email or student number.' });
  }
  const result = db.requestPasswordReset(identifier);
  if (result.success) {
    broadcastRealtime('db_update');
    res.json(result);
  } else {
    res.status(404).json(result);
  }
});

// 16. Dynamic Student Document Library (scoped to authenticated student)
app.get('/api/documents', (req, res) => {
  const user = req.user;
  const targetUserId = (user.roleKey === 'admin' && req.query.userId) ? req.query.userId : user.userId;
  const docs = db.getStudentDocuments(targetUserId, user);
  res.json({
    success: true,
    documents: docs,
    total: docs.length,
    student: {
      id: user.userId,
      name: user.name,
      studentNumber: user.studentNumber,
      room: user.room,
      residence: user.residence
    }
  });
});

app.get('/api/documents/download/:id', (req, res) => {
  const { id } = req.params;
  res.json({
    success: true,
    documentId: id,
    downloadUrl: `https://storage.hts-gkas.co.za/documents/${id}?token=${Buffer.from(req.user.userId + ':' + Date.now()).toString('base64url')}`,
    expiresIn: '15 minutes'
  });
});

app.listen(PORT, () => {
  console.log(`✓ HTS & GKAS Database & Realtime Server running on http://localhost:${PORT}`);
});
