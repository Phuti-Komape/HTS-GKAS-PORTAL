/* ═══════════════════════════════════════════════════════════
   SIDEBAR COMPONENT
   Strictly two roles: Administrator (L. Marsher) and Student
═══════════════════════════════════════════════════════════ */

import { stateService } from '../services/state.js';

const NAV_CONFIG = {
  admin: [
    {
      section: 'Overview',
      items: [
        { id: 'dashboard', label: 'Executive Dashboard', icon: 'grid', badge: null },
        { id: 'applications', label: 'Housing Applications', icon: 'clock', badgeKey: 'applicants' },
        { id: 'occupancy', label: 'Residents & Beds', icon: 'users', badge: null }
      ]
    },
    {
      section: 'Leasing & Inspections',
      items: [
        { id: 'leases', label: 'Leases & Legal Docs', icon: 'file', badge: null },
        { id: 'movein', label: 'Move-In Inspections', icon: 'check', badge: '2' }
      ]
    },
    {
      section: 'Residence Operations',
      items: [
        { id: 'maintenance', label: 'Maintenance Queue', icon: 'tool', badgeKey: 'openTickets' },
        { id: 'activity', label: 'Residence Activity Hub', icon: 'star', badge: null },
        { id: 'rules', label: 'Disciplinary Code', icon: 'book', badge: null },
        { id: 'news', label: 'Broadcast Notices', icon: 'bell', badge: null }
      ]
    },
    {
      section: 'Banking & Financials',
      items: [
        { id: 'finance', label: 'Bank Reconciliation', icon: 'bar', badge: null },
        { id: 'bursary', label: 'Bursary Approvals', icon: 'bursary', badge: null }
      ]
    },
    {
      section: 'System & Security',
      items: [
        { id: 'audit', label: 'Cryptographic Audit Log', icon: 'audit', badge: null },
        { id: 'settings', label: 'Portal Configuration', icon: 'settings', badge: null }
      ]
    }
  ],
  student: [
    {
      section: 'My Residence Account',
      items: [
        { id: 'student-home', label: 'My Dashboard', icon: 'grid', badge: null },
        { id: 'my-lease', label: 'My Lease Agreement', icon: 'file', badge: null }
      ]
    },
    {
      section: 'Services & Requests',
      items: [
        { id: 'maintenance', label: 'Maintenance Request', icon: 'tool', badge: null },
        { id: 'activity', label: 'Activity Booking', icon: 'star', badge: null },
        { id: 'bursary', label: 'Bursary Application', icon: 'bursary', badge: null }
      ]
    },
    {
      section: 'Residence Info',
      items: [
        { id: 'rules', label: 'House Rules', icon: 'book', badge: null },
        { id: 'news', label: 'Residence Notices', icon: 'bell', badge: '2' },
        { id: 'my-docs', label: 'My Documents', icon: 'docs', badge: null }
      ]
    }
  ]
};

const ICONS = {
  grid: `<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>`,
  users: `<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>`,
  clock: `<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>`,
  file: `<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>`,
  tool: `<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>`,
  check: `<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>`,
  book: `<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>`,
  bell: `<path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>`,
  bar: `<line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>`,
  star: `<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>`,
  bursary: `<circle cx="12" cy="8" r="6"/><path d="M12 2v12M8 6h8M8 10h8"/>`,
  audit: `<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><circle cx="10" cy="13" r="2"/><path d="m20 17-1.09-1.09A2 2 0 0 0 17 15h-1.73l-1.45 1.45"/>`,
  settings: `<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-2.82 1.17V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>`,
  docs: `<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/>`
};

