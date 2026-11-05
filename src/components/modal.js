/* ═══════════════════════════════════════════════════════════
   ACCESSIBLE MODAL COMPONENT
═══════════════════════════════════════════════════════════ */

export function openModal(title, bodyHtml, isWide = false) {
  const overlay = document.getElementById('modal-overlay');
  const modal = document.getElementById('modal');
  const titleEl = document.getElementById('modal-ttl');
  const bodyEl = document.getElementById('modal-body');

  if (!overlay || !modal || !titleEl || !bodyEl) return;

  titleEl.textContent = title;
  bodyEl.innerHTML = bodyHtml;

  if (isWide) {
    modal.style.maxWidth = '720px';
  } else {
    modal.style.maxWidth = '560px';
  }

  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';

  // Trap focus to first focusable element
  setTimeout(() => {
    const focusable = modal.querySelector('button:not(.modal-close), input, select, textarea, a');
    if (focusable) {
      focusable.focus();
    } else {
      modal.querySelector('.modal-close')?.focus();
    }
  }, 60);
}

export function closeModal() {
  const overlay = document.getElementById('modal-overlay');
  if (overlay) {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }
}

// Global modal escape and backdrop dismiss
export function setupModalListeners() {
  const overlay = document.getElementById('modal-overlay');
  if (overlay) {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        closeModal();
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModal();
      const notif = document.getElementById('notif-overlay');
      if (notif?.classList.contains('open')) {
        notif.classList.remove('open');
      }
    }
  });
}
