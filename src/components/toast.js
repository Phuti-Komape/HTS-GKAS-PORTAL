/* ═══════════════════════════════════════════════════════════
   TOAST NOTIFICATION SERVICE
═══════════════════════════════════════════════════════════ */

let toastTimeout = null;

export function showToast(icon, message, type = 'info', duration = 4200) {
  const toast = document.getElementById('toast');
  const iconEl = document.getElementById('toast-icon');
  const msgEl = document.getElementById('toast-msg');

  if (!toast || !iconEl || !msgEl) return;

  iconEl.textContent = icon || (type === 'success' ? '✓' : type === 'error' ? '⚠' : 'ℹ');
  msgEl.textContent = message;

  toast.className = `toast ${type} show`;

  // Announce to screen readers
  const live = document.getElementById('live-region');
  if (live) {
    live.textContent = '';
    setTimeout(() => { live.textContent = message; }, 40);
  }

  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    closeToast();
  }, duration);
}

export function closeToast() {
  const toast = document.getElementById('toast');
  if (toast) {
    toast.classList.remove('show');
  }
}
