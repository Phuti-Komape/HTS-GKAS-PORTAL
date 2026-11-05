/* ═══════════════════════════════════════════════════════════
   TOPBAR COMPONENT
   Universal search, live database status, and notifications
   (Role-switch bar REMOVED per user request)
═══════════════════════════════════════════════════════════ */

import { stateService } from '../services/state.js';
import { initNotificationBell } from './NotificationBell.js';
import { pwaService } from '../services/pwa.js';

export const MODULE_NAMES = {
  dashboard: 'Executive Residence Dashboard',
  'student-home': 'Student Residence Portal',
  applications: 'Applications & Waiting List',
  occupancy: 'Residents & Room Allocation',
  leases: 'Leases & Legal Agreements',
  movein: 'Move-In Condition Inspections',
  maintenance: 'Maintenance Operations',
  activity: 'Residence Activity Hub',
  rules: 'House Rules & Disciplinary Code',
  news: 'Notices & Announcements',
  finance: 'Bank Feed & Transaction Reconciliation',
  bursary: 'Bursary & Accreditation Portal',
  audit: 'Immutable Audit Trail',
  settings: 'System Configuration',
  'my-lease': 'My Residential Lease',
  'my-docs': 'My Stored Documents',
  privacy: 'Privacy Policy (POPIA)',
  terms: 'Terms of Residence',
  cookies: 'Cookie Policy'
};

export function renderTopbar() {
  const { currentRole, activeModule, notices } = stateService.state;

  // Update Breadcrumb & Page Title
  const breadcrumbEl = document.getElementById('breadcrumb');
  const titleEl = document.getElementById('page-title');
  const title = MODULE_NAMES[activeModule] || 'Portal';

  if (breadcrumbEl) breadcrumbEl.textContent = `HTS & GKAS Portal / ${title}`;
  if (titleEl) titleEl.textContent = title;
  document.title = `${title} — HTS & GKAS Student Residences`;

  // Role Switcher REMOVED! Instead show live real-time connection badge
  const switcherContainer = document.getElementById('role-quick-switch-container');
  if (switcherContainer) {
    const isLive = stateService.isRealtimeConnected;
    switcherContainer.innerHTML = `
      <div style="display:flex;align-items:center;gap:8px;background:var(--bg-alt);border:1px solid var(--border);border-radius:var(--radius-full);padding:6px 14px">
        <span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${isLive ? 'var(--green)' : 'var(--gold)'};box-shadow:0 0 8px ${isLive ? 'var(--green)' : 'var(--gold)'}"></span>
        <span style="font-size:11px;font-weight:700;color:var(--navy);letter-spacing:0.4px">
          ${isLive ? 'Live Real-Time Database Connected' : 'Persistent Storage Active'}
        </span>
      </div>
    `;
  }

  // Update PWA Install button visibility
  const installBtn = document.getElementById('pwa-install-btn');
  if (installBtn) {
    installBtn.style.display = pwaService.isInstalled ? 'none' : 'inline-flex';
  }

  // Initialize interactive notification tray with read / dismiss capability
  try {
    initNotificationBell();
  } catch (e) {}
}

pwaService.subscribe(({ isInstalled }) => {
  const btn = document.getElementById('pwa-install-btn');
  if (btn) btn.style.display = isInstalled ? 'none' : 'inline-flex';
});

export function toggleNotifications() {
  const overlay = document.getElementById('notif-overlay');
  if (overlay) {
    overlay.classList.toggle('open');
  }
}
