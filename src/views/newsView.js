/* ═══════════════════════════════════════════════════════════
   NOTICES & ANNOUNCEMENTS VIEW
   Emergency broadcasts, municipal alerts, academic quiet hours
═══════════════════════════════════════════════════════════ */

import { stateService } from '../services/state.js';
import { showToast } from '../components/toast.js';
import { openModal, closeModal } from '../components/modal.js';

export function renderNewsView(container) {
  const { currentRole, notices } = stateService.state;

  container.innerHTML = `
    <div class="section-hd">
      <div>
        <div class="section-title">Notices &amp; Announcements</div>
        <div class="section-sub">Official residence communications and emergency municipal advisories</div>
      </div>
      ${currentRole !== 'student' ? `
        <button class="btn btn-primary btn-sm" onclick="window.openPostNoticeModal()">+ Broadcast Announcement</button>
      ` : ''}
    </div>

    <!-- Notices List -->
    <div style="display:flex;flex-direction:column;gap:14px">
      ${notices.map(n => `
        <div class="card" style="margin-bottom:0;border-left:5px solid ${n.severity === 'urgent' ? 'var(--red)' : n.severity === 'info' ? 'var(--blue)' : 'var(--navy)'}">
          <div style="display:flex;align-items:flex-start;gap:14px">
            <span style="font-size:26px;flex-shrink:0">${n.icon}</span>
            <div style="flex:1;min-width:0">
              <div style="display:flex;align-items:center;gap:10px;margin-bottom:6px;flex-wrap:wrap">
                <h3 style="font-size:15px;font-weight:700;color:var(--navy)">${n.title}</h3>
                ${n.severity === 'urgent' ? '<span class="pill pill-red">URGENT SMS DISPATCHED</span>' : ''}
                <span class="pill pill-gray">${n.residence}</span>
              </div>
              <p style="font-size:13px;color:var(--text-muted);line-height:1.6;margin-bottom:8px">${n.body}</p>
              <div style="font-size:11px;color:var(--text-sub)">Posted on ${n.date} · ${n.author}</div>
            </div>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

window.openPostNoticeModal = function() {
  openModal('Broadcast Residence Notice', `
    <div class="f-group">
      <label class="f-label" for="nt-title">Notice Headline <span class="f-required">*</span></label>
      <input class="f-input" id="nt-title" placeholder="e.g. Generator Maintenance Schedule" required>
    </div>

    <div class="f-row">
      <div class="f-group">
        <label class="f-label" for="nt-res">Target Residence</label>
        <select class="f-input f-select" id="nt-res">
          <option>All Residences (GKAS &amp; HTS)</option>
          <option>GKAS Residence (Sonheuwel)</option>
          <option>HTS Residence (Stonehenge)</option>
        </select>
      </div>
      <div class="f-group">
        <label class="f-label" for="nt-sev">Priority Level</label>
        <select class="f-input f-select" id="nt-sev">
          <option value="normal">Standard Notice</option>
          <option value="urgent">Urgent Advisory (Triggers SMS Push)</option>
          <option value="info">Informational Bulletin</option>
        </select>
      </div>
    </div>

    <div class="f-group">
      <label class="f-label" for="nt-body">Notice Body <span class="f-required">*</span></label>
      <textarea class="f-input" id="nt-body" placeholder="Write full details..." rows="4" required></textarea>
    </div>

    <div style="display:flex;gap:10px;justify-content:flex-end">
      <button class="btn btn-ghost" onclick="window.closeModal()">Cancel</button>
      <button class="btn btn-primary" onclick="window.confirmPostNotice()">Broadcast to Students</button>
    </div>
  `);
};

window.confirmPostNotice = function() {
  const title = document.getElementById('nt-title')?.value.trim();
  const res = document.getElementById('nt-res')?.value;
  const sev = document.getElementById('nt-sev')?.value;
  const body = document.getElementById('nt-body')?.value.trim();

  if (!title || !body) {
    showToast('⚠', 'Title and body are required.', 'error');
    return;
  }

  stateService.addNotice({
    title,
    residence: res,
    severity: sev,
    body
  });

  closeModal();
  showToast('📣', 'Notice published and notified to all resident inboxes.', 'success');
  const content = document.getElementById('main-content');
  if (content) renderNewsView(content);
};