export function renderSidebar() {
  const { currentUser, currentRole, activeModule, tickets, applicants } = stateService.state;

  // Update role badge in sidebar
  const roleNameEl = document.getElementById('sb-role-name');
  const roleLblEl = document.getElementById('sb-role-lbl');
  const avEl = document.getElementById('sb-av');
  const unameEl = document.getElementById('sb-uname');
  const uroleEl = document.getElementById('sb-urole');

  const displayName = currentRole === 'admin' ? 'L. Marsher' : (currentUser?.name || 'Resident');
  const displayRole = currentRole === 'admin' ? 'Administrator' : 'Student Resident';
  const displayInitials = currentRole === 'admin' ? 'LM' : (currentUser?.initials || 'SR');

  if (roleNameEl) roleNameEl.textContent = displayName;
  if (roleLblEl) roleLblEl.textContent = displayRole;
  if (avEl) avEl.textContent = displayInitials;
  if (unameEl) unameEl.textContent = displayName;
  if (uroleEl) uroleEl.textContent = displayRole;

  const navContainer = document.getElementById('sidebar-nav');
  if (!navContainer) return;

  let sections = NAV_CONFIG[currentRole] || NAV_CONFIG.student;
  if (currentRole === 'student') {
    const hasRoom = Boolean(currentUser && currentUser.room && currentUser.room !== 'Unassigned' && currentUser.room !== '');
    sections = [
      {
        section: 'My Residence Account',
        items: [
          { id: 'student-home', label: 'My Dashboard', icon: 'grid', badge: null },
          { id: 'my-lease', label: 'My Lease Agreement', icon: 'file', badge: null },
          ...(hasRoom ? [{ id: 'movein', label: 'Move-In Inspection', icon: 'check', badge: null }] : [])
        ]
      },
      ...NAV_CONFIG.student.slice(1)
    ];
  }
  navContainer.innerHTML = '';

  const pendingAppsCount = applicants.filter(a => !a.processed).length;
  const openTicketsCount = tickets.filter(t => t.status === 'open').length;

  sections.forEach(sec => {
    const secDiv = document.createElement('div');
    secDiv.className = 'nav-section';
    secDiv.innerHTML = `<div class="nav-lbl">${sec.section}</div>`;

    sec.items.forEach(item => {
      let badge = item.badge;
      if (item.badgeKey === 'applicants' && pendingAppsCount > 0) badge = String(pendingAppsCount);
      if (item.badgeKey === 'openTickets' && openTicketsCount > 0) badge = String(openTicketsCount);

      const isActive = activeModule === item.id;
      const btn = document.createElement('button');
      btn.className = `nav-item ${isActive ? 'active' : ''}`;
      btn.id = `nav-${item.id}`;
      btn.setAttribute('aria-current', isActive ? 'page' : 'false');
      btn.onclick = () => {
        stateService.setActiveModule(item.id);
        closeMobileDrawer();
      };

      btn.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          ${ICONS[item.icon] || ICONS.grid}
        </svg>
        <span class="nav-item-text">${item.label}</span>
        ${badge ? `<span class="nav-badge" aria-label="${badge} items">${badge}</span>` : ''}
      `;
      secDiv.appendChild(btn);
    });

    navContainer.appendChild(secDiv);
  });
}

export function toggleSidebarCollapsed() {
  const sb = document.getElementById('sidebar');
  const tog = document.getElementById('sb-toggle');
  if (!sb) return;

  const isCollapsed = sb.classList.toggle('collapsed');
  if (tog) {
    tog.setAttribute('aria-expanded', isCollapsed ? 'false' : 'true');
    tog.setAttribute('aria-label', isCollapsed ? 'Expand navigation' : 'Collapse navigation');
  }
}

export function openMobileDrawer() {
  const sb = document.getElementById('sidebar');
  const bd = document.getElementById('drawer-backdrop');
  if (sb && bd) {
    sb.classList.add('mobile-open');
    bd.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
}

export function closeMobileDrawer() {
  const sb = document.getElementById('sidebar');
  const bd = document.getElementById('drawer-backdrop');
  if (sb && bd) {
    sb.classList.remove('mobile-open');
    bd.classList.remove('open');
    document.body.style.overflow = '';
  }
}
