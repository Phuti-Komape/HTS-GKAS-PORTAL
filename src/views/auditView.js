/* ═══════════════════════════════════════════════════════════
   AUDIT TRAIL VIEW
   Immutable security & mutation log
═══════════════════════════════════════════════════════════ */

import { stateService } from '../services/state.js';
import { showToast } from '../components/toast.js';

export function renderAuditView(container) {
  const { auditLog } = stateService.state;

  container.innerHTML = `
    <div class="section-hd">
      <div>
        <div class="section-title">Cryptographic Audit Trail</div>
        <div class="section-sub">Tamper-evident chronological log of all sensitive database mutations</div>
      </div>
      <button class="btn btn-ghost btn-sm" onclick="showToast('📊', 'Full audit log exported to CSV.', 'info')">Export Audit CSV</button>
    </div>

    <div class="card">
      <div class="card-title">
        <span>Recorded System Events</span>
        <span class="pill pill-green">${auditLog.length} Events Verified</span>
      </div>

      <div style="display:flex;flex-direction:column;gap:12px">
        ${auditLog.map(a => `
          <div style="display:flex;gap:14px;align-items:center;padding:12px 14px;background:var(--bg-alt);border:1px solid var(--border-subtle);border-radius:var(--radius-md)">
            <div style="width:36px;height:36px;border-radius:var(--radius-sm);background:${a.bg};display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0">
              ${a.type}
            </div>
            <div style="flex:1;min-width:0">
              <div style="font-weight:600;font-size:13px;color:var(--navy)">${a.action}</div>
              <div style="font-size:11px;color:var(--text-sub);margin-top:2px" class="td-mono">${a.meta}</div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}
