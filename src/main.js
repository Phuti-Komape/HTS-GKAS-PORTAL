/* ═══════════════════════════════════════════════════════════
   APPLICATION ENTRY POINT (MAIN.JS)
   Orchestrates state, routing, role-switching, and views
═══════════════════════════════════════════════════════════ */

import './styles/reset.css';
import './styles/main.css';
import './styles/nsfas-auth.css';

import { stateService } from './services/state.js';
import { renderSidebar, toggleSidebarCollapsed, openMobileDrawer, closeMobileDrawer } from './components/sidebar.js';
import { renderTopbar, toggleNotifications } from './components/topbar.js';
import { setupModalListeners, closeModal } from './components/modal.js';
import { showToast, closeToast } from './components/toast.js';

// Views
import { renderAuthPage } from './views/authView.js';
import { renderDashboardView } from './views/dashboardView.js';
import { renderMaintenanceView } from './views/maintenanceView.js';
import { renderActivityView } from './views/activityView.js';
import { renderBursaryView } from './views/bursaryView.js';
import { renderOccupancyView } from './views/occupancyView.js';
import { renderLeasesView } from './views/leasesView.js';
import { renderRulesView } from './views/rulesView.js';
import { renderNewsView } from './views/newsView.js';
import { renderFinanceView } from './views/financeView.js';
import { renderAuditView } from './views/auditView.js';
import { renderSettingsView } from './views/settingsView.js';
import { renderApplicationsView } from './views/applicationsView.js';
import { renderMoveinView } from './views/moveinView.js';
import { renderDocsView } from './views/docsView.js';
import './views/legalViews.js';

import { pwaService } from './services/pwa.js';

// Expose global utilities
window.showToast = showToast;
window.closeToast = closeToast;
window.closeModal = closeModal;
window.toggleSidebar = toggleSidebarCollapsed;
window.openMobileMenu = openMobileDrawer;
window.closeMobileMenu = closeMobileDrawer;
window.toggleNotif = toggleNotifications;
window.pwaService = pwaService;
window.installPwa = () => pwaService.promptInstall();


window.doLogout = function() {
  document.getElementById('app')?.classList.add('hidden');
  document.getElementById('login-page')?.classList.remove('hidden');
  renderAuthPage();
  showToast('👋', 'Signed out of residence portal session.', 'info');
};

window.handleNotifClick = function(id) {
  toggleNotifications();
  stateService.setActiveModule('news');
};

// Route and render view
function renderCurrentModule() {
  const content = document.getElementById('main-content');
  if (!content) return;

  renderSidebar();
  renderTopbar();

  const { activeModule, currentRole } = stateService.state;

  content.innerHTML = '';
  content.scrollTop = 0;

  switch (activeModule) {
    case 'dashboard':
    case 'student-home':
      renderDashboardView(content);
      break;
    case 'maintenance':
      renderMaintenanceView(content);
      break;
    case 'activity':
      renderActivityView(content);
      break;
    case 'bursary':
      renderBursaryView(content);
      break;
    case 'occupancy':
      renderOccupancyView(content);
      break;
    case 'leases':
    case 'my-lease':
      renderLeasesView(content);
      break;
    case 'rules':
      renderRulesView(content);
      break;
    case 'news':
      renderNewsView(content);
      break;
    case 'finance':
      renderFinanceView(content);
      break;
    case 'audit':
      renderAuditView(content);
      break;
    case 'settings':
      renderSettingsView(content);
      break;
    case 'applications':
      renderApplicationsView(content);
      break;
    case 'movein':
      renderMoveinView(content);
      break;
    case 'my-docs':
      renderDocsView(content);
      break;
    default:
      if (currentRole === 'student') {
        renderDashboardView(content);
      } else {
        renderDashboardView(content);
      }
      break;
  }
}

// PWA & Deep-link Hash Routing Handler
function handleHashRoute() {
  const hash = window.location.hash;
  if (!hash) return;
  const cleanHash = hash.replace(/^#\/?/, '').toLowerCase();

  if (cleanHash === 'register') {
    document.getElementById('app')?.classList.add('hidden');
    document.getElementById('login-page')?.classList.remove('hidden');
    if (typeof window.setAuthMode === 'function') {
      window.setAuthMode('register');
    }
  } else if (cleanHash === 'maintenance') {
    document.getElementById('login-page')?.classList.add('hidden');
    document.getElementById('app')?.classList.remove('hidden');
    stateService.setActiveModule('maintenance');
  } else if (cleanHash === 'lease' || cleanHash === 'my-lease') {
    document.getElementById('login-page')?.classList.add('hidden');
    document.getElementById('app')?.classList.remove('hidden');
    const { currentRole } = stateService.state;
    stateService.setActiveModule(currentRole === 'student' ? 'my-lease' : 'leases');
  } else if (cleanHash === 'dashboard' || cleanHash === 'student-home') {
    document.getElementById('login-page')?.classList.add('hidden');
    document.getElementById('app')?.classList.remove('hidden');
    const { currentRole } = stateService.state;
    stateService.setActiveModule(currentRole === 'student' ? 'student-home' : 'dashboard');
  }
}

// Initial Boot
function boot() {
  pwaService.init();
  setupModalListeners();
  stateService.subscribe(() => {
    renderCurrentModule();
  });

  // Render Login & Registration page initially
  renderAuthPage();

  // Pre-render app module
  renderCurrentModule();

  // Handle initial hash and listen for subsequent route changes
  handleHashRoute();
  window.addEventListener('hashchange', handleHashRoute);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}
