/* ═══════════════════════════════════════════════════════════
   NOTIFICATION BELL COMPONENT (JS MODULE)
   Badge counter, popover tray, mark as read, dismissal animation,
   and dynamic real-time student notification stream.
═══════════════════════════════════════════════════════════ */

import { notificationService } from '../services/notifications.js';

export function initNotificationBell() {
  const notifBtn = document.getElementById('notif-btn');
  const overlay = document.getElementById('notif-overlay');
  if (!notifBtn || !overlay) return;

  function updateBadge() {
    const unread = notificationService.getUnreadCount();
    let badge = notifBtn.querySelector('.badge-dot');
    
    if (unread > 0) {
      if (!badge) {
        badge = document.createElement('div');
        badge.className = 'badge-dot';
        notifBtn.appendChild(badge);
      }
      badge.textContent = unread > 9 ? '9+' : unread.toString();
      badge.style.display = 'flex';
      badge.style.alignItems = 'center';
      badge.style.justifyContent = 'center';
      badge.style.fontSize = '10px';
      badge.style.fontWeight = '700';
      badge.style.color = '#ffffff';
      badge.style.width = '18px';
      badge.style.height = '18px';
      badge.style.borderRadius = '50%';
      badge.style.background = 'var(--red)';
      badge.style.position = 'absolute';
      badge.style.top = '-2px';
      badge.style.right = '-2px';
    } else {
      if (badge) badge.style.display = 'none';
    }
  }

  function renderList() {
    const listEl = document.getElementById('notif-items-list');
    if (!listEl) return;

    const notifs = notificationService.getNotifications();
    const unreadCount = notificationService.getUnreadCount();

    // Update overlay header with unread count and "Mark all as read"
    const headerEl = overlay.querySelector('.notif-hd');
    if (headerEl) {
      headerEl.innerHTML = `
        <div>
          <div class="notif-ttl">Notifications (${unreadCount} unread)</div>
          <div style="font-size:11px;color:var(--text-sub)">HTS &amp; GKAS Student Residence Portal · 2027</div>
        </div>
        ${unreadCount > 0 ? `
          <button class="btn btn-ghost btn-xs" id="mark-all-read-btn">
            Mark all read
          </button>
        ` : ''}
      `;

      headerEl.querySelector('#mark-all-read-btn')?.addEventListener('click', () => {
        notificationService.markAllNotificationsAsRead();
        renderList();
        updateBadge();
      });
    }

    if (notifs.length === 0) {
      listEl.innerHTML = `
        <div style="text-align:center;padding:32px 16px;color:var(--text-muted)">
          <div style="font-size:32px;margin-bottom:8px">🔔</div>
          <div style="font-weight:600">No notifications</div>
          <div style="font-size:12px">You're completely up to date.</div>
        </div>
      `;
      return;
    }

    listEl.innerHTML = notifs.map(n => `
      <div class="notif-item ${n.is_read ? 'read' : 'unread'}" 
           id="notif-card-${n.id}"
           onclick="window.handleNotificationItemClick('${n.id}', '${n.link_url || ''}')"
           style="cursor:pointer;padding:12px 14px;border-bottom:1px solid var(--border);background:${n.is_read ? 'transparent' : '#f8fafc'};display:flex;gap:12px;align-items:flex-start;transition:all 0.2s ease">
        
        <div style="width:10px;height:10px;border-radius:50%;margin-top:4px;flex-shrink:0;background:${
          !n.is_read ? 'var(--blue)' : 'transparent'
        }"></div>

        <div style="flex:1">
          <div style="font-size:13px;font-weight:${n.is_read ? '500' : '700'};color:var(--navy)">
            ${n.title}
          </div>
          <div style="font-size:12px;color:var(--text-sub);margin:2px 0 4px;line-height:1.4">
            ${n.message}
          </div>
          <div style="font-size:10px;color:var(--text-muted);display:flex;justify-content:space-between">
            <span>${new Date(n.created_at).toLocaleDateString('en-ZA', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
            ${!n.is_read ? `<span style="color:var(--blue);font-weight:600">Click to read →</span>` : ''}
          </div>
        </div>
      </div>
    `).join('');
  }

  window.handleNotificationItemClick = (id, linkUrl) => {
    notificationService.markNotificationAsRead(id);
    const card = document.getElementById(`notif-card-${id}`);
    if (card) {
      card.style.opacity = '0.5';
      card.style.background = 'transparent';
    }
    updateBadge();
    renderList();

    if (linkUrl) {
      if (linkUrl.includes('/lease')) {
        stateService.setActiveModule('my-lease');
      } else if (linkUrl.includes('/movein')) {
        stateService.setActiveModule('movein');
      } else if (linkUrl.includes('/bursary')) {
        stateService.setActiveModule('bursary');
      } else if (linkUrl.includes('/maintenance')) {
        stateService.setActiveModule('maintenance');
      } else if (linkUrl.includes('/applications')) {
        stateService.setActiveModule('applications');
      } else if (linkUrl.includes('/dashboard')) {
        const { currentRole } = stateService.state;
        stateService.setActiveModule(currentRole === 'student' ? 'student-home' : 'dashboard');
      }
      overlay.classList.remove('open');
    }
  };

  notificationService.subscribe(() => {
    updateBadge();
    renderList();
  });

  updateBadge();
  renderList();
}
