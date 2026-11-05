/* ═══════════════════════════════════════════════════════════
   APPLICATION STATE & REAL-TIME SYNC ENGINE
   Connects to Express backend & listens to Server-Sent Events (SSE)
═══════════════════════════════════════════════════════════ */

import { RESIDENCES, INITIAL_TICKETS, INITIAL_APPLICANTS, INITIAL_NOTICES, INITIAL_AUDIT_LOG } from '../data/initialData.js';

const API_BASE = (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1')
  ? '/api'
  : (typeof window !== 'undefined' && window.location.port === '5173' ? '/api' : 'http://localhost:3001/api');
const UI_PREFERENCES_KEY = 'hts_gkas_ui_prefs_v1';

class StateService {
  constructor() {
    this.listeners = [];
    this.isRealtimeConnected = false;
    this.state = this.loadInitial();
    this.initBackendSync();
  }

  loadInitial() {
    let uiPrefs = {
      themePreference: 'light',
      sidebarCollapsed: false
    };
    try {
      const saved = localStorage.getItem(UI_PREFERENCES_KEY);
      if (saved) {
        uiPrefs = { ...uiPrefs, ...JSON.parse(saved) };
      }
    } catch (e) {
      console.warn('UI preferences load failed', e);
    }

    return {
      currentUser: null,
      currentRole: null,
      activeModule: 'dashboard',
      uiSettings: uiPrefs,
      tickets: [],
      applicants: [],
      notices: [],
      auditLog: [],
      residences: [...RESIDENCES],
      bursaryApplications: [],
      amenityBookings: [],
      bankAccount: null,
      transactions: [],
      documents: []
    };
  }

  saveLocal() {
    try {
      // Strictly persist ONLY non-sensitive UI settings (e.g. theme preference)
      const uiPrefs = {
        themePreference: this.state.uiSettings?.themePreference || 'light',
        sidebarCollapsed: this.state.uiSettings?.sidebarCollapsed || false
      };
      localStorage.setItem(UI_PREFERENCES_KEY, JSON.stringify(uiPrefs));
      // Purge any legacy tenant database dumps from previous sessions
      localStorage.removeItem('hts_gkas_portal_state_v3');
    } catch (e) {}
    this.notify();
  }

  subscribe(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(cb => cb !== callback);
    };
  }

  notify() {
    this.listeners.forEach(cb => {
      try { cb(this.state); } catch (e) { console.error(e); }
    });
  }

  getAuthHeaders(customHeaders = {}) {
    const headers = { 'Content-Type': 'application/json', ...customHeaders };
    const token = this.getAuthToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  }

  // ─── REAL-TIME BACKEND INITIALIZATION (SSE) ───
  async initBackendSync() {
    try {
      const token = this.getAuthToken();

      // 1. Fetch live snapshot with Authorization header if token exists
      const headers = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      const res = await fetch(`${API_BASE}/state`, { headers });
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          this.mergeDbState(json.data);
        }
      }

      // 2. Connect to Server-Sent Events (SSE) stream for real-time live push (query token)
      if (this.eventSource) {
        this.eventSource.close();
        this.eventSource = null;
      }

      if (token) {
        const sseUrl = `${API_BASE}/realtime?token=${encodeURIComponent(token)}`;
        const eventSource = new EventSource(sseUrl);
        this.eventSource = eventSource;

        eventSource.addEventListener('connected', () => {
          this.isRealtimeConnected = true;
          this.notify();
        });

        eventSource.addEventListener('db_update', (e) => {
          try {
            const updatedDb = JSON.parse(e.data);
            this.mergeDbState(updatedDb);
          } catch (err) {
            console.warn('Realtime parse error', err);
          }
        });

        eventSource.onerror = () => {
          this.isRealtimeConnected = false;
          this.notify();
        };
      }
    } catch (e) {
      console.warn('Backend server not reachable, using local persistent engine', e);
    }
  }

  mergeDbState(dbData) {
    if (dbData.tickets) this.state.tickets = dbData.tickets;
    if (dbData.applicants) this.state.applicants = dbData.applicants;
    if (dbData.notices) this.state.notices = dbData.notices;
    if (dbData.auditLog) this.state.auditLog = dbData.auditLog;
    if (dbData.residences) this.state.residences = dbData.residences;
    if (dbData.bursaryApplications) this.state.bursaryApplications = dbData.bursaryApplications;
    if (dbData.amenityBookings) this.state.amenityBookings = dbData.amenityBookings;
    if (dbData.bankAccount) this.state.bankAccount = dbData.bankAccount;
    if (dbData.transactions) this.state.transactions = dbData.transactions;
    this.isRealtimeConnected = true;
    this.saveLocal();
  }

  // ─── AUTHENTICATION STATE BINDING (DYNAMIC SESSION-BASED) ───
  setUser(backendUser) {
    if (backendUser && typeof backendUser === 'object') {
      const isStudent = backendUser.roleKey === 'student' || 
                        backendUser.role?.toLowerCase().includes('student') ||
                        !!backendUser.studentNumber;
      
      this.state.currentUser = {
        id: backendUser.id || backendUser.userId || 'usr_session',
        name: backendUser.name || 'Resident',
        email: backendUser.email || '',
        phone: backendUser.phone || '',
        studentNumber: backendUser.studentNumber || null,
        room: backendUser.room || null,
        residence: backendUser.residence || (isStudent ? 'GKAS Residence' : 'All Residences'),
        institution: backendUser.institution || null,
        nsfasRef: backendUser.nsfasRef || backendUser.fundingReferenceNumber || null,
        role: backendUser.role || (isStudent ? 'Student Resident' : 'Administrator'),
        roleKey: isStudent ? 'student' : 'admin',
        initials: backendUser.initials || (backendUser.name ? backendUser.name.split(' ').map(n => n[0]).join('').slice(0, 2) : 'UR')
      };
      this.state.currentRole = isStudent ? 'student' : 'admin';
      this.state.activeModule = isStudent ? 'student-home' : 'dashboard';
    } else {
      this.state.currentUser = null;
      this.state.currentRole = null;
      this.state.activeModule = 'dashboard';
    }
    this.saveLocal();
    this.initBackendSync();
  }

  setAuthToken(token) {
    this.authToken = token || null;
    try {
      if (token) {
        sessionStorage.setItem('hts_gkas_auth_token', token);
      } else {
        sessionStorage.removeItem('hts_gkas_auth_token');
      }
    } catch (e) {}
  }

  getAuthToken() {
    if (this.authToken) return this.authToken;
    try {
      return sessionStorage.getItem('hts_gkas_auth_token') || null;
    } catch (e) {
      return null;
    }
  }

  logout() {
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
    }
    this.isRealtimeConnected = false;
    this.setAuthToken(null);
    this.setUser(null);
  }

  setActiveModule(moduleId) {
    // Strict route security check
    if (this.state.currentRole === 'student') {
      const allowedStudentModules = ['student-home', 'my-lease', 'maintenance', 'activity', 'bursary', 'rules', 'news', 'my-docs', 'movein'];
      if (!allowedStudentModules.includes(moduleId)) {
        moduleId = 'student-home';
      }
    }
    this.state.activeModule = moduleId;
    this.saveLocal();
  }

  // ─── MUTATIONS WITH REAL-TIME API BACKEND ───
  async addTicket(ticketData) {
    try {
      const res = await fetch(`${API_BASE}/tickets`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(ticketData)
      });
      if (res.ok) {
        const json = await res.json();
        return json.ticket;
      }
    } catch (e) {}

    // Fallback local
    const newId = `HTS-MNT-2027-${String(42 + this.state.tickets.length).padStart(4, '0')}`;
    const newTicket = {
      id: newId,
      icon: ticketData.priority === 'urgent' ? '🚨' : '🔨',
      bg: ticketData.priority === 'urgent' ? '#fee2e2' : '#fef3c7',
      title: ticketData.title,
      meta: `${ticketData.residence} · ${ticketData.studentName} · Just now`,
      location: ticketData.location,
      residence: ticketData.residence,
      priority: ticketData.priority || 'medium',
      status: 'open',
      category: ticketData.category,
      studentName: ticketData.studentName,
      studentId: ticketData.studentId,
      createdAt: new Date().toISOString(),
      description: ticketData.description,
      lastNotified: null
    };
    this.state.tickets.unshift(newTicket);
    this.saveLocal();
    return newTicket;
  }

  async notifyTicketManagement(ticketId, message) {
    try {
      await fetch(`${API_BASE}/tickets/${ticketId}/notify`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ message })
      });
    } catch (e) {}

    const ticket = this.state.tickets.find(t => t.id === ticketId);
    if (ticket) {
      ticket.lastNotified = new Date().toISOString();
      this.saveLocal();
      return true;
    }
    return false;
  }

  async resolveTicket(ticketId, resolutionNote) {
    try {
      await fetch(`${API_BASE}/tickets/${ticketId}/resolve`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ note: resolutionNote })
      });
    } catch (e) {}

    const ticket = this.state.tickets.find(t => t.id === ticketId);
    if (ticket) {
      ticket.status = 'resolved';
      ticket.resolutionNote = resolutionNote;
      this.saveLocal();
      return true;
    }
    return false;
  }

  async registerNewStudent(formData) {
    try {
      const res = await fetch(`${API_BASE}/applicants`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        const json = await res.json();
        if (json.applicant) {
          this.state.applicants.unshift(json.applicant);
          this.saveLocal();
          return json.applicant;
        }
      }
    } catch (e) {}

    const appId = `APP-2027-${Math.floor(1000 + Math.random() * 9000)}`;
    const refNum = `GKAS-2027-${Math.floor(10000 + Math.random() * 90000)}`;
    const instName = formData.institution || formData.otherInstitutionName || 'Tshwane University of Technology (TUT)';
    const newApplicant = {
      id: appId,
      referenceNumber: refNum,
      initials: (formData.firstName?.[0] || 'N') + (formData.lastName?.[0] || 'S'),
      bg: '#e8f5e9',
      tc: '#15803d',
      name: `${formData.firstName} ${formData.lastName}`,
      firstName: formData.firstName,
      lastName: formData.lastName,
      meta: `${instName} · ${formData.fundingType || 'NSFAS'} · Just now`,
      institution: instName,
      studentNumber: formData.studentNumber || '22109845',
      idNumber: formData.idNumber,
      phone: formData.phone,
      email: formData.email,
      bgCheck: 'pending',
      status: 'pending',
      funding: formData.fundingType || 'nsfas',
      fundingType: formData.fundingType || 'nsfas',
      fundingStatus: 'pending_verification',
      bursarySponsorName: formData.bursarySponsorName || null,
      fundingReferenceNumber: formData.fundingReferenceNumber || formData.nsfasRef || null,
      guardianName: formData.guardianName || null,
      guardianContact: formData.guardianContact || null,
      preferredResidence: formData.preferredResidence || 'GKAS Residence (Sonheuwel)',
      roomType: formData.roomType || 'Single Room',
      submittedDate: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      processed: false,
      nsfasRef: formData.nsfasRef || `NSFAS-2027-MP-${Math.floor(1000 + Math.random() * 9000)}`
    };
    this.state.applicants.unshift(newApplicant);
    this.saveLocal();
    return newApplicant;
  }

  async processApplicant(appId, decision, reason) {
    try {
      await fetch(`${API_BASE}/applicants/${appId}/decision`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ decision, reason })
      });
    } catch (e) {}

    const app = this.state.applicants.find(a => a.id === appId);
    if (app) {
      app.processed = true;
      app.status = decision === 'accepted' ? 'approved' : 'rejected';
      app.decision = decision;
      app.decisionReason = reason;
      app.decidedBy = 'L. Marsher';
      app.reviewedAt = new Date().toISOString();
      this.saveLocal();
      return true;
    }
    return false;
  }

  async updateFundingStatus(appId, status, reason) {
    try {
      await fetch(`${API_BASE}/applicants/${appId}/funding`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ status, reason, adminName: 'L. Marsher' })
      });
    } catch (e) {}

    const app = this.state.applicants.find(a => a.id === appId);
    if (app) {
      app.fundingStatus = status;
      app.fundingVerifiedAt = new Date().toISOString();
      app.fundingVerifiedBy = 'L. Marsher';
      if (reason) app.fundingRejectionReason = reason;
      this.saveLocal();
      return true;
    }
    return false;
  }

  async submitBursaryApplication(data) {
    try {
      const res = await fetch(`${API_BASE}/bursaries`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(data)
      });
      if (res.ok) {
        const json = await res.json();
        return json.bursary;
      }
    } catch (e) {}

    const newApp = {
      id: `BUR-2027-${Math.floor(100 + Math.random() * 900)}`,
      studentName: data.fullName,
      studentNumber: data.studentNumber,
      institution: data.institution,
      submittedDate: new Date().toLocaleDateString('en-GB'),
      status: 'Under Review',
      fundingSource: data.fundingSource || 'NSFAS Top-Up Grant',
      documentsVerified: true
    };
    this.state.bursaryApplications.unshift(newApp);
    this.saveLocal();
    return newApp;
  }

  async addNotice(notice) {
    try {
      const res = await fetch(`${API_BASE}/notices`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(notice)
      });
      if (res.ok) {
        const json = await res.json();
        return json.notice;
      }
    } catch (e) {}

    const newNotice = {
      id: `notif_${Date.now()}`,
      severity: notice.severity || 'normal',
      icon: notice.severity === 'urgent' ? '🚨' : '📋',
      title: notice.title,
      body: notice.body,
      date: new Date().toLocaleDateString('en-GB'),
      author: 'L. Marsher (Admin)',
      residence: notice.residence || 'All Residences',
      smsDispatched: notice.severity === 'urgent'
    };
    this.state.notices.unshift(newNotice);
    this.saveLocal();
    return newNotice;
  }

  async addAmenityBooking(booking) {
    try {
      const res = await fetch(`${API_BASE}/amenities/book`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(booking)
      });
      if (res.ok) {
        const json = await res.json();
        return json.booking;
      }
    } catch (e) {}

    const newBooking = {
      id: `BK-${Math.floor(100 + Math.random() * 900)}`,
      ...booking,
      status: 'Confirmed'
    };
    this.state.amenityBookings.unshift(newBooking);
    this.saveLocal();
    return newBooking;
  }

  // ─── CORPORATE BANK INTEGRATION & RECONCILIATION ───
  async syncBankFeed() {
    try {
      const res = await fetch(`${API_BASE}/bank/sync`, {
        method: 'POST',
        headers: this.getAuthHeaders()
      });
      if (res.ok) {
        const json = await res.json();
        if (json.account) this.state.bankAccount = json.account;
        if (json.transaction) this.state.transactions.unshift(json.transaction);
        this.saveLocal();
        return json;
      }
    } catch (e) {}

    // Fallback local simulation
    const newTxn = {
      id: `TXN-SB-2027-${Math.floor(8920 + Math.random() * 80)}`,
      date: new Date().toISOString(),
      reference: 'GKAS-G34-DUBE',
      description: 'ELECTRONIC BANK TRANSFER - K DUBE',
      counterparty: 'K. Dube (Direct EFT)',
      amount: 3200.00,
      type: 'credit',
      category: 'Monthly Rental',
      status: 'Auto-Matched',
      matchedRoom: 'G-34 (GKAS)'
    };
    this.state.transactions.unshift(newTxn);
    this.state.bankAccount.currentBalance += 3200.00;
    this.state.bankAccount.availableBalance += 3200.00;
    this.saveLocal();
    return { transaction: newTxn };
  }

  async reconcileTransaction(txnId, matchedRoom, studentName) {
    try {
      const res = await fetch(`${API_BASE}/bank/reconcile`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ txnId, matchedRoom, studentName })
      });
      if (res.ok) {
        const json = await res.json();
        return json.transaction;
      }
    } catch (e) {}

    const txn = this.state.transactions.find(t => t.id === txnId);
    if (txn) {
      txn.status = 'Reconciled';
      txn.matchedRoom = matchedRoom;
      this.saveLocal();
      return txn;
    }
    return null;
  }

  async updateBankAccount(details) {
    try {
      const res = await fetch(`${API_BASE}/bank/connect`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(details)
      });
      if (res.ok) {
        const json = await res.json();
        if (json.account) {
          this.state.bankAccount = json.account;
          this.saveLocal();
          return json.account;
        }
      }
    } catch (e) {}

    this.state.bankAccount = { ...this.state.bankAccount, ...details };
    this.saveLocal();
    return this.state.bankAccount;
  }
}

export const stateService = new StateService();
