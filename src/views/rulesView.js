/* ═══════════════════════════════════════════════════════════
   RULES & DISCIPLINE VIEW
   Residence Code of Conduct, House Rules, Disciplinary Records
═══════════════════════════════════════════════════════════ */

import { stateService } from '../services/state.js';
import { HOUSE_RULES } from '../data/initialData.js';
import { showToast } from '../components/toast.js';
import { openModal, closeModal } from '../components/modal.js';

export function renderRulesView(container) {
  const { currentRole } = stateService.state;

  container.innerHTML = `
    <div class="section-hd">
      <div>
        <div class="section-title">Rules &amp; Disciplinary Code</div>
        <div class="section-sub">Version 4.1 · Applicable to all residents across GKAS and HTS complexes</div>
      </div>
      ${currentRole !== 'student' ? `
        <button class="btn btn-danger btn-sm" onclick="window.openIssueWarningModal()">+ Issue Disciplinary Warning</button>
      ` : ''}
    </div>

    <!-- House Rules Cards -->
    <div class="card" style="margin-bottom:20px">
      <div class="card-title">Residence Living Standards &amp; Bylaws</div>
      <div style="display:flex;flex-direction:column;gap:14px">
        ${HOUSE_RULES.map((r, i) => `
          <div style="display:flex;gap:14px;align-items:flex-start;padding-bottom:12px;border-bottom:1px solid var(--border-subtle)">
            <div style="width:28px;height:28px;border-radius:var(--radius-sm);background:var(--bg-muted);display:flex;align-items:center;justify-content:center;font-weight:700;font-size:12px;color:var(--navy);flex-shrink:0">
              ${i + 1}
            </div>
            <div>
              <div style="font-weight:700;font-size:13px;color:var(--navy);margin-bottom:2px">${r.cat}</div>
              <div style="font-size:13px;color:var(--text-muted);line-height:1.55">${r.text}</div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>

    <!-- Disciplinary Case Log (Staff view or student's own records) -->
    <div class="card">
      <div class="card-title">
        <span>Formal Disciplinary Log</span>
        <span class="pill pill-navy">Dispute Appeal Window: 7 Business Days</span>
      </div>

      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Resident</th>
              <th>Room</th>
              <th>Allegation / Incident</th>
              <th>Date</th>
              <th>Level</th>
              <th>Issued By</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="td-bold">Lwazi Motha</td>
              <td>G-05</td>
              <td>Amplified sound disturbance after 22:00</td>
              <td>08 Apr 2026</td>
              <td><span class="pill pill-amber">Warning 1 (Verbal)</span></td>
              <td>S. Motha (Warden)</td>
            </tr>
            <tr>
              <td class="td-bold">B. Sithole</td>
              <td>G-78</td>
              <td>Unregistered overnight guest exceeding 48h limit</td>
              <td>28 Mar 2026</td>
              <td><span class="pill pill-red">Warning 2 (Written)</span></td>
              <td>K. Mokoena (Admin)</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `;
}

window.openIssueWarningModal = function() {
  openModal('Log Disciplinary Warning', `
    <div class="f-group">
      <label class="f-label" for="warn-student">Resident</label>
      <select class="f-input f-select" id="warn-student">
        <option>Lwazi Motha (Room G-05)</option>
        <option>Sibusiso Dlamini (Room H-07)</option>
      </select>
    </div>

    <div class="f-row">
      <div class="f-group">
        <label class="f-label" for="warn-cat">Violation Category</label>
        <select class="f-input f-select" id="warn-cat">
          <option>Quiet Hours Infringement</option>
          <option>Unregistered Overnight Visitor</option>
          <option>Cleanliness / Communal Area Misuse</option>
          <option>Substance / Smoking Violation</option>
        </select>
      </div>
      <div class="f-group">
        <label class="f-label" for="warn-lvl">Warning Stage</label>
        <select class="f-input f-select" id="warn-lvl">
          <option>Warning 1 — Formal Verbal</option>
          <option>Warning 2 — First Written</option>
          <option>Warning 3 — Final Notice</option>
        </select>
      </div>
    </div>

    <div class="f-group">
      <label class="f-label" for="warn-notes">Incident Summary &amp; Evidence</label>
      <textarea class="f-input" id="warn-notes" placeholder="Summarize incident details and student response..."></textarea>
    </div>

    <div style="display:flex;gap:10px;justify-content:flex-end">
      <button class="btn btn-ghost" onclick="window.closeModal()">Cancel</button>
      <button class="btn btn-danger" onclick="window.confirmIssueWarning()">Log Warning &amp; Notify Student</button>
    </div>
  `);
};

window.confirmIssueWarning = function() {
  closeModal();
  showToast('⚠', 'Disciplinary warning recorded in student record and dispatched via registered email.', 'info');
};
